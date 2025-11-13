-- =====================================================
-- CMS SYSTEM: PAGES & SECTIONS
-- Sistema de gestión de contenido para páginas dinámicas
-- =====================================================

-- 1. TABLA DE PÁGINAS
CREATE TABLE IF NOT EXISTS pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    
    -- Estado
    activa BOOLEAN DEFAULT true,
    publicada BOOLEAN DEFAULT false,
    
    -- Layout
    layout_type VARCHAR(50) DEFAULT 'default', -- 'default', 'fullwidth', 'sidebar'
    
    -- Timestamps
    creado_en TIMESTAMP DEFAULT NOW(),
    actualizado_en TIMESTAMP DEFAULT NOW(),
    publicado_en TIMESTAMP
);

-- 2. TABLA DE SECCIONES DE PÁGINA
CREATE TABLE IF NOT EXISTS page_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
    
    -- Tipo de sección
    tipo_seccion VARCHAR(50) NOT NULL, -- 'hero', 'cards', 'text-image', 'cta', 'gallery', etc.
    
    -- Orden y visibilidad
    orden INTEGER NOT NULL DEFAULT 0,
    activa BOOLEAN DEFAULT true,
    
    -- Configuración JSON (flexible para cada tipo de sección)
    configuracion JSONB NOT NULL DEFAULT '{}',
    
    -- Estilos personalizados
    estilos_custom JSONB DEFAULT '{}',
    
    -- Timestamps
    creado_en TIMESTAMP DEFAULT NOW(),
    actualizado_en TIMESTAMP DEFAULT NOW()
);

-- 3. PLANTILLAS DE SECCIONES (catálogo de tipos disponibles)
CREATE TABLE IF NOT EXISTS section_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    
    -- Schema JSON que define los campos configurables
    schema JSONB NOT NULL,
    
    -- Preview (URL de imagen de ejemplo)
    preview_url TEXT,
    
    -- Categoría
    categoria VARCHAR(50), -- 'hero', 'content', 'cta', 'media', 'form'
    
    -- Timestamps
    creado_en TIMESTAMP DEFAULT NOW()
);

-- 4. ÍNDICES PARA PERFORMANCE
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_activa ON pages(activa);
CREATE INDEX idx_page_sections_page_id ON page_sections(page_id);
CREATE INDEX idx_page_sections_orden ON page_sections(page_id, orden);

-- =====================================================
-- INSERTAR PLANTILLAS DE SECCIONES PREDEFINIDAS
-- =====================================================

-- Hero Section
INSERT INTO section_templates (nombre, tipo, descripcion, categoria, schema) VALUES
('Hero Principal', 'hero', 'Sección de bienvenida con imagen de fondo, título y CTA', 'hero', '{
  "fields": [
    {"name": "titulo", "type": "text", "label": "Título Principal", "required": true},
    {"name": "subtitulo", "type": "text", "label": "Subtítulo"},
    {"name": "descripcion", "type": "textarea", "label": "Descripción"},
    {"name": "imagen_fondo", "type": "image", "label": "Imagen de Fondo"},
    {"name": "cta_texto", "type": "text", "label": "Texto del Botón"},
    {"name": "cta_url", "type": "text", "label": "URL del Botón"},
    {"name": "altura", "type": "select", "label": "Altura", "options": ["small", "medium", "large", "fullscreen"]}
  ]
}');

-- Card Grid
INSERT INTO section_templates (nombre, tipo, descripcion, categoria, schema) VALUES
('Tarjetas en Grilla', 'card-grid', 'Cuadrícula de tarjetas para servicios o productos', 'content', '{
  "fields": [
    {"name": "titulo_seccion", "type": "text", "label": "Título de la Sección"},
    {"name": "columnas", "type": "select", "label": "Número de Columnas", "options": ["2", "3", "4"]},
    {"name": "tarjetas", "type": "repeater", "label": "Tarjetas", "fields": [
      {"name": "titulo", "type": "text", "label": "Título"},
      {"name": "descripcion", "type": "textarea", "label": "Descripción"},
      {"name": "imagen", "type": "image", "label": "Imagen"},
      {"name": "icono", "type": "text", "label": "Icono (lucide-react)"},
      {"name": "link", "type": "text", "label": "Enlace"}
    ]}
  ]
}');

-- Text + Image
INSERT INTO section_templates (nombre, tipo, descripcion, categoria, schema) VALUES
('Texto con Imagen', 'text-image', 'Contenido de texto con imagen al lado', 'content', '{
  "fields": [
    {"name": "titulo", "type": "text", "label": "Título"},
    {"name": "texto", "type": "rich-text", "label": "Contenido"},
    {"name": "imagen", "type": "image", "label": "Imagen"},
    {"name": "posicion_imagen", "type": "select", "label": "Posición de Imagen", "options": ["left", "right"]},
    {"name": "fondo", "type": "color", "label": "Color de Fondo"}
  ]
}');

-- CTA Section
INSERT INTO section_templates (nombre, tipo, descripcion, categoria, schema) VALUES
('Llamada a la Acción', 'cta', 'Sección destacada para conversión', 'cta', '{
  "fields": [
    {"name": "titulo", "type": "text", "label": "Título", "required": true},
    {"name": "descripcion", "type": "textarea", "label": "Descripción"},
    {"name": "boton_texto", "type": "text", "label": "Texto del Botón"},
    {"name": "boton_url", "type": "text", "label": "URL del Botón"},
    {"name": "fondo_color", "type": "color", "label": "Color de Fondo"},
    {"name": "imagen_fondo", "type": "image", "label": "Imagen de Fondo"}
  ]
}');

-- Gallery
INSERT INTO section_templates (nombre, tipo, descripcion, categoria, schema) VALUES
('Galería de Imágenes', 'gallery', 'Galería responsive de imágenes', 'media', '{
  "fields": [
    {"name": "titulo", "type": "text", "label": "Título de la Galería"},
    {"name": "layout", "type": "select", "label": "Diseño", "options": ["grid", "masonry", "carousel"]},
    {"name": "imagenes", "type": "image-gallery", "label": "Imágenes", "multiple": true}
  ]
}');

-- =====================================================
-- EJEMPLO: CREAR PÁGINA DE "QUIENES SOMOS"
-- =====================================================

-- Crear la página
INSERT INTO pages (slug, titulo, descripcion, meta_title, meta_description, activa, publicada)
VALUES (
    'quienes-somos',
    'Quiénes Somos',
    'Conoce la historia de City Soccer',
    'Quiénes Somos - City Soccer',
    'Descubre la historia y valores de City Soccer, el mejor centro deportivo de Chile',
    true,
    true
);

-- Agregar secciones a la página (ejemplo con IDs de plantillas)
-- Nota: En producción, esto se hará desde el dashboard

-- =====================================================
-- RLS (Row Level Security)
-- =====================================================

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_templates ENABLE ROW LEVEL SECURITY;

-- Políticas para lectura pública
CREATE POLICY "Pages son públicas" ON pages FOR SELECT USING (activa = true AND publicada = true);
CREATE POLICY "Sections son públicas" ON page_sections FOR SELECT USING (activa = true);
CREATE POLICY "Templates son públicos" ON section_templates FOR SELECT USING (true);

-- Políticas para admin (requiere autenticación)
-- Nota: Ajustar según tu sistema de autenticación

-- =====================================================
-- FUNCIONES ÚTILES
-- =====================================================

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar timestamps
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_sections_updated_at BEFORE UPDATE ON page_sections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- CONSULTAS ÚTILES
-- =====================================================

-- Ver todas las páginas con número de secciones
-- SELECT p.*, COUNT(ps.id) as num_secciones
-- FROM pages p
-- LEFT JOIN page_sections ps ON p.id = ps.page_id
-- GROUP BY p.id
-- ORDER BY p.creado_en DESC;

-- Ver una página completa con todas sus secciones
-- SELECT 
--     p.titulo as pagina,
--     ps.tipo_seccion,
--     ps.orden,
--     ps.configuracion
-- FROM pages p
-- LEFT JOIN page_sections ps ON p.id = ps.page_id
-- WHERE p.slug = 'quienes-somos'
-- ORDER BY ps.orden;
