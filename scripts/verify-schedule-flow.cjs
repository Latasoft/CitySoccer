/**
 * Script de Verificación del Flujo de Horarios y Precios
 * 
 * Verifica:
 * 1. HorariosAdmin guarda cambios en BD
 * 2. PricesAdmin usa horarios de BD
 * 3. ArrendamientoBase recibe precios actualizados
 * 4. Días bloqueados funcionan correctamente
 */

const fs = require('fs');
const path = require('path');

const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  details: []
};

function checkFile(filePath, checks) {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    results.failed++;
    results.details.push(`❌ Archivo no encontrado: ${filePath}`);
    return false;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  let allPassed = true;

  checks.forEach(check => {
    if (check.regex.test(content)) {
      results.passed++;
      results.details.push(`✅ ${check.description}`);
    } else {
      results.failed++;
      results.details.push(`❌ ${check.description}`);
      allPassed = false;
    }
  });

  return allPassed;
}

console.log('\n🔍 VERIFICACIÓN DEL FLUJO DE HORARIOS Y PRECIOS\n');
console.log('='.repeat(70));

// ============================================================================
// 1. VERIFICAR HORARIOSADMIN
// ============================================================================
console.log('\n📋 1. HorariosAdmin - Guardar configuración de horarios\n');

checkFile('app/dashboard/components/HorariosAdmin.jsx', [
  {
    regex: /supabase.*\.from\('configuraciones'\).*\.update.*horario_inicio/s,
    description: 'HorariosAdmin actualiza horario_inicio en BD'
  },
  {
    regex: /supabase.*\.from\('configuraciones'\).*\.update.*horario_fin/s,
    description: 'HorariosAdmin actualiza horario_fin en BD'
  },
  {
    regex: /invalidateScheduleConfigCache/,
    description: 'HorariosAdmin invalida caché de configuración'
  },
  {
    regex: /notifyScheduleChange/,
    description: 'HorariosAdmin notifica cambios de horarios'
  }
]);

// ============================================================================
// 2. VERIFICAR DÍAS BLOQUEADOS
// ============================================================================
console.log('\n📋 2. Días Bloqueados - Bloquear y desbloquear días\n');

checkFile('app/dashboard/components/HorariosAdmin.jsx', [
  {
    regex: /handleBloquearDia.*diasBloqueadosService\.create/s,
    description: 'HorariosAdmin puede bloquear días'
  },
  {
    regex: /handleDesbloquearDia.*diasBloqueadosService\.delete/s,
    description: 'HorariosAdmin puede desbloquear días'
  },
  {
    regex: /diasBloqueadosService\.getFuturos/,
    description: 'HorariosAdmin carga días bloqueados futuros'
  }
]);

// ============================================================================
// 3. VERIFICAR PRICESADMIN
// ============================================================================
console.log('\n📋 3. PricesAdmin - Usar horarios de la BD\n');

checkFile('app/dashboard/components/PricesAdminGrid.jsx', [
  {
    regex: /useScheduleConfig/,
    description: 'PricesAdmin usa hook useScheduleConfig'
  },
  {
    regex: /pricesService\.getAvailableHours/,
    description: 'PricesAdmin obtiene horarios disponibles'
  },
  {
    regex: /invalidatePricesCache/,
    description: 'PricesAdmin invalida caché de precios'
  },
  {
    regex: /notifyPriceChange/,
    description: 'PricesAdmin notifica cambios de precios'
  }
]);

// ============================================================================
// 4. VERIFICAR HOOK useScheduleConfig
// ============================================================================
console.log('\n📋 4. useScheduleConfig - Leer configuración de BD\n');

checkFile('hooks/useScheduleConfig.js', [
  {
    regex: /supabase.*\.from\('configuraciones'\).*dias_semana_activos/s,
    description: 'useScheduleConfig lee días activos de BD'
  },
  {
    regex: /isWeekdaysActive.*isSaturdayActive.*isSundayActive/s,
    description: 'useScheduleConfig expone métodos de días activos'
  },
  {
    regex: /const scheduleCache/,
    description: 'useScheduleConfig implementa caché'
  }
]);

// ============================================================================
// 5. VERIFICAR HOOK usePrices
// ============================================================================
console.log('\n📋 5. usePrices - Leer precios de BD\n');

checkFile('hooks/usePrices.js', [
  {
    regex: /obtenerTarifasPorTipo/,
    description: 'usePrices usa obtenerTarifasPorTipo'
  },
  {
    regex: /const pricesCache/,
    description: 'usePrices implementa caché'
  },
  {
    regex: /CACHE_DURATION/,
    description: 'usePrices tiene duración de caché configurada'
  }
]);

// ============================================================================
// 6. VERIFICAR SUPABASESERVICE
// ============================================================================
console.log('\n📋 6. supabaseService - Obtener tarifas de BD\n');

checkFile('app/arrendarcancha/data/supabaseService.js', [
  {
    regex: /obtenerTarifasPorTipo.*supabase.*\.from\('precios'\)/s,
    description: 'supabaseService obtiene tarifas de tabla precios'
  },
  {
    regex: /\.eq\('activo',\s*true\)/,
    description: 'supabaseService filtra solo precios activos'
  },
  {
    regex: /weekdays.*saturday.*sunday/s,
    description: 'supabaseService organiza tarifas por día de semana'
  }
]);

// ============================================================================
// 7. VERIFICAR ARRENDAMIENTOBASE
// ============================================================================
console.log('\n📋 7. ArrendamientoBase - Usar tarifas dinámicas\n');

checkFile('app/arrendarcancha/components/ArrendamientoBase.jsx', [
  {
    regex: /obtenerTarifasPorTipo/,
    description: 'ArrendamientoBase obtiene tarifas de BD'
  },
  {
    regex: /setTarifasReales/,
    description: 'ArrendamientoBase guarda tarifas en estado'
  },
  {
    regex: /tarifasReales/,
    description: 'ArrendamientoBase usa tarifasReales en componente'
  }
]);

// ============================================================================
// 8. VERIFICAR ADMINSERVICE
// ============================================================================
console.log('\n📋 8. adminService - Servicios de días bloqueados\n');

checkFile('lib/adminService.js', [
  {
    regex: /diasBloqueadosService.*create/s,
    description: 'adminService tiene método create para días bloqueados'
  },
  {
    regex: /diasBloqueadosService.*delete/s,
    description: 'adminService tiene método delete para días bloqueados'
  },
  {
    regex: /diasBloqueadosService.*getFuturos/s,
    description: 'adminService tiene método getFuturos para días bloqueados'
  }
]);

// ============================================================================
// VERIFICAR INVALIDACIÓN DE CACHÉ
// ============================================================================
console.log('\n📋 9. Invalidación de Caché - Propagación de cambios\n');

const cacheChecks = [
  {
    file: 'hooks/useScheduleConfig.js',
    check: {
      regex: /export.*invalidateScheduleConfigCache/,
      description: 'useScheduleConfig exporta función de invalidación'
    }
  },
  {
    file: 'hooks/usePrices.js',
    check: {
      regex: /export.*invalidatePricesCache/,
      description: 'usePrices exporta función de invalidación'
    }
  },
  {
    file: 'lib/dynamicConfigService.js',
    check: {
      regex: /invalidatePricesCache/,
      description: 'dynamicConfigService tiene invalidación de precios'
    }
  }
];

cacheChecks.forEach(({ file, check }) => {
  checkFile(file, [check]);
});

// ============================================================================
// RESUMEN
// ============================================================================
console.log('\n' + '='.repeat(70));
console.log('\n📊 RESUMEN DE VERIFICACIÓN\n');
console.log(`✅ Verificaciones exitosas: ${results.passed}`);
console.log(`❌ Verificaciones fallidas: ${results.failed}`);
console.log(`⚠️  Advertencias: ${results.warnings}`);

const total = results.passed + results.failed;
const percentage = total > 0 ? ((results.passed / total) * 100).toFixed(1) : 0;
console.log(`\n📈 Porcentaje de éxito: ${percentage}%\n`);

if (results.failed > 0) {
  console.log('⚠️  PROBLEMAS DETECTADOS:\n');
  results.details
    .filter(d => d.startsWith('❌'))
    .forEach(d => console.log(d));
  console.log('\n');
}

// ============================================================================
// DIAGRAMA DE FLUJO
// ============================================================================
console.log('='.repeat(70));
console.log('\n📋 FLUJO DE ACTUALIZACIÓN DE HORARIOS Y PRECIOS\n');
console.log(`
┌─────────────────────────────────────────────────────────────────┐
│                    DASHBOARD ADMINISTRADOR                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
    ┌─────────────────────────────────────────────────────┐
    │          1. HORARIOSADMIN COMPONENT                 │
    │  • Cambia horario_inicio / horario_fin              │
    │  • Cambia intervalo_reserva_minutos                 │
    │  • Activa/desactiva días de la semana               │
    │  • Bloquea/desbloquea días específicos              │
    └─────────────────────────────────────────────────────┘
                              │
                              ▼
    ┌─────────────────────────────────────────────────────┐
    │          2. GUARDAR EN SUPABASE                     │
    │  • Tabla: configuraciones                           │
    │    - horario_inicio                                 │
    │    - horario_fin                                    │
    │    - dias_semana_activos                            │
    │  • Tabla: dias_bloqueados                           │
    └─────────────────────────────────────────────────────┘
                              │
                              ▼
    ┌─────────────────────────────────────────────────────┐
    │       3. INVALIDAR CACHÉ                            │
    │  • invalidateScheduleConfigCache()                  │
    │  • notifyScheduleChange()                           │
    └─────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┴───────────────────┐
          ▼                                       ▼
┌───────────────────────┐           ┌───────────────────────┐
│  4. PRICESADMIN       │           │  5. TABLAS PRECIOS    │
│  • useScheduleConfig  │           │  • usePrices hook     │
│  • Muestra horarios   │           │  • Lee de BD          │
│    actualizados       │           │  • Organiza por día   │
└───────────────────────┘           └───────────────────────┘
          │                                       │
          ▼                                       ▼
┌───────────────────────┐           ┌───────────────────────┐
│  6. ACTUALIZAR        │           │  7. ARRENDAMIENTO     │
│     PRECIOS           │           │     BASE              │
│  • Guardar en tabla   │           │  • obtenerTarifas     │
│    'precios'          │           │  • Muestra horarios   │
│  • invalidateCache    │           │  • Calcula precios    │
└───────────────────────┘           └───────────────────────┘
                                              │
                                              ▼
                                    ┌───────────────────────┐
                                    │  8. RESERVA FINAL     │
                                    │  • Valida horario     │
                                    │  • Valida día         │
                                    │  • Aplica precio      │
                                    └───────────────────────┘
`);

console.log('='.repeat(70));
console.log('\n💡 COMPONENTES CRÍTICOS DEL FLUJO:\n');
console.log('1️⃣  HorariosAdmin: Configurar horarios y días activos');
console.log('2️⃣  PricesAdmin: Configurar precios por horario/día');
console.log('3️⃣  useScheduleConfig: Hook que lee configuración de horarios');
console.log('4️⃣  usePrices: Hook que lee precios de BD');
console.log('5️⃣  ArrendamientoBase: Componente que usa horarios y precios');
console.log('6️⃣  diasBloqueadosService: Bloquear días específicos');
console.log('7️⃣  Cache invalidation: Propagar cambios inmediatamente\n');

console.log('='.repeat(70));

process.exit(results.failed > 0 ? 1 : 0);
