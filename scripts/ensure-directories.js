#!/usr/bin/env node

/**
 * Script para asegurar que las carpetas necesarias existan
 * Se ejecuta antes del build en Render
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  
  // Si ya existe (ya sea directorio o symlink), no hacer nada
  if (fs.existsSync(fullPath)) {
    const stats = fs.lstatSync(fullPath);
    if (stats.isSymbolicLink()) {
      console.log(`🔗 Symlink exists: ${dir} -> ${fs.readlinkSync(fullPath)}`);
    } else {
      console.log(`✓ Exists: ${dir}`);
    }
    return;
  }
  
  // Solo crear si no existe
  fs.mkdirSync(fullPath, { recursive: true });
  console.log(`✅ Created: ${dir}`);
});

console.log('\n✅ All directories ready!');
