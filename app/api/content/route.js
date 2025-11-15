import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { saveContent, getContent } from '@/lib/contentStorage';

// Caché en memoria del servidor (se limpia al reiniciar)
const serverCache = new Map();
const CACHE_TTL = 300000; // 5 minutos (balance entre performance y freshness)

// Función auxiliar para obtener contenido desde Supabase Storage (con caché)
async function getContentFromStorage(pageKey, bypassCache = false) {
  const now = Date.now();
  const cached = serverCache.get(pageKey);
  
  // Si hay caché válido Y no se solicita bypass, usarlo
  if (!bypassCache && cached && (now - cached.timestamp) < CACHE_TTL) {
    console.log('🔍🧭 Usando CACHE para', pageKey);
    return cached.data;
  }
  
  console.log('🔍🧭 Leyendo desde SUPABASE STORAGE para', pageKey, bypassCache ? '(bypass cache)' : '(cache expirado)');
  
  // Leer desde Supabase Storage
  const content = await getContent(pageKey);
  
  if (!content) {
    console.error('🔍🧭 ❌ Contenido NO encontrado en Supabase Storage:', pageKey);
    console.error('🔍🧭 ℹ️ Esto puede significar:');
    console.error('🔍🧭    1. El archivo no existe en el bucket');
    console.error('🔍🧭    2. Variables de entorno no configuradas (SUPABASE_SERVICE_KEY)');
    console.error('🔍🧭    3. Permisos RLS incorrectos');
    console.error('🔍🧭 Los componentes usarán defaultValues como fallback');
    throw new Error('Página no encontrada');
  }
  
  console.log('🔍🧭 ✅ Contenido cargado desde Supabase Storage');
  
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

    // Obtener contenido actual desde Supabase Storage
    console.log('🔍🧭 Obteniendo contenido actual desde Supabase Storage...');
    let content = await getContent(pageKey) || {};
    
    console.log('🔍🧭 Contenido actual:', Object.keys(content));
    
    // Actualizar el campo
    content[fieldKey] = fieldValue;
    
    console.log('🔍🧭 Contenido actualizado, guardando en Supabase Storage...');
    
    // Guardar en Supabase Storage
    const result = await saveContent(pageKey, content);
    
    if (!result.success) {
      throw new Error(result.error || 'Error guardando en Supabase Storage');
    }
    
    console.log('🔍🧭 ✅ Contenido guardado exitosamente en:', result.url);
    
    // Invalidar caché del servidor
    serverCache.delete(pageKey);
    console.log('🔍🧭 Cache invalidado para:', pageKey);
    
    // Revalidar páginas que usan este contenido (ISR)
    try {
      const routeMap = {
        'home': '/',
        'quienessomos': '/quienessomos',
        'servicios': '/servicios',
        'eventos': '/eventos',
        'contacto': '/contacto',
        'summer-camp': '/summer-camp',
        'academiadefutbol': '/academiadefutbol',
        'academiadepickleball': '/academiadepickleball',
        'clasesparticularesfutbol': '/clasesparticularesfutbol',
        'clasesparticularespickleball': '/clasesparticularespickleball',
        'arrendarcancha': '/arrendarcancha',
        'footer': '/', // Footer está en todas las páginas
        'navigation': '/', // Navigation está en todas las páginas
      };

      const routeToRevalidate = routeMap[pageKey] || `/${pageKey}`;
      revalidatePath(routeToRevalidate);
      console.log('🔍🧭 ✅ ISR revalidado para:', routeToRevalidate);

      // Si es footer o navigation, revalidar todas las páginas públicas
      if (pageKey === 'footer' || pageKey === 'navigation') {
        const allRoutes = Object.values(routeMap).filter((r, i, arr) => arr.indexOf(r) === i);
        allRoutes.forEach(route => {
          try {
            revalidatePath(route);
            console.log('🔍🧭 ✅ ISR revalidado (global):', route);
          } catch (e) {
            console.warn('⚠️ Error revalidando', route, ':', e.message);
          }
        });
      }
    } catch (revalidateError) {
      console.warn('⚠️ Error revalidando ruta:', revalidateError.message);
    }
    
    // Log seguro que maneja objetos/arrays
    const valuePreview = typeof fieldValue === 'object' 
      ? `[${Array.isArray(fieldValue) ? 'Array' : 'Object'} con ${Array.isArray(fieldValue) ? fieldValue.length : Object.keys(fieldValue).length} elementos]`
      : String(fieldValue).substring(0, 50);
    console.log(`✅ Guardado: ${pageKey}.${fieldKey} = ${valuePreview}...`);
    
    return NextResponse.json({
      success: true,
      data: { pageKey, fieldKey, fieldValue },
      message: 'Campo actualizado exitosamente',
      storageUrl: result.url
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
  // Extraer pageKey ANTES del try-catch para acceso en catch
  let pageKey = null;
  
  try {
    const { searchParams } = new URL(request.url);
    pageKey = searchParams.get('pageKey');
    
    console.log('🔍🧭 API GET /api/content - pageKey:', pageKey);
    
    if (!pageKey) {
      console.log('🔍🧭 ERROR: pageKey no proporcionado');
      return NextResponse.json(
        { error: 'pageKey es requerido' },
        { status: 400 }
      );
    }
    
    // Verificar si se solicita bypass de cache
    const fresh = searchParams.get('fresh') === 'true';
    
    const content = await getContentFromStorage(pageKey, fresh);
    
    // Log especial para footer
    if (pageKey === 'footer') {
      console.log('🔍🧭 🎯 FOOTER CONTENT LOADED:');
      console.log('   Keys:', Object.keys(content || {}));
      console.log('   footer_image:', content?.footer_image ? content.footer_image.substring(0, 100) + '...' : 'NO EXISTE');
      console.log('   footer_image tipo:', typeof content?.footer_image);
    }
    
    console.log('🔍🧭 Contenido cargado OK:', {
      pageKey,
      fresh,
      hasContent: !!content,
      keys: Object.keys(content || {}),
      menuItemsCount: content?.menu_items?.length
    });
    
    return NextResponse.json({
      success: true,
      data: content
    }, {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=60, stale-while-revalidate=300'
      }
    });
    
  } catch (error) {
    console.error('🔍🧭 ERROR en GET:', error.message, error.stack);
    
    if (error.message === 'Página no encontrada') {
      console.log('🔍🧭 Contenido no encontrado para pageKey:', pageKey || 'undefined');
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
