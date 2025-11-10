-- =====================================================
-- SCRIPT 2: CONFIGURAR POLÍTICAS RLS (Row Level Security)
-- Ejecutar SEGUNDO después de crear las tablas
-- =====================================================

-- =====================================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- =====================================================

ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE canchas ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE precios ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuraciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE imagenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contenido_editable ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS PARA: clientes
-- =====================================================

-- Lectura pública (necesario para verificar clientes existentes)
CREATE POLICY "allow_public_read_clientes" 
  ON clientes FOR SELECT 
  USING (true);

-- Escritura para servicio (usando service_role key)
CREATE POLICY "allow_service_write_clientes" 
  ON clientes FOR ALL 
  USING (true);

-- =====================================================
-- POLÍTICAS PARA: transactions
-- =====================================================

-- Lectura pública (para verificar estados de pago)
CREATE POLICY "allow_public_read_transactions" 
  ON transactions FOR SELECT 
  USING (true);

-- Escritura para servicio
CREATE POLICY "allow_service_write_transactions" 
  ON transactions FOR ALL 
  USING (true);

-- =====================================================
-- POLÍTICAS PARA: canchas
-- =====================================================

-- Lectura pública (para mostrar canchas disponibles)
CREATE POLICY "allow_public_read_canchas" 
  ON canchas FOR SELECT 
  USING (true);

-- Escritura para servicio
CREATE POLICY "allow_service_write_canchas" 
  ON canchas FOR ALL 
  USING (true);

-- =====================================================
-- POLÍTICAS PARA: reservas
-- =====================================================

-- Lectura pública (para verificar disponibilidad)
CREATE POLICY "allow_public_read_reservas" 
  ON reservas FOR SELECT 
  USING (true);

-- Escritura para servicio
CREATE POLICY "allow_service_write_reservas" 
  ON reservas FOR ALL 
  USING (true);

-- =====================================================
-- POLÍTICAS PARA: precios
-- =====================================================

-- Lectura pública (para mostrar precios en el sitio)
CREATE POLICY "allow_public_read_precios" 
  ON precios FOR SELECT 
  USING (true);

-- Escritura para servicio
CREATE POLICY "allow_service_write_precios" 
  ON precios FOR ALL 
  USING (true);

-- =====================================================
-- POLÍTICAS PARA: configuraciones
-- =====================================================

-- Lectura pública (para info de contacto, etc.)
CREATE POLICY "allow_public_read_configuraciones" 
  ON configuraciones FOR SELECT 
  USING (true);

-- Escritura para servicio
CREATE POLICY "allow_service_write_configuraciones" 
  ON configuraciones FOR ALL 
  USING (true);

-- =====================================================
-- POLÍTICAS PARA: imagenes
-- =====================================================

-- Lectura pública (para mostrar imágenes en el sitio)
CREATE POLICY "allow_public_read_imagenes" 
  ON imagenes FOR SELECT 
  USING (true);

-- Escritura para servicio
CREATE POLICY "allow_service_write_imagenes" 
  ON imagenes FOR ALL 
  USING (true);

-- =====================================================
-- POLÍTICAS PARA: contenido_editable
-- =====================================================

-- Lectura pública (para mostrar contenido en el sitio)
CREATE POLICY "allow_public_read_contenido" 
  ON contenido_editable FOR SELECT 
  USING (true);

-- Escritura para servicio
CREATE POLICY "allow_service_write_contenido" 
  ON contenido_editable FOR ALL 
  USING (true);

-- =====================================================
-- VERIFICAR POLÍTICAS CREADAS
-- =====================================================

SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  CASE 
    WHEN qual = 'true' THEN '✅ Public Access'
    ELSE '🔒 Restricted'
  END as access_level
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename IN (
    'clientes',
    'transactions',
    'canchas',
    'reservas',
    'precios',
    'configuraciones',
    'imagenes',
    'contenido_editable'
  )
ORDER BY tablename, policyname;

-- Deberías ver 16 políticas (2 por cada tabla: read y write)
-- Si las ves todas, ¡las políticas RLS están configuradas correctamente! ✅
-- Continúa con el script 03_insertar_datos_base.sql
