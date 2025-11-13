-- ========================================
-- MIGRAR CONTENIDO DE SERVICIOS AL CMS
-- ========================================

DO $$
DECLARE
  v_page_id UUID;
BEGIN
  SELECT id INTO v_page_id FROM pages WHERE slug = 'servicios';
  
  IF v_page_id IS NULL THEN
    RAISE EXCEPTION 'Página servicios no encontrada';
  END IF;

  -- SECCIÓN 1: Hero - Nuestros Servicios
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'hero',
    1,
    jsonb_build_object(
      'titulo', 'Nuestros Servicios',
      'subtitulo', 'Todo lo que necesitas para vivir el deporte al máximo',
      'imagen_fondo', '/images/servicios-hero.jpg',
      'cta_texto', 'Ver Canchas',
      'cta_url', '/arrendarcancha',
      'altura', 'medium',
      'alineacion', 'center',
      'overlay_opacity', 0.5
    ),
    true
  );

  -- SECCIÓN 2: Card Grid - Servicios Principales
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'card-grid',
    2,
    jsonb_build_object(
      'titulo', 'Lo Que Ofrecemos',
      'descripcion', 'Servicios deportivos de primera clase para toda la familia',
      'columnas', 3,
      'fondo_oscuro', false,
      'cards', jsonb_build_array(
        jsonb_build_object(
          'icono', '⚽',
          'titulo', 'Arriendo de Canchas',
          'descripcion', 'Canchas de Fútbol 7, Fútbol 9 y Pickleball disponibles para reservar por hora',
          'url', '/arrendarcancha',
          'url_texto', 'Reservar →'
        ),
        jsonb_build_object(
          'icono', '🎓',
          'titulo', 'Academia de Fútbol',
          'descripcion', 'Clases grupales con entrenadores profesionales para todas las edades',
          'url', '/academiadefutbol',
          'url_texto', 'Inscribirse →'
        ),
        jsonb_build_object(
          'icono', '🏓',
          'titulo', 'Academia de Pickleball',
          'descripcion', 'Aprende pickleball con instructores certificados en nuestras canchas especializadas',
          'url', '/academiadepickleball',
          'url_texto', 'Inscribirse →'
        ),
        jsonb_build_object(
          'icono', '👤',
          'titulo', 'Clases Particulares',
          'descripcion', 'Entrenamiento personalizado uno a uno en fútbol o pickleball',
          'url', '/clasesparticularesfutbol',
          'url_texto', 'Agendar →'
        ),
        jsonb_build_object(
          'icono', '🏕️',
          'titulo', 'Summer Camp',
          'descripcion', 'Campamentos de verano con actividades deportivas y recreativas',
          'url', '/summer-camp',
          'url_texto', 'Inscribir →'
        ),
        jsonb_build_object(
          'icono', '🎉',
          'titulo', 'Eventos y Torneos',
          'descripcion', 'Organización de eventos deportivos, cumpleaños y torneos',
          'url', '/eventos',
          'url_texto', 'Ver Eventos →'
        )
      )
    ),
    true
  );

  -- SECCIÓN 3: Text + Image - ¿Por qué City Soccer?
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'text-image',
    3,
    jsonb_build_object(
      'titulo', '¿Por Qué Elegir City Soccer?',
      'contenido', '<ul class="space-y-3 text-lg"><li><strong>✓ Instalaciones de Primera:</strong> Canchas con césped sintético profesional y excelente iluminación</li><li><strong>✓ Horarios Flexibles:</strong> Abiertos de 9:00 AM a 11:00 PM todos los días</li><li><strong>✓ Profesionales Certificados:</strong> Entrenadores con experiencia y pasión por enseñar</li><li><strong>✓ Ambiente Familiar:</strong> Un espacio seguro y acogedor para toda la familia</li><li><strong>✓ Equipamiento Completo:</strong> Vestuarios, estacionamiento y cafetería</li></ul>',
      'imagen', '/images/instalaciones.jpg',
      'posicion_imagen', 'right',
      'fondo_oscuro', true
    ),
    true
  );

  -- SECCIÓN 4: CTA Final
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'cta',
    4,
    jsonb_build_object(
      'titulo', '¿Listo para Comenzar?',
      'descripcion', 'Reserva tu cancha o inscríbete en nuestras academias hoy mismo',
      'cta_primario_texto', 'Reservar Cancha',
      'cta_primario_url', '/arrendarcancha',
      'cta_secundario_texto', 'Contacto',
      'cta_secundario_url', '/contacto',
      'fondo_color', 'amarillo'
    ),
    true
  );

  RAISE NOTICE 'Contenido de Servicios migrado: 4 secciones creadas';
END $$;

SELECT ps.orden, ps.tipo_seccion FROM page_sections ps
JOIN pages p ON ps.page_id = p.id WHERE p.slug = 'servicios' ORDER BY ps.orden;
