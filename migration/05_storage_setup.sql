-- =====================================================
-- SCRIPT 5: CONFIGURAR STORAGE (Bucket de Imágenes)
-- Ejecutar QUINTO después de migrar datos
-- =====================================================

-- =====================================================
-- 1. CREAR BUCKET PARA IMÁGENES
-- =====================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'imagenes',
  'imagenes',
  true,
  5242880,  -- 5MB límite
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- =====================================================
-- 2. POLÍTICAS PARA LECTURA PÚBLICA
-- =====================================================

CREATE POLICY IF NOT EXISTS "Lectura pública imágenes storage"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'imagenes');

-- =====================================================
-- 3. POLÍTICAS PARA SUBIDA (Solo usuarios autenticados)
-- =====================================================

CREATE POLICY IF NOT EXISTS "Subida autenticada imágenes storage"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'imagenes' AND 
    auth.role() = 'authenticated'
  );

-- =====================================================
-- 4. POLÍTICAS PARA ACTUALIZACIÓN
-- =====================================================

CREATE POLICY IF NOT EXISTS "Actualización autenticada imágenes storage"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'imagenes' AND 
    auth.role() = 'authenticated'
  );

-- =====================================================
-- 5. POLÍTICAS PARA ELIMINACIÓN
-- =====================================================

CREATE POLICY IF NOT EXISTS "Eliminación autenticada imágenes storage"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'imagenes' AND 
    auth.role() = 'authenticated'
  );

-- =====================================================
-- 6. VERIFICAR CONFIGURACIÓN DEL STORAGE
-- =====================================================

SELECT 
  id as bucket_id,
  name as bucket_name,
  CASE WHEN public THEN '✅ Público' ELSE '🔒 Privado' END as access,
  file_size_limit / 1048576 || ' MB' as max_file_size,
  created_at
FROM storage.buckets
WHERE id = 'imagenes';

-- Si ves el bucket 'imagenes' listado, ¡el storage está configurado! ✅
-- Ahora puedes subir las imágenes desde el dashboard o usar el script de migración

SELECT '✅ Storage configurado exitosamente' as resultado;
-- Siguiente paso: Migrar las imágenes físicas del storage antiguo al nuevo
