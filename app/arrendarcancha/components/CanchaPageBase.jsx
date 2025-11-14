"use client";

import { useState } from "react";
import { usePrices } from "@/hooks/usePrices";
import { useScheduleConfig } from "@/hooks/useScheduleConfig";
import EditableContent from "@/components/EditableContent";

const CanchaPageBase = ({ 
  tipoCancha, 
  titulo, 
  colorPrimario = "#eeff00", 
  ArrendamientoComponent,
  mostrarEquipos = false // Cambiado a false por defecto ya que no tienes equipos en BD
}) => {
  const [showReservation, setShowReservation] = useState(false);

  // Mapeo de nombres de tipos de cancha para la BD
  const mapTipoCancha = (tipo) => {
    // Los tipos ya vienen correctos desde las páginas, no necesitamos mapeo
    // Tipos válidos: 'futbol7', 'futbol9', 'pickleball', 'pickleball-dobles'
    return tipo;
  };

  const tipoBD = mapTipoCancha(tipoCancha);
  const { precios: tarifas, loading, error } = usePrices(tipoBD);
  const { isWeekdaysActive, isSaturdayActive, isSundayActive, loading: loadingConfig } = useScheduleConfig();

  if (showReservation) {
    return (
      <ArrendamientoComponent 
        onBack={() => setShowReservation(false)} 
        tipoCancha={tipoCancha}
        tarifasPreCargadas={tarifas}
      />
    );
  }

  if (loading || loadingConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Cargando tarifas...</div>
      </div>
    );
  }

  if (error || !tarifas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 flex items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <div className="text-red-400 text-2xl font-bold mb-4">
            ⚠️ Error al cargar precios
          </div>
          <div className="text-gray-300 text-lg mb-6">
            {error || `No se encontraron precios configurados para ${titulo}`}
          </div>
          <div className="text-gray-400 text-sm">
            Por favor, configura los precios en el Dashboard de Administración para el tipo: <span className="font-mono text-yellow-400">{tipoBD}</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <EditableContent 
          pageKey={`arriendo_${tipoCancha}`}
          fieldKey="page_title"
          fieldType="text"
          defaultValue={titulo}
          as="h1"
          className="text-4xl font-bold mb-8 text-center"
          style={{ color: colorPrimario }}
        />

        {/* Descripción editable */}
        <EditableContent 
          pageKey={`arriendo_${tipoCancha}`}
          fieldKey="page_description"
          fieldType="textarea"
          defaultValue="Reserva tu cancha de forma rápida y segura. Elige el horario que más te acomode."
          as="p"
          className="text-gray-300 text-center mb-8 max-w-2xl mx-auto"
        />

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
                    {isWeekdaysActive && (
                      <th className="border border-gray-700 px-4 py-2 text-white">
                        Lunes a Viernes
                      </th>
                    )}
                    {isSaturdayActive && (
                      <th className="border border-gray-700 px-4 py-2 text-white">
                        Sábado
                      </th>
                    )}
                    {isSundayActive && (
                      <th className="border border-gray-700 px-4 py-2 text-white">
                        Domingo y Festivos
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(tarifas.weekdays).map(([time, prices]) => (
                    <tr key={time} className="hover:bg-gray-700/50 transition-colors">
                      <td className="border border-gray-700 px-4 py-2 font-semibold text-gray-300">
                        {time}
                      </td>
                      {isWeekdaysActive && (
                        <td className="border border-gray-700 px-4 py-2 font-medium" style={{ color: colorPrimario }}>
                          ${prices.price.toLocaleString()}
                        </td>
                      )}
                      {isSaturdayActive && (
                        <td className="border border-gray-700 px-4 py-2 font-medium" style={{ color: colorPrimario }}>
                          ${tarifas.saturday[time]?.price.toLocaleString() || 'N/A'}
                        </td>
                      )}
                      {isSundayActive && (
                        <td className="border border-gray-700 px-4 py-2 font-medium" style={{ color: colorPrimario }}>
                          ${tarifas.sunday[time]?.price.toLocaleString() || 'N/A'}
                        </td>
                      )}
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