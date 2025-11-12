import HeroSection from './HeroSection';
import CardGridSection from './CardGridSection';
import TextImageSection from './TextImageSection';
import CTASection from './CTASection';
import GallerySection from './GallerySection';

const sectionComponents = {
  'hero': HeroSection,
  'card-grid': CardGridSection,
  'text-image': TextImageSection,
  'cta': CTASection,
  'gallery': GallerySection,
};

const SectionRenderer = ({ section }) => {
  const SectionComponent = sectionComponents[section.tipo_seccion];

  if (!SectionComponent) {
    return (
      <div className="bg-red-900/20 border border-red-700 p-8 rounded-lg text-center">
        <p className="text-red-300">
          Tipo de sección desconocido: <strong>{section.tipo_seccion}</strong>
        </p>
      </div>
    );
  }

  if (!section.activa) {
    return null; // No renderizar secciones inactivas
  }

  return (
    <SectionComponent 
      config={section.configuracion} 
      styles={section.estilos_custom}
      sectionId={section.id}
    />
  );
};

export default SectionRenderer;
