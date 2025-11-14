/**
 * Script para limpiar reservas de prueba en Supabase
 * Útil cuando se están probando cambios en la lógica de bloqueo de canchas
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno desde .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Usar service key para operaciones admin

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno');
  console.error('Asegúrate de tener en .env.local:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function limpiarReservas() {
  console.log('🧹 Iniciando limpieza de reservas...\n');

  try {
    // 1. Mostrar estadísticas actuales
    const { data: reservasActuales, error: errorCount } = await supabase
      .from('reservas')
      .select('id, fecha, hora_inicio, estado, canchas!inner(nombre, tipo)', { count: 'exact' });

    if (errorCount) throw errorCount;

    console.log(`📊 Reservas actuales: ${reservasActuales.length}`);
    
    if (reservasActuales.length > 0) {
      // Agrupar por estado
      const porEstado = reservasActuales.reduce((acc, r) => {
        acc[r.estado] = (acc[r.estado] || 0) + 1;
        return acc;
      }, {});

      console.log('Por estado:', porEstado);
      console.log('\n📋 Detalle de reservas:');
      reservasActuales.forEach(r => {
        console.log(`  - ID ${r.id}: ${r.canchas.nombre} (${r.canchas.tipo}) - ${r.fecha} ${r.hora_inicio} - Estado: ${r.estado}`);
      });
    }

    // 2. Preguntar confirmación
    console.log('\n⚠️  ¿Deseas eliminar TODAS las reservas?');
    console.log('Esta acción NO se puede deshacer.');
    console.log('Presiona Ctrl+C para cancelar o espera 5 segundos para continuar...\n');

    await new Promise(resolve => setTimeout(resolve, 5000));

    // 3. Eliminar todas las reservas
    const { error: deleteError } = await supabase
      .from('reservas')
      .delete()
      .neq('id', 0); // Condición que siempre es verdadera para eliminar todo

    if (deleteError) throw deleteError;

    console.log('✅ Todas las reservas han sido eliminadas');

    // 4. Verificar
    const { count: countDespues } = await supabase
      .from('reservas')
      .select('*', { count: 'exact', head: true });

    console.log(`\n📊 Reservas restantes: ${countDespues || 0}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

async function limpiarReservasPorFecha(fecha) {
  console.log(`🧹 Limpiando reservas para la fecha: ${fecha}\n`);

  try {
    const { data: reservas, error: errorSelect } = await supabase
      .from('reservas')
      .select('id, fecha, hora_inicio, canchas!inner(nombre, tipo)')
      .eq('fecha', fecha);

    if (errorSelect) throw errorSelect;

    if (!reservas || reservas.length === 0) {
      console.log('ℹ️  No hay reservas para esa fecha');
      return;
    }

    console.log(`📋 Reservas encontradas: ${reservas.length}`);
    reservas.forEach(r => {
      console.log(`  - ID ${r.id}: ${r.canchas.nombre} (${r.canchas.tipo}) - ${r.hora_inicio}`);
    });

    console.log('\n⚠️  Eliminando en 3 segundos...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    const { error: deleteError } = await supabase
      .from('reservas')
      .delete()
      .eq('fecha', fecha);

    if (deleteError) throw deleteError;

    console.log(`✅ ${reservas.length} reservas eliminadas para ${fecha}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Parsear argumentos de línea de comandos
const args = process.argv.slice(2);
const fecha = args[0]; // Formato: YYYY-MM-DD

if (fecha) {
  // Validar formato de fecha
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    console.error('❌ Formato de fecha inválido. Usa: YYYY-MM-DD');
    console.error('Ejemplo: node scripts/limpiar-reservas.js 2025-12-12');
    process.exit(1);
  }
  limpiarReservasPorFecha(fecha);
} else {
  limpiarReservas();
}
