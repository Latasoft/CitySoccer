import React from 'react';


const QuienessomosComponent = () => {

  const partnerships = [
    {
      name: "City Soccer, West Palm",
      country: "Florida, EE.UU.",
      url: "/iconUSA.png",
      instagram: "https://www.instagram.com/citysoccerfc/",
    },
    {
      name: "City Soccer, Saint Lucie",
      country: "Florida, EE.UU.",
      url: "/iconUSA.png",
      instagram: "https://www.instagram.com/citysoccerfc/",
    },
    {
      name: "City Soccer, San Carlos",
      country: "Uruguay",
      url: "/iconURU.png",
      instagram: "https://www.instagram.com/citysoccer.uy/",
    }
  ];

  const handlePartnershipClick = (instagramUrl) => {
    window.open(instagramUrl, "_blank", "noopener,noreferrer");
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hola! Me gustaría conocer más sobre City Soccer y sus servicios.");
    window.open(`https://wa.me/56912345678?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-green-900 to-emerald-800 min-h-screen flex items-center pb-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Texto del Hero */}
            <div className="flex flex-col gap-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-white uppercase">
                <span className="text-green-400">Sobre </span>
                <span className="text-blue-400">City Soccer</span>
              </h1>

              <div className="flex flex-col gap-6 text-gray-300">
                <p className="text-xl leading-relaxed">
                  Más que un centro deportivo, somos una familia unida por la pasión del fútbol.
                  En City Soccer creamos espacios donde el deporte se vive con profesionalismo,
                  diversión y valores que trascienden las canchas.
                </p>
              </div>

              <button
                onClick={handleWhatsAppClick}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-full text-base uppercase tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/40 self-start"
              >
                Contáctanos
              </button>
            </div>

            {/* Grid de Imágenes */}
            <div className="flex justify-center items-center">
              <div className="grid grid-cols-2 gap-12 w-full max-w-2xl">
                <img
                  src="/Cancha1.jpeg"
                  alt="Instalaciones City Soccer"
                  className="w-full h-[500px] object-cover rounded-xl shadow-2xl shadow-black/50 transition-transform duration-300 hover:scale-105 hover:shadow-3xl"
                />
                <img
                  src="/Pelota.jpg"
                  alt="Pasión por el fútbol"
                  className="w-full h-[500px] object-cover rounded-xl shadow-2xl shadow-black/50 transition-transform duration-300 hover:scale-105 hover:shadow-3xl"
                />

              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Alianzas Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Nuestras Alianzas</h2>
            <p className="text-xl text-gray-300">Colaboramos con centros deportivos de clase mundial</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partnerships.map((partnership, index) => (
              <div key={index} className="bg-gray-700 rounded-xl p-6 hover:bg-gray-600 transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="w-28 h-20   rounded-lg mx-auto mb-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={partnership.url}
                      alt={partnership.country}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{partnership.name}</h3>
                  <p className="text-gray-300 mb-4">{partnership.country}</p>
                  <button
                    onClick={() => handlePartnershipClick(partnership.instagram)}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-300 text-sm"
                  >
                    Ver Instagram
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
};

export default QuienessomosComponent;
