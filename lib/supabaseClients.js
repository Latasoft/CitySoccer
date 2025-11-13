/**
 * Gestión centralizada de clientes Supabase
 * Previene múltiples instancias y saturación de conexiones
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL no está configurada');
}

// Singleton: Cliente público (navegador y servidor)
let publicClient = null;

export function getSupabaseClient() {
  if (!publicClient) {
    if (!supabaseAnonKey) {
      throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY no está configurada');
    }

    publicClient = createClient(supabaseUrl, supabaseAnonKey, {
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
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }

  return publicClient;
}

// Singleton: Cliente con Service Role (solo servidor)
let serviceClient = null;

export function getSupabaseServiceClient() {
  // Validar que estamos en servidor
  if (typeof window !== 'undefined') {
    throw new Error('Service client solo puede usarse en el servidor');
  }

  if (!serviceClient) {
    if (!supabaseServiceKey) {
      throw new Error('SUPABASE_SERVICE_KEY no está configurada');
    }

    serviceClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'X-Client-Info': 'citysoccer-server',
        },
      },
    });
  }

  return serviceClient;
}

// Exportación por defecto: cliente público
export const supabase = getSupabaseClient();

// Cleanup (para graceful shutdown)
export async function cleanup() {
  // Supabase JS SDK no necesita cleanup explícito
  // Las conexiones se gestionan automáticamente con pooling
  console.log('Supabase clients: No cleanup needed (auto-managed)');
}
