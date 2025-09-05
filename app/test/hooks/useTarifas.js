'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { filterByModalidad } from '../data/canchaConfig';

export function useTarifas(tipoCancha) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTarifas() {
      try {
        setLoading(true);
        
        // Determinar el tipo de cancha base y modalidad
        let canchaBase = tipoCancha;
        let modalidad = null;
        
        if (tipoCancha === 'pickleball-individual') {
          canchaBase = 'pickleball';
          modalidad = 'individual';
        } else if (tipoCancha === 'pickleball-dobles') {
          canchaBase = 'pickleball';
          modalidad = 'dobles';
        }

        const { data: result, error } = await supabase
          .from('tarifas')
          .select()
          .eq('tipo_cancha', canchaBase);
        
        if (error) throw error;
        
        // Filtrar por modalidad si es necesario
        const filteredData = modalidad ? filterByModalidad(result, modalidad) : result;
        setData(filteredData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    if (tipoCancha) {
      fetchTarifas();
    }
  }, [tipoCancha]);

  return { data, error, loading };
}