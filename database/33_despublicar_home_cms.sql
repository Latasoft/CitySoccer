-- ============================================================================
-- DESPUBLICAR PÁGINA HOME DEL CMS
-- ============================================================================
-- Volver a usar el diseño original (Hero + CardCarousel) en lugar del CMS
-- ============================================================================

UPDATE pages 
SET 
  publicada = false,
  activa = false,
  actualizado_en = NOW()
WHERE slug = 'home';

-- Verificar
SELECT 
  id,
  slug,
  titulo,
  publicada,
  activa
FROM pages 
WHERE slug = 'home';
