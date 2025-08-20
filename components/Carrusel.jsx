'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

// Import images - usar rutas relativas desde el componente
import Cancha1 from '../public/Cancha1.jpeg';
import Cancha3 from '../public/Cancha3.jpeg';
import Entrenamiento from '../public/Entrenamiento.jpeg';
import Entrenamiento2 from '../public/Entrenamiento2.jpeg';
import Entrenamiento3 from '../public/Entrenamiento3.jpeg';
import Entrenamiento4 from '../public/Entrenamiento4.jpeg';
import Entrenamiento5 from '../public/Entrenamiento5.jpeg';
import Birthday from '../public/Birthday.jpeg';
import Birthday2 from '../public/Birthday2.jpeg';

const citySoccerImages = [
  Cancha1,
  Cancha3,
  Entrenamiento,
  Entrenamiento2,
  Entrenamiento3,
  Entrenamiento4,
  Entrenamiento5,
  Birthday,
  Birthday2
];

const Carrusel = ({
  titulo = 'Galería City Soccer',
  imagenes = citySoccerImages
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const galleryRef = useRef(null);
  const intervalRef = useRef(null);

  const startInterval = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imagenes.length);
    }, 4000);
  }, []);

  const clearIntervalTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  useEffect(() => {
    startInterval();
    return () => clearIntervalTimer();
  }, [startInterval, clearIntervalTimer]);

  const handleNavClick = (index) => {
    setCurrentIndex(index);
    clearIntervalTimer();
    startInterval();
  };

  const [listaPosicion, setListaPosicion] = useState(0);

  useEffect(() => {
    const calculatePosition = () => {
      if (typeof window !== "undefined") {
        const isMedScreen = window.innerWidth >= 640;
        const position = isMedScreen ? currentIndex * -392 : currentIndex * -296;
        setListaPosicion(position);
      }
    };

    calculatePosition();

    if (typeof window !== "undefined") {
      window.addEventListener("resize", calculatePosition);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", calculatePosition);
      }
    };
  }, [currentIndex]);

  return (
    <section className="relative bg-black">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.05)_2rem,rgba(0,0,0,0.02)_calc(100%_-_2rem),rgba(0,0,0,0.15)_100%)]" />
      <div className="max-w-5xl w-full mx-auto relative">
        <h2 className="text-center font-bold text-[#fff] text-4xl mx-8 mb-6 pt-12">{titulo}</h2>
        <hr className="block mx-auto h-1 max-w-20 border-none bg-[#57AA32] mb-8" />
      </div>

      <div className="relative max-w-5xl w-full mx-auto px-4 rounded-md h-auto">
        <div className="relative w-full overflow-y-visible overflow-x-hidden h-[22rem] sm:h-[28rem]">
          {!!imagenes.length && (
            <div
              ref={galleryRef}
              style={{ translate: `${listaPosicion}px 0` }}
              className="absolute left-[calc(50%_-_156px)] sm:left-[calc(50%_-_202px)] top-5 w-full whitespace-nowrap no-scrollbar transition-all ease-in-out duration-1000 px-2"
            >
              {imagenes.map((item, index) => (
                <span
                  className={`${
                    index === currentIndex
                      ? `scale-105 sm:scale-110 z-50 shadow-black/70`
                      : `shadow-black/40`
                  } aspect-1 inline-block relative h-72 sm:h-96 mx-1 shadow-lg rounded-sm overflow-hidden transition-all ease-in-out duration-700`}
                  key={index}
                >
                  <Image
                    className="w-full h-full object-center object-cover"
                    src={item}
                    alt={`City Soccer ${index + 1}`}
                    width={392}
                    height={392}
                    sizes="(max-width: 640px) 296px, 392px"
                  />
                  <div
                    className={`absolute inset-0 backdrop-grayscale transition-all ease-in-out duration-700 ${
                      index === currentIndex ? `opacity-0` : `opacity-80 bg-white/40`
                    }`}
                  />
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl w-full mx-auto px-4 text-center pt-5 pb-10 relative">
        {!!imagenes.length && (
          <div>
            {imagenes.map((_, index) => (
              <span
                key={index}
                onClick={() => handleNavClick(index)}
                className={`${
                  index === currentIndex
                    ? 'bg-[#57AA32] w-12 sm:w-16'
                    : 'bg-black bg-opacity-20 w-3 sm:w-4'
                } m-1.5 sm:m-2 inline-block rounded-full h-3 sm:h-4 cursor-pointer transition-all ease-in-out duration-300`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Carrusel;