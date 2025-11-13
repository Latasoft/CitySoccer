#!/usr/bin/env node

/**
 * Script para asegurar que las carpetas necesarias existan
 * Se ejecuta antes del build en Render
 */

const fs = require('fs');
const path = require('path');

const directories = [
  'public/content',
  'public/uploads',
  'public/uploads/images',
  'public/uploads/videos',
  'public/uploads/carousel'
];

console.log('🔧 Ensuring required directories exist...\n');

directories.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created: ${dir}`);
  } else {
    console.log(`✓ Exists: ${dir}`);
  }
});

console.log('\n✅ All directories ready!');
