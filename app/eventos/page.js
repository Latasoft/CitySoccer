"use client";

import { useState } from "react";

export default function Eventos() {
  const [activeCategory, setActiveCategory] = useState('corporativos');

  const eventData = {
    title: "Eventos Deportivos",
    description: "Organizamos eventos únicos y memorables para empresas, cumpleaños, celebraciones y ocasiones especiales",
    categories: {
      corporativos: {
        name: "Eventos Corporativos",
        description: "Fortalece el equipo de trabajo con actividades deportivas",
        events: [
          {
            name: "Team Building Deportivo",
            description: "Actividades diseñadas para fortalecer la cohesión del equipo",
            features: ["Torneos inter-áreas", "Actividades colaborativas", "Premiación", "Catering incluido"]
          },
          {
            name: "Campeonatos Empresariales",
            description: "Competencias deportivas entre diferentes empresas",
            features: ["Organización completa", "Árbitros profesionales", "Trofeos y medallas", "Transmisión en vivo"]
          },
          {
            name: "Inauguraciones Deportivas",
            description: "Eventos para inaugurar nuevas instalaciones o proyectos",
            features: ["Ceremonias oficiales", "Partidos de exhibición", "Invitados especiales", "Cobertura fotográfica"]
          }
        ]
      },
      cumpleanos: {
        name: "Cumpleaños Deportivos",
        description: "Celebra tu día especial con diversión y deporte",
        events: [
          {
            name: "Cumpleaños Infantiles",
            description: "Fiestas temáticas de fútbol para los más pequeños",
            features: ["Animación deportiva", "Juegos recreativos", "Torta temática", "Sorpresas incluidas"]
          },
          {
            name: "Cumpleaños Juveniles",
            description: "Celebraciones deportivas para adolescentes",
            features: ["Torneos amistosos", "DJ y música", "Zona de descanso", "Fotografías profesionales"]
          },
          {
            name: "Cumpleaños Adultos",
            description: "Celebra con amigos en un ambiente deportivo único",
            features: ["Parrillada incluida", "Bebidas y aperitivos", "Música ambiente", "Servicio completo"]
          }
        ]
      },
      especiales: {
        name: "Eventos Especiales",
        description: "Celebraciones únicas para ocasiones importantes",
        events: [
          {
            name: "Matrimonios Deportivos",
            description: "Una boda diferente para parejas amantes del deporte",
            features: ["Ceremonia en cancha", "Decoración temática", "Banquete especializado", "Entretenimiento deportivo"]
          },
          {
            name: "Graduaciones",
            description: "Celebra tu logro académico con un evento deportivo",
            features: ["Ceremonias de reconocimiento", "Actividades competitivas", "Buffet celebratorio", "Recuerdos personalizados"]
          },
          {
            name: "Reuniones Familiares",
            description: "Reúne a toda la familia en un día de deporte y diversión",
            features: ["Actividades para todas las edades", "Asado familiar", "Juegos tradicionales", "Zona de descanso"]
          }
        ]
      }
    },
    services: [
      "Planificación completa del evento",
      "Coordinación el día del evento",
      "Equipamiento deportivo incluido",
      "Servicio de catering personalizado",
      "Decoración temática",
      "Fotografía y video profesional",
      "Animación y entretenimiento",
      "Seguro de responsabilidad civil",
      "Limpieza post-evento",
      "Souvenirs personalizados"
    ],
    whatsapp: "+56912345678"
  };

  const handleWhatsAppClick = (eventType) => {
    const message = encodeURIComponent(`Hola! Me interesa organizar un evento de tipo: ${eventType}. ¿Podrían contarme más detalles sobre los servicios, precios y disponibilidad?`);
    window.open(`https://wa.me/${eventData.whatsapp.replace('+', '')}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#eeff00]">
            {eventData.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {eventData.description}
          </p>
        </div>

        {/* Selector de categorías */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(eventData.categories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeCategory === key
                  ? 'bg-[#eeff00] text-black'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Contenido de la categoría activa */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              {eventData.categories[activeCategory].name}
            </h2>
            <p className="text-gray-300 text-lg">
              {eventData.categories[activeCategory].description}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {eventData.categories[activeCategory].events.map((event, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-[#eeff00]/30 transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-xl">
                <h3 className="text-xl font-bold text-[#eeff00] mb-3">{event.name}</h3>
                <p className="text-gray-300 mb-4">{event.description}</p>
                <div className="space-y-2 mb-6">
                  {event.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#eeff00] rounded-full"></div>
                      <span className="text-gray-400 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => handleWhatsAppClick(event.name)}
                  className="w-full bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-lg transition-all duration-300 text-sm font-semibold"
                >
                  Consultar este evento
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Servicios incluidos */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Servicios Incluidos</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {eventData.services.map((service, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#eeff00] rounded-full"></div>
                <span className="text-gray-300">{service}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contacto WhatsApp general */}
        <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-xl p-8 border border-green-700 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">¿Tienes una idea diferente?</h2>
          <p className="text-green-100 mb-6">
            Organizamos eventos personalizados según tus necesidades. ¡Cuéntanos tu idea y la haremos realidad!
          </p>
          <button 
            onClick={() => handleWhatsAppClick("Evento Personalizado")}
            className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-lg transition-all duration-300 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center gap-3 mx-auto"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            Planificar Evento Personalizado
          </button>
        </div>
      </div>
    </div>
  );
}