"use client";

import { useState, useEffect } from "react";
import { pricesData } from "../data/pricesData";
import ArrendarF7 from "../components/arrendarf7";

export default function Futbol7Page() {
  const [showReservation, setShowReservation] = useState(false);
  const [tarifas, setTarifas] = useState(null);
  const [loading, setLoading] = useState(true);

  const sportData = pricesData.futbol7; // Para equipos y nombre

  useEffect(() => {
    const fetchTarifas = async () => {
      try {
        const response = await fetch('/api/tarifas?tipo_cancha=futbol7');
        const data = await response.json();
        
        if (data.tarifas) {
          // Transformar los datos para que coincidan con la estructura esperada
          const tarifasFormateadas = transformarTarifas(data.tarifas);
          setTarifas(tarifasFormateadas);
        }
      } catch (error) {
        console.error('Error cargando tarifas:', error);
        // Fallback a pricesData si hay error
        setTarifas(sportData.schedule);
      } finally {
        setLoading(false);
      }
    };

    fetchTarifas();
  }, []);

  const transformarTarifas = (tarifasDB) => {
    const horarios = {};
    
    // Crear estructura de horarios
    tarifasDB.forEach(tarifa => {
      const hora = tarifa.hora_inicio.substring(0, 5); // "09:00:00" -> "09:00"
      
      if (!horarios[hora]) {
        horarios[hora] = {};
      }
      
      // Mapear días de semana
      if (tarifa.dia_semana === 1) { // Lunes a Viernes
        horarios[hora].weekdays = tarifa.precio;
      } else if (tarifa.dia_semana === 6) { // Sábado
        horarios[hora].saturday = tarifa.precio;
      } else if (tarifa.dia_semana === 0) { // Domingo
        horarios[hora].sunday = tarifa.precio;
      }
    });

    return {
      weekdays: Object.fromEntries(
        Object.entries(horarios).map(([hora, precios]) => [
          hora, { price: precios.weekdays || 0 }
        ])
      ),
      saturday: Object.fromEntries(
        Object.entries(horarios).map(([hora, precios]) => [
          hora, { price: precios.saturday || 0 }
        ])
      ),
      sunday: Object.fromEntries(
        Object.entries(horarios).map(([hora, precios]) => [
          hora, { price: precios.sunday || 0 }
        ])
      )
    };
  };

  if (showReservation) {
    return <ArrendarF7 onBack={() => setShowReservation(false)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Cargando tarifas...</div>
      </div>
    );
  }

  // Usar tarifas de DB si están disponibles, sino usar pricesData como fallback
  const scheduleData = tarifas || sportData.schedule;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-[#eeff00]">
          {sportData.name}
        </h1>

        {/* Botón para ir a reservar */}
        <div className="mb-8 text-center">
          <button
            onClick={() => setShowReservation(true)}
            className="bg-gradient-to-br from-[#ffee00] to-[#e6d000] text-black px-8 py-4 rounded-lg hover:scale-105 transition-all duration-300 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-2 border-transparent hover:border-white/20"
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
                  {Object.entries(scheduleData.weekdays).map(
                    ([time, prices]) => (
                      <tr key={time} className="hover:bg-gray-700/50 transition-colors">
                        <td className="border border-gray-700 px-4 py-2 font-semibold text-gray-300">
                          {time}
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-[#eeff00] font-medium">
                          ${prices.price.toLocaleString()}
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-[#eeff00] font-medium">
                          $
                          {scheduleData.saturday[
                            time
                          ]?.price.toLocaleString()}
                        </td>
                        <td className="border border-gray-700 px-4 py-2 text-[#eeff00] font-medium">
                          $
                          {scheduleData.sunday[
                            time
                          ]?.price.toLocaleString()}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Equipos disponibles */}
        <div className="mt-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700 p-6">
            <h3 className="text-xl font-bold mb-4 text-white">
              Equipos Disponibles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(sportData.equipment).map(([key, item]) => (
                <div
                  key={key}
                  className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 rounded-lg border border-gray-600 hover:border-[#ffee00]/30 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <p className="font-semibold text-gray-300">{item.name}</p>
                  <p className="text-[#eeff00] text-lg font-bold">
                    ${item.price.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
