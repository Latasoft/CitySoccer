-- =====================================================
-- SISTEMA DE CANCHAS COMPARTIDAS
-- =====================================================
-- Este script crea el sistema para gestionar canchas que
-- comparten el mismo espacio físico (ej: F7 y F9 usan
-- la misma cancha física)
-- =====================================================

-- 1. Crear tabla de grupos de canchas compartidas
CREATE TABLE IF NOT EXISTS cancha_grupos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON TABLE cancha_grupos IS 'Grupos de canchas que comparten el mismo espacio físico';

-- 2. Crear tabla de relación entre canchas y grupos
CREATE TABLE IF NOT EXISTS cancha_grupo_miembros (
  id SERIAL PRIMARY KEY,
  grupo_id INTEGER NOT NULL REFERENCES cancha_grupos(id) ON DELETE CASCADE,
  cancha_id INTEGER NOT NULL REFERENCES canchas(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(cancha_id) -- Una cancha solo puede estar en un grupo
);

COMMENT ON TABLE cancha_grupo_miembros IS 'Relación entre canchas y grupos compartidos';

-- 3. Crear índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_cancha_grupo_miembros_grupo ON cancha_grupo_miembros(grupo_id);
CREATE INDEX IF NOT EXISTS idx_cancha_grupo_miembros_cancha ON cancha_grupo_miembros(cancha_id);

-- 4. Insertar grupos de canchas compartidas

-- Grupo para Fútbol (F7 y F9 comparten las mismas canchas físicas)
INSERT INTO cancha_grupos (nombre, descripcion) VALUES
  ('futbol_cancha_1', 'Cancha física 1 - Usada para F7_1 y F9'),
  ('futbol_cancha_2', 'Cancha física 2 - Usada para F7_2 (solo F7)'),
  ('futbol_cancha_3', 'Cancha física 3 - Usada para F7_3 (solo F7)')
ON CONFLICT (nombre) DO NOTHING;

-- 5. Asignar canchas a sus grupos

-- Grupo 1: f7_1 y f9 comparten el mismo espacio físico
INSERT INTO cancha_grupo_miembros (grupo_id, cancha_id)
SELECT 
  (SELECT id FROM cancha_grupos WHERE nombre = 'futbol_cancha_1'),
  id
FROM canchas 
WHERE nombre IN ('f7_1', 'f9')
ON CONFLICT (cancha_id) DO NOTHING;

-- Grupo 2: f7_2 (solo esta cancha en este grupo)
INSERT INTO cancha_grupo_miembros (grupo_id, cancha_id)
SELECT 
  (SELECT id FROM cancha_grupos WHERE nombre = 'futbol_cancha_2'),
  id
FROM canchas 
WHERE nombre = 'f7_2'
ON CONFLICT (cancha_id) DO NOTHING;

-- Grupo 3: f7_3 (solo esta cancha en este grupo)
INSERT INTO cancha_grupo_miembros (grupo_id, cancha_id)
SELECT 
  (SELECT id FROM cancha_grupos WHERE nombre = 'futbol_cancha_3'),
  id
FROM canchas 
WHERE nombre = 'f7_3'
ON CONFLICT (cancha_id) DO NOTHING;

-- NOTA: Pickleball NO necesita estar en esta tabla porque ya usa
-- el sistema de "mismo nombre físico" implementado anteriormente

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Ver todos los grupos y sus canchas
SELECT 
  cg.nombre as grupo,
  cg.descripcion,
  c.id as cancha_id,
  c.nombre as cancha_nombre,
  c.tipo as cancha_tipo
FROM cancha_grupos cg
LEFT JOIN cancha_grupo_miembros cgm ON cg.id = cgm.grupo_id
LEFT JOIN canchas c ON cgm.cancha_id = c.id
ORDER BY cg.nombre, c.nombre;

-- Ver canchas que comparten espacio físico
SELECT 
  c1.nombre as cancha_1,
  c1.tipo as tipo_1,
  c2.nombre as cancha_2,
  c2.tipo as tipo_2,
  cg.nombre as espacio_fisico_compartido
FROM cancha_grupo_miembros cgm1
JOIN cancha_grupo_miembros cgm2 ON cgm1.grupo_id = cgm2.grupo_id AND cgm1.cancha_id < cgm2.cancha_id
JOIN canchas c1 ON cgm1.cancha_id = c1.id
JOIN canchas c2 ON cgm2.cancha_id = c2.id
JOIN cancha_grupos cg ON cgm1.grupo_id = cg.id;
