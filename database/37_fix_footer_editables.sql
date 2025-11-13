-- ============================================================================
-- FIX: INSERTAR CAMPOS EDITABLES PARA FOOTER
-- ============================================================================
-- Este script inserta los valores del footer según el código de Footer.jsx
-- ============================================================================

-- Borrar cualquier campo existente de footer para evitar conflictos
DELETE FROM editable_content WHERE page_key = 'footer';

-- Insertar campos del footer con valores por defecto del código
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order, help_text) VALUES
  -- Imagen de fondo
  ('footer', 'background_image', 'image', '/Cancha3.jpeg', 'Imagen de Fondo Footer', 'general', 1, 'Imagen de fondo del footer'),
  
  -- Contacto
  ('footer', 'contact_label', 'text', 'Llámanos', 'Etiqueta Contacto', 'contact', 2, 'Texto de la etiqueta de contacto'),
  ('footer', 'contact_phone', 'text', '+56 9 7426 5020', 'Teléfono', 'contact', 3, 'Teléfono de contacto principal'),
  ('footer', 'contact_address', 'text', 'Tiltil 2569, Macul, Chile', 'Dirección', 'contact', 4, 'Dirección física completa'),
  
  -- Horarios
  ('footer', 'hours_weekdays', 'text', 'Lun - Vie: 9:00 AM - 11:00 PM', 'Horario Semana', 'hours', 5, 'Horario de lunes a viernes'),
  ('footer', 'hours_saturday', 'text', 'Sáb: 9:00 AM - 11:00 PM', 'Horario Sábado', 'hours', 6, 'Horario sábados'),
  ('footer', 'hours_sunday', 'text', 'Reservas online 24/7', 'Horario Domingo', 'hours', 7, 'Horario domingos y reservas online'),
  
  -- Redes sociales
  ('footer', 'social_facebook', 'url', 'https://facebook.com/citysoccer', 'Facebook', 'social', 8, 'URL de Facebook'),
  ('footer', 'social_instagram', 'url', 'https://instagram.com/citysoccer', 'Instagram', 'social', 9, 'URL de Instagram'),
  ('footer', 'social_twitter', 'url', 'https://twitter.com/citysoccer', 'Twitter/X', 'social', 10, 'URL de Twitter/X'),
  
  -- Copyright
  ('footer', 'copyright_text', 'text', '© 2025 City Soccer. Todos los derechos reservados.', 'Copyright', 'legal', 11, 'Texto de copyright');

-- Verificar que se insertaron correctamente
SELECT 
  field_key,
  LEFT(field_value, 50) as field_value_preview,
  field_group,
  display_order
FROM editable_content
WHERE page_key = 'footer'
ORDER BY display_order;
