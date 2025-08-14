import {
  Calendar,
  Users,
  Trophy,
  GraduationCap,
  PartyPopper,
  Coffee,
  MapPin,
  Clock,
} from "lucide-react";

const services = [
  {
    title: "Arriendo de Canchas",
    subtitle: "Fútbol y Pickleball",
    description:
      "Canchas profesionales de fútbol 7 y 9. Canchas de pickleball individuales y dobles con clases disponibles.",
    icon: Calendar,
    features: [
      "Fútbol 7 & 9",
      "Pickleball Single/Doble",
      "Clases de Pickleball",
    ],
    color: "text-[#57AA32] bg-[#EAF7E7]",
  },
  {
    title: "Academia Deportiva",
    subtitle: "City Soccer FC",
    description:
      "Programas de entrenamiento profesional para todas las edades. Escuela filial con técnicos certificados.",
    icon: GraduationCap,
    features: ["City Soccer FC", "Escuela Filial", "Entrenamientos"],
    color: "text-[#2D8EFF] bg-[#E7F1FA]",
  },
  {
    title: "Torneos",
    subtitle: "Competencias Oficiales",
    description:
      "Torneos regulars en categorías infantil, femenino y masculino. Participa en nuestra liga.",
    icon: Trophy,
    features: ["Categoría Infantil", "Femenino", "Masculino"],
    color: "text-[#F5A623] bg-[#FFF7E7]",
  },
  {
    title: "Campamentos",
    subtitle: "Summer Camp",
    description:
      "Campamentos deportivos de verano para niños y jóvenes. Diversión y aprendizaje garantizado.",
    icon: Users,
    features: [
      "Summer Camp",
      "Actividades Grupales",
      "Técnicos Especializados",
    ],
    color: "text-[#57AA32] bg-[#EAF7E7]",
  },
  {
    title: "Eventos",
    subtitle: "Celebraciones Especiales",
    description:
      "Organiza cumpleaños y eventos corporativos en nuestras instalaciones.",
    icon: PartyPopper,
    features: ["Cumpleaños", "Eventos Corporativos", "Celebraciones"],
    color: "text-[#2D8EFF] bg-[#E7F1FA]",
  },
  {
    title: "Sport Bar",
    subtitle: "Restaurante",
    description:
      "Disfruta de comida y bebidas mientras juegas o descansas. Ambiente deportivo único.",
    icon: Coffee,
    features: ["Comida Deportiva", "Bebidas", "Ambiente Familiar"],
    color: "text-[#57AA32] bg-[#EAF7E7]",
  },
];

const Servicios = () => (
  <section id="servicios" className="py-20 bg-[#f6f7fa]">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-black">Nuestros</span>{" "}
          <span className="text-[#d6f13a]">Servicios</span>
        </h2>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Descubre todo lo que City Soccer tiene para ofrecerte. Desde arriendo
          de canchas hasta eventos especiales.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 flex flex-col justify-between min-h-[370px] border border-gray-100"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg ${service.color.split(" ")[1]}`}
                  >
                    <Icon
                      className={`h-6 w-6 ${service.color.split(" ")[0]}`}
                    />
                  </div>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition">
                    <MapPin className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
                <h3 className="text-xl font-bold mb-1 text-gray-800">{service.title}</h3>
                <p className="text-sm text-[#57AA32] font-medium mb-3">
                  {service.subtitle}
                </p>
                <p className="text-gray-500 mb-4">{service.description}</p>
                <ul className="mb-6 space-y-1">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-sm text-gray-700"
                    >
                      <span className="w-2 h-2 bg-[#57AA32] rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 bg-[#57AA32] hover:bg-[#469026] text-white font-semibold py-2 rounded transition">
                  <Calendar className="h-4 w-4" />
                  Reservar
                </button>
                <button className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold py-2 px-3 rounded hover:bg-gray-100 transition">
                  <Clock className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <button className="inline-flex items-center gap-2 bg-gradient-to-r from-[#d6f13a] to-[#b6e23a] text-gray-800 font-bold py-3 px-8 rounded-full shadow hover:brightness-105 transition text-lg">
          <Calendar className="h-5 w-5" />
          Ver Todos los Horarios
        </button>
      </div>
    </div>
  </section>
);

export default Servicios;
