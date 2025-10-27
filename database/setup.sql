-- =====================================================
-- SCRIPT SQL PARA CREAR TABLAS EN SUPABASE
-- Ejecutar estas queries en el SQL Editor de Supabase
-- =====================================================

-- 1. Tabla para configuraciones generales (contacto, redes sociales, etc.)
CREATE TABLE IF NOT EXISTS configuraciones (
    id SERIAL PRIMARY KEY,
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(50) NOT NULL,
    tipo VARCHAR(20) DEFAULT 'texto', -- texto, numero, email, url, telefono
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla para precios de canchas
CREATE TABLE IF NOT EXISTS precios (
    id SERIAL PRIMARY KEY,
    tipo_cancha VARCHAR(20) NOT NULL, -- futbol7, futbol9, pickleball
    dia_semana VARCHAR(15) NOT NULL, -- weekdays, saturday, sunday
    hora VARCHAR(5) NOT NULL, -- formato HH:MM
    precio INTEGER NOT NULL,
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tipo_cancha, dia_semana, hora)
);

-- 3. Tabla para gestión de imágenes
CREATE TABLE IF NOT EXISTS imagenes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL, -- hero, canchas, eventos, logos, etc.
    url TEXT NOT NULL,
    archivo_nombre TEXT NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla para contenido editable
CREATE TABLE IF NOT EXISTS contenido_editable (
    id SERIAL PRIMARY KEY,
    seccion VARCHAR(50) NOT NULL, -- hero, about, services, etc.
    clave VARCHAR(100) NOT NULL,
    contenido TEXT NOT NULL,
    tipo VARCHAR(20) DEFAULT 'texto', -- texto, html, markdown
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(seccion, clave)
);

-- =====================================================
-- INSERTAR DATOS POR DEFECTO
-- =====================================================

-- Configuraciones por defecto
INSERT INTO configuraciones (clave, valor, descripcion, categoria, tipo) VALUES
('telefono_principal', '+56974265019', 'Teléfono principal de contacto', 'contacto', 'telefono'),
('email_principal', 'contacto@citysoccer.cl', 'Email principal de contacto', 'contacto', 'email'),
('instagram', '@citysoccersantiago', 'Usuario de Instagram', 'redes_sociales', 'texto'),
('direccion', 'Tiltil 2569, Macul', 'Dirección de las instalaciones', 'contacto', 'texto'),
('whatsapp', '+56974265019', 'Número de WhatsApp', 'contacto', 'telefono'),
('facebook', 'CitySoccerSantiago', 'Usuario de Facebook', 'redes_sociales', 'texto'),
('horario_semana', 'Lunes a Viernes: 9:00 - 23:00', 'Horario de atención entre semana', 'operacion', 'texto'),
('horario_sabado', 'Sábados: 9:00 - 23:00', 'Horario de atención sábados', 'operacion', 'texto'),
('horario_domingo', 'Domingos: 9:00 - 23:00', 'Horario de atención domingos', 'operacion', 'texto')
ON CONFLICT (clave) DO NOTHING;

-- Precios por defecto para Fútbol 7
INSERT INTO precios (tipo_cancha, dia_semana, hora, precio) VALUES
-- Fútbol 7 - Entre semana
('futbol7', 'weekdays', '09:00', 30000),
('futbol7', 'weekdays', '10:00', 30000),
('futbol7', 'weekdays', '11:00', 30000),
('futbol7', 'weekdays', '12:00', 30000),
('futbol7', 'weekdays', '13:00', 30000),
('futbol7', 'weekdays', '14:00', 30000),
('futbol7', 'weekdays', '15:00', 30000),
('futbol7', 'weekdays', '16:00', 30000),
('futbol7', 'weekdays', '17:00', 45000),
('futbol7', 'weekdays', '18:00', 50000),
('futbol7', 'weekdays', '19:00', 50000),
('futbol7', 'weekdays', '20:00', 50000),
('futbol7', 'weekdays', '21:00', 50000),
('futbol7', 'weekdays', '22:00', 50000),
('futbol7', 'weekdays', '23:00', 45000),

-- Fútbol 7 - Sábados
('futbol7', 'saturday', '09:00', 30000),
('futbol7', 'saturday', '10:00', 30000),
('futbol7', 'saturday', '11:00', 30000),
('futbol7', 'saturday', '12:00', 30000),
('futbol7', 'saturday', '13:00', 30000),
('futbol7', 'saturday', '14:00', 30000),
('futbol7', 'saturday', '15:00', 30000),
('futbol7', 'saturday', '16:00', 30000),
('futbol7', 'saturday', '17:00', 45000),
('futbol7', 'saturday', '18:00', 50000),
('futbol7', 'saturday', '19:00', 50000),
('futbol7', 'saturday', '20:00', 50000),
('futbol7', 'saturday', '21:00', 50000),
('futbol7', 'saturday', '22:00', 50000),
('futbol7', 'saturday', '23:00', 45000),

-- Fútbol 7 - Domingos
('futbol7', 'sunday', '09:00', 30000),
('futbol7', 'sunday', '10:00', 30000),
('futbol7', 'sunday', '11:00', 30000),
('futbol7', 'sunday', '12:00', 30000),
('futbol7', 'sunday', '13:00', 30000),
('futbol7', 'sunday', '14:00', 30000),
('futbol7', 'sunday', '15:00', 30000),
('futbol7', 'sunday', '16:00', 30000),
('futbol7', 'sunday', '17:00', 45000),
('futbol7', 'sunday', '18:00', 50000),
('futbol7', 'sunday', '19:00', 50000),
('futbol7', 'sunday', '20:00', 50000),
('futbol7', 'sunday', '21:00', 50000),
('futbol7', 'sunday', '22:00', 50000),
('futbol7', 'sunday', '23:00', 45000),

-- Fútbol 9 - Entre semana
('futbol9', 'weekdays', '06:00', 45000),
('futbol9', 'weekdays', '07:00', 45000),
('futbol9', 'weekdays', '08:00', 45000),
('futbol9', 'weekdays', '09:00', 65000),
('futbol9', 'weekdays', '10:00', 65000),
('futbol9', 'weekdays', '11:00', 65000),
('futbol9', 'weekdays', '12:00', 65000),
('futbol9', 'weekdays', '13:00', 65000),
('futbol9', 'weekdays', '14:00', 65000),
('futbol9', 'weekdays', '15:00', 65000),
('futbol9', 'weekdays', '16:00', 65000),
('futbol9', 'weekdays', '17:00', 75000),
('futbol9', 'weekdays', '18:00', 90000),
('futbol9', 'weekdays', '19:00', 90000),
('futbol9', 'weekdays', '20:00', 90000),
('futbol9', 'weekdays', '21:00', 90000),
('futbol9', 'weekdays', '22:00', 90000),
('futbol9', 'weekdays', '23:00', 75000),

-- Fútbol 9 - Sábados
('futbol9', 'saturday', '06:00', 55000),
('futbol9', 'saturday', '09:00', 65000),
('futbol9', 'saturday', '10:00', 65000),
('futbol9', 'saturday', '11:00', 65000),
('futbol9', 'saturday', '12:00', 65000),
('futbol9', 'saturday', '13:00', 65000),
('futbol9', 'saturday', '14:00', 65000),
('futbol9', 'saturday', '15:00', 65000),
('futbol9', 'saturday', '16:00', 65000),
('futbol9', 'saturday', '17:00', 75000),
('futbol9', 'saturday', '18:00', 90000),
('futbol9', 'saturday', '19:00', 90000),
('futbol9', 'saturday', '20:00', 90000),
('futbol9', 'saturday', '21:00', 90000),
('futbol9', 'saturday', '22:00', 90000),
('futbol9', 'saturday', '23:00', 75000),

-- Fútbol 9 - Domingos
('futbol9', 'sunday', '06:00', 65000),
('futbol9', 'sunday', '09:00', 65000),
('futbol9', 'sunday', '10:00', 65000),
('futbol9', 'sunday', '11:00', 65000),
('futbol9', 'sunday', '12:00', 65000),
('futbol9', 'sunday', '13:00', 65000),
('futbol9', 'sunday', '14:00', 65000),
('futbol9', 'sunday', '15:00', 65000),
('futbol9', 'sunday', '16:00', 65000),
('futbol9', 'sunday', '17:00', 75000),
('futbol9', 'sunday', '18:00', 90000),
('futbol9', 'sunday', '19:00', 90000),
('futbol9', 'sunday', '20:00', 90000),
('futbol9', 'sunday', '21:00', 90000),
('futbol9', 'sunday', '22:00', 90000),
('futbol9', 'sunday', '23:00', 75000),

-- Pickleball - Todos los días
('pickleball', 'weekdays', '06:00', 15000),
('pickleball', 'weekdays', '07:00', 15000),
('pickleball', 'weekdays', '08:00', 15000),
('pickleball', 'weekdays', '09:00', 15000),
('pickleball', 'weekdays', '10:00', 15000),
('pickleball', 'weekdays', '11:00', 15000),
('pickleball', 'weekdays', '12:00', 15000),
('pickleball', 'weekdays', '13:00', 15000),
('pickleball', 'weekdays', '14:00', 15000),
('pickleball', 'weekdays', '15:00', 15000),
('pickleball', 'weekdays', '16:00', 15000),
('pickleball', 'weekdays', '17:00', 15000),
('pickleball', 'weekdays', '18:00', 15000),
('pickleball', 'weekdays', '19:00', 15000),
('pickleball', 'weekdays', '20:00', 15000),
('pickleball', 'weekdays', '21:00', 15000),
('pickleball', 'weekdays', '22:00', 15000),
('pickleball', 'weekdays', '23:00', 15000),

('pickleball', 'saturday', '06:00', 20000),
('pickleball', 'saturday', '09:00', 15000),
('pickleball', 'saturday', '10:00', 15000),
('pickleball', 'saturday', '11:00', 15000),
('pickleball', 'saturday', '12:00', 15000),
('pickleball', 'saturday', '13:00', 15000),
('pickleball', 'saturday', '14:00', 15000),
('pickleball', 'saturday', '15:00', 15000),
('pickleball', 'saturday', '16:00', 15000),
('pickleball', 'saturday', '17:00', 15000),
('pickleball', 'saturday', '18:00', 15000),
('pickleball', 'saturday', '19:00', 15000),
('pickleball', 'saturday', '20:00', 15000),
('pickleball', 'saturday', '21:00', 15000),
('pickleball', 'saturday', '22:00', 15000),
('pickleball', 'saturday', '23:00', 15000),

('pickleball', 'sunday', '06:00', 25000),
('pickleball', 'sunday', '09:00', 15000),
('pickleball', 'sunday', '10:00', 15000),
('pickleball', 'sunday', '11:00', 15000),
('pickleball', 'sunday', '12:00', 15000),
('pickleball', 'sunday', '13:00', 15000),
('pickleball', 'sunday', '14:00', 15000),
('pickleball', 'sunday', '15:00', 15000),
('pickleball', 'sunday', '16:00', 15000),
('pickleball', 'sunday', '17:00', 15000),
('pickleball', 'sunday', '18:00', 15000),
('pickleball', 'sunday', '19:00', 15000),
('pickleball', 'sunday', '20:00', 15000),
('pickleball', 'sunday', '21:00', 15000),
('pickleball', 'sunday', '22:00', 15000),
('pickleball', 'sunday', '23:00', 15000)
ON CONFLICT (tipo_cancha, dia_semana, hora) DO NOTHING;

-- Contenido editable por defecto
INSERT INTO contenido_editable (seccion, clave, contenido, tipo, descripcion) VALUES
('hero', 'titulo_principal', 'Vive la pasión del fútbol y pickleball', 'texto', 'Título principal del hero'),
('hero', 'subtitulo', 'En las mejores canchas de Santiago', 'texto', 'Subtítulo del hero'),
('hero', 'descripcion', 'Disfruta de nuestras modernas instalaciones deportivas', 'texto', 'Descripción del hero'),

('about', 'titulo', 'Sobre City Soccer', 'texto', 'Título de la sección sobre nosotros'),
('about', 'descripcion', 'Más que un centro deportivo, somos una familia unida por la pasión del fútbol.', 'texto', 'Descripción principal sobre nosotros'),

('servicios', 'titulo', 'Nuestros Servicios', 'texto', 'Título de servicios'),
('servicios', 'descripcion', 'Ofrecemos la mejor experiencia deportiva', 'texto', 'Descripción de servicios'),

('contacto', 'titulo', 'Contáctanos', 'texto', 'Título de contacto'),
('contacto', 'descripcion', 'Estamos aquí para ayudarte', 'texto', 'Descripción de contacto')
ON CONFLICT (seccion, clave) DO NOTHING;

-- =====================================================
-- CONFIGURAR POLÍTICAS RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE configuraciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE precios ENABLE ROW LEVEL SECURITY;
ALTER TABLE imagenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contenido_editable ENABLE ROW LEVEL SECURITY;

-- Políticas para lectura pública (todos pueden leer)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'configuraciones' AND policyname = 'Lectura pública configuraciones') THEN
        CREATE POLICY "Lectura pública configuraciones" ON configuraciones FOR SELECT USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'precios' AND policyname = 'Lectura pública precios') THEN
        CREATE POLICY "Lectura pública precios" ON precios FOR SELECT USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'imagenes' AND policyname = 'Lectura pública imágenes') THEN
        CREATE POLICY "Lectura pública imágenes" ON imagenes FOR SELECT USING (true);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contenido_editable' AND policyname = 'Lectura pública contenido') THEN
        CREATE POLICY "Lectura pública contenido" ON contenido_editable FOR SELECT USING (true);
    END IF;
END $$;

-- Políticas para escritura de administradores
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'configuraciones' AND policyname = 'Escritura autenticada configuraciones') THEN
        CREATE POLICY "Escritura autenticada configuraciones" ON configuraciones FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'precios' AND policyname = 'Escritura autenticada precios') THEN
        CREATE POLICY "Escritura autenticada precios" ON precios FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'imagenes' AND policyname = 'Escritura autenticada imágenes') THEN
        CREATE POLICY "Escritura autenticada imágenes" ON imagenes FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'contenido_editable' AND policyname = 'Escritura autenticada contenido') THEN
        CREATE POLICY "Escritura autenticada contenido" ON contenido_editable FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- =====================================================
-- CREAR BUCKET PARA IMÁGENES EN STORAGE
-- =====================================================

-- Crear bucket si no existe
INSERT INTO storage.buckets (id, name, public) 
VALUES ('imagenes', 'imagenes', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas para el bucket de imágenes
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Lectura pública imágenes storage') THEN
        CREATE POLICY "Lectura pública imágenes storage" ON storage.objects FOR SELECT USING (bucket_id = 'imagenes');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Subida autenticada imágenes storage') THEN
        CREATE POLICY "Subida autenticada imágenes storage" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'imagenes' AND auth.role() = 'authenticated');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Actualización autenticada imágenes storage') THEN
        CREATE POLICY "Actualización autenticada imágenes storage" ON storage.objects FOR UPDATE USING (bucket_id = 'imagenes' AND auth.role() = 'authenticated');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Eliminación autenticada imágenes storage') THEN
        CREATE POLICY "Eliminación autenticada imágenes storage" ON storage.objects FOR DELETE USING (bucket_id = 'imagenes' AND auth.role() = 'authenticated');
    END IF;
END $$;