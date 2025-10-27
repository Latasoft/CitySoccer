import React from 'react';
import EditableImage from './EditableImage';
import { useDynamicImages } from '@/lib/dynamicImageService';

const HeroSection = ({ 
  title,
  titleColors = { first: "text-green-400", second: "text-yellow-400" },
  subtitle,
  description,
  buttonText = "Más Información",
  buttonLink = "#",
  images = { img1, img2, img3 },
  backgroundGradient,
  imageCategory = "summer-camp" // Nueva prop para categoría de imágenes
}) => {
  
  // Cargar imágenes dinámicas según la categoría
  const { images: dynamicImages } = useDynamicImages(imageCategory);
  
  // Función helper para obtener imagen dinámica o fallback
  const getImageUrl = (index, fallback) => {
    if (dynamicImages[index]) {
      return dynamicImages[index].url;
    }
    return fallback;
  };
  
  const handleButtonClick = () => {
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
              <span className={titleColors.first}>{title.first} </span>
              <span className={titleColors.second}>{title.second}</span>
              {subtitle && (
                <>
                  <br />
                  {subtitle}
                </>
              )}
            </h1>
            
            <div className="flex flex-col gap-6 text-gray-300">
              <p className="text-xl leading-relaxed">
                {description}
              </p>
            </div>
            
            <button 
              onClick={handleButtonClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-full text-base uppercase tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/40 self-start"
            >
              {buttonText}
            </button>
          </div>
          
          {/* Grid de 3 Imágenes */}
          <div className="flex justify-center items-center">
            <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
              {/* Primera imagen - ocupa 2 columnas en la parte superior */}
              <EditableImage
                src={getImageUrl(0, images.img1)}
                alt="Experiencia 1" 
                categoria={imageCategory}
                className="col-span-2 w-full h-[300px] object-cover rounded-xl shadow-2xl shadow-black/50 transition-transform duration-300 hover:scale-105 hover:shadow-3xl"
                fallbackSrc={images.img1}
              />
              {/* Segunda y tercera imagen - lado a lado en la parte inferior */}
              <EditableImage
                src={getImageUrl(1, images.img2)}
                alt="Experiencia 2" 
                categoria={imageCategory}
                className="w-full h-[250px] object-cover rounded-xl shadow-2xl shadow-black/50 transition-transform duration-300 hover:scale-105 hover:shadow-3xl"
                fallbackSrc={images.img2}
              />
              <EditableImage
                src={getImageUrl(2, images.img3)}
                alt="Experiencia 3" 
                categoria={imageCategory}
                className="w-full h-[250px] object-cover rounded-xl shadow-2xl shadow-black/50 transition-transform duration-300 hover:scale-105 hover:shadow-3xl"
                fallbackSrc={images.img3}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;