-- ========================================
-- MIGRAR CONTENIDO DE SUMMER CAMP AL CMS
-- ========================================

DO $$
DECLARE
  v_page_id UUID;
BEGIN
  SELECT id INTO v_page_id FROM pages WHERE slug = 'summer-camp';
  
  IF v_page_id IS NULL THEN
    RAISE EXCEPTION 'Página summer-camp no encontrada';
  END IF;

  -- SECCIÓN 1: Hero
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'hero',
    1,
    jsonb_build_object(
      'titulo', 'Summer Camp 2025',
      'subtitulo', '¡Un verano lleno de deportes, diversión y aprendizaje para niños y jóvenes!',
      'imagen_fondo', '/images/summer-camp-hero.jpg',
      'cta_texto', 'Inscribir Ahora',
      'cta_url', '/contacto',
      'altura', 'large',
      'alineacion', 'center',
      'overlay_opacity', 0.4
    ),
    true
  );

  -- SECCIÓN 2: Text + Image - ¿Qué es Summer Camp?
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'text-image',
    2,
    jsonb_build_object(
      'titulo', '¿Qué es el Summer Camp?',
      'contenido', '<p class="text-lg mb-4">Nuestro campamento de verano es un programa diseñado para que niños y jóvenes entre 6 y 16 años disfruten de sus vacaciones de forma activa, saludable y divertida.</p><p class="text-lg mb-4">Durante el campamento, los participantes:</p><ul class="space-y-2 text-lg"><li>✓ Desarrollan habilidades deportivas en fútbol y pickleball</li><li>✓ Hacen nuevos amigos en un ambiente seguro</li><li>✓ Aprenden valores de trabajo en equipo y fair play</li><li>✓ Se mantienen activos durante las vacaciones</li><li>✓ Participan en juegos y actividades recreativas</li></ul>',
      'imagen', '/images/summer-camp-actividades.jpg',
      'posicion_imagen', 'right',
      'fondo_oscuro', false
    ),
    true
  );

  -- SECCIÓN 3: Card Grid - Actividades
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'card-grid',
    3,
    jsonb_build_object(
      'titulo', 'Actividades del Campamento',
      'descripcion', 'Un día típico lleno de diversión y aprendizaje',
      'columnas', 4,
      'fondo_oscuro', true,
      'cards', jsonb_build_array(
        jsonb_build_object(
          'icono', '⚽',
          'titulo', 'Fútbol',
          'descripcion', 'Entrenamientos técnicos, tácticos y partidos'
        ),
        jsonb_build_object(
          'icono', '🏓',
          'titulo', 'Pickleball',
          'descripcion', 'Aprende este divertido deporte de raqueta'
        ),
        jsonb_build_object(
          'icono', '🎮',
          'titulo', 'Juegos Recreativos',
          'descripcion', 'Dinámicas grupales y actividades lúdicas'
        ),
        jsonb_build_object(
          'icono', '🏆',
          'titulo', 'Torneos',
          'descripcion', 'Competencias amistosas y premios'
        ),
        jsonb_build_object(
          'icono', '🍎',
          'titulo', 'Alimentación',
          'descripcion', 'Colaciones saludables incluidas'
        ),
        jsonb_build_object(
          'icono', '👨‍🏫',
          'titulo', 'Profesores Certificados',
          'descripcion', 'Personal capacitado y con experiencia'
        ),
        jsonb_build_object(
          'icono', '🎉',
          'titulo', 'Eventos Especiales',
          'descripcion', 'Jornadas temáticas y sorpresas'
        ),
        jsonb_build_object(
          'icono', '📸',
          'titulo', 'Fotos y Videos',
          'descripcion', 'Registro de los mejores momentos'
        )
      )
    ),
    true
  );

  -- SECCIÓN 4: Card Grid - Información Práctica
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'card-grid',
    4,
    jsonb_build_object(
      'titulo', 'Información Práctica',
      'columnas', 3,
      'fondo_oscuro', false,
      'cards', jsonb_build_array(
        jsonb_build_object(
          'icono', '📅',
          'titulo', 'Fechas',
          'descripcion', 'Enero - Febrero 2025. Inscripciones por semana completa o quincena.'
        ),
        jsonb_build_object(
          'icono', '⏰',
          'titulo', 'Horarios',
          'descripcion', 'Lunes a Viernes, 9:00 AM - 1:00 PM. Opción de jornada completa hasta las 5:00 PM.'
        ),
        jsonb_build_object(
          'icono', '👶',
          'titulo', 'Edades',
          'descripcion', 'Niños y jóvenes de 6 a 16 años, separados por grupos etarios.'
        ),
        jsonb_build_object(
          'icono', '💰',
          'titulo', 'Inversión',
          'descripcion', 'Consulta nuestros planes semanales y mensuales. Descuentos por hermanos.'
        ),
        jsonb_build_object(
          'icono', '🎒',
          'titulo', 'Qué Traer',
          'descripcion', 'Ropa deportiva, zapatillas, botella de agua, protector solar y snack.'
        ),
        jsonb_build_object(
          'icono', '📝',
          'titulo', 'Inscripción',
          'descripcion', 'Cupos limitados. Inscríbete con anticipación para asegurar tu lugar.'
        )
      )
    ),
    true
  );

  -- SECCIÓN 5: CTA
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'cta',
    5,
    jsonb_build_object(
      'titulo', '¡Inscribe a tus hijos hoy!',
      'descripcion', 'Cupos limitados - No te quedes fuera del mejor verano deportivo',
      'cta_primario_texto', 'Inscribir Ahora',
      'cta_primario_url', '/contacto',
      'cta_secundario_texto', 'Más Información',
      'cta_secundario_url', 'https://wa.me/56974265020',
      'fondo_color', 'gradiente'
    ),
    true
  );

  RAISE NOTICE 'Contenido de Summer Camp migrado: 5 secciones creadas';
END $$;

SELECT ps.orden, ps.tipo_seccion FROM page_sections ps
JOIN pages p ON ps.page_id = p.id WHERE p.slug = 'summer-camp' ORDER BY ps.orden;
