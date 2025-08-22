import { Users, Target, Award, Heart } from "lucide-react";
import BotonReserva from "@/components/botonReserva";
import Image from "next/image";

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
      url: "/iconUSA.jpeg",
      instagram: "https://instagram.com/cswestpalm",
    },
    {
      name: "CS Port Saint Lucie",
      country: "USA",
      url: "/iconUSA.jpeg",
      instagram: "https://instagram.com/csportsaintlucie",
    },
    {
      name: "CS Punta del Este",
      country: "Uruguay",
      url: "/iconURU.jpeg",
      instagram: "https://instagram.com/cspuntadeleste",
    },
  ];

  const handlePartnershipClick = (instagramUrl) => {
    window.open(instagramUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="quienes-somos"
      className="py-20 bg-gradient-to-br from-black  via-gray-900 to-gray-950 overflow-hidden"
    >
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Header Section */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-[#eeff00] leading-tight">
            SOBRE CITY SOCCER
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Más que un centro deportivo, somos una familia unida por la pasión
              del fútbol.
            </p>
          </div>
        </div>



        {/* Call to Action */}
        <div className="mb-20">
          <BotonReserva />
        </div>

        {/* Partnerships Section */}
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-4 text-white">
            Nuestras Alianzas
          </h3>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
            Colaboramos con centros deportivos de clase mundial para ofrecer la
            mejor experiencia
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {partnerships.map((partnership, index) => (
              <button
                key={index}
                onClick={() => handlePartnershipClick(partnership.instagram)}
                className="group bg-gradient-to-br from-[#ffee00] to-[#e6d000] rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-white/20 cursor-pointer w-full"
              >
                <div className="w-30 h-20 bg-white/20 backdrop-blur-sm rounded-lg mx-auto mb-6 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={partnership.url}
                    alt={partnership.country}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-xl font-bold text-gray-900 group-hover:text-black transition-colors mb-2">
                  {partnership.name}
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-700 group-hover:text-black transition-colors">
                  <Image
                    src="/images/instagram.svg"
                    alt="Instagram"
                    width={20}
                    height={20}
                    className="group-hover:scale-110 transition-transform duration-300 filter brightness-0"
                  />
                  <span className="text-sm font-medium">Instagram</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
