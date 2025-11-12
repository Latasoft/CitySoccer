'use client';

import Image from 'next/image';
import EditableElement from '@/components/EditableElement';
import { pageSectionsService } from '@/lib/adminService';

const HeroSection = ({ config, styles, sectionId }) => {
  const {
    titulo = 'Bienvenidos',
    subtitulo = '',
    imagen_fondo = '/images/hero-bg.jpg',
    cta_texto = 'Ver más',
    cta_url = '#',
    altura = 'medium', // small, medium, large, fullscreen
    alineacion = 'center', // left, center, right
    overlay_opacity = 0.5,
  } = config || {};

  const handleSave = async (newValue, field) => {
    if (!sectionId) return;

    const updatedConfig = {
      ...config,
      [field]: newValue
    };

    await pageSectionsService.update(sectionId, {
      configuracion: updatedConfig
    });

    // Recargar la página para ver los cambios
    window.location.reload();
  };

  const alturas = {
    small: 'h-[40vh]',
    medium: 'h-[60vh]',
    large: 'h-[80vh]',
    fullscreen: 'h-screen',
  };

  const alineaciones = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <section 
      className={`relative ${alturas[altura]} w-full overflow-hidden`}
      style={styles}
    >
      {/* Background Image */}
      <EditableElement
        type="image"
        value={imagen_fondo}
        onSave={handleSave}
        field="imagen_fondo"
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src={imagen_fondo}
            alt={titulo}
            fill
            className="object-cover"
            priority
          />
          <div 
            className="absolute inset-0 bg-black"
            style={{ opacity: overlay_opacity }}
          />
        </div>
      </EditableElement>

      {/* Content */}
      <div className={`relative z-10 container mx-auto px-4 h-full flex flex-col justify-center ${alineaciones[alineacion]}`}>
        <div className="max-w-4xl">
          <EditableElement
            type="text"
            value={titulo}
            onSave={handleSave}
            field="titulo"
            placeholder="Título del Hero"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              {titulo}
            </h1>
          </EditableElement>

          {subtitulo && (
            <EditableElement
              type="text"
              value={subtitulo}
              onSave={handleSave}
              field="subtitulo"
              placeholder="Subtítulo"
            >
              <p className="text-xl md:text-2xl text-gray-200 mb-8">
                {subtitulo}
              </p>
            </EditableElement>
          )}

          {cta_texto && cta_url && (
            <EditableElement
              type="button"
              value={cta_texto}
              onSave={handleSave}
              field="cta_texto"
              placeholder="Texto del botón"
            >
              <a
                href={cta_url}
                className="inline-block px-8 py-4 bg-[#ffee00] text-black font-bold rounded-lg hover:bg-[#e6d000] transition-colors text-lg"
              >
                {cta_texto}
              </a>
            </EditableElement>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
