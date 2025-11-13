import React from 'react';
import EditableContent from './EditableContent';

const SchedulePricingSection = ({ schedules, pricing, whatsappNumber, pageKey = 'default' }) => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hola! Me gustaría conocer más sobre los horarios y precios disponibles.");
    window.open(`https://wa.me/${whatsappNumber.replace('+', '')}?text=${message}`, '_blank');
  };

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Horarios */}
          <div className="bg-gray-800 rounded-2xl p-8">
            <EditableContent 
              pageKey={pageKey}
              fieldKey="schedule_section_title"
              fieldType="text"
              defaultValue="Horarios"
              as="h3"
              className="text-3xl font-bold text-white mb-8 text-center"
            />
            <div className="space-y-4">
              {schedules.map((schedule, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-700 rounded-lg p-4">
                  <EditableContent 
                    pageKey={pageKey}
                    fieldKey={`schedule_${index + 1}_day`}
                    fieldType="text"
                    defaultValue={schedule.day}
                    as="span"
                    className="text-gray-300 font-medium"
                  />
                  <EditableContent 
                    pageKey={pageKey}
                    fieldKey={`schedule_${index + 1}_time`}
                    fieldType="text"
                    defaultValue={schedule.time}
                    as="span"
                    className="text-white font-bold"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Precios */}
          <div className="bg-gray-800 rounded-2xl p-8">
            <EditableContent 
              pageKey={pageKey}
              fieldKey="pricing_section_title"
              fieldType="text"
              defaultValue="Precios"
              as="h3"
              className="text-3xl font-bold text-white mb-8 text-center"
            />
            <div className="space-y-4">
              {pricing?.map((price, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-semibold">{price.plan}</span>
                    <span className="text-green-400 font-bold text-xl">{price.price}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{price.description}</p>
                </div>
              )) || (
                <div className="text-center">
                  <EditableContent 
                    pageKey={pageKey}
                    fieldKey="pricing_consult_text"
                    fieldType="text"
                    defaultValue="Consulta nuestros precios especiales"
                    as="p"
                    className="text-gray-300 mb-6"
                  />
                  <button 
                    onClick={handleWhatsAppClick}
                    className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300"
                  >
                    Consultar Precios
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SchedulePricingSection;