#!/usr/bin/env node

/**
 * Script para sincronizar imágenes y videos desde Supabase Storage
 * al disco local de Render
 * 
 * Ejecutar: node scripts/sync-from-supabase.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno no configuradas');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'OK' : 'FALTA');
  console.log('SUPABASE_SERVICE_KEY:', supabaseKey ? 'OK' : 'FALTA');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Directorios de destino
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const DIRECTORIES = {
  images: path.join(PUBLIC_DIR, 'uploads', 'images'),
  videos: path.join(PUBLIC_DIR, 'uploads', 'videos'),
  carousel: path.join(PUBLIC_DIR, 'uploads', 'carousel')
};

/**
 * Crear directorios si no existen
 */
function ensureDirectories() {
  Object.values(DIRECTORIES).forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Directorio creado: ${dir}`);
    }
  });
}

/**
 * Descargar archivo desde URL
 */
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve();
      });

      file.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

/**
 * Sincronizar archivos de un bucket
 */
async function syncBucket(bucketName, destDir) {
  try {
    console.log(`\n📦 Sincronizando bucket: ${bucketName}`);
    console.log('='.repeat(60));

    const { data: files, error } = await supabase
      .storage
      .from(bucketName)
      .list('', {
        limit: 1000,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.error(`❌ Error listando archivos de ${bucketName}:`, error);
      return { success: 0, errors: 0 };
    }

    if (!files || files.length === 0) {
      console.log(`⚠️ No hay archivos en el bucket ${bucketName}`);
      return { success: 0, errors: 0 };
    }

    console.log(`📋 ${files.length} archivos encontrados\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const file of files) {
      try {
        // Obtener URL pública
        const { data: urlData } = supabase
          .storage
          .from(bucketName)
          .getPublicUrl(file.name);

        if (!urlData || !urlData.publicUrl) {
          console.error(`❌ No se pudo obtener URL pública para: ${file.name}`);
          errorCount++;
          continue;
        }

        const destPath = path.join(destDir, file.name);

        // Verificar si el archivo ya existe
        if (fs.existsSync(destPath)) {
          const stats = fs.statSync(destPath);
          if (stats.size === file.metadata?.size) {
            console.log(`⏭️  Ya existe: ${file.name} (${(stats.size / 1024).toFixed(1)} KB)`);
            successCount++;
            continue;
          }
        }

        // Descargar archivo
        console.log(`⬇️  Descargando: ${file.name}...`);
        await downloadFile(urlData.publicUrl, destPath);
        
        const stats = fs.statSync(destPath);
        console.log(`✅ Guardado: ${file.name} (${(stats.size / 1024).toFixed(1)} KB)`);
        successCount++;

      } catch (err) {
        console.error(`❌ Error descargando ${file.name}:`, err.message);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Exitosos: ${successCount}`);
    console.log(`❌ Errores: ${errorCount}`);

    return { success: successCount, errors: errorCount };

  } catch (error) {
    console.error(`❌ Error en syncBucket(${bucketName}):`, error);
    return { success: 0, errors: 1 };
  }
}

/**
 * Función principal
 */
async function main() {
  console.log('\n🚀 SINCRONIZACIÓN DE ARCHIVOS DESDE SUPABASE');
  console.log('='.repeat(60));
  console.log(`📍 Directorio público: ${PUBLIC_DIR}\n`);

  // Crear directorios
  ensureDirectories();

  // Sincronizar bucket de imágenes (root)
  const results = {};
  results['imagenes (root)'] = await syncBucket('imagenes', DIRECTORIES.images);

  // Sincronizar subcarpeta carousel dentro del bucket 'imagenes'
  console.log('\n📦 Sincronizando imágenes de carousel...');
  console.log('='.repeat(60));
  
  const { data: carouselFiles, error: carouselError } = await supabase
    .storage
    .from('imagenes')
    .list('carousel', { limit: 1000 });

  if (!carouselError && carouselFiles && carouselFiles.length > 0) {
    console.log(`📋 ${carouselFiles.length} archivos encontrados en carousel\n`);
    
    let successCount = 0;
    let errorCount = 0;

    for (const file of carouselFiles) {
      try {
        const { data: urlData } = supabase
          .storage
          .from('imagenes')
          .getPublicUrl(`carousel/${file.name}`);

        const destPath = path.join(DIRECTORIES.carousel, file.name);

        if (fs.existsSync(destPath)) {
          const stats = fs.statSync(destPath);
          console.log(`⏭️  Ya existe: ${file.name} (${(stats.size / 1024).toFixed(1)} KB)`);
          successCount++;
          continue;
        }

        console.log(`⬇️  Descargando: carousel/${file.name}...`);
        await downloadFile(urlData.publicUrl, destPath);
        
        const stats = fs.statSync(destPath);
        console.log(`✅ Guardado: ${file.name} (${(stats.size / 1024).toFixed(1)} KB)`);
        successCount++;

      } catch (err) {
        console.error(`❌ Error descargando carousel/${file.name}:`, err.message);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Exitosos: ${successCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    
    results['imagenes/carousel'] = { success: successCount, errors: errorCount };
  } else if (carouselError) {
    console.error('❌ Error listando archivos de carousel:', carouselError);
    results['imagenes/carousel'] = { success: 0, errors: 1 };
  } else {
    console.log('⚠️ No hay archivos en carousel');
    results['imagenes/carousel'] = { success: 0, errors: 0 };
  }

  // Resumen final
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN FINAL');
  console.log('='.repeat(60));
  
  let totalSuccess = 0;
  let totalErrors = 0;

  Object.entries(results).forEach(([bucket, result]) => {
    console.log(`${bucket.padEnd(15)}: ✅ ${result.success} | ❌ ${result.errors}`);
    totalSuccess += result.success;
    totalErrors += result.errors;
  });

  console.log('='.repeat(60));
  console.log(`TOTAL: ✅ ${totalSuccess} archivos | ❌ ${totalErrors} errores\n`);

  if (totalErrors === 0) {
    console.log('🎉 ¡Sincronización completada exitosamente!');
  } else {
    console.log('⚠️  Sincronización completada con algunos errores');
  }
}

// Ejecutar
main().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
