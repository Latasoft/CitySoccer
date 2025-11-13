'use client';
import React from 'react';
import EditableContent from './EditableContent';

const ProgramsSection = ({ 
  title = 'Nuestros Programas', 
  programs = [
    { name: 'Academia de Fútbol', description: 'Desarrolla tus habilidades futbolísticas', focus: ['Técnica', 'Táctica', 'Físico', 'Mental'] },
    { name: 'Academia de Pickleball', description: 'Aprende y mejora tu técnica de pickleball', focus: ['Técnica', 'Estrategia', 'Coordinación', 'Diversión'] },
    { name: 'Summer Camp', description: 'Campamentos de verano para todas las edades', focus: ['Deportes', 'Diversión', 'Amigos', 'Aprendizaje'] }
  ], 
  whatsappNumber, 
  onWhatsAppClick,
  pageKey = 'default'
}) => {
  const handleWhatsAppClick = (programName) => {
    const message = `Hola! Me interesa información sobre ${programName}. ¿Podrían contarme más detalles?`;
    if (onWhatsAppClick) {
      onWhatsAppClick(message);
    } else {
      // Fallback si no se proporciona la función
      window.open(`https://wa.me/${whatsappNumber?.replace('+', '')}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <EditableContent 
            pageKey={pageKey}
            fieldKey="programs_section_title"
            fieldType="text"
            defaultValue={title}
            as="h2"
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          />
          
          <EditableContent 
            pageKey={pageKey}
            fieldKey="programs_section_subtitle"
            fieldType="textarea"
            defaultValue="Encuentra el programa perfecto para ti"
            as="p"
            className="text-xl text-gray-300"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {programs.map((program, index) => (
            <div key={index} className="bg-gray-800 rounded-2xl p-8 hover:bg-gray-750 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-6">
                <EditableContent 
                  pageKey={pageKey}
                  fieldKey={`program_${index + 1}_title`}
                  fieldType="text"
                  defaultValue={program.name}
                  as="h3"
                  className="text-2xl font-bold text-white"
                />
              </div>
              
              <EditableContent 
                pageKey={pageKey}
                fieldKey={`program_${index + 1}_description`}
                fieldType="textarea"
                defaultValue={program.description}
                as="p"
                className="text-gray-300 mb-6"
              />
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Enfoque:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {program.focus?.map((item, idx) => (
                    <div key={idx} className="flex items-center text-gray-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      <EditableContent 
                        pageKey={pageKey}
                        fieldKey={`program_${index + 1}_focus_${idx + 1}`}
                        fieldType="text"
                        defaultValue={item}
                        as="span"
                        className="text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => handleWhatsAppClick(program.name)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300"
              >
                Consultar por WhatsApp
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;