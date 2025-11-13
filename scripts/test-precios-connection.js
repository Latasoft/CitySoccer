/**
 * Script de diagnóstico para verificar la conexión a Supabase
 * y la carga de precios
 * 
 * Ejecutar: node scripts/test-precios-connection.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno no configuradas');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'OK' : 'FALTA');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? 'OK' : 'FALTA');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testPreciosConnection() {
  console.log('\n🔍 DIAGNÓSTICO DE CONEXIÓN A PRECIOS\n');
  console.log('='.repeat(50));

  const tiposCanchas = ['futbol7', 'futbol9', 'pickleball', 'pickleball-dobles'];

  for (const tipo of tiposCanchas) {
    console.log(`\n📊 Tipo de cancha: ${tipo}`);
    console.log('-'.repeat(50));

    try {
      // Query exacta que usa la aplicación
      const { data, error, count } = await supabase
        .from('precios')
        .select('*', { count: 'exact' })
        .eq('tipo_cancha', tipo)
        .eq('activo', true)
        .order('hora');

      if (error) {
        console.error('❌ Error de Supabase:', error);
        continue;
      }

      console.log(`✅ Registros encontrados: ${count || 0}`);

      if (data && data.length > 0) {
        // Agrupar por día
        const porDia = data.reduce((acc, p) => {
          acc[p.dia_semana] = (acc[p.dia_semana] || 0) + 1;
          return acc;
        }, {});

        console.log('📅 Distribución por día:', porDia);
        console.log('💵 Rango de precios:', {
          min: Math.min(...data.map(p => p.precio)),
          max: Math.max(...data.map(p => p.precio))
        });

        // Mostrar primeros 3 registros
        console.log('\n📝 Primeros 3 registros:');
        data.slice(0, 3).forEach((p, i) => {
          console.log(`  ${i + 1}. ${p.dia_semana} ${p.hora} - $${p.precio} (activo: ${p.activo})`);
        });
      } else {
        console.warn('⚠️ No hay datos para este tipo de cancha');
      }
    } catch (err) {
      console.error('❌ Error inesperado:', err.message);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('\n✅ Diagnóstico completado\n');
}

testPreciosConnection().catch(console.error);
