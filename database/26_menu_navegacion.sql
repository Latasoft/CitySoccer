-- ============================================================================
-- SISTEMA DE NAVEGACIÓN EDITABLE
-- ============================================================================
-- Este script crea la infraestructura para gestionar el menú de navegación
-- desde el dashboard de administración
-- ============================================================================

-- Tabla para items del menú de navegación
CREATE TABLE IF NOT EXISTS menu_items (
  id BIGSERIAL PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  url VARCHAR(255) NOT NULL,
  orden INTEGER NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT true,
  parent_id BIGINT REFERENCES menu_items(id) ON DELETE CASCADE,
  icono VARCHAR(50), -- Nombre del ícono de lucide-react (opcional)
  descripcion TEXT, -- Tooltip o descripción
  externo BOOLEAN DEFAULT false, -- Si el enlace es externo (target="_blank")
  visible_mobile BOOLEAN DEFAULT true,
  visible_desktop BOOLEAN DEFAULT true,
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_menu_items_activo ON menu_items(activo);
CREATE INDEX IF NOT EXISTS idx_menu_items_orden ON menu_items(orden);
CREATE INDEX IF NOT EXISTS idx_menu_items_parent ON menu_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_activo_orden ON menu_items(activo, orden);

-- Trigger para actualizar timestamp
CREATE OR REPLACE FUNCTION update_menu_items_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_menu_items_timestamp
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_menu_items_timestamp();

-- ============================================================================
-- MIGRACIÓN DE ITEMS DEL MENÚ ACTUAL
-- ============================================================================
-- Migrar los items hardcodeados del componente Navigation.jsx

INSERT INTO menu_items (label, url, orden, activo, descripcion) VALUES
  ('Inicio', '/', 1, true, 'Página principal'),
  ('Quiénes Somos', '/quienessomos', 2, true, 'Conoce nuestra historia'),
  ('Servicios', '/servicios', 3, true, 'Nuestros servicios'),
  ('Arrendar Cancha', '/arrendarcancha', 4, true, 'Reserva tu cancha'),
  ('Academia de Fútbol', '/academiadefutbol', 5, true, 'Programas de fútbol'),
  ('Academia de Pickleball', '/academiadepickleball', 6, true, 'Programas de pickleball'),
  ('Clases Particulares Fútbol', '/clasesparticularesfutbol', 7, true, 'Clases individuales de fútbol'),
  ('Clases Particulares Pickleball', '/clasesparticularespickleball', 8, true, 'Clases individuales de pickleball'),
  ('Eventos', '/eventos', 9, true, 'Eventos y torneos'),
  ('Summer Camp', '/summer-camp', 10, true, 'Campamentos de verano'),
  ('Contacto', '/contacto', 11, true, 'Contáctanos')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- POLÍTICAS RLS (Row Level Security)
-- ============================================================================
-- Solo administradores pueden editar el menú
-- Todos pueden leer items activos

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Política de lectura: todos pueden ver items activos
CREATE POLICY "Lectura pública de items de menú activos"
  ON menu_items
  FOR SELECT
  USING (activo = true);

-- Política de inserción: solo administradores
CREATE POLICY "Solo administradores pueden insertar items de menú"
  ON menu_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.jwt() ->> 'email'
      AND activo = true
    )
  );

-- Política de actualización: solo administradores
CREATE POLICY "Solo administradores pueden actualizar items de menú"
  ON menu_items
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.jwt() ->> 'email'
      AND activo = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.jwt() ->> 'email'
      AND activo = true
    )
  );

-- Política de eliminación: solo administradores
CREATE POLICY "Solo administradores pueden eliminar items de menú"
  ON menu_items
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE email = auth.jwt() ->> 'email'
      AND activo = true
    )
  );

-- ============================================================================
-- FUNCIONES AUXILIARES
-- ============================================================================

-- Función para reordenar items después de eliminar uno
CREATE OR REPLACE FUNCTION reordenar_menu_items()
RETURNS TRIGGER AS $$
BEGIN
  -- Reordenar items que estaban después del eliminado
  UPDATE menu_items
  SET orden = orden - 1
  WHERE orden > OLD.orden
  AND (parent_id = OLD.parent_id OR (parent_id IS NULL AND OLD.parent_id IS NULL));
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_reordenar_menu_items
  AFTER DELETE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION reordenar_menu_items();

-- ============================================================================
-- VISTA PARA CONSULTA OPTIMIZADA
-- ============================================================================
-- Vista que incluye los hijos de cada item (submenús)

CREATE OR REPLACE VIEW menu_items_con_hijos AS
SELECT 
  p.id,
  p.label,
  p.url,
  p.orden,
  p.activo,
  p.parent_id,
  p.icono,
  p.descripcion,
  p.externo,
  p.visible_mobile,
  p.visible_desktop,
  p.creado_en,
  p.actualizado_en,
  COALESCE(
    json_agg(
      json_build_object(
        'id', c.id,
        'label', c.label,
        'url', c.url,
        'orden', c.orden,
        'activo', c.activo,
        'icono', c.icono,
        'descripcion', c.descripcion,
        'externo', c.externo
      ) ORDER BY c.orden
    ) FILTER (WHERE c.id IS NOT NULL),
    '[]'::json
  ) AS hijos
FROM menu_items p
LEFT JOIN menu_items c ON c.parent_id = p.id AND c.activo = true
WHERE p.parent_id IS NULL
GROUP BY p.id, p.label, p.url, p.orden, p.activo, p.parent_id, 
         p.icono, p.descripcion, p.externo, p.visible_mobile, 
         p.visible_desktop, p.creado_en, p.actualizado_en
ORDER BY p.orden;

-- ============================================================================
-- ANÁLISIS Y MANTENIMIENTO
-- ============================================================================

ANALYZE menu_items;

-- Comentarios para documentación
COMMENT ON TABLE menu_items IS 'Items del menú de navegación principal del sitio';
COMMENT ON COLUMN menu_items.label IS 'Texto visible del item de menú';
COMMENT ON COLUMN menu_items.url IS 'URL de destino (relativa o absoluta)';
COMMENT ON COLUMN menu_items.orden IS 'Orden de aparición (menor = primero)';
COMMENT ON COLUMN menu_items.activo IS 'Si el item está visible en el menú';
COMMENT ON COLUMN menu_items.parent_id IS 'ID del item padre (NULL = item raíz)';
COMMENT ON COLUMN menu_items.icono IS 'Nombre del ícono de lucide-react';
COMMENT ON COLUMN menu_items.externo IS 'Si el enlace abre en nueva pestaña';
COMMENT ON COLUMN menu_items.visible_mobile IS 'Si se muestra en versión móvil';
COMMENT ON COLUMN menu_items.visible_desktop IS 'Si se muestra en versión desktop';

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
