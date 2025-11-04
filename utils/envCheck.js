// Utilidad para verificar variables de entorno
export const checkEnvironmentVariables = () => {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing);
    console.log('📝 Current environment:', process.env.NODE_ENV);
    console.log('🔍 Available variables:', Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')));
    return false;
  }

  console.log('✅ All required environment variables are configured');
  return true;
};

// Verificar en desarrollo
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  checkEnvironmentVariables();
}