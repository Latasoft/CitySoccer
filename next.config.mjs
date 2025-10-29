/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración básica (sin export estático para mantener APIs)
  images: {
    unoptimized: true
  },
  // Configuración específica
  experimental: {
    esmExternals: true
  }
};

export default nextConfig;
