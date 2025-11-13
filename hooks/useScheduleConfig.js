import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Cache global para configuración de horarios
let configCache = null;
let lastLoad = 0;
const CACHE_DURATION = 1 * 60 * 1000; // 1 minuto

/**
 * Hook para obtener configuración de horarios y días activos
 * @returns {object} { diasActivos, loading, error }
 */
export const useScheduleConfig = () => {
  const [diasActivos, setDiasActivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadConfig = async () => {
      // Verificar cache
      const now = Date.now();
      if (configCache && (now - lastLoad) < CACHE_DURATION) {
        if (mounted) {
          setDiasActivos(configCache);
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

        const { data, error: queryError } = await supabase
          .from('configuraciones')
          .select('valor')
          .eq('clave', 'dias_semana_activos')
          .single();

        if (queryError) throw queryError;

        let dias = [];
        if (data && data.valor) {
          try {
            dias = JSON.parse(data.valor);
          } catch (e) {
            console.error('Error parseando dias_semana_activos:', e);
            // Fallback: todos los días activos
            dias = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
          }
        } else {
          // Fallback: todos los días activos
          dias = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
        }

        if (mounted) {
          configCache = dias;
          lastLoad = now;
          setDiasActivos(dias);
        }
      } catch (err) {
        console.error('Error cargando configuración de horarios:', err);
        if (mounted) {
          setError(err.message);
          // Fallback: todos los días activos
          setDiasActivos(['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadConfig();

    return () => {
      mounted = false;
    };
  }, []);

  // Helpers para verificar si un día o grupo de días está activo
  const isWeekdaysActive = () => {
    const weekdays = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];
    return weekdays.some(dia => diasActivos.includes(dia));
  };

  const isSaturdayActive = () => diasActivos.includes('sábado');
  
  const isSundayActive = () => diasActivos.includes('domingo');

  return { 
    diasActivos, 
    loading, 
    error,
    isWeekdaysActive: isWeekdaysActive(),
    isSaturdayActive: isSaturdayActive(),
    isSundayActive: isSundayActive()
  };
};

/**
 * Función para invalidar el cache cuando se actualizan los horarios
 */
export const invalidateScheduleConfigCache = () => {
  configCache = null;
  lastLoad = 0;
};
