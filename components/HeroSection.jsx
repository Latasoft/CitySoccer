import React from 'react';

const HeroSection = ({ 
  title,
  titleColors = { first: "text-green-400", second: "text-yellow-400" },
  subtitle,
  description,
  buttonText = "Más Información",
  buttonLink = "#",
  images = { img1, img2 },
  backgroundGradient
}) => {
  
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
    <section className={`${backgroundGradient} min-h-screen flex items-center pb-12`}>
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
          
          {/* Grid de Imágenes */}
          <div className="flex justify-center items-center">
            <div className="grid grid-cols-2 gap-12 w-full max-w-2xl">
              <img 
                src={images.img1} 
                alt="Experiencia 1" 
                className="w-full h-[500px] object-cover rounded-xl shadow-2xl shadow-black/50 transition-transform duration-300 hover:scale-105 hover:shadow-3xl" 
              />
              <img 
                src={images.img2} 
                alt="Experiencia 2" 
                className="w-full h-[500px] object-cover rounded-xl shadow-2xl shadow-black/50 transition-transform duration-300 hover:scale-105 hover:shadow-3xl" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;