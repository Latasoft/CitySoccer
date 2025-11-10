-- =====================================================
-- SCRIPT PARA CORREGIR POLÍTICAS RLS EN SUPABASE
-- Ejecutar en el SQL Editor de Supabase
-- =====================================================

-- 1. ELIMINAR POLÍTICAS RESTRICTIVAS EXISTENTES
DROP POLICY IF EXISTS "Escritura autenticada configuraciones" ON configuraciones;
DROP POLICY IF EXISTS "Escritura autenticada precios" ON precios;
DROP POLICY IF EXISTS "Escritura autenticada imágenes" ON imagenes;
DROP POLICY IF EXISTS "Escritura autenticada contenido" ON contenido_editable;

-- 2. ELIMINAR POLÍTICAS DE LECTURA EXISTENTES (para recrearlas)
DROP POLICY IF EXISTS "Lectura pública configuraciones" ON configuraciones;
DROP POLICY IF EXISTS "Lectura pública precios" ON precios;
DROP POLICY IF EXISTS "Lectura pública imágenes" ON imagenes;
DROP POLICY IF EXISTS "Lectura pública contenido" ON contenido_editable;

-- 3. CREAR POLÍTICAS PÚBLICAS DE LECTURA SIMPLES
CREATE POLICY "allow_public_read_configuraciones" ON configuraciones 
    FOR SELECT USING (true);

CREATE POLICY "allow_public_read_precios" ON precios 
    FOR SELECT USING (true);

CREATE POLICY "allow_public_read_imagenes" ON imagenes 
    FOR SELECT USING (true);

CREATE POLICY "allow_public_read_contenido" ON contenido_editable 
    FOR SELECT USING (true);

-- 4. VERIFICAR POLÍTICAS CREADAS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('configuraciones', 'precios', 'imagenes', 'contenido_editable');

-- 5. VERIFICAR QUE LAS TABLAS TIENEN DATOS
SELECT 'configuraciones' as tabla, COUNT(*) as registros FROM configuraciones
UNION ALL
SELECT 'precios' as tabla, COUNT(*) as registros FROM precios
UNION ALL
SELECT 'imagenes' as tabla, COUNT(*) as registros FROM imagenes
UNION ALL
SELECT 'contenido_editable' as tabla, COUNT(*) as registros FROM contenido_editable;

-- 6. TEST DE LECTURA PÚBLICA (debería funcionar sin autenticación)
SELECT tipo_cancha, dia_semana, COUNT(*) as horarios_disponibles
FROM precios 
WHERE tipo_cancha = 'futbol9'
GROUP BY tipo_cancha, dia_semana;

-- 7. VERIFICAR RLS ESTÁ HABILITADO
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('configuraciones', 'precios', 'imagenes', 'contenido_editable');
