-- =====================================================
-- SCRIPT 7: CREAR TABLA PARA GESTIÓN DE USUARIOS ADMIN
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- Crear tabla para gestionar usuarios administradores
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  nombre VARCHAR(255),
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Política: Lectura pública (necesaria para verificar permisos)
CREATE POLICY "allow_public_read_admin_users" 
  ON admin_users FOR SELECT 
  USING (true);

-- Política: Escritura solo con service_role key
CREATE POLICY "allow_service_write_admin_users" 
  ON admin_users FOR ALL 
  USING (true);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- =====================================================
-- VERIFICAR TABLA CREADA
-- =====================================================
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'admin_users'
ORDER BY ordinal_position;
