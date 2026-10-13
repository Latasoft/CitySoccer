'use client';

import { useEffect } from 'react';
import { useContent } from '@/contexts/ContentContext';
import localStorageService from '@/lib/localStorageService';
import Hero from '@/components/Hero';
import CardCarousel from '@/components/CardCarousel';
import QuienessomosComponent from '@/components/QuienessomosComponent';
import AcademiaFutbolSeccion from '@/components/AcademiaFutbolSeccion';
import ClasesFutbolSeccion from '@/components/ClasesFutbolSeccion';
import AcademiaPickleballSeccion from '@/components/AcademiaPickleballSeccion';
import ClasesPickleballSeccion from '@/components/ClasesPickleballSeccion';
import SummerCampSeccion from '@/components/SummerCampSeccion';

export default function HomePageClient() {
  const { preloadPages } = useContent();
  
  // Precargar contenido y suscribir a sincronización automática
  useEffect(() => {
    // Precargar contenido inicial
    preloadPages(['home', 'footer']);
    
    // Suscribir páginas a sincronización automática con localStorage
    localStorageService.subscribe('home');
    localStorageService.subscribe('footer');
    
    // Log de estadísticas en desarrollo
    if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
      setTimeout(() => {
        const stats = localStorageService.getStats();
        console.log('📊 [HomePage] LocalStorage Stats:', stats);
      }, 2000);
    }
    
    // Cleanup al desmontar
    return () => {
      localStorageService.unsubscribe('home');
      localStorageService.unsubscribe('footer');
    };
  }, [preloadPages]);
  
  return (
    <main className="min-h-screen w-full">
      <div className="min-h-screen w-full bg-[#3B3F44]">
        <Hero />
        <CardCarousel />
        <section id="quienes-somos">
          <QuienessomosComponent />
        </section>
        <section id="academia-futbol">
          <AcademiaFutbolSeccion />
        </section>
        <section id="clases-futbol">
          <ClasesFutbolSeccion />
        </section>
        <section id="academia-pickleball">
          <AcademiaPickleballSeccion />
        </section>
        <section id="clases-pickleball">
          <ClasesPickleballSeccion />
        </section>
        <section id="summer-camp">
          <SummerCampSeccion />
        </section>
      </div>
    </main>
  );
}
