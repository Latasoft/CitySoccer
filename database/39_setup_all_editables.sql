-- ============================================================================
-- SETUP COMPLETO: TODOS LOS CAMPOS EDITABLES IN-PLACE
-- ============================================================================
-- Este script configura TODOS los campos editables para el sistema in-place
-- Ejecuta este script UNA VEZ para inicializar toda la base de datos
-- ============================================================================

-- Limpiar todos los campos editables existentes
DELETE FROM editable_content;

-- ============================================================================
-- HOME PAGE (Hero + CardCarousel)
-- ============================================================================
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order, help_text) VALUES
  -- Hero.jsx
  ('home', 'hero_title', 'text', 'Bienvenido a City Soccer', 'Título Hero', 'hero', 1, 'Título principal del hero'),
  ('home', 'hero_subtitle', 'textarea', 'El mejor lugar para jugar fútbol y pickleball', 'Subtítulo Hero', 'hero', 2, 'Descripción bajo el título'),
  ('home', 'hero_cta_text', 'text', 'RESERVA HOY', 'Texto Botón CTA', 'hero', 3, 'Texto del botón principal'),
  
  -- CardCarousel.jsx
  ('home', 'carousel_title', 'text', 'Descubre City Soccer', 'Título Carousel', 'carousel', 4, 'Título del carousel de tarjetas'),
  ('home', 'carousel_subtitle', 'textarea', 'Experiencias deportivas únicas que transforman tu forma de jugar y vivir el deporte', 'Subtítulo Carousel', 'carousel', 5, 'Descripción del carousel');

-- ============================================================================
-- FOOTER
-- ============================================================================
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order) VALUES
  ('footer', 'background_image', 'image', '/Cancha3.jpeg', 'Imagen de Fondo', 'design', 1),
  ('footer', 'contact_label', 'text', 'Contáctanos', 'Etiqueta Contacto', 'contact', 2),
  ('footer', 'contact_phone', 'text', '+56 9 1234 5678', 'Teléfono', 'contact', 3),
  ('footer', 'contact_address', 'textarea', 'Av. Principal 123, Santiago, Chile', 'Dirección', 'contact', 4),
  ('footer', 'hours_weekdays', 'text', 'Lun - Vie: 9:00 - 23:00', 'Horario Semana', 'hours', 5),
  ('footer', 'hours_saturday', 'text', 'Sáb: 9:00 - 23:00', 'Horario Sábado', 'hours', 6),
  ('footer', 'hours_sunday', 'text', 'Dom: 9:00 - 23:00', 'Horario Domingo', 'hours', 7),
  ('footer', 'social_facebook', 'url', 'https://facebook.com/citysoccer', 'Facebook URL', 'social', 8),
  ('footer', 'social_instagram', 'url', 'https://instagram.com/citysoccer', 'Instagram URL', 'social', 9),
  ('footer', 'social_twitter', 'url', 'https://twitter.com/citysoccer', 'Twitter URL', 'social', 10),
  ('footer', 'copyright_text', 'text', '© 2025 City Soccer. Todos los derechos reservados.', 'Copyright', 'legal', 11);

-- ============================================================================
-- SERVICIOS
-- ============================================================================
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order) VALUES
  ('servicios', 'page_title', 'text', 'Nuestros Servicios', 'Título Página', 'general', 1),
  ('servicios', 'page_description', 'textarea', 'En City Soccer ofrecemos experiencias deportivas de primer nivel para toda la familia', 'Descripción Página', 'general', 2),
  ('servicios', 'service1_title', 'text', 'Arriendo de Canchas', 'Servicio 1 - Título', 'services', 3),
  ('servicios', 'service1_description', 'textarea', 'Canchas profesionales de fútbol y pickleball disponibles para arriendo. Reserva online las 24 horas.', 'Servicio 1 - Descripción', 'services', 4),
  ('servicios', 'service2_title', 'text', 'Clases de Fútbol', 'Servicio 2 - Título', 'services', 5),
  ('servicios', 'service2_description', 'textarea', 'Academia y clases particulares con entrenadores certificados. Para todas las edades y niveles.', 'Servicio 2 - Descripción', 'services', 6),
  ('servicios', 'service3_title', 'text', 'Clases de Pickleball', 'Servicio 3 - Título', 'services', 7),
  ('servicios', 'service3_description', 'textarea', 'Aprende el deporte de más rápido crecimiento con instructores especializados.', 'Servicio 3 - Descripción', 'services', 8),
  ('servicios', 'service4_title', 'text', 'Eventos Deportivos', 'Servicio 4 - Título', 'services', 9),
  ('servicios', 'service4_description', 'textarea', 'Organizamos cumpleaños, eventos corporativos y campeonatos deportivos.', 'Servicio 4 - Descripción', 'services', 10);

-- ============================================================================
-- CONTACTO
-- ============================================================================
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order) VALUES
  ('contacto', 'page_title', 'text', 'Contacto', 'Título Página', 'general', 1),
  ('contacto', 'info_section_title', 'text', 'Información de contacto', 'Título Sección Info', 'contact', 2),
  ('contacto', 'form_title', 'text', 'Contáctanos por WhatsApp', 'Título Formulario', 'form', 3),
  ('contacto', 'form_description', 'text', 'Ingresa tu nombre y te conectaremos directamente', 'Descripción Formulario', 'form', 4);

-- ============================================================================
-- ARRENDARCANCHA (Página principal de selección)
-- ============================================================================
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order) VALUES
  ('arrendarcancha', 'page_title', 'text', 'Arrienda tu Cancha', 'Título Página', 'general', 1),
  ('arrendarcancha', 'page_description', 'textarea', 'Elige el tipo de cancha que deseas reservar y disfruta de nuestras instalaciones de primer nivel', 'Descripción', 'general', 2);

-- ============================================================================
-- PÁGINAS DE ARRIENDO (Individuales)
-- ============================================================================

-- FÚTBOL 7
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order) VALUES
  ('arriendo_futbol7', 'page_title', 'text', 'Arrienda Cancha de Fútbol 7', 'Título Página', 'general', 1),
  ('arriendo_futbol7', 'page_description', 'textarea', 'Reserva tu cancha de fútbol 7 de forma rápida y segura. Elige el horario que más te acomode.', 'Descripción', 'general', 2);

-- FÚTBOL 9
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order) VALUES
  ('arriendo_futbol9', 'page_title', 'text', 'Arrienda Cancha de Fútbol 9', 'Título Página', 'general', 1),
  ('arriendo_futbol9', 'page_description', 'textarea', 'Reserva tu cancha de fútbol 9 de forma rápida y segura. Elige el horario que más te acomode.', 'Descripción', 'general', 2);

-- PICKLEBALL INDIVIDUAL
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order) VALUES
  ('arriendo_pickleball-individual', 'page_title', 'text', 'Arrienda Cancha de Pickleball Individual', 'Título Página', 'general', 1),
  ('arriendo_pickleball-individual', 'page_description', 'textarea', 'Reserva tu cancha de pickleball individual de forma rápida y segura. Elige el horario que más te acomode.', 'Descripción', 'general', 2);

-- PICKLEBALL DOBLES
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order) VALUES
  ('arriendo_pickleball-dobles', 'page_title', 'text', 'Arrienda Cancha de Pickleball Dobles', 'Título Página', 'general', 1),
  ('arriendo_pickleball-dobles', 'page_description', 'textarea', 'Reserva tu cancha de pickleball dobles de forma rápida y segura. Elige el horario que más te acomode.', 'Descripción', 'general', 2);

-- ============================================================================
-- SUMMER CAMP
-- ============================================================================
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order) VALUES
  ('summer-camp', 'hero_title_first', 'text', 'Summer', 'Título Hero - Primera Palabra', 'hero', 1),
  ('summer-camp', 'hero_title_second', 'text', 'Camp', 'Título Hero - Segunda Palabra', 'hero', 2),
  ('summer-camp', 'hero_subtitle', 'text', 'En City Soccer.', 'Subtítulo Hero', 'hero', 3),
  ('summer-camp', 'hero_description', 'textarea', 'Este verano vive la mejor experiencia deportiva en el Summer Camp CitySoccer. Un programa lleno de actividades para niños y jóvenes, donde se combinan entrenamientos de fútbol y pickleball con dinámicas recreativas, trabajo en equipo y valores de compañerismo.', 'Descripción Hero', 'hero', 4),
  ('summer-camp', 'hero_button_text', 'text', 'Más Información', 'Texto Botón Hero', 'hero', 5);

-- ============================================================================
-- EVENTOS
-- ============================================================================
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order) VALUES
  ('eventos', 'hero_title_first', 'text', 'Eventos', 'Título Hero - Primera Palabra', 'hero', 1),
  ('eventos', 'hero_title_second', 'text', 'Deportivos', 'Título Hero - Segunda Palabra', 'hero', 2),
  ('eventos', 'hero_subtitle', 'text', ' ', 'Subtítulo Hero', 'hero', 3),
  ('eventos', 'hero_description', 'textarea', 'Nuestras canchas y espacios están disponibles para cumpleaños, campeonatos, clínicas deportivas, actividades empresariales y más.', 'Descripción Hero', 'hero', 4),
  ('eventos', 'hero_button_text', 'text', 'Ver Nuestros Eventos', 'Texto Botón Hero', 'hero', 5);

-- ============================================================================
-- ACADEMIA DE FÚTBOL
-- ============================================================================
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order) VALUES
  ('academiadefutbol', 'hero_title_first', 'text', 'Academia de', 'Título Hero - Primera Palabra', 'hero', 1),
  ('academiadefutbol', 'hero_title_second', 'text', 'Fútbol', 'Título Hero - Segunda Palabra', 'hero', 2),
  ('academiadefutbol', 'hero_subtitle', 'text', '', 'Subtítulo Hero', 'hero', 3),
  ('academiadefutbol', 'hero_description', 'textarea', 'La pasión por el fútbol se vive en nuestra Academia CitySoccer. Aquí formamos a niños, jóvenes y adultos bajo un programa integral que combina técnica, táctica y valores deportivos. Nuestros entrenadores profesionales trabajan con metodologías modernas para potenciar el talento y desarrollar habilidades dentro y fuera de la cancha. Ven a entrenar en un ambiente sano, motivador y lleno de energía.', 'Descripción Hero', 'hero', 4),
  ('academiadefutbol', 'hero_button_text', 'text', 'Ver Programas', 'Texto Botón Hero', 'hero', 5);

-- ============================================================================
-- ACADEMIA DE PICKLEBALL
-- ============================================================================
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order) VALUES
  ('academiadepickleball', 'hero_title_first', 'text', 'Academia de', 'Título Hero - Primera Palabra', 'hero', 1),
  ('academiadepickleball', 'hero_title_second', 'text', 'Pickleball', 'Título Hero - Segunda Palabra', 'hero', 2),
  ('academiadepickleball', 'hero_subtitle', 'text', '', 'Subtítulo Hero', 'hero', 3),
  ('academiadepickleball', 'hero_description', 'textarea', 'Descubre la emoción del pickleball en nuestra Academia CitySoccer. El deporte de raqueta de más rápido crecimiento mundial ahora tiene su hogar en Chile. Nuestros instructores especializados te guiarán desde los fundamentos hasta el nivel competitivo, en un ambiente profesional, divertido y lleno de energía. Únete a la revolución del pickleball.', 'Descripción Hero', 'hero', 4),
  ('academiadepickleball', 'hero_button_text', 'text', 'Ver Programas', 'Texto Botón Hero', 'hero', 5);

-- ============================================================================
-- CLASES PARTICULARES DE FÚTBOL
-- ============================================================================
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order) VALUES
  ('clasesparticularesfutbol', 'hero_title_first', 'text', 'Clases', 'Título Hero - Primera Palabra', 'hero', 1),
  ('clasesparticularesfutbol', 'hero_title_second', 'text', 'Particulares', 'Título Hero - Segunda Palabra', 'hero', 2),
  ('clasesparticularesfutbol', 'hero_subtitle', 'text', 'de Fútbol', 'Subtítulo Hero', 'hero', 3),
  ('clasesparticularesfutbol', 'hero_description', 'textarea', 'Las clases particulares de fútbol CitySoccer están diseñadas para que trabajes mano a mano con un entrenador especializado. Ajustamos cada sesión a tus necesidades: técnica, velocidad, resistencia, táctica y control del balón.', 'Descripción Hero', 'hero', 4),
  ('clasesparticularesfutbol', 'hero_button_text', 'text', 'Agendar Clase', 'Texto Botón Hero', 'hero', 5);

-- ============================================================================
-- CLASES PARTICULARES DE PICKLEBALL
-- ============================================================================
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order) VALUES
  ('clasesparticularespickleball', 'hero_title_first', 'text', 'Clases', 'Título Hero - Primera Palabra', 'hero', 1),
  ('clasesparticularespickleball', 'hero_title_second', 'text', 'Particulares', 'Título Hero - Segunda Palabra', 'hero', 2),
  ('clasesparticularespickleball', 'hero_subtitle', 'text', 'de Pickleball', 'Subtítulo Hero', 'hero', 3),
  ('clasesparticularespickleball', 'hero_description', 'textarea', 'Nuestras clases particulares de pickleball son ideales si buscas avanzar rápido, mejorar tu técnica de saque, voleas y estrategia de juego. Los entrenadores se adaptan a tu ritmo y objetivos, entregándote una experiencia enfocada 100% en ti.', 'Descripción Hero', 'hero', 4),
  ('clasesparticularespickleball', 'hero_button_text', 'text', 'Reservar Clase', 'Texto Botón Hero', 'hero', 5);

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================
SELECT 
  page_key,
  COUNT(*) as total_campos,
  STRING_AGG(field_key, ', ' ORDER BY display_order) as campos
FROM editable_content
GROUP BY page_key
ORDER BY page_key;

-- Ver todos los campos
SELECT 
  page_key,
  field_key,
  LEFT(field_value, 50) as valor_preview,
  field_group,
  display_order
FROM editable_content
ORDER BY page_key, display_order;
