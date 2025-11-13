-- =====================================================
-- CONSTRAINT ÚNICO PARA PREVENIR DOBLES RESERVAS
-- =====================================================
-- Este constraint garantiza que no puedan existir dos
-- reservas activas para la misma cancha, fecha y hora
--
-- Ejecutar en: Supabase Dashboard > SQL Editor

-- 1. VERIFICAR DUPLICADOS EXISTENTES
SELECT 
  cancha_id,
  fecha,
  hora_inicio,
  COUNT(*) as cantidad,
  array_agg(id) as reserva_ids,
  array_agg(estado) as estados
FROM reservas
WHERE estado != 'cancelada'
GROUP BY cancha_id, fecha, hora_inicio
HAVING COUNT(*) > 1
ORDER BY fecha DESC, hora_inicio;

-- Si hay duplicados, decides cuál mantener y cancelar el resto:
-- UPDATE reservas SET estado = 'cancelada' WHERE id IN (...);

-- 2. CREAR ÍNDICE ÚNICO PARCIAL
-- Solo aplica a reservas no canceladas
CREATE UNIQUE INDEX IF NOT EXISTS idx_reservas_unique_slot
ON reservas (cancha_id, fecha, hora_inicio)
WHERE estado != 'cancelada';

-- 3. VERIFICAR QUE SE CREÓ
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'reservas'
AND indexname = 'idx_reservas_unique_slot';

-- =====================================================
-- EXPLICACIÓN
-- =====================================================
--
-- Este índice único garantiza que:
-- ✅ NO pueden existir 2 reservas con:
--    - Misma cancha
--    - Misma fecha
--    - Misma hora_inicio
--    - Estado != 'cancelada'
--
-- ✅ PostgreSQL rechazará el INSERT automáticamente
--    si ya existe una reserva activa
--
-- ✅ Previene race conditions entre múltiples usuarios
--    intentando reservar al mismo tiempo
--
-- ✅ Las reservas canceladas NO cuentan (pueden repetirse)
--
-- =====================================================
-- MANEJO DE ERRORES EN EL CÓDIGO
-- =====================================================
--
-- Cuando PostgreSQL rechaza el insert, retorna:
-- Error code: 23505 (unique_violation)
--
-- El código debe detectar esto y enviar email de reembolso
--
-- =====================================================

