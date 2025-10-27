-- Script SQL para agregar precios de Pickleball Dobles
-- Copia y pega esto en el SQL Editor de Supabase

INSERT INTO precios (tipo_cancha, dia_semana, hora, precio, creado_en, actualizado_en) VALUES
-- Lunes a Viernes - Pickleball Dobles
('pickleball-dobles', 'weekdays', '09:00', 35000, NOW(), NOW()),
('pickleball-dobles', 'weekdays', '10:00', 35000, NOW(), NOW()),
('pickleball-dobles', 'weekdays', '11:00', 35000, NOW(), NOW()),
('pickleball-dobles', 'weekdays', '12:00', 35000, NOW(), NOW()),
('pickleball-dobles', 'weekdays', '13:00', 35000, NOW(), NOW()),
('pickleball-dobles', 'weekdays', '14:00', 35000, NOW(), NOW()),
('pickleball-dobles', 'weekdays', '15:00', 35000, NOW(), NOW()),
('pickleball-dobles', 'weekdays', '16:00', 35000, NOW(), NOW()),
('pickleball-dobles', 'weekdays', '17:00', 40000, NOW(), NOW()),
('pickleball-dobles', 'weekdays', '18:00', 40000, NOW(), NOW()),
('pickleball-dobles', 'weekdays', '19:00', 40000, NOW(), NOW()),
('pickleball-dobles', 'weekdays', '20:00', 40000, NOW(), NOW()),
('pickleball-dobles', 'weekdays', '21:00', 40000, NOW(), NOW()),
('pickleball-dobles', 'weekdays', '22:00', 40000, NOW(), NOW()),

-- Sábados - Pickleball Dobles
('pickleball-dobles', 'saturday', '09:00', 40000, NOW(), NOW()),
('pickleball-dobles', 'saturday', '10:00', 40000, NOW(), NOW()),
('pickleball-dobles', 'saturday', '11:00', 40000, NOW(), NOW()),
('pickleball-dobles', 'saturday', '12:00', 40000, NOW(), NOW()),
('pickleball-dobles', 'saturday', '13:00', 40000, NOW(), NOW()),
('pickleball-dobles', 'saturday', '14:00', 40000, NOW(), NOW()),
('pickleball-dobles', 'saturday', '15:00', 40000, NOW(), NOW()),
('pickleball-dobles', 'saturday', '16:00', 40000, NOW(), NOW()),
('pickleball-dobles', 'saturday', '17:00', 45000, NOW(), NOW()),
('pickleball-dobles', 'saturday', '18:00', 45000, NOW(), NOW()),
('pickleball-dobles', 'saturday', '19:00', 45000, NOW(), NOW()),
('pickleball-dobles', 'saturday', '20:00', 45000, NOW(), NOW()),
('pickleball-dobles', 'saturday', '21:00', 45000, NOW(), NOW()),
('pickleball-dobles', 'saturday', '22:00', 45000, NOW(), NOW()),

-- Domingos - Pickleball Dobles
('pickleball-dobles', 'sunday', '09:00', 40000, NOW(), NOW()),
('pickleball-dobles', 'sunday', '10:00', 40000, NOW(), NOW()),
('pickleball-dobles', 'sunday', '11:00', 40000, NOW(), NOW()),
('pickleball-dobles', 'sunday', '12:00', 40000, NOW(), NOW()),
('pickleball-dobles', 'sunday', '13:00', 40000, NOW(), NOW()),
('pickleball-dobles', 'sunday', '14:00', 40000, NOW(), NOW()),
('pickleball-dobles', 'sunday', '15:00', 40000, NOW(), NOW()),
('pickleball-dobles', 'sunday', '16:00', 40000, NOW(), NOW()),
('pickleball-dobles', 'sunday', '17:00', 45000, NOW(), NOW()),
('pickleball-dobles', 'sunday', '18:00', 45000, NOW(), NOW()),
('pickleball-dobles', 'sunday', '19:00', 45000, NOW(), NOW()),
('pickleball-dobles', 'sunday', '20:00', 45000, NOW(), NOW()),
('pickleball-dobles', 'sunday', '21:00', 45000, NOW(), NOW()),
('pickleball-dobles', 'sunday', '22:00', 45000, NOW(), NOW());

-- Verificar los datos insertados
SELECT tipo_cancha, dia_semana, COUNT(*) as total_horarios, MIN(precio) as precio_min, MAX(precio) as precio_max
FROM precios 
WHERE tipo_cancha IN ('pickleball', 'pickleball-dobles')
GROUP BY tipo_cancha, dia_semana
ORDER BY tipo_cancha, dia_semana;