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

-- IMPORTANTE: Solo agrupamos canchas que REALMENTE comparten el mismo espacio físico
-- Si f7_1 y f9 usan la misma cancha física, van juntas
-- Si f7_2 y f7_3 NO comparten espacio con f9, NO las agrupamos con nada

INSERT INTO cancha_grupos (nombre, descripcion) VALUES
  ('cancha_fisica_principal', 'Cancha física compartida entre F7_1 y F9')
ON CONFLICT (nombre) DO NOTHING;

-- 5. Asignar canchas a sus grupos

-- GRUPO 1: Solo f7_1 y f9 que COMPARTEN el mismo espacio físico
-- Si reservas f7_1, bloquea f9 (y viceversa) porque usan la misma cancha
INSERT INTO cancha_grupo_miembros (grupo_id, cancha_id)
SELECT 
  (SELECT id FROM cancha_grupos WHERE nombre = 'cancha_fisica_principal'),
  id
FROM canchas 
WHERE nombre IN ('f7_1', 'f9')
ON CONFLICT (cancha_id) DO NOTHING;

-- f7_2 NO se agrega a ningún grupo (es independiente)
-- f7_3 NO se agrega a ningún grupo (es independiente)

-- Si tienes MÁS canchas compartidas, agrégalas aquí:
-- Ejemplo si f7_2 comparte con otra cancha de f9:
-- INSERT INTO cancha_grupos (nombre, descripcion) VALUES
--   ('cancha_fisica_2', 'Cancha física compartida entre F7_2 y F9_2')
-- ON CONFLICT (nombre) DO NOTHING;
--
-- INSERT INTO cancha_grupo_miembros (grupo_id, cancha_id)
-- SELECT (SELECT id FROM cancha_grupos WHERE nombre = 'cancha_fisica_2'), id
-- FROM canchas WHERE nombre IN ('f7_2', 'f9_2')
-- ON CONFLICT (cancha_id) DO NOTHING;

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
