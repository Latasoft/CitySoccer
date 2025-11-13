'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { localContentService } from '@/lib/localContentService';

const ContentContext = createContext();

// Caché global en memoria para todas las páginas
const contentCache = new Map();
const pendingRequests = new Map();

export function ContentProvider({ children }) {
  const [cache, setCache] = useState(contentCache);

  // Función optimizada para obtener contenido con caché
  const getPageContent = useCallback(async (pageKey) => {
    // Validar y limpiar pageKey
    const cleanPageKey = String(pageKey).split(':')[0].trim();
    const debugMode = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

    if (!cleanPageKey) {
      console.error('[ContentContext] pageKey inválido:', pageKey);
      return { data: null, error: new Error('pageKey inválido') };
    }

    // 1. Verificar caché en memoria
    if (contentCache.has(cleanPageKey)) {
      if (debugMode) {
        console.log(`[ContentContext] 📦 Usando caché para: ${cleanPageKey}`);
      }
      return { data: contentCache.get(cleanPageKey), error: null };
    }

    // 2. Si hay una petición pendiente, esperar su resultado (deduplicación)
    if (pendingRequests.has(cleanPageKey)) {
      if (debugMode) {
        console.log(`[ContentContext] ⏳ Esperando petición existente para: ${cleanPageKey}`);
      }
      return await pendingRequests.get(cleanPageKey);
    }

    // 3. Crear nueva petición
    if (debugMode) {
      console.log(`[ContentContext] 🔄 Cargando contenido: ${cleanPageKey}`);
    }

    const requestPromise = localContentService.getPageContent(cleanPageKey)
      .then(result => {
        if (!result.error && result.data) {
          contentCache.set(cleanPageKey, result.data);
          setCache(new Map(contentCache)); // Trigger re-render
        }
        pendingRequests.delete(cleanPageKey);
        return result;
      })
      .catch(error => {
        pendingRequests.delete(cleanPageKey);
        return { data: null, error };
      });

    pendingRequests.set(cleanPageKey, requestPromise);
    return await requestPromise;
  }, []);

  // Función para obtener un campo específico
  const getField = useCallback(async (pageKey, fieldKey) => {
    const cleanPageKey = String(pageKey).split(':')[0].trim();
    const cleanFieldKey = String(fieldKey).trim();
    
    const result = await getPageContent(cleanPageKey);
    if (result.error) return { data: null, error: result.error };
    
    const value = result.data?.[cleanFieldKey];
    return { data: value !== undefined ? value : null, error: null };
  }, [getPageContent]);

  // Función para actualizar un campo (invalida caché)
  const updateField = useCallback(async (pageKey, fieldKey, value) => {
    const cleanPageKey = String(pageKey).split(':')[0].trim();
    const cleanFieldKey = String(fieldKey).trim();
    const debugMode = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';
    
    if (debugMode) {
      console.log(`[ContentContext] 💾 Actualizando: ${cleanPageKey}.${cleanFieldKey}`);
    }

    const result = await localContentService.updateField(cleanPageKey, cleanFieldKey, value);
    
    if (!result.error) {
      // Actualizar caché local
      const currentContent = contentCache.get(cleanPageKey) || {};
      const updatedContent = { ...currentContent, [cleanFieldKey]: value };
      contentCache.set(cleanPageKey, updatedContent);
      setCache(new Map(contentCache)); // Trigger re-render
      
      if (debugMode) {
        console.log(`[ContentContext] ✅ Caché actualizado para: ${cleanPageKey}.${cleanFieldKey}`);
      }
    }
    
    return result;
  }, []);

  // Función para invalidar caché manualmente
  const invalidateCache = useCallback((pageKey) => {
    if (pageKey) {
      contentCache.delete(pageKey);
      pendingRequests.delete(pageKey);
    } else {
      contentCache.clear();
      pendingRequests.clear();
    }
    setCache(new Map(contentCache));
  }, []);

  // Función para precargar contenido de múltiples páginas
  const preloadPages = useCallback(async (pageKeys) => {
    const debugMode = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';
    
    if (debugMode) {
      console.log(`[ContentContext] 🚀 Precargando páginas:`, pageKeys);
    }

    const promises = pageKeys.map(pageKey => getPageContent(pageKey));
    return await Promise.all(promises);
  }, [getPageContent]);

  const value = {
    getPageContent,
    getField,
    updateField,
    invalidateCache,
    preloadPages,
    cache: contentCache
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent debe usarse dentro de ContentProvider');
  }
  return context;
}
