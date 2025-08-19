"use client";

import { useState, useEffect } from "react";
import { pricesData } from "../data/pricesData";
import {
  createReserva,
  testConnection,
  checkAvailability,
  getOccupiedSlots,
  getOccupiedFields, // Nueva importación
} from "../data/supabaseService";

export default function Futbol7Page() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showReservation, setShowReservation] = useState(false);
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [occupiedFields, setOccupiedFields] = useState([]); // Nuevo estado

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
    // Cambiar 'futbol7' por 1 (o el ID numérico correspondiente)
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
      // Domingo
      schedule = sportData.schedule.sunday;
    } else if (dayOfWeek === 6) {
      // Sábado
      schedule = sportData.schedule.saturday;
    } else {
      // Lunes a Viernes
      schedule = sportData.schedule.weekdays;
    }

    return Object.entries(schedule).map(([time, data]) => ({
      time,
      price: data.price,
      available: !occupiedSlots.includes(time), // Verificar si el horario está ocupado
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
    // Verificar que se haya seleccionado una cancha
    if (!selectedTime?.fieldId) {
      alert("Por favor selecciona una cancha antes de confirmar.");
      return;
    }

    // Verificar disponibilidad primero
    const availabilityCheck = await checkAvailability(
      selectedDate.toISOString().split("T")[0],
      selectedTime.time,
      selectedTime.fieldId // Usar la cancha seleccionada
    );

    if (!availabilityCheck.success) {
      alert("Error al verificar disponibilidad. Intenta nuevamente.");
      return;
    }

    if (!availabilityCheck.available) {
      alert("Lo siento, esta cancha ya está reservada. Selecciona otra.");
      return;
    }

    // Crear objeto con los datos de la reserva
    const reservaData = {
      cliente_id: 1,
      cancha_id: selectedTime.fieldId, // Usar la cancha seleccionada
      fecha: selectedDate.toISOString().split("T")[0],
      hora_inicio: selectedTime.time,
      hora_fin: `${(parseInt(selectedTime.time.split(":")[0]) + 1)
        .toString()
        .padStart(2, "0")}:00`,
      estado: "pendiente",
    };

    console.log("Datos de la reserva a guardar:", reservaData);

    // Guardar en base de datos
    const result = await createReserva(reservaData);

    if (result.success) {
      console.log("✅ Reserva guardada exitosamente:", result.data);
      alert("¡Reserva confirmada y guardada en la base de datos!");

      // Recargar horarios y canchas ocupadas después de hacer una reserva
      await loadOccupiedSlots();
      await loadOccupiedFields();

      // Resetear formulario
      setSelectedDate(null);
      setSelectedTime(null);
      setShowReservation(false);
    } else {
      alert("Error al guardar la reserva. Intenta nuevamente.");
    }
  };

  if (showReservation) {
    return (
      <div className="min-h-screen bg-[#ECECEA] p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setShowReservation(false)}
              className="mb-4 px-4 py-2 bg-white border border-[#D0D1D4] rounded-lg hover:bg-[#ECECEA] transition-colors text-[#3B3F44]"
            >
              ← Volver a canchas
            </button>
            <h1 className="text-3xl font-bold text-[#57AA32] mb-2">
              Reservar horario
            </h1>
            <p className="text-[#3B3F44]">
              Selecciona fecha y hora para{" "}
              <span className="font-medium text-[#57AA32]">
                {sportData.name}
              </span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Selector de Fecha */}
            <div className="bg-white rounded-lg shadow-lg border border-[#D0D1D4]">
              <div className="p-6 border-b border-[#D0D1D4]">
                <h3 className="text-xl font-semibold flex items-center gap-2 text-[#3B3F44]">
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
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          isSelected
                            ? "bg-[#57AA32] text-white border-[#57AA32]"
                            : "bg-white hover:bg-[#ECECEA] border-[#D0D1D4] text-[#3B3F44]"
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
            <div className="bg-white rounded-lg shadow-lg border border-[#D0D1D4]">
              <div className="p-6 border-b border-[#D0D1D4]">
                <h3 className="text-xl font-semibold flex items-center gap-2 text-[#3B3F44]">
                  Horarios disponibles
                </h3>
              </div>
              <div className="p-6">
                {!selectedDate ? (
                  <div className="text-center py-8 text-[#3B3F44]">
                    Primero selecciona una fecha
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-sm font-medium text-[#3B3F44] mb-4">
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
                            className={`relative p-3 rounded-lg border transition-colors ${
                              isSelected
                                ? "bg-[#57AA32] text-white border-[#57AA32]"
                                : slot.available
                                ? "bg-white hover:bg-[#ECECEA] border-[#D0D1D4] text-[#3B3F44]"
                                : "bg-[#ECECEA] text-gray-400 cursor-not-allowed border-[#D0D1D4]"
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
            <div className="mt-6 bg-white rounded-lg shadow-lg border border-[#D0D1D4]">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-[#3B3F44]">
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
                        className={`flex flex-col items-center p-4 rounded-lg border transition-colors ${
                          isSelected
                            ? "border-[#57AA32] ring-2 ring-[#57AA32] bg-[#E9F8E3]"
                            : isAvailable
                            ? "border-[#D0D1D4] hover:bg-[#ECECEA]"
                            : "border-[#D0D1D4] bg-[#ECECEA] opacity-60 cursor-not-allowed"
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
                              ? "drop-shadow(0 0 4px #57AA32)"
                              : "grayscale(1)",
                          }}
                        />
                        <span className="font-semibold text-[#3B3F44]">
                          Cancha {fieldId}
                        </span>
                        {isAvailable ? (
                          <span className="text-[#57AA32] text-xs font-medium mt-1">
                            Disponible
                          </span>
                        ) : (
                          <span className="text-red-500 text-xs font-medium mt-1">
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
            <div className="mt-6 bg-[#57AA32] text-white rounded-lg shadow-lg border border-[#D0D1D4]">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Resumen de reserva
                    </h3>
                    <div className="space-y-1 text-white/90">
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
                    className="bg-white text-[#57AA32] px-6 py-3 rounded-lg font-semibold hover:bg-[#ECECEA] transition-colors"
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

  return (
    <div className="min-h-screen bg-[#ECECEA] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-[#57AA32]">
          {sportData.name}
        </h1>

        {/* Botón para ir a reservar */}
        <div className="mb-8 text-center">
          <button
            onClick={() => setShowReservation(true)}
            className="bg-[#57AA32] text-white px-8 py-4 rounded-lg hover:bg-[#469026] transition-colors text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Reservar Ahora
          </button>
        </div>

        {/* Tabla de horarios y precios */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-lg border border-[#D0D1D4] p-6">
            <h2 className="text-2xl font-bold mb-4 text-[#3B3F44]">
              Horarios y Precios
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-[#D0D1D4] rounded-lg">
                <thead>
                  <tr className="bg-[#ECECEA]">
                    <th className="border border-[#D0D1D4] px-4 py-2 text-[#3B3F44]">
                      Horario
                    </th>
                    <th className="border border-[#D0D1D4] px-4 py-2 text-[#3B3F44]">
                      Lunes a Viernes
                    </th>
                    <th className="border border-[#D0D1D4] px-4 py-2 text-[#3B3F44]">
                      Sábado
                    </th>
                    <th className="border border-[#D0D1D4] px-4 py-2 text-[#3B3F44]">
                      Domingo y Festivos
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(sportData.schedule.weekdays).map(
                    ([time, prices]) => (
                      <tr key={time} className="hover:bg-[#ECECEA]">
                        <td className="border border-[#D0D1D4] px-4 py-2 font-semibold text-[#3B3F44]">
                          {time}
                        </td>
                        <td className="border border-[#D0D1D4] px-4 py-2 text-[#57AA32] font-medium">
                          ${prices.price.toLocaleString()}
                        </td>
                        <td className="border border-[#D0D1D4] px-4 py-2 text-[#57AA32] font-medium">
                          $
                          {sportData.schedule.saturday[
                            time
                          ]?.price.toLocaleString()}
                        </td>
                        <td className="border border-[#D0D1D4] px-4 py-2 text-[#57AA32] font-medium">
                          $
                          {sportData.schedule.sunday[
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
          <div className="bg-white rounded-lg shadow-lg border border-[#D0D1D4] p-6">
            <h3 className="text-xl font-bold mb-4 text-[#3B3F44]">
              Equipos Disponibles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(sportData.equipment).map(([key, item]) => (
                <div
                  key={key}
                  className="bg-[#ECECEA] p-4 rounded-lg border border-[#D0D1D4]"
                >
                  <p className="font-semibold text-[#3B3F44]">{item.name}</p>
                  <p className="text-[#57AA32] text-lg font-bold">
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
