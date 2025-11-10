/**
 * MIGRACIÓN USANDO SUPABASE MANAGEMENT API
 * 
 * Este script usa la Management API de Supabase que permite:
 * - Ejecutar SQL sin restricciones (DDL, DML, DCL)
 * - Crear y configurar proyectos programáticamente
 * - Gestionar storage, auth, y otros servicios
 * 
 * REQUISITOS:
 * 1. Configurar variables en .env.local:
 *    - OLD_SUPABASE_URL (BD origen)
 *    - OLD_SUPABASE_SERVICE_KEY (BD origen)
 *    - NEW_PROJECT_REF (ref del nuevo proyecto)
 *    - SUPABASE_ACCESS_TOKEN (Management API token)
 * 
 * DOCUMENTACIÓN:
 * https://supabase.com/docs/guides/platform/management-api
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// ==================== CONFIGURACIÓN ====================

// BD ANTIGUA (desde .env.local)
const OLD_SUPABASE_URL = process.env.OLD_SUPABASE_URL;
const OLD_SUPABASE_SERVICE_KEY = process.env.OLD_SUPABASE_SERVICE_KEY;

// CONFIGURACIÓN NUEVO PROYECTO (desde .env.local)
const NEW_PROJECT_REF = process.env.NEW_PROJECT_REF;
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

// Validación de variables requeridas
if (!OLD_SUPABASE_URL || !OLD_SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: Faltan variables de BD antigua en .env.local');
  console.error('   Requeridas: OLD_SUPABASE_URL, OLD_SUPABASE_SERVICE_KEY');
  process.exit(1);
}

if (!NEW_PROJECT_REF || !SUPABASE_ACCESS_TOKEN) {
  console.error('❌ Error: Faltan variables de migración en .env.local');
  console.error('   Requeridas: NEW_PROJECT_REF, SUPABASE_ACCESS_TOKEN');
  process.exit(1);
}

// Nueva URL se construye automáticamente
const NEW_SUPABASE_URL = `https://${NEW_PROJECT_REF}.supabase.co`;

// ==================== MANAGEMENT API ====================

const MANAGEMENT_API_BASE = 'https://api.supabase.com/v1';

async function executeSQL(projectRef, sql) {
  const response = await fetch(`${MANAGEMENT_API_BASE}/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SQL Execution failed: ${error}`);
  }

  return await response.json();
}

async function getProjectInfo(projectRef) {
  const response = await fetch(`${MANAGEMENT_API_BASE}/projects/${projectRef}`, {
    headers: {
      'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get project info: ${error}`);
  }

  return await response.json();
}

async function getProjectKeys(projectRef) {
  const response = await fetch(`${MANAGEMENT_API_BASE}/projects/${projectRef}/api-keys`, {
    headers: {
      'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get API keys: ${error}`);
  }

  return await response.json();
}

// ==================== FUNCIONES DE MIGRACIÓN ====================

async function limpiarBaseDatos(projectRef) {
  console.log('🧹 Limpiando base de datos (eliminando tablas existentes)...\n');
  
  const limpiarSQL = `
    -- Desactivar temporalmente las foreign keys
    SET session_replication_role = 'replica';
    
    -- Eliminar tablas en orden inverso
    DROP TABLE IF EXISTS reservas CASCADE;
    DROP TABLE IF EXISTS transactions CASCADE;
    DROP TABLE IF EXISTS clientes CASCADE;
    DROP TABLE IF EXISTS contenido_editable CASCADE;
    DROP TABLE IF EXISTS imagenes CASCADE;
    DROP TABLE IF EXISTS configuraciones CASCADE;
    DROP TABLE IF EXISTS precios CASCADE;
    DROP TABLE IF EXISTS canchas CASCADE;
    
    -- Reactivar foreign keys
    SET session_replication_role = 'origin';
  `;
  
  try {
    await executeSQL(projectRef, limpiarSQL);
    console.log('  ✅ Base de datos limpiada\n');
    return true;
  } catch (error) {
    console.error('  ⚠️  Error limpiando BD:', error.message.substring(0, 200));
    console.log('  ℹ️  Continuando con la migración...\n');
    return false;
  }
}

async function exportarDatos() {
  console.log('📦 Exportando datos de la BD antigua...\n');
  
  const oldSupabase = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_SERVICE_KEY);
  const tablas = ['clientes', 'canchas', 'precios', 'configuraciones', 
                  'imagenes', 'contenido_editable', 'transactions', 'reservas'];
  
  const datos = {};
  
  for (const tabla of tablas) {
    try {
      const { data, error } = await oldSupabase
        .from(tabla)
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      
      datos[tabla] = data;
      console.log(`  ✅ ${tabla}: ${data.length} registros`);
    } catch (error) {
      console.error(`  ❌ Error exportando ${tabla}:`, error.message);
      datos[tabla] = [];
    }
  }
  
  const backupPath = path.join(__dirname, '..', 'migration', 'backup_datos.json');
  fs.writeFileSync(backupPath, JSON.stringify(datos, null, 2));
  console.log(`\n💾 Backup guardado en: ${backupPath}\n`);
  
  return datos;
}

async function ejecutarScriptsSQL(projectRef) {
  console.log('🗃️  Ejecutando scripts SQL usando Management API...\n');
  
  const scriptsMigration = [
    { file: '01_crear_tablas.sql', desc: 'Crear tablas' },
    { file: '02_configurar_rls.sql', desc: 'Configurar RLS' }
    // NO ejecutar 03_insertar_datos_base.sql aquí - se ejecutará DESPUÉS de 04_migrar_datos
    // { file: '05_storage_setup.sql', desc: 'Configurar storage' } // Ya no existe este archivo
  ];
  
  const migrationDir = path.join(__dirname, '..', 'migration');
  
  for (const script of scriptsMigration) {
    const filePath = path.join(migrationDir, script.file);
    
    if (fs.existsSync(filePath)) {
      console.log(`🔧 Ejecutando: ${script.desc}...`);
      
      const sql = fs.readFileSync(filePath, 'utf8');
      
      try {
        await executeSQL(projectRef, sql);
        console.log(`  ✅ ${script.desc} - Completado\n`);
      } catch (error) {
        console.error(`  ❌ Error en ${script.desc}:`, error.message);
        
        // Intentar ejecutar statement por statement con preprocess para evitar
        // keywords que Management API/PG no acepta (por ejemplo: CREATE POLICY IF NOT EXISTS)
        console.log('  🔄 Intentando ejecutar por partes...');
        const statements = sql
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--'));
        
        for (let statement of statements) {
          try {
            // Normalizar CREATE POLICY IF NOT EXISTS -> CREATE POLICY
            statement = statement.replace(/CREATE\s+POLICY\s+IF\s+NOT\s+EXISTS/ig, 'CREATE POLICY');
            // Otros "IF NOT EXISTS" problemáticos pueden eliminarse igual
            statement = statement.replace(/IF\s+NOT\s+EXISTS/ig, '');

            await executeSQL(projectRef, statement + ';');
          } catch (stmtError) {
            console.error(`    ⚠️ Warning:`, stmtError.message.substring(0, 200));
          }
        }
        console.log(`  ✅ ${script.desc} - Completado con advertencias\n`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      console.log(`  ⚠️  ${script.file} no encontrado\n`);
    }
  }
}

async function insertarDatosSQL(projectRef, datos, newServiceKey) {
  console.log('📥 Insertando datos usando SQL...\n');
  
  const ordenTablas = [
    'canchas',
    'precios',
    'configuraciones',
    'imagenes',
    'contenido_editable',
    'clientes',
    'transactions',
    'reservas'
  ];
  
  for (const tabla of ordenTablas) {
    if (!datos[tabla] || datos[tabla].length === 0) {
      console.log(`  ⏭️  ${tabla}: sin datos para migrar`);
      continue;
    }
    
    console.log(`  📤 Insertando ${datos[tabla].length} registros en ${tabla}...`);
    
    try {
      // Generar SQL INSERT
      const registros = datos[tabla];
      const batchSize = 50;
      
      for (let i = 0; i < registros.length; i += batchSize) {
        const batch = registros.slice(i, i + batchSize);
        
        // Obtener columnas del primer registro
        const columnas = Object.keys(batch[0]);
        const columnasStr = columnas.join(', ');
        
        // Generar valores
        const valoresArr = batch.map(reg => {
          const valores = columnas.map(col => {
            const valor = reg[col];
            if (valor === null || valor === undefined) return 'NULL';
            if (typeof valor === 'string') {
              return `'${valor.replace(/'/g, "''")}'`;
            }
            if (valor instanceof Date) {
              return `'${valor.toISOString()}'`;
            }
            if (typeof valor === 'boolean') {
              return valor ? 'TRUE' : 'FALSE';
            }
            return valor;
          });
          return `(${valores.join(', ')})`;
        });
        
        const sql = `
          INSERT INTO ${tabla} (${columnasStr})
          VALUES ${valoresArr.join(',\n')}
          ON CONFLICT (id) DO UPDATE SET
          ${columnas.filter(c => c !== 'id').map(c => `${c} = EXCLUDED.${c}`).join(', ')};
        `;
        
        try {
          await executeSQL(projectRef, sql);
          console.log(`    ✅ Batch ${i}-${Math.min(i+batchSize, registros.length)} insertado`);
        } catch (error) {
          const errMsg = (error && error.message) ? error.message : String(error);
          console.error(`    ⚠️ Error en batch ${i}:`, errMsg.substring(0, 200));

          // Fallbacks para errores comunes:
          // - Duplicate key (23505): intentar insertar con DO NOTHING para evitar abortar todo
          if (/23505|duplicate key/i.test(errMsg)) {
            // Para tablas con unique constraints compuestos (precios, reservas), usar JS client directamente
            if (tabla === 'precios' || tabla === 'reservas') {
              console.log('    🔄 Intentando fallback con Supabase client (tabla con unique constraint compuesto)...');
              const newSupabase = createClient(NEW_SUPABASE_URL, newServiceKey);
              for (const registro of batch) {
                try {
                  const { error: upErr } = await newSupabase.from(tabla).upsert(registro, { 
                    onConflict: tabla === 'precios' ? 'tipo_cancha,dia_semana,hora' : 'cancha_id,fecha,hora_inicio',
                    ignoreDuplicates: false
                  });
                  if (upErr) {
                    // Si falla, intentar con ignoreDuplicates
                    const { error: upErr2 } = await newSupabase.from(tabla).upsert(registro, { 
                      ignoreDuplicates: true
                    });
                    if (upErr2 && !upErr2.message.includes('duplicate')) {
                      console.error(`      ⚠️ Registro duplicado (ignorado): ${registro.id}`);
                    }
                  }
                } catch (singleErr) {
                  console.error(`      ⚠️ Error upsert:`, (singleErr.message||String(singleErr)).substring(0,150));
                }
              }
              console.log(`    ✅ Fallback JS completado para batch ${i}`);
              continue;
            }
            
            // Para otras tablas, intentar ON CONFLICT (id) DO NOTHING
            const sqlDoNothing = sql.replace(/ON CONFLICT \(id\) DO UPDATE SET[\s\S]*/i, 'ON CONFLICT (id) DO NOTHING;');
            try {
              await executeSQL(projectRef, sqlDoNothing);
              console.log(`    ✅ Batch ${i} insertado con ON CONFLICT DO NOTHING`);
              continue;
            } catch (err2) {
              console.error(`    ❌ Fallback DO NOTHING falló:`, (err2.message||String(err2)).substring(0,200));
            }
          }

          // - Invalid input syntax (22P02) o problemas de casting: intentar usar JS client upsert
          if (/22P02|invalid input syntax/i.test(errMsg) || /cannot cast|invalid input/i.test(errMsg)) {
            console.log('    🔄 Intentando fallback con Supabase client (upsert por registro)...');
            const newSupabase = createClient(NEW_SUPABASE_URL, newServiceKey);
            for (const registro of batch) {
              try {
                // Para transactions y reservas, el cliente JS maneja mejor tipos UUID/timestamps
                const { error: upErr } = await newSupabase.from(tabla).upsert(registro, { onConflict: 'id' });
                if (upErr) {
                  console.error(`      ❌ Error insertando (fallback) ${registro.id || JSON.stringify(registro).slice(0,30)}:`, upErr.message);
                }
              } catch (singleErr) {
                console.error(`      ❌ Error upsert registro (fallback):`, (singleErr.message||String(singleErr)).substring(0,200));
              }
            }
            console.log(`    ✅ Fallback JS completado para batch ${i}`);
            continue;
          }

          console.error(`    ❌ Batch ${i} falló definitivamente (ver logs)`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      console.log(`  ✅ ${tabla} completado\n`);
    } catch (error) {
      console.error(`  ❌ Error insertando ${tabla}:`, error.message);
    }
  }
}

async function verificarMigracion(projectRef, newServiceKey) {
  console.log('🔍 Verificando migración...\n');
  
  const oldSupabase = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_SERVICE_KEY);
  const newSupabase = createClient(NEW_SUPABASE_URL, newServiceKey);
  
  const tablas = ['clientes', 'canchas', 'precios', 'configuraciones', 
                  'imagenes', 'contenido_editable', 'transactions', 'reservas'];
  
  const resultados = { exitosa: true, detalles: [] };
  
  for (const tabla of tablas) {
    try {
      const { count: oldCount } = await oldSupabase
        .from(tabla)
        .select('*', { count: 'exact', head: true });
      
      const { count: newCount } = await newSupabase
        .from(tabla)
        .select('*', { count: 'exact', head: true });
      
      const coincide = oldCount === newCount;
      resultados.detalles.push({
        tabla,
        registros_antiguos: oldCount,
        registros_nuevos: newCount,
        coincide
      });
      
      const icono = coincide ? '✅' : '⚠️';
      console.log(`  ${icono} ${tabla}: ${oldCount} → ${newCount}`);
      
      if (!coincide) resultados.exitosa = false;
    } catch (error) {
      console.error(`  ❌ Error verificando ${tabla}:`, error.message);
      resultados.exitosa = false;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  if (resultados.exitosa) {
    console.log('✅ ¡MIGRACIÓN EXITOSA! Todos los datos coinciden.');
  } else {
    console.log('⚠️  MIGRACIÓN PARCIAL: Revisar tablas con discrepancias.');
  }
  console.log('='.repeat(60) + '\n');
  
  return resultados;
}

// ==================== MIGRACIÓN DE STORAGE (USANDO CLIENT JS) ====================

async function migrarStorage(newServiceKey) {
  console.log('🖼️  Migrando archivos de storage (copiando del proyecto antiguo)...\n');
  try {
    const oldSupabase = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_SERVICE_KEY);
    const newSupabase = createClient(NEW_SUPABASE_URL, newServiceKey);

    // Intentar listar buckets comunes y el bucket público 'public-images' que usamos
    const bucket = 'public-images';
    
    const { data: files, error: listError } = await oldSupabase.storage.from(bucket).list();
    if (listError) {
      console.log('  ⚠️  No se pudo acceder al storage antiguo:', listError.message);
      return;
    }

    if (!files || files.length === 0) {
      console.log('  ℹ️  No hay archivos para migrar en storage\n');
      return;
    }

    console.log(`  📦 Encontrados ${files.length} archivos`);

    for (const file of files) {
      try {
        const { data: fileData, error: downloadError } = await oldSupabase.storage.from(bucket).download(file.name);
        if (downloadError) {
          console.error(`    ❌ Error descargando ${file.name}:`, downloadError.message);
          continue;
        }

        const { error: uploadError } = await newSupabase.storage.from(bucket).upload(file.name, fileData, { upsert: true });
        if (uploadError) {
          console.error(`    ❌ Error subiendo ${file.name}:`, uploadError.message);
          continue;
        }

        console.log(`    ✅ ${file.name} migrado`);
      } catch (err) {
        console.error(`    ❌ Error procesando ${file.name}:`, (err.message||String(err)).substring(0,200));
      }
    }

    // Actualizar referencias en la tabla imagenes si necesitan reescribirse
    try {
      const newSupabase = createClient(NEW_SUPABASE_URL, newServiceKey);
      const { data: imgs, error: imgErr } = await newSupabase.from('imagenes').select('*');
      if (!imgErr && imgs && imgs.length) {
        for (const img of imgs) {
          // Si la ruta referencia el bucket antiguo, no hacer nada. Si se requiere cambiar, implementar aquí.
        }
      }
    } catch (ignoreErr) {
      // noop
    }

    console.log('\n  ✅ Migración de storage completada\n');
  } catch (error) {
    console.error('  ❌ Error en migración de storage:', (error.message||String(error)).substring(0,200));
  }
}

// ==================== PROCESO PRINCIPAL ====================

async function ejecutarMigracionCompleta() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 MIGRACIÓN CON SUPABASE MANAGEMENT API');
  console.log('='.repeat(60) + '\n');
  
  // Validar configuración
  if (NEW_PROJECT_REF === 'tu-project-ref' || SUPABASE_ACCESS_TOKEN === 'TU-ACCESS-TOKEN') {
    console.error('❌ ERROR: Configuración incompleta\n');
    console.log('Pasos para configurar:');
    console.log('1. Crear nuevo proyecto en: https://supabase.com/dashboard');
    console.log('2. Obtener el Project Reference ID (Settings → General → Reference ID)');
    console.log('3. Crear Access Token: https://supabase.com/dashboard/account/tokens');
    console.log('4. Configurar variables de entorno:');
    console.log('   $env:NEW_PROJECT_REF="tu-project-ref"');
    console.log('   $env:SUPABASE_ACCESS_TOKEN="sbp_xxxxx"');
    console.log('   node utils/migrarConManagementAPI.js\n');
    process.exit(1);
  }
  
  try {
    // Obtener información del nuevo proyecto
    console.log('🔍 Verificando proyecto destino...\n');
    const projectInfo = await getProjectInfo(NEW_PROJECT_REF);
    console.log(`  ✅ Proyecto: ${projectInfo.name}`);
    console.log(`  ✅ Región: ${projectInfo.region}`);
    console.log(`  ✅ Status: ${projectInfo.status}\n`);
    
    // Obtener API keys
    console.log('🔑 Obteniendo API keys...\n');
    const keys = await getProjectKeys(NEW_PROJECT_REF);
    const serviceKey = keys.find(k => k.name === 'service_role')?.api_key;
    const anonKey = keys.find(k => k.name === 'anon')?.api_key;
    
    if (!serviceKey) {
      throw new Error('No se pudo obtener la service_role key');
    }
    
    console.log('  ✅ Keys obtenidas\n');
    
    // PASO 1: Exportar datos
    const datos = await exportarDatos();
    
    // PASO 2: Limpiar BD (eliminar tablas existentes)
    await limpiarBaseDatos(NEW_PROJECT_REF);
    
    // PASO 3: Ejecutar scripts SQL (crear estructura limpia)
    await ejecutarScriptsSQL(NEW_PROJECT_REF);
    
    // PASO 4: Insertar datos REALES primero (pasando serviceKey para fallback JS client)
    await insertarDatosSQL(NEW_PROJECT_REF, datos, serviceKey);
    
    // PASO 4.5: Ejecutar script de datos base (ON CONFLICT DO NOTHING preserva datos reales)
    console.log('📋 Ejecutando script de datos base (valores default)...\n');
    const scriptDatosBase = path.join(__dirname, '..', 'migration', '03_insertar_datos_base.sql');
    if (fs.existsSync(scriptDatosBase)) {
      const sql = fs.readFileSync(scriptDatosBase, 'utf8');
      try {
        await executeSQL(NEW_PROJECT_REF, sql);
        console.log('  ✅ Datos base insertados (con ON CONFLICT)\n');
      } catch (error) {
        console.log('  ⚠️  Advertencia en datos base:', error.message.substring(0, 200));
        console.log('  ℹ️  Continuando (datos reales ya insertados)...\n');
      }
    }
    
    // PASO 5: Migrar storage (copiar archivos)
    await migrarStorage(serviceKey);

    // PASO 6: Verificar
    const resultados = await verificarMigracion(NEW_PROJECT_REF, serviceKey);
    
    // Guardar reporte con credenciales
    const reportePath = path.join(__dirname, '..', 'migration', 'reporte_migracion_api.json');
    fs.writeFileSync(reportePath, JSON.stringify({
      fecha: new Date().toISOString(),
      resultados,
      origen: OLD_SUPABASE_URL,
      destino: NEW_SUPABASE_URL,
      credenciales: {
        url: NEW_SUPABASE_URL,
        anon_key: anonKey,
        service_role_key: serviceKey
      }
    }, null, 2));
    
    console.log(`📄 Reporte guardado en: ${reportePath}\n`);
    
    if (resultados.exitosa) {
      console.log('🎉 ¡MIGRACIÓN COMPLETADA EXITOSAMENTE!\n');
      console.log('📋 CREDENCIALES DEL NUEVO PROYECTO:');
      console.log('─'.repeat(60));
      console.log(`URL: ${NEW_SUPABASE_URL}`);
      console.log(`ANON KEY: ${anonKey}`);
      console.log(`SERVICE KEY: ${serviceKey}`);
      console.log('─'.repeat(60));
      console.log('\n📝 Actualizar .env.local:');
      console.log(`NEXT_PUBLIC_SUPABASE_URL=${NEW_SUPABASE_URL}`);
      console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}`);
      console.log(`SUPABASE_SERVICE_ROLE_KEY=${serviceKey}\n`);
    }
    
  } catch (error) {
    console.error('\n❌ ERROR CRÍTICO:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// ==================== EJECUCIÓN ====================

if (require.main === module) {
  ejecutarMigracionCompleta().catch(console.error);
}

module.exports = {
  exportarDatos,
  ejecutarScriptsSQL,
  insertarDatosSQL,
  verificarMigracion,
  ejecutarMigracionCompleta,
  executeSQL,
  getProjectInfo,
  getProjectKeys
};
