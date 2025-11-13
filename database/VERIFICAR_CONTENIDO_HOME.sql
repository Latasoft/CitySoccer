-- ============================================================================
-- VERIFICAR CONTENIDO ACTUAL DE LA PÁGINA HOME
-- ============================================================================
-- Ejecuta este script en Supabase SQL Editor para ver qué valores
-- están actualmente almacenados en la base de datos
-- ============================================================================

-- Ver todos los campos editables de la página home
SELECT 
  field_key,
  field_type,
  field_value,
  field_label,
  field_group,
  display_order,
  actualizado_en
FROM editable_content
WHERE page_key = 'home'
ORDER BY display_order;

-- Ver estado de la página home en el CMS
SELECT 
  slug,
  titulo,
  publicada,
  activa,
  (SELECT COUNT(*) FROM page_sections WHERE page_id = pages.id) as total_secciones
FROM pages
WHERE slug = 'home';
