-- ============================================================================
-- AGREGAR USUARIO ADMIN A LA TABLA admin_users
-- ============================================================================
-- Este script agrega el usuario admin principal al sistema
-- Ejecutar en Supabase SQL Editor
-- ============================================================================

-- Primero, verificar si el usuario existe en auth.users
SELECT 
  id,
  email,
  created_at
FROM auth.users
WHERE email = 'citysoccersantiago@gmail.com';

-- Agregar el usuario a admin_users (solo si no existe)
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

-- Verificar que se agregó correctamente
SELECT 
  au.id,
  au.email,
  au.nombre,
  au.activo,
  au.creado_en,
  u.email as auth_email
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
WHERE au.email = 'citysoccersantiago@gmail.com';

-- Listar todos los admins activos
SELECT 
  au.id,
  au.email,
  au.nombre,
  au.activo,
  au.creado_en
FROM admin_users au
WHERE au.activo = true
ORDER BY au.creado_en;
