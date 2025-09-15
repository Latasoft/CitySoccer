import React from 'react';

const CTASection = ({ 
  title, 
  subtitle, 
  primaryButton, 
  secondaryButton, 
  whatsappNumber,
  backgroundImage 
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
      {backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-50">
          <img src={backgroundImage} alt="Background" className="w-full h-full object-cover opacity-30" />
        </div>
      )}
      
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{title}</h2>
        <p className="text-xl text-gray-200 mb-12 max-w-3xl mx-auto">{subtitle}</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handlePrimaryClick}
            className="bg-green-600 hover:bg-green-700 text-white py-4 px-8 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105"
          >
            {primaryButton.text}
          </button>
          
          {secondaryButton && (
            <button 
              onClick={handleSecondaryClick}
              className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white py-4 px-8 rounded-lg font-bold text-lg transition-all duration-300"
            >
              {secondaryButton.text}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTASection;