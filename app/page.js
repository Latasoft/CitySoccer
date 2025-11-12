import { pagesService, pageSectionsService } from '@/lib/adminService';
import SectionRenderer from '@/components/sections/SectionRenderer';
import { notFound } from 'next/navigation';

export const revalidate = 3600; // Revalidar cada hora

export default async function HomePage() {
  // Intentar cargar desde CMS
  const { data: page } = await pagesService.getBySlug('home');
  
  // Si existe en CMS y está publicada, renderizar desde CMS
  if (page && page.publicada) {
    const { data: sections } = await pageSectionsService.getByPageId(page.id);
    const activeSections = (sections || [])
      .filter(s => s.activa)
      .sort((a, b) => a.orden - b.orden);

    return (
      <main className="min-h-screen w-full">
        {activeSections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </main>
    );
  }

  // Fallback: Renderizar versión estática si no existe en CMS
  const CardCarousel = (await import('@/components/CardCarousel')).default;
  const Hero = (await import('@/components/Hero')).default;

  return (
    <main className="min-h-screen w-full">
      <div className="min-h-screen w-full bg-[#3B3F44]">
        <Hero />
        <CardCarousel />
      </div>
    </main>
  );
}
