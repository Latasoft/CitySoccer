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
    // ✅ OPTIMIZACIÓN HABILITADA - Next.js generará versiones responsive y optimizadas
    unoptimized: false,
    
    // Formatos modernos con fallback automático
    formats: ['image/avif', 'image/webp'],
    
    // Tamaños de dispositivo para responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // Tamaños de imagen para layout="responsive"
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Configuración de dominios remotos permitidos
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ckbebftjgqearfubmgus.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    
    // Permitir optimización de imágenes externas (SVG)
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
