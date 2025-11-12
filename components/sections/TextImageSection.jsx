'use client';

import Image from 'next/image';
import EditableElement from '@/components/EditableElement';
import { pageSectionsService } from '@/lib/adminService';

const TextImageSection = ({ config, styles, sectionId }) => {
  const {
    titulo = '',
    contenido = '',
    imagen = '',
    posicion_imagen = 'right', // left, right
    fondo_oscuro = false,
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

  const isImageLeft = posicion_imagen === 'left';

  return (
    <section 
      className={`py-16 ${fondo_oscuro ? 'bg-gray-900' : 'bg-white'}`}
      style={styles}
    >
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isImageLeft ? 'lg:flex-row-reverse' : ''}`}>
          {/* Imagen */}
          <div className={`${isImageLeft ? 'lg:order-1' : 'lg:order-2'}`}>
            {imagen && (
              <EditableElement
                type="image"
                value={imagen}
                onSave={handleSave}
                field="imagen"
              >
                <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-2xl">
                  <Image
                    src={imagen}
                    alt={titulo}
                    fill
                    className="object-cover"
                  />
                </div>
              </EditableElement>
            )}
          </div>

          {/* Texto */}
          <div className={`${isImageLeft ? 'lg:order-2' : 'lg:order-1'}`}>
            {titulo && (
              <EditableElement
                type="text"
                value={titulo}
                onSave={handleSave}
                field="titulo"
                placeholder="Título de la sección"
              >
                <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${fondo_oscuro ? 'text-white' : 'text-gray-900'}`}>
                  {titulo}
                </h2>
              </EditableElement>
            )}
            {contenido && (
              <EditableElement
                type="text"
                value={contenido}
                onSave={handleSave}
                field="contenido"
                placeholder="Contenido HTML"
              >
                <div 
                  className={`prose max-w-none ${fondo_oscuro ? 'prose-invert' : ''}`}
                  dangerouslySetInnerHTML={{ __html: contenido }}
                />
              </EditableElement>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextImageSection;
