-- ============================================
-- DESACTIVAR PRECIOS EN $0
-- ============================================
-- Los precios en $0 no deberían estar activos ya que causan
-- confusión en el sistema de reservas

-- Mostrar precios que se van a desactivar
SELECT id, tipo_cancha, dia_semana, hora, precio
FROM precios
WHERE precio = 0 AND activo = true
ORDER BY tipo_cancha, dia_semana, hora;

-- Desactivar todos los precios en $0
UPDATE precios 
SET activo = false 
WHERE precio = 0 AND activo = true;

-- Verificar que se desactivaron correctamente
SELECT 
  tipo_cancha,
  COUNT(*) FILTER (WHERE activo = true) as activos,
  COUNT(*) FILTER (WHERE activo = true AND precio > 0) as activos_con_precio,
  COUNT(*) FILTER (WHERE activo = false AND precio = 0) as desactivados_cero
FROM precios
GROUP BY tipo_cancha
ORDER BY tipo_cancha;
