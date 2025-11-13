-- ========================================
-- MIGRAR CONTENIDO DE CLASES PARTICULARES PICKLEBALL AL CMS
-- ========================================

DO $$
DECLARE
  v_page_id UUID;
BEGIN
  SELECT id INTO v_page_id FROM pages WHERE slug = 'clasesparticularespickleball';
  
  IF v_page_id IS NULL THEN
    RAISE EXCEPTION 'Página clasesparticularespickleball no encontrada';
  END IF;

  -- SECCIÓN 1: Hero
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'hero',
    1,
    jsonb_build_object(
      'titulo', 'Clases Particulares de Pickleball',
      'subtitulo', 'Mejora tu juego con entrenamiento personalizado de instructores certificados',
      'imagen_fondo', '/images/pickleball-particular.jpg',
      'cta_texto', 'Reservar Clase',
      'cta_url', '/contacto',
      'altura', 'medium',
      'alineacion', 'center',
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
      'titulo', 'Entrenamiento Personalizado',
      'contenido', '<p class="text-lg mb-4">Acelera tu aprendizaje con clases diseñadas específicamente para ti.</p><p class="text-lg mb-4"><strong>Ventajas del entrenamiento particular:</strong></p><ul class="space-y-2 text-lg"><li>✓ Atención 100% enfocada en tu juego</li><li>✓ Progreso más rápido y efectivo</li><li>✓ Corrección inmediata de errores</li><li>✓ Horarios adaptados a tu agenda</li><li>✓ Plan personalizado según tus metas</li><li>✓ Práctica intensiva con feedback constante</li></ul>',
      'imagen', '/images/instructor-pickleball.jpg',
      'posicion_imagen', 'left',
      'fondo_oscuro', false
    ),
    true
  );

  -- SECCIÓN 3: Card Grid - Áreas de Entrenamiento
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'card-grid',
    3,
    jsonb_build_object(
      'titulo', 'Áreas de Entrenamiento',
      'columnas', 3,
      'fondo_oscuro', true,
      'cards', jsonb_build_array(
        jsonb_build_object(
          'icono', '🎾',
          'titulo', 'Técnica de Golpes',
          'descripcion', 'Drive, voleas, smash, drop shot y lob'
        ),
        jsonb_build_object(
          'icono', '🎯',
          'titulo', 'Precisión y Control',
          'descripcion', 'Mejora la ubicación y potencia de tus golpes'
        ),
        jsonb_build_object(
          'icono', '📐',
          'titulo', 'Posicionamiento',
          'descripcion', 'Dónde estar en cada momento del juego'
        ),
        jsonb_build_object(
          'icono', '🧠',
          'titulo', 'Estrategia',
          'descripcion', 'Tácticas para individuales y dobles'
        ),
        jsonb_build_object(
          'icono', '🏃',
          'titulo', 'Movimiento en Cancha',
          'descripcion', 'Desplazamiento, anticipación y agilidad'
        ),
        jsonb_build_object(
          'icono', '🎮',
          'titulo', 'Juego Mental',
          'descripcion', 'Concentración, estrategia y manejo de presión'
        )
      )
    ),
    true
  );

  -- SECCIÓN 4: Card Grid - Ideal Para
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
          'icono', '🌱',
          'titulo', 'Principiantes',
          'descripcion', 'Aprende los fundamentos correctos desde el inicio sin malos hábitos'
        ),
        jsonb_build_object(
          'icono', '📈',
          'titulo', 'Jugadores Intermedios',
          'descripcion', 'Perfecciona tu técnica y lleva tu juego al siguiente nivel'
        ),
        jsonb_build_object(
          'icono', '🏆',
          'titulo', 'Competidores',
          'descripcion', 'Preparación específica para torneos y competencias'
        ),
        jsonb_build_object(
          'icono', '👥',
          'titulo', 'Parejas de Dobles',
          'descripcion', 'Entrenamiento conjunto para mejorar la comunicación y estrategia'
        )
      )
    ),
    true
  );

  -- SECCIÓN 5: Card Grid - Detalles
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'card-grid',
    5,
    jsonb_build_object(
      'titulo', 'Detalles del Servicio',
      'columnas', 3,
      'fondo_oscuro', true,
      'cards', jsonb_build_array(
        jsonb_build_object(
          'icono', '⏱️',
          'titulo', 'Duración',
          'descripcion', 'Sesiones de 60 minutos (opción de 90 min disponible)'
        ),
        jsonb_build_object(
          'icono', '📅',
          'titulo', 'Flexibilidad',
          'descripcion', 'Agenda tus clases cuando mejor te acomode'
        ),
        jsonb_build_object(
          'icono', '🎾',
          'titulo', 'Equipamiento',
          'descripcion', 'Raquetas y pelotas incluidas (o trae las tuyas)'
        ),
        jsonb_build_object(
          'icono', '👨‍🏫',
          'titulo', 'Instructores',
          'descripcion', 'Certificados internacionales con experiencia competitiva'
        ),
        jsonb_build_object(
          'icono', '💰',
          'titulo', 'Paquetes',
          'descripcion', 'Clase individual o paquetes de 4, 8 y 12 clases con descuento'
        ),
        jsonb_build_object(
          'icono', '📊',
          'titulo', 'Seguimiento',
          'descripcion', 'Evaluación de progreso y plan de mejora continua'
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
      'titulo', '¡Eleva Tu Nivel de Juego!',
      'descripcion', 'Reserva tu primera clase particular y descubre tu potencial',
      'cta_primario_texto', 'Reservar Clase',
      'cta_primario_url', '/contacto',
      'cta_secundario_texto', 'Consultas WhatsApp',
      'cta_secundario_url', 'https://wa.me/56974265020',
      'fondo_color', 'gradiente'
    ),
    true
  );

  RAISE NOTICE 'Contenido de Clases Particulares Pickleball migrado: 6 secciones creadas';
END $$;

SELECT ps.orden, ps.tipo_seccion FROM page_sections ps
JOIN pages p ON ps.page_id = p.id WHERE p.slug = 'clasesparticularespickleball' ORDER BY ps.orden;
