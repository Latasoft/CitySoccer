-- =====================================================
-- POLÍTICAS DE STORAGE PARA BUCKET "imagenes"
-- =====================================================
-- Este script configura las políticas RLS para permitir
-- uploads públicos y acceso a las imágenes
--
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- 
-- NOTA: El bucket ya está configurado como público con:
-- - public: true
-- - file_size_limit: 52428800 (50MB)
-- - allowed_mime_types: null (todos los tipos permitidos)

-- 1. VERIFICAR QUE EL BUCKET EXISTE
SELECT * FROM storage.buckets WHERE name = 'imagenes';

-- 2. El bucket ya es público, no necesitas ejecutar esto
-- UPDATE storage.buckets 
-- SET public = true 
-- WHERE name = 'imagenes';

-- 3. ELIMINAR POLÍTICAS EXISTENTES (si las hay)
DROP POLICY IF EXISTS "Permitir lectura pública de imagenes" ON storage.objects;
DROP POLICY IF EXISTS "Permitir upload de imagenes autenticadas" ON storage.objects;
DROP POLICY IF EXISTS "Permitir upload de imagenes para todos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir actualizar imagenes" ON storage.objects;
DROP POLICY IF EXISTS "Permitir eliminar imagenes" ON storage.objects;

-- 4. POLÍTICA: LECTURA PÚBLICA (cualquiera puede ver las imágenes)
CREATE POLICY "Permitir lectura pública de imagenes"
ON storage.objects FOR SELECT
USING (bucket_id = 'imagenes');

-- 5. POLÍTICA: UPLOAD PARA USUARIOS AUTENTICADOS
-- (solo usuarios logueados pueden subir)
CREATE POLICY "Permitir upload de imagenes autenticadas"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'imagenes');

-- 6. POLÍTICA ALTERNATIVA: UPLOAD PÚBLICO (SI QUIERES PERMITIR A TODOS)
-- Descomenta las siguientes líneas si quieres que cualquiera pueda subir
-- CREATE POLICY "Permitir upload de imagenes para todos"
-- ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'imagenes');

-- 7. POLÍTICA: ACTUALIZAR IMÁGENES (solo usuarios autenticados)
CREATE POLICY "Permitir actualizar imagenes"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'imagenes')
WITH CHECK (bucket_id = 'imagenes');

-- 8. POLÍTICA: ELIMINAR IMÁGENES (solo usuarios autenticados)
CREATE POLICY "Permitir eliminar imagenes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'imagenes');

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Ver las políticas creadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'objects'
AND policyname LIKE '%imagenes%';

-- Ver configuración del bucket
SELECT name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE name = 'imagenes';

-- =====================================================
-- CONFIGURACIÓN ADICIONAL (OPCIONAL)
-- =====================================================

-- Establecer límite de tamaño de archivo (50MB)
UPDATE storage.buckets 
SET file_size_limit = 52428800 
WHERE name = 'imagenes';

-- Restringir tipos de archivos permitidos (opcional)
-- Descomenta si quieres limitar a solo imágenes y videos
-- UPDATE storage.buckets 
-- SET allowed_mime_types = ARRAY[
--   'image/jpeg',
--   'image/jpg', 
--   'image/png',
--   'image/webp',
--   'image/gif',
--   'video/mp4',
--   'video/webm'
-- ]
-- WHERE name = 'imagenes';

-- =====================================================
-- POLÍTICAS MÁS ESTRICTAS (ALTERNATIVA)
-- =====================================================
-- Si quieres que solo los admins puedan subir/modificar:

-- 1. Crear tabla de roles si no existe
-- CREATE TABLE IF NOT EXISTS public.user_roles (
--   user_id uuid REFERENCES auth.users(id) PRIMARY KEY,
--   role text NOT NULL DEFAULT 'user',
--   created_at timestamp with time zone DEFAULT now()
-- );

-- 2. Política: Solo admins pueden subir
-- CREATE POLICY "Solo admins pueden subir imagenes"
-- ON storage.objects FOR INSERT
-- WITH CHECK (
--   bucket_id = 'imagenes' 
--   AND EXISTS (
--     SELECT 1 FROM public.user_roles
--     WHERE user_id = auth.uid()
--     AND role = 'admin'
--   )
-- );

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================
-- 
-- 1. USUARIOS AUTENTICADOS:
--    - Para usar las políticas "authenticated", necesitas:
--      * Usar SUPABASE_SERVICE_ROLE_KEY en el backend
--      * O tener usuarios logueados con auth.signIn()
--
-- 2. UPLOAD PÚBLICO:
--    - Si descomentas la política "para todos", cualquiera puede subir
--    - Útil para desarrollo, pero riesgoso en producción
--
-- 3. SERVICE ROLE KEY:
--    - Bypasea todas las políticas RLS
--    - Úsala en el backend (scripts de sincronización)
--    - NUNCA la expongas en el frontend
--
-- 4. VERIFICAR POLÍTICAS:
--    - Después de ejecutar, verifica en:
--      Storage > Policies (en el dashboard de Supabase)
--
-- =====================================================
