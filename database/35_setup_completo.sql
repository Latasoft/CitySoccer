-- ============================================================================
-- CONFIGURACIÓN COMPLETA: HOME + ADMIN USER
-- ============================================================================
-- Script all-in-one para configurar todo lo necesario
-- ============================================================================

-- PASO 1: Agregar usuario admin a admin_users
INSERT INTO admin_users (user_id, email, nombre, activo)
SELECT 
  u.id,
  u.email,
  'Administrador City Soccer',
  true
FROM auth.users u
WHERE u.email = 'citysoccersantiago@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM admin_users au WHERE au.user_id = u.id
  );

-- PASO 2: Despublicar página home del CMS
UPDATE pages 
SET publicada = false, activa = false, actualizado_en = NOW()
WHERE slug = 'home';

-- PASO 3: Configurar campos editables para Home
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order, help_text) VALUES
  ('home', 'hero_title', 'text', 'Bienvenido a City Soccer', 'Título Hero', 'hero', 1, 'Título principal del hero'),
  ('home', 'hero_subtitle', 'textarea', 'El mejor lugar para jugar fútbol y pickleball', 'Subtítulo Hero', 'hero', 2, 'Descripción bajo el título'),
  ('home', 'hero_cta_text', 'text', 'RESERVA HOY', 'Texto Botón CTA', 'hero', 3, 'Texto del botón principal'),
  ('home', 'carousel_title', 'text', 'Descubre City Soccer', 'Título Carousel', 'carousel', 4, 'Título del carousel de tarjetas'),
  ('home', 'carousel_subtitle', 'textarea', 'Experiencias deportivas únicas que transforman tu forma de jugar y vivir el deporte', 'Subtítulo Carousel', 'carousel', 5, 'Descripción del carousel')
ON CONFLICT (page_key, field_key) DO UPDATE
SET 
  field_value = EXCLUDED.field_value,
  field_label = EXCLUDED.field_label,
  actualizado_en = NOW();

-- ============================================================================
-- VERIFICACIONES
-- ============================================================================

-- Verificar admin user
SELECT 
  au.id,
  au.email,
  au.nombre,
  au.activo,
  u.email as auth_email
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
WHERE au.email = 'citysoccersantiago@gmail.com';

-- Verificar campos editables home
SELECT 
  page_key,
  field_key,
  field_type,
  LEFT(field_value, 50) as field_value_preview,
  field_label,
  field_group
FROM editable_content
WHERE page_key = 'home'
ORDER BY display_order;

-- Verificar página home despublicada
SELECT slug, titulo, publicada, activa
FROM pages
WHERE slug = 'home';

-- ============================================================================
-- RESULTADO ESPERADO
-- ============================================================================
-- ✅ Usuario admin agregado y activo
-- ✅ Página home despublicada (usará Hero + CardCarousel original)
-- ✅ 5 campos editables configurados para home
-- ✅ Listo para editar in-place desde la web
