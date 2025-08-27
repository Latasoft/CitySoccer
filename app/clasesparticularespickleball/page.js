"use client";

export default function ClasesParticularePickleball() {
  const classData = {
    title: "Clases Particulares de Pickleball",
    description: "Aprende el deporte de moda con instructores especializados",
    includes: [
      "Instructor certificado en Pickleball",
      "Raquetas y pelotas incluidas",
      "Técnicas básicas y avanzadas",
      "Estrategias de juego",
      "Reglas oficiales del deporte",
      "Acondicionamiento físico específico"
    ],
    schedule: [
      "Lunes a Viernes: 9:00 - 17:00",
      "Sábados: 9:00 - 15:00", 
      "Domingos: 10:00 - 14:00"
    ],
    whatsapp: "+56912345678"
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hola! Me interesa información sobre las clases particulares de pickleball. ¿Podrían contarme más detalles sobre precios y disponibilidad?");
    window.open(`https://wa.me/${classData.whatsapp.replace('+', '')}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#eeff00]">
            {classData.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {classData.description}
          </p>
        </div>

        {/* Incluye */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">¿Qué incluyen las clases?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {classData.includes.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#eeff00] rounded-full"></div>
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Horarios */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Horarios Disponibles</h2>
          <div className="space-y-2">
            {classData.schedule.map((schedule, index) => (
              <p key={index} className="text-gray-300">{schedule}</p>
            ))}
          </div>
        </div>

        {/* Contacto WhatsApp */}
        <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-xl p-8 border border-green-700 mb-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Consulta Precios y Disponibilidad</h2>
          <p className="text-green-100 mb-6">
            Habla directamente con nuestro equipo para obtener información personalizada sobre precios, horarios y disponibilidad
          </p>
          <button 
            onClick={handleWhatsAppClick}
            className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-lg transition-all duration-300 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center gap-3 mx-auto"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            Consultar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}   