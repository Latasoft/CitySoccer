#!/usr/bin/env node

// Script para verificar que las variables de entorno están correctamente configuradas
console.log('🔍 VERIFICANDO CONFIGURACIÓN DE VARIABLES DE ENTORNO...\n');

// Verificar variables locales
console.log('📁 Variables en .env.local:');
try {
  const fs = require('fs');
  const envLocal = fs.readFileSync('.env.local', 'utf8');
  const lines = envLocal.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  lines.forEach(line => {
    const [key] = line.split('=');
    console.log(`  ✅ ${key}`);
  });
} catch (error) {
  console.log('  ❌ No se pudo leer .env.local');
}

console.log('\n📁 Variables en .env.production:');
try {
  const fs = require('fs');
  const envProd = fs.readFileSync('.env.production', 'utf8');
  const lines = envProd.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  lines.forEach(line => {
    const [key] = line.split('=');
    console.log(`  ✅ ${key}`);
  });
} catch (error) {
  console.log('  ❌ No se pudo leer .env.production');
}

console.log('\n🌐 Variables públicas requeridas:');
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_BASE_URL'
];

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`  ❌ ${varName}: NO DEFINIDA`);
  }
});

console.log('\n📋 INSTRUCCIONES PARA RENDER:');
console.log('1. Ve a tu servicio en Render');
console.log('2. Environment → Environment Variables');
console.log('3. Verifica que estén estas variables:');
requiredVars.forEach(varName => {
  console.log(`   - ${varName}`);
});
console.log('4. Haz clic en "Manual Deploy" para forzar un nuevo build');
console.log('5. Verifica en los logs del build que las variables aparezcan');

console.log('\n🔧 Si el problema persiste:');
console.log('- Las variables deben existir ANTES del build');
console.log('- Render debe hacer un nuevo deploy DESPUÉS de agregar las variables');
console.log('- Verifica que no hay espacios extras en los nombres de las variables');