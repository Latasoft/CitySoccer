"use client";
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
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
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
          src="./Logo2.png"
          alt="City Soccer Logo"
          className="mx-auto mb-8 w-150 h-150 object-contain"
          style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}
        />

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            className="text-2xl px-16 py-6 text-black rounded-lg font-black flex items-center gap-2 shadow-lg hover:opacity-90 transition-all duration-200 uppercase tracking-wider"
            style={{ 
              backgroundColor: "#FFED00",
              fontFamily: "Arial Black, Arial, sans-serif"
            }}
          >
            RESERVA HOY
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
