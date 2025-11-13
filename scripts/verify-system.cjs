#!/usr/bin/env node

/**
 * Script de verificación de integridad del sistema EditableImage
 * Verifica que todos los componentes estén configurados correctamente
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICACIÓN DE SISTEMA EDITABLEIMAGE\n');
console.log('='.repeat(70));

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function check(name, condition, details = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`✅ ${name}`);
    if (details) console.log(`   ${details}`);
  } else {
    failedChecks++;
    console.log(`❌ ${name}`);
    if (details) console.log(`   ${details}`);
  }
}

// 1. Verificar archivos de contexto
console.log('\n📁 VERIFICANDO CONTEXTOS\n');

const contentContext = path.join(__dirname, '..', 'contexts', 'ContentContext.jsx');
check(
  'ContentContext existe',
  fs.existsSync(contentContext),
  'Contexto de caché global'
);

const adminContext = path.join(__dirname, '..', 'contexts', 'AdminModeContext.jsx');
check(
  'AdminModeContext existe',
  fs.existsSync(adminContext),
  'Contexto de modo admin'
);

// 2. Verificar componentes principales
console.log('\n🧩 VERIFICANDO COMPONENTES\n');

const editableImage = path.join(__dirname, '..', 'components', 'EditableImage.jsx');
const editableImageContent = fs.existsSync(editableImage) 
  ? fs.readFileSync(editableImage, 'utf-8') 
  : '';

check(
  'EditableImage existe',
  fs.existsSync(editableImage)
);

check(
  'EditableImage usa useContent',
  editableImageContent.includes('useContent'),
  'Integrado con ContentProvider'
);

check(
  'EditableImage tiene getField',
  editableImageContent.includes('getField'),
  'Lee desde caché compartido'
);

check(
  'EditableImage tiene updateField',
  editableImageContent.includes('updateField'),
  'Escribe en JSON con caché'
);

const editableContent = path.join(__dirname, '..', 'components', 'EditableContent.jsx');
const editableContentContent = fs.existsSync(editableContent) 
  ? fs.readFileSync(editableContent, 'utf-8') 
  : '';

check(
  'EditableContent usa useContent',
  editableContentContent.includes('useContent'),
  'Integrado con ContentProvider'
);

// 3. Verificar archivos JSON
console.log('\n📄 VERIFICANDO ARCHIVOS JSON\n');

const contentDir = path.join(__dirname, '..', 'public', 'content');
const requiredJsonFiles = [
  'home.json',
  'footer.json',
  'eventos.json',
  'quienessomos.json',
  'summer-camp.json',
  'academiadefutbol.json',
  'academiadepickleball.json',
  'clasesparticularesfutbol.json',
  'clasesparticularespickleball.json'
];

requiredJsonFiles.forEach(file => {
  const filePath = path.join(contentDir, file);
  check(
    `${file} existe`,
    fs.existsSync(filePath)
  );
});

// 4. Verificar fieldKeys en JSON
console.log('\n🔑 VERIFICANDO FIELDKEYS EN JSON\n');

const fieldKeysMap = {
  'eventos.json': ['eventos_image_1', 'eventos_image_2', 'eventos_image_3', 'eventos-cta_background'],
  'summer-camp.json': ['summer-camp_image_1', 'summer-camp_image_2', 'summer-camp_image_3'],
  'academiadefutbol.json': ['academia-futbol_image_1', 'academia-futbol_image_2', 'academia-futbol_image_3'],
  'home.json': ['home_logo'],
  'footer.json': ['footer_image']
};

Object.entries(fieldKeysMap).forEach(([file, keys]) => {
  const filePath = path.join(contentDir, file);
  if (fs.existsSync(filePath)) {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const missingKeys = keys.filter(key => !(key in content));
    
    check(
      `${file} tiene todos los fieldKeys`,
      missingKeys.length === 0,
      missingKeys.length > 0 ? `Faltan: ${missingKeys.join(', ')}` : `${keys.length} campos presentes`
    );
  }
});

// 5. Verificar layout principal
console.log('\n🏗️  VERIFICANDO LAYOUT PRINCIPAL\n');

const layoutFile = path.join(__dirname, '..', 'app', 'layout.js');
const layoutContent = fs.existsSync(layoutFile) 
  ? fs.readFileSync(layoutFile, 'utf-8') 
  : '';

check(
  'Layout usa ContentProvider',
  layoutContent.includes('ContentProvider'),
  'Caché global activo'
);

check(
  'Layout usa AdminModeProvider',
  layoutContent.includes('AdminModeProvider'),
  'Modo admin disponible'
);

// 6. Verificar API route
console.log('\n🌐 VERIFICANDO API ROUTE\n');

const apiRoute = path.join(__dirname, '..', 'app', 'api', 'content', 'route.js');
const apiContent = fs.existsSync(apiRoute) 
  ? fs.readFileSync(apiRoute, 'utf-8') 
  : '';

check(
  'API route existe',
  fs.existsSync(apiRoute)
);

check(
  'API route tiene caché del servidor',
  apiContent.includes('serverCache'),
  'Caché en memoria del servidor'
);

check(
  'API route invalida caché al POST',
  apiContent.includes('serverCache.delete'),
  'Invalidación automática'
);

// 7. Verificar .env.local
console.log('\n⚙️  VERIFICANDO CONFIGURACIÓN\n');

const envFile = path.join(__dirname, '..', '.env.local');
const envContent = fs.existsSync(envFile) 
  ? fs.readFileSync(envFile, 'utf-8') 
  : '';

check(
  '.env.local existe',
  fs.existsSync(envFile)
);

check(
  'Debug mode configurado',
  envContent.includes('NEXT_PUBLIC_DEBUG_MODE'),
  envContent.includes('NEXT_PUBLIC_DEBUG_MODE=true') ? 'DEBUG ACTIVADO ✅' : 'DEBUG DESACTIVADO'
);

// 8. Verificar directorios de uploads
console.log('\n📂 VERIFICANDO DIRECTORIOS DE UPLOADS\n');

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads', 'images');
check(
  'Directorio /uploads/images existe',
  fs.existsSync(uploadsDir),
  fs.existsSync(uploadsDir) ? `${fs.readdirSync(uploadsDir).length} archivos` : ''
);

// RESUMEN FINAL
console.log('\n' + '='.repeat(70));
console.log('📊 RESUMEN DE VERIFICACIÓN\n');
console.log(`Total de verificaciones: ${totalChecks}`);
console.log(`✅ Pasadas: ${passedChecks}`);
console.log(`❌ Fallidas: ${failedChecks}`);
console.log('='.repeat(70));

if (failedChecks === 0) {
  console.log('\n🎉 ¡SISTEMA COMPLETAMENTE VERIFICADO!');
  console.log('\n📝 PRÓXIMOS PASOS:');
  console.log('   1. Reiniciar servidor: npm run dev');
  console.log('   2. Login como admin');
  console.log('   3. Probar subir imagen en cualquier página');
  console.log('   4. Verificar persistencia con F5');
  process.exit(0);
} else {
  console.log('\n⚠️  HAY PROBLEMAS QUE RESOLVER');
  console.log(`   Revisa los ${failedChecks} errores listados arriba`);
  process.exit(1);
}
