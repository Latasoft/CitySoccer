'use client';

// Servicio para cargar imágenes dinámicas del admin
import { supabase } from './supabaseClient';
import { useState, useEffect, useCallback } from 'react';

export const dynamicImageService = {
  // Obtener imágenes por categoría para uso público (ordenadas por más reciente)
  getImagesByCategory: async (categoria) => {
    try {
      const { data, error } = await supabase
        .from('imagenes')
        .select('*')
        .eq('categoria', categoria)
        .order('creado_en', { ascending: false }); // Más reciente primero
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error obteniendo imágenes de ${categoria}:`, error);
      return [];
    }
  },

  // Obtener imagen principal de una categoría (la más reciente)
  getPrimaryImage: async (categoria) => {
    try {
      const images = await dynamicImageService.getImagesByCategory(categoria);
      return images.length > 0 ? images[0] : null; // Ahora toma la más reciente
    } catch (error) {
      console.error(`Error obteniendo imagen principal de ${categoria}:`, error);
      return null;
    }
  },

  // Generar URL de imagen o fallback
  getImageUrl: (imageData, fallbackUrl = '/imgPrincipal.jpeg') => {
    if (!imageData || !imageData.url) {
      return fallbackUrl;
    }
    return imageData.url;
  },

  // Obtener todas las imágenes de hero/portada
  getHeroImages: async () => {
    return await dynamicImageService.getImagesByCategory('hero');
  },

  // Obtener imágenes de canchas
  getCanchasImages: async () => {
    return await dynamicImageService.getImagesByCategory('canchas');
  },

  // Obtener imágenes de eventos
  getEventosImages: async () => {
    return await dynamicImageService.getImagesByCategory('eventos');
  },

  // Obtener logos
  getLogos: async () => {
    return await dynamicImageService.getImagesByCategory('logos');
  },

  // Obtener imágenes de equipos
  getEquiposImages: async () => {
    return await dynamicImageService.getImagesByCategory('equipos');
  },

  // Forzar recarga de imágenes (limpiar caché)
  forceReload: () => {
    // Disparar evento personalizado para forzar recarga
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('force-image-reload'));
    }
  }
};

// Hook para cargar múltiples imágenes de una categoría
export const useDynamicImages = (categoria) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadImages = useCallback(async () => {
    try {
      setLoading(true);
      
      // Timeout de seguridad: después de 3 segundos, forzar que termine loading
      const timeoutId = setTimeout(() => {
        console.warn(`⚠️ Timeout cargando imágenes de ${categoria}`);
        setLoading(false);
      }, 3000);
      
      const data = await dynamicImageService.getImagesByCategory(categoria);
      clearTimeout(timeoutId);
      setImages(data);
      setLoading(false);
    } catch (err) {
      console.error('Error cargando imágenes:', err);
      setLoading(false); // Asegurar que loading termine incluso con error
    }
  }, [categoria]);

  useEffect(() => {
    loadImages();

    // Escuchar evento de recarga forzada
    const handleForceReload = () => {
      loadImages();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('force-image-reload', handleForceReload);
      return () => {
        window.removeEventListener('force-image-reload', handleForceReload);
      };
    }
  }, [categoria, loadImages]);

  return { images, loading };
};

// Hook para cargar una imagen principal de una categoría
export const usePrimaryImage = (categoria, fallbackUrl = '/imgPrincipal.jpeg') => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadImage = useCallback(async () => {
    try {
      setLoading(true);
      
      // Timeout de seguridad: después de 3 segundos, forzar que termine loading
      const timeoutId = setTimeout(() => {
        console.warn(`⚠️ Timeout cargando imagen de ${categoria}, usando fallback`);
        setLoading(false);
      }, 3000);
      
      const data = await dynamicImageService.getPrimaryImage(categoria);
      clearTimeout(timeoutId);
      setImage(data);
      setLoading(false);
    } catch (err) {
      console.error('Error cargando imagen principal:', err);
      setLoading(false); // Asegurar que loading termine incluso con error
    }
  }, [categoria]);

  useEffect(() => {
    loadImage();

    // Escuchar evento de recarga forzada
    const handleForceReload = () => {
      loadImage();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('force-image-reload', handleForceReload);
      return () => {
        window.removeEventListener('force-image-reload', handleForceReload);
      };
    }
  }, [categoria, loadImage]);

  const imageUrl = dynamicImageService.getImageUrl(image, fallbackUrl);
  return { image, imageUrl, loading };
};