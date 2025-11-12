'use client';

import { useState, useEffect } from 'react';
import SectionRenderer from '@/components/sections/SectionRenderer';
import { pageSectionsService } from '@/lib/adminService';

export default function HomePageClient({ initialPage, initialSections }) {
  const [sections, setSections] = useState(initialSections);

  // Si hay secciones del CMS, renderizarlas
  if (sections && sections.length > 0) {
    return (
      <main className="min-h-screen w-full">
        {sections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </main>
    );
  }

  // Fallback: Componentes estáticos importados dinámicamente
  const FallbackContent = () => {
    const [CardCarousel, setCardCarousel] = useState(null);
    const [Hero, setHero] = useState(null);

    useEffect(() => {
      const loadComponents = async () => {
        const CardCarouselModule = await import('@/components/CardCarousel');
        const HeroModule = await import('@/components/Hero');
        setCardCarousel(() => CardCarouselModule.default);
        setHero(() => HeroModule.default);
      };
      loadComponents();
    }, []);

    if (!Hero || !CardCarousel) {
      return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    }

    return (
      <div className="min-h-screen w-full bg-[#3B3F44]">
        <Hero />
        <CardCarousel />
      </div>
    );
  };

  return (
    <main className="min-h-screen w-full">
      <FallbackContent />
    </main>
  );
}
