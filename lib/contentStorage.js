/**
 * Servicio de almacenamiento de contenido en Supabase Storage
 * Reemplaza el sistema de archivos local por Supabase Storage + Cloudflare CDN
 */

import { getSupabaseServiceClient } from './supabaseClients.js';

// Usar Service Client para bypassear RLS en operaciones de escritura
const supabase = getSupabaseServiceClient();
const CONTENT_BUCKET = 'content';
const IMAGES_BUCKET = 'images';

/**
 * Guarda contenido JSON en Supabase Storage
 * @param {string} pageKey - Clave de la página (ej: 'home', 'quienessomos')
 * @param {Object} content - Contenido a guardar
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export async function saveContent(pageKey, content) {
  try {
    const fileName = `${pageKey}.json`;
    const jsonString = JSON.stringify(content, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Subir o actualizar el archivo
    const { data, error } = await supabase.storage
      .from(CONTENT_BUCKET)
      .upload(fileName, blob, {
        contentType: 'application/json',
        upsert: true, // Sobrescribe si ya existe
        cacheControl: '300', // Cache por 5 minutos
      });

    if (error) {
      console.error(`❌ Error guardando contenido ${pageKey}:`, error);
      return { success: false, error: error.message };
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(CONTENT_BUCKET)
      .getPublicUrl(fileName);

    console.log(`✅ Contenido guardado: ${pageKey} -> ${urlData.publicUrl}`);
    
    return { 
      success: true, 
      url: urlData.publicUrl,
      path: data.path 
    };
  } catch (error) {
    console.error(`❌ Error guardando contenido ${pageKey}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtiene contenido JSON desde Supabase Storage
 * @param {string} pageKey - Clave de la página
 * @returns {Promise<Object|null>}
 */
export async function getContent(pageKey) {
  try {
    const fileName = `${pageKey}.json`;

    // Descargar el archivo
    const { data, error } = await supabase.storage
      .from(CONTENT_BUCKET)
      .download(fileName);

    if (error) {
      // Si no existe el archivo, retornar null (no es un error crítico)
      if (error.message.includes('not found')) {
        console.log(`⚠️ Contenido no encontrado: ${pageKey}`);
        return null;
      }
      console.error(`❌ Error descargando contenido ${pageKey}:`, error);
      return null;
    }

    // Convertir Blob a texto y parsear JSON
    const text = await data.text();
    const content = JSON.parse(text);

    console.log(`✅ Contenido cargado: ${pageKey}`);
    return content;
  } catch (error) {
    console.error(`❌ Error obteniendo contenido ${pageKey}:`, error);
    return null;
  }
}

/**
 * Sube un archivo de imagen a Supabase Storage
 * @param {File|Buffer} file - Archivo a subir
 * @param {string} folder - Carpeta destino (ej: 'summer-camp', 'eventos')
 * @param {string} originalName - Nombre original del archivo
 * @returns {Promise<{success: boolean, url?: string, path?: string, error?: string}>}
 */
export async function uploadFile(file, folder, originalName) {
  try {
    // Generar nombre único
    const timestamp = Date.now();
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${folder}/${folder}_${timestamp}_${sanitizedName}`;

    // Determinar tipo de contenido
    let contentType = 'image/jpeg';
    if (originalName.toLowerCase().endsWith('.png')) {
      contentType = 'image/png';
    } else if (originalName.toLowerCase().endsWith('.gif')) {
      contentType = 'image/gif';
    } else if (originalName.toLowerCase().endsWith('.webp')) {
      contentType = 'image/webp';
    } else if (originalName.toLowerCase().endsWith('.mp4')) {
      contentType = 'video/mp4';
    }

    // Subir archivo
    const { data, error } = await supabase.storage
      .from(IMAGES_BUCKET)
      .upload(fileName, file, {
        contentType,
        cacheControl: '31536000', // Cache por 1 año
        upsert: false, // No sobrescribir
      });

    if (error) {
      console.error(`❌ Error subiendo archivo ${originalName}:`, error);
      return { success: false, error: error.message };
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(IMAGES_BUCKET)
      .getPublicUrl(fileName);

    console.log(`✅ Archivo subido: ${fileName} -> ${urlData.publicUrl}`);

    return {
      success: true,
      url: urlData.publicUrl,
      path: data.path,
      fileName: fileName
    };
  } catch (error) {
    console.error(`❌ Error en uploadFile:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Elimina un archivo de Supabase Storage
 * @param {string} filePath - Ruta del archivo en el bucket (ej: 'summer-camp/file.jpg')
 * @param {string} bucket - Bucket ('content' o 'images')
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteFile(filePath, bucket = IMAGES_BUCKET) {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error(`❌ Error eliminando archivo ${filePath}:`, error);
      return { success: false, error: error.message };
    }

    console.log(`✅ Archivo eliminado: ${filePath}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Error en deleteFile:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Lista todos los archivos en una carpeta
 * @param {string} folder - Carpeta a listar
 * @param {string} bucket - Bucket ('content' o 'images')
 * @returns {Promise<Array>}
 */
export async function listFiles(folder = '', bucket = IMAGES_BUCKET) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.error(`❌ Error listando archivos en ${folder}:`, error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error(`❌ Error en listFiles:`, error);
    return [];
  }
}

/**
 * Obtiene la URL pública de un archivo
 * @param {string} filePath - Ruta del archivo en el bucket
 * @param {string} bucket - Bucket ('content' o 'images')
 * @returns {string}
 */
export function getPublicUrl(filePath, bucket = IMAGES_BUCKET) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);
  
  return data.publicUrl;
}

/**
 * Verifica si un archivo existe en Supabase Storage
 * @param {string} filePath - Ruta del archivo
 * @param {string} bucket - Bucket ('content' o 'images')
 * @returns {Promise<boolean>}
 */
export async function fileExists(filePath, bucket = IMAGES_BUCKET) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(filePath, {
        transform: {
          width: 1, // Solo verificar existencia, no descargar
          height: 1
        }
      });

    return !error && data !== null;
  } catch (error) {
    return false;
  }
}

export default {
  saveContent,
  getContent,
  uploadFile,
  deleteFile,
  listFiles,
  getPublicUrl,
  fileExists,
  CONTENT_BUCKET,
  IMAGES_BUCKET,
};
