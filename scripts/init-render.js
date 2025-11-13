#!/usr/bin/env node

/**
 * Script de inicialización para Render
 * Copia archivos estáticos de Git al disco persistente si no existen
 * 
 * Este script se ejecuta ANTES del build para asegurar que:
 * 1. Los archivos estáticos del repo están disponibles
 * 2. Los archivos editables del admin se preservan en el disco persistente
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(process.cwd(), 'public');

/**
 * Copiar archivo si no existe en destino
 */
function copyIfNotExists(src, dest) {
  try {
    if (fs.existsSync(dest)) {
      console.log(`⏭️  Ya existe: ${path.basename(dest)}`);
      return false;
    }

    // Crear directorio de destino si no existe
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.copyFileSync(src, dest);
    const stats = fs.statSync(dest);
    console.log(`✅ Copiado: ${path.basename(dest)} (${(stats.size / 1024).toFixed(1)} KB)`);
    return true;

  } catch (error) {
    console.error(`❌ Error copiando ${path.basename(src)}:`, error.message);
    return false;
  }
}

/**
 * Inicializar archivos estáticos
 */
function initializeStaticAssets() {
  console.log('\n🚀 INICIALIZANDO ARCHIVOS ESTÁTICOS');
  console.log('='.repeat(60));
  console.log(`📍 Directorio: ${PUBLIC_DIR}\n`);

  const staticFiles = [
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
    'iconCHI.jpeg',
    'iconURU.png',
    'iconUSA.png',
    'imgCitySoccer.jpeg',
    'imgCitySoccer2.jpeg',
    'imgCitySoccer3.jpeg',
    'imgCitySoccer4.jpeg',
    'imgPickleball.jpeg',
    'imgPrincipal.jpeg',
    'Logo.png',
    'Logo2.png',
    'LogonoBG.png',
    'Pelota.jpg',
    'Pickleball.jpeg',
    'Pickleball2.jpeg',
    'Pie.jpeg',
    'videofutbol.mp4'
  ];

  let copied = 0;
  let skipped = 0;
  let errors = 0;

  for (const file of staticFiles) {
    const src = path.join(PUBLIC_DIR, file);
    
    if (!fs.existsSync(src)) {
      console.log(`⚠️  Archivo fuente no existe: ${file}`);
      errors++;
      continue;
    }

    // En producción, el archivo ya está en el lugar correcto desde Git
    // Este script es principalmente para verificar que existen
    if (fs.existsSync(src)) {
      const stats = fs.statSync(src);
      console.log(`✅ Verificado: ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
      skipped++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Verificados: ${skipped}`);
  console.log(`📋 Copiados: ${copied}`);
  console.log(`❌ Errores: ${errors}`);
  console.log('='.repeat(60));

  if (errors > 0) {
    console.log('\n⚠️  Algunos archivos no se encontraron');
    console.log('💡 Asegúrate de que los archivos estén en el repositorio Git\n');
  } else {
    console.log('\n🎉 Todos los archivos estáticos están disponibles!\n');
  }

  return { copied, skipped, errors };
}

/**
 * Verificar estructura de directorios
 */
function ensureDirectoryStructure() {
  const dirs = [
    path.join(PUBLIC_DIR, 'uploads'),
    path.join(PUBLIC_DIR, 'uploads', 'images'),
    path.join(PUBLIC_DIR, 'uploads', 'videos'),
    path.join(PUBLIC_DIR, 'uploads', 'carousel'),
    path.join(PUBLIC_DIR, 'content')
  ];

  console.log('\n📁 VERIFICANDO ESTRUCTURA DE DIRECTORIOS');
  console.log('='.repeat(60));

  let created = 0;
  let existed = 0;

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Creado: ${path.relative(PUBLIC_DIR, dir)}`);
      created++;
    } else {
      console.log(`✓  Existe: ${path.relative(PUBLIC_DIR, dir)}`);
      existed++;
    }
  }

  console.log('='.repeat(60));
  console.log(`📋 Total: ${created} creados, ${existed} ya existían\n`);
}

/**
 * Main
 */
function main() {
  console.log('\n' + '='.repeat(60));
  console.log('🏗️  RENDER INITIALIZATION SCRIPT');
  console.log('='.repeat(60));
  
  // Verificar si estamos en Render
  const isRender = process.env.RENDER === 'true';
  if (isRender) {
    console.log('✅ Ejecutando en Render');
  } else {
    console.log('💻 Ejecutando en desarrollo local');
  }

  // 1. Crear estructura de directorios
  ensureDirectoryStructure();

  // 2. Verificar archivos estáticos
  const result = initializeStaticAssets();

  // 3. Resumen
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN DE INICIALIZACIÓN');
  console.log('='.repeat(60));
  console.log(`✅ Proceso completado`);
  console.log(`📁 Directorios verificados`);
  console.log(`🖼️  Archivos estáticos: ${result.skipped + result.copied} disponibles`);
  console.log('='.repeat(60) + '\n');

  process.exit(result.errors > 0 ? 1 : 0);
}

main();
