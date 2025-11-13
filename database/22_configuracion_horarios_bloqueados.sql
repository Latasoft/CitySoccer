-- ========================================
-- CONFIGURACIÓN DE HORARIOS Y DÍAS BLOQUEADOS
-- ========================================
-- Sistema para gestionar disponibilidad de canchas

-- 1. Tabla de Días Bloqueados
CREATE TABLE IF NOT EXISTS dias_bloqueados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fecha DATE NOT NULL UNIQUE,
    motivo VARCHAR(255),
    bloqueado_por VARCHAR(255),
    creado_en TIMESTAMP DEFAULT NOW()
);


-- 2. Agregar configuraciones de horario a tabla configuraciones
-- Insertar o actualizar configuraciones de horario
INSERT INTO configuraciones (clave, valor, descripcion, categoria, tipo)
VALUES
  ('horario_inicio', '09:00', 'Hora de inicio de operaciones (formato HH:MM 24hrs)', 'horarios', 'texto'),
  ('horario_fin', '23:00', 'Hora de fin de operaciones (formato HH:MM 24hrs)', 'horarios', 'texto'),
  ('intervalo_reserva_minutos', '60', 'Duración de cada bloque de reserva en minutos', 'horarios', 'numero'),
  ('dias_semana_activos', '["lunes","martes","miércoles","jueves","viernes","sábado","domingo"]', 'Días de la semana activos para reservas (JSON array)', 'horarios', 'texto')
ON CONFLICT (clave) 
DO UPDATE SET 
  valor = EXCLUDED.valor,
  descripcion = EXCLUDED.descripcion,
  actualizado_en = NOW();

-- 3. Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_dias_bloqueados_fecha ON dias_bloqueados(fecha);

-- 4. RLS (Row Level Security) para dias_bloqueados
ALTER TABLE dias_bloqueados ENABLE ROW LEVEL SECURITY;

-- Política: Solo admins pueden ver días bloqueados
CREATE POLICY "Admins pueden ver días bloqueados"
ON dias_bloqueados FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid() AND activo = true
  )
);

-- Política: Solo admins pueden crear días bloqueados
CREATE POLICY "Admins pueden crear días bloqueados"
ON dias_bloqueados FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid() AND activo = true
  )
);

-- Política: Solo admins pueden actualizar días bloqueados
CREATE POLICY "Admins pueden actualizar días bloqueados"
ON dias_bloqueados FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid() AND activo = true
  )
);

-- Política: Solo admins pueden eliminar días bloqueados
CREATE POLICY "Admins pueden eliminar días bloqueados"
ON dias_bloqueados FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid() AND activo = true
  )
);

-- Verificar configuraciones creadas
SELECT clave, valor, descripcion 
FROM configuraciones 
WHERE categoria = 'horarios'
ORDER BY clave;
