-- ============================================
-- AGREGAR PRECIOS PARA PICKLEBALL DOBLES
-- ============================================
-- Copiar la estructura de precios de pickleball individual a dobles
-- Los precios iniciales son los mismos, el admin los ajustará desde el dashboard

-- Primero eliminar precios existentes de pickleball-dobles si existen
DELETE FROM precios WHERE tipo_cancha = 'pickleball-dobles';

-- WEEKDAYS (Lunes a Viernes)
INSERT INTO precios (tipo_cancha, dia_semana, hora, precio, activo) 
SELECT 
  'pickleball-dobles' as tipo_cancha,
  dia_semana,
  hora,
  precio,
  activo
FROM precios
WHERE tipo_cancha = 'pickleball'
  AND dia_semana = 'weekdays';

-- SATURDAY (Sábados)
INSERT INTO precios (tipo_cancha, dia_semana, hora, precio, activo) 
SELECT 
  'pickleball-dobles' as tipo_cancha,
  dia_semana,
  hora,
  precio,
  activo
FROM precios
WHERE tipo_cancha = 'pickleball'
  AND dia_semana = 'saturday';

-- SUNDAY (Domingos)
INSERT INTO precios (tipo_cancha, dia_semana, hora, precio, activo) 
SELECT 
  'pickleball-dobles' as tipo_cancha,
  dia_semana,
  hora,
  precio,
  activo
FROM precios
WHERE tipo_cancha = 'pickleball'
  AND dia_semana = 'sunday';

-- Verificar precios creados
SELECT tipo_cancha, dia_semana, COUNT(*) as cantidad_horarios, 
       MIN(precio) as precio_min, MAX(precio) as precio_max
FROM precios
WHERE tipo_cancha IN ('pickleball', 'pickleball-dobles')
GROUP BY tipo_cancha, dia_semana
ORDER BY tipo_cancha, 
  CASE dia_semana 
    WHEN 'weekdays' THEN 1
    WHEN 'saturday' THEN 2
    WHEN 'sunday' THEN 3
  END;
