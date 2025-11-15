import QuienessomosComponent from '@/components/QuienessomosComponent';

// ISR: Regenerar cada 60 segundos
export const revalidate = 60;

export default function QuienesSomosPage() {
  return <QuienessomosComponent />;
}
