import React from 'react';
import { configService, pricesService, imageService, contentService } from './adminService';

// Cache para evitar múltiples llamadas a la API
let configCache = {};
let pricesCache = {};
let lastConfigLoad = 0;
let lastPricesLoad = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

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
      console.error('Error cargando configuraciones:', error);
      return getFallbackConfig();
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
      console.error('Error cargando precios:', error);
      return getFallbackPrices();
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
// CONFIGURACIONES POR DEFECTO (FALLBACK)
// ===============================================

function getFallbackConfig() {
  return {
    telefono_principal: '+56974265020',
    whatsapp: '+56974265020',
    email_principal: 'contacto@citysoccer.cl',
    direccion: 'Tiltil 2569, Macul',
    instagram: '@citysoccersantiago',
    facebook: 'CitySoccerSantiago',
    horario_semana: 'Lunes a Viernes: 9:00 - 23:00',
    horario_sabado: 'Sábados: 9:00 - 23:00',
    horario_domingo: 'Domingos: 9:00 - 23:00'
  };
}

function getFallbackPrices() {
  // Precios por defecto del archivo original
  return {
    futbol7: {
      name: "Fútbol 7",
      schedule: {
        weekdays: {
          "9:00": { price: 30000 },
          "10:00": { price: 30000 },
          "11:00": { price: 30000 },
          "12:00": { price: 30000 },
          "13:00": { price: 30000 },
          "14:00": { price: 30000 },
          "15:00": { price: 30000 },
          "16:00": { price: 30000 },
          "17:00": { price: 45000 },
          "18:00": { price: 50000 },
          "19:00": { price: 50000 },
          "20:00": { price: 50000 },
          "21:00": { price: 50000 },
          "22:00": { price: 50000 },
          "23:00": { price: 45000 }
        },
        saturday: {
          "9:00": { price: 30000 },
          "10:00": { price: 30000 },
          "11:00": { price: 30000 },
          "12:00": { price: 30000 },
          "13:00": { price: 30000 },
          "14:00": { price: 30000 },
          "15:00": { price: 30000 },
          "16:00": { price: 30000 },
          "17:00": { price: 45000 },
          "18:00": { price: 50000 },
          "19:00": { price: 50000 },
          "20:00": { price: 50000 },
          "21:00": { price: 50000 },
          "22:00": { price: 50000 },
          "23:00": { price: 45000 }
        },
        sunday: {
          "9:00": { price: 30000 },
          "10:00": { price: 30000 },
          "11:00": { price: 30000 },
          "12:00": { price: 30000 },
          "13:00": { price: 30000 },
          "14:00": { price: 30000 },
          "15:00": { price: 30000 },
          "16:00": { price: 30000 },
          "17:00": { price: 45000 },
          "18:00": { price: 50000 },
          "19:00": { price: 50000 },
          "20:00": { price: 50000 },
          "21:00": { price: 50000 },
          "22:00": { price: 50000 },
          "23:00": { price: 45000 }
        }
      },
      equipment: {
        rent_ball: { name: "Arriendo de Balón N4 y N5", price: 5000 },
        sell_ball: { name: "Venta de Balón N4 y N5", price: 20000 }
      }
    },
    futbol9: {
      name: "Fútbol 9",
      schedule: {
        weekdays: {
          "06:00": { price: 45000 },
          "07:00": { price: 45000 },
          "08:00": { price: 45000 },
          "09:00": { price: 65000 },
          "10:00": { price: 65000 },
          "11:00": { price: 65000 },
          "12:00": { price: 65000 },
          "13:00": { price: 65000 },
          "14:00": { price: 65000 },
          "15:00": { price: 65000 },
          "16:00": { price: 65000 },
          "17:00": { price: 75000 },
          "18:00": { price: 90000 },
          "19:00": { price: 90000 },
          "20:00": { price: 90000 },
          "21:00": { price: 90000 },
          "22:00": { price: 90000 },
          "23:00": { price: 75000 }
        },
        saturday: {
          "06:00": { price: 55000 },
          "09:00": { price: 65000 },
          "10:00": { price: 65000 },
          "11:00": { price: 65000 },
          "12:00": { price: 65000 },
          "13:00": { price: 65000 },
          "14:00": { price: 65000 },
          "15:00": { price: 65000 },
          "16:00": { price: 65000 },
          "17:00": { price: 75000 },
          "18:00": { price: 90000 },
          "19:00": { price: 90000 },
          "20:00": { price: 90000 },
          "21:00": { price: 90000 },
          "22:00": { price: 90000 },
          "23:00": { price: 75000 }
        },
        sunday: {
          "06:00": { price: 65000 },
          "09:00": { price: 65000 },
          "10:00": { price: 65000 },
          "11:00": { price: 65000 },
          "12:00": { price: 65000 },
          "13:00": { price: 65000 },
          "14:00": { price: 65000 },
          "15:00": { price: 65000 },
          "16:00": { price: 65000 },
          "17:00": { price: 75000 },
          "18:00": { price: 90000 },
          "19:00": { price: 90000 },
          "20:00": { price: 90000 },
          "21:00": { price: 90000 },
          "22:00": { price: 90000 },
          "23:00": { price: 75000 }
        }
      },
      equipment: {
        ball: { name: "Balón de Fútbol", price: 5000 },
        vest: { name: "Petos (juego completo)", price: 8000 }
      }
    },
    pickleball: {
      name: "Pickleball",
      schedule: {
        weekdays: {
          "06:00": { price: 15000 },
          "07:00": { price: 15000 },
          "08:00": { price: 15000 },
          "09:00": { price: 15000 },
          "10:00": { price: 15000 },
          "11:00": { price: 15000 },
          "12:00": { price: 15000 },
          "13:00": { price: 15000 },
          "14:00": { price: 15000 },
          "15:00": { price: 15000 },
          "16:00": { price: 15000 },
          "17:00": { price: 15000 },
          "18:00": { price: 15000 },
          "19:00": { price: 15000 },
          "20:00": { price: 15000 },
          "21:00": { price: 15000 },
          "22:00": { price: 15000 },
          "23:00": { price: 15000 }
        },
        saturday: {
          "06:00": { price: 20000 },
          "09:00": { price: 15000 },
          "10:00": { price: 15000 },
          "11:00": { price: 15000 },
          "12:00": { price: 15000 },
          "13:00": { price: 15000 },
          "14:00": { price: 15000 },
          "15:00": { price: 15000 },
          "16:00": { price: 15000 },
          "17:00": { price: 15000 },
          "18:00": { price: 15000 },
          "19:00": { price: 15000 },
          "20:00": { price: 15000 },
          "21:00": { price: 15000 },
          "22:00": { price: 15000 },
          "23:00": { price: 15000 }
        },
        sunday: {
          "06:00": { price: 25000 },
          "09:00": { price: 15000 },
          "10:00": { price: 15000 },
          "11:00": { price: 15000 },
          "12:00": { price: 15000 },
          "13:00": { price: 15000 },
          "14:00": { price: 15000 },
          "15:00": { price: 15000 },
          "16:00": { price: 15000 },
          "17:00": { price: 15000 },
          "18:00": { price: 15000 },
          "19:00": { price: 15000 },
          "20:00": { price: 15000 },
          "21:00": { price: 15000 },
          "22:00": { price: 15000 },
          "23:00": { price: 15000 }
        }
      }
    }
  };
}

// ===============================================
// HOOKS PERSONALIZADOS PARA REACT
// ===============================================

export const useConfig = (key = null) => {
  const [config, setConfig] = React.useState(key ? '' : {});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadConfig = async () => {
      setLoading(true);
      try {
        if (key) {
          const value = await dynamicConfigService.getConfig(key);
          setConfig(value);
        } else {
          const configs = await dynamicConfigService.getConfigurations();
          setConfig(configs);
        }
      } catch (error) {
        console.error('Error en useConfig:', error);
        setConfig(key ? '' : getFallbackConfig());
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [key]);

  return { config, loading, reload: () => loadConfig() };
};

export const usePrices = () => {
  const [prices, setPrices] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadPrices = async () => {
      setLoading(true);
      try {
        const pricesData = await dynamicConfigService.getPrices();
        setPrices(pricesData);
      } catch (error) {
        console.error('Error en usePrices:', error);
        setPrices(getFallbackPrices());
      } finally {
        setLoading(false);
      }
    };

    loadPrices();
  }, []);

  return { prices, loading, reload: () => loadPrices() };
};