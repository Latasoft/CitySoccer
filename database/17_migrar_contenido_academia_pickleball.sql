-- ========================================
-- MIGRAR CONTENIDO DE ACADEMIA DE PICKLEBALL AL CMS
-- ========================================

DO $$
DECLARE
  v_page_id UUID;
BEGIN
  SELECT id INTO v_page_id FROM pages WHERE slug = 'academiadepickleball';
  
  IF v_page_id IS NULL THEN
    RAISE EXCEPTION 'Página academiadepickleball no encontrada';
  END IF;

  -- SECCIÓN 1: Hero
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'hero',
    1,
    jsonb_build_object(
      'titulo', 'Academia de Pickleball',
      'subtitulo', 'Aprende el deporte de más rápido crecimiento con instructores certificados',
      'imagen_fondo', '/images/pickleball-hero.jpg',
      'cta_texto', 'Comenzar Ahora',
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
      'titulo', '¿Qué es Pickleball?',
      'contenido', '<p class="text-lg mb-4">El pickleball es un deporte de raqueta que combina elementos del tenis, bádminton y ping pong. Es fácil de aprender, divertido de jugar y apropiado para todas las edades.</p><p class="text-lg mb-4"><strong>¿Por qué Pickleball?</strong></p><ul class="space-y-2 text-lg"><li>✓ Fácil de aprender para principiantes</li><li>✓ Excelente ejercicio cardiovascular</li><li>✓ Social y divertido</li><li>✓ Bajo impacto en articulaciones</li><li>✓ Competitivo y desafiante</li></ul>',
      'imagen', '/images/pickleball-juego.jpg',
      'posicion_imagen', 'left',
      'fondo_oscuro', false
    ),
    true
  );

  -- SECCIÓN 3: Card Grid - Niveles
  INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
  VALUES (
    v_page_id,
    'card-grid',
    3,
    jsonb_build_object(
      'titulo', 'Niveles de Entrenamiento',
      'descripcion', 'Clases adaptadas a tu experiencia',
      'columnas', 3,
      'fondo_oscuro', true,
      'cards', jsonb_build_array(
        jsonb_build_object(
          'icono', '🌱',
          'titulo', 'Principiante',
          'descripcion', 'Aprende las reglas básicas, golpes fundamentales y estrategia inicial.'
        ),
        jsonb_build_object(
          'icono', '📈',
          'titulo', 'Intermedio',
          'descripcion', 'Perfecciona tu técnica, desarrolla estrategias y mejora tu juego en red.'
        ),
        jsonb_build_object(
          'icono', '🏆',
          'titulo', 'Avanzado',
          'descripcion', 'Entrenamiento competitivo, estrategias avanzadas y preparación para torneos.'
        ),
        jsonb_build_object(
          'icono', '👥',
          'titulo', 'Clases Grupales',
          'descripcion', 'Grupos reducidos (máx. 8 personas) para mejor atención personalizada.'
        ),
        jsonb_build_object(
          'icono', '👤',
          'titulo', 'Clases Particulares',
          'descripcion', 'Entrenamiento 1-a-1 enfocado en tus necesidades específicas.'
        ),
        jsonb_build_object(
          'icono', '👨‍👩‍👧‍👦',
          'titulo', 'Clases Familiares',
          'descripcion', 'Aprende pickleball en familia. Divertido para todas las edades.'
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
      'titulo', 'Detalles del Programa',
      'columnas', 2,
      'fondo_oscuro', false,
      'cards', jsonb_build_array(
        jsonb_build_object(
          'icono', '⏰',
          'titulo', 'Horarios Flexibles',
          'descripcion', 'Clases matutinas, vespertinas y fines de semana. Elige el horario que mejor se ajuste.'
        ),
        jsonb_build_object(
          'icono', '👨‍🏫',
          'titulo', 'Instructores Certificados',
          'descripcion', 'Profesionales certificados por la Federación Internacional de Pickleball.'
        ),
        jsonb_build_object(
          'icono', '🎾',
          'titulo', 'Equipamiento Incluido',
          'descripcion', 'Raquetas y pelotas proporcionadas. Canchas profesionales disponibles.'
        ),
        jsonb_build_object(
          'icono', '💰',
          'titulo', 'Planes Accesibles',
          'descripcion', 'Paquetes mensuales y por clase. Descuentos para grupos y familias.'
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
      'titulo', '¡Prueba Tu Primera Clase Gratis!',
      'descripcion', 'Descubre por qué el pickleball es el deporte que todos están jugando',
      'cta_primario_texto', 'Agendar Clase Gratuita',
      'cta_primario_url', '/contacto',
      'cta_secundario_texto', 'Consultar por WhatsApp',
      'cta_secundario_url', 'https://wa.me/56974265020',
      'fondo_color', 'gradiente'
    ),
    true
  );

  RAISE NOTICE 'Contenido de Academia de Pickleball migrado: 5 secciones creadas';
END $$;

SELECT ps.orden, ps.tipo_seccion FROM page_sections ps
JOIN pages p ON ps.page_id = p.id WHERE p.slug = 'academiadepickleball' ORDER BY ps.orden;
