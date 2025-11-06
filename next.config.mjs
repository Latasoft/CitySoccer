/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para Render (SSR habilitado)
  // output: 'export', // Comentado para permitir SSR en Render
  // trailingSlash: true, // deshabilitado
  images: {
    unoptimized: true
  },
  // Configuración específica para Render
  experimental: {
    esmExternals: true
  },
  // Variables de entorno públicas - CRÍTICO: asegurar que estén disponibles
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
  // Configuración adicional para variables de entorno - DOBLE SEGURIDAD
  publicRuntimeConfig: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }
};

export default nextConfig;
