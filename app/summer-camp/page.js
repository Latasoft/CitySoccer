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
    const message = encodeURIComponent("¡Hola! Me interesa inscribir a mi hijo/a en el Summer Camp 2026. ¿Podrían contarme más sobre precios, fechas disponibles y el proceso de inscripción?");
    window.open(`https://wa.me/${campData.whatsapp.replace('+', '')}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header con diseño deportivo */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-3xl -z-10"></div>
          <div className="py-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-green-500 bg-clip-text text-transparent">
              {campData.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto font-medium leading-relaxed">
              {campData.description}
            </p>
            <div className="flex justify-center mt-6">
              <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Información de fechas y horarios - Diseño energético */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-8 mb-12 text-center shadow-2xl transform hover:scale-105 transition-all duration-300">
          <h2 className="text-4xl font-bold text-white mb-8 flex items-center justify-center gap-3">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            ¡Información del Camp!
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-white">
            <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-4">🗓️ Duración</h3>
              <p className="text-xl font-semibold">{campData.schedule.duration}</p>
            </div>
            <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-4">⏰ Horario</h3>
              <p className="text-xl font-semibold">{campData.schedule.dailyHours}</p>
            </div>
            <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-4">🏃‍♂️ Modalidades</h3>
              <div className="space-y-2">
                {campData.schedule.options.map((option, index) => (
                  <p key={index} className="text-lg font-medium">{option}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Grupos por edades - Diseño más dinámico */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            🏆 Grupos por Edades
          </h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {campData.ages.map((group, index) => {
              const colors = [
                'from-yellow-400 to-orange-500',
                'from-green-400 to-blue-500', 
                'from-blue-500 to-purple-500'
              ];
              const bgColors = [
                'bg-yellow-50',
                'bg-green-50',
                'bg-blue-50'
              ];
              
              return (
                <div key={index} className={`${bgColors[index]} rounded-3xl p-8 border-4 border-transparent hover:border-white transition-all duration-500 hover:-translate-y-4 shadow-xl hover:shadow-2xl relative overflow-hidden`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${colors[index]} opacity-10 rounded-3xl`}></div>
                  <div className="relative z-10">
                    <div className={`w-16 h-16 bg-gradient-to-br ${colors[index]} rounded-2xl flex items-center justify-center mb-6 mx-auto`}>
                      <span className="text-2xl font-bold text-white">{index + 1}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">{group.name}</h3>
                    <p className="text-gray-600 mb-6 text-center font-medium">{group.description}</p>
                    <div className="space-y-3">
                      <p className="text-gray-800 font-bold text-center mb-4">⚽ Actividades:</p>
                      {group.activities.map((activity, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-white/70 rounded-xl p-3">
                          <div className={`w-3 h-3 bg-gradient-to-r ${colors[index]} rounded-full`}></div>
                          <span className="text-gray-700 font-medium">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Qué incluye - Diseño fresco */}
        <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl p-8 border-4 border-green-200 mb-12 shadow-xl">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            ¡Todo Incluido en tu Summer Camp!
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {campData.includes.map((item, index) => (
              <div key={index} className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-700 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Beneficios - Diseño motivacional */}
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 border-4 border-blue-200 mb-12 shadow-xl">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Beneficios para tu Campeón/a
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {campData.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-700 font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contacto WhatsApp - CTA poderoso */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
            }}
          ></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              🚀 ¡Asegura el Cupo de tu Hijo/a!
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto font-medium">
              Los cupos son limitados y se agotan rápido. No dejes que tu hijo/a se pierda la mejor experiencia deportiva del verano.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="bg-white/20 rounded-2xl px-6 py-3 backdrop-blur-sm">
                <span className="text-white font-bold">⏰ Inscripciones Abiertas</span>
              </div>
              <div className="bg-white/20 rounded-2xl px-6 py-3 backdrop-blur-sm">
                <span className="text-white font-bold">🏃‍♂️ Cupos Limitados</span>
              </div>
            </div>
            <button 
              onClick={handleWhatsAppClick}
              className="bg-white text-green-600 px-12 py-6 rounded-2xl transition-all duration-300 text-xl font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 flex items-center gap-4 mx-auto group"
            >
              <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              ¡Inscríbelo Ahora por WhatsApp!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}