/**
 * Script para actualizar URLs de imágenes en los JSON de Supabase Storage
 * Reemplaza rutas locales /uploads/... con URLs de Supabase Storage
 * 
 * USO: node scripts/fix-image-urls.js
 */

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables de entorno faltantes: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const CONTENT_BUCKET = 'content';
const IMAGES_BUCKET = 'images';

/**
 * Lista todas las imágenes en Supabase Storage
 */
async function listImagesInStorage() {
  console.log('\n📋 Listando imágenes en Supabase Storage...\n');
  
  const { data, error } = await supabase.storage
    .from(IMAGES_BUCKET)
    .list('', {
      limit: 1000,
      sortBy: { column: 'name', order: 'asc' }
    });

  if (error) {
    console.error('❌ Error listando imágenes:', error);
    return [];
  }

  // Listar recursivamente todas las carpetas
  const allFiles = [];
  
  for (const item of data) {
    if (item.id === null) {
      // Es una carpeta, listar su contenido
      const { data: folderData, error: folderError } = await supabase.storage
        .from(IMAGES_BUCKET)
        .list(item.name, {
          limit: 1000,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (!folderError && folderData) {
        folderData.forEach(file => {
          const fullPath = `${item.name}/${file.name}`;
          const { data: urlData } = supabase.storage
            .from(IMAGES_BUCKET)
            .getPublicUrl(fullPath);
          
          allFiles.push({
            name: file.name,
            path: fullPath,
            url: urlData.publicUrl
          });
          
          console.log(`  ✅ ${fullPath}`);
          console.log(`     ${urlData.publicUrl}\n`);
        });
      }
    } else {
      // Es un archivo en la raíz
      const { data: urlData } = supabase.storage
        .from(IMAGES_BUCKET)
        .getPublicUrl(item.name);
      
      allFiles.push({
        name: item.name,
        path: item.name,
        url: urlData.publicUrl
      });
      
      console.log(`  ✅ ${item.name}`);
      console.log(`     ${urlData.publicUrl}\n`);
    }
  }

  console.log(`\n📊 Total de imágenes: ${allFiles.length}\n`);
  return allFiles;
}

/**
 * Obtiene un JSON de Supabase Storage
 */
async function getContentJSON(pageKey) {
  const fileName = `${pageKey}.json`;
  
  const { data, error } = await supabase.storage
    .from(CONTENT_BUCKET)
    .download(fileName);

  if (error) {
    console.error(`❌ Error descargando ${fileName}:`, error.message);
    return null;
  }

  const text = await data.text();
  return JSON.parse(text);
}

/**
 * Guarda un JSON actualizado en Supabase Storage
 */
async function saveContentJSON(pageKey, content) {
  const fileName = `${pageKey}.json`;
  const jsonString = JSON.stringify(content, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });

  const { data, error } = await supabase.storage
    .from(CONTENT_BUCKET)
    .upload(fileName, blob, {
      contentType: 'application/json',
      upsert: true,
      cacheControl: '300',
    });

  if (error) {
    console.error(`❌ Error guardando ${fileName}:`, error.message);
    return false;
  }

  console.log(`✅ ${fileName} actualizado en Supabase Storage`);
  return true;
}

/**
 * Busca una imagen en Supabase Storage por su nombre original
 */
function findImageByName(images, searchName) {
  // Extraer nombre base sin extensión
  const baseName = searchName.replace(/\.(jpg|jpeg|png|webp|gif)$/i, '');
  
  return images.find(img => {
    const imgBaseName = img.name.replace(/\.(jpg|jpeg|png|webp|gif)$/i, '');
    return imgBaseName.includes(baseName) || baseName.includes(imgBaseName);
  });
}

/**
 * Actualiza URLs en un JSON reemplazando /uploads/ con URLs de Supabase
 */
function updateImageURLs(content, images) {
  let updated = false;
  
  for (const [key, value] of Object.entries(content)) {
    if (typeof value === 'string' && value.startsWith('/uploads/')) {
      // Extraer nombre del archivo
      const fileName = value.split('/').pop();
      const folder = value.split('/')[2]; // ej: /uploads/summer-camp/file.jpg -> summer-camp
      
      // Buscar imagen en Supabase
      const found = images.find(img => 
        img.path.includes(folder) && img.name.includes(fileName.split('_').pop())
      );
      
      if (found) {
        console.log(`  🔄 ${key}:`);
        console.log(`     ANTES: ${value}`);
        console.log(`     DESPUÉS: ${found.url}`);
        content[key] = found.url;
        updated = true;
      } else {
        console.log(`  ⚠️  ${key}: No se encontró imagen para ${fileName}`);
      }
    }
  }
  
  return updated;
}

/**
 * Script principal
 */
async function main() {
  console.log('🚀 Iniciando actualización de URLs de imágenes...\n');
  
  // 1. Listar todas las imágenes en Supabase Storage
  const images = await listImagesInStorage();
  
  if (images.length === 0) {
    console.log('⚠️  No hay imágenes en Supabase Storage. Debes subir las imágenes primero.');
    return;
  }
  
  // 2. Páginas a actualizar
  const pages = [
    'summer-camp',
    'quienessomos',
    'servicios',
    'eventos',
    'contacto',
    'home',
    'academiadefutbol',
    'academiadepickleball',
    'clasesparticularesfutbol',
    'clasesparticularespickleball',
    'footer',
    'arriendo_pickleball-dobles',
    'arriendo_pickleball'
  ];
  
  console.log('\n📝 Actualizando JSONs en Supabase Storage...\n');
  
  for (const pageKey of pages) {
    console.log(`\n🔍 Procesando ${pageKey}.json...`);
    
    const content = await getContentJSON(pageKey);
    if (!content) {
      console.log(`  ⏭️  ${pageKey}.json no existe, saltando...`);
      continue;
    }
    
    const updated = updateImageURLs(content, images);
    
    if (updated) {
      await saveContentJSON(pageKey, content);
      console.log(`  ✅ ${pageKey}.json actualizado`);
    } else {
      console.log(`  ℹ️  ${pageKey}.json no requiere cambios`);
    }
  }
  
  console.log('\n✅ Proceso completado\n');
}

main().catch(console.error);
