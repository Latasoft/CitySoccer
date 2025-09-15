import React from 'react';

const ProgramsSection = ({ title, programs, whatsappNumber }) => {
  const handleWhatsAppClick = (programName) => {
    const message = encodeURIComponent(`Hola! Me interesa información sobre ${programName}. ¿Podrían contarme más detalles?`);
    window.open(`https://wa.me/${whatsappNumber.replace('+', '')}?text=${message}`, '_blank');
  };

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h2>
          <p className="text-xl text-gray-300">Encuentra el programa perfecto para ti</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {programs.map((program, index) => (
            <div key={index} className="bg-gray-800 rounded-2xl p-8 hover:bg-gray-750 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">{program.name}</h3>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  {program.age || 'Todas las edades'}
                </span>
              </div>
              
              <p className="text-gray-300 mb-6">{program.description}</p>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Enfoque:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {program.focus.map((item, idx) => (
                    <div key={idx} className="flex items-center text-gray-300">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      <span className="text-sm">{item}</span>
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