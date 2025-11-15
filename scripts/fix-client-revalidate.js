import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Buscar todas las páginas
const pagesPattern = path.join(path.dirname(__dirname), 'app', '**/page.js');
const pages = glob.sync(pagesPattern);

let fixed = 0;

pages.forEach(pagePath => {
  const content = fs.readFileSync(pagePath, 'utf-8');
  
  // Verificar si es client component Y tiene revalidate
  if (content.includes("'use client'") && content.includes('export const revalidate')) {
    console.log(`🔧 Fixing: ${pagePath.replace(path.dirname(__dirname), '')}`);
    
    // Remover línea de revalidate y líneas vacías después
    const fixed = content
      .replace(/\n\/\/ ISR: Regenerar cada 60 segundos\nexport const revalidate = 60;\n\n/g, '\n')
      .replace(/\nexport const revalidate = 60;\n\n/g, '\n')
      .replace(/\nexport const revalidate = 60;\n/g, '\n');
    
    fs.writeFileSync(pagePath, fixed, 'utf-8');
    fixed++;
  }
});

console.log(`\n✅ ${fixed} páginas corregidas`);
