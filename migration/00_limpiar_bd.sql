-- =====================================================
-- SCRIPT PARA LIMPIAR BASE DE DATOS ANTES DE RE-MIGRAR
-- =====================================================
-- 
-- Este script elimina todos los datos y recrea las tablas
-- para evitar duplicados y errores de constraint
--

-- Desactivar temporalmente las foreign keys para poder hacer DROP
SET session_replication_role = 'replica';

-- Eliminar tablas en orden inverso (respetando FKs)
DROP TABLE IF EXISTS reservas CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS contenido_editable CASCADE;
DROP TABLE IF EXISTS imagenes CASCADE;
DROP TABLE IF EXISTS configuraciones CASCADE;
DROP TABLE IF EXISTS precios CASCADE;
DROP TABLE IF EXISTS canchas CASCADE;

-- Reactivar foreign keys
SET session_replication_role = 'origin';

-- Nota: Después de ejecutar este script, debes ejecutar 01_crear_tablas.sql
