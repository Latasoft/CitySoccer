/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para Render (SSR habilitado)
  // output: 'export', // Comentado para permitir SSR en Render
  // trailingSlash: true, // deshabilitado
  
  // Habilitar compresión
  compress: true,
  
  // Power optimizations
  poweredByHeader: false,
  
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ckbebftjgqearfubmgus.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  
  // Configuración específica para Render
  experimental: {
    esmExternals: true,
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
  
  // Headers de seguridad y performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Redirects si es necesario
  async redirects() {
    return [];
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimizaciones de producción
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        minimize: true,
      };
    }
    
    return config;
  },
};

export default nextConfig;
