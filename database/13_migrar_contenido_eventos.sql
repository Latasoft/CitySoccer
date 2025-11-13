-- ========================================
-- MIGRAR CONTENIDO DE EVENTOS AL CMS
-- ========================================

DO $$
DECLARE
  v_page_id UUID;
BEGIN
  SELECT id INTO v_page_id FROM pages WHERE slug = 'eventos';
  
  IF v_page_id IS NULL THEN
    RAISE EXCEPTION 'Página eventos no encontrada';
  END IF;

  -- SECCIÓN 1: Hero
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'hero',
    1,
    jsonb_build_object(
      'titulo', 'Eventos y Torneos',
      'subtitulo', 'Participa en nuestros eventos deportivos y vive la emoción de la competencia',
      'imagen_fondo', '/images/eventos-hero.jpg',
      'cta_texto', 'Ver Próximos Eventos',
      'cta_url', '#eventos',
      'altura', 'medium',
      'alineacion', 'center',
      'overlay_opacity', 0.6
    ),
    true
  );

  -- SECCIÓN 2: Card Grid - Tipos de Eventos
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'card-grid',
    2,
    jsonb_build_object(
      'titulo', 'Tipos de Eventos',
      'descripcion', 'Organizamos y albergamos diversos eventos deportivos',
      'columnas', 3,
      'fondo_oscuro', false,
      'cards', jsonb_build_array(
        jsonb_build_object(
          'icono', '🏆',
          'titulo', 'Torneos de Fútbol',
          'descripcion', 'Competencias de Fútbol 7 y Fútbol 9 para diferentes categorías y niveles'
        ),
        jsonb_build_object(
          'icono', '🏓',
          'titulo', 'Torneos de Pickleball',
          'descripcion', 'Torneos individuales y dobles con premios para los ganadores'
        ),
        jsonb_build_object(
          'icono', '🎂',
          'titulo', 'Cumpleaños Deportivos',
          'descripcion', 'Celebra tu cumpleaños con partidos, juegos y mucha diversión'
        ),
        jsonb_build_object(
          'icono', '🏢',
          'titulo', 'Eventos Corporativos',
          'descripcion', 'Team building y eventos empresariales con actividades deportivas'
        ),
        jsonb_build_object(
          'icono', '👨‍👩‍👧‍👦',
          'titulo', 'Jornadas Familiares',
          'descripcion', 'Eventos especiales para disfrutar en familia con actividades para todas las edades'
        ),
        jsonb_build_object(
          'icono', '⭐',
          'titulo', 'Eventos Especiales',
          'descripcion', 'Clinics con profesionales, exhibiciones y eventos temáticos'
        )
      )
    ),
    true
  );

  -- SECCIÓN 3: Text + Image - Organiza tu Evento
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'text-image',
    3,
    jsonb_build_object(
      'titulo', 'Organiza Tu Evento con Nosotros',
      'contenido', '<p class="text-lg mb-4">En City Soccer contamos con todo lo necesario para hacer de tu evento un éxito:</p><ul class="space-y-2 text-lg"><li>✓ Canchas profesionales en excelente estado</li><li>✓ Sistema de iluminación para eventos nocturnos</li><li>✓ Vestuarios y duchas</li><li>✓ Área de cafetería y descanso</li><li>✓ Estacionamiento amplio</li><li>✓ Personal de apoyo durante el evento</li></ul><p class="text-lg mt-4">Contáctanos para cotizar tu evento personalizado.</p>',
      'imagen', '/images/evento.jpg',
      'posicion_imagen', 'left',
      'fondo_oscuro', true
    ),
    true
  );

  -- SECCIÓN 4: CTA
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'cta',
    4,
    jsonb_build_object(
      'titulo', '¿Quieres Organizar un Evento?',
      'descripcion', 'Contáctanos para cotizar y planificar tu evento deportivo',
      'cta_primario_texto', 'Contactar',
      'cta_primario_url', '/contacto',
      'cta_secundario_texto', 'Ver Instalaciones',
      'cta_secundario_url', '/quienessomos',
      'fondo_color', 'gradiente'
    ),
    true
  );

  RAISE NOTICE 'Contenido de Eventos migrado: 4 secciones creadas';
END $$;

SELECT ps.orden, ps.tipo_seccion FROM page_sections ps
JOIN pages p ON ps.page_id = p.id WHERE p.slug = 'eventos' ORDER BY ps.orden;
