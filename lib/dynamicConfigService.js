import React from 'react';
import { configService, pricesService, imageService, contentService } from './adminService';

// Cache para evitar múltiples llamadas a la API
let configCache = {};
let pricesCache = {};
let lastConfigLoad = 0;
let lastPricesLoad = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Función para invalidar cache manualmente
export const invalidateCache = () => {
  configCache = {};
  pricesCache = {};
  lastConfigLoad = 0;
  lastPricesLoad = 0;
};

// Función para invalidar solo cache de precios
export const invalidatePricesCache = () => {
  pricesCache = {};
  lastPricesLoad = 0;
};

// Función para invalidar solo cache de configuraciones
export const invalidateConfigCache = () => {
  configCache = {};
  lastConfigLoad = 0;
};

// ===============================================
// SERVICIO PARA CARGAR CONFIGURACIONES DINÁMICAS
// ===============================================

export const dynamicConfigService = {
  // Obtener configuraciones con cache
  getConfigurations: async () => {
    const now = Date.now();
    
    // Si el cache es válido, usarlo
    if (configCache && Object.keys(configCache).length > 0 && (now - lastConfigLoad) < CACHE_DURATION) {
      return configCache;
    }

    try {
      const { data, error } = await configService.getAll();
      if (error) throw error;

      // Convertir array a objeto para fácil acceso
      const configObj = {};
      data.forEach(config => {
        configObj[config.clave] = config.valor;
      });

      configCache = configObj;
      lastConfigLoad = now;
      
      return configObj;
    } catch (error) {
      console.error('❌ Error cargando configuraciones desde BD:', error);
      throw new Error('No se pudieron cargar las configuraciones. Por favor verifica la conexión a la base de datos.');
    }
  },

  // Obtener precios con cache
  getPrices: async () => {
    const now = Date.now();
    
    // Si el cache es válido, usarlo
    if (pricesCache && Object.keys(pricesCache).length > 0 && (now - lastPricesLoad) < CACHE_DURATION) {
      return pricesCache;
    }

    try {
      const { data, error } = await pricesService.getAll();
      if (error) throw error;

      // Convertir a formato similar al pricesData.js original
      const pricesObj = {
        futbol7: { name: "Fútbol 7", schedule: { weekdays: {}, saturday: {}, sunday: {} }, equipment: {} },
        futbol9: { name: "Fútbol 9", schedule: { weekdays: {}, saturday: {}, sunday: {} }, equipment: {} },
        pickleball: { name: "Pickleball", schedule: { weekdays: {}, saturday: {}, sunday: {} } }
      };

      data.forEach(precio => {
        if (pricesObj[precio.tipo_cancha] && pricesObj[precio.tipo_cancha].schedule[precio.dia_semana]) {
          pricesObj[precio.tipo_cancha].schedule[precio.dia_semana][precio.hora] = { price: precio.precio };
        }
      });

      pricesCache = pricesObj;
      lastPricesLoad = now;
      
      return pricesObj;
    } catch (error) {
      console.error('❌ Error cargando precios desde BD:', error);
      throw new Error('No se pudieron cargar los precios. Por favor verifica la conexión a la base de datos.');
    }
  },

  // Obtener una configuración específica
  getConfig: async (key) => {
    const configs = await dynamicConfigService.getConfigurations();
    return configs[key] || '';
  },

  // Invalidar cache
  invalidateCache: () => {
    configCache = {};
    pricesCache = {};
    lastConfigLoad = 0;
    lastPricesLoad = 0;
  },

  // Obtener imágenes por categoría
  getImages: async (categoria = null) => {
    try {
      const { data, error } = categoria 
        ? await imageService.getByCategory(categoria)
        : await imageService.getAll();
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error cargando imágenes:', error);
      return [];
    }
  },

  // Obtener contenido por sección
  getContent: async (seccion = null) => {
    try {
      const { data, error } = seccion 
        ? await contentService.getBySection(seccion)
        : await contentService.getAll();
      
      if (error) throw error;
      
      // Convertir a objeto para fácil acceso
      const contentObj = {};
      data.forEach(content => {
        contentObj[`${content.seccion}_${content.clave}`] = content.contenido;
      });
      
      return contentObj;
    } catch (error) {
      console.error('Error cargando contenido:', error);
      return {};
    }
  }
};

// ===============================================
// HOOKS PERSONALIZADOS PARA REACT
// ===============================================

export const useConfig = (key = null) => {
  const [config, setConfig] = React.useState(key ? '' : {});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const loadConfig = async () => {
      setLoading(true);
      setError(null);
      try {
        if (key) {
          const value = await dynamicConfigService.getConfig(key);
          setConfig(value);
        } else {
          const configs = await dynamicConfigService.getConfigurations();
          setConfig(configs);
        }
      } catch (err) {
        console.error('❌ Error en useConfig:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [key]);

  return { config, loading, error };
};

export const usePrices = () => {
  const [prices, setPrices] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const loadPrices = async () => {
      setLoading(true);
      setError(null);
      try {
        const pricesData = await dynamicConfigService.getPrices();
        setPrices(pricesData);
      } catch (err) {
        console.error('❌ Error en usePrices:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPrices();
  }, []);

  return { prices, loading, error, reload: () => loadPrices() };
};