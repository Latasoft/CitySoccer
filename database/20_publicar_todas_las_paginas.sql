-- ========================================
-- PUBLICAR TODAS LAS PÁGINAS DEL CMS
-- ========================================
-- Ejecuta este script DESPUÉS de haber migrado el contenido
-- y verificado que todo se ve bien

-- Opción 1: Publicar TODAS las páginas a la vez
UPDATE pages 
SET publicada = true, 
    publicado_en = NOW()
WHERE activa = true;

-- Opción 2: Publicar páginas específicas (comenta/descomenta según necesites)
/*
UPDATE pages SET publicada = true, publicado_en = NOW() WHERE slug = 'quienessomos';
UPDATE pages SET publicada = true, publicado_en = NOW() WHERE slug = 'servicios';
UPDATE pages SET publicada = true, publicado_en = NOW() WHERE slug = 'eventos';
UPDATE pages SET publicada = true, publicado_en = NOW() WHERE slug = 'contacto';
UPDATE pages SET publicada = true, publicado_en = NOW() WHERE slug = 'summer-camp';
UPDATE pages SET publicada = true, publicado_en = NOW() WHERE slug = 'academiadefutbol';
UPDATE pages SET publicada = true, publicado_en = NOW() WHERE slug = 'academiadepickleball';
UPDATE pages SET publicada = true, publicado_en = NOW() WHERE slug = 'clasesparticularesfutbol';
UPDATE pages SET publicada = true, publicado_en = NOW() WHERE slug = 'clasesparticularespickleball';
*/

-- Verificar cuáles páginas están publicadas
SELECT 
  slug, 
  titulo, 
  publicada, 
  publicado_en,
  (SELECT COUNT(*) FROM page_sections WHERE page_id = pages.id) as secciones
FROM pages
ORDER BY slug;
