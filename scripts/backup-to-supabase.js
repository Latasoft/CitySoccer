#!/usr/bin/env node

/**
 * Script para hacer backup de archivos locales a Supabase Storage
 * 
 * Ejecutar: node scripts/backup-to-supabase.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
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
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Subir archivo a Supabase Storage
 */
async function uploadFile(localPath, bucketName, remotePath) {
  try {
    const fileBuffer = fs.readFileSync(localPath);
    const stats = fs.statSync(localPath);

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(remotePath, fileBuffer, {
        contentType: getContentType(localPath),
        upsert: true
      });

    if (error) throw error;

    console.log(`✅ Subido: ${remotePath} (${(stats.size / 1024).toFixed(1)} KB)`);
    return { success: true };

  } catch (error) {
    console.error(`❌ Error subiendo ${remotePath}:`, error.message);
    return { success: false, error };
  }
}

/**
 * Obtener content-type basado en extensión
 */
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime'
  };
  return types[ext] || 'application/octet-stream';
}

/**
 * Subir directorio completo
 */
async function uploadDirectory(localDir, bucketName, remotePrefix = '') {
  if (!fs.existsSync(localDir)) {
    console.log(`⚠️ Directorio no existe: ${localDir}`);
    return { success: 0, errors: 0 };
  }

  const files = fs.readdirSync(localDir);
  
  if (files.length === 0) {
    console.log(`⚠️ Directorio vacío: ${localDir}`);
    return { success: 0, errors: 0 };
  }

  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const localPath = path.join(localDir, file);
    const stats = fs.statSync(localPath);

    if (stats.isDirectory()) {
      // Recursivo para subdirectorios
      const result = await uploadDirectory(
        localPath, 
        bucketName, 
        remotePrefix ? `${remotePrefix}/${file}` : file
      );
      successCount += result.success;
      errorCount += result.errors;
    } else {
      const remotePath = remotePrefix ? `${remotePrefix}/${file}` : file;
      const result = await uploadFile(localPath, bucketName, remotePath);
      
      if (result.success) successCount++;
      else errorCount++;
    }
  }

  return { success: successCount, errors: errorCount };
}

/**
 * Función principal
 */
async function main() {
  console.log('\n🚀 BACKUP DE ARCHIVOS A SUPABASE STORAGE');
  console.log('='.repeat(60));

  const PUBLIC_DIR = path.join(process.cwd(), 'public');

  // Backup de imágenes en /uploads/carousel/
  console.log('\n📦 Subiendo carousel...');
  console.log('='.repeat(60));
  const carouselResult = await uploadDirectory(
    path.join(PUBLIC_DIR, 'uploads', 'carousel'),
    'imagenes',
    'carousel'
  );

  // Backup de imágenes estáticas principales
  console.log('\n📦 Subiendo imágenes principales...');
  console.log('='.repeat(60));
  
  const mainImages = [
    'Birthday.jpeg',
    'Birthday2.jpeg',
    'Cancha1.jpeg',
    'Cancha2.jpeg',
    'Cancha3.jpeg',
    'Entrenamiento.jpeg',
    'Entrenamiento2.jpeg',
    'Entrenamiento3.jpeg',
    'Entrenamiento4.jpeg',
    'Entrenamiento5.jpeg',
    'imgCitySoccer.jpeg',
    'imgCitySoccer2.jpeg',
    'imgCitySoccer3.jpeg',
    'imgCitySoccer4.jpeg',
    'imgPickleball.jpeg',
    'imgPrincipal.jpeg',
    'Pickleball.jpeg',
    'Pickleball2.jpeg',
    'Logo.png',
    'Logo2.png',
    'LogonoBG.png',
    'Pelota.jpg',
    'Pie.jpeg'
  ];

  let mainImagesSuccess = 0;
  let mainImagesErrors = 0;

  for (const image of mainImages) {
    const localPath = path.join(PUBLIC_DIR, image);
    if (fs.existsSync(localPath)) {
      const result = await uploadFile(localPath, 'imagenes', `static/${image}`);
      if (result.success) mainImagesSuccess++;
      else mainImagesErrors++;
    }
  }

  // Backup del video principal
  console.log('\n📦 Subiendo video principal...');
  console.log('='.repeat(60));
  
  const videoPath = path.join(PUBLIC_DIR, 'videofutbol.mp4');
  let videoSuccess = 0;
  let videoErrors = 0;

  if (fs.existsSync(videoPath)) {
    const result = await uploadFile(videoPath, 'imagenes', 'videos/videofutbol.mp4');
    if (result.success) videoSuccess++;
    else videoErrors++;
  } else {
    console.log('⚠️ No se encontró videofutbol.mp4');
  }

  // Resumen final
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN FINAL');
  console.log('='.repeat(60));
  console.log(`Carousel:          ✅ ${carouselResult.success} | ❌ ${carouselResult.errors}`);
  console.log(`Imágenes estáticas: ✅ ${mainImagesSuccess} | ❌ ${mainImagesErrors}`);
  console.log(`Videos:            ✅ ${videoSuccess} | ❌ ${videoErrors}`);
  console.log('='.repeat(60));
  
  const totalSuccess = carouselResult.success + mainImagesSuccess + videoSuccess;
  const totalErrors = carouselResult.errors + mainImagesErrors + videoErrors;
  
  console.log(`TOTAL: ✅ ${totalSuccess} archivos | ❌ ${totalErrors} errores\n`);

  if (totalErrors === 0) {
    console.log('🎉 ¡Backup completado exitosamente!');
    console.log('\n💡 Ahora puedes usar sync-from-supabase.js para restaurar en Render');
  } else {
    console.log('⚠️  Backup completado con algunos errores');
  }
}

// Ejecutar
main().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
