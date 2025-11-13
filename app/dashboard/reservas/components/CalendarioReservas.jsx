'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, User, Mail, Phone, MapPin } from 'lucide-react';

export default function CalendarioReservas({ reservas = [], canchas = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDayReservas, setSelectedDayReservas] = useState([]);

  // Obtener el primer y último día del mes
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // Obtener el día de la semana del primer día (0 = domingo)
  const startingDayOfWeek = firstDayOfMonth.getDay();
  
  // Total de días en el mes
  const daysInMonth = lastDayOfMonth.getDate();
  
  // Generar array de días para el calendario
  const calendarDays = [];
  
  // Días vacíos al inicio
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Función para obtener reservas de un día específico
  const getReservasDelDia = (day) => {
    if (!day) return [];
    
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    return reservas.filter(r => r.fecha === dateStr);
  };

  // Función para manejar click en día
  const handleDayClick = (day) => {
    if (!day) return;
    
    const reservasDelDia = getReservasDelDia(day);
    if (reservasDelDia.length === 0) return;
    
    setSelectedDay(day);
    setSelectedDayReservas(reservasDelDia);
  };

  // Cerrar modal de día
  const closeDayModal = () => {
    setSelectedDay(null);
    setSelectedDayReservas([]);
  };

  // Navegar entre meses
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Función para formatear nombre de cancha
  const formatNombreCancha = (cancha) => {
    if (!cancha) return 'Cancha desconocida';
    
    if (cancha.nombre && cancha.nombre.toLowerCase().includes('cancha')) {
      return cancha.nombre;
    }
    
    if (cancha.nombre && cancha.nombre.match(/^[a-zA-Z]+\d*_\d+$/)) {
      const parts = cancha.nombre.split('_');
      const tipo = parts[0].toUpperCase();
      const numero = parts[1];
      return `Cancha ${numero} ${tipo}`;
    }
    
    if (cancha.tipo && cancha.nombre) {
      return `Cancha ${cancha.nombre} ${cancha.tipo}`;
    }
    
    return cancha.nombre || 'Cancha';
  };

  // Nombres de los meses
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Días de la semana
  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Verificar si es hoy
  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="space-y-4">
      {/* Header del calendario */}
      <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-700 rounded-lg transition"
          title="Mes anterior"
        >
          <ChevronLeft className="w-5 h-5 text-gray-300" />
        </button>
        
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#ffee00]">
            {meses[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={goToToday}
            className="text-sm text-gray-400 hover:text-[#ffee00] transition mt-1"
          >
            Ir a hoy
          </button>
        </div>
        
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-700 rounded-lg transition"
          title="Mes siguiente"
        >
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </button>
      </div>

      {/* Calendario */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
        {/* Encabezado días de la semana */}
        <div className="grid grid-cols-7 bg-gray-800/70">
          {diasSemana.map((dia, idx) => (
            <div
              key={idx}
              className="text-center text-sm font-semibold text-gray-300 py-3 border-b border-gray-700"
            >
              {dia}
            </div>
          ))}
        </div>

        {/* Días del calendario */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, idx) => {
            const reservasDelDia = getReservasDelDia(day);
            const hasReservas = reservasDelDia.length > 0;

            return (
              <div
                key={idx}
                onClick={() => handleDayClick(day)}
                className={`min-h-[100px] border-b border-r border-gray-700/50 p-2 ${
                  !day ? 'bg-gray-900/30' : 'bg-gray-800/20 hover:bg-gray-700/30 transition cursor-pointer'
                } ${isToday(day) ? 'ring-2 ring-[#ffee00] ring-inset' : ''}`}
              >
                {day && (
                  <>
                    <div className={`text-sm font-semibold mb-1 ${
                      isToday(day) ? 'text-[#ffee00]' : 'text-gray-300'
                    }`}>
                      {day}
                    </div>
                    
                    {/* Indicador de reservas */}
                    {reservasDelDia.length > 0 && (
                      <div className="space-y-1">
                        {reservasDelDia.slice(0, 2).map((reserva) => (
                          <div
                            key={reserva.id}
                            className={`text-xs p-1 rounded ${
                              reserva.estado === 'confirmada'
                                ? 'bg-green-600/40 text-green-200 border border-green-600/50'
                                : reserva.estado === 'pendiente'
                                ? 'bg-yellow-600/40 text-yellow-200 border border-yellow-600/50'
                                : 'bg-red-600/40 text-red-200 border border-red-600/50'
                            }`}
                          >
                            <div className="font-semibold truncate">{reserva.hora_inicio}</div>
                          </div>
                        ))}
                        
                        {reservasDelDia.length > 2 && (
                          <div className="text-xs text-center py-1 bg-gray-700/50 rounded text-gray-300 font-semibold">
                            +{reservasDelDia.length - 2} más
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de reservas del día */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-3xl w-full border border-gray-700 shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div>
                <h3 className="text-lg font-bold text-[#ffee00]">
                  Reservas del {selectedDay} de {meses[currentDate.getMonth()]}
                </h3>
                <p className="text-sm text-gray-400">{selectedDayReservas.length} reserva(s)</p>
              </div>
              <button
                onClick={closeDayModal}
                className="p-1 hover:bg-gray-700 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>
            </div>

            {/* Lista de reservas */}
            <div className="p-4 overflow-y-auto flex-1">
              <div className="space-y-3">
                {selectedDayReservas.map((reserva) => (
                  <div
                    key={reserva.id}
                    className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:bg-gray-700/70 transition cursor-pointer"
                    onClick={() => {
                      setSelectedReserva(reserva);
                      closeDayModal();
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* Hora y estado */}
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[#ffee00] font-bold text-lg">{reserva.hora_inicio}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            reserva.estado === 'confirmada'
                              ? 'bg-green-600/30 text-green-300 border border-green-600/50'
                              : reserva.estado === 'pendiente'
                              ? 'bg-yellow-600/30 text-yellow-300 border border-yellow-600/50'
                              : 'bg-red-600/30 text-red-300 border border-red-600/50'
                          }`}>
                            {reserva.estado}
                          </span>
                        </div>

                        {/* Cliente */}
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-200 font-medium">
                            {reserva.clientes?.nombre || 'Sin nombre'}
                          </span>
                        </div>

                        {/* Correo */}
                        {reserva.clientes?.correo && (
                          <div className="flex items-center gap-2 mb-1">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300 text-sm">
                              {reserva.clientes.correo}
                            </span>
                          </div>
                        )}

                        {/* Teléfono */}
                        {reserva.clientes?.telefono && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300 text-sm">
                              {reserva.clientes.telefono}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Cancha */}
                      <div className="text-right">
                        <div className="flex items-center gap-1 justify-end mb-1">
                          <MapPin className="w-4 h-4 text-[#ffee00]" />
                          <span className="text-gray-200 font-semibold text-sm">
                            {formatNombreCancha(reserva.canchas)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Click para más detalles
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={closeDayModal}
                className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalle de reserva individual */}
      {selectedReserva && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full border border-gray-700 shadow-2xl">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-bold text-[#ffee00]">Detalle de Reserva</h3>
              <button
                onClick={() => setSelectedReserva(null)}
                className="p-1 hover:bg-gray-700 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-4 space-y-4">
              {/* Estado */}
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  selectedReserva.estado === 'confirmada'
                    ? 'bg-green-600/30 text-green-300 border border-green-600/50'
                    : selectedReserva.estado === 'pendiente'
                    ? 'bg-yellow-600/30 text-yellow-300 border border-yellow-600/50'
                    : 'bg-red-600/30 text-red-300 border border-red-600/50'
                }`}>
                  {selectedReserva.estado}
                </span>
              </div>

              {/* Fecha y hora */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Fecha</div>
                  <div className="text-gray-200 font-semibold">
                    {selectedReserva.fecha}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Hora</div>
                  <div className="text-gray-200 font-semibold">
                    {selectedReserva.hora_inicio}
                  </div>
                </div>
              </div>

              {/* Cancha */}
              <div>
                <div className="text-xs text-gray-400 mb-1">Cancha</div>
                <div className="flex items-center gap-2 text-gray-200">
                  <MapPin className="w-4 h-4 text-[#ffee00]" />
                  <span className="font-semibold">
                    {formatNombreCancha(selectedReserva.canchas)}
                  </span>
                </div>
              </div>

              {/* Información del cliente */}
              <div className="border-t border-gray-700 pt-4">
                <div className="text-sm font-semibold text-gray-300 mb-3">Información del Cliente</div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-400">Nombre</div>
                      <div className="text-gray-200">{selectedReserva.clientes?.nombre || 'Sin nombre'}</div>
                    </div>
                  </div>

                  {selectedReserva.clientes?.correo && (
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-gray-400">Correo</div>
                        <div className="text-gray-200 break-all">{selectedReserva.clientes.correo}</div>
                      </div>
                    </div>
                  )}

                  {selectedReserva.clientes?.telefono && (
                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-gray-400">Teléfono</div>
                        <div className="text-gray-200">{selectedReserva.clientes.telefono}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Fecha de creación */}
              {selectedReserva.creado_en && (
                <div className="text-xs text-gray-400 pt-2 border-t border-gray-700">
                  Reserva creada: {new Date(selectedReserva.creado_en).toLocaleString('es-CL')}
                </div>
              )}
            </div>

            {/* Footer del modal */}
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={() => setSelectedReserva(null)}
                className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
