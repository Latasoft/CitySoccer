'use client';
import { useEffect, useRef } from "react";

const Hero = () => {
  const bgRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        const scrollY = window.scrollY;
        bgRef.current.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{ backgroundImage: `url(/imgPrincipal.jpeg)` }}
      >
        <div className="absolute inset-0 bg-brand-dark-gray/50"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        {/* Logo/Image */}
        <img
          src="./logo.png"
          alt="City Soccer Logo"
          className="mx-auto mb-8 w-52 h-52 object-contain"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
        />


        
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90">
          Fútbol y Pickleball en las mejores instalaciones deportivas. Reserva online y vive la experiencia City Soccer.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button className="text-lg px-8 py-4 text-black rounded font-bold flex items-center gap-2 shadow-md hover:opacity-90 transition" style={{ backgroundColor: '#FFD700' }}>
            {/* Calendar Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Reservar Ahora
          </button>
          <button className="text-lg px-8 py-4 text-white rounded font-bold flex items-center gap-2 shadow-md hover:opacity-90 transition border-2" 
                  style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}>
            Ver Canchas
          </button>
        </div>


      </div>
    </section>
  );
};

export default Hero;