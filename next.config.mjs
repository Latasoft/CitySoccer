/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para Render (SSR habilitado)
  // output: 'export', // Comentado para permitir SSR en Render
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Configuración específica para Render
  experimental: {
    esmExternals: true
  },
  // Variables de entorno públicas
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }
};

export default nextConfig;
