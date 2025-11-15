/**
 * Script para agregar ISR (Incremental Static Regeneration) a todas las páginas públicas
 * Ejecutar: node scripts/add-isr-to-pages.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Páginas públicas que necesitan ISR
const publicPages = [
  'app/page.js', // ✅ Ya tiene revalidate
  'app/quienessomos/page.js',
  'app/servicios/page.js',
  'app/eventos/page.js',
  'app/contacto/page.js',
  'app/summer-camp/page.js',
  'app/academiadefutbol/page.js',
  'app/academiadepickleball/page.js',
  'app/clasesparticularesfutbol/page.js',
  'app/clasesparticularespickleball/page.js',
  'app/arrendarcancha/page.js',
];

const ISR_CONFIG = `
// ISR: Regenerar cada 60 segundos
export const revalidate = 60;
`;

function addISRToPage(filePath) {
  const fullPath = path.join(path.dirname(__dirname), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  No existe: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(fullPath, 'utf-8');
  
  // Verificar si ya tiene revalidate
  if (content.includes('export const revalidate')) {
    console.log(`✓ Ya tiene ISR: ${filePath}`);
    return false;
  }

  // Verificar si es 'use client'
  if (content.includes("'use client'")) {
    console.log(`⚠️  Es client component (skip): ${filePath}`);
    return false;
  }

  // Agregar después de los imports
  const lines = content.split('\n');
  let insertIndex = 0;
  
  // Encontrar la última línea de import
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ') || lines[i].trim().startsWith('const ')) {
      insertIndex = i + 1;
    }
    if (lines[i].trim().startsWith('export default') || lines[i].trim().startsWith('export function')) {
      break;
    }
  }

  // Insertar ISR config
  lines.splice(insertIndex, 0, ISR_CONFIG);
  content = lines.join('\n');

  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log(`✅ ISR agregado: ${filePath}`);
  return true;
}

console.log('\n🚀 Agregando ISR a páginas públicas...\n');

let modified = 0;
publicPages.forEach(page => {
  if (addISRToPage(page)) {
    modified++;
  }
});

console.log(`\n✅ ${modified} páginas modificadas con ISR`);
console.log('\n💡 Beneficios de ISR:');
console.log('   • HTML pre-generado estáticamente');
console.log('   • Regeneración automática cada 60 segundos');
console.log('   • Regeneración on-demand al editar contenido');
console.log('   • CDN cacheable (máximo performance)');
console.log('   • No requiere FastAPI + React\n');
