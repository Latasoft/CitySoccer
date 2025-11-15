#!/usr/bin/env node

/**
 * Script para revisar archivos en el volumen persistente de Render
 * Ejecutar en el Shell de Render o mediante SSH
 */

const fs = require('fs');
const path = require('path');

const UPLOAD_DIR = '/var/data/uploads';

function listFilesRecursive(dir, indent = '') {
  try {
    if (!fs.existsSync(dir)) {
      console.log(`❌ Directorio no existe: ${dir}`);
      return;
    }

    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    items.forEach(item => {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        console.log(`${indent}📁 ${item.name}/`);
        listFilesRecursive(fullPath, indent + '  ');
      } else {
        const stats = fs.statSync(fullPath);
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        const modified = stats.mtime.toISOString().split('T')[0];
        console.log(`${indent}📄 ${item.name} (${sizeMB} MB, ${modified})`);
      }
    });
  } catch (error) {
    console.error(`❌ Error leyendo ${dir}:`, error.message);
  }
}

function getDiskUsage() {
  try {
    const { execSync } = require('child_process');
    const output = execSync('df -h /var/data', { encoding: 'utf-8' });
    console.log('\n💾 Uso del disco:');
    console.log(output);
  } catch (error) {
    console.log('⚠️ No se pudo obtener uso del disco');
  }
}

console.log('🔍 Revisando archivos en Render Persistent Disk\n');
console.log('=' .repeat(60));
console.log(`Directorio base: ${UPLOAD_DIR}\n`);

listFilesRecursive(UPLOAD_DIR);
getDiskUsage();

console.log('\n' + '='.repeat(60));
console.log('✅ Revisión completa\n');
console.log('📋 Para ejecutar en Render:');
console.log('   1. Ir a Shell en el dashboard de Render');
console.log('   2. Ejecutar: node scripts/check-render-files.js');
