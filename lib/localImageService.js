/**
 * Servicio para gestionar imágenes locales y dinámicas
 * Usa persistent disk de Render para almacenamiento
 */

export const localImageService = {
  /**
   * Subir imagen a /public/uploads/images/
   */
  upload: async (file, categoria, fileName) => {
    try {
      console.log(`📤 Subiendo imagen: ${fileName} - Categoría: ${categoria}`);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('categoria', categoria);
      formData.append('fileName', fileName);
      
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Error al subir imagen: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      console.log(`✅ Imagen subida:`, result.data.url);
      
      return { data: result.data, error: null };
    } catch (error) {
      console.error('❌ Error subiendo imagen:', error);
      return { data: null, error };
    }
  },

  /**
   * Obtener imágenes por categoría desde /public/uploads/images/{categoria}/
   */
  getByCategory: async (categoria) => {
    try {
      const response = await fetch(`/api/images?categoria=${categoria}`);
      
      if (!response.ok) {
        throw new Error(`Error obteniendo imágenes: ${response.statusText}`);
      }
      
      const result = await response.json();
      return { data: result.data || [], error: null };
    } catch (error) {
      console.error(`Error obteniendo imágenes de ${categoria}:`, error);
      return { data: [], error };
    }
  },

  /**
   * Obtener imagen principal de una categoría (la más reciente)
   */
  getPrimaryImage: async (categoria) => {
    try {
      const { data, error } = await localImageService.getByCategory(categoria);
      
      if (error || !data || data.length === 0) {
        return { data: null, error: error || new Error('No images found') };
      }
      
      // Retornar la primera (más reciente)
      return { data: data[0], error: null };
    } catch (error) {
      console.error(`Error obteniendo imagen principal de ${categoria}:`, error);
      return { data: null, error };
    }
  },

  /**
   * Obtener URL de imagen o fallback
   */
  getImageUrl: (imageData, fallbackUrl = '/imgPrincipal.jpeg') => {
    if (!imageData || !imageData.url) {
      return fallbackUrl;
    }
    return imageData.url;
  },

  /**
   * Eliminar imagen
   */
  delete: async (imageUrl) => {
    try {
      const response = await fetch('/api/upload/image', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl })
      });
      
      if (!response.ok) {
        throw new Error(`Error eliminando imagen: ${response.statusText}`);
      }
      
      const result = await response.json();
      return { data: result.data, error: null };
    } catch (error) {
      console.error('Error eliminando imagen:', error);
      return { data: null, error };
    }
  }
};
