-- ========================================
-- MIGRAR CONTENIDO DE CLASES PARTICULARES FÚTBOL AL CMS
-- ========================================

DO $$
DECLARE
  v_page_id UUID;
BEGIN
  SELECT id INTO v_page_id FROM pages WHERE slug = 'clasesparticularesfutbol';
  
  IF v_page_id IS NULL THEN
    RAISE EXCEPTION 'Página clasesparticularesfutbol no encontrada';
  END IF;

  -- SECCIÓN 1: Hero
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'hero',
    1,
    jsonb_build_object(
      'titulo', 'Clases Particulares de Fútbol',
      'subtitulo', 'Entrenamiento personalizado uno-a-uno con profesionales certificados',
      'imagen_fondo', '/images/entrenamiento-particular.jpg',
      'cta_texto', 'Agendar Sesión',
      'cta_url', '/contacto',
      'altura', 'medium',
      'alineacion', 'left',
      'overlay_opacity', 0.6
    ),
    true
  );

  -- SECCIÓN 2: Text + Image
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'text-image',
    2,
    jsonb_build_object(
      'titulo', 'Entrenamiento 100% Personalizado',
      'contenido', '<p class="text-lg mb-4">Nuestras clases particulares están diseñadas para maximizar tu desarrollo como futbolista.</p><p class="text-lg mb-4"><strong>Beneficios:</strong></p><ul class="space-y-2 text-lg"><li>✓ Atención exclusiva del entrenador</li><li>✓ Plan de entrenamiento adaptado a tus objetivos</li><li>✓ Progreso acelerado</li><li>✓ Horarios flexibles según tu disponibilidad</li><li>✓ Corrección inmediata de técnica</li><li>✓ Enfoque en tus áreas de mejora específicas</li></ul>',
      'imagen', '/images/entrenador-personal.jpg',
      'posicion_imagen', 'right',
      'fondo_oscuro', false
    ),
    true
  );

  -- SECCIÓN 3: Card Grid - Qué Trabajamos
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'card-grid',
    3,
    jsonb_build_object(
      'titulo', '¿Qué Trabajamos en las Clases?',
      'columnas', 3,
      'fondo_oscuro', true,
      'cards', jsonb_build_array(
        jsonb_build_object(
          'icono', '⚽',
          'titulo', 'Técnica Individual',
          'descripcion', 'Control, conducción, pases, tiros y regate'
        ),
        jsonb_build_object(
          'icono', '🎯',
          'titulo', 'Definición',
          'descripcion', 'Precisión en el remate y diferentes tipos de tiro'
        ),
        jsonb_build_object(
          'icono', '🧠',
          'titulo', 'Táctica Personal',
          'descripcion', 'Lectura de juego, posicionamiento y toma de decisiones'
        ),
        jsonb_build_object(
          'icono', '💪',
          'titulo', 'Preparación Física',
          'descripcion', 'Velocidad, agilidad, fuerza y resistencia'
        ),
        jsonb_build_object(
          'icono', '🥅',
          'titulo', 'Entrenamiento de Porteros',
          'descripcion', 'Técnica específica para arqueros'
        ),
        jsonb_build_object(
          'icono', '📊',
          'titulo', 'Análisis y Feedback',
          'descripcion', 'Evaluación continua de tu progreso'
        )
      )
    ),
    true
  );

  -- SECCIÓN 4: Card Grid - Para Quién
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'card-grid',
    4,
    jsonb_build_object(
      'titulo', '¿Para Quién Son Estas Clases?',
      'columnas', 2,
      'fondo_oscuro', false,
      'cards', jsonb_build_array(
        jsonb_build_object(
          'icono', '🌟',
          'titulo', 'Jugadores en Desarrollo',
          'descripcion', 'Niños y jóvenes que quieren mejorar rápidamente para destacar en su equipo'
        ),
        jsonb_build_object(
          'icono', '🎓',
          'titulo', 'Preparación para Pruebas',
          'descripcion', 'Entrenamientos específicos para pruebas en clubes o academias'
        ),
        jsonb_build_object(
          'icono', '🔧',
          'titulo', 'Corrección de Falencias',
          'descripcion', 'Trabajo específico en aspectos técnicos o tácticos a mejorar'
        ),
        jsonb_build_object(
          'icono', '👨',
          'titulo', 'Adultos que Regresan',
          'descripcion', 'Personas que quieren retomar el fútbol con técnica adecuada'
        )
      )
    ),
    true
  );

  -- SECCIÓN 5: Card Grid - Info Práctica
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'card-grid',
    5,
    jsonb_build_object(
      'titulo', 'Información Práctica',
      'columnas', 3,
      'fondo_oscuro', true,
      'cards', jsonb_build_array(
        jsonb_build_object(
          'icono', '⏱️',
          'titulo', 'Duración',
          'descripcion', 'Sesiones de 60 minutos de entrenamiento intensivo'
        ),
        jsonb_build_object(
          'icono', '📅',
          'titulo', 'Horarios',
          'descripcion', 'Totalmente flexibles según tu disponibilidad'
        ),
        jsonb_build_object(
          'icono', '💰',
          'titulo', 'Planes',
          'descripcion', 'Por sesión individual o paquetes de 4, 8 o 12 clases con descuento'
        )
      )
    ),
    true
  );

  -- SECCIÓN 6: CTA
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'cta',
    6,
    jsonb_build_object(
      'titulo', '¡Reserva Tu Primera Clase!',
      'descripcion', 'Da el primer paso hacia tu mejor versión como futbolista',
      'cta_primario_texto', 'Agendar Ahora',
      'cta_primario_url', '/contacto',
      'cta_secundario_texto', 'Consultar por WhatsApp',
      'cta_secundario_url', 'https://wa.me/56974265020',
      'fondo_color', 'amarillo'
    ),
    true
  );

  RAISE NOTICE 'Contenido de Clases Particulares Fútbol migrado: 6 secciones creadas';
END $$;

SELECT ps.orden, ps.tipo_seccion FROM page_sections ps
JOIN pages p ON ps.page_id = p.id WHERE p.slug = 'clasesparticularesfutbol' ORDER BY ps.orden;
