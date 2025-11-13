import HomePageClient from '@/components/HomePageClient';

export const revalidate = 3600; // Revalidar cada hora

export default async function HomePage() {
  // NO usamos CMS - renderizamos directamente el componente estático
  // El contenido editable se carga desde editable_content mediante EditableContent
  return <HomePageClient />;
}
