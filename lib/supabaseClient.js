import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Debug solo en desarrollo
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Supabase URL:', supabaseUrl ? 'Configured' : 'Missing');
  console.log('Supabase Key:', supabaseAnonKey ? 'Configured' : 'Missing');
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey,
    env: process.env.NODE_ENV
  });
  throw new Error('Supabase configuration is incomplete');
}

// Configuración optimizada para alto tráfico
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'citysoccer-web',
    },
  },
  // Configuración de realtime (desactivar si no se usa para ahorrar recursos)
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Helper para queries con retry automático y timeout
export const executeQuery = async (queryFn, options = {}) => {
  const {
    maxRetries = 3,
    timeout = 10000,
    retryDelay = 1000,
    onRetry = null,
  } = options;

  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Crear promise con timeout
      const queryPromise = queryFn();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Query timeout')), timeout)
      );

      const result = await Promise.race([queryPromise, timeoutPromise]);
      
      // Verificar errores de Supabase
      if (result.error) {
        throw result.error;
      }

      return result;
    } catch (error) {
      lastError = error;
      
      // No reintentar en ciertos errores
      const noRetryErrors = ['PGRST116', '23505', '23503']; // Not found, unique violation, foreign key violation
      if (noRetryErrors.some(code => error.code === code || error.message?.includes(code))) {
        throw error;
      }

      // Si no es el último intento, esperar antes de reintentar
      if (attempt < maxRetries) {
        if (onRetry) onRetry(attempt, error);
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      }
    }
  }

  throw lastError;
};

// Helper para queries batch con control de concurrencia
export const executeBatch = async (queries, options = {}) => {
  const { concurrency = 5 } = options;
  const results = [];
  
  for (let i = 0; i < queries.length; i += concurrency) {
    const batch = queries.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(
      batch.map(query => executeQuery(query))
    );
    results.push(...batchResults);
  }
  
  return results;
};

// Cleanup function para cerrar conexiones (llamar en shutdown)
export const cleanup = async () => {
  try {
    // Cerrar subscripciones de realtime si existen
    const channels = supabase.getChannels();
    await Promise.all(channels.map(channel => supabase.removeChannel(channel)));
    
    console.log('Supabase cleanup completed');
  } catch (error) {
    console.error('Error during Supabase cleanup:', error);
  }
};