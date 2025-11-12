import { pagesService, pageSectionsService } from '@/lib/adminService';
import HomePageClient from '@/components/HomePageClient';

export const revalidate = 3600; // Revalidar cada hora

export default async function HomePage() {
  let sections = [];
  let page = null;
  
  try {
    // Intentar cargar desde CMS
    const pageResult = await pagesService.getBySlug('home');
    
    // Si existe en CMS y está publicada, cargar secciones
    if (pageResult.data && pageResult.data.publicada) {
      page = pageResult.data;
      const sectionsResult = await pageSectionsService.getByPageId(page.id);
      sections = (sectionsResult.data || [])
        .filter(s => s.activa)
        .sort((a, b) => a.orden - b.orden);
    }
  } catch (error) {
    // Si hay error (ej: página no existe), continuar con fallback
    console.log('[HOME] Página no encontrada en CMS, usando versión estática');
  }

  // Pasar todo al componente cliente (puede ser vacío si no hay contenido en CMS)
  return <HomePageClient initialPage={page} initialSections={sections} />;
}
