'use client';

import { useEffect } from 'react';
import { useContent } from '@/contexts/ContentContext';
import Hero from '@/components/Hero';
import CardCarousel from '@/components/CardCarousel';

export default function HomePageClient() {
  const { preloadPages } = useContent();
  
  // Precargar contenido de la página al montar
  useEffect(() => {
    preloadPages(['home', 'footer']);
  }, [preloadPages]);
  
  return (
    <main className="min-h-screen w-full">
      <div className="min-h-screen w-full bg-[#3B3F44]">
        <Hero />
        <CardCarousel />
      </div>
    </main>
  );
}
