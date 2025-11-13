-- ========================================
-- MIGRAR PÁGINAS EXISTENTES AL CMS
-- ========================================
-- Este script migra las páginas estáticas existentes
-- a la base de datos del CMS para que puedan ser editadas

-- Insertar páginas existentes
INSERT INTO pages (slug, titulo, descripcion, meta_title, meta_description, meta_keywords, layout_type, activa, publicada, publicado_en)
VALUES 
  -- Página Quiénes Somos
  (
    'quienessomos',
    'Quiénes Somos',
    'Conoce más sobre City Soccer, nuestra historia y equipo',
    'Quiénes Somos - City Soccer',
    'Descubre la historia de City Soccer, el complejo deportivo líder en la región',
    'quienes somos, city soccer, historia, equipo, complejo deportivo',
    'default',
    true,
    true,
    NOW()
  ),
  
  -- Página Servicios
  (
    'servicios',
    'Nuestros Servicios',
    'Descubre todos los servicios que ofrecemos en City Soccer',
    'Servicios - City Soccer',
    'Canchas de fútbol, pickleball, clases particulares y más servicios deportivos',
    'servicios, canchas, fútbol, pickleball, clases deportivas',
    'default',
    true,
    true,
    NOW()
  ),
  
  -- Página Eventos
  (
    'eventos',
    'Eventos y Torneos',
    'Participa en nuestros eventos y torneos deportivos',
    'Eventos - City Soccer',
    'Eventos deportivos, torneos de fútbol y pickleball en City Soccer',
    'eventos, torneos, competencias, deportes',
    'default',
    true,
    true,
    NOW()
  ),
  
  -- Página Contacto
  (
    'contacto',
    'Contáctanos',
    'Ponte en contacto con nosotros',
    'Contacto - City Soccer',
    'Contáctanos para reservar, consultas o más información sobre nuestros servicios',
    'contacto, teléfono, email, ubicación, city soccer',
    'default',
    true,
    true,
    NOW()
  ),
  
  -- Página Summer Camp
  (
    'summer-camp',
    'Summer Camp',
    'Campamento de verano deportivo para niños y jóvenes',
    'Summer Camp - City Soccer',
    'Inscribe a tus hijos en nuestro campamento de verano con actividades deportivas',
    'summer camp, campamento, verano, niños, deportes',
    'default',
    true,
    true,
    NOW()
  ),
  
  -- Academia de Fútbol
  (
    'academiadefutbol',
    'Academia de Fútbol',
    'Clases profesionales de fútbol para todas las edades',
    'Academia de Fútbol - City Soccer',
    'Academia de fútbol con entrenadores profesionales para niños y adultos',
    'academia, fútbol, clases, entrenamiento, soccer',
    'default',
    true,
    true,
    NOW()
  ),
  
  -- Academia de Pickleball
  (
    'academiadepickleball',
    'Academia de Pickleball',
    'Aprende pickleball con instructores certificados',
    'Academia de Pickleball - City Soccer',
    'Clases de pickleball para principiantes y avanzados con instructores certificados',
    'academia, pickleball, clases, entrenamiento',
    'default',
    true,
    true,
    NOW()
  ),
  
  -- Clases Particulares Fútbol
  (
    'clasesparticularesfutbol',
    'Clases Particulares de Fútbol',
    'Entrenamiento personalizado de fútbol uno a uno',
    'Clases Particulares de Fútbol - City Soccer',
    'Clases particulares de fútbol con entrenadores profesionales',
    'clases particulares, fútbol, entrenamiento personalizado',
    'default',
    true,
    true,
    NOW()
  ),
  
  -- Clases Particulares Pickleball
  (
    'clasesparticularespickleball',
    'Clases Particulares de Pickleball',
    'Entrenamiento personalizado de pickleball uno a uno',
    'Clases Particulares de Pickleball - City Soccer',
    'Clases particulares de pickleball con instructores certificados',
    'clases particulares, pickleball, entrenamiento personalizado',
    'default',
    true,
    true,
    NOW()
  )

ON CONFLICT (slug) DO UPDATE SET
  titulo = EXCLUDED.titulo,
  descripcion = EXCLUDED.descripcion,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  meta_keywords = EXCLUDED.meta_keywords,
  publicada = EXCLUDED.publicada,
  activa = EXCLUDED.activa;

-- Verificar inserción
SELECT 
  slug, 
  titulo, 
  publicada,
  activa,
  creado_en
FROM pages
ORDER BY creado_en DESC;
