-- =====================================================
-- VERIFICAR Y APLICAR CONSTRAINT DE UNICIDAD
-- =====================================================
-- Ejecutar en: Supabase Dashboard > SQL Editor

-- 1. VERIFICAR SI EL ÍNDICE YA EXISTE
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_indexes 
        WHERE tablename = 'reservas' 
        AND indexname = 'idx_reservas_unique_slot'
    ) THEN
        -- 2. VERIFICAR DUPLICADOS EXISTENTES
        RAISE NOTICE 'Verificando duplicados existentes...';
        
        -- 3. CREAR ÍNDICE ÚNICO PARCIAL
        RAISE NOTICE 'Creando índice único...';
        CREATE UNIQUE INDEX idx_reservas_unique_slot
        ON reservas (cancha_id, fecha, hora_inicio)
        WHERE estado != 'cancelada';
        
        RAISE NOTICE '✅ Índice único creado exitosamente';
    ELSE
        RAISE NOTICE '✅ El índice único ya existe';
    END IF;
END $$;

-- 4. VERIFICAR RESULTADO
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'reservas'
AND indexname = 'idx_reservas_unique_slot';

-- 5. PROBAR EL CONSTRAINT (Opcional - descomentar para probar)
/*
-- Esto debería FALLAR si el constraint funciona:
INSERT INTO reservas (cliente_id, cancha_id, fecha, hora_inicio, hora_fin, estado)
VALUES (1, 1, '2025-11-15', '10:00:00', '11:00:00', 'confirmada');

-- Intentar duplicar (debería fallar):
INSERT INTO reservas (cliente_id, cancha_id, fecha, hora_inicio, hora_fin, estado)
VALUES (2, 1, '2025-11-15', '10:00:00', '11:00:00', 'confirmada');
*/
