import { Users, Target, Award, Heart } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Excelencia Deportiva",
      description: "Instalaciones de primer nivel para una experiencia deportiva excepcional."
    },
    {
      icon: Users,
      title: "Comunidad",
      description: "Creamos espacios donde las familias y deportistas se conectan."
    },
    {
      icon: Award,
      title: "Profesionalismo",
      description: "Técnicos certificados y servicios de la más alta calidad."
    },
    {
      icon: Heart,
      title: "Pasión por el Deporte",
      description: "Promovemos el amor por el fútbol y los deportes de raqueta."
    }
  ];

  const partnerships = [
    {
      name: "CS West Palm",
      icon: "/iconUSA.jpeg",
      country: "USA"
    },
    {
      name: "CS Port Saint Lucie",
      icon: "/iconUSA.jpeg",
      country: "USA"
    },
    {
      name: "CS Punta del Este",
      icon: "/iconURU.jpeg",
      country: "Uruguay"
    },
    {
      name: "Kings League",
      icon: "/iconUSA.jpeg",
      country: "USA"
    }
  ];

  return (
    <section id="quienes-somos" className="py-20 bg-[#ECECEA]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#3B3F44]">
              Quiénes <span className="text-[#57AA32]">Somos</span>
            </h2>
            <p className="text-lg text-[#3B3F44] mb-6">
              City Soccer es más que un centro deportivo. Somos una comunidad comprometida con 
              brindar las mejores instalaciones y servicios para que vivas tu pasión por el deporte.
            </p>
            <p className="text-lg text-[#3B3F44] mb-8">
              Con años de experiencia en el sector deportivo, ofrecemos canchas de fútbol y 
              pickleball de última generación, programas de entrenamiento profesional y 
              eventos que fortalecen la comunidad deportiva.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-3 bg-[#57AA32] text-white font-semibold rounded-lg hover:bg-[#4a9429] transition-colors">
                Conoce Nuestras Instalaciones
              </button>
            </div>
          </div>

          {/* Right Content - Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow group p-6 text-center">
                  <div className="mx-auto w-12 h-12 bg-transparent rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-[#57AA32]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-[#3B3F44]">{value.title}</h3>
                  <p className="text-sm text-[#3B3F44]">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Partnerships Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold mb-8 text-[#3B3F44]">Nuestras Alianzas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {partnerships.map((partnership, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                <img 
                  src={partnership.icon} 
                  alt={`${partnership.country} flag`}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="text-lg font-medium text-[#3B3F44]">{partnership.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;