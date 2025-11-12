'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SectionRenderer from '@/components/sections/SectionRenderer';

// Importar componentes estáticos con dynamic import
const Hero = dynamic(() => import('@/components/Hero'), { ssr: false });
const CardCarousel = dynamic(() => import('@/components/CardCarousel'), { ssr: false });

export default function HomePageClient({ initialPage, initialSections }) {
  // Si hay secciones del CMS, renderizarlas
  if (initialSections && initialSections.length > 0) {
    return (
      <main className="min-h-screen w-full">
        {initialSections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </main>
    );
  }

  // Fallback: Componentes estáticos cuando no hay contenido en CMS
  return (
    <main className="min-h-screen w-full">
      <div className="min-h-screen w-full bg-[#3B3F44]">
        <Hero />
        <CardCarousel />
      </div>
    </main>
  );
}
