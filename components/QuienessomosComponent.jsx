'use client';

import React from 'react';
import EditableImage from './EditableImage';
import OptimizedImage from './OptimizedImage';
import EditableContent from './EditableContent';
import { useConfig } from "@/lib/dynamicConfigService";


const QuienessomosComponent = () => {
  // Cargar configuración
  const { config, loading } = useConfig();

  const partnerships = [
    {
      name: "City Soccer, West Palm",
      country: "Florida, EE.UU.",
      url: "/iconUSA.png",
      instagram: "https://www.instagram.com/citysoccerfl/",
    },
    {
      name: "City Soccer, Saint Lucie",
      country: "Florida, EE.UU.",
      url: "/iconUSA.png",
      instagram: "https://www.instagram.com/citysoccerpsl/",
    },
    {
      name: "City Soccer, San Carlos",
      country: "Uruguay",
      url: "/iconURU.png",
      instagram: "https://www.instagram.com/citysoccer.uy/",
    }
  ];

  const handlePartnershipClick = (instagramUrl) => {
    window.open(instagramUrl, "_blank", "noopener,noreferrer");
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hola! Me gustaría conocer más sobre City Soccer y sus servicios.");
    const whatsappNumber = config.whatsapp || '56974265020';
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-green-900 to-emerald-800 min-h-screen flex items-center py-8 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Texto del Hero */}
            <div className="flex flex-col gap-6 sm:gap-8 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-white uppercase">
                <EditableContent
                  pageKey="quienessomos"
                  fieldKey="hero_title_first"
                  fieldType="text"
                  defaultValue="Sobre"
                  as="span"
                  className="text-green-400"
                />
                {' '}
                <EditableContent
                  pageKey="quienessomos"
                  fieldKey="hero_title_second"
                  fieldType="text"
                  defaultValue="City Soccer"
                  as="span"
                  className="text-blue-400"
                />
              </h1>

              <div className="flex flex-col gap-4 sm:gap-6 text-gray-300">
                <EditableContent
                  pageKey="quienessomos"
                  fieldKey="hero_description"
                  fieldType="textarea"
                  defaultValue="Más que un centro deportivo, somos una familia unida por la pasión del fútbol. En City Soccer creamos espacios donde el deporte se vive con profesionalismo, diversión y valores que trascienden las canchas."
                  as="p"
                  className="text-lg sm:text-xl leading-relaxed"
                />
              </div>

              <EditableContent
                pageKey="quienessomos"
                fieldKey="hero_button_text"
                fieldType="text"
                defaultValue="Contáctanos"
                as="button"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 sm:py-4 sm:px-8 rounded-full text-sm sm:text-base uppercase tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/40 self-center lg:self-start"
                onClick={handleWhatsAppClick}
              />
            </div>

            {/* Grid de Imágenes - Responsive */}
            <div className="flex justify-center items-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 w-full max-w-2xl">
                {/* Primera imagen - ocupa toda la fila superior */}
                <div className="col-span-1 sm:col-span-2">
                  <div className="w-full h-[250px] sm:h-[300px] relative rounded-xl shadow-2xl shadow-black/50 transition-transform duration-300 hover:scale-105 hover:shadow-3xl overflow-hidden">
                    <EditableImage
                      src=""
                      alt="Instalaciones City Soccer"
                      categoria="quienes-somos"
                      pageKey="quienessomos"
                      fieldKey="quienes_somos_image_1"
                      fill={true}
                      sizes="(max-width: 640px) 100vw, 672px"
                      quality={80}
                      objectFit="cover"
                    />
                  </div>
                </div>
                
                {/* Segunda y tercera imagen - apiladas en móvil, lado a lado en desktop */}
                <div className="w-full h-[200px] sm:h-[300px] relative rounded-xl shadow-2xl shadow-black/50 transition-transform duration-300 hover:scale-105 hover:shadow-3xl overflow-hidden">
                  <EditableImage
                    src=""
                    alt="Pasión por el fútbol"
                    categoria="quienes-somos"
                    pageKey="quienessomos"
                    fieldKey="quienes_somos_image_2"
                    fill={true}
                    sizes="(max-width: 640px) 100vw, 336px"
                    quality={80}
                    objectFit="cover"
                  />
                </div>
                <div className="w-full h-[200px] sm:h-[300px] relative rounded-xl shadow-2xl shadow-black/50 transition-transform duration-300 hover:scale-105 hover:shadow-3xl overflow-hidden">
                  <EditableImage
                    src=""
                    alt="Entrenamiento profesional"
                    categoria="quienes-somos"
                    pageKey="quienessomos"
                    fieldKey="quienes_somos_image_3"
                    fill={true}
                    sizes="(max-width: 640px) 100vw, 336px"
                    quality={80}
                    objectFit="cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Alianzas Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <EditableContent
              pageKey="quienessomos"
              fieldKey="partnerships_title"
              fieldType="text"
              defaultValue="Nuestras Alianzas"
              as="h2"
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            />
            <EditableContent
              pageKey="quienessomos"
              fieldKey="partnerships_subtitle"
              fieldType="text"
              defaultValue="Colaboramos con centros deportivos de clase mundial"
              as="p"
              className="text-xl text-gray-300"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partnerships.map((partnership, index) => (
              <div key={index} className="bg-gray-700 rounded-xl p-6 hover:bg-gray-600 transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="w-28 h-20 rounded-lg mx-auto mb-4 flex items-center justify-center overflow-hidden bg-white/10 relative">
                    <EditableImage
                      src={partnership.url}
                      alt={partnership.country}
                      categoria={`alianza-${index + 1}`}
                      pageKey="quienessomos"
                      fieldKey={`partnership_${index + 1}_image`}
                      width={64}
                      height={48}
                      quality={90}
                      objectFit="contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    <EditableContent
                      pageKey="quienessomos"
                      fieldKey={`partnership${index + 1}_name`}
                      fieldType="text"
                      defaultValue={partnership.name}
                      as="span"
                    />
                  </h3>
                  <p className="text-gray-300 mb-4">
                    <EditableContent
                      pageKey="quienessomos"
                      fieldKey={`partnership${index + 1}_country`}
                      fieldType="text"
                      defaultValue={partnership.country}
                      as="span"
                    />
                  </p>
                  <button
                    onClick={() => handlePartnershipClick(partnership.instagram)}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300 text-sm inline-flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Ver Instagram
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
};

export default QuienessomosComponent;
