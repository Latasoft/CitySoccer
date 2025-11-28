'use client';

import { useEffect } from 'react';

const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'; // Cambia esta versión en cada deploy

export default function CacheCleaner() {
  useEffect(() => {
    const storedVersion = localStorage.getItem('app_version');

    if (storedVersion !== APP_VERSION) {
      // Limpiar localStorage si la versión cambió
      localStorage.clear();
      localStorage.setItem('app_version', APP_VERSION);
      console.log('Cache y localStorage limpiados por nueva versión:', APP_VERSION);
    }
  }, []);

  return null; // Este componente no renderiza nada
}