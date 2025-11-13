-- ============================================================================
-- FIX: INSERTAR CAMPOS EDITABLES PARA HOME
-- ============================================================================
-- Este script inserta los valores correctos que están en Hero.jsx y CardCarousel.jsx
-- ============================================================================

-- Borrar cualquier campo existente de home para evitar conflictos
DELETE FROM editable_content WHERE page_key = 'home';

-- Insertar campos con los valores EXACTOS del código
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order, help_text) VALUES
  -- Hero.jsx (líneas 70-98)
  ('home', 'hero_title', 'text', 'Bienvenido a City Soccer', 'Título Hero', 'hero', 1, 'Título principal del hero'),
  ('home', 'hero_subtitle', 'textarea', 'El mejor lugar para jugar fútbol y pickleball', 'Subtítulo Hero', 'hero', 2, 'Descripción bajo el título'),
  ('home', 'hero_cta_text', 'text', 'RESERVA HOY', 'Texto Botón CTA', 'hero', 3, 'Texto del botón principal'),
  
  -- CardCarousel.jsx (líneas 110-122)
  ('home', 'carousel_title', 'text', 'Descubre City Soccer', 'Título Carousel', 'carousel', 4, 'Título del carousel de tarjetas'),
  ('home', 'carousel_subtitle', 'textarea', 'Experiencias deportivas únicas que transforman tu forma de jugar y vivir el deporte', 'Subtítulo Carousel', 'carousel', 5, 'Descripción del carousel');

-- Verificar que se insertaron correctamente
SELECT 
  field_key,
  field_value,
  field_group,
  display_order
FROM editable_content
WHERE page_key = 'home'
ORDER BY display_order;
