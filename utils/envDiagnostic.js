// Diagnóstico de variables de entorno para debug en producción
export const envDiagnostic = () => {
  const diagnosticInfo = {
    nodeEnv: process.env.NODE_ENV,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    // Variables disponibles en el cliente
    allPublicEnvs: {}
  };

  // Obtener todas las variables NEXT_PUBLIC_ disponibles
  if (typeof window !== 'undefined') {
    Object.keys(process.env).forEach(key => {
      if (key.startsWith('NEXT_PUBLIC_')) {
        diagnosticInfo.allPublicEnvs[key] = process.env[key] ? 'SET' : 'EMPTY';
      }
    });
  }

  console.group('🔍 DIAGNÓSTICO DE VARIABLES DE ENTORNO');
  console.log('Entorno:', diagnosticInfo.nodeEnv);
  console.log('Supabase URL:', diagnosticInfo.supabaseUrl ? 'CONFIGURADA ✅' : 'FALTANTE ❌');
  console.log('Supabase ANON Key:', diagnosticInfo.supabaseKey ? 'CONFIGURADA ✅' : 'FALTANTE ❌');
  console.log('Base URL:', diagnosticInfo.baseUrl ? 'CONFIGURADA ✅' : 'FALTANTE ❌');
  console.log('Todas las variables públicas:', diagnosticInfo.allPublicEnvs);
  
  if (!diagnosticInfo.supabaseUrl || !diagnosticInfo.supabaseKey) {
    console.error('❌ PROBLEMA: Variables de Supabase no están disponibles en el cliente');
    console.error('Solución: Verificar configuración en Render y hacer redeploy');
  }
  console.groupEnd();

  return diagnosticInfo;
};