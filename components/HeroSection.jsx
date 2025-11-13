import React from 'react';
import EditableImage from './EditableImage';
import EditableContent from './EditableContent';

const HeroSection = ({ 
  title = { first: "", second: "" },
  titleColors = { first: "text-green-400", second: "text-yellow-400" },
  subtitle = "",
  description = "",
  buttonText = "Más Información",
  buttonLink = "#",
  buttonAction,
  images = { img1: "", img2: "", img3: "" },
  backgroundGradient = "bg-gradient-to-br from-gray-900 to-black",
  imageCategory = "summer-camp",
  pageKey = "default"
}) => {
  
  const handleButtonClick = () => {
    // Si hay una función personalizada, usarla en lugar de la navegación
    if (buttonAction) {
      buttonAction();
      return;
    }
    
    if (buttonLink.startsWith('/')) {
      // Navegación interna (usar tu router)
      window.location.href = buttonLink;
    } else if (buttonLink.startsWith('#')) {
      // Scroll a sección
      const element = document.querySelector(buttonLink);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // URL externa
      window.open(buttonLink, '_blank');
    }
  };

  return (
    <section className={`${backgroundGradient} min-h-screen flex items-center pb-12 `}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Texto del Hero */}
          <div className="flex flex-col gap-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-white uppercase">
              <EditableContent 
                pageKey={pageKey}
                fieldKey="hero_title_first"
                fieldType="text"
                defaultValue={title?.first || ""}
                as="span"
                className={titleColors.first}
              />
              {' '}
              <EditableContent 
                pageKey={pageKey}
                fieldKey="hero_title_second"
                fieldType="text"
                defaultValue={title?.second || ""}
                as="span"
                className={titleColors.second}
              />
              {subtitle && subtitle.trim() && (
                <>
                  <br />
                  <EditableContent 
                    pageKey={pageKey}
                    fieldKey="hero_subtitle"
                    fieldType="text"
                    defaultValue={subtitle}
                    as="span"
                    className="text-white"
                  />
                </>
              )}
            </h1>
            
            <div className="flex flex-col gap-6 text-gray-300">
              <EditableContent 
                pageKey={pageKey}
                fieldKey="hero_description"
                fieldType="textarea"
                defaultValue={description}
                as="p"
                className="text-xl leading-relaxed"
              />
            </div>
            
            <button 
              onClick={handleButtonClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-full text-base uppercase tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/40 self-start"
            >
              <EditableContent 
                pageKey={pageKey}
                fieldKey="hero_button_text"
                fieldType="text"
                defaultValue={buttonText}
                as="span"
              />
            </button>
          </div>
          
          {/* Grid de 3 Imágenes - Sin gaps para móvil */}
          <div className="flex justify-center items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-1 lg:gap-2 w-full max-w-2xl">
              {/* Primera imagen - ocupa toda la fila superior */}
              <EditableImage
                src={`/uploads/images/${imageCategory}-1.jpg`}
                alt="Experiencia 1" 
                categoria={imageCategory}
                pageKey={pageKey}
                fieldKey={`${imageCategory}_image_1`}
                className="col-span-1 sm:col-span-2 w-full h-[250px] sm:h-[280px] lg:h-[300px] object-cover rounded-t-lg sm:rounded-t-xl rounded-b-none sm:rounded-b-lg shadow-lg sm:shadow-2xl shadow-black/50 transition-transform duration-300 hover:scale-105 hover:shadow-3xl"
              />
              {/* Segunda imagen */}
              <EditableImage
                src={`/uploads/images/${imageCategory}-2.jpg`}
                alt="Experiencia 2" 
                categoria={imageCategory}
                pageKey={pageKey}
                fieldKey={`${imageCategory}_image_2`}
                className="w-full h-[200px] sm:h-[220px] lg:h-[250px] object-cover rounded-bl-lg sm:rounded-l-xl rounded-br-none sm:rounded-br-none shadow-lg sm:shadow-2xl shadow-black/50 transition-transform duration-300 hover:scale-105 hover:shadow-3xl"
              />
              {/* Tercera imagen */}
              <EditableImage
                src={`/uploads/images/${imageCategory}-3.jpg`}
                alt="Experiencia 3" 
                categoria={imageCategory}
                pageKey={pageKey}
                fieldKey={`${imageCategory}_image_3`}
                className="w-full h-[200px] sm:h-[220px] lg:h-[250px] object-cover rounded-br-lg sm:rounded-r-xl rounded-bl-none sm:rounded-bl-none shadow-lg sm:shadow-2xl shadow-black/50 transition-transform duration-300 hover:scale-105 hover:shadow-3xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;