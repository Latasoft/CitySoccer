-- ========================================
-- SCRIPT MAESTRO: MIGRAR TODAS LAS PÁGINAS AL CMS
-- ========================================
-- Este script ejecuta todas las migraciones de contenido
-- ADVERTENCIA: Solo ejecutar UNA VEZ

-- Nota: En Supabase no puedes ejecutar múltiples archivos a la vez
-- Ejecuta cada script individualmente EN ORDEN:

/*
ORDEN DE EJECUCIÓN:

1. database/08_cms_pages.sql (si no lo ejecutaste antes)
   - Crea las tablas del CMS

2. database/09_migrar_paginas_existentes.sql
   - Registra las 9 páginas en la base de datos

3. database/10_despublicar_paginas_temp.sql (OPCIONAL)
   - Despublica las páginas mientras creas el contenido
   - Esto permite que las páginas estáticas actuales sigan funcionando

4. MIGRACIONES DE CONTENIDO (ejecuta los que quieras):
   - database/11_migrar_contenido_quienessomos.sql
   - database/12_migrar_contenido_servicios.sql
   - database/13_migrar_contenido_eventos.sql
   - database/14_migrar_contenido_contacto.sql
   - database/15_migrar_contenido_summer_camp.sql
   - database/16_migrar_contenido_academia_futbol.sql
   - database/17_migrar_contenido_academia_pickleball.sql
   - database/18_migrar_contenido_clases_particulares_futbol.sql
   - database/19_migrar_contenido_clases_particulares_pickleball.sql

5. PUBLICAR PÁGINAS (cuando estés listo):
   - database/20_publicar_todas_las_paginas.sql
*/

-- ========================================
-- VERIFICACIÓN FINAL
-- ========================================
-- Ejecuta esto DESPUÉS de migrar todo para verificar:

SELECT 
  p.slug,
  p.titulo,
  p.publicada,
  p.activa,
  COUNT(ps.id) as num_secciones
FROM pages p
LEFT JOIN page_sections ps ON ps.page_id = p.id AND ps.activa = true
GROUP BY p.id, p.slug, p.titulo, p.publicada, p.activa
ORDER BY p.slug;

-- Deberías ver:
-- quienessomos: 5 secciones
-- servicios: 4 secciones
-- eventos: 4 secciones
-- contacto: 4 secciones
-- summer-camp: 5 secciones
-- academiadefutbol: 5 secciones
-- academiadepickleball: 5 secciones
-- clasesparticularesfutbol: 6 secciones
-- clasesparticularespickleball: 6 secciones
