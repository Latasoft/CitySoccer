-- =====================================================
-- SCRIPT 3: INSERTAR DATOS BASE
-- Ejecutar TERCERO después de configurar RLS
-- Inserta configuraciones, precios, contenido y canchas iniciales
-- =====================================================

-- =====================================================
-- 1. INSERTAR CANCHAS (Catálogo base)
-- IMPORTANTE: IDs y tipos deben coincidir con backup_datos.json
-- =====================================================

INSERT INTO canchas (id, nombre, tipo, activo) VALUES
(1, 'f7_1', 'f7', true),
(2, 'f7_2', 'f7', true),
(3, 'f7_3', 'f7', true),
(4, 'f9', 'f9', true),
(5, 'pickleball_1', 'pickleball', true),
(6, 'pickeball_2', 'pickleball', true),
(7, 'pickeball_3', 'pickleball', true)
ON CONFLICT (id) DO NOTHING;

-- Resetear secuencia de IDs
SELECT setval('canchas_id_seq', (SELECT MAX(id) FROM canchas));

-- =====================================================
-- 2. INSERTAR CONFIGURACIONES
-- =====================================================

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

-- =====================================================
-- 3. INSERTAR PRECIOS - FÚTBOL 7
-- =====================================================

INSERT INTO precios (tipo_cancha, dia_semana, hora, precio) VALUES
-- Fútbol 7 - Entre semana (Lunes a Viernes)
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
('futbol7', 'sunday', '23:00', 45000)
ON CONFLICT (tipo_cancha, dia_semana, hora) DO NOTHING;

-- =====================================================
-- 4. INSERTAR PRECIOS - FÚTBOL 9
-- =====================================================

INSERT INTO precios (tipo_cancha, dia_semana, hora, precio) VALUES
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
('futbol9', 'sunday', '23:00', 75000)
ON CONFLICT (tipo_cancha, dia_semana, hora) DO NOTHING;

-- =====================================================
-- 5. INSERTAR PRECIOS - PICKLEBALL INDIVIDUAL
-- =====================================================

INSERT INTO precios (tipo_cancha, dia_semana, hora, precio) VALUES
-- Pickleball - Entre semana
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

-- Pickleball - Sábados
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

-- Pickleball - Domingos
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

-- =====================================================
-- 6. INSERTAR PRECIOS - PICKLEBALL DOBLES
-- =====================================================

INSERT INTO precios (tipo_cancha, dia_semana, hora, precio) VALUES
-- Pickleball Dobles - Entre semana
('pickleball-dobles', 'weekdays', '09:00', 35000),
('pickleball-dobles', 'weekdays', '10:00', 35000),
('pickleball-dobles', 'weekdays', '11:00', 35000),
('pickleball-dobles', 'weekdays', '12:00', 35000),
('pickleball-dobles', 'weekdays', '13:00', 35000),
('pickleball-dobles', 'weekdays', '14:00', 35000),
('pickleball-dobles', 'weekdays', '15:00', 35000),
('pickleball-dobles', 'weekdays', '16:00', 35000),
('pickleball-dobles', 'weekdays', '17:00', 40000),
('pickleball-dobles', 'weekdays', '18:00', 40000),
('pickleball-dobles', 'weekdays', '19:00', 40000),
('pickleball-dobles', 'weekdays', '20:00', 40000),
('pickleball-dobles', 'weekdays', '21:00', 40000),
('pickleball-dobles', 'weekdays', '22:00', 40000),

-- Pickleball Dobles - Sábados
('pickleball-dobles', 'saturday', '09:00', 40000),
('pickleball-dobles', 'saturday', '10:00', 40000),
('pickleball-dobles', 'saturday', '11:00', 40000),
('pickleball-dobles', 'saturday', '12:00', 40000),
('pickleball-dobles', 'saturday', '13:00', 40000),
('pickleball-dobles', 'saturday', '14:00', 40000),
('pickleball-dobles', 'saturday', '15:00', 40000),
('pickleball-dobles', 'saturday', '16:00', 40000),
('pickleball-dobles', 'saturday', '17:00', 45000),
('pickleball-dobles', 'saturday', '18:00', 45000),
('pickleball-dobles', 'saturday', '19:00', 45000),
('pickleball-dobles', 'saturday', '20:00', 45000),
('pickleball-dobles', 'saturday', '21:00', 45000),
('pickleball-dobles', 'saturday', '22:00', 45000),

-- Pickleball Dobles - Domingos
('pickleball-dobles', 'sunday', '09:00', 40000),
('pickleball-dobles', 'sunday', '10:00', 40000),
('pickleball-dobles', 'sunday', '11:00', 40000),
('pickleball-dobles', 'sunday', '12:00', 40000),
('pickleball-dobles', 'sunday', '13:00', 40000),
('pickleball-dobles', 'sunday', '14:00', 40000),
('pickleball-dobles', 'sunday', '15:00', 40000),
('pickleball-dobles', 'sunday', '16:00', 40000),
('pickleball-dobles', 'sunday', '17:00', 45000),
('pickleball-dobles', 'sunday', '18:00', 45000),
('pickleball-dobles', 'sunday', '19:00', 45000),
('pickleball-dobles', 'sunday', '20:00', 45000),
('pickleball-dobles', 'sunday', '21:00', 45000),
('pickleball-dobles', 'sunday', '22:00', 45000)
ON CONFLICT (tipo_cancha, dia_semana, hora) DO NOTHING;

-- =====================================================
-- 7. INSERTAR CONTENIDO EDITABLE
-- =====================================================

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
-- 8. VERIFICAR DATOS INSERTADOS
-- =====================================================

SELECT 'canchas' as tabla, COUNT(*) as registros FROM canchas
UNION ALL
SELECT 'configuraciones' as tabla, COUNT(*) as registros FROM configuraciones
UNION ALL
SELECT 'precios' as tabla, COUNT(*) as registros FROM precios
UNION ALL
SELECT 'contenido_editable' as tabla, COUNT(*) as registros FROM contenido_editable
ORDER BY tabla;

-- Deberías ver:
-- canchas: 7 registros
-- configuraciones: 9 registros
-- contenido_editable: 9 registros
-- precios: 187 registros (45 futbol7 + 54 futbol9 + 50 pickleball + 38 pickleball-dobles)

SELECT '✅ Datos base insertados exitosamente' as resultado;
-- Continúa con 04_migrar_datos.sql para migrar tus datos existentes
