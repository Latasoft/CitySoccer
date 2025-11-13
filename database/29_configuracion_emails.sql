-- ============================================================================
-- CONFIGURACIÓN DE CORREOS ELECTRÓNICOS PARA NOTIFICACIONES
-- ============================================================================
-- Agregar campos para gestionar emails de administrador y notificaciones
-- ============================================================================

-- Insertar configuraciones de email en la tabla configuraciones
INSERT INTO configuraciones (clave, valor, descripcion, categoria, tipo) VALUES
  ('email_admin_reservas', 'admin@citysoccer.cl', 'Email del administrador para recibir notificaciones de reservas', 'notificaciones', 'email'),
  ('email_admin_configuracion', 'admin@citysoccer.cl', 'Email para notificaciones de cambios en configuración', 'notificaciones', 'email'),
  ('email_remitente_nombre', 'City Soccer', 'Nombre que aparece como remitente en los emails', 'email', 'texto'),
  ('notificaciones_reservas_activas', 'true', 'Activar/desactivar notificaciones de nuevas reservas', 'notificaciones', 'boolean'),
  ('notificaciones_config_activas', 'true', 'Activar/desactivar notificaciones de cambios en configuración', 'notificaciones', 'boolean')
ON CONFLICT (clave) DO UPDATE SET
  valor = EXCLUDED.valor,
  descripcion = EXCLUDED.descripcion,
  categoria = EXCLUDED.categoria,
  tipo = EXCLUDED.tipo;

-- Verificar que se insertaron correctamente
SELECT clave, valor, descripcion FROM configuraciones WHERE categoria IN ('notificaciones', 'email');

COMMENT ON TABLE configuraciones IS 'Tabla de configuraciones generales del sistema incluyendo emails de notificaciones';
