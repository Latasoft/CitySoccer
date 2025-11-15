# Configuración de Buckets en Supabase Storage

## 1. Acceder a Supabase Dashboard

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto CitySoccer
3. En el menú lateral, haz clic en **Storage**

## 2. Crear Bucket "content"

1. Haz clic en **New bucket**
2. Nombre: `content`
3. **Public bucket**: ✅ **SÍ** (activa esta opción)
4. Haz clic en **Create bucket**

### Configurar políticas RLS para "content"

Ve a la pestaña **Policies** del bucket `content` y crea estas políticas:

**Política 1: Lectura pública**
```sql
-- Nombre: Public read access for content
-- Operación: SELECT
CREATE POLICY "Public read access for content"
ON storage.objects FOR SELECT
USING (bucket_id = 'content');
```

**Política 2: Escritura para admin**
```sql
-- Nombre: Admin write access for content
-- Operación: INSERT
CREATE POLICY "Admin write access for content"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'content' 
  AND auth.role() = 'authenticated'
);
```

**Política 3: Actualización para admin**
```sql
-- Nombre: Admin update access for content
-- Operación: UPDATE
CREATE POLICY "Admin update access for content"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'content' 
  AND auth.role() = 'authenticated'
);
```

## 3. Crear Bucket "images"

1. Haz clic en **New bucket**
2. Nombre: `images`
3. **Public bucket**: ✅ **SÍ** (activa esta opción)
4. Haz clic en **Create bucket**

### Configurar políticas RLS para "images"

Ve a la pestaña **Policies** del bucket `images` y crea estas políticas:

**Política 1: Lectura pública**
```sql
-- Nombre: Public read access for images
-- Operación: SELECT
CREATE POLICY "Public read access for images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');
```

**Política 2: Escritura para admin**
```sql
-- Nombre: Admin write access for images
-- Operación: INSERT
CREATE POLICY "Admin write access for images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);
```

**Política 3: Actualización para admin**
```sql
-- Nombre: Admin update access for images
-- Operación: UPDATE
CREATE POLICY "Admin update access for images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);
```

**Política 4: Eliminación para admin**
```sql
-- Nombre: Admin delete access for images
-- Operación: DELETE
CREATE POLICY "Admin delete access for images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);
```

## 4. Verificar configuración

Después de crear los buckets, verifica:

1. **Content bucket**:
   - ✅ Público
   - ✅ 3 políticas (SELECT público, INSERT/UPDATE autenticado)

2. **Images bucket**:
   - ✅ Público
   - ✅ 4 políticas (SELECT público, INSERT/UPDATE/DELETE autenticado)

## 5. Obtener URLs de los buckets

Las URLs públicas serán:
- Content: `https://ckbebftjgqearfubmgus.supabase.co/storage/v1/object/public/content/`
- Images: `https://ckbebftjgqearfubmgus.supabase.co/storage/v1/object/public/images/`

## Notas importantes

- Los buckets públicos permiten acceso de lectura sin autenticación
- La escritura requiere autenticación (admin)
- Cloudflare CDN se activa automáticamente para buckets públicos
- Los archivos se cachean en el edge para máxima velocidad
