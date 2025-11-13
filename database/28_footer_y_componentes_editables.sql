-- ============================================================================
-- EXTENSIÓN: FOOTER Y COMPONENTES COMPARTIDOS EDITABLES
-- ============================================================================
-- Agrega campos editables para footer y componentes reutilizables
-- ============================================================================

-- ============================================================================
-- PÁGINA HOME
-- ============================================================================
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order, help_text) VALUES
  ('home', 'hero_title', 'text', 'Bienvenido a City Soccer', 'Título Principal', 'hero', 1, 'Título principal del hero'),
  ('home', 'hero_subtitle', 'textarea', 'El mejor lugar para jugar fútbol y pickleball', 'Subtítulo', 'hero', 2, 'Subtítulo del hero'),
  ('home', 'hero_cta_text', 'text', 'RESERVA HOY', 'Texto Botón CTA', 'hero', 3, 'Texto del botón principal'),
  ('home', 'carousel_title', 'text', 'Descubre City Soccer', 'Título Carousel', 'carousel', 4, 'Título del carousel de tarjetas'),
  ('home', 'carousel_subtitle', 'textarea', 'Experiencias deportivas únicas que transforman tu forma de jugar y vivir el deporte', 'Subtítulo Carousel', 'carousel', 5, 'Subtítulo del carousel')
ON CONFLICT (page_key, field_key) DO NOTHING;

-- ============================================================================
-- PÁGINAS DE ARRIENDO
-- ============================================================================
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order, help_text) VALUES
  -- Fútbol 7
  ('arriendo_futbol7', 'page_title', 'text', 'Arriendo Cancha Fútbol 7', 'Título', 'general', 1, 'Título de la página'),
  ('arriendo_futbol7', 'page_description', 'textarea', 'Reserva tu cancha de fútbol 7 de forma rápida y segura.', 'Descripción', 'general', 2, 'Descripción de la página'),
  
  -- Fútbol 9
  ('arriendo_futbol9', 'page_title', 'text', 'Arriendo Cancha Fútbol 9', 'Título', 'general', 1, 'Título de la página'),
  ('arriendo_futbol9', 'page_description', 'textarea', 'Reserva tu cancha de fútbol 9 de forma rápida y segura.', 'Descripción', 'general', 2, 'Descripción de la página'),
  
  -- Pickleball Individual
  ('arriendo_pickleball-individual', 'page_title', 'text', 'Arriendo Cancha Pickleball Individual', 'Título', 'general', 1, 'Título de la página'),
  ('arriendo_pickleball-individual', 'page_description', 'textarea', 'Reserva tu cancha de pickleball individual de forma rápida y segura.', 'Descripción', 'general', 2, 'Descripción de la página'),
  
  -- Pickleball Dobles
  ('arriendo_pickleball-dobles', 'page_title', 'text', 'Arriendo Cancha Pickleball Dobles', 'Título', 'general', 1, 'Título de la página'),
  ('arriendo_pickleball-dobles', 'page_description', 'textarea', 'Reserva tu cancha de pickleball dobles de forma rápida y segura.', 'Descripción', 'general', 2, 'Descripción de la página')
ON CONFLICT (page_key, field_key) DO NOTHING;

-- ============================================================================
-- FOOTER
-- ============================================================================
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order, help_text) VALUES
  ('footer', 'logo_url', 'image', '/images/logo.png', 'Logo Footer', 'brand', 1, 'Logo que aparece en el footer'),
  ('footer', 'company_name', 'text', 'City Soccer', 'Nombre de la Empresa', 'brand', 2, 'Nombre de la empresa'),
  ('footer', 'tagline', 'text', 'Tu destino para fútbol y pickleball', 'Eslogan', 'brand', 3, 'Frase descriptiva de la empresa'),
  ('footer', 'description', 'textarea', 'Ofrecemos las mejores instalaciones deportivas para fútbol y pickleball en la ciudad', 'Descripción Footer', 'general', 4, 'Descripción general en el footer'),
  
  -- Información de contacto
  ('footer', 'contact_label', 'text', 'Llámanos', 'Etiqueta Contacto', 'contact', 5, 'Texto de la etiqueta de contacto'),
  ('footer', 'contact_address', 'textarea', 'Dirección de las canchas\nCiudad, Región', 'Dirección', 'contact', 6, 'Dirección física completa'),
  ('footer', 'contact_phone', 'text', '+56 9 1234 5678', 'Teléfono', 'contact', 7, 'Teléfono de contacto'),
  ('footer', 'contact_email', 'text', 'info@citysoccer.cl', 'Email', 'contact', 8, 'Correo electrónico'),
  ('footer', 'contact_whatsapp', 'text', '+56912345678', 'WhatsApp', 'contact', 9, 'Número de WhatsApp sin formato'),
  
  -- Horarios
  ('footer', 'hours_title', 'text', 'Horarios de Atención', 'Título Horarios', 'hours', 10, 'Título de la sección de horarios'),
  ('footer', 'hours_weekdays', 'text', 'Lun - Vie: 9:00 - 23:00', 'Horario Semana', 'hours', 11, 'Horario de lunes a viernes'),
  ('footer', 'hours_saturday', 'text', 'Sábado: 9:00 - 23:00', 'Horario Sábado', 'hours', 12, 'Horario sábados'),
  ('footer', 'hours_sunday', 'text', 'Domingo: 9:00 - 23:00', 'Horario Domingo', 'hours', 13, 'Horario domingos'),
  
  -- Redes sociales
  ('footer', 'social_facebook', 'url', 'https://facebook.com/citysoccer', 'Facebook', 'social', 14, 'URL de Facebook'),
  ('footer', 'social_instagram', 'url', 'https://instagram.com/citysoccer', 'Instagram', 'social', 15, 'URL de Instagram'),
  ('footer', 'social_twitter', 'url', 'https://twitter.com/citysoccer', 'Twitter/X', 'social', 16, 'URL de Twitter/X'),
  ('footer', 'social_youtube', 'url', 'https://youtube.com/citysoccer', 'YouTube', 'social', 17, 'URL de YouTube'),
  ('footer', 'social_tiktok', 'url', 'https://tiktok.com/@citysoccer', 'TikTok', 'social', 18, 'URL de TikTok'),
  
  -- Legal y copyright
  ('footer', 'copyright_text', 'text', '© 2025 City Soccer. Todos los derechos reservados.', 'Copyright', 'legal', 19, 'Texto de copyright'),
  ('footer', 'privacy_policy_url', 'url', '/politica-privacidad', 'Política de Privacidad URL', 'legal', 20, 'Enlace a política de privacidad'),
  ('footer', 'terms_url', 'url', '/terminos-condiciones', 'Términos y Condiciones URL', 'legal', 21, 'Enlace a términos y condiciones')
ON CONFLICT (page_key, field_key) DO NOTHING;

-- BenefitsSection (Sección de beneficios reutilizable)
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order, help_text) VALUES
  ('component_benefits', 'section_title', 'text', '¿Por qué elegirnos?', 'Título Principal', 'general', 1, 'Título de la sección de beneficios'),
  ('component_benefits', 'section_subtitle', 'textarea', 'Ofrecemos las mejores instalaciones y servicios deportivos', 'Subtítulo', 'general', 2, 'Descripción bajo el título'),
  
  ('component_benefits', 'benefit_1_icon', 'text', 'Trophy', 'Beneficio 1 - Ícono', 'benefit_1', 3, 'Nombre del ícono lucide-react'),
  ('component_benefits', 'benefit_1_title', 'text', 'Instalaciones de Primera', 'Beneficio 1 - Título', 'benefit_1', 4, 'Título del primer beneficio'),
  ('component_benefits', 'benefit_1_description', 'textarea', 'Canchas con pasto sintético de última generación', 'Beneficio 1 - Descripción', 'benefit_1', 5, 'Descripción del beneficio'),
  
  ('component_benefits', 'benefit_2_icon', 'text', 'Shield', 'Beneficio 2 - Ícono', 'benefit_2', 6, 'Nombre del ícono lucide-react'),
  ('component_benefits', 'benefit_2_title', 'text', 'Seguridad Garantizada', 'Beneficio 2 - Título', 'benefit_2', 7, 'Título del segundo beneficio'),
  ('component_benefits', 'benefit_2_description', 'textarea', 'Instalaciones seguras y vigiladas 24/7', 'Beneficio 2 - Descripción', 'benefit_2', 8, 'Descripción del beneficio'),
  
  ('component_benefits', 'benefit_3_icon', 'text', 'Users', 'Beneficio 3 - Ícono', 'benefit_3', 9, 'Nombre del ícono lucide-react'),
  ('component_benefits', 'benefit_3_title', 'text', 'Comunidad Activa', 'Beneficio 3 - Título', 'benefit_3', 10, 'Título del tercer beneficio'),
  ('component_benefits', 'benefit_3_description', 'textarea', 'Únete a nuestra comunidad de deportistas', 'Beneficio 3 - Descripción', 'benefit_3', 11, 'Descripción del beneficio'),
  
  ('component_benefits', 'benefit_4_icon', 'text', 'Clock', 'Beneficio 4 - Ícono', 'benefit_4', 12, 'Nombre del ícono lucide-react'),
  ('component_benefits', 'benefit_4_title', 'text', 'Horarios Flexibles', 'Beneficio 4 - Título', 'benefit_4', 13, 'Título del cuarto beneficio'),
  ('component_benefits', 'benefit_4_description', 'textarea', 'Abierto todos los días de 9:00 a 23:00', 'Beneficio 4 - Descripción', 'benefit_4', 14, 'Descripción del beneficio')
ON CONFLICT (page_key, field_key) DO NOTHING;

-- CTASection (Llamado a la acción reutilizable)
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order, help_text) VALUES
  ('component_cta', 'background_image', 'image', '/images/cta-background.jpg', 'Imagen de Fondo', 'general', 1, 'Imagen de fondo de la sección CTA'),
  ('component_cta', 'title', 'text', '¿Listo para jugar?', 'Título', 'general', 2, 'Título principal del CTA'),
  ('component_cta', 'subtitle', 'textarea', 'Reserva tu cancha ahora y disfruta de las mejores instalaciones', 'Subtítulo', 'general', 3, 'Texto descriptivo'),
  ('component_cta', 'button_text', 'text', 'Reservar Ahora', 'Texto del Botón', 'general', 4, 'Texto del botón principal'),
  ('component_cta', 'button_url', 'url', '/arrendarcancha', 'URL del Botón', 'general', 5, 'Enlace del botón'),
  ('component_cta', 'secondary_button_text', 'text', 'Ver Precios', 'Texto Botón Secundario', 'general', 6, 'Texto del segundo botón (opcional)'),
  ('component_cta', 'secondary_button_url', 'url', '#precios', 'URL Botón Secundario', 'general', 7, 'Enlace del segundo botón')
ON CONFLICT (page_key, field_key) DO NOTHING;

-- ProgramsSection (Programas deportivos)
INSERT INTO editable_content (page_key, field_key, field_type, field_value, field_label, field_group, display_order, help_text) VALUES
  ('component_programs', 'section_title', 'text', 'Nuestros Programas', 'Título', 'general', 1, 'Título de la sección de programas'),
  ('component_programs', 'section_subtitle', 'textarea', 'Encuentra el programa perfecto para ti', 'Subtítulo', 'general', 2, 'Descripción de los programas'),
  
  ('component_programs', 'program_1_title', 'text', 'Academia de Fútbol', 'Programa 1 - Título', 'program_1', 3, 'Nombre del programa'),
  ('component_programs', 'program_1_description', 'textarea', 'Desarrolla tus habilidades futbolísticas', 'Programa 1 - Descripción', 'program_1', 4, 'Descripción del programa'),
  ('component_programs', 'program_1_url', 'url', '/academiadefutbol', 'Programa 1 - URL', 'program_1', 5, 'Enlace al programa'),
  ('component_programs', 'program_1_image', 'image', '/images/academia-futbol.jpg', 'Programa 1 - Imagen', 'program_1', 6, 'Imagen del programa'),
  
  ('component_programs', 'program_2_title', 'text', 'Academia de Pickleball', 'Programa 2 - Título', 'program_2', 7, 'Nombre del programa'),
  ('component_programs', 'program_2_description', 'textarea', 'Aprende y mejora tu técnica de pickleball', 'Programa 2 - Descripción', 'program_2', 8, 'Descripción del programa'),
  ('component_programs', 'program_2_url', 'url', '/academiadepickleball', 'Programa 2 - URL', 'program_2', 9, 'Enlace al programa'),
  ('component_programs', 'program_2_image', 'image', '/images/academia-pickleball.jpg', 'Programa 2 - Imagen', 'program_2', 10, 'Imagen del programa'),
  
  ('component_programs', 'program_3_title', 'text', 'Summer Camp', 'Programa 3 - Título', 'program_3', 11, 'Nombre del programa'),
  ('component_programs', 'program_3_description', 'textarea', 'Campamentos de verano para todas las edades', 'Programa 3 - Descripción', 'program_3', 12, 'Descripción del programa'),
  ('component_programs', 'program_3_url', 'url', '/summer-camp', 'Programa 3 - URL', 'program_3', 13, 'Enlace al programa'),
  ('component_programs', 'program_3_image', 'image', '/images/summer-camp.jpg', 'Programa 3 - Imagen', 'program_3', 14, 'Imagen del programa')
ON CONFLICT (page_key, field_key) DO NOTHING;

-- ============================================================================
-- ANÁLISIS
-- ============================================================================

ANALYZE editable_content;
