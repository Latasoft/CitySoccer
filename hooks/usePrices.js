import { useState, useEffect } from 'react';
import { obtenerTarifasPorTipo } from '@/app/arrendarcancha/data/supabaseService';

// Cache global con timestamp para evitar re-cargas innecesarias durante re-renders
let pricesCache = {};
let lastLoad = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Hook para obtener precios de canchas CON CACHE INTELIGENTE
 * Cache de 5 minutos para evitar parpadeo en re-renders
 * Se invalida cuando admin actualiza precios desde dashboard
 * Sin fallbacks - Error si no hay precios configurados
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

      try {
        // Verificar cache válido (menos de 5 minutos)
        const now = Date.now();
        const cached = pricesCache[tipoCancha];
        const lastLoadTime = lastLoad[tipoCancha] || 0;
        const cacheIsValid = cached && (now - lastLoadTime) < CACHE_DURATION;

        if (cacheIsValid) {
          console.log(`♻️ Usando cache para ${tipoCancha} (${Math.round((now - lastLoadTime) / 1000)}s de antigüedad)`);
          if (mounted) {
            setPrecios(cached);
            setLoading(false);
            setError(null);
          }
          return;
        }

        if (mounted) {
          setLoading(true);
          setError(null);
        }
        
        // Cargar desde BD y cachear
        console.log(`🔄 Cargando precios FRESCOS para ${tipoCancha} desde BD`);
        const data = await obtenerTarifasPorTipo(tipoCancha);
        
        // Actualizar cache
        pricesCache[tipoCancha] = data;
        lastLoad[tipoCancha] = now;
        
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
          setPrecios(data);
          setError(null);
        }
      } catch (err) {
        console.error(`❌ Error cargando precios para ${tipoCancha}:`, err);
        if (mounted) {
          setError(err.message || 'Error cargando precios desde la base de datos');
          setPrecios(null);
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
 * Función para invalidar cache cuando admin actualiza precios
 * Se llama desde PricesAdminGrid después de guardar cambios
 */
export const invalidatePricesCache = (tipoCancha = null) => {
  if (tipoCancha) {
    console.log(`🗑️ Invalidando cache de precios para ${tipoCancha}`);
    delete pricesCache[tipoCancha];
    delete lastLoad[tipoCancha];
  } else {
    console.log('🗑️ Invalidando TODO el cache de precios');
    pricesCache = {};
    lastLoad = {};
  }
};
