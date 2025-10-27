"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDynamicImages } from '@/lib/dynamicImageService';
import EditableImage from './EditableImage';

const CardCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Cargar imágenes dinámicas de canchas desde admin
  const { images: imagenesCanchas, loading: loadingCanchas } = useDynamicImages('canchas');
  const { images: imagenesEventos, loading: loadingEventos } = useDynamicImages('eventos');

  // Función helper para obtener imagen dinámica o fallback
  const getImageUrl = (categoria, fallback, index = 0) => {
    if (categoria === 'canchas' && imagenesCanchas.length > index) {
      return imagenesCanchas[index].url;
    }
    if (categoria === 'eventos' && imagenesEventos.length > index) {
      return imagenesEventos[index].url;
    }
    return fallback;
  };

  const cardsData = [
    {
      id: 1,
      title: "Arrienda Cancha Fútbol",
      description: "Canchas profesionales con césped sintético de última generación. Reserva online las 24 horas.",
      image: getImageUrl('canchas', '/Cancha1.jpeg', 0),
      ctaText: "RESERVAR FÚTBOL",
      ctaLink: "/arrendarcancha/futbol7"
    },
    {
      id: 2,
      title: "Arrienda Cancha Pickleball",
      description: "Canchas de Pickleball con superficies profesionales. El deporte que está revolucionando el mundo.",
      image: getImageUrl('canchas', '/Pickleball2.jpeg', 1),
      ctaText: "RESERVAR PICKLEBALL",
      ctaLink: "/arrendarcancha/pickleball"
    },
    {
      id: 3,
      title: "Clases Particulares",
      description: "Entrenamiento personalizado con profesionales certificados. Mejora tu técnica individual.",
      image: getImageUrl('eventos', '/Entrenamiento4.jpeg', 0),
      ctaText: "VER CLASES",
      ctaLink: "/clasesparticularesfutbol"
    },
    {
      id: 4,
      title: "Academia Deportiva",
      description: "Programas de formación deportiva para niños y jóvenes. Desarrollo técnico y valores.",
      image: getImageUrl('eventos', '/Entrenamiento2.jpeg', 1),
      ctaText: "CONOCER MÁS",
      ctaLink: "/academiadefutbol"
    },
    {
      id: 5,
      title: "Summer Camp 2026",
      description: "La experiencia deportiva más completa del verano. Diversión y aprendizaje garantizados.",
      image: getImageUrl('eventos', '/Entrenamiento5.jpeg', 2),
      ctaText: "INSCRIBIR",
      ctaLink: "/summer-camp"
    },
    {
      id: 6,
      title: "Quiénes Somos",
      description: "Más de 10 años creando experiencias deportivas únicas. Conoce nuestra historia y valores.",
      image: "/imgCitySoccer.jpeg",
      ctaText: "NUESTRA HISTORIA",
      ctaLink: "/quienessomos"
    }
  ];

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Maximum slides (4 positions for desktop: 0,1,2,3 - 6 positions for mobile: 0,1,2,3,4,5)
  const maxSlides = isMobile ? cardsData.length - 1 : 3;
  
  const nextSlide = () => {
    setCurrentIndex(prev => prev < maxSlides ? prev + 1 : prev);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : prev);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Descubre City Soccer
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experiencias deportivas únicas que transforman tu forma de jugar y vivir el deporte
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full p-3 transition-colors ${
              currentIndex === 0 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-white text-black hover:bg-gray-200'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex === maxSlides}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full p-3 transition-colors ${
              currentIndex === maxSlides 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-white text-black hover:bg-gray-200'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / (isMobile ? 1 : 3))}%)`
              }}
            >
              {cardsData.map((card) => (
                <div
                  key={card.id}
                  className={`flex-none ${isMobile ? 'w-full' : 'w-1/3'} px-3`}
                >
                  <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${card.image})` }}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50" />

                    {/* Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                      <div>
                        <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
                        <p className="text-sm opacity-90">{card.description}</p>
                      </div>

                      <Link href={card.ctaLink}>
                        <button className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-xl font-bold text-lg tracking-wide uppercase shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-green-300">
                          {card.ctaText}
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Simple Dots Indicator - Only show dots for available positions */}
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: maxSlides + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-green-600' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardCarousel;