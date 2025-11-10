-- =====================================================
-- SCRIPT 6: ÍNDICES PARA MEJORAR PERFORMANCE
-- Optimizar consultas de disponibilidad de reservas
-- =====================================================

-- Índice compuesto para búsquedas de disponibilidad
-- Acelera las queries: WHERE cancha_id = X AND fecha = Y AND hora_inicio = Z
CREATE INDEX IF NOT EXISTS idx_reservas_disponibilidad 
ON reservas(cancha_id, fecha, hora_inicio) 
WHERE estado != 'cancelada';

-- Índice para búsquedas por transaction_id (webhook)
CREATE INDEX IF NOT EXISTS idx_reservas_transaction 
ON reservas(transaction_id);

-- Índice para búsquedas por estado y fecha (reportes)
CREATE INDEX IF NOT EXISTS idx_reservas_estado_fecha 
ON reservas(estado, fecha);

-- Índice para búsquedas de transacciones por order_id (webhook)
CREATE INDEX IF NOT EXISTS idx_transactions_order_id 
ON transactions(order_id);

-- Índice para búsquedas de transacciones por estado
CREATE INDEX IF NOT EXISTS idx_transactions_status 
ON transactions(status);

-- Índice para búsquedas de clientes por correo
CREATE INDEX IF NOT EXISTS idx_clientes_correo 
ON clientes(correo);

COMMENT ON INDEX idx_reservas_disponibilidad IS 'Acelera verificación de disponibilidad (excluye canceladas)';
COMMENT ON INDEX idx_reservas_transaction IS 'Acelera búsqueda de reservas por transacción';
COMMENT ON INDEX idx_reservas_estado_fecha IS 'Acelera reportes y filtros por estado y fecha';
COMMENT ON INDEX idx_transactions_order_id IS 'Acelera búsqueda de transacciones en webhook';
COMMENT ON INDEX idx_transactions_status IS 'Acelera filtros por estado de transacción';
COMMENT ON INDEX idx_clientes_correo IS 'Acelera búsqueda de clientes por email';

-- Analizar tablas para actualizar estadísticas del query planner
ANALYZE reservas;
ANALYZE transactions;
ANALYZE clientes;
ANALYZE canchas;
ANALYZE precios;
