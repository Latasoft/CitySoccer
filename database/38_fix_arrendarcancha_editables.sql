-- ============================================================================
-- FIX: INSERTAR CAMPOS EDITABLES PARA PÁGINAS DE ARRIENDO
-- ============================================================================
-- Este script inserta los valores para las páginas de arriendo de canchas
-- Basado en CanchaPageBase.jsx que usa EditableContent
-- ============================================================================

-- Limpiar campos existentes
DELETE FROM editable_content WHERE page_key LIKE 'arriendo_%';

-- FÚTBOL 7
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order) VALUES
  ('arriendo_futbol7', 'page_title', 'text', 'Arrienda Cancha de Fútbol 7', 'Título Página', 'general', 1),
  ('arriendo_futbol7', 'page_description', 'textarea', 'Reserva tu cancha de fútbol 7 de forma rápida y segura. Elige el horario que más te acomode.', 'Descripción', 'general', 2);

-- FÚTBOL 9
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order) VALUES
  ('arriendo_futbol9', 'page_title', 'text', 'Arrienda Cancha de Fútbol 9', 'Título Página', 'general', 1),
  ('arriendo_futbol9', 'page_description', 'textarea', 'Reserva tu cancha de fútbol 9 de forma rápida y segura. Elige el horario que más te acomode.', 'Descripción', 'general', 2);

-- PICKLEBALL INDIVIDUAL
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order) VALUES
  ('arriendo_pickleball-individual', 'page_title', 'text', 'Arrienda Cancha de Pickleball Individual', 'Título Página', 'general', 1),
  ('arriendo_pickleball-individual', 'page_description', 'textarea', 'Reserva tu cancha de pickleball individual de forma rápida y segura. Elige el horario que más te acomode.', 'Descripción', 'general', 2);

-- PICKLEBALL DOBLES
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order) VALUES
  ('arriendo_pickleball-dobles', 'page_title', 'text', 'Arrienda Cancha de Pickleball Dobles', 'Título Página', 'general', 1),
  ('arriendo_pickleball-dobles', 'page_description', 'textarea', 'Reserva tu cancha de pickleball dobles de forma rápida y segura. Elige el horario que más te acomode.', 'Descripción', 'general', 2);

-- Verificar
SELECT page_key, field_key, field_value
FROM editable_content 
WHERE page_key LIKE 'arriendo_%'
ORDER BY page_key, display_order;
