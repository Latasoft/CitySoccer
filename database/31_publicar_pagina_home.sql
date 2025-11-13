-- ============================================================================
-- PUBLICAR PÁGINA HOME EXISTENTE
-- ============================================================================
-- La página home ya existe pero está despublicada
-- Este script la activa y publica para que funcione en producción
-- ============================================================================

-- 1. Verificar estado actual
SELECT 
  id,
  slug,
  titulo,
  publicada,
  activa,
  creado_en,
  actualizado_en
FROM pages 
WHERE slug = 'home';

-- 2. Publicar y activar la página home
UPDATE pages 
SET 
  publicada = true,
  activa = true,
  actualizado_en = NOW(),
  publicado_en = NOW()
WHERE slug = 'home';

-- 3. Verificar que se aplicó el cambio
SELECT 
  id,
  slug,
  titulo,
  publicada,
  activa,
  publicado_en,
  (SELECT COUNT(*) FROM page_sections WHERE page_id = pages.id) as total_secciones
FROM pages 
WHERE slug = 'home';

-- 4. Mostrar las secciones de la página home
SELECT 
  ps.id,
  ps.tipo_seccion,
  ps.orden,
  ps.activa,
  ps.configuracion->>'titulo' as titulo_seccion
FROM page_sections ps
JOIN pages p ON p.id = ps.page_id
WHERE p.slug = 'home'
ORDER BY ps.orden;
