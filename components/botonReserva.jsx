'use client';
const BotonReserva = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
      <button
        className="text-2xl px-16 py-6 text-black rounded-lg font-black flex items-center gap-2 shadow-lg hover:opacity-90 transition-all duration-200 uppercase tracking-wider"
        style={{ 
          backgroundColor: "#FFED00",
          fontFamily: "Arial Black, Arial, sans-serif"
        }}
      >
        RESERVA HOY
      </button>
    </div>
  );
}

export default BotonReserva;