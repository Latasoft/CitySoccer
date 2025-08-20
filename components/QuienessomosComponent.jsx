import { Users, Target, Award, Heart } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Excelencia Deportiva",
      description:
        "Instalaciones de primer nivel para una experiencia deportiva excepcional.",
    },
    {
      icon: Users,
      title: "Comunidad",
      description:
        "Creamos espacios donde las familias y deportistas se conectan.",
    },
    {
      icon: Award,
      title: "Profesionalismo",
      description: "Técnicos certificados y servicios de la más alta calidad.",
    },
    {
      icon: Heart,
      title: "Pasión por el Deporte",
      description:
        "Promovemos el amor por el fútbol y los deportes de raqueta.",
    },
  ];

  const partnerships = [
    {
      name: "CS West Palm",
      country: "USA",
    },
    {
      name: "CS Port Saint Lucie",
      country: "USA",
    },
    {
      name: "CS Punta del Este",
      country: "Uruguay",
    },

  ];

  return (
    <section id="quienes-somos" className="py-20 bg-gray">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-[#eeff00] leading-tight">
            SOBRE CITY SOCCER
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-white mb-8 leading-relaxed">
              Más que un centro deportivo, somos una familia unida por la pasión del fútbol y los deportes de raqueta.
            </p>

          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12 text-[#3B3F44]">
            Nuestros Valores
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group p-8 text-center border border-gray-100"
                >
                  <div className="mx-auto w-16 h-16 bg-[#57AA32]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#57AA32]/20 transition-colors">
                    <IconComponent className="h-8 w-8 text-[#57AA32]" />
                  </div>
                  <h4 className="text-xl font-bold mb-4 text-[#3B3F44]">
                    {value.title}
                  </h4>
                  <p className="text-[#3B3F44]/70 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-20">
          <button className="px-10 py-4 bg-[#57AA32] text-white font-bold text-lg rounded-xl hover:bg-[#4a9429] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Conoce Nuestras Instalaciones
          </button>
        </div>

        {/* Partnerships Section */}
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-12 text-[#ffee00]">
            Nuestras Alianzas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {partnerships.map((partnership, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 opacity-80 hover:opacity-100"
              >
                <div className="w-12 h-8 bg-gray-200 rounded mx-auto mb-4 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">
                    {partnership.country}
                  </span>
                </div>
                <div className="text-lg font-semibold text-[#3B3F44]">
                  {partnership.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
