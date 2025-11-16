"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDynamicImages } from '@/lib/dynamicImageService';
import localStorageService from '@/lib/localStorageService';
import EditableImage from './EditableImage';
import EditableContent from './EditableContent';
import CardBackgroundImage from './CardBackgroundImage';

const CardCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Definir cards con valores por defecto (SIEMPRE se muestran)
  const defaultCards = [
    {
      id: 1,
      titleKey: 'card1_title',
      descKey: 'card1_description',
      imageKey: 'card1_image',
      ctaKey: 'card1_cta_text',
      ctaLink: "/arrendarcancha",
      defaultTitle: "Cargando...",
      defaultDesc: "",
      defaultImage: null, // Sin imagen: mostrará placeholder gris
      defaultCta: "..."
    },
    {
      id: 2,
      titleKey: 'card2_title',
      descKey: 'card2_description',
      imageKey: 'card2_image',
      ctaKey: 'card2_cta_text',
      ctaLink: "/arrendarcancha",
      defaultTitle: "Cargando...",
      defaultDesc: "",
      defaultImage: null,
      defaultCta: "..."
    },
    {
      id: 3,
      titleKey: 'card3_title',
      descKey: 'card3_description',
      imageKey: 'card3_image',
      ctaKey: 'card3_cta_text',
      ctaLink: "/clasesparticularesfutbol",
      defaultTitle: "Cargando...",
      defaultDesc: "",
      defaultImage: null,
      defaultCta: "..."
    },
    {
      id: 4,
      titleKey: 'card4_title',
      descKey: 'card4_description',
      imageKey: 'card4_image',
      ctaKey: 'card4_cta_text',
      ctaLink: "/academiadefutbol",
      defaultTitle: "Cargando...",
      defaultDesc: "",
      defaultImage: null,
      defaultCta: "..."
    },
    {
      id: 5,
      titleKey: 'card5_title',
      descKey: 'card5_description',
      imageKey: 'card5_image',
      ctaKey: 'card5_cta_text',
      ctaLink: "/eventos",
      defaultTitle: "Cargando...",
      defaultDesc: "",
      defaultImage: null,
      defaultCta: "..."
    },
    {
      id: 6,
      titleKey: 'card6_title',
      descKey: 'card6_description',
      imageKey: 'card6_image',
      ctaKey: 'card6_cta_text',
      ctaLink: "/summer-camp",
      defaultTitle: "Cargando...",
      defaultDesc: "",
      defaultImage: null,
      defaultCta: "..."
    }
  ];
  
  const [cardsData, setCardsData] = useState(defaultCards);
  
  // Cargar imágenes dinámicas de canchas desde admin
  const { images: imagenesCanchas, loading: loadingCanchas } = useDynamicImages('canchas');
  const { images: imagenesEventos, loading: loadingEventos } = useDynamicImages('eventos');

  // Cargar datos de las tarjetas desde localStorage service
  useEffect(() => {
    const loadCardsData = async () => {
      try {
        // Timeout de seguridad: si no carga en 3s, mantener defaults
        const timeoutId = setTimeout(() => {
          if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
            console.warn('⚠️ Timeout cargando contenido de cards, usando valores por defecto');
          }
        }, 3000);
        
        const { data } = await localStorageService.getPageContent('home');
        
        clearTimeout(timeoutId);
        
        if (data) {
          // Cards ya tienen valores por defecto, solo confirmamos que se cargaron
          // Los EditableContent dentro usarán los valores de 'data' automáticamente
          if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
            console.log('✅ Contenido de cards cargado desde localStorage');
          }
        }
      } catch (error) {
        console.error('⚠️ Error cargando datos de tarjetas, usando valores por defecto:', error);
      }
    };
    
    loadCardsData();
    
    // Escuchar actualizaciones de sincronización
    const handleSync = (event) => {
      const { pageKey, changes } = event.detail;
      if (pageKey === 'home') {
        const cardChanges = changes?.filter(c => c.field.startsWith('card'));
        if (cardChanges && cardChanges.length > 0) {
          console.log('🎴 [CardCarousel] Cards actualizados:', cardChanges.length, 'cambios');
          // Forzar re-render (los EditableContent se actualizarán automáticamente)
          setCardsData([...defaultCards]);
        }
      }
    };
    
    window.addEventListener('localstorage-sync', handleSync);
    
    return () => {
      window.removeEventListener('localstorage-sync', handleSync);
    };
  }, []);

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
          <EditableContent 
            pageKey="home"
            fieldKey="carousel_title"
            fieldType="text"
            defaultValue="Descubre City Soccer"
            as="h2"
            className="text-4xl md:text-6xl font-bold text-white mb-4"
          />
          
          <EditableContent 
            pageKey="home"
            fieldKey="carousel_subtitle"
            fieldType="textarea"
            defaultValue="Experiencias deportivas únicas que transforman tu forma de jugar y vivir el deporte"
            as="p"
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          />
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
                    {/* Background Image Editable */}
                    <CardBackgroundImage
                      pageKey="home"
                      fieldKey={card.imageKey}
                      defaultValue={card.defaultImage}
                      className="absolute inset-0 bg-cover bg-center"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/50" />

                    {/* Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                      <div>
                        <EditableContent
                          pageKey="home"
                          fieldKey={card.titleKey}
                          fieldType="text"
                          defaultValue={card.defaultTitle}
                          as="h3"
                          className="text-2xl font-bold mb-4"
                        />
                        <EditableContent
                          pageKey="home"
                          fieldKey={card.descKey}
                          fieldType="textarea"
                          defaultValue={card.defaultDesc}
                          as="p"
                          className="text-sm opacity-90"
                        />
                      </div>

                      <Link href={card.ctaLink}>
                        <button className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-xl font-bold text-lg tracking-wide uppercase shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-green-300">
                          <EditableContent
                            pageKey="home"
                            fieldKey={card.ctaKey}
                            fieldType="text"
                            defaultValue={card.defaultCta}
                            as="span"
                          />
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