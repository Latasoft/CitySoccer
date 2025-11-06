import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Debug mejorado para producción
if (typeof window !== 'undefined') {
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Supabase URL:', supabaseUrl ? 'Configured' : 'Missing');
  console.log('Supabase Key:', supabaseAnonKey ? 'Configured' : 'Missing');
  
  // Importar y ejecutar diagnóstico completo
  import('../utils/diagnosticoSupabase.js').then(({ diagnosticoSupabase }) => {
    diagnosticoSupabase();
  }).catch(console.error);
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey,
    env: process.env.NODE_ENV
  });
  throw new Error('Supabase configuration is incomplete');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});