-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN DE PERFORMANCE
-- =====================================================
-- Mejora velocidad de queries frecuentes en dashboard y frontend
-- Ejecutar después de 48_canchas_compartidas.sql
-- =====================================================

-- PRECIOS: Query más común es por tipo_cancha + dia_semana + hora
-- Dashboard: SELECT * FROM precios WHERE tipo_cancha = 'futbol7' ORDER BY dia_semana, hora
CREATE INDEX IF NOT EXISTS idx_precios_tipo_dia_hora 
ON precios(tipo_cancha, dia_semana, hora);

-- PRECIOS: Filtro por activo en frontend
CREATE INDEX IF NOT EXISTS idx_precios_activo 
ON precios(activo) WHERE activo = true;

-- PRECIOS: Búsqueda rápida para verificar disponibilidad
CREATE INDEX IF NOT EXISTS idx_precios_tipo_activo 
ON precios(tipo_cancha, activo) WHERE activo = true;

-- RESERVAS: Query más común es por fecha + cancha_id
-- Frontend: SELECT * FROM reservas WHERE fecha = '2025-12-12' AND cancha_id = 1
CREATE INDEX IF NOT EXISTS idx_reservas_fecha_cancha 
ON reservas(fecha, cancha_id);

-- RESERVAS: Dashboard busca por fecha para ver ocupación
CREATE INDEX IF NOT EXISTS idx_reservas_fecha 
ON reservas(fecha);

-- RESERVAS: Buscar reservas de un cliente
CREATE INDEX IF NOT EXISTS idx_reservas_cliente 
ON reservas(cliente_id);

-- CONFIGURACIONES: Búsqueda por clave (muy frecuente)
CREATE INDEX IF NOT EXISTS idx_configuraciones_clave 
ON configuraciones(clave);

-- CONFIGURACIONES: Filtro por categoría
CREATE INDEX IF NOT EXISTS idx_configuraciones_categoria 
ON configuraciones(categoria);

-- CANCHAS: Búsqueda por tipo (futbol7, futbol9, pickleball)
CREATE INDEX IF NOT EXISTS idx_canchas_tipo 
ON canchas(tipo);

-- CANCHAS: Búsqueda por tipo + activo
CREATE INDEX IF NOT EXISTS idx_canchas_tipo_activo 
ON canchas(tipo, activo) WHERE activo = true;

-- CANCHA_GRUPO_MIEMBROS: Búsqueda por grupo_id (verificar compartidas)
CREATE INDEX IF NOT EXISTS idx_cancha_grupo_miembros_grupo 
ON cancha_grupo_miembros(grupo_id);

-- CANCHA_GRUPO_MIEMBROS: Búsqueda por cancha_id (verificar si está en grupo)
CREATE INDEX IF NOT EXISTS idx_cancha_grupo_miembros_cancha 
ON cancha_grupo_miembros(cancha_id);

-- =====================================================
-- ANÁLISIS DE QUERIES LENTAS (Ejecutar periódicamente)
-- =====================================================

-- Ver estadísticas de uso de índices
SELECT 
  schemaname,
  relname as tablename,
  indexrelname as indexname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Ver tamaño de tablas e índices
SELECT 
  t.tablename,
  pg_size_pretty(pg_total_relation_size('"' || t.schemaname || '"."' || t.tablename || '"')) AS total_size,
  pg_size_pretty(pg_relation_size('"' || t.schemaname || '"."' || t.tablename || '"')) AS table_size,
  pg_size_pretty(pg_total_relation_size('"' || t.schemaname || '"."' || t.tablename || '"') - pg_relation_size('"' || t.schemaname || '"."' || t.tablename || '"')) AS indexes_size
FROM pg_tables t
WHERE t.schemaname = 'public'
ORDER BY pg_total_relation_size('"' || t.schemaname || '"."' || t.tablename || '"') DESC;
