-- ========================================
-- MIGRAR CONTENIDO DE CONTACTO AL CMS
-- ========================================

DO $$
DECLARE
  v_page_id UUID;
BEGIN
  SELECT id INTO v_page_id FROM pages WHERE slug = 'contacto';
  
  IF v_page_id IS NULL THEN
    RAISE EXCEPTION 'Página contacto no encontrada';
  END IF;

  -- SECCIÓN 1: Hero
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'hero',
    1,
    jsonb_build_object(
      'titulo', 'Contáctanos',
      'subtitulo', 'Estamos aquí para ayudarte. Comunícate con nosotros por cualquiera de nuestros canales',
      'imagen_fondo', '/images/contacto-hero.jpg',
      'cta_texto', 'Enviar WhatsApp',
      'cta_url', 'https://wa.me/56974265020',
      'altura', 'small',
      'alineacion', 'center',
      'overlay_opacity', 0.5
    ),
    true
  );

  -- SECCIÓN 2: Card Grid - Formas de Contacto
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'card-grid',
    2,
    jsonb_build_object(
      'titulo', 'Cómo Contactarnos',
      'descripcion', 'Elige el canal que prefieras',
      'columnas', 3,
      'fondo_oscuro', false,
      'cards', jsonb_build_array(
        jsonb_build_object(
          'icono', '📱',
          'titulo', 'WhatsApp',
          'descripcion', '+56 9 7426 5020',
          'url', 'https://wa.me/56974265020',
          'url_texto', 'Chatear →'
        ),
        jsonb_build_object(
          'icono', '📧',
          'titulo', 'Email',
          'descripcion', 'citysoccersantiago@gmail.com',
          'url', 'mailto:citysoccersantiago@gmail.com',
          'url_texto', 'Enviar Email →'
        ),
        jsonb_build_object(
          'icono', '📍',
          'titulo', 'Ubicación',
          'descripcion', 'Av. Principal 123, Santiago',
          'url', 'https://maps.google.com',
          'url_texto', 'Ver Mapa →'
        ),
        jsonb_build_object(
          'icono', '⏰',
          'titulo', 'Horario de Atención',
          'descripcion', 'Lun - Dom: 9:00 AM - 11:00 PM'
        ),
        jsonb_build_object(
          'icono', '📲',
          'titulo', 'Instagram',
          'descripcion', '@citysoccersantiago',
          'url', 'https://instagram.com/citysoccersantiago',
          'url_texto', 'Seguir →'
        ),
        jsonb_build_object(
          'icono', '💬',
          'titulo', 'Redes Sociales',
          'descripcion', 'Síguenos en todas nuestras redes'
        )
      )
    ),
    true
  );

  -- SECCIÓN 3: Text + Image - Visítanos
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'text-image',
    3,
    jsonb_build_object(
      'titulo', 'Visítanos',
      'contenido', '<p class="text-lg mb-4">Estamos ubicados en un lugar de fácil acceso con amplio estacionamiento.</p><p class="text-lg mb-4"><strong>Horarios:</strong></p><ul class="space-y-2 text-lg"><li>Lunes a Viernes: 9:00 AM - 11:00 PM</li><li>Sábados y Domingos: 9:00 AM - 11:00 PM</li><li>Feriados: Consultar</li></ul><p class="text-lg mt-4">Te esperamos para conocer nuestras instalaciones y resolver todas tus dudas.</p>',
      'imagen', '/images/instalaciones.jpg',
      'posicion_imagen', 'right',
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
      'titulo', '¿Listo para Comenzar?',
      'descripcion', 'Reserva tu cancha o agenda tu primera clase hoy mismo',
      'cta_primario_texto', 'Reservar Ahora',
      'cta_primario_url', '/arrendarcancha',
      'cta_secundario_texto', 'WhatsApp',
      'cta_secundario_url', 'https://wa.me/56974265020',
      'fondo_color', 'amarillo'
    ),
    true
  );

  RAISE NOTICE 'Contenido de Contacto migrado: 4 secciones creadas';
END $$;

SELECT ps.orden, ps.tipo_seccion FROM page_sections ps
JOIN pages p ON ps.page_id = p.id WHERE p.slug = 'contacto' ORDER BY ps.orden;
