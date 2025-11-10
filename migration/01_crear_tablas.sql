-- =====================================================
-- SCRIPT 1: CREAR TODAS LAS TABLAS
-- Ejecutar PRIMERO en el nuevo proyecto Supabase
-- Basado en el esquema real detectado el 10/11/2025
-- =====================================================

-- =====================================================
-- 1. TABLA: clientes
-- =====================================================
CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  correo VARCHAR(255) UNIQUE NOT NULL,  -- En la BD real se llama 'correo' no 'email'
  telefono VARCHAR(20),
  rut VARCHAR(20),
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE clientes IS 'Almacena información de los clientes que realizan reservas';
COMMENT ON COLUMN clientes.correo IS 'Email del cliente (campo llamado correo por compatibilidad)';
COMMENT ON COLUMN clientes.rut IS 'RUT del cliente chileno (formato: 12345678-9)';

-- =====================================================
-- 2. TABLA: transactions
-- =====================================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(255) UNIQUE NOT NULL,
  amount INTEGER NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'CLP',
  buyer_email VARCHAR(255) NOT NULL,
  buyer_name VARCHAR(255) NOT NULL,
  buyer_phone VARCHAR(20),
  buyer_rut VARCHAR(20),
  description TEXT,
  fecha DATE,
  hora TIME,
  cancha_id INTEGER,
  tipo_cancha VARCHAR(50),
  status VARCHAR(50) DEFAULT 'PENDING',
  getnet_request_id VARCHAR(255),
  process_url TEXT,
  getnet_status VARCHAR(50),
  getnet_reason VARCHAR(255),
  getnet_message TEXT,
  payment_method VARCHAR(100),
  authorization_code VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  webhook_received_at TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE transactions IS 'Registro de todas las transacciones de pago con GetNet';
COMMENT ON COLUMN transactions.order_id IS 'ID único de la orden generado por CitySoccer (formato: CS-timestamp)';
COMMENT ON COLUMN transactions.status IS 'Estado: PENDING, APPROVED, REJECTED, FAILED';
COMMENT ON COLUMN transactions.buyer_phone IS 'Teléfono del comprador (puede ser genérico si no se solicitó)';
COMMENT ON COLUMN transactions.buyer_rut IS 'RUT del comprador (puede ser genérico si no se solicitó)';

-- =====================================================
-- 3. TABLA: canchas
-- =====================================================
CREATE TABLE IF NOT EXISTS canchas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  tipo VARCHAR(20) NOT NULL,  -- f7, f9, pickleball (valores compatibles con BD antigua)
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE canchas IS 'Catálogo de canchas disponibles';
COMMENT ON COLUMN canchas.tipo IS 'Tipo de cancha: f7, f9, pickleball (mantener compatibilidad con datos existentes)';

-- =====================================================
-- 4. TABLA: reservas
-- =====================================================
CREATE TABLE IF NOT EXISTS reservas (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  cancha_id INTEGER NOT NULL REFERENCES canchas(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME,
  estado VARCHAR(50) DEFAULT 'confirmada',
  transaction_id VARCHAR(255) REFERENCES transactions(order_id) ON DELETE SET NULL,
  notas TEXT,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(cancha_id, fecha, hora_inicio)
);

COMMENT ON TABLE reservas IS 'Reservas confirmadas de canchas, vinculadas a clientes y transacciones';
COMMENT ON COLUMN reservas.estado IS 'Estado de la reserva: confirmada, pendiente, cancelada, completada';
COMMENT ON COLUMN reservas.transaction_id IS 'Referencia al order_id de la transacción que generó esta reserva';
COMMENT ON COLUMN reservas.hora_fin IS 'Hora de finalización (generalmente hora_inicio + 1 hora)';

-- =====================================================
-- AGREGAR FOREIGN KEY ADICIONAL (Opcional pero recomendado)
-- =====================================================

-- Foreign key de transactions a canchas (para integridad referencial)
ALTER TABLE transactions 
  ADD CONSTRAINT fk_transactions_cancha 
  FOREIGN KEY (cancha_id) 
  REFERENCES canchas(id) 
  ON DELETE SET NULL;

-- =====================================================
-- 5. TABLA: precios
-- =====================================================
CREATE TABLE IF NOT EXISTS precios (
  id SERIAL PRIMARY KEY,
  tipo_cancha VARCHAR(20) NOT NULL,  -- futbol7, futbol9, pickleball, pickleball-dobles
  dia_semana VARCHAR(15) NOT NULL,    -- weekdays, saturday, sunday
  hora VARCHAR(5) NOT NULL,           -- formato HH:MM (09:00, 10:00, etc.)
  precio INTEGER NOT NULL,
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tipo_cancha, dia_semana, hora)
);

COMMENT ON TABLE precios IS 'Tabla de precios dinámicos por tipo de cancha, día y hora';
COMMENT ON COLUMN precios.tipo_cancha IS 'Tipo: futbol7, futbol9, pickleball, pickleball-dobles';
COMMENT ON COLUMN precios.dia_semana IS 'weekdays (L-V), saturday (Sábado), sunday (Domingo)';

-- =====================================================
-- 6. TABLA: configuraciones
-- =====================================================
CREATE TABLE IF NOT EXISTS configuraciones (
  id SERIAL PRIMARY KEY,
  clave VARCHAR(100) UNIQUE NOT NULL,
  valor TEXT NOT NULL,
  descripcion TEXT,
  categoria VARCHAR(50) NOT NULL,  -- contacto, redes_sociales, operacion, etc.
  tipo VARCHAR(20) DEFAULT 'texto', -- texto, numero, email, url, telefono
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE configuraciones IS 'Configuraciones generales del sistema (contacto, redes sociales, etc.)';

-- =====================================================
-- 7. TABLA: imagenes
-- =====================================================
CREATE TABLE IF NOT EXISTS imagenes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  categoria VARCHAR(50) NOT NULL,  -- hero, canchas, eventos, logos, etc.
  url TEXT NOT NULL,
  archivo_nombre TEXT NOT NULL,
  descripcion TEXT,
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE imagenes IS 'Gestión de imágenes del sitio web';

-- =====================================================
-- 8. TABLA: contenido_editable
-- =====================================================
CREATE TABLE IF NOT EXISTS contenido_editable (
  id SERIAL PRIMARY KEY,
  seccion VARCHAR(50) NOT NULL,  -- hero, about, services, etc.
  clave VARCHAR(100) NOT NULL,
  contenido TEXT NOT NULL,
  tipo VARCHAR(20) DEFAULT 'texto',  -- texto, html, markdown
  descripcion TEXT,
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(seccion, clave)
);

COMMENT ON TABLE contenido_editable IS 'Contenido editable del sitio web (textos, descripciones, etc.)';

-- =====================================================
-- CREAR ÍNDICES PARA MEJOR RENDIMIENTO
-- =====================================================

-- Índices para clientes
CREATE INDEX IF NOT EXISTS idx_clientes_correo ON clientes(correo);
CREATE INDEX IF NOT EXISTS idx_clientes_rut ON clientes(rut);

-- Índices para transactions
CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer_email ON transactions(buyer_email);
CREATE INDEX IF NOT EXISTS idx_transactions_fecha ON transactions(fecha);
CREATE INDEX IF NOT EXISTS idx_transactions_cancha_fecha ON transactions(cancha_id, fecha);

-- Índices para reservas
CREATE INDEX IF NOT EXISTS idx_reservas_cliente_id ON reservas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_reservas_cancha_fecha ON reservas(cancha_id, fecha);
CREATE INDEX IF NOT EXISTS idx_reservas_fecha ON reservas(fecha);
CREATE INDEX IF NOT EXISTS idx_reservas_transaction_id ON reservas(transaction_id);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON reservas(estado);

-- Índices para precios
CREATE INDEX IF NOT EXISTS idx_precios_tipo_cancha ON precios(tipo_cancha);
CREATE INDEX IF NOT EXISTS idx_precios_activo ON precios(activo);

-- =====================================================
-- VERIFICAR CREACIÓN DE TABLAS
-- =====================================================

SELECT 
  schemaname,
  tablename,
  CASE WHEN rowsecurity THEN '🔒 RLS Enabled' ELSE '⚠️ RLS Disabled' END as security_status
FROM pg_tables 
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
ORDER BY tablename;

-- Si ves las 8 tablas listadas arriba, ¡las tablas se crearon exitosamente! ✅
-- Continúa con el script 02_configurar_rls.sql
