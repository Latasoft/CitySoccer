'use client';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Star,
  CalendarCheck,
} from "lucide-react";

const reservaOptions = [
  {
    title: "Fútbol 7",
    subtitle: "Cancha Profesional",
    description:
      "Cancha de fútbol 7 con césped sintético de última generación. Perfecta para equipos y grupos de amigos.",
    icon: Users,
    features: [
      "Césped Sintético",
      "Iluminación LED",
      "Capacidad 14 jugadores",
    ],
    price: "$25.000",
    duration: "60 min",
    color: "text-[#57AA32] bg-[#EAF7E7]",
  },
  {
    title: "Fútbol 9",
    subtitle: "Cancha Reglamentaria",
    description:
      "Cancha de fútbol 9 con medidas reglamentarias. Ideal para torneos y partidos más competitivos.",
    icon: Users,
    features: [
      "Medidas Reglamentarias",
      "Arcos Profesionales",
      "Capacidad 18 jugadores",
    ],
    price: "$35.000",
    duration: "90 min",
    color: "text-[#2D8EFF] bg-[#E7F1FA]",
  },
  {
    title: "Pickleball Individual",
    subtitle: "Cancha Single",
    description:
      "Cancha de pickleball para partidos individuales. Incluye raquetas y pelotas disponibles.",
    icon: Star,
    features: [
      "Superficie Especializada",
      "Red Reglamentaria",
      "Equipamiento Incluido",
    ],
    price: "$15.000",
    duration: "45 min",
    color: "text-[#F5A623] bg-[#FFF7E7]",
  },
  {
    title: "Pickleball Dobles",
    subtitle: "Cancha Doble",
    description:
      "Cancha de pickleball para partidos de dobles. Perfecta para grupos de 4 personas.",
    icon: Users,
    features: [
      "Para 4 Jugadores",
      "Marcación Profesional",
      "Vestuarios Incluidos",
    ],
    price: "$20.000",
    duration: "45 min",
    color: "text-[#57AA32] bg-[#EAF7E7]",
  },
];

const Reserva = () => (
  <section id="reserva" className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-black">Reserva tu</span>{" "}
          <span className="text-[#d6f13a]">Cancha</span>
        </h2>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Elige la cancha perfecta para tu próximo partido. Reserva fácil y rápido con disponibilidad en tiempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {reservaOptions.map((option, index) => {
          const Icon = option.icon;
          return (
            <div
              key={index}
              className="bg-[#f6f7fa] rounded-xl shadow-md hover:shadow-lg transition p-6 flex flex-col justify-between min-h-[420px] border border-gray-100"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg ${option.color.split(" ")[1]}`}
                  >
                    <Icon
                      className={`h-6 w-6 ${option.color.split(" ")[0]}`}
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">{option.price}</p>
                    <p className="text-sm text-gray-500">{option.duration}</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-1 text-gray-800">{option.title}</h3>
                <p className="text-sm text-[#57AA32] font-medium mb-3">
                  {option.subtitle}
                </p>
                <p className="text-gray-500 mb-4">{option.description}</p>
                
                <ul className="mb-6 space-y-2">
                  {option.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-sm text-gray-700"
                    >
                      <CheckCircle className="w-4 h-4 text-[#57AA32] mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Disponible 24/7</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>City Soccer</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 bg-[#57AA32] hover:bg-[#469026] text-white font-semibold py-2 rounded-lg transition text-sm">
                  <CalendarCheck className="h-4 w-4" />
                  Arrendar Cancha
                </button>        
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <div className="bg-[#f6f7fa] rounded-xl p-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold mb-4 text-gray-800">¿Necesitas ayuda con tu reserva?</h3>
          <p className="text-gray-500 mb-6">
            Nuestro equipo está disponible para ayudarte a encontrar el horario perfecto
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-[#d6f13a] to-[#b6e23a] text-gray-800 font-bold py-3 px-6 rounded-full shadow hover:brightness-105 transition">
              <Phone className="h-5 w-5" />
              Llamar Ahora
            </button>
            <button className="inline-flex items-center gap-2 border-2 border-[#57AA32] text-[#57AA32] font-bold py-3 px-6 rounded-full hover:bg-[#57AA32] hover:text-white transition">
              <Mail className="h-5 w-5" />
              Enviar WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Reserva;