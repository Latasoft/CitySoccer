"use client";

import { useState, useEffect } from "react";
import { pricesData } from "../data/pricesData";
import {
  createReserva,
  testConnection,
  checkAvailability,
  getOccupiedSlots,
  getOccupiedFields,
} from "../data/supabaseService";

export default function ArrendarF7({ onBack }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [occupiedFields, setOccupiedFields] = useState([]);

  const sportData = pricesData.futbol7;

  // Verificar conexión al cargar el componente
  useEffect(() => {
    testConnection("reservas");
  }, []);

  // Cargar horarios ocupados cuando se selecciona una fecha
  useEffect(() => {
    if (selectedDate) {
      loadOccupiedSlots();
    }
  }, [selectedDate]);

  // Función para cargar horarios ocupados
  const loadOccupiedSlots = async () => {
    if (!selectedDate) return;

    const dateString = selectedDate.toISOString().split("T")[0];
    const result = await getOccupiedSlots(dateString, 1);

    if (result.success) {
      setOccupiedSlots(result.occupiedTimes);
    } else {
      console.error("Error al cargar horarios ocupados:", result.error);
      setOccupiedSlots([]);
    }
  };

  // Cargar canchas ocupadas cuando se selecciona fecha y hora
  useEffect(() => {
    if (selectedDate && selectedTime?.time) {
      loadOccupiedFields();
    }
  }, [selectedDate, selectedTime?.time]);

  // Función para cargar canchas ocupadas
  const loadOccupiedFields = async () => {
    if (!selectedDate || !selectedTime?.time) return;

    const dateString = selectedDate.toISOString().split("T")[0];
    const result = await getOccupiedFields(dateString, selectedTime.time);

    if (result.success) {
      setOccupiedFields(result.occupiedFields);
    } else {
      console.error("Error al cargar canchas ocupadas:", result.error);
      setOccupiedFields([]);
    }
  };

  // Generar fechas disponibles para los próximos 30 días
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Obtener horarios disponibles basado en el día de la semana
  const getTimeSlots = (date) => {
    if (!date) return [];

    const dayOfWeek = date.getDay();
    let schedule;

    if (dayOfWeek === 0) {
      schedule = sportData.schedule.sunday;
    } else if (dayOfWeek === 6) {
      schedule = sportData.schedule.saturday;
    } else {
      schedule = sportData.schedule.weekdays;
    }

    return Object.entries(schedule).map(([time, data]) => ({
      time,
      price: data.price,
      available: !occupiedSlots.includes(time),
    }));
  };

  const formatDate = (date) => {
    const days = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    return `${days[date.getDay()]}, ${date.getDate()} de ${
      months[date.getMonth()]
    }`;
  };

  const handleConfirmReservation = async () => {
    if (!selectedTime?.fieldId) {
      alert("Por favor selecciona una cancha antes de confirmar.");
      return;
    }

    const availabilityCheck = await checkAvailability(
      selectedDate.toISOString().split("T")[0],
      selectedTime.time,
      selectedTime.fieldId
    );

    if (!availabilityCheck.success) {
      alert("Error al verificar disponibilidad. Intenta nuevamente.");
      return;
    }

    if (!availabilityCheck.available) {
      alert("Lo siento, esta cancha ya está reservada. Selecciona otra.");
      return;
    }

    const reservaData = {
      cliente_id: 1,
      cancha_id: selectedTime.fieldId,
      fecha: selectedDate.toISOString().split("T")[0],
      hora_inicio: selectedTime.time,
      hora_fin: `${(parseInt(selectedTime.time.split(":")[0]) + 1)
        .toString()
        .padStart(2, "0")}:00`,
      estado: "pendiente",
    };

    const result = await createReserva(reservaData);

    if (result.success) {
      alert("¡Reserva confirmada y guardada en la base de datos!");
      await loadOccupiedSlots();
      await loadOccupiedFields();
      setSelectedDate(null);
      setSelectedTime(null);
    } else {
      alert("Error al guardar la reserva. Intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="mb-4 px-4 py-2 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg hover:bg-gradient-to-br hover:from-gray-700 hover:to-gray-800 transition-all duration-300 text-white hover:shadow-lg"
          >
            ← Volver a canchas
          </button>
          <h1 className="text-3xl font-bold text-[#eeff00] mb-2">
            Reservar horario
          </h1>
          <p className="text-gray-300">
            Selecciona fecha y hora para{" "}
            <span className="font-medium text-[#eeff00]">
              {sportData.name}
            </span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Selector de Fecha */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-xl font-semibold flex items-center gap-2 text-white">
                Seleccionar fecha
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                {getAvailableDates().map((date, index) => {
                  const isSelected =
                    selectedDate &&
                    selectedDate.toDateString() === date.toDateString();

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedTime(null);
                      }}
                      className={`p-3 rounded-lg border text-left transition-all duration-300 transform hover:-translate-y-1 ${
                        isSelected
                          ? "bg-gradient-to-br from-[#ffee00] to-[#e6d000] text-black border-[#ffee00] shadow-lg"
                          : "bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 border-gray-600 text-gray-300 hover:shadow-lg"
                      }`}
                    >
                      <div className="font-semibold text-sm">
                        {formatDate(date).split(",")[0]}
                      </div>
                      <div className="text-xs opacity-75">
                        {date.getDate()}/{date.getMonth() + 1}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Selector de Horario */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-xl font-semibold flex items-center gap-2 text-white">
                Horarios disponibles
              </h3>
            </div>
            <div className="p-6">
              {!selectedDate ? (
                <div className="text-center py-8 text-gray-400">
                  Primero selecciona una fecha
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm font-medium text-gray-300 mb-4">
                    {formatDate(selectedDate)}
                  </div>
                  <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                    {getTimeSlots(selectedDate).map((slot) => {
                      const isSelected = selectedTime?.time === slot.time;

                      return (
                        <button
                          key={slot.time}
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot)}
                          className={`relative p-3 rounded-lg border transition-all duration-300 transform ${
                            isSelected
                              ? "bg-gradient-to-br from-[#ffee00] to-[#e6d000] text-black border-[#ffee00] shadow-lg"
                              : slot.available
                              ? "bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 border-gray-600 text-gray-300 hover:shadow-lg hover:-translate-y-1"
                              : "bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700"
                          }`}
                        >
                          <div className="font-semibold">{slot.time}</div>
                          <div className="text-xs">
                            ${slot.price.toLocaleString()}
                          </div>
                          {!slot.available && (
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                              No disponible
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selector de Cancha */}
        {selectedDate && selectedTime && (
          <div className="mt-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-white">
                Elegir Cancha
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((fieldId) => {
                  const isOccupied = occupiedFields.includes(fieldId);
                  const isAvailable = !isOccupied;
                  const isSelected = selectedTime?.fieldId === fieldId;

                  return (
                    <button
                      key={fieldId}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() =>
                        setSelectedTime({ ...selectedTime, fieldId })
                      }
                      className={`flex flex-col items-center p-4 rounded-lg border transition-all duration-300 transform ${
                        isSelected
                          ? "border-[#ffee00] ring-2  bg-gradient-to-br from-[#ffee00]/20 to-[#e6d000]/20 shadow-lg"
                          : isAvailable
                          ? "border-gray-600  from-gray-700 to-gray-800 hover:shadow-lg hover:-translate-y-1"
                          : "border-gray-700 bg-gray-800 opacity-60 cursor-not-allowed"
                      }`}
                    >
                      <img
                        src="/images/cancha.svg"
                        alt={`Cancha ${fieldId}`}
                        className={`w-20 h-20 mb-2 ${
                          isAvailable ? "filter-green" : "grayscale"
                        }`}
                        style={{
                          filter: isAvailable
                            ? "drop-shadow(0 0 1px #eeff00)"
                            : "grayscale(1)",
                        }}
                      />
                      <span className="font-semibold text-gray-300">
                        Cancha {fieldId}
                      </span>
                      {isAvailable ? (
                        <span className="text-[#eeff00] text-xs font-medium mt-1">
                          Disponible
                        </span>
                      ) : (
                        <span className="text-red-400 text-xs font-medium mt-1">
                          Reservada
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Resumen de Reserva */}
        {selectedDate && selectedTime && selectedTime.fieldId && (
          <div className="mt-6 bg-gradient-to-br from-[#ffee00] to-[#e6d000] text-black rounded-xl shadow-2xl border border-[#ffee00]">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    Resumen de reserva
                  </h3>
                  <div className="space-y-1 text-black/80">
                    <p>
                      <strong>Cancha:</strong> {sportData.name} - Cancha {selectedTime.fieldId}
                    </p>
                    <p>
                      <strong>Fecha:</strong> {formatDate(selectedDate)}
                    </p>
                    <p>
                      <strong>Hora:</strong> {selectedTime.time} -{" "}
                      {(parseInt(selectedTime.time.split(":")[0]) + 1)
                        .toString()
                        .padStart(2, "0")}
                      :00
                    </p>
                    <p>
                      <strong>Precio:</strong> $
                      {selectedTime.price.toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleConfirmReservation}
                  className="bg-black text-[#eeff00] px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 border-2 border-transparent hover:border-white/20"
                >
                  Confirmar Reserva
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}