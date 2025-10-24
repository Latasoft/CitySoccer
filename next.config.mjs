/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración optimizada para Netlify con API routes
  images: {
    unoptimized: true
  },
  // No usar 'export' ya que tenemos API routes
  experimental: {
    esmExternals: true
  }
};

export default nextConfig;
