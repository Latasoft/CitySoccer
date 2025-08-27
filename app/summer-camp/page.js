"use client";

export default function SummerCamp() {
  const campData = {
    title: "Summer Camp City Soccer",
    description: "Vacaciones deportivas llenas de diversión, aprendizaje y nuevas amistades en un ambiente seguro y profesional",
    ages: [
      {
        name: "Pequeños Campeones (5-8 años)",
        description: "Iniciación deportiva a través del juego",
        activities: ["Fútbol recreativo", "Juegos tradicionales", "Arte y manualidades", "Natación básica", "Meriendas saludables"]
      },
      {
        name: "Futuros Cracks (9-12 años)", 
        description: "Desarrollo de habilidades deportivas y sociales",
        activities: ["Entrenamiento de fútbol", "Pickleball", "Deportes alternativos", "Talleres de valores", "Competencias amistosas"]
      },
      {
        name: "Jóvenes Atletas (13-16 años)",
        description: "Perfeccionamiento técnico y liderazgo",
        activities: ["Fútbol avanzado", "Preparación física", "Liderazgo deportivo", "Torneos internos", "Charlas motivacionales"]
      }
    ],
    schedule: {
      duration: "Enero y Febrero 2026",
      dailyHours: "9:00 - 17:00",
      options: [
        "Jornada completa (9:00 - 17:00)",
        "Media jornada mañana (9:00 - 13:00)",
        "Media jornada tarde (13:00 - 17:00)"
      ]
    },
    includes: [
      "Desayuno y almuerzo nutritivo",
      "Colación de media mañana y tarde",
      "Seguro de accidentes incluido",
      "Transporte desde puntos de encuentro",
      "Material deportivo y didáctico",
      "Camiseta oficial del camp",
      "Diploma de participación",
      "Fotos y videos de actividades",
      "Primeros auxilios y enfermería",
      "Actividades acuáticas supervisadas"
    ],
    benefits: [
      "Desarrollo de habilidades deportivas",
      "Fomento del trabajo en equipo",
      "Creación de nuevas amistades",
      "Valores como respeto y disciplina",
      "Actividad física constante",
      "Ambiente seguro y supervisado",
      "Diversión garantizada",
      "Desarrollo de la autoestima"
    ],
    whatsapp: "+56912345678"
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hola! Me interesa información sobre el Summer Camp 2026. ¿Podrían contarme más detalles sobre precios, fechas disponibles y proceso de inscripción?");
    window.open(`https://wa.me/${campData.whatsapp.replace('+', '')}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#eeff00]">
            {campData.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {campData.description}
          </p>
        </div>

        {/* Información de fechas y horarios */}
        <div className="bg-gradient-to-br from-orange-800 to-orange-900 rounded-xl p-8 border border-orange-700 mb-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Información General</h2>
          <div className="grid md:grid-cols-3 gap-6 text-orange-100">
            <div>
              <h3 className="text-xl font-semibold mb-2">Duración</h3>
              <p className="text-lg">{campData.schedule.duration}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Horario</h3>
              <p className="text-lg">{campData.schedule.dailyHours}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Modalidades</h3>
              <div className="space-y-1">
                {campData.schedule.options.map((option, index) => (
                  <p key={index} className="text-sm">{option}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Grupos por edades */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Grupos por Edades</h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {campData.ages.map((group, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-[#eeff00]/30 transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-xl">
                <h3 className="text-xl font-bold text-[#eeff00] mb-2">{group.name}</h3>
                <p className="text-gray-300 mb-4">{group.description}</p>
                <div className="space-y-2">
                  <p className="text-white font-semibold">Actividades:</p>
                  {group.activities.map((activity, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#eeff00] rounded-full"></div>
                      <span className="text-gray-400 text-sm">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Qué incluye */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">¿Qué incluye el Summer Camp?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {campData.includes.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#eeff00] rounded-full"></div>
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Beneficios */}
        <div className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl p-6 border border-blue-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Beneficios para tu hijo/a</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {campData.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                <span className="text-blue-100">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contacto WhatsApp */}
        <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-xl p-8 border border-green-700 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">¡Reserva el Cupo de tu Hijo/a!</h2>
          <p className="text-green-100 mb-6">
            Cupos limitados. Contacta con nosotros para conocer precios, fechas disponibles y realizar la inscripción
          </p>
          <button 
            onClick={handleWhatsAppClick}
            className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-lg transition-all duration-300 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center gap-3 mx-auto"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            Consultar Inscripciones
          </button>
        </div>
      </div>
    </div>
  );
}