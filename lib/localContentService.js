/**
 * Servicio para gestionar contenido editable usando archivos JSON locales
 * Reemplaza la dependencia de Supabase para contenido estático
 */

export const localContentService = {
  /**
   * Obtener todo el contenido de una página
   */
  getPageContent: async (pageKey) => {
    try {
      const debugMode = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';
      
      if (debugMode) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`📄 CARGANDO PÁGINA: ${pageKey}`);
        console.log(`Timestamp: ${new Date().toISOString()}`);
        console.log('='.repeat(60));
      }
      
      const response = await fetch(`/api/content?pageKey=${pageKey}`);
      
      if (!response.ok) {
        throw new Error(`Error al cargar contenido: ${response.statusText}`);
      }
      
      const result = await response.json();
      const data = result.data;
      
      if (debugMode) {
        console.log(`✅ Contenido cargado:`, Object.keys(data).length, 'campos');
        console.table(data);
        console.log('='.repeat(60));
      }
      
      return { data, error: null };
    } catch (error) {
      console.error(`❌ Error cargando ${pageKey}:`, error);
      return { data: null, error };
    }
  },

  // Alias para compatibilidad
  getContent: async (pageKey) => {
    return localContentService.getPageContent(pageKey);
  },

  /**
   * Actualizar un campo específico
   */
  updateField: async (pageKey, fieldKey, fieldValue) => {
    try {
      const debugMode = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';
      
      if (debugMode) {
        console.log(`\n${'~'.repeat(60)}`);
        console.log(`✏️ GUARDANDO: ${pageKey}.${fieldKey}`);
        // Manejar arrays y objetos correctamente
        if (typeof fieldValue === 'object') {
          console.log(`Valor: [Objeto/Array con ${Array.isArray(fieldValue) ? fieldValue.length : Object.keys(fieldValue).length} elementos]`);
        } else {
          console.log(`Valor: ${String(fieldValue).substring(0, 100)}...`);
        }
        console.log('~'.repeat(60));
      }
      
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pageKey, fieldKey, fieldValue })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      
      if (debugMode) {
        console.log(`✅ GUARDADO EXITOSO`);
        console.log('~'.repeat(60));
      }
      
      return { data: result.data, error: null };
    } catch (error) {
      console.error(`❌ Error guardando ${pageKey}.${fieldKey}:`, error);
      return { data: null, error };
    }
  },

  /**
   * Subir archivo (imagen o video)
   */
  uploadFile: async (file, category = 'general') => {
    try {
      const debugMode = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';
      
      if (debugMode) {
        console.log(`\n${'~'.repeat(60)}`);
        console.log(`📤 SUBIENDO ARCHIVO: ${file.name}`);
        console.log(`Categoría: ${category}`);
        console.log(`Tamaño: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
        console.log('~'.repeat(60));
      }
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Error al subir archivo: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (debugMode) {
        console.log(`✅ ARCHIVO SUBIDO:`, result.data.url);
        console.log('~'.repeat(60));
      }
      
      return { data: result.data, error: null };
    } catch (error) {
      console.error('❌ Error subiendo archivo:', error);
      return { data: null, error };
    }
  }
};
