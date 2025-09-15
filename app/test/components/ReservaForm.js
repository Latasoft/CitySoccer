'use client';

import { useState } from 'react';
import { useReservas } from '../hooks/useReservas';

const ReservaForm = ({ tipoCancha, onReservaCompleta }) => {
  const {
    config,
    loading,
    error,
    horariosDisponibles,
    reservaActual,
    actualizarReserva,
    confirmarReserva
  } = useReservas(tipoCancha);

  const [mostrarResumen, setMostrarResumen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reservaActual.canchaId || !reservaActual.fecha || !reservaActual.horario) {
      alert('Por favor completa todos los campos');
      return;
    }

    const resultado = await confirmarReserva();
    if (resultado.success) {
      onReservaCompleta(resultado.reserva);
      setMostrarResumen(true);
    }
  };

  if (!config) return null;

  const colorClasses = {
    yellow: {
      primary: 'bg-yellow-500 hover:bg-yellow-600 text-white',
      secondary: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      border: 'border-yellow-200'
    },
    blue: {
      primary: 'bg-blue-500 hover:bg-blue-600 text-white',
      secondary: 'bg-blue-100 text-blue-800 border-blue-300',
      border: 'border-blue-200'
    },
    green: {
      primary: 'bg-green-500 hover:bg-green-600 text-white',
      secondary: 'bg-green-100 text-green-800 border-green-300',
      border: 'border-green-200'
    }
  };

  const colors = colorClasses[config.color];

  if (mostrarResumen) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 border-2 ${colors.border}`}>
        <h3 className="text-xl font-bold mb-4 text-green-600">¡Reserva Confirmada!</h3>
        <div className="space-y-2">
          <p><strong>Tipo:</strong> {config.title}</p>
          <p><strong>Cancha:</strong> {config.canchas.find(c => c.id === reservaActual.canchaId)?.nombre}</p>
          <p><strong>Fecha:</strong> {reservaActual.fecha}</p>
          <p><strong>Horario:</strong> {reservaActual.horario}</p>
          <p><strong>Precio:</strong> ${reservaActual.precio?.toLocaleString()}</p>
        </div>
        <button
          onClick={() => setMostrarResumen(false)}
          className={`mt-4 px-4 py-2 rounded-lg ${colors.primary}`}
        >
          Nueva Reserva
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">
        Reservar {config.title}
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Selección de cancha */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Seleccionar Cancha:
          </label>
          <select
            value={reservaActual.canchaId}
            onChange={(e) => actualizarReserva('canchaId', e.target.value)}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-${config.color}-500`}
            required
          >
            <option value="">-- Selecciona una cancha --</option>
            {config.canchas.map(cancha => (
              <option key={cancha.id} value={cancha.id} disabled={!cancha.disponible}>
                {cancha.nombre} {!cancha.disponible && '(No disponible)'}
              </option>
            ))}
          </select>
        </div>

        {/* Selección de fecha */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Fecha:
          </label>
          <input
            type="date"
            value={reservaActual.fecha}
            onChange={(e) => actualizarReserva('fecha', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-${config.color}-500`}
            required
          />
        </div>

        {/* Selección de horario */}
        {horariosDisponibles.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Horario Disponible:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {horariosDisponibles.map(horario => (
                <button
                  key={horario.hora}
                  type="button"
                  onClick={() => actualizarReserva('horario', horario.hora)}
                  disabled={!horario.disponible}
                  className={`p-2 rounded text-sm ${
                    reservaActual.horario === horario.hora
                      ? colors.primary
                      : horario.disponible
                      ? `border ${colors.border} hover:${colors.secondary}`
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {horario.hora}
                  <br />
                  <span className="text-xs">
                    ${horario.precio?.toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Resumen del precio */}
        {reservaActual.precio > 0 && (
          <div className={`p-3 rounded-lg ${colors.secondary}`}>
            <p className="font-semibold">
              Total: ${reservaActual.precio.toLocaleString()}
            </p>
          </div>
        )}

        {/* Botón de confirmación */}
        <button
          type="submit"
          disabled={loading || !reservaActual.horario}
          className={`w-full py-3 px-4 rounded-lg font-medium ${colors.primary} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? 'Procesando...' : 'Confirmar Reserva'}
        </button>
      </form>
    </div>
  );
};

export default ReservaForm;