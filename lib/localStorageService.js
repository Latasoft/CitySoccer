/**
 * 🗄️ Servicio de LocalStorage con Sincronización Inteligente
 * 
 * Características:
 * - Almacenamiento local de contenido (imágenes URLs, JSON, videos)
 * - Polling cada 60 segundos para detectar cambios en servidor
 * - Solo actualiza datos modificados (diff inteligente)
 * - Versionado con timestamps y ETags
 * - Compresión de datos para ahorrar espacio
 * - Manejo de cuotas excedidas
 * 
 * Flujo:
 * 1. Componente solicita datos → verifica localStorage primero
 * 2. Si no existe o está expirado → fetch a servidor
 * 3. Background sync cada 60s → solo actualiza cambios
 * 4. Eventos personalizados para notificar actualizaciones
 */

// Prefijos para organizar localStorage
const STORAGE_PREFIX = 'citysoccer_';
const CONTENT_KEY = `${STORAGE_PREFIX}content_`;
const IMAGES_KEY = `${STORAGE_PREFIX}images_`;
const METADATA_KEY = `${STORAGE_PREFIX}metadata_`;
const VERSION_KEY = `${STORAGE_PREFIX}version`;

// Configuración
const CONFIG = {
  SYNC_INTERVAL: 60000, // 60 segundos
  CACHE_DURATION: 300000, // 5 minutos como fallback
  MAX_STORAGE_SIZE: 5 * 1024 * 1024, // 5MB límite seguro
  DEBUG: typeof window !== 'undefined' && process.env.NEXT_PUBLIC_DEBUG_MODE === 'true'
};

// Estado global del servicio
let syncIntervalId = null;
let isSyncing = false;
const subscribedPages = new Set();

// Mutex para prevenir race conditions en actualizaciones simultáneas
const updateMutex = new Map(); // pageKey -> Promise

/**
 * Utilidades de localStorage
 */
const storage = {
  /**
   * Guardar datos con compresión básica y manejo de errores
   */
  set: (key, value) => {
    if (typeof window === 'undefined') return false;
    
    try {
      const data = {
        value,
        timestamp: Date.now(),
        version: Date.now().toString(36)
      };
      
      const serialized = JSON.stringify(data);
      
      // Verificar tamaño antes de guardar
      if (serialized.length > CONFIG.MAX_STORAGE_SIZE) {
        console.warn(`⚠️ [LocalStorage] Datos muy grandes para ${key}, limpiando cache antiguo`);
        storage.cleanup();
      }
      
      localStorage.setItem(key, serialized);
      
      if (CONFIG.DEBUG) {
        console.log(`💾 [LocalStorage] Guardado: ${key} (${(serialized.length / 1024).toFixed(2)}KB)`);
      }
      
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('❌ [LocalStorage] Cuota excedida, limpiando...');
        storage.cleanup();
        // Reintentar una vez
        try {
          localStorage.setItem(key, JSON.stringify({ value, timestamp: Date.now() }));
          return true;
        } catch (retryError) {
          console.error('❌ [LocalStorage] Fallo al reintentar:', retryError);
          return false;
        }
      }
      console.error('❌ [LocalStorage] Error guardando:', error);
      return false;
    }
  },

  /**
   * Obtener datos con validación de expiración
   */
  get: (key, maxAge = CONFIG.CACHE_DURATION) => {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const data = JSON.parse(item);
      const age = Date.now() - data.timestamp;
      
      // Verificar si está expirado
      if (age > maxAge) {
        if (CONFIG.DEBUG) {
          console.log(`⏰ [LocalStorage] Cache expirado: ${key} (${(age / 1000).toFixed(0)}s)`);
        }
        localStorage.removeItem(key);
        return null;
      }
      
      if (CONFIG.DEBUG) {
        console.log(`✅ [LocalStorage] Cache válido: ${key} (${(age / 1000).toFixed(0)}s)`);
      }
      
      return data.value;
    } catch (error) {
      console.error('❌ [LocalStorage] Error leyendo:', error);
      localStorage.removeItem(key); // Limpiar dato corrupto
      return null;
    }
  },

  /**
   * Eliminar entrada específica
   */
  remove: (key) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },

  /**
   * Limpiar datos antiguos y no usados
   */
  cleanup: () => {
    if (typeof window === 'undefined') return;
    
    try {
      const keys = Object.keys(localStorage);
      const now = Date.now();
      let cleaned = 0;
      
      keys.forEach(key => {
        if (!key.startsWith(STORAGE_PREFIX)) return;
        
        try {
          const item = localStorage.getItem(key);
          const data = JSON.parse(item);
          
          // Eliminar si tiene más de 24 horas
          if (now - data.timestamp > 86400000) {
            localStorage.removeItem(key);
            cleaned++;
          }
        } catch (e) {
          // Eliminar items corruptos
          localStorage.removeItem(key);
          cleaned++;
        }
      });
      
      console.log(`🧹 [LocalStorage] Limpieza: ${cleaned} items eliminados`);
    } catch (error) {
      console.error('❌ [LocalStorage] Error en limpieza:', error);
    }
  },

  /**
   * Obtener tamaño total usado
   */
  getSize: () => {
    if (typeof window === 'undefined') return 0;
    
    let total = 0;
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        total += localStorage.getItem(key).length;
      }
    });
    return total;
  }
};

/**
 * 🔄 Sistema de sincronización
 */
const sync = {
  /**
   * Comparar hashes para detectar cambios
   */
  hashContent: (content) => {
    const str = JSON.stringify(content);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
  },

  /**
   * Obtener versión del servidor (ETag o Last-Modified)
   */
  getServerVersion: async (pageKey) => {
    try {
      const response = await fetch(`/api/content?pageKey=${pageKey}`, {
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      return {
        etag: response.headers.get('ETag'),
        lastModified: response.headers.get('Last-Modified'),
        timestamp: Date.now()
      };
    } catch (error) {
      if (CONFIG.DEBUG) {
        console.error(`❌ [Sync] Error obteniendo versión del servidor:`, error);
      }
      return null;
    }
  },

  /**
   * Verificar si hay cambios en el servidor
   */
  hasChanges: async (pageKey) => {
    const localVersion = storage.get(`${METADATA_KEY}${pageKey}`);
    if (!localVersion) return true; // No hay versión local
    
    const serverVersion = await sync.getServerVersion(pageKey);
    if (!serverVersion) return false; // Error de red, mantener local
    
    // Comparar ETags o timestamps
    if (serverVersion.etag && localVersion.etag) {
      return serverVersion.etag !== localVersion.etag;
    }
    
    if (serverVersion.lastModified && localVersion.lastModified) {
      return serverVersion.lastModified !== localVersion.lastModified;
    }
    
    // Fallback: comparar por timestamp (menos preciso)
    return (serverVersion.timestamp - localVersion.timestamp) > 5000; // 5s de tolerancia
  },

  /**
   * Sincronizar una página específica
   */
  syncPage: async (pageKey) => {
    if (CONFIG.DEBUG) {
      console.log(`🔄 [Sync] Verificando cambios en: ${pageKey}`);
    }
    
    try {
      // 1. Verificar si hay cambios
      const hasChanges = await sync.hasChanges(pageKey);
      
      if (!hasChanges) {
        if (CONFIG.DEBUG) {
          console.log(`✅ [Sync] Sin cambios en: ${pageKey}`);
        }
        return { updated: false, pageKey };
      }
      
      if (CONFIG.DEBUG) {
        console.log(`📥 [Sync] Detectados cambios en: ${pageKey}, descargando...`);
      }
      
      // 2. Descargar contenido actualizado
      const response = await fetch(`/api/content?pageKey=${pageKey}`, {
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      const newContent = result.data;
      
      // 3. Obtener contenido local para comparación
      const oldContent = storage.get(`${CONTENT_KEY}${pageKey}`);
      
      // 4. Detectar campos específicos que cambiaron
      const changes = sync.detectChanges(oldContent, newContent);
      
      if (CONFIG.DEBUG && changes.length > 0) {
        console.log(`📝 [Sync] Campos actualizados en ${pageKey}:`, changes);
      }
      
      // 5. Actualizar localStorage
      storage.set(`${CONTENT_KEY}${pageKey}`, newContent);
      storage.set(`${METADATA_KEY}${pageKey}`, {
        etag: response.headers.get('ETag'),
        lastModified: response.headers.get('Last-Modified'),
        timestamp: Date.now(),
        hash: sync.hashContent(newContent)
      });
      
      // 6. Emitir evento de actualización
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('localstorage-sync', {
          detail: { 
            pageKey, 
            changes,
            content: newContent
          }
        }));
      }
      
      return { updated: true, pageKey, changes };
      
    } catch (error) {
      console.error(`❌ [Sync] Error sincronizando ${pageKey}:`, error);
      return { updated: false, pageKey, error: error.message };
    }
  },

  /**
   * Detectar diferencias entre dos objetos
   */
  detectChanges: (oldContent, newContent) => {
    const changes = [];
    
    if (!oldContent) {
      return Object.keys(newContent || {}).map(key => ({
        field: key,
        type: 'added',
        oldValue: null,
        newValue: newContent[key]
      }));
    }
    
    // Comparar campos
    const allKeys = new Set([
      ...Object.keys(oldContent || {}),
      ...Object.keys(newContent || {})
    ]);
    
    allKeys.forEach(key => {
      const oldValue = oldContent[key];
      const newValue = newContent[key];
      
      if (oldValue !== newValue) {
        changes.push({
          field: key,
          type: oldValue === undefined ? 'added' : newValue === undefined ? 'removed' : 'modified',
          oldValue,
          newValue
        });
      }
    });
    
    return changes;
  },

  /**
   * Sincronizar todas las páginas suscritas
   */
  syncAll: async () => {
    if (isSyncing) {
      if (CONFIG.DEBUG) {
        console.log('⏸️ [Sync] Sincronización ya en progreso, saltando...');
      }
      return;
    }
    
    if (subscribedPages.size === 0) {
      if (CONFIG.DEBUG) {
        console.log('⏸️ [Sync] No hay páginas suscritas');
      }
      return;
    }
    
    isSyncing = true;
    
    if (CONFIG.DEBUG) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`🔄 [Sync] Iniciando sincronización automática`);
      console.log(`📋 Páginas: ${Array.from(subscribedPages).join(', ')}`);
      console.log(`⏰ ${new Date().toLocaleTimeString()}`);
      console.log('='.repeat(60));
    }
    
    try {
      const results = await Promise.allSettled(
        Array.from(subscribedPages).map(pageKey => sync.syncPage(pageKey))
      );
      
      const updated = results.filter(r => r.status === 'fulfilled' && r.value.updated);
      
      if (CONFIG.DEBUG) {
        console.log(`✅ [Sync] Completado: ${updated.length}/${results.length} páginas actualizadas`);
        console.log('='.repeat(60));
      }
      
    } catch (error) {
      console.error('❌ [Sync] Error en sincronización:', error);
    } finally {
      isSyncing = false;
    }
  }
};

/**
 * 📡 API Pública del servicio
 */
export const localStorageService = {
  /**
   * Obtener contenido de una página
   */
  getPageContent: async (pageKey, fresh = false) => {
    if (typeof window === 'undefined') {
      // En servidor, delegar al servicio original
      const { localContentService } = await import('./localContentService');
      return localContentService.getPageContent(pageKey);
    }
    
    try {
      // 1. Si se solicita fresh, saltear cache
      if (!fresh) {
        const cached = storage.get(`${CONTENT_KEY}${pageKey}`);
        
        if (cached) {
          if (CONFIG.DEBUG) {
            console.log(`✅ [LocalStorageService] Contenido desde cache: ${pageKey}`);
          }
          return { data: cached, error: null, source: 'cache' };
        }
      }
      
      // 2. Fetch desde API (con timestamp para bypass de cache)
      if (CONFIG.DEBUG) {
        console.log(`🔄 [LocalStorageService] ${fresh ? 'FRESH fetch' : 'Cache miss, fetching'}: ${pageKey}`);
      }
      
      const timestamp = Date.now();
      const response = await fetch(`/api/content?pageKey=${pageKey}&fresh=${fresh}&_t=${timestamp}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      const content = result.data;
      
      // 3. Guardar en localStorage
      storage.set(`${CONTENT_KEY}${pageKey}`, content);
      storage.set(`${METADATA_KEY}${pageKey}`, {
        etag: response.headers.get('ETag'),
        lastModified: response.headers.get('Last-Modified'),
        timestamp,
        hash: sync.hashContent(content)
      });
      
      return { data: content, error: null, source: fresh ? 'fresh' : 'server' };
      
    } catch (error) {
      console.error(`❌ [LocalStorageService] Error obteniendo ${pageKey}:`, error);
      return { data: null, error, source: 'error' };
    }
  },

  /**
   * Obtener campo específico
   */
  getField: async (pageKey, fieldKey) => {
    const result = await localStorageService.getPageContent(pageKey);
    if (result.error) return { data: null, error: result.error };
    
    const value = result.data?.[fieldKey];
    return { data: value !== undefined ? value : null, error: null };
  },

  /**
   * Actualizar campo (invalida cache) con mutex para prevenir race conditions
   */
  updateField: async (pageKey, fieldKey, value) => {
    // Si hay una actualización pendiente para esta página, esperarla
    if (updateMutex.has(pageKey)) {
      if (CONFIG.DEBUG) {
        console.log(`⏳ [LocalStorageService] Esperando actualización anterior: ${pageKey}.${fieldKey}`);
      }
      await updateMutex.get(pageKey);
    }
    
    // Crear nueva promesa de actualización
    const updatePromise = (async () => {
      try {
        // Llamar al API para guardar
        const response = await fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pageKey, fieldKey, fieldValue: value })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        
        // Invalidar cache local para forzar recarga
        storage.remove(`${CONTENT_KEY}${pageKey}`);
        storage.remove(`${METADATA_KEY}${pageKey}`);
        
      // Forzar recarga inmediata del contenido actualizado con fresh=true
      try {
        const timestamp = Date.now();
        const freshResponse = await fetch(`/api/content?pageKey=${pageKey}&fresh=true&_t=${timestamp}`);
        if (freshResponse.ok) {
          const freshData = await freshResponse.json();
          if (freshData.success && freshData.data) {
            // Guardar en cache para que getContent lo encuentre inmediatamente
            storage.set(`${CONTENT_KEY}${pageKey}`, freshData.data);
            storage.set(`${METADATA_KEY}${pageKey}`, { timestamp });
            
            // CRÍTICO: Emitir evento para que componentes recarguen
            if (typeof window !== 'undefined') {
              const event = new CustomEvent('content-invalidated', {
                detail: { pageKey, fieldKey, value, timestamp }
              });
              window.dispatchEvent(event);
              
              if (CONFIG.DEBUG) {
                console.log(`📢 [LocalStorageService] Evento content-invalidated emitido:`, { pageKey, fieldKey });
              }
            }
          }
        }
      } catch (e) {
        console.warn('No se pudo recargar contenido fresh:', e);
      }
      
      if (CONFIG.DEBUG) {
        console.log(`✅ [LocalStorageService] Campo actualizado: ${pageKey}.${fieldKey}`);
      }
      
      return { data: result.data, error: null };      } catch (error) {
        console.error(`❌ [LocalStorageService] Error actualizando:`, error);
        return { data: null, error };
      } finally {
        // Limpiar mutex
        updateMutex.delete(pageKey);
      }
    })();
    
    // Guardar promesa en mutex
    updateMutex.set(pageKey, updatePromise);
    
    // Esperar y retornar resultado
    return updatePromise;
  },

  /**
   * Suscribirse a sincronización automática de una página
   */
  subscribe: (pageKey) => {
    if (typeof window === 'undefined') return;
    
    subscribedPages.add(pageKey);
    
    if (CONFIG.DEBUG) {
      console.log(`📡 [LocalStorageService] Suscrito: ${pageKey}`);
    }
    
    // Iniciar sincronización automática si no está activa
    localStorageService.startSync();
  },

  /**
   * Cancelar suscripción
   */
  unsubscribe: (pageKey) => {
    if (typeof window === 'undefined') return;
    
    subscribedPages.delete(pageKey);
    
    if (CONFIG.DEBUG) {
      console.log(`📴 [LocalStorageService] Desuscrito: ${pageKey}`);
    }
    
    // Detener sincronización si no hay suscriptores
    if (subscribedPages.size === 0) {
      localStorageService.stopSync();
    }
  },

  /**
   * Iniciar sincronización automática cada 60s
   */
  startSync: () => {
    if (typeof window === 'undefined') return;
    
    if (syncIntervalId) {
      if (CONFIG.DEBUG) {
        console.log('⚠️ [LocalStorageService] Sync ya activo');
      }
      return;
    }
    
    console.log('🚀 [LocalStorageService] Iniciando sincronización automática cada 60s');
    
    // Ejecutar inmediatamente
    sync.syncAll();
    
    // Y luego cada 60 segundos
    syncIntervalId = setInterval(() => {
      sync.syncAll();
    }, CONFIG.SYNC_INTERVAL);
  },

  /**
   * Detener sincronización automática
   */
  stopSync: () => {
    if (typeof window === 'undefined') return;
    
    if (syncIntervalId) {
      clearInterval(syncIntervalId);
      syncIntervalId = null;
      console.log('🛑 [LocalStorageService] Sincronización detenida');
    }
  },

  /**
   * Forzar sincronización manual
   */
  forceSync: async (pageKey = null) => {
    if (pageKey) {
      return await sync.syncPage(pageKey);
    } else {
      return await sync.syncAll();
    }
  },

  /**
   * Limpiar todo el cache
   */
  clearCache: () => {
    if (typeof window === 'undefined') return;
    
    const keys = Object.keys(localStorage);
    let cleared = 0;
    
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
        cleared++;
      }
    });
    
    console.log(`🧹 [LocalStorageService] Cache limpiado: ${cleared} items`);
  },

  /**
   * Obtener estadísticas del cache
   */
  getStats: () => {
    if (typeof window === 'undefined') return null;
    
    const size = storage.getSize();
    const keys = Object.keys(localStorage).filter(k => k.startsWith(STORAGE_PREFIX));
    
    return {
      size: size,
      sizeFormatted: `${(size / 1024).toFixed(2)} KB`,
      itemCount: keys.length,
      subscribedPages: Array.from(subscribedPages),
      syncActive: !!syncIntervalId,
      maxSize: CONFIG.MAX_STORAGE_SIZE,
      usage: ((size / CONFIG.MAX_STORAGE_SIZE) * 100).toFixed(2) + '%'
    };
  }
};

// Auto-limpieza al cargar
if (typeof window !== 'undefined') {
  // Limpiar datos antiguos al inicio
  setTimeout(() => storage.cleanup(), 1000);
  
  // Exponer en window para debugging (solo en modo debug)
  if (CONFIG.DEBUG) {
    window.__localStorageService = localStorageService;
    console.log('🐛 [LocalStorageService] Debug mode habilitado. Usa window.__localStorageService');
  }
}

export default localStorageService;
