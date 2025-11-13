import { useState, useEffect } from 'react';
import { obtenerTarifasPorTipo } from '@/app/arrendarcancha/data/supabaseService';

// Cache global para precios
let pricesCache = {};
let lastLoad = {};
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutos

/**
 * Hook para obtener precios de canchas con caché
 * Carga SOLO desde Supabase, sin fallbacks
 * 
 * @param {string} tipoCancha - Tipo de cancha (futbol7, futbol9, pickleball, pickleball-dobles)
 * @returns {object} { precios, loading, error }
 */
export const usePrices = (tipoCancha) => {
  const [precios, setPrecios] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true; // Prevenir updates en componentes desmontados

    const loadPrecios = async () => {
      if (!tipoCancha) {
        if (mounted) {
          setLoading(false);
          setError('Tipo de cancha no especificado');
        }
        return;
      }

      // Verificar cache
      const now = Date.now();
      const cachedData = pricesCache[tipoCancha];
      const lastLoadTime = lastLoad[tipoCancha] || 0;

      if (cachedData && (now - lastLoadTime) < CACHE_DURATION) {
        if (mounted) {
          setPrecios(cachedData);
          setLoading(false);
          setError(null);
        }
        return;
      }

      try {
        if (mounted) {
          setLoading(true);
          setError(null);
        }
        
        const data = await obtenerTarifasPorTipo(tipoCancha);
        
        console.log(`📦 Datos recibidos de Supabase para ${tipoCancha}:`, {
          hasData: !!data,
          weekdaysCount: data?.weekdays ? Object.keys(data.weekdays).length : 0,
          saturdayCount: data?.saturday ? Object.keys(data.saturday).length : 0,
          sundayCount: data?.sunday ? Object.keys(data.sunday).length : 0,
          sampleWeekday: data?.weekdays ? Object.entries(data.weekdays)[0] : null,
          sampleSaturday: data?.saturday ? Object.entries(data.saturday)[0] : null
        });
        
        if (!data || !data.weekdays || Object.keys(data.weekdays).length === 0) {
          throw new Error(`No hay precios configurados en la base de datos para el tipo de cancha: ${tipoCancha}`);
        }
        
        if (mounted) {
          // Guardar en cache SOLO si el componente está montado
          pricesCache[tipoCancha] = data;
          lastLoad[tipoCancha] = now;
          
          setPrecios(data);
          setError(null);
        }
      } catch (err) {
        console.error(`❌ Error cargando precios para ${tipoCancha}:`, err);
        if (mounted) {
          setError(err.message || 'Error cargando precios desde la base de datos');
          setPrecios(null);
          // Limpiar cache corrupto
          delete pricesCache[tipoCancha];
          delete lastLoad[tipoCancha];
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadPrecios();

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, [tipoCancha]);

  return { precios, loading, error };
};

/**
 * Función para invalidar el cache de precios
 * Útil después de actualizar precios en el dashboard
 */
export const invalidatePricesCache = (tipoCancha) => {
  if (tipoCancha) {
    delete pricesCache[tipoCancha];
    delete lastLoad[tipoCancha];
    console.log(`🗑️ Cache invalidado para: ${tipoCancha}`);
  } else {
    pricesCache = {};
    lastLoad = {};
    console.log('🗑️ Todo el cache de precios ha sido invalidado');
  }
};
