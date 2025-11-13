#!/usr/bin/env node

/**
 * Verificación rápida de configuración de páginas
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICANDO CONFIGURACIÓN DE PÁGINAS\n');
console.log('='.repeat(70));

const pages = [
  {
    name: '/summer-camp',
    file: 'app/summer-camp/page.js',
    shouldHave: ['pageKey="summer-camp"', 'imageCategory="summer-camp"'],
    jsonFile: 'public/content/summer-camp.json',
    expectedFields: ['summer-camp_image_1', 'summer-camp_image_2', 'summer-camp_image_3']
  },
  {
    name: '/quienessomos',
    component: 'components/QuienessomosComponent.jsx',
    shouldHave: ['pageKey="quienessomos"', 'quienes_somos_image_1'],
    jsonFile: 'public/content/quienessomos.json',
    expectedFields: ['quienes_somos_image_1', 'quienes_somos_image_2', 'quienes_somos_image_3']
  },
  {
    name: '/eventos',
    file: 'app/eventos/page.js',
    shouldHave: ['pageKey="eventos"', 'imageCategory="eventos"'],
    jsonFile: 'public/content/eventos.json',
    expectedFields: ['eventos_image_1', 'eventos_image_2', 'eventos_image_3']
  },
  {
    name: '/academiadepickleball',
    file: 'app/academiadepickleball/page.js',
    shouldHave: ['pageKey="academiadepickleball"', 'imageCategory="academia-pickleball"'],
    jsonFile: 'public/content/academiadepickleball.json',
    expectedFields: ['academia-pickleball_image_1', 'academia-pickleball_image_2', 'academia-pickleball_image_3']
  },
  {
    name: '/academiadefutbol',
    file: 'app/academiadefutbol/page.js',
    shouldHave: ['pageKey="academiadefutbol"', 'imageCategory="academia-futbol"'],
    jsonFile: 'public/content/academiadefutbol.json',
    expectedFields: ['academia-futbol_image_1', 'academia-futbol_image_2', 'academia-futbol_image_3']
  },
  {
    name: '/clasesparticularesfutbol',
    file: 'app/clasesparticularesfutbol/page.js',
    shouldHave: ['pageKey="clasesparticularesfutbol"', 'imageCategory="clases-futbol"'],
    jsonFile: 'public/content/clasesparticularesfutbol.json',
    expectedFields: ['clases-futbol_image_1', 'clases-futbol_image_2', 'clases-futbol_image_3']
  },
  {
    name: '/clasesparticularespickleball',
    file: 'app/clasesparticularespickleball/page.js',
    shouldHave: ['pageKey="clasesparticularespickleball"', 'imageCategory="clases-pickleball"'],
    jsonFile: 'public/content/clasesparticularespickleball.json',
    expectedFields: ['clases-pickleball_image_1', 'clases-pickleball_image_2', 'clases-pickleball_image_3']
  }
];

let totalChecks = 0;
let passed = 0;
let failed = 0;

pages.forEach(page => {
  console.log(`\n📄 ${page.name}`);
  console.log('-'.repeat(70));
  
  // Verificar archivo de página
  const pageFile = path.join(__dirname, '..', page.file || page.component);
  if (fs.existsSync(pageFile)) {
    console.log(`  ✅ Archivo existe: ${page.file || page.component}`);
    totalChecks++;
    passed++;
    
    const content = fs.readFileSync(pageFile, 'utf-8');
    
    // Verificar props requeridos
    page.shouldHave.forEach(prop => {
      totalChecks++;
      if (content.includes(prop)) {
        console.log(`  ✅ Tiene: ${prop}`);
        passed++;
      } else {
        console.log(`  ❌ FALTA: ${prop}`);
        failed++;
      }
    });
  } else {
    console.log(`  ❌ Archivo NO existe: ${page.file || page.component}`);
    totalChecks++;
    failed++;
  }
  
  // Verificar JSON
  const jsonFile = path.join(__dirname, '..', page.jsonFile);
  if (fs.existsSync(jsonFile)) {
    console.log(`  ✅ JSON existe: ${page.jsonFile}`);
    totalChecks++;
    passed++;
    
    const jsonContent = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
    const missingFields = page.expectedFields.filter(field => !(field in jsonContent));
    
    totalChecks++;
    if (missingFields.length === 0) {
      console.log(`  ✅ Todos los fieldKeys presentes (${page.expectedFields.length})`);
      passed++;
    } else {
      console.log(`  ❌ Faltan fieldKeys: ${missingFields.join(', ')}`);
      failed++;
    }
  } else {
    console.log(`  ❌ JSON NO existe: ${page.jsonFile}`);
    totalChecks += 2;
    failed += 2;
  }
});

// Verificar componentes globales
console.log(`\n🧩 COMPONENTES GLOBALES`);
console.log('-'.repeat(70));

const components = [
  {
    name: 'HeroSection',
    file: 'components/HeroSection.jsx',
    shouldHave: ['EditableImage', 'pageKey={pageKey}', 'fieldKey={`${imageCategory}_image_']
  },
  {
    name: 'CTASection',
    file: 'components/CTASection.jsx',
    shouldHave: ['EditableImage', 'pageKey={pageKey}', 'fieldKey={`${imageCategory}_background`}']
  },
  {
    name: 'EditableImage',
    file: 'components/EditableImage.jsx',
    shouldHave: ['useContent', 'getField', 'updateField']
  },
  {
    name: 'EditableContent',
    file: 'components/EditableContent.jsx',
    shouldHave: ['useContent', 'getField', 'updateField']
  }
];

components.forEach(comp => {
  const compFile = path.join(__dirname, '..', comp.file);
  if (fs.existsSync(compFile)) {
    console.log(`\n  ✅ ${comp.name} existe`);
    const content = fs.readFileSync(compFile, 'utf-8');
    
    comp.shouldHave.forEach(check => {
      totalChecks++;
      if (content.includes(check)) {
        console.log(`    ✅ Tiene: ${check}`);
        passed++;
      } else {
        console.log(`    ❌ FALTA: ${check}`);
        failed++;
      }
    });
  } else {
    console.log(`\n  ❌ ${comp.name} NO existe`);
    totalChecks++;
    failed++;
  }
});

// Verificar contextos
console.log(`\n⚙️  CONTEXTOS Y SERVICIOS`);
console.log('-'.repeat(70));

const core = [
  { name: 'ContentContext', file: 'contexts/ContentContext.jsx' },
  { name: 'localContentService', file: 'lib/localContentService.js' },
  { name: 'API /api/content', file: 'app/api/content/route.js' }
];

core.forEach(item => {
  const file = path.join(__dirname, '..', item.file);
  totalChecks++;
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${item.name}`);
    passed++;
  } else {
    console.log(`  ❌ ${item.name} NO existe`);
    failed++;
  }
});

console.log('\n' + '='.repeat(70));
console.log('📊 RESUMEN');
console.log('='.repeat(70));
console.log(`Total verificaciones: ${totalChecks}`);
console.log(`✅ Pasadas: ${passed}`);
console.log(`❌ Fallidas: ${failed}`);
console.log('='.repeat(70));

if (failed === 0) {
  console.log('\n🎉 ¡TODO CONFIGURADO CORRECTAMENTE!');
  console.log('\n📝 Reinicia el servidor y prueba:');
  console.log('   npm run dev');
  process.exit(0);
} else {
  console.log(`\n⚠️  Hay ${failed} problemas que resolver`);
  process.exit(1);
}
