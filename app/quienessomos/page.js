import { notFound } from 'next/navigation';
import { pagesService, pageSectionsService } from '@/lib/adminService';
import SectionRenderer from '@/components/sections/SectionRenderer';

export const metadata = {
  title: 'Quiénes Somos - City Soccer',
  description: 'Descubre la historia de City Soccer, el complejo deportivo líder en la región',
};

export default async function QuienesSomosPage() {
  const slug = 'quienessomos';

  // Cargar página y sus secciones desde el CMS
  const { data: page, error: pageError } = await pagesService.getBySlug(slug);

  if (pageError || !page || !page.publicada || !page.activa) {
    notFound();
  }

  const { data: sections, error: sectionsError } = await pageSectionsService.getByPageId(page.id);

  if (sectionsError) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Renderizar secciones del CMS */}
      {sections && sections.length > 0 ? (
        sections
          .filter(section => section.activa)
          .map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))
      ) : (
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">{page.titulo}</h1>
          <p className="text-gray-400">Esta página no tiene contenido todavía.</p>
          <p className="text-gray-500 mt-4">Agrega secciones desde el dashboard.</p>
        </div>
      )}
    </div>
  );
}
