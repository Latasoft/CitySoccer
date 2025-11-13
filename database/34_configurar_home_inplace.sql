-- ============================================================================
-- CONFIGURAR CAMPOS EDITABLES PARA HOME (Hero + CardCarousel)
-- ============================================================================
-- Inserta los campos que se pueden editar in-place en la página home
-- ============================================================================

-- Primero, despublicar la página home del CMS
UPDATE pages 
SET publicada = false, activa = false, actualizado_en = NOW()
WHERE slug = 'home';

-- Insertar campos editables para la sección Hero
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order, help_text) VALUES
  ('home', 'hero_title', 'text', 'Bienvenido a City Soccer', 'Título Hero', 'hero', 1, 'Título principal del hero'),
  ('home', 'hero_subtitle', 'textarea', 'El mejor lugar para jugar fútbol y pickleball', 'Subtítulo Hero', 'hero', 2, 'Descripción bajo el título'),
  ('home', 'hero_cta_text', 'text', 'RESERVA HOY', 'Texto Botón CTA', 'hero', 3, 'Texto del botón principal')
ON CONFLICT (page_key, field_key) DO UPDATE
SET 
  field_value = EXCLUDED.field_value,
  field_label = EXCLUDED.field_label,
  actualizado_en = NOW();

-- Insertar campos editables para la sección CardCarousel
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order, help_text) VALUES
  ('home', 'carousel_title', 'text', 'Descubre City Soccer', 'Título Carousel', 'carousel', 4, 'Título del carousel de tarjetas'),
  ('home', 'carousel_subtitle', 'textarea', 'Experiencias deportivas únicas que transforman tu forma de jugar y vivir el deporte', 'Subtítulo Carousel', 'carousel', 5, 'Descripción del carousel')
ON CONFLICT (page_key, field_key) DO UPDATE
SET 
  field_value = EXCLUDED.field_value,
  field_label = EXCLUDED.field_label,
  actualizado_en = NOW();

-- Verificar los campos creados
SELECT 
  page_key,
  field_key,
  field_type,
  field_value,
  field_label,
  field_group
FROM editable_content
WHERE page_key = 'home'
ORDER BY display_order;

-- Verificar estado de la página home
SELECT slug, titulo, publicada, activa
FROM pages
WHERE slug = 'home';
