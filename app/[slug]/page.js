import { notFound } from 'next/navigation';
import { pagesService, pageSectionsService } from '@/lib/adminService';
import SectionRenderer from '@/components/sections/SectionRenderer';

export async function generateMetadata({ params }) {
  const { slug } = params;
  const { data: page } = await pagesService.getBySlug(slug);

  if (!page || !page.publicada) {
    return {
      title: 'Página no encontrada',
    };
  }

  return {
    title: page.meta_title || page.titulo,
    description: page.meta_description || page.descripcion,
    keywords: page.meta_keywords || '',
  };
}

export default async function CMSPage({ params }) {
  const { slug } = params;

  // Cargar página y sus secciones
  const { data: page, error: pageError } = await pagesService.getBySlug(slug);

  if (pageError || !page || !page.publicada || !page.activa) {
    notFound();
  }

  const { data: sections, error: sectionsError } = await pageSectionsService.getByPageId(page.id);

  if (sectionsError) {
    notFound();
  }

  // Determinar el layout
  const layoutClasses = {
    default: 'container mx-auto px-4 max-w-7xl',
    fullwidth: 'w-full',
    sidebar: 'container mx-auto px-4 max-w-7xl grid lg:grid-cols-[1fr_300px] gap-8',
  };

  return (
    <div className="min-h-screen">
      {/* Renderizar secciones */}
      <div className={page.layout_type === 'fullwidth' ? 'w-full' : ''}>
        {sections && sections.length > 0 ? (
          sections
            .filter(section => section.activa)
            .map((section) => (
              <SectionRenderer key={section.id} section={section} />
            ))
        ) : (
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{page.titulo}</h1>
            <p className="text-gray-600">{page.descripcion}</p>
            <p className="text-gray-400 mt-8">Esta página no tiene contenido todavía.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Para SSG: Generar rutas estáticas en build time
export async function generateStaticParams() {
  const { data: pages } = await pagesService.getAll();
  
  if (!pages) return [];

  return pages
    .filter(page => page.publicada && page.activa)
    .map((page) => ({
      slug: page.slug,
    }));
}
