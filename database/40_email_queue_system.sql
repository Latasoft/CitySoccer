-- ============================================
-- SISTEMA DE COLA DE EMAILS Y TRACKING
-- ============================================

-- Tabla para cola de reintentos de emails fallidos
CREATE TABLE IF NOT EXISTS email_queue (
  id BIGSERIAL PRIMARY KEY,
  email_type TEXT NOT NULL, -- 'reservation_confirmation', 'admin_notification', 'config_change', etc.
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  data JSONB DEFAULT '{}'::jsonb, -- Datos adicionales del email
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'sent', 'failed'
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  last_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  scheduled_for TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ
);

-- Tabla para tracking de emails enviados
CREATE TABLE IF NOT EXISTS email_logs (
  id BIGSERIAL PRIMARY KEY,
  reservation_id BIGINT REFERENCES reservas(id) ON DELETE SET NULL,
  recipient TEXT NOT NULL,
  email_type TEXT NOT NULL,
  status TEXT DEFAULT 'sent', -- 'sent', 'delivered', 'bounced', 'failed', 'opened'
  message_id TEXT, -- ID del mensaje de nodemailer/Gmail
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  bounced_at TIMESTAMPTZ
);

-- Tabla para configuración de admin emails (múltiples admins)
CREATE TABLE IF NOT EXISTS admin_email_notifications (
  id BIGSERIAL PRIMARY KEY,
  admin_email TEXT NOT NULL UNIQUE,
  admin_name TEXT,
  notification_types TEXT[] DEFAULT ARRAY['all']::TEXT[], -- ['reservations', 'config_changes', 'payments', 'all']
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_scheduled ON email_queue(scheduled_for) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_email_logs_reservation ON email_logs(reservation_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_active ON admin_email_notifications(active) WHERE active = true;

-- Función para limpiar emails antiguos (más de 30 días)
CREATE OR REPLACE FUNCTION cleanup_old_email_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM email_logs 
  WHERE sent_at < NOW() - INTERVAL '30 days'
  AND status IN ('sent', 'delivered');
  
  DELETE FROM email_queue
  WHERE created_at < NOW() - INTERVAL '7 days'
  AND status IN ('sent', 'failed');
END;
$$ LANGUAGE plpgsql;

-- Insertar admin por defecto
INSERT INTO admin_email_notifications (admin_email, admin_name, notification_types, active)
VALUES 
  ('citysoccersantiago@gmail.com', 'Admin Principal', ARRAY['all']::TEXT[], true)
ON CONFLICT (admin_email) DO NOTHING;

-- Comentarios
COMMENT ON TABLE email_queue IS 'Cola de emails pendientes de envío con sistema de reintentos';
COMMENT ON TABLE email_logs IS 'Historial de emails enviados con tracking de estado';
COMMENT ON TABLE admin_email_notifications IS 'Configuración de emails de administradores que reciben notificaciones';
