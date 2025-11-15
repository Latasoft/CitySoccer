/**
 * Script de migración: JSON locales -> Supabase Storage
 * 
 * Este script sube todos los archivos JSON de contenido desde el disco local
 * a Supabase Storage para aprovechar el CDN de Cloudflare.
 * 
 * Ejecutar:
 *   node migration/migrate-to-supabase-storage.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { saveContent } from '../lib/contentStorage.js';

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Rutas de directorios de contenido
const LOCAL_CONTENT_DIRS = [
  path.resolve(__dirname, '../public/uploads/content'),
  '/var/data/uploads/content', // Producción en Render
];

/**
 * Encuentra el directorio de contenido que existe
 */
function findContentDir() {
  for (const dir of LOCAL_CONTENT_DIRS) {
    if (fs.existsSync(dir)) {
      console.log(`📁 Directorio de contenido encontrado: ${dir}`);
      return dir;
    }
  }
  console.error('❌ No se encontró ningún directorio de contenido');
  return null;
}

/**
 * Migra todos los archivos JSON a Supabase Storage
 */
async function migrateContent() {
  console.log('🚀 Iniciando migración de contenido a Supabase Storage...\n');

  const contentDir = findContentDir();
  if (!contentDir) {
    process.exit(1);
  }

  // Leer todos los archivos JSON
  const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.json'));
  
  if (files.length === 0) {
    console.log('⚠️  No se encontraron archivos JSON para migrar');
    return;
  }

  console.log(`📦 Archivos encontrados: ${files.length}\n`);

  let successCount = 0;
  let errorCount = 0;

  // Migrar cada archivo
  for (const file of files) {
    const pageKey = file.replace('.json', '');
    const filePath = path.join(contentDir, file);

    try {
      // Leer contenido del archivo
      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      console.log(`📤 Migrando: ${pageKey}...`);
      
      // Subir a Supabase Storage
      const result = await saveContent(pageKey, content);
      
      if (result.success) {
        console.log(`   ✅ Éxito: ${result.url}`);
        successCount++;
      } else {
        console.error(`   ❌ Error: ${result.error}`);
        errorCount++;
      }
    } catch (error) {
      console.error(`   ❌ Error procesando ${pageKey}:`, error.message);
      errorCount++;
    }

    console.log(''); // Línea en blanco
  }

  // Resumen
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN DE MIGRACIÓN');
  console.log('='.repeat(60));
  console.log(`✅ Exitosos: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log(`📦 Total: ${files.length}`);
  console.log('='.repeat(60));

  if (errorCount === 0) {
    console.log('\n🎉 ¡Migración completada exitosamente!');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. Verifica los archivos en Supabase Dashboard > Storage > content');
    console.log('   2. Actualiza las API routes para usar contentStorage');
    console.log('   3. Prueba la aplicación en desarrollo');
    console.log('   4. Despliega a producción');
  } else {
    console.log('\n⚠️  Migración completada con errores');
    console.log('   Revisa los logs anteriores para más detalles');
  }
}

// Ejecutar migración
migrateContent().catch(error => {
  console.error('❌ Error fatal en migración:', error);
  process.exit(1);
});
