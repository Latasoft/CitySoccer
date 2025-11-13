#!/usr/bin/env node

/**
 * Script de diagnóstico para verificar archivos estáticos en Render
 * 
 * Ejecutar en Render via SSH o agregar a build:
 * node scripts/diagnose-static-files.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(process.cwd(), 'public');

console.log('\n🔍 DIAGNÓSTICO DE ARCHIVOS ESTÁTICOS');
console.log('='.repeat(70));
console.log(`📍 Directorio de trabajo: ${process.cwd()}`);
console.log(`📂 Public directory: ${PUBLIC_DIR}`);
console.log(`🌍 NODE_ENV: ${process.env.NODE_ENV}`);
console.log('='.repeat(70));

/**
 * Verificar si un archivo existe y mostrar info
 */
function checkFile(relativePath) {
  const fullPath = path.join(PUBLIC_DIR, relativePath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    const stats = fs.statSync(fullPath);
    const size = (stats.size / 1024).toFixed(2);
    const perms = stats.mode.toString(8).slice(-3);
    console.log(`✅ ${relativePath.padEnd(35)} | ${size.padStart(8)} KB | perms: ${perms}`);
  } else {
    console.log(`❌ ${relativePath.padEnd(35)} | NO EXISTE`);
  }
  
  return exists;
}

/**
 * Verificar directorio
 */
function checkDirectory(relativePath) {
  const fullPath = path.join(PUBLIC_DIR, relativePath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      const files = fs.readdirSync(fullPath);
      const perms = stats.mode.toString(8).slice(-3);
      console.log(`📁 ${relativePath.padEnd(35)} | ${files.length} archivos | perms: ${perms}`);
      return files;
    }
  }
  
  console.log(`❌ ${relativePath.padEnd(35)} | NO EXISTE`);
  return [];
}

console.log('\n📸 IMÁGENES ESTÁTICAS (debería estar en Git):');
console.log('-'.repeat(70));

const staticImages = [
  'Logo.png',
  'Logo2.png',
  'LogonoBG.png',
  'videofutbol.mp4',
  'Birthday.jpeg',
  'Cancha1.jpeg',
  'Entrenamiento.jpeg',
  'imgCitySoccer.jpeg',
  'imgPickleball.jpeg',
  'Pickleball.jpeg'
];

let foundStatic = 0;
staticImages.forEach(img => {
  if (checkFile(img)) foundStatic++;
});

console.log(`\n📊 Total: ${foundStatic}/${staticImages.length} archivos estáticos encontrados`);

console.log('\n📤 ARCHIVOS SUBIDOS POR ADMIN:');
console.log('-'.repeat(70));

const carouselFiles = checkDirectory('uploads/carousel');
if (carouselFiles.length > 0) {
  carouselFiles.forEach(file => {
    checkFile(`uploads/carousel/${file}`);
  });
}

checkDirectory('uploads/images');
checkDirectory('uploads/videos');

console.log('\n📄 ARCHIVOS DE CONTENIDO JSON:');
console.log('-'.repeat(70));

const contentFiles = checkDirectory('content');
if (contentFiles.length > 0) {
  contentFiles.slice(0, 5).forEach(file => {
    checkFile(`content/${file}`);
  });
  if (contentFiles.length > 5) {
    console.log(`... y ${contentFiles.length - 5} archivos más`);
  }
}

console.log('\n🔐 VERIFICACIÓN DE PERMISOS:');
console.log('-'.repeat(70));

try {
  // Verificar si podemos escribir en uploads
  const testFile = path.join(PUBLIC_DIR, 'uploads', '.write-test');
  fs.writeFileSync(testFile, 'test');
  fs.unlinkSync(testFile);
  console.log('✅ Permisos de escritura en /uploads: OK');
} catch (err) {
  console.log('❌ No se puede escribir en /uploads:', err.message);
}

try {
  // Verificar si podemos leer archivos estáticos
  const logoPath = path.join(PUBLIC_DIR, 'Logo2.png');
  if (fs.existsSync(logoPath)) {
    const stats = fs.statSync(logoPath);
    console.log(`✅ Lectura de Logo2.png: OK (${(stats.size / 1024).toFixed(2)} KB)`);
  }
} catch (err) {
  console.log('❌ No se puede leer Logo2.png:', err.message);
}

console.log('\n🌐 INFORMACIÓN DEL SERVIDOR:');
console.log('-'.repeat(70));
console.log(`Platform: ${process.platform}`);
console.log(`Node version: ${process.version}`);
console.log(`User: ${process.env.USER || process.env.USERNAME || 'unknown'}`);
console.log(`PWD: ${process.env.PWD || process.cwd()}`);

// Verificar si estamos en Render
if (process.env.RENDER) {
  console.log(`✅ Ejecutándose en Render`);
  console.log(`   Service: ${process.env.RENDER_SERVICE_NAME || 'unknown'}`);
  console.log(`   Instance ID: ${process.env.RENDER_INSTANCE_ID || 'unknown'}`);
}

console.log('\n' + '='.repeat(70));
console.log('✅ Diagnóstico completado\n');
