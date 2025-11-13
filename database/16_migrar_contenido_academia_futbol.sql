-- ========================================
-- MIGRAR CONTENIDO DE ACADEMIA DE FÚTBOL AL CMS
-- ========================================

DO $$
DECLARE
  v_page_id UUID;
BEGIN
  SELECT id INTO v_page_id FROM pages WHERE slug = 'academiadefutbol';
  
  IF v_page_id IS NULL THEN
    RAISE EXCEPTION 'Página academiadefutbol no encontrada';
  END IF;

  -- SECCIÓN 1: Hero
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'hero',
    1,
    jsonb_build_object(
      'titulo', 'Academia de Fútbol',
      'subtitulo', 'Desarrolla tu talento con entrenadores profesionales en instalaciones de primer nivel',
      'imagen_fondo', '/images/academia-futbol-hero.jpg',
      'cta_texto', 'Inscríbete Ahora',
      'cta_url', '/contacto',
      'altura', 'medium',
      'alineacion', 'left',
      'overlay_opacity', 0.5
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
      'titulo', 'Nuestra Academia',
      'contenido', '<p class="text-lg mb-4">La Academia de Fútbol City Soccer ofrece un programa integral de formación deportiva para niños, jóvenes y adultos.</p><p class="text-lg mb-4">Nuestro método combina:</p><ul class="space-y-2 text-lg"><li>✓ Técnica individual y colectiva</li><li>✓ Táctica y estrategia de juego</li><li>✓ Preparación física adaptada</li><li>✓ Valores deportivos y fair play</li><li>✓ Competencias y torneos internos</li></ul>',
      'imagen', '/images/entrenamiento-futbol.jpg',
      'posicion_imagen', 'right',
      'fondo_oscuro', false
    ),
    true
  );

  -- SECCIÓN 3: Card Grid - Categorías
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'card-grid',
    3,
    jsonb_build_object(
      'titulo', 'Categorías',
      'descripcion', 'Clases adaptadas para cada edad y nivel',
      'columnas', 3,
      'fondo_oscuro', true,
      'cards', jsonb_build_array(
        jsonb_build_object(
          'icono', '👶',
          'titulo', 'Baby Fútbol',
          'descripcion', '4-6 años. Introducción al fútbol mediante juegos y ejercicios lúdicos.'
        ),
        jsonb_build_object(
          'icono', '🧒',
          'titulo', 'Infantil',
          'descripcion', '7-10 años. Desarrollo de fundamentos técnicos y trabajo en equipo.'
        ),
        jsonb_build_object(
          'icono', '👦',
          'titulo', 'Pre-Juvenil',
          'descripcion', '11-14 años. Perfeccionamiento técnico-táctico y preparación física.'
        ),
        jsonb_build_object(
          'icono', '🧑',
          'titulo', 'Juvenil',
          'descripcion', '15-18 años. Entrenamiento avanzado y preparación competitiva.'
        ),
        jsonb_build_object(
          'icono', '👨',
          'titulo', 'Adultos',
          'descripcion', '18+ años. Clases recreativas y competitivas para mantener la forma.'
        ),
        jsonb_build_object(
          'icono', '⚽',
          'titulo', 'Porteros',
          'descripcion', 'Entrenamiento especializado para arqueros de todas las edades.'
        )
      )
    ),
    true
  );

  -- SECCIÓN 4: Card Grid - Info Práctica
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'card-grid',
    4,
    jsonb_build_object(
      'titulo', 'Información Práctica',
      'columnas', 2,
      'fondo_oscuro', false,
      'cards', jsonb_build_array(
        jsonb_build_object(
          'icono', '📅',
          'titulo', 'Horarios',
          'descripcion', 'Clases 2-3 veces por semana en horarios de tarde (16:00-20:00) y mañana sábados/domingos.'
        ),
        jsonb_build_object(
          'icono', '👨‍🏫',
          'titulo', 'Entrenadores',
          'descripcion', 'Profesionales certificados con experiencia en formación y competencia.'
        ),
        jsonb_build_object(
          'icono', '💰',
          'titulo', 'Mensualidad',
          'descripcion', 'Consulta nuestros planes mensuales. Descuentos por hermanos y pago trimestral.'
        ),
        jsonb_build_object(
          'icono', '🎽',
          'titulo', 'Equipamiento',
          'descripcion', 'Incluye kit de entrenamiento (camiseta, short, medias). Balones proporcionados.'
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
      'titulo', '¡Primera Clase Gratis!',
      'descripcion', 'Conoce nuestra metodología y a nuestros entrenadores sin compromiso',
      'cta_primario_texto', 'Agendar Clase de Prueba',
      'cta_primario_url', '/contacto',
      'cta_secundario_texto', 'Más Info por WhatsApp',
      'cta_secundario_url', 'https://wa.me/56974265020',
      'fondo_color', 'amarillo'
    ),
    true
  );

  RAISE NOTICE 'Contenido de Academia de Fútbol migrado: 5 secciones creadas';
END $$;

SELECT ps.orden, ps.tipo_seccion FROM page_sections ps
JOIN pages p ON ps.page_id = p.id WHERE p.slug = 'academiadefutbol' ORDER BY ps.orden;
