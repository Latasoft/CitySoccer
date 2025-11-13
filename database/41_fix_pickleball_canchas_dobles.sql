-- ============================================
-- AGREGAR CANCHAS DE PICKLEBALL DOBLES
-- ============================================
-- Las canchas de pickleball físicas son compartidas entre individual y dobles
-- Pero en la BD necesitamos registros separados con el mismo nombre físico

-- Insertar canchas para pickleball dobles (mismos nombres físicos que individual)
INSERT INTO canchas (nombre, tipo, activo) VALUES
  ('pickleball_1', 'pickleball-dobles', true),
  ('pickeball_2', 'pickleball-dobles', true),
  ('pickeball_3', 'pickleball-dobles', true);

-- Verificar que ahora tenemos canchas para ambas modalidades
SELECT nombre, tipo, activo 
FROM canchas 
WHERE tipo IN ('pickleball', 'pickleball-dobles')
ORDER BY nombre, tipo;
