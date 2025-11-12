'use client';

import Image from 'next/image';
import EditableElement from '@/components/EditableElement';
import { pageSectionsService } from '@/lib/adminService';

const CTASection = ({ config, styles, sectionId }) => {
  const {
    titulo = 'Listo para empezar?',
    descripcion = '',
    cta_primario_texto = 'Comenzar ahora',
    cta_primario_url = '#',
    cta_secundario_texto = '',
    cta_secundario_url = '#',
    fondo_color = 'amarillo', // amarillo, negro, gradiente
    imagen_fondo = '',
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

    window.location.reload();
  };

  const fondos = {
    amarillo: 'bg-[#ffee00] text-black',
    negro: 'bg-gray-900 text-white',
    gradiente: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black',
  };

  return (
    <section 
      className={`relative py-20 ${fondos[fondo_color]}`}
      style={styles}
    >
      {/* Background Image (opcional) */}
      {imagen_fondo && (
        <EditableElement
          type="image"
          value={imagen_fondo}
          onSave={handleSave}
          field="imagen_fondo"
        >
          <div className="absolute inset-0 z-0">
            <Image
              src={imagen_fondo}
              alt="Background"
              fill
              className="object-cover opacity-20"
            />
          </div>
        </EditableElement>
      )}

      <div className="relative z-10 container mx-auto px-4 text-center">
        <EditableElement
          type="text"
          value={titulo}
          onSave={handleSave}
          field="titulo"
          placeholder="Título del CTA"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {titulo}
          </h2>
        </EditableElement>

        {descripcion && (
          <EditableElement
            type="text"
            value={descripcion}
            onSave={handleSave}
            field="descripcion"
            placeholder="Descripción"
          >
            <p className="text-xl max-w-2xl mx-auto mb-8 opacity-90">
              {descripcion}
            </p>
          </EditableElement>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {cta_primario_texto && (
            <EditableElement
              type="button"
              value={cta_primario_texto}
              onSave={handleSave}
              field="cta_primario_texto"
              placeholder="Texto del botón principal"
            >
              <a
                href={cta_primario_url}
                className={`inline-block px-8 py-4 font-bold rounded-lg transition-colors text-lg ${
                  fondo_color === 'amarillo'
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-[#ffee00] text-black hover:bg-[#e6d000]'
                }`}
              >
                {cta_primario_texto}
              </a>
            </EditableElement>
          )}
          {cta_secundario_texto && (
            <EditableElement
              type="button"
              value={cta_secundario_texto}
              onSave={handleSave}
              field="cta_secundario_texto"
              placeholder="Texto del botón secundario"
            >
              <a
                href={cta_secundario_url}
                className="inline-block px-8 py-4 font-bold rounded-lg border-2 border-current hover:bg-white/10 transition-colors text-lg"
              >
                {cta_secundario_texto}
              </a>
            </EditableElement>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
