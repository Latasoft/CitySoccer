-- ========================================
-- MIGRAR PÁGINA HOME (RAÍZ) AL CMS
-- ========================================
-- Este script migra la página principal (/) al sistema CMS

DO $$ 
DECLARE 
  v_page_id UUID;
BEGIN

-- 1. Registrar la página Home
INSERT INTO pages (slug, titulo, meta_title, meta_description, meta_keywords, layout_type, publicada, activa)
VALUES (
  'home',
  'City Soccer - Complejo Deportivo en Maipú',
  'City Soccer - Complejo Deportivo en Maipú',
  'El mejor complejo deportivo de Maipú. Canchas de fútbol y pickleball, academias, clases particulares y más.',
  'city soccer, complejo deportivo maipú, canchas fútbol, pickleball, academia deportiva',
  'default',
  false, -- Despublicada hasta completar contenido
  true
)
RETURNING id INTO v_page_id;

RAISE NOTICE 'Página Home registrada con ID: %', v_page_id;

-- 2. SECCIÓN 1: Hero Principal
INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
VALUES (
  v_page_id,
  'hero',
  1,
  jsonb_build_object(
    'titulo', 'BIENVENIDOS A CITY SOCCER',
    'subtitulo', 'El mejor complejo deportivo de Maipú. Canchas profesionales, academias y clases particulares.',
    'imagen_fondo', '/Cancha3.jpeg',
    'cta_texto', 'Reservar Cancha',
    'cta_url', '/arrendarcancha',
    'altura', 'fullscreen',
    'alineacion', 'center',
    'overlay_opacity', 0.6
  ),
  true
);

-- 3. SECCIÓN 2: Servicios Destacados (Card Grid)
INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
VALUES (
  v_page_id,
  'card-grid',
  2,
  jsonb_build_object(
    'titulo', 'Nuestros Servicios',
    'descripcion', 'Todo lo que necesitas para tu deporte favorito',
    'columnas', 3,
    'fondo_oscuro', false,
    'cards', jsonb_build_array(
      jsonb_build_object(
        'icono', '⚽',
        'titulo', 'Arriendo de Canchas',
        'descripcion', 'Canchas profesionales de fútbol 7, fútbol 9 y pickleball con pasto sintético de última generación.',
        'url', '/arrendarcancha',
        'url_texto', 'Reservar ahora'
      ),
      jsonb_build_object(
        'icono', '🎓',
        'titulo', 'Academias Deportivas',
        'descripcion', 'Programas de entrenamiento profesional para niños y adultos en fútbol y pickleball.',
        'url', '/academiadefutbol',
        'url_texto', 'Conoce más'
      ),
      jsonb_build_object(
        'icono', '🏆',
        'titulo', 'Clases Particulares',
        'descripcion', 'Entrenamiento personalizado con instructores certificados adaptado a tu nivel.',
        'url', '/clasesparticularesfutbol',
        'url_texto', 'Agendar clase'
      ),
      jsonb_build_object(
        'icono', '🎉',
        'titulo', 'Eventos & Fiestas',
        'descripcion', 'Organiza cumpleaños, eventos corporativos y torneos en nuestras instalaciones.',
        'url', '/eventos',
        'url_texto', 'Planifica tu evento'
      ),
      jsonb_build_object(
        'icono', '☀️',
        'titulo', 'Summer Camp',
        'descripcion', 'Campamento de verano deportivo lleno de actividades, diversión y aprendizaje.',
        'url', '/summer-camp',
        'url_texto', 'Inscribirse'
      ),
      jsonb_build_object(
        'icono', '📍',
        'titulo', 'Excelente Ubicación',
        'descripcion', 'En el corazón de Maipú, fácil acceso y estacionamiento disponible.',
        'url', '/contacto',
        'url_texto', 'Cómo llegar'
      )
    )
  ),
  true
);

-- 4. SECCIÓN 3: Por Qué Elegirnos (Text + Image)
INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
VALUES (
  v_page_id,
  'text-image',
  3,
  jsonb_build_object(
    'titulo', '¿Por Qué Elegir City Soccer?',
    'contenido', '<p class="text-lg mb-4"><strong>Somos el complejo deportivo más completo de Maipú</strong>, con instalaciones de primer nivel y un equipo comprometido con tu desarrollo deportivo.</p>
    <ul class="space-y-3 text-lg">
      <li>✅ <strong>Canchas profesionales</strong> con pasto sintético de última generación</li>
      <li>✅ <strong>Iluminación LED</strong> para jugar de día y de noche</li>
      <li>✅ <strong>Vestuarios modernos</strong> y cómodos</li>
      <li>✅ <strong>Estacionamiento gratuito</strong> para nuestros clientes</li>
      <li>✅ <strong>Instructores certificados</strong> en todas nuestras academias</li>
      <li>✅ <strong>Reservas online 24/7</strong> desde cualquier dispositivo</li>
    </ul>',
    'imagen', '/images/instalaciones.jpg',
    'posicion_imagen', 'right',
    'fondo_oscuro', true
  ),
  true
);

-- 5. SECCIÓN 4: Galería de Instalaciones
INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
VALUES (
  v_page_id,
  'gallery',
  4,
  jsonb_build_object(
    'titulo', 'Nuestras Instalaciones',
    'layout', 'grid',
    'columnas', 4,
    'fondo_oscuro', false,
    'imagenes', jsonb_build_array(
      jsonb_build_object(
        'url', '/Cancha3.jpeg',
        'titulo', 'Cancha Fútbol 7',
        'alt', 'Cancha profesional de fútbol 7 con iluminación LED'
      ),
      jsonb_build_object(
        'url', '/images/pickleball.jpg',
        'titulo', 'Canchas Pickleball',
        'alt', 'Canchas de pickleball de alta calidad'
      ),
      jsonb_build_object(
        'url', '/images/vestuarios.jpg',
        'titulo', 'Vestuarios',
        'alt', 'Vestuarios modernos y limpios'
      ),
      jsonb_build_object(
        'url', '/images/estacionamiento.jpg',
        'titulo', 'Estacionamiento',
        'alt', 'Amplio estacionamiento gratuito'
      )
    )
  ),
  true
);

-- 6. SECCIÓN 5: CTA Final
INSERT INTO page_sections (page_id, tipo_seccion, orden, configuracion, activa)
VALUES (
  v_page_id,
  'cta',
  5,
  jsonb_build_object(
    'titulo', '¿Listo para jugar?',
    'descripcion', 'Reserva tu cancha ahora y vive la experiencia City Soccer',
    'cta_primario_texto', 'Reservar Cancha',
    'cta_primario_url', '/arrendarcancha',
    'cta_secundario_texto', 'Contactar',
    'cta_secundario_url', '/contacto',
    'fondo_color', 'gradiente',
    'imagen_fondo', ''
  ),
  true
);

END $$;

-- Verificar la creación
SELECT 
  p.slug,
  p.titulo,
  COUNT(ps.id) as total_secciones
FROM pages p
LEFT JOIN page_sections ps ON p.id = ps.page_id
WHERE p.slug = 'home'
GROUP BY p.id, p.slug, p.titulo;
