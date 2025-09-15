'use client';

import { useState } from 'react';
import { useTarifas } from './hooks/useTarifas';
import TarifasTable from './components/TarifasTable';
import CanchaImage from './components/CanchaImage';
import ErrorDisplay from './components/ErrorDisplay';
import { canchaConfig } from './data/canchaConfig';
import ReservaSystem from './components/ReservaSystem';

export default function TestPage() {
  // Estado para manejar el tipo de cancha seleccionado
  const [tipoCancha, setTipoCancha] = useState('futbol7');
  const [reservaCompleta, setReservaCompleta] = useState(null);

  // Definir los tipos disponibles
  const tiposDisponibles = [
    { value: 'futbol7', label: 'Fútbol 7' },
    { value: 'futbol9', label: 'Fútbol 9' },
    { value: 'pickleball-individual', label: 'Pickleball Individual' },
    { value: 'pickleball-dobles', label: 'Pickleball Dobles' }
  ];

  const config = canchaConfig[tipoCancha];
  const { data, error, loading } = useTarifas(tipoCancha);

  // Función para cambiar el tipo de cancha
  const handleCanchaChange = (nuevoTipo) => {
    setTipoCancha(nuevoTipo);
  };

  const handleReservaCompleta = (reserva) => {
    setReservaCompleta(reserva);
    // Aquí podrías mostrar un mensaje de éxito o redirigir
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

        {/* Panel de pruebas - Movido arriba para mejor UX */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6 border">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Seleccionar Tipo de Cancha</h3>
          <div className="flex gap-4 flex-wrap">
            <button 
              onClick={() => handleCanchaChange('futbol7')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                tipoCancha === 'futbol7' 
                  ? 'bg-yellow-500 text-white shadow-lg scale-105' 
                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              }`}
            >
              Fútbol 7
            </button>
            <button 
              onClick={() => handleCanchaChange('futbol9')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                tipoCancha === 'futbol9' 
                  ? 'bg-blue-500 text-white shadow-lg scale-105' 
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              Fútbol 9
            </button>
            <button 
              onClick={() => handleCanchaChange('pickleball-individual')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                tipoCancha === 'pickleball-individual' 
                  ? 'bg-green-500 text-white shadow-lg scale-105' 
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              Pickleball Individual
            </button>
            <button 
              onClick={() => handleCanchaChange('pickleball-dobles')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                tipoCancha === 'pickleball-dobles' 
                  ? 'bg-green-500 text-white shadow-lg scale-105' 
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              Pickleball Dobles
            </button>
          </div>
        </div>

        {/* Grid layout: tabla + imagen */}
        <div className="grid grid-cols-12 gap-8 items-start">
          <TarifasTable data={data} colorScheme={config.color} />
          <CanchaImage 
            src={config.image} 
            alt={config.imageAlt} 
          />
        </div>

        {/* Sistema de Reservas - Siempre visible */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Reserva tu Cancha</h2>
          <div className="mb-6">
            <label htmlFor="tipoCancha" className="block mb-2">
              Selecciona el tipo de cancha:
            </label>
            <select
              id="tipoCancha"
              value={tipoCancha}
              onChange={(e) => setTipoCancha(e.target.value)}
              className="border rounded px-3 py-2 w-full max-w-md"
            >
              <option value="">-- Selecciona --</option>
              {tiposDisponibles.map(tipo => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          {tipoCancha && (
            <ReservaSystem 
              tipoCancha={tipoCancha}
              onReservaCompleta={handleReservaCompleta}
            />
          )}

          {reservaCompleta && (
            <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded">
              <h3 className="font-bold text-green-800">¡Reserva Exitosa!</h3>
              <p>Cancha: {reservaCompleta.tipo_cancha}</p>
              <p>Fecha: {reservaCompleta.fecha}</p>
              <p>Precio: ${reservaCompleta.precio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
