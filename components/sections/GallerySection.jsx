'use client';

import Image from 'next/image';
import EditableElement from '@/components/EditableElement';
import { pageSectionsService } from '@/lib/adminService';

const GallerySection = ({ config, styles, sectionId }) => {
  const {
    titulo = '',
    imagenes = [],
    layout = 'grid', // grid, masonry, carousel
    columnas = 3, // 2, 3, 4
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

  const handleImageSave = async (imageIndex, newValue, field) => {
    if (!sectionId) return;

    const updatedImages = [...imagenes];
    updatedImages[imageIndex] = {
      ...updatedImages[imageIndex],
      [field]: newValue
    };

    const updatedConfig = {
      ...config,
      imagenes: updatedImages
    };

    await pageSectionsService.update(sectionId, {
      configuracion: updatedConfig
    });

    window.location.reload();
  };

  const columnasClasses = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section 
      className={`py-16 ${fondo_oscuro ? 'bg-gray-900' : 'bg-white'}`}
      style={styles}
    >
      <div className="container mx-auto px-4">
        {titulo && (
          <EditableElement
            type="text"
            value={titulo}
            onSave={handleSave}
            field="titulo"
            placeholder="Título de la galería"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-12 text-center ${fondo_oscuro ? 'text-white' : 'text-gray-900'}`}>
              {titulo}
            </h2>
          </EditableElement>
        )}

        {layout === 'grid' && (
          <div className={`grid grid-cols-1 ${columnasClasses[columnas]} gap-6`}>
            {imagenes.map((imagen, index) => (
              <EditableElement
                key={index}
                type="image"
                value={imagen.url}
                onSave={(newValue) => handleImageSave(index, newValue, 'url')}
                field={`imagen_${index + 1}`}
              >
                <div 
                  className="relative h-64 rounded-lg overflow-hidden group cursor-pointer"
                >
                  <Image
                    src={imagen.url}
                    alt={imagen.alt || `Imagen ${index + 1}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                  {imagen.titulo && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white font-semibold text-lg">{imagen.titulo}</p>
                    </div>
                  )}
                </div>
              </EditableElement>
            ))}
          </div>
        )}

        {layout === 'masonry' && (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
            {imagenes.map((imagen, index) => (
              <EditableElement
                key={index}
                type="image"
                value={imagen.url}
                onSave={(newValue) => handleImageSave(index, newValue, 'url')}
                field={`imagen_${index + 1}`}
              >
                <div 
                  className="relative mb-6 break-inside-avoid rounded-lg overflow-hidden group cursor-pointer"
                >
                  <Image
                    src={imagen.url}
                    alt={imagen.alt || `Imagen ${index + 1}`}
                    width={400}
                    height={imagen.height || 300}
                    className="w-full h-auto transition-transform group-hover:scale-105"
                  />
                  {imagen.titulo && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white font-semibold text-lg">{imagen.titulo}</p>
                    </div>
                  )}
                </div>
              </EditableElement>
            ))}
          </div>
        )}

        {layout === 'carousel' && (
          <div className="relative overflow-hidden">
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
              {imagenes.map((imagen, index) => (
                <EditableElement
                  key={index}
                  type="image"
                  value={imagen.url}
                  onSave={(newValue) => handleImageSave(index, newValue, 'url')}
                  field={`imagen_${index + 1}`}
                >
                  <div 
                    className="relative flex-none w-full md:w-1/2 lg:w-1/3 h-96 rounded-lg overflow-hidden snap-start"
                  >
                    <Image
                      src={imagen.url}
                      alt={imagen.alt || `Imagen ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    {imagen.titulo && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <p className="text-white font-semibold text-lg">{imagen.titulo}</p>
                      </div>
                    )}
                  </div>
                </EditableElement>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
