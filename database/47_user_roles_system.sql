-- =====================================================
-- SISTEMA DE ROLES PARA USUARIOS
-- =====================================================
-- Este script crea el sistema de roles para diferenciar
-- entre administradores y empleados
-- =====================================================

-- 1. Crear tabla de roles
CREATE TABLE IF NOT EXISTS user_roles (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) UNIQUE NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Insertar roles predefinidos
INSERT INTO user_roles (nombre, descripcion) VALUES
  ('admin', 'Administrador con acceso completo al sistema'),
  ('empleado', 'Empleado con acceso de solo lectura a reservas')
ON CONFLICT (nombre) DO NOTHING;

-- 3. Agregar columna rol_id a admin_users
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS rol_id INTEGER REFERENCES user_roles(id) DEFAULT 1;

-- 4. Actualizar usuarios existentes como admins
UPDATE admin_users 
SET rol_id = (SELECT id FROM user_roles WHERE nombre = 'admin')
WHERE rol_id IS NULL;

-- 5. Hacer rol_id NOT NULL después de migrar datos
ALTER TABLE admin_users 
ALTER COLUMN rol_id SET NOT NULL;

-- 6. Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_admin_users_rol ON admin_users(rol_id);

-- 7. Comentarios para documentación
COMMENT ON TABLE user_roles IS 'Roles disponibles en el sistema';
COMMENT ON COLUMN admin_users.rol_id IS 'Rol del usuario: 1=admin, 2=empleado';

-- =====================================================
-- VERIFICACIÓN
-- =====================================================
-- SELECT * FROM user_roles;
-- SELECT u.id, u.email, u.nombre, r.nombre as rol 
-- FROM admin_users u 
-- LEFT JOIN user_roles r ON u.rol_id = r.id;
