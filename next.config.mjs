/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para hosting tradicional (iHost)
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Configuración específica para export estático
  experimental: {
    esmExternals: true
  },
  // Configurar rutas estáticas
  async generateStaticParams() {
    return [];
  }
};

export default nextConfig;
