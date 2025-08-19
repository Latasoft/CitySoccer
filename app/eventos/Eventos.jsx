'use client';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Eventos() {
  useEffect(() => {
    const checkConnection = async () => {
      const { data, error } = await supabase.from('clientes').select('*').limit(1);
      if (error) {
        console.error("❌ Error Supabase:", error.message);
      } else {
        console.log("✅ Conexión Supabase OK:", data);
      }
    };
    checkConnection();
  }, []);

  return <h1>Probando conexión con Supabase...</h1>;
}