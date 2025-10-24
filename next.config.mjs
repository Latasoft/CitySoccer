/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para Netlify
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
