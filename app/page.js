import HomePageClient from '@/components/HomePageClient';

// ISR: Regenerar cada 60 segundos
export const revalidate = 60;

export default async function HomePage() {
  // NO usamos CMS - renderizamos directamente el componente estático
  // El contenido editable se carga desde editable_content mediante EditableContent
  return <HomePageClient />;
}
