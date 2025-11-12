'use client';

import Image from 'next/image';
import EditableElement from '@/components/EditableElement';
import { pageSectionsService } from '@/lib/adminService';

const CardGridSection = ({ config, styles, sectionId }) => {
  const {
    titulo = '',
    descripcion = '',
    columnas = 3, // 2, 3, 4
    cards = [],
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

  const handleCardSave = async (cardIndex, newValue, field) => {
    if (!sectionId) return;

    const updatedCards = [...cards];
    updatedCards[cardIndex] = {
      ...updatedCards[cardIndex],
      [field]: newValue
    };

    const updatedConfig = {
      ...config,
      cards: updatedCards
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
        {/* Header */}
        {(titulo || descripcion) && (
          <div className="text-center mb-12">
            {titulo && (
              <EditableElement
                type="text"
                value={titulo}
                onSave={handleSave}
                field="titulo"
                placeholder="Título de la sección"
              >
                <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${fondo_oscuro ? 'text-white' : 'text-gray-900'}`}>
                  {titulo}
                </h2>
              </EditableElement>
            )}
            {descripcion && (
              <EditableElement
                type="text"
                value={descripcion}
                onSave={handleSave}
                field="descripcion"
                placeholder="Descripción de la sección"
              >
                <p className={`text-lg max-w-2xl mx-auto ${fondo_oscuro ? 'text-gray-300' : 'text-gray-600'}`}>
                  {descripcion}
                </p>
              </EditableElement>
            )}
          </div>
        )}

        {/* Cards Grid */}
        <div className={`grid grid-cols-1 ${columnasClasses[columnas]} gap-8`}>
          {cards.map((card, index) => (
            <div 
              key={index}
              className={`rounded-xl p-6 transition-transform hover:scale-105 ${
                fondo_oscuro 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-gray-100 border border-gray-200'
              }`}
            >
              {card.imagen && (
                <EditableElement
                  type="image"
                  value={card.imagen}
                  onSave={(newValue) => handleCardSave(index, newValue, 'imagen')}
                  field={`imagen_tarjeta_${index + 1}`}
                >
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={card.imagen}
                      alt={card.titulo}
                      fill
                      className="object-cover"
                    />
                  </div>
                </EditableElement>
              )}
              {card.icono && (
                <EditableElement
                  type="text"
                  value={card.icono}
                  onSave={(newValue) => handleCardSave(index, newValue, 'icono')}
                  field={`icono_tarjeta_${index + 1}`}
                  placeholder="Emoji (ej: ⚽)"
                >
                  <div className="text-5xl mb-4">{card.icono}</div>
                </EditableElement>
              )}
              <EditableElement
                type="text"
                value={card.titulo}
                onSave={(newValue) => handleCardSave(index, newValue, 'titulo')}
                field={`titulo_tarjeta_${index + 1}`}
                placeholder="Título de la tarjeta"
              >
                <h3 className={`text-xl font-bold mb-2 ${fondo_oscuro ? 'text-white' : 'text-gray-900'}`}>
                  {card.titulo}
                </h3>
              </EditableElement>
              <EditableElement
                type="text"
                value={card.descripcion}
                onSave={(newValue) => handleCardSave(index, newValue, 'descripcion')}
                field={`descripcion_tarjeta_${index + 1}`}
                placeholder="Descripción de la tarjeta"
              >
                <p className={fondo_oscuro ? 'text-gray-300' : 'text-gray-600'}>
                  {card.descripcion}
                </p>
              </EditableElement>
              {card.url && (
                <EditableElement
                  type="text"
                  value={card.url_texto || 'Ver más →'}
                  onSave={(newValue) => handleCardSave(index, newValue, 'url_texto')}
                  field={`url_texto_tarjeta_${index + 1}`}
                  placeholder="Texto del enlace"
                >
                  <a
                    href={card.url}
                    className="inline-block mt-4 text-[#ffee00] hover:underline font-semibold"
                  >
                    {card.url_texto || 'Ver más →'}
                  </a>
                </EditableElement>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardGridSection;
