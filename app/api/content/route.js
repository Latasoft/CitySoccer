import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

// Caché en memoria del servidor (se limpia al reiniciar)
const serverCache = new Map();
const CACHE_TTL = 5000; // 5 segundos

// Función auxiliar para obtener contenido (con caché)
function getContentFromFile(pageKey) {
  const now = Date.now();
  const cached = serverCache.get(pageKey);
  
  // Si hay caché válido, usarlo
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.data;
  }
  
  // Leer del disco
  const filePath = path.join(process.cwd(), 'public', 'content', `${pageKey}.json`);
  const fs = require('fs');
  
  if (!fs.existsSync(filePath)) {
    throw new Error('Página no encontrada');
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const content = JSON.parse(fileContent);
  
  // Guardar en caché
  serverCache.set(pageKey, {
    data: content,
    timestamp: now
  });
  
  return content;
}

export async function POST(request) {
  try {
    const { pageKey, fieldKey, fieldValue } = await request.json();
    
    console.log('🔍🧭 API POST /api/content - Datos recibidos:', {
      pageKey,
      fieldKey,
      fieldValueType: typeof fieldValue,
      isArray: Array.isArray(fieldValue),
      length: Array.isArray(fieldValue) ? fieldValue.length : 'N/A'
    });
    
    if (!pageKey || !fieldKey || fieldValue === undefined) {
      console.error('🔍🧭 ERROR: Faltan parámetros requeridos');
      return NextResponse.json(
        { error: 'pageKey, fieldKey y fieldValue son requeridos' },
        { status: 400 }
      );
    }

    // Ruta del archivo JSON
    const filePath = path.join(process.cwd(), 'public', 'content', `${pageKey}.json`);
    
    console.log('🔍🧭 Ruta del archivo:', filePath);
    
    // Leer el archivo actual
    const fs = require('fs');
    let content = {};
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      content = JSON.parse(fileContent);
      console.log('🔍🧭 Contenido actual del archivo:', Object.keys(content));
    } else {
      console.log('🔍🧭 Archivo no existe, creando nuevo');
    }
    
    // Actualizar el campo
    content[fieldKey] = fieldValue;
    
    console.log('🔍🧭 Contenido actualizado, escribiendo archivo...');
    
    // Guardar el archivo
    await writeFile(filePath, JSON.stringify(content, null, 2), 'utf-8');
    
    console.log('🔍🧭 ✅ Archivo guardado exitosamente');
    
    // Invalidar caché del servidor
    serverCache.delete(pageKey);
    console.log('🔍🧭 Cache invalidado para:', pageKey);
    
    // Log seguro que maneja objetos/arrays
    const valuePreview = typeof fieldValue === 'object' 
      ? `[${Array.isArray(fieldValue) ? 'Array' : 'Object'} con ${Array.isArray(fieldValue) ? fieldValue.length : Object.keys(fieldValue).length} elementos]`
      : String(fieldValue).substring(0, 50);
    console.log(`✅ Guardado: ${pageKey}.${fieldKey} = ${valuePreview}...`);
    
    return NextResponse.json({
      success: true,
      data: { pageKey, fieldKey, fieldValue },
      message: 'Campo actualizado exitosamente'
    });
    
  } catch (error) {
    console.error('Error guardando contenido:', error);
    return NextResponse.json(
      { error: 'Error al guardar el contenido', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageKey = searchParams.get('pageKey');
    
    console.log('🔍🧭 API GET /api/content - pageKey:', pageKey);
    
    if (!pageKey) {
      console.log('🔍🧭 ERROR: pageKey no proporcionado');
      return NextResponse.json(
        { error: 'pageKey es requerido' },
        { status: 400 }
      );
    }
    
    const content = getContentFromFile(pageKey);
    
    console.log('🔍🧭 Contenido cargado OK:', {
      pageKey,
      hasContent: !!content,
      keys: Object.keys(content || {}),
      menuItemsCount: content?.menu_items?.length
    });
    
    return NextResponse.json({
      success: true,
      data: content
    }, {
      headers: {
        'Cache-Control': 'public, max-age=5, s-maxage=5, stale-while-revalidate=10'
      }
    });
    
  } catch (error) {
    console.error('🔍🧭 ERROR en GET:', error.message, error.stack);
    
    if (error.message === 'Página no encontrada') {
      console.log('🔍🧭 Archivo no encontrado:', pageKey);
      return NextResponse.json(
        { error: 'Página no encontrada' },
        { status: 404 }
      );
    }
    
    console.error('🔍🧭 Error leyendo contenido:', error);
    return NextResponse.json(
      { error: 'Error al leer el contenido', details: error.message },
      { status: 500 }
    );
  }
}
