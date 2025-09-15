'use client';

import { useState } from 'react';
import { useTarifas } from './hooks/useTarifas';
import TarifasTable from './components/TarifasTable';
import CanchaImage from './components/CanchaImage';
import ErrorDisplay from './components/ErrorDisplay';
import ReservaForm from './components/ReservaForm';
import { canchasConfig, getTiposDisponibles } from './data/canchasConfig';

export default function TestPage() {
  const [tipoCancha, setTipoCancha] = useState('futbol7');
  const [reservaCompleta, setReservaCompleta] = useState(null);

  const tiposDisponibles = getTiposDisponibles();
  const config = canchasConfig[tipoCancha];
  const { data, error, loading } = useTarifas(tipoCancha);

  const handleCanchaChange = (nuevoTipo) => {
    setTipoCancha(nuevoTipo);
    setReservaCompleta(null);
  };

  const handleReservaCompleta = (reserva) => {
    setReservaCompleta(reserva);
    console.log('Reserva completada:', reserva);
  };

  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Tarifas de 
            <span className={`${config.color === 'yellow' ? 'text-yellow-500' : config.color === 'blue' ? 'text-blue-500' : 'text-green-500'} ml-2`}>
              {config.title}
            </span>
          </h1>
          <p className="text-slate-600">{config.description}</p>
        </div>

        {/* Selector de tipo de cancha */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6 border">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Seleccionar Tipo de Cancha</h3>
          <div className="flex gap-4 flex-wrap">
            {tiposDisponibles.map(tipo => {
              const tipoConfig = canchasConfig[tipo.value];
              const colorClass = tipoConfig.color === 'yellow' ? 'yellow' : tipoConfig.color === 'blue' ? 'blue' : 'green';
              
              return (
                <button 
                  key={tipo.value}
                  onClick={() => handleCanchaChange(tipo.value)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    tipoCancha === tipo.value 
                      ? `bg-${colorClass}-500 text-white shadow-lg scale-105` 
                      : `bg-${colorClass}-100 text-${colorClass}-800 hover:bg-${colorClass}-200`
                  }`}
                >
                  {tipo.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid layout: tabla + imagen */}
        <div className="grid grid-cols-12 gap-8 items-start mb-8">
          <TarifasTable data={data} colorScheme={config.color} />
          <CanchaImage 
            src={config.image} 
            alt={config.imageAlt} 
          />
        </div>

        {/* Sistema de Reservas */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Reserva tu Cancha</h2>
          <ReservaForm 
            tipoCancha={tipoCancha}
            onReservaCompleta={handleReservaCompleta}
          />
        </div>

        {/* Mostrar reserva completada */}
        {reservaCompleta && (
          <div className="mt-8 p-4 bg-green-100 border border-green-300 rounded-lg">
            <h3 className="font-bold text-green-800">¡Reserva Exitosa!</h3>
            <p>ID: {reservaCompleta.id}</p>
            <p>Total: ${reservaCompleta.precio?.toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
