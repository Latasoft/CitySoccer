import { pagesService, pageSectionsService } from '@/lib/adminService';
import HomePageClient from '@/components/HomePageClient';
import { notFound } from 'next/navigation';

export const revalidate = 3600; // Revalidar cada hora

export default async function HomePage() {
  // Intentar cargar desde CMS
  const { data: page } = await pagesService.getBySlug('home');
  
  let sections = [];
  
  // Si existe en CMS y está publicada, cargar secciones
  if (page && page.publicada) {
    const { data: sectionsData } = await pageSectionsService.getByPageId(page.id);
    sections = (sectionsData || [])
      .filter(s => s.activa)
      .sort((a, b) => a.orden - b.orden);
  }

  // Pasar todo al componente cliente
  return <HomePageClient initialPage={page} initialSections={sections} />;
}
