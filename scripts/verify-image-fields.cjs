#!/usr/bin/env node

/**
 * Script para verificar y sincronizar fieldKeys de imágenes en archivos JSON
 * Asegura que todas las páginas tengan los campos de imagen correctos
 */

const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '..', 'public', 'content');

// Definir los fieldKeys esperados por página
const expectedFields = {
  'eventos': [
    'eventos_image_1',
    'eventos_image_2', 
    'eventos_image_3',
    'eventos-cta_background'
  ],
  'quienessomos': [
    'quienes_somos_image_1',
    'quienes_somos_image_2',
    'quienes_somos_image_3',
    'partnership_1_image',
    'partnership_2_image',
    'partnership_3_image'
  ],
  'summer-camp': [
    'summer-camp_image_1',
    'summer-camp_image_2',
    'summer-camp_image_3'
  ],
  'academiadefutbol': [
    'academia-futbol_image_1',
    'academia-futbol_image_2',
    'academia-futbol_image_3',
    'academia-futbol-cta_background'
  ],
  'academiadepickleball': [
    'academia-pickleball_image_1',
    'academia-pickleball_image_2',
    'academia-pickleball_image_3',
    'academia-pickleball-cta_background'
  ],
  'clasesparticularesfutbol': [
    'clases-futbol_image_1',
    'clases-futbol_image_2',
    'clases-futbol_image_3',
    'clases-futbol-cta_background'
  ],
  'clasesparticularespickleball': [
    'clases-pickleball_image_1',
    'clases-pickleball_image_2',
    'clases-pickleball_image_3',
    'clases-pickleball-cta_background'
  ],
  'home': [
    'home_logo'
  ],
  'footer': [
    'footer_image'
  ]
};

console.log('🔍 Verificando archivos JSON de contenido...\n');

let totalChecked = 0;
let totalAdded = 0;
let totalErrors = 0;

Object.entries(expectedFields).forEach(([pageKey, fields]) => {
  const filePath = path.join(contentDir, `${pageKey}.json`);
  
  console.log(`📄 Verificando: ${pageKey}.json`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠️  Archivo no existe, creando...`);
    
    const initialContent = {};
    fields.forEach(field => {
      initialContent[field] = `/uploads/images/${field.replace('_image', '').replace(/_\d+$/, '')}-1.jpg`;
    });
    
    fs.writeFileSync(filePath, JSON.stringify(initialContent, null, 2));
    console.log(`  ✅ Archivo creado con ${fields.length} campos`);
    totalAdded += fields.length;
    totalChecked++;
    return;
  }
  
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let modified = false;
    let added = 0;
    
    fields.forEach(field => {
      if (!content[field]) {
        console.log(`  ➕ Agregando campo faltante: ${field}`);
        // Generar URL por defecto basado en el nombre del campo
        const category = field.replace('_image', '').replace(/_\d+$/, '');
        content[field] = `/uploads/images/${category}-1.jpg`;
        modified = true;
        added++;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
      console.log(`  ✅ Actualizado con ${added} campos nuevos`);
      totalAdded += added;
    } else {
      console.log(`  ✓ Todos los campos presentes`);
    }
    
    totalChecked++;
    
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    totalErrors++;
  }
  
  console.log('');
});

console.log('='.repeat(60));
console.log(`📊 Resumen:`);
console.log(`   Archivos verificados: ${totalChecked}`);
console.log(`   Campos agregados: ${totalAdded}`);
console.log(`   Errores: ${totalErrors}`);
console.log('='.repeat(60));

if (totalErrors === 0) {
  console.log('✅ Verificación completada exitosamente');
  process.exit(0);
} else {
  console.log('⚠️  Verificación completada con errores');
  process.exit(1);
}
