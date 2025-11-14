/**
 * Script para hacer backup/dump de todas las tablas de Supabase
 * Guarda los datos en formato JSON
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Tablas a respaldar
const TABLAS = [
  'canchas',
  'cancha_grupos',
  'cancha_grupo_miembros',
  'clientes',
  'reservas',
  'precios',
  'configuraciones',
  'admin_users',
  'user_roles'
];

async function dumpTabla(nombreTabla) {
  try {
    console.log(`📦 Exportando ${nombreTabla}...`);
    
    const { data, error } = await supabase
      .from(nombreTabla)
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error(`  ❌ Error en ${nombreTabla}:`, error.message);
      return null;
    }

    console.log(`  ✅ ${data?.length || 0} registros exportados`);
    return data;

  } catch (error) {
    console.error(`  ❌ Excepción en ${nombreTabla}:`, error.message);
    return null;
  }
}

async function crearBackup() {
  console.log('🚀 Iniciando backup de Supabase...\n');

  const backup = {
    fecha: new Date().toISOString(),
    supabase_url: supabaseUrl,
    tablas: {}
  };

  for (const tabla of TABLAS) {
    const data = await dumpTabla(tabla);
    if (data !== null) {
      backup.tablas[tabla] = data;
    }
  }

  // Crear carpeta de backups si no existe
  const backupDir = join(__dirname, '..', 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // Guardar backup con timestamp
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const filename = `backup_${timestamp}.json`;
  const filepath = join(backupDir, filename);

  fs.writeFileSync(filepath, JSON.stringify(backup, null, 2), 'utf-8');

  console.log(`\n✅ Backup completado`);
  console.log(`📁 Archivo: ${filepath}`);
  
  // Estadísticas
  console.log('\n📊 Resumen:');
  for (const [tabla, datos] of Object.entries(backup.tablas)) {
    console.log(`  ${tabla}: ${datos.length} registros`);
  }

  // Crear también un backup "latest" para fácil referencia
  const latestPath = join(backupDir, 'backup_latest.json');
  fs.writeFileSync(latestPath, JSON.stringify(backup, null, 2), 'utf-8');
  console.log(`\n💾 Copia en: backups/backup_latest.json`);
}

async function restaurarBackup(filepath) {
  console.log(`🔄 Restaurando backup desde: ${filepath}\n`);

  if (!fs.existsSync(filepath)) {
    console.error('❌ Archivo no encontrado');
    process.exit(1);
  }

  const backup = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  console.log(`📅 Backup creado: ${backup.fecha}\n`);

  console.log('⚠️  ADVERTENCIA: Esta operación reemplazará TODOS los datos existentes');
  console.log('Presiona Ctrl+C para cancelar o espera 5 segundos...\n');
  await new Promise(resolve => setTimeout(resolve, 5000));

  for (const [tabla, datos] of Object.entries(backup.tablas)) {
    console.log(`📦 Restaurando ${tabla}...`);

    try {
      // Limpiar tabla
      const { error: deleteError } = await supabase
        .from(tabla)
        .delete()
        .neq('id', 0);

      if (deleteError) {
        console.error(`  ❌ Error limpiando ${tabla}:`, deleteError.message);
        continue;
      }

      if (datos.length > 0) {
        // Insertar datos
        const { error: insertError } = await supabase
          .from(tabla)
          .insert(datos);

        if (insertError) {
          console.error(`  ❌ Error insertando en ${tabla}:`, insertError.message);
          continue;
        }
      }

      console.log(`  ✅ ${datos.length} registros restaurados`);

    } catch (error) {
      console.error(`  ❌ Excepción en ${tabla}:`, error.message);
    }
  }

  console.log('\n✅ Restauración completada');
}

// CLI
const comando = process.argv[2];
const argumento = process.argv[3];

if (comando === 'dump' || !comando) {
  crearBackup();
} else if (comando === 'restore') {
  if (!argumento) {
    console.error('❌ Especifica el archivo a restaurar');
    console.error('Uso: node scripts/dump-supabase.js restore <archivo>');
    console.error('Ejemplo: node scripts/dump-supabase.js restore backups/backup_latest.json');
    process.exit(1);
  }
  restaurarBackup(argumento);
} else {
  console.error('❌ Comando inválido');
  console.error('Uso:');
  console.error('  Crear backup:    node scripts/dump-supabase.js dump');
  console.error('  Restaurar:       node scripts/dump-supabase.js restore <archivo>');
  process.exit(1);
}
