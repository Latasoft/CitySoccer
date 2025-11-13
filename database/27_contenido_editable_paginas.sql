-- ============================================================================
-- CONTENIDO EDITABLE PARA PÁGINAS DE ARRIENDO Y HOME
-- ============================================================================
-- Este script crea la infraestructura para gestionar contenido editable
-- en páginas que actualmente son estáticas (arriendo y home)
-- ============================================================================

-- Tabla para contenido editable de páginas
CREATE TABLE IF NOT EXISTS editable_content (
  id BIGSERIAL PRIMARY KEY,
  page_key VARCHAR(100) NOT NULL, -- Identificador único de la página (ej: 'home', 'arriendo_futbol7')
  field_key VARCHAR(100) NOT NULL, -- Identificador del campo (ej: 'hero_title', 'video_url', 'logo_url')
  field_type VARCHAR(50) NOT NULL DEFAULT 'text', -- text, textarea, image, video, url, number, json
  field_value TEXT, -- Valor del campo
  field_label VARCHAR(255), -- Etiqueta descriptiva para el admin
  field_group VARCHAR(100), -- Agrupación (ej: 'hero', 'features', 'pricing')
  display_order INTEGER DEFAULT 0, -- Orden de visualización en el admin
  is_required BOOLEAN DEFAULT false, -- Si el campo es obligatorio
  validation_rules JSONB, -- Reglas de validación (max_length, min_value, etc.)
  help_text TEXT, -- Texto de ayuda para el administrador
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_key, field_key) -- No duplicar campos por página
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_editable_content_page_key ON editable_content(page_key);
CREATE INDEX IF NOT EXISTS idx_editable_content_field_key ON editable_content(field_key);
CREATE INDEX IF NOT EXISTS idx_editable_content_page_group ON editable_content(page_key, field_group);
CREATE INDEX IF NOT EXISTS idx_editable_content_display_order ON editable_content(display_order);

-- Trigger para actualizar timestamp
CREATE OR REPLACE FUNCTION update_editable_content_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_editable_content_timestamp
  BEFORE UPDATE ON editable_content
  FOR EACH ROW
  EXECUTE FUNCTION update_editable_content_timestamp();

-- ============================================================================
-- CONTENIDO INICIAL - PÁGINA HOME
-- ============================================================================

INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order, help_text) VALUES
  -- Logo y video principal
  ('home', 'logo_url', 'image', '/images/logo.png', 'Logo Principal', 'brand', 1, 'Logo que aparece en el header. Recomendado: PNG transparente, 200x60px'),
  ('home', 'video_background_url', 'video', '/videos/background.mp4', 'Video de Fondo Hero', 'hero', 2, 'Video de fondo de la sección hero. Formato: MP4, máx 10MB'),
  ('home', 'video_poster_url', 'image', '/images/video-poster.jpg', 'Imagen Previa del Video', 'hero', 3, 'Imagen que se muestra antes de cargar el video'),
  
  -- Hero Section
  ('home', 'hero_title', 'text', 'Bienvenido a City Soccer', 'Título Principal Hero', 'hero', 4, 'Título principal de la página de inicio'),
  ('home', 'hero_subtitle', 'textarea', 'Tu destino para fútbol y pickleball', 'Subtítulo Hero', 'hero', 5, 'Texto descriptivo bajo el título'),
  ('home', 'hero_cta_text', 'text', 'Reserva Ahora', 'Texto Botón Principal', 'hero', 6, 'Texto del botón de llamado a la acción'),
  ('home', 'hero_cta_url', 'url', '/arrendarcancha', 'URL Botón Principal', 'hero', 7, 'Enlace del botón principal'),
  
  -- Sección de Beneficios
  ('home', 'benefits_title', 'text', '¿Por qué elegirnos?', 'Título Sección Beneficios', 'benefits', 8, 'Título de la sección de beneficios'),
  ('home', 'benefits_subtitle', 'textarea', 'Ofrecemos las mejores instalaciones y servicios', 'Subtítulo Beneficios', 'benefits', 9, 'Descripción de beneficios'),
  
  -- Información de contacto rápida
  ('home', 'quick_contact_phone', 'text', '+56 9 1234 5678', 'Teléfono de Contacto', 'contact', 10, 'Número de teléfono principal'),
  ('home', 'quick_contact_email', 'text', 'info@citysoccer.cl', 'Email de Contacto', 'contact', 11, 'Correo electrónico principal'),
  ('home', 'quick_contact_address', 'textarea', 'Dirección de las canchas', 'Dirección', 'contact', 12, 'Dirección física del complejo'),
  
  -- Redes sociales
  ('home', 'social_facebook', 'url', 'https://facebook.com/citysoccer', 'Facebook URL', 'social', 13, 'Enlace a página de Facebook'),
  ('home', 'social_instagram', 'url', 'https://instagram.com/citysoccer', 'Instagram URL', 'social', 14, 'Enlace a perfil de Instagram'),
  ('home', 'social_whatsapp', 'text', '+56912345678', 'WhatsApp (solo número)', 'social', 15, 'Número de WhatsApp sin espacios ni símbolos')
ON CONFLICT (page_key, field_key) DO NOTHING;

-- ============================================================================
-- CONTENIDO INICIAL - PÁGINAS DE ARRIENDO
-- ============================================================================

-- Fútbol 7
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order, help_text) VALUES
  ('arriendo_futbol7', 'page_title', 'text', 'Arriendo Cancha Fútbol 7', 'Título de la Página', 'general', 1, 'Título principal de la página'),
  ('arriendo_futbol7', 'page_description', 'textarea', 'Arrienda nuestra cancha de fútbol 7 con pasto sintético de alta calidad', 'Descripción', 'general', 2, 'Descripción corta de la página'),
  ('arriendo_futbol7', 'hero_image', 'image', '/images/futbol7-hero.jpg', 'Imagen Hero', 'hero', 3, 'Imagen principal de la página'),
  ('arriendo_futbol7', 'features_title', 'text', 'Características de la Cancha', 'Título Características', 'features', 4, 'Título de la sección de características'),
  ('arriendo_futbol7', 'feature_1', 'text', 'Pasto sintético profesional', 'Característica 1', 'features', 5, 'Primera característica destacada'),
  ('arriendo_futbol7', 'feature_2', 'text', 'Iluminación LED', 'Característica 2', 'features', 6, 'Segunda característica destacada'),
  ('arriendo_futbol7', 'feature_3', 'text', 'Vestuarios equipados', 'Característica 3', 'features', 7, 'Tercera característica destacada'),
  ('arriendo_futbol7', 'cta_text', 'text', 'Reservar Ahora', 'Texto Botón Reserva', 'cta', 8, 'Texto del botón de reserva'),
  ('arriendo_futbol7', 'info_adicional', 'textarea', 'Información adicional sobre horarios y políticas', 'Información Adicional', 'info', 9, 'Texto adicional al pie de página')
ON CONFLICT (page_key, field_key) DO NOTHING;

-- Fútbol 9
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order, help_text) VALUES
  ('arriendo_futbol9', 'page_title', 'text', 'Arriendo Cancha Fútbol 9', 'Título de la Página', 'general', 1, 'Título principal de la página'),
  ('arriendo_futbol9', 'page_description', 'textarea', 'Arrienda nuestra cancha de fútbol 9 para partidos más grandes', 'Descripción', 'general', 2, 'Descripción corta de la página'),
  ('arriendo_futbol9', 'hero_image', 'image', '/images/futbol9-hero.jpg', 'Imagen Hero', 'hero', 3, 'Imagen principal de la página'),
  ('arriendo_futbol9', 'features_title', 'text', 'Características de la Cancha', 'Título Características', 'features', 4, 'Título de la sección de características'),
  ('arriendo_futbol9', 'feature_1', 'text', 'Cancha reglamentaria', 'Característica 1', 'features', 5, 'Primera característica destacada'),
  ('arriendo_futbol9', 'feature_2', 'text', 'Graderías para espectadores', 'Característica 2', 'features', 6, 'Segunda característica destacada'),
  ('arriendo_futbol9', 'feature_3', 'text', 'Estacionamiento amplio', 'Característica 3', 'features', 7, 'Tercera característica destacada'),
  ('arriendo_futbol9', 'cta_text', 'text', 'Reservar Ahora', 'Texto Botón Reserva', 'cta', 8, 'Texto del botón de reserva'),
  ('arriendo_futbol9', 'info_adicional', 'textarea', 'Información adicional sobre horarios y políticas', 'Información Adicional', 'info', 9, 'Texto adicional al pie de página')
ON CONFLICT (page_key, field_key) DO NOTHING;

-- Pickleball Individual
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order, help_text) VALUES
  ('arriendo_pickleball_individual', 'page_title', 'text', 'Arriendo Cancha Pickleball Individual', 'Título de la Página', 'general', 1, 'Título principal de la página'),
  ('arriendo_pickleball_individual', 'page_description', 'textarea', 'Arrienda nuestra cancha de pickleball para juego individual', 'Descripción', 'general', 2, 'Descripción corta de la página'),
  ('arriendo_pickleball_individual', 'hero_image', 'image', '/images/pickleball-individual-hero.jpg', 'Imagen Hero', 'hero', 3, 'Imagen principal de la página'),
  ('arriendo_pickleball_individual', 'features_title', 'text', 'Características de la Cancha', 'Título Características', 'features', 4, 'Título de la sección de características'),
  ('arriendo_pickleball_individual', 'feature_1', 'text', 'Superficie profesional', 'Característica 1', 'features', 5, 'Primera característica destacada'),
  ('arriendo_pickleball_individual', 'feature_2', 'text', 'Equipamiento incluido', 'Característica 2', 'features', 6, 'Segunda característica destacada'),
  ('arriendo_pickleball_individual', 'feature_3', 'text', 'Horarios flexibles', 'Característica 3', 'features', 7, 'Tercera característica destacada'),
  ('arriendo_pickleball_individual', 'cta_text', 'text', 'Reservar Ahora', 'Texto Botón Reserva', 'cta', 8, 'Texto del botón de reserva'),
  ('arriendo_pickleball_individual', 'info_adicional', 'textarea', 'Información adicional sobre horarios y políticas', 'Información Adicional', 'info', 9, 'Texto adicional al pie de página')
ON CONFLICT (page_key, field_key) DO NOTHING;

-- Pickleball Dobles
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order, help_text) VALUES
  ('arriendo_pickleball_dobles', 'page_title', 'text', 'Arriendo Cancha Pickleball Dobles', 'Título de la Página', 'general', 1, 'Título principal de la página'),
  ('arriendo_pickleball_dobles', 'page_description', 'textarea', 'Arrienda nuestra cancha de pickleball para juego en dobles', 'Descripción', 'general', 2, 'Descripción corta de la página'),
  ('arriendo_pickleball_dobles', 'hero_image', 'image', '/images/pickleball-dobles-hero.jpg', 'Imagen Hero', 'hero', 3, 'Imagen principal de la página'),
  ('arriendo_pickleball_dobles', 'features_title', 'text', 'Características de la Cancha', 'Título Características', 'features', 4, 'Título de la sección de características'),
  ('arriendo_pickleball_dobles', 'feature_1', 'text', 'Cancha reglamentaria dobles', 'Característica 1', 'features', 5, 'Primera característica destacada'),
  ('arriendo_pickleball_dobles', 'feature_2', 'text', 'Red profesional', 'Característica 2', 'features', 6, 'Segunda característica destacada'),
  ('arriendo_pickleball_dobles', 'feature_3', 'text', 'Zona de espera techada', 'Característica 3', 'features', 7, 'Tercera característica destacada'),
  ('arriendo_pickleball_dobles', 'cta_text', 'text', 'Reservar Ahora', 'Texto Botón Reserva', 'cta', 8, 'Texto del botón de reserva'),
  ('arriendo_pickleball_dobles', 'info_adicional', 'textarea', 'Información adicional sobre horarios y políticas', 'Información Adicional', 'info', 9, 'Texto adicional al pie de página')
ON CONFLICT (page_key, field_key) DO NOTHING;

-- ============================================================================
-- POLÍTICAS RLS (Row Level Security)
-- ============================================================================

ALTER TABLE editable_content ENABLE ROW LEVEL SECURITY;

-- Política de lectura: todos pueden ver el contenido
CREATE POLICY "Lectura pública de contenido editable"
  ON editable_content
  FOR SELECT
  USING (true);

-- Política de inserción: solo administradores
CREATE POLICY "Solo administradores pueden insertar contenido"
  ON editable_content
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
CREATE POLICY "Solo administradores pueden actualizar contenido"
  ON editable_content
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
CREATE POLICY "Solo administradores pueden eliminar contenido"
  ON editable_content
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
-- VISTAS AUXILIARES
-- ============================================================================

-- Vista para obtener contenido agrupado por página
CREATE OR REPLACE VIEW editable_content_by_page AS
SELECT 
  page_key,
  jsonb_object_agg(field_key, field_value) AS content
FROM editable_content
GROUP BY page_key;

-- Vista para el administrador con toda la metadata
CREATE OR REPLACE VIEW editable_content_admin AS
SELECT 
  id,
  page_key,
  field_key,
  field_type,
  field_value,
  field_label,
  field_group,
  display_order,
  is_required,
  validation_rules,
  help_text,
  actualizado_en
FROM editable_content
ORDER BY page_key, field_group, display_order;

-- ============================================================================
-- FUNCIONES AUXILIARES
-- ============================================================================

-- Función para obtener todo el contenido de una página
CREATE OR REPLACE FUNCTION get_page_content(p_page_key VARCHAR)
RETURNS TABLE (
  field_key VARCHAR,
  field_value TEXT,
  field_type VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ec.field_key,
    ec.field_value,
    ec.field_type
  FROM editable_content ec
  WHERE ec.page_key = p_page_key
  ORDER BY ec.display_order;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar múltiples campos de una página
CREATE OR REPLACE FUNCTION update_page_content(
  p_page_key VARCHAR,
  p_updates JSONB
)
RETURNS VOID AS $$
DECLARE
  field_record RECORD;
BEGIN
  FOR field_record IN SELECT * FROM jsonb_each_text(p_updates)
  LOOP
    UPDATE editable_content
    SET field_value = field_record.value,
        actualizado_en = NOW()
    WHERE page_key = p_page_key 
      AND field_key = field_record.key;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ANÁLISIS Y MANTENIMIENTO
-- ============================================================================

ANALYZE editable_content;

-- Comentarios para documentación
COMMENT ON TABLE editable_content IS 'Contenido editable de páginas del sitio web';
COMMENT ON COLUMN editable_content.page_key IS 'Identificador único de la página';
COMMENT ON COLUMN editable_content.field_key IS 'Identificador único del campo dentro de la página';
COMMENT ON COLUMN editable_content.field_type IS 'Tipo de campo: text, textarea, image, video, url, number, json';
COMMENT ON COLUMN editable_content.field_value IS 'Valor actual del campo';
COMMENT ON COLUMN editable_content.field_group IS 'Agrupación lógica para organizar campos en el admin';
COMMENT ON COLUMN editable_content.display_order IS 'Orden de visualización en el panel de administración';
COMMENT ON COLUMN editable_content.validation_rules IS 'Reglas de validación en formato JSON';

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
