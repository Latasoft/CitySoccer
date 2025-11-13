-- ============================================================================
-- AGREGAR CAMPOS FALTANTES: VIDEO DE HERO Y TARJETAS DE CAROUSEL
-- ============================================================================
-- Este script agrega los campos que faltaron en el script anterior
-- Ejecutar DESPUÉS de 39_setup_all_editables.sql
-- ============================================================================

-- ============================================================================
-- HOME PAGE - VIDEO DE HERO
-- ============================================================================
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order, help_text) VALUES
  ('home', 'hero_video_url', 'text', '/videofutbol.mp4', 'URL del Video de Fondo', 'hero', 10, 'Ruta del video de fondo del hero. Formato: MP4')
ON CONFLICT (page_key, field_key) DO UPDATE 
  SET field_value = EXCLUDED.field_value;

-- ============================================================================
-- HOME PAGE - TARJETAS DEL CAROUSEL (6 tarjetas × 4 campos = 24 campos)
-- ============================================================================

-- TARJETA 1: Arrienda Cancha Fútbol
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order) VALUES
  ('home', 'card1_title', 'text', 'Arrienda Cancha Fútbol', 'Tarjeta 1 - Título', 'carousel_cards', 11),
  ('home', 'card1_description', 'textarea', 'Canchas profesionales con césped sintético de última generación. Reserva online las 24 horas.', 'Tarjeta 1 - Descripción', 'carousel_cards', 12),
  ('home', 'card1_image', 'image', '/Cancha1.jpeg', 'Tarjeta 1 - Imagen', 'carousel_cards', 13),
  ('home', 'card1_cta_text', 'text', 'RESERVAR FÚTBOL', 'Tarjeta 1 - Texto Botón', 'carousel_cards', 14)
ON CONFLICT (page_key, field_key) DO UPDATE 
  SET field_value = EXCLUDED.field_value;

-- TARJETA 2: Arrienda Cancha Pickleball
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order) VALUES
  ('home', 'card2_title', 'text', 'Arrienda Cancha Pickleball', 'Tarjeta 2 - Título', 'carousel_cards', 15),
  ('home', 'card2_description', 'textarea', 'Canchas de Pickleball con superficies profesionales. El deporte que está revolucionando el mundo.', 'Tarjeta 2 - Descripción', 'carousel_cards', 16),
  ('home', 'card2_image', 'image', '/Pickleball2.jpeg', 'Tarjeta 2 - Imagen', 'carousel_cards', 17),
  ('home', 'card2_cta_text', 'text', 'RESERVAR PICKLEBALL', 'Tarjeta 2 - Texto Botón', 'carousel_cards', 18)
ON CONFLICT (page_key, field_key) DO UPDATE 
  SET field_value = EXCLUDED.field_value;

-- TARJETA 3: Clases Particulares
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order) VALUES
  ('home', 'card3_title', 'text', 'Clases Particulares', 'Tarjeta 3 - Título', 'carousel_cards', 19),
  ('home', 'card3_description', 'textarea', 'Entrenamiento personalizado con profesionales certificados. Mejora tu técnica individual.', 'Tarjeta 3 - Descripción', 'carousel_cards', 20),
  ('home', 'card3_image', 'image', '/Entrenamiento4.jpeg', 'Tarjeta 3 - Imagen', 'carousel_cards', 21),
  ('home', 'card3_cta_text', 'text', 'VER CLASES', 'Tarjeta 3 - Texto Botón', 'carousel_cards', 22)
ON CONFLICT (page_key, field_key) DO UPDATE 
  SET field_value = EXCLUDED.field_value;

-- TARJETA 4: Academia Deportiva
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order) VALUES
  ('home', 'card4_title', 'text', 'Academia Deportiva', 'Tarjeta 4 - Título', 'carousel_cards', 23),
  ('home', 'card4_description', 'textarea', 'Programas de formación deportiva para niños y jóvenes. Desarrollo técnico y valores.', 'Tarjeta 4 - Descripción', 'carousel_cards', 24),
  ('home', 'card4_image', 'image', '/Entrenamiento2.jpeg', 'Tarjeta 4 - Imagen', 'carousel_cards', 25),
  ('home', 'card4_cta_text', 'text', 'CONOCER MÁS', 'Tarjeta 4 - Texto Botón', 'carousel_cards', 26)
ON CONFLICT (page_key, field_key) DO UPDATE 
  SET field_value = EXCLUDED.field_value;

-- TARJETA 5: Summer Camp
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order) VALUES
  ('home', 'card5_title', 'text', 'Summer Camp 2026', 'Tarjeta 5 - Título', 'carousel_cards', 27),
  ('home', 'card5_description', 'textarea', 'La experiencia deportiva más completa del verano. Diversión y aprendizaje garantizados.', 'Tarjeta 5 - Descripción', 'carousel_cards', 28),
  ('home', 'card5_image', 'image', '/Entrenamiento5.jpeg', 'Tarjeta 5 - Imagen', 'carousel_cards', 29),
  ('home', 'card5_cta_text', 'text', 'INSCRIBIR', 'Tarjeta 5 - Texto Botón', 'carousel_cards', 30)
ON CONFLICT (page_key, field_key) DO UPDATE 
  SET field_value = EXCLUDED.field_value;

-- TARJETA 6: Quiénes Somos
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order) VALUES
  ('home', 'card6_title', 'text', 'Quiénes Somos', 'Tarjeta 6 - Título', 'carousel_cards', 31),
  ('home', 'card6_description', 'textarea', 'Más de 10 años creando experiencias deportivas únicas. Conoce nuestra historia y valores.', 'Tarjeta 6 - Descripción', 'carousel_cards', 32),
  ('home', 'card6_image', 'image', '/imgCitySoccer.jpeg', 'Tarjeta 6 - Imagen', 'carousel_cards', 33),
  ('home', 'card6_cta_text', 'text', 'NUESTRA HISTORIA', 'Tarjeta 6 - Texto Botón', 'carousel_cards', 34)
ON CONFLICT (page_key, field_key) DO UPDATE 
  SET field_value = EXCLUDED.field_value;

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================
SELECT 
  page_key,
  field_group,
  COUNT(*) as total_campos,
  STRING_AGG(field_key, ', ' ORDER BY display_order) as campos
FROM editable_content
WHERE page_key = 'home'
GROUP BY page_key, field_group
ORDER BY field_group;

-- Ver resumen total
SELECT 
  COUNT(*) as total_campos_home
FROM editable_content
WHERE page_key = 'home';
