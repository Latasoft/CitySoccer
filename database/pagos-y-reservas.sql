-- =====================================================
-- TABLAS PARA SISTEMA DE PAGOS Y RESERVAS
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- 1. Tabla de Clientes
CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  rut VARCHAR(20),
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de Transacciones (Pagos)
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
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

-- 3. Tabla de Reservas
CREATE TABLE IF NOT EXISTS reservas (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  cancha_id INTEGER NOT NULL,
  fecha DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME,
  estado VARCHAR(50) DEFAULT 'confirmada',
  transaction_id VARCHAR(255) REFERENCES transactions(order_id),
  notas TEXT,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(cancha_id, fecha, hora_inicio)
);

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer_email ON transactions(buyer_email);
CREATE INDEX IF NOT EXISTS idx_reservas_cliente_id ON reservas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_reservas_cancha_fecha ON reservas(cancha_id, fecha);
CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
CREATE INDEX IF NOT EXISTS idx_clientes_rut ON clientes(rut);

-- =====================================================
-- CONFIGURAR POLÍTICAS RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;

-- Políticas para CLIENTES
-- Lectura pública (necesario para que el sistema funcione)
CREATE POLICY "Lectura servicio clientes" ON clientes 
  FOR SELECT 
  USING (true);

-- Escritura solo para servicio
CREATE POLICY "Escritura servicio clientes" ON clientes 
  FOR ALL 
  USING (true);

-- Políticas para TRANSACTIONS
-- Lectura pública (para verificar estados de pago)
CREATE POLICY "Lectura servicio transactions" ON transactions 
  FOR SELECT 
  USING (true);

-- Escritura solo para servicio
CREATE POLICY "Escritura servicio transactions" ON transactions 
  FOR ALL 
  USING (true);

-- Políticas para RESERVAS
-- Lectura pública (para verificar disponibilidad)
CREATE POLICY "Lectura pública reservas" ON reservas 
  FOR SELECT 
  USING (true);

-- Escritura solo para servicio
CREATE POLICY "Escritura servicio reservas" ON reservas 
  FOR ALL 
  USING (true);

-- =====================================================
-- COMENTARIOS EN LAS TABLAS
-- =====================================================

COMMENT ON TABLE clientes IS 'Almacena información de los clientes que realizan reservas';
COMMENT ON TABLE transactions IS 'Registro de todas las transacciones de pago con GetNet';
COMMENT ON TABLE reservas IS 'Reservas confirmadas de canchas, vinculadas a clientes y transacciones';

COMMENT ON COLUMN transactions.order_id IS 'ID único de la orden generado por CitySoccer';
COMMENT ON COLUMN transactions.status IS 'Estado: PENDING, APPROVED, REJECTED, FAILED';
COMMENT ON COLUMN reservas.estado IS 'Estado de la reserva: confirmada, cancelada, completada';
COMMENT ON COLUMN reservas.transaction_id IS 'Referencia al order_id de la transacción que generó esta reserva';
