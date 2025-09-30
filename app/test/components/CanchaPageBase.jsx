"use client";

import { useState, useEffect } from "react";
import { obtenerTarifasPorTipo } from "../data/supabaseService";

const CanchaPageBase = ({ 
  tipoCancha, 
  titulo, 
  colorPrimario = "#eeff00", 
  ArrendamientoComponent,
  mostrarEquipos = false // Cambiado a false por defecto ya que no tienes equipos en BD
}) => {
  const [showReservation, setShowReservation] = useState(false);
  const [tarifas, setTarifas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapeo de nombres de tipos de cancha para la BD
  const mapTipoCancha = (tipo) => {
    const mapping = {
      'f7': 'futbol7', // Según tu BD, usas 'futbol7' no 'f7'
      'f9': 'futbol9', // Probablemente necesites 'futbol9' en tu BD
      'pickleball': 'pickleball',
      'futbol7': 'futbol7',
      'futbol9': 'futbol9'
    };
    return mapping[tipo] || tipo;
  };

  useEffect(() => {
    const fetchTarifas = async () => {
      try {
        setLoading(true);
        const tipoBD = mapTipoCancha(tipoCancha);
        
        console.log('Buscando tarifas para tipo:', tipoBD);
        const tarifasDB = await obtenerTarifasPorTipo(tipoBD);
        
        if (tarifasDB && Object.keys(tarifasDB.weekdays || {}).length > 0) {
          console.log('Tarifas encontradas:', tarifasDB);
          setTarifas(tarifasDB);
        } else {
          throw new Error(`No se encontraron tarifas para ${tipoBD} en la base de datos`);
        }
      } catch (error) {
        console.error('Error cargando tarifas:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTarifas();
  }, [tipoCancha]);

  if (showReservation) {
    return (
      <ArrendamientoComponent 
        onBack={() => setShowReservation(false)} 
        tipoCancha={tipoCancha}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Cargando tarifas...</div>
      </div>
    );
  }

  if (error || !tarifas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-red-400 text-xl">
          Error cargando tarifas: {error || 'No se encontraron tarifas'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: colorPrimario }}>
          {titulo}
        </h1>

        {/* Botón para ir a reservar */}
        <div className="mb-8 text-center">
          <button
            onClick={() => setShowReservation(true)}
            className="px-8 py-4 rounded-lg hover:scale-105 transition-all duration-300 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2 border-transparent hover:border-white/20"
            style={{ 
              background: `linear-gradient(to bottom right, ${colorPrimario}, ${colorPrimario}dd)`,
              color: colorPrimario === "#eeff00" ? "black" : "white"
            }}
          >
            Reservar Ahora
          </button>
        </div>

        {/* Tabla de horarios y precios */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700 p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Horarios y Precios
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-900 to-gray-800">
                    <th className="border border-gray-700 px-4 py-2 text-white">
                      Horario
                    </th>
                    <th className="border border-gray-700 px-4 py-2 text-white">
                      Lunes a Viernes
                    </th>
                    <th className="border border-gray-700 px-4 py-2 text-white">
                      Sábado
                    </th>
                    <th className="border border-gray-700 px-4 py-2 text-white">
                      Domingo y Festivos
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(tarifas.weekdays).map(([time, prices]) => (
                    <tr key={time} className="hover:bg-gray-700/50 transition-colors">
                      <td className="border border-gray-700 px-4 py-2 font-semibold text-gray-300">
                        {time}
                      </td>
                      <td className="border border-gray-700 px-4 py-2 font-medium" style={{ color: colorPrimario }}>
                        ${prices.price.toLocaleString()}
                      </td>
                      <td className="border border-gray-700 px-4 py-2 font-medium" style={{ color: colorPrimario }}>
                        ${tarifas.saturday[time]?.price.toLocaleString() || 'N/A'}
                      </td>
                      <td className="border border-gray-700 px-4 py-2 font-medium" style={{ color: colorPrimario }}>
                        ${tarifas.sunday[time]?.price.toLocaleString() || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanchaPageBase;