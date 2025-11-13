-- ========================================
-- DESPUBLICAR PÁGINAS DEL CMS TEMPORALMENTE
-- ========================================
-- Esto permite que las páginas estáticas actuales sigan funcionando
-- mientras preparamos el contenido en el CMS

UPDATE pages SET publicada = false WHERE slug IN (
  'quienessomos',
  'servicios',
  'eventos',
  'contacto',
  'summer-camp',
  'academiadefutbol',
  'academiadepickleball',
  'clasesparticularesfutbol',
  'clasesparticularespickleball'
);

-- Verificar que se despublicaron
SELECT slug, titulo, publicada FROM pages;
