-- ========================================
-- OPTIMIZACIÓN DE BASE DE DATOS - ÍNDICES
-- ========================================
-- Crear índices para mejorar performance con miles de usuarios

-- 1. ÍNDICES PARA TABLA RESERVAS
-- La tabla más consultada del sistema

-- Índice para búsquedas por fecha (descendente para queries de "más recientes")
CREATE INDEX IF NOT EXISTS idx_reservas_fecha 
ON reservas(fecha DESC);

-- Índice para filtrar por estado
CREATE INDEX IF NOT EXISTS idx_reservas_estado 
ON reservas(estado);

-- Índice compuesto para cancha + fecha (query muy común)
CREATE INDEX IF NOT EXISTS idx_reservas_cancha_fecha 
ON reservas(cancha_id, fecha DESC);

-- Índice para búsquedas por cliente
CREATE INDEX IF NOT EXISTS idx_reservas_cliente_id 
ON reservas(cliente_id);

-- Índice para ordenar por fecha de creación
CREATE INDEX IF NOT EXISTS idx_reservas_creado_en 
ON reservas(creado_en DESC);

-- Índice compuesto para filtros combinados (fecha + estado)
CREATE INDEX IF NOT EXISTS idx_reservas_fecha_estado 
ON reservas(fecha DESC, estado);

-- Índice para búsquedas por hora (útil para conflictos de horario)
CREATE INDEX IF NOT EXISTS idx_reservas_cancha_fecha_hora 
ON reservas(cancha_id, fecha, hora_inicio);

-- 2. ÍNDICES PARA TABLA CLIENTES

-- Índice único para correo (búsqueda rápida y validación)
CREATE INDEX IF NOT EXISTS idx_clientes_correo 
ON clientes(correo);

-- Índice para búsqueda por teléfono
CREATE INDEX IF NOT EXISTS idx_clientes_telefono 
ON clientes(telefono);

-- Índice para búsqueda por nombre (LOWER para case-insensitive)
CREATE INDEX IF NOT EXISTS idx_clientes_nombre_lower 
ON clientes(LOWER(nombre));

-- Índice para ordenar por fecha de creación
CREATE INDEX IF NOT EXISTS idx_clientes_creado_en 
ON clientes(creado_en DESC);

-- 3. ÍNDICES PARA TABLA CANCHAS

-- Índice para filtrar por tipo
CREATE INDEX IF NOT EXISTS idx_canchas_tipo 
ON canchas(tipo);

-- Índice para búsqueda por nombre
CREATE INDEX IF NOT EXISTS idx_canchas_nombre 
ON canchas(nombre);

-- Índice para filtrar por estado activo (columna: activo)
CREATE INDEX IF NOT EXISTS idx_canchas_activo 
ON canchas(activo);

-- 4. ÍNDICES PARA TABLA PRECIOS

-- Índice para búsqueda por tipo de cancha
CREATE INDEX IF NOT EXISTS idx_precios_tipo_cancha 
ON precios(tipo_cancha);

-- Índice para filtrar por día de semana
CREATE INDEX IF NOT EXISTS idx_precios_dia_semana 
ON precios(dia_semana);

-- Índice compuesto para búsqueda común (tipo + día + hora)
CREATE INDEX IF NOT EXISTS idx_precios_tipo_dia_hora 
ON precios(tipo_cancha, dia_semana, hora);

-- Índice para filtrar precios activos
CREATE INDEX IF NOT EXISTS idx_precios_activo 
ON precios(activo);

-- 5. ÍNDICES PARA TABLA ADMIN_USERS

-- Índice para búsqueda rápida por user_id
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id 
ON admin_users(user_id);

-- Índice para filtrar por estado activo
CREATE INDEX IF NOT EXISTS idx_admin_users_activo 
ON admin_users(activo);

-- 6. ÍNDICES PARA TABLA CONFIGURACIONES

-- Índice para búsqueda por clave (aunque ya debería ser único)
CREATE INDEX IF NOT EXISTS idx_configuraciones_clave 
ON configuraciones(clave);

-- Índice para filtrar por categoría
CREATE INDEX IF NOT EXISTS idx_configuraciones_categoria 
ON configuraciones(categoria);

-- 7. ÍNDICES PARA TABLA DIAS_BLOQUEADOS

-- Índice para búsqueda por fecha (ya existe UNIQUE, pero confirmamos)
CREATE INDEX IF NOT EXISTS idx_dias_bloqueados_fecha 
ON dias_bloqueados(fecha);

-- Índice simple para ordenamiento (sin predicate CURRENT_DATE)
CREATE INDEX IF NOT EXISTS idx_dias_bloqueados_fecha_desc 
ON dias_bloqueados(fecha DESC);

-- 8. ÍNDICES PARA PÁGINAS CMS (si aplica)

-- Para tabla pages
CREATE INDEX IF NOT EXISTS idx_pages_slug 
ON pages(slug);

-- Índice para páginas publicadas (columna correcta: publicada)
CREATE INDEX IF NOT EXISTS idx_pages_publicada 
ON pages(publicada);

-- Índice para páginas activas
CREATE INDEX IF NOT EXISTS idx_pages_activa 
ON pages(activa);

-- Para tabla page_sections
CREATE INDEX IF NOT EXISTS idx_page_sections_page_id 
ON page_sections(page_id);

CREATE INDEX IF NOT EXISTS idx_page_sections_orden 
ON page_sections(page_id, orden);

-- Índice para secciones activas
CREATE INDEX IF NOT EXISTS idx_page_sections_activa 
ON page_sections(activa);

-- 9. ANALIZAR TABLAS
-- Actualizar estadísticas para el query planner

ANALYZE reservas;
ANALYZE clientes;
ANALYZE canchas;
ANALYZE precios;
ANALYZE admin_users;
ANALYZE configuraciones;
ANALYZE dias_bloqueados;
ANALYZE pages;
ANALYZE page_sections;

-- 10. CONFIGURAR AUTOVACUUM AGRESIVO
-- Para tablas con mucho INSERT/UPDATE/DELETE

ALTER TABLE reservas SET (
  autovacuum_vacuum_scale_factor = 0.1,
  autovacuum_analyze_scale_factor = 0.05
);

ALTER TABLE clientes SET (
  autovacuum_vacuum_scale_factor = 0.1,
  autovacuum_analyze_scale_factor = 0.05
);

-- 10. CONFIGURAR TIMEOUTS
-- Evitar queries que se cuelguen indefinidamente

ALTER DATABASE postgres SET statement_timeout = '30s';
ALTER DATABASE postgres SET idle_in_transaction_session_timeout = '60s';

-- 11. VERIFICAR ÍNDICES CREADOS
-- Query para ver todos los índices

SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 12. VERIFICAR TAMAÑO DE ÍNDICES
-- Para monitorear crecimiento

SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS indexes_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 13. QUERIES LENTAS (para debugging)
-- Activar logging de queries lentas

ALTER DATABASE postgres SET log_min_duration_statement = '1000'; -- Log queries > 1 segundo

-- NOTAS:
-- - Ejecutar este script en Supabase SQL Editor
-- - Los índices mejoran SELECT pero pueden hacer INSERT/UPDATE más lentos
-- - Monitorear el uso de índices con pg_stat_user_indexes
-- - Cache hit ratio debe ser > 95% (revisar en Supabase Reports)
