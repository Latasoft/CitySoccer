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
  },
  // Webpack config para asegurar que las variables se incluyan en el bundle
  webpack: (config, { dev, isServer }) => {
    // Solo en producción y para el cliente
    if (!dev && !isServer) {
      config.plugins.push(
        new config.webpack.DefinePlugin({
          'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL),
          'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        })
      );
    }
    return config;
  }
};

export default nextConfig;
