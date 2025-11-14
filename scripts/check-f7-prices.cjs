require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

(async () => {
  try {
    // Consultar todos los precios de F7 weekdays
    const { data, error } = await supabase
      .from('precios')
      .select('*')
      .eq('tipo_cancha', 'futbol7')
      .eq('dia_semana', 'weekdays')
      .order('hora');

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 PRECIOS FUTBOL7 WEEKDAYS EN BASE DE DATOS');
    console.log('='.repeat(50));
    console.log(`\nTotal de registros: ${data.length}`);
    
    console.log('\n📋 Listado completo:\n');
    data.forEach((p, idx) => {
      const activo = p.activo ? '✅' : '❌';
      console.log(`${idx + 1}. ${p.hora} -> $${p.precio.toLocaleString('es-CL')} ${activo} (ID: ${p.id})`);
    });

    // Buscar específicamente 09:00
    const precio09 = data.find(p => p.hora === '09:00:00' || p.hora === '09:00');
    
    console.log('\n' + '='.repeat(50));
    if (precio09) {
      console.log('✅ REGISTRO 09:00 ENCONTRADO:');
      console.log('='.repeat(50));
      console.log(JSON.stringify(precio09, null, 2));
    } else {
      console.log('❌ NO EXISTE REGISTRO PARA 09:00');
      console.log('='.repeat(50));
      console.log('\n⚠️  La hora 09:00 NO está configurada en la base de datos.');
      console.log('   Debes agregarla desde el dashboard de administrador.\n');
    }

    // Verificar si hay precios duplicados o inactivos
    const inactivos = data.filter(p => !p.activo);
    if (inactivos.length > 0) {
      console.log(`\n⚠️  Hay ${inactivos.length} precios INACTIVOS:`);
      inactivos.forEach(p => console.log(`   - ${p.hora}: $${p.precio.toLocaleString('es-CL')} (ID: ${p.id})`));
    }

  } catch (err) {
    console.error('❌ Error fatal:', err);
  }
})();
