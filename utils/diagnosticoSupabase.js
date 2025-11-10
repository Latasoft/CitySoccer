// Diagnóstico completo de Supabase para debug en producción
import { createClient } from '@supabase/supabase-js';

export const diagnosticoSupabase = async () => {
  console.group('🔍 DIAGNÓSTICO COMPLETO DE SUPABASE');
  
  // 1. Variables de entorno
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('📊 Variables de entorno:');
  console.log('- URL:', supabaseUrl ? '✅ Configurada' : '❌ Faltante');
  console.log('- ANON Key:', supabaseKey ? '✅ Configurada' : '❌ Faltante');
  console.log('- URL completa:', supabaseUrl);
  console.log('- Key (primeros 20 chars):', supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'No disponible');
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables de entorno faltantes. No se puede continuar.');
    console.groupEnd();
    return { success: false, error: 'Variables faltantes' };
  }
  
  // 2. Crear cliente de Supabase
  let supabase;
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Cliente de Supabase creado correctamente');
  } catch (error) {
    console.error('❌ Error creando cliente de Supabase:', error);
    console.groupEnd();
    return { success: false, error: 'Error creando cliente' };
  }
  
  // 3. Test de conectividad básica
  console.log('\n🌐 Pruebas de conectividad:');
  
  try {
    // Test 1: Verificar que la URL responde
    const healthCheck = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseKey
      }
    });
    console.log('- Health check:', healthCheck.status === 200 ? '✅ OK' : `❌ Error ${healthCheck.status}`);
  } catch (error) {
    console.log('- Health check: ❌ Error de conexión');
  }
  
  // Test 2: Consulta a tabla precios
  try {
    const { data, error, count } = await supabase
      .from('precios')
      .select('tipo_cancha', { count: 'exact' })
      .limit(1);
    
    if (error) {
      console.log('- Consulta precios: ❌ Error:', error.message);
      console.log('- Detalles del error:', error);
    } else {
      console.log('- Consulta precios: ✅ Éxito');
      console.log('- Datos recibidos:', data);
      console.log('- Total registros:', count);
    }
  } catch (error) {
    console.log('- Consulta precios: ❌ Excepción:', error.message);
  }
  
  // Test 3: Consulta específica de futbol9
  try {
    const { data, error } = await supabase
      .from('precios')
      .select('*')
      .eq('tipo_cancha', 'futbol9')
      .limit(5);
    
    if (error) {
      console.log('- Consulta futbol9: ❌ Error:', error.message);
    } else {
      console.log('- Consulta futbol9: ✅ Éxito');
      console.log(`- Registros encontrados: ${data?.length || 0}`);
    }
  } catch (error) {
    console.log('- Consulta futbol9: ❌ Excepción:', error.message);
  }
  
  // Test 4: Verificar políticas RLS
  try {
    const { data, error } = await supabase
      .rpc('pg_policies')
      .select('*');
    
    if (error) {
      console.log('- Políticas RLS: ❌ No se pueden verificar');
    } else {
      console.log('- Políticas RLS: ✅ Accesibles');
    }
  } catch (error) {
    console.log('- Políticas RLS: ❌ Error verificando políticas');
  }
  
  console.groupEnd();
  return { success: true };
};

// Auto-ejecutar en el cliente
if (typeof window !== 'undefined') {
  // Ejecutar después de que la página cargue
  window.addEventListener('load', () => {
    setTimeout(diagnosticoSupabase, 1000);
  });
}
