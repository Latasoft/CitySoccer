-- ============================================================================
-- CREAR PÁGINA HOME SI NO EXISTE
-- ============================================================================
-- Este script crea la página home básica si aún no existe en la base de datos
-- ============================================================================

-- Verificar si existe y crear solo si no existe
INSERT INTO pages (slug, titulo, descripcion, meta_title, meta_description, meta_keywords, layout_type, publicada, activa)
SELECT 
  'home',
  'City Soccer - Inicio',
  'Página principal de City Soccer',
  'City Soccer - Complejo Deportivo en Maipú',
  'El mejor complejo deportivo de Maipú. Canchas de fútbol y pickleball, academias, clases particulares y más.',
  'city soccer, complejo deportivo maipú, canchas fútbol, pickleball, academia deportiva',
  'default',
  true,  -- Publicada por defecto
  true
WHERE NOT EXISTS (
  SELECT 1 FROM pages WHERE slug = 'home'
);

-- Verificar resultado
DO $$
DECLARE
  v_page_id UUID;
BEGIN
  SELECT id INTO v_page_id FROM pages WHERE slug = 'home';
  
  IF v_page_id IS NOT NULL THEN
    RAISE NOTICE 'Página HOME existe con ID: %', v_page_id;
  ELSE
    RAISE NOTICE 'No se pudo crear la página HOME';
  END IF;
END $$;
