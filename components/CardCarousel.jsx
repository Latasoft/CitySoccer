"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const CardCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const cardsData = [
    {
      id: 1,
      title: "Arrienda Cancha Fútbol",
      subtitle: "Fútbol 7 y 9 disponibles",
      description: "Canchas profesionales con césped sintético de última generación. Reserva online las 24 horas.",
      image: "./Cancha1.jpeg",
      backgroundColor: "from-green-600 to-emerald-700",
      ctaText: "RESERVAR FÚTBOL",
      ctaLink: "/arrendarcancha/futbol7",
      badge: "POPULAR",
      features: ["Césped sintético", "Iluminación LED", "Vestuarios incluidos"]
    },
    {
      id: 2,
      title: "Arrienda Cancha Pickleball",
      subtitle: "Canchas premium disponibles",
      description: "Canchas de Pickleball con superficies profesionales. El deporte que está revolucionando el mundo.",
      image: "./Pickleball2.jpeg",
      backgroundColor: "from-indigo-600 to-purple-700",
      ctaText: "RESERVAR PICKLEBALL",
      ctaLink: "/arrendarcancha/pickleball",
      badge: "TRENDING",
      features: ["Superficie profesional", "Raquetas incluidas", "Todas las edades"]
    },
    {
      id: 3,
      title: "Clases Particulares",
      subtitle: "Fútbol y Pickleball",
      description: "Entrenamiento personalizado con profesionales certificados. Mejora tu técnica individual.",
      image: "./Entrenamiento4.jpeg",
      backgroundColor: "from-blue-600 to-cyan-700",
      ctaText: "VER CLASES",
      ctaLink: "/clasesparticularesfutbol",
      badge: "NUEVO",
      features: ["Entrenadores certificados", "Planes personalizados", "Todas las edades"]
    },
    {
      id: 4,
      title: "Academia Deportiva",
      subtitle: "Formación integral",
      description: "Programas de formación deportiva para niños y jóvenes. Desarrollo técnico y valores.",
      image: "./Entrenamiento2.jpeg",
      backgroundColor: "from-orange-600 to-red-600",
      ctaText: "CONOCER MÁS",
      ctaLink: "/academiadefutbol",
      badge: "DESTACADO",
      features: ["Metodología profesional", "Torneos internos", "Desarrollo integral"]
    },
    {
      id: 5,
      title: "Summer Camp 2026",
      subtitle: "Vacaciones deportivas",
      description: "La experiencia deportiva más completa del verano. Diversión y aprendizaje garantizados.",
      image: "./Entrenamiento5.jpeg",
      backgroundColor: "from-purple-600 to-pink-600",
      ctaText: "INSCRIBIR",
      ctaLink: "/summer-camp",
      badge: "¡ÚLTIMOS CUPOS!",
      features: ["Enero y Febrero", "Grupos por edades", "Todo incluido"]
    },
    {
      id: 6,
      title: "Quiénes Somos",
      subtitle: "Conoce City Soccer",
      description: "Más de 10 años creando experiencias deportivas únicas. Conoce nuestra historia y valores.",
      image: "./imgCitySoccer.jpeg",
      backgroundColor: "from-gray-700 to-gray-900",
      ctaText: "NUESTRA HISTORIA",
      ctaLink: "/quienessomos",
      badge: "NOSOTROS",
      features: ["10+ años experiencia", "Instalaciones premium", "Equipo profesional"]
    }
  ];

  // Detectar si es mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const cardsPerView = isMobile ? 1 : 3;
  // CAMBIO PRINCIPAL: Ahora maxIndex es el número total de cards - 1
  const maxIndex = cardsData.length - 1;

  const nextSlide = () => {
    setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => prev <= 0 ? maxIndex : prev - 1);
  };

  const goToSlide = (targetIndex) => {
    setCurrentIndex(targetIndex);
  };

  // Calcular el offset para centrar la carta activa
  const getTransformValue = () => {
    if (isMobile) {
      return currentIndex * 100;
    } else {
      // En desktop, ajustar para que la carta activa esté centrada
      const cardWidth = 100 / cardsPerView; // 33.33% para 3 cards
      let offset = currentIndex * cardWidth;

      // Ajustar para mantener las cartas visibles
      if (currentIndex >= cardsData.length - cardsPerView) {
        offset = (cardsData.length - cardsPerView) * cardWidth;
      }

      return offset;
    }
  };

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <section className="py-16 bg-black  relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black text-gray-100 mb-4">
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
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 backdrop-blur-sm border border-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 backdrop-blur-sm border border-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden">
            <div
              ref={carouselRef}
              className="flex transition-transform duration-500 ease-in-out gap-6"
              style={{
                transform: `translateX(-${getTransformValue()}%)`
              }}
            >
              {cardsData.map((card, index) => (
                <div
                  key={card.id}
                  className={`flex-none ${isMobile ? 'w-full' : 'w-1/3'} group ${index === currentIndex ? 'scale-105 z-10' : 'scale-100'
                    } transition-transform duration-300`}
                >
                  <div className={`relative h-[480px] md:h-[520px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${index === currentIndex ? 'ring-4 ring-green-400 ring-opacity-50' : ''
                    }`}>
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.backgroundColor} opacity-90`}></div>

                    {/* Background Image */}
                    {card.image && (
                      <div
                        className="absolute inset-0 bg-cover bg-center mix-blend-overlay"
                        style={{ backgroundImage: `url(${card.image})` }}
                      ></div>
                    )}



                    {/* Active Card Indicator */}
                    {index === currentIndex && (
                      <div className="absolute top-6 right-6 z-10">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-between text-white z-10">
                      <div>
                        <h3 className="text-3xl md:text-4xl font-black mb-3">{card.title}</h3>

                        <p className="text-base md:text-xl mb-8 opacity-80 text-center leading-relaxed">{card.description}</p>

                      </div>

                      {/* CTA Button */}
                      <Link href={card.ctaLink}>
                        <button className={`w-full py-4 px-8 rounded-xl text-lg font-bold transition-all duration-300 backdrop-blur-sm ${index === currentIndex
                            ? 'bg-white text-gray-900 hover:bg-gray-100 transform hover:scale-105 shadow-lg'
                            : 'bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 hover:border-white/50'
                          }`}>
                          {card.ctaText}
                        </button>
                      </Link>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots Indicator - 6 dots individuales */}
        <div className="flex justify-center mt-8 gap-3">
          {cardsData.map((card, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 hover:scale-110 group flex flex-col items-center ${index === currentIndex ? 'scale-110' : ''
                }`}
              title={`Ver ${card.title}`}
            >
              <div className={`w-4 h-4 rounded-full transition-all duration-300 ${index === currentIndex
                  ? 'bg-green-600 shadow-lg ring-4 ring-green-200'
                  : 'bg-gray-400 hover:bg-green-400'
                }`} />
              <span className={`text-xs mt-2 transition-all duration-300 ${index === currentIndex
                  ? 'text-green-600 font-bold opacity-100'
                  : 'text-gray-400 opacity-0 group-hover:opacity-100'
                }`}>
                {index + 1}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardCarousel;