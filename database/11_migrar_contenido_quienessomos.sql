-- ========================================
-- MIGRAR CONTENIDO DE QUIÉNES SOMOS AL CMS
-- ========================================
-- Este script convierte el componente QuienessomosComponent
-- en secciones editables del CMS

-- Primero, obtener el ID de la página
DO $$
DECLARE
  v_page_id UUID;
BEGIN
  -- Obtener ID de la página
  SELECT id INTO v_page_id FROM pages WHERE slug = 'quienessomos';
  
  IF v_page_id IS NULL THEN
    RAISE EXCEPTION 'Página quienessomos no encontrada. Ejecuta primero 09_migrar_paginas_existentes.sql';
  END IF;

  -- SECCIÓN 1: Hero - "Sobre City Soccer"
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'hero',
    1,
    jsonb_build_object(
      'titulo', 'Sobre City Soccer',
      'subtitulo', 'Más que un centro deportivo, somos una familia unida por la pasión del fútbol. En City Soccer creamos espacios donde el deporte se vive con profesionalismo, diversión y valores que trascienden las canchas.',
      'imagen_fondo', '/Cancha1.jpeg',
      'cta_texto', 'Contáctanos',
      'cta_url', '/contacto',
      'altura', 'large',
      'alineacion', 'left',
      'overlay_opacity', 0.6
    ),
    true
  );

  -- SECCIÓN 2: Text + Image - "Nuestra Historia"
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'text-image',
    2,
    jsonb_build_object(
      'titulo', 'Nuestra Historia',
      'contenido', '<p class="text-lg">City Soccer nace de la pasión por el deporte y la comunidad. Desde nuestros inicios, hemos trabajado para crear un espacio donde deportistas de todas las edades puedan desarrollar sus habilidades, competir y, sobre todo, disfrutar.</p><p class="mt-4">Contamos con instalaciones de primera clase y un equipo comprometido con la excelencia deportiva.</p>',
      'imagen', '/Cancha2.jpeg',
      'posicion_imagen', 'right',
      'fondo_oscuro', true
    ),
    true
  );

  -- SECCIÓN 3: Card Grid - "Nuestros Valores"
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'card-grid',
    3,
    jsonb_build_object(
      'titulo', 'Nuestros Valores',
      'descripcion', 'Los pilares que guían nuestro trabajo diario',
      'columnas', 3,
      'fondo_oscuro', false,
      'cards', jsonb_build_array(
        jsonb_build_object(
          'icono', '⚽',
          'titulo', 'Pasión Deportiva',
          'descripcion', 'Vivimos cada partido, cada entrenamiento y cada momento con verdadera pasión por el deporte.'
        ),
        jsonb_build_object(
          'icono', '🤝',
          'titulo', 'Comunidad',
          'descripcion', 'Creemos en el poder del deporte para unir personas y crear lazos duraderos.'
        ),
        jsonb_build_object(
          'icono', '🏆',
          'titulo', 'Excelencia',
          'descripcion', 'Nos esforzamos por ofrecer las mejores instalaciones y servicios para nuestros clientes.'
        )
      )
    ),
    true
  );

  -- SECCIÓN 4: Card Grid - "City Soccer Internacional"
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'card-grid',
    4,
    jsonb_build_object(
      'titulo', 'City Soccer Internacional',
      'descripcion', 'Formamos parte de una red internacional de complejos deportivos',
      'columnas', 3,
      'fondo_oscuro', true,
      'cards', jsonb_build_array(
        jsonb_build_object(
          'imagen', '/iconUSA.png',
          'titulo', 'City Soccer, West Palm',
          'descripcion', 'Florida, Estados Unidos',
          'url', 'https://www.instagram.com/citysoccerfl/',
          'url_texto', 'Ver Instagram →'
        ),
        jsonb_build_object(
          'imagen', '/iconUSA.png',
          'titulo', 'City Soccer, Saint Lucie',
          'descripcion', 'Florida, Estados Unidos',
          'url', 'https://www.instagram.com/citysoccerpsl/',
          'url_texto', 'Ver Instagram →'
        ),
        jsonb_build_object(
          'imagen', '/iconURU.png',
          'titulo', 'City Soccer, San Carlos',
          'descripcion', 'Uruguay',
          'url', 'https://www.instagram.com/citysoccer.uy/',
          'url_texto', 'Ver Instagram →'
        )
      )
    ),
    true
  );

  -- SECCIÓN 5: CTA Final - "Únete a City Soccer"
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'cta',
    5,
    jsonb_build_object(
      'titulo', '¿Listo para unirte a la familia City Soccer?',
      'descripcion', 'Reserva tu cancha, inscríbete en nuestras academias o contáctanos para más información',
      'cta_primario_texto', 'Reservar Cancha',
      'cta_primario_url', '/arrendarcancha',
      'cta_secundario_texto', 'Contacto',
      'cta_secundario_url', '/contacto',
      'fondo_color', 'amarillo'
    ),
    true
  );

  RAISE NOTICE 'Contenido de Quiénes Somos migrado exitosamente: 5 secciones creadas';
END $$;

-- Verificar secciones creadas
SELECT 
  ps.orden,
  ps.tipo_seccion,
  ps.activa,
  p.titulo as pagina
FROM page_sections ps
JOIN pages p ON ps.page_id = p.id
WHERE p.slug = 'quienessomos'
ORDER BY ps.orden;
