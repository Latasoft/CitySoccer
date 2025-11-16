'use client';
import React from 'react';
import EditableContent from './EditableContent';
import EditableImage from './EditableImage';

const CTASection = ({ 
  title = '¿Listo para jugar?', 
  subtitle = 'Reserva tu cancha ahora y disfruta de las mejores instalaciones', 
  primaryButton = { text: 'Reservar Ahora', link: '/arrendarcancha', type: 'link' }, 
  secondaryButton = { text: 'Ver Precios', link: '#precios', type: 'link' }, 
  whatsappNumber,
  imageCategory = 'eventos-cta',
  pageKey = 'default'
}) => {
  const handlePrimaryClick = () => {
    if (primaryButton.type === 'whatsapp') {
      const message = encodeURIComponent(primaryButton.message || "Hola! Me interesa más información.");
      window.open(`https://wa.me/${whatsappNumber.replace('+', '')}?text=${message}`, '_blank');
    } else {
      window.location.href = primaryButton.link;
    }
  };

  const handleSecondaryClick = () => {
    if (secondaryButton.type === 'whatsapp') {
      const message = encodeURIComponent(secondaryButton.message || "Hola! Tengo algunas preguntas.");
      window.open(`https://wa.me/${whatsappNumber.replace('+', '')}?text=${message}`, '_blank');
    } else {
      window.location.href = secondaryButton.link;
    }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-green-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50">
        <EditableImage 
          src={`/uploads/images/${imageCategory}-1.jpg`}
          categoria={imageCategory}
          pageKey={pageKey}
          fieldKey={`${imageCategory}_background`}
          alt="Background"
          fill={true}
          sizes="100vw"
          quality={70}
          className="opacity-30"
        />
      </div>
      
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <EditableContent 
          pageKey={pageKey}
          fieldKey="cta_title"
          fieldType="text"
          defaultValue={title}
          as="h2"
          className="text-4xl md:text-5xl font-bold text-white mb-6"
        />
        
        <EditableContent 
          pageKey={pageKey}
          fieldKey="cta_subtitle"
          fieldType="textarea"
          defaultValue={subtitle}
          as="p"
          className="text-xl text-gray-200 mb-12 max-w-3xl mx-auto"
        />
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handlePrimaryClick}
            className="bg-green-600 hover:bg-green-700 text-white py-4 px-8 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105"
          >
            <EditableContent 
              pageKey={pageKey}
              fieldKey="cta_primary_button_text"
              fieldType="text"
              defaultValue={primaryButton.text}
              as="span"
            />
          </button>
          
          {secondaryButton && (
            <button 
              onClick={handleSecondaryClick}
              className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white py-4 px-8 rounded-lg font-bold text-lg transition-all duration-300"
            >
              <EditableContent 
                pageKey={pageKey}
                fieldKey="cta_secondary_button_text"
                fieldType="text"
                defaultValue={secondaryButton.text}
                as="span"
              />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTASection;