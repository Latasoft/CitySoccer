'use client';

import dynamic from 'next/dynamic';

const QuienessomosComponent = dynamic(() => import('@/components/QuienessomosComponent'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
    <div className="text-[#ffee00] text-2xl">Cargando...</div>
  </div>
});

export default function QuienesSomosPage() {
  return <QuienessomosComponent />;
}
