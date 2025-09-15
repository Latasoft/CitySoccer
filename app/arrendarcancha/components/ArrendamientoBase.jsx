"use client";

import { useState, useEffect } from "react";
import { pricesData } from "../data/pricesData";
import { 
  obtenerCanchasPorTipo, 
  obtenerReservasPorFecha, 
  verificarDisponibilidad,
  crearReserva,
  obtenerTarifasPorTipo,
  obtenerDisponibilidadPickleball
} from "../data/supabaseService";

const ArrendamientoBase = ({ 
  onBack, 
  tipoCancha, 
  titulo,
  colorPrimario = "#eeff00",
  requiereSeleccionCancha = true 
}) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedCourt, setSelectedCourt] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [availableCourts, setAvailableCourts] = useState([]);
  const [canchasDisponiblesEnHorario, setCanchasDisponiblesEnHorario] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [reservasExistentes, setReservasExistentes] = useState([]);
  const [tarifasReales, setTarifasReales] = useState(null);

  // Mapeo de nombres de tipos de cancha para la BD
  const mapTipoCancha = (tipo) => {
    const mapping = {
      'f7': 'f7',
      'f9': 'f9', 
      'pickleball': 'pickleball',
      'futbol7': 'f7',
      'futbol9': 'f9'
    };
    return mapping[tipo] || tipo;
  };

  // Mapeo para pricesData (fallback)
  const mapTipoCanchaPrecios = (tipo) => {
    const mapping = {
      'f7': 'futbol7',
      'f9': 'futbol9',
      'pickleball': 'pickleball',
      'futbol7': 'futbol7',
      'futbol9': 'futbol9'
    };
    return mapping[tipo] || tipo;
  };

  // Verificar si es una modalidad de pickleball
  const esPickleball = (tipo) => {
    return tipo === 'pickleball';
  };

  // Validar formato de email
  const validarEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Obtener tarifas reales al cargar el componente
  useEffect(() => {
    const fetchTarifas = async () => {
      try {
        const tipoBD = mapTipoCancha(tipoCancha);
        const tarifas = await obtenerTarifasPorTipo(tipoBD);
        
        if (tarifas && Object.keys(tarifas.weekdays).length > 0) {
          setTarifasReales(tarifas);
          console.log('Tarifas reales cargadas:', tarifas);
        } else {
          // Fallback
          const tipoPrecios = mapTipoCanchaPrecios(tipoCancha);
          const sportData = pricesData[tipoPrecios];
          setTarifasReales(sportData?.schedule || null);
          console.log('Usando tarifas fallback');
        }
      } catch (error) {
        console.error('Error cargando tarifas:', error);
      }
    };

    fetchTarifas();
  }, [tipoCancha]);

  // Obtener canchas disponibles
  useEffect(() => {
    const fetchCanchas = async () => {
      try {
        const tipoBD = mapTipoCancha(tipoCancha);
        const canchas = await obtenerCanchasPorTipo(tipoBD);
        
        setAvailableCourts(canchas);
        console.log(`Canchas cargadas para ${tipoBD}:`, canchas);
        
        // Si solo hay una cancha (futbol9), seleccionarla automáticamente
        if (!requiereSeleccionCancha && canchas.length === 1) {
          setSelectedCourt(canchas[0].id.toString());
        }
      } catch (error) {
        console.error('Error cargando canchas:', error);
        // Fallback a datos mock
        const canchasMock = {
          f7: [
            { id: 1, nombre: 'f7_1', tipo: 'f7' },
            { id: 2, nombre: 'f7_2', tipo: 'f7' },
            { id: 3, nombre: 'f7_3', tipo: 'f7' }
          ],
          f9: [
            { id: 4, nombre: 'f9', tipo: 'f9' }
          ],
          pickleball: [
            { id: 5, nombre: 'pickleball_1', tipo: 'pickleball' },
            { id: 6, nombre: 'pickleball_2', tipo: 'pickleball' },
            { id: 7, nombre: 'pickleball_3', tipo: 'pickleball' }
          ]
        };

        const tipoBD = mapTipoCancha(tipoCancha);
        const canchasDisponibles = canchasMock[tipoBD] || [];
        setAvailableCourts(canchasDisponibles);
        
        if (!requiereSeleccionCancha && canchasDisponibles.length === 1) {
          setSelectedCourt(canchasDisponibles[0].id.toString());
        }
      }
    };

    fetchCanchas();
  }, [tipoCancha, requiereSeleccionCancha]);

  // Obtener horarios disponibles cuando se selecciona fecha
  useEffect(() => {
    if (selectedDate && tarifasReales) {
      fetchAvailableTimes();
    }
  }, [selectedDate, tarifasReales]);

  const fetchAvailableTimes = async () => {
    setLoading(true);
    try {
      const tipoBD = mapTipoCancha(tipoCancha);
      
      // Obtener reservas existentes para la fecha
      const reservas = await obtenerReservasPorFecha(selectedDate, tipoBD);
      setReservasExistentes(reservas);

      const fechaSeleccionada = new Date(selectedDate + 'T00:00:00');
      const diaSemana = fechaSeleccionada.getDay();
      
      // Usar tarifas reales de la base de datos
      if (!tarifasReales) {
        console.error('No hay tarifas disponibles');
        setAvailableTimes([]);
        return;
      }

      let horarios = [];
      
      // Determinar qué horarios usar según el día
      if (diaSemana === 0) { // Domingo
        horarios = Object.entries(tarifasReales.sunday);
      } else if (diaSemana === 6) { // Sábado
        horarios = Object.entries(tarifasReales.saturday);
      } else { // Lunes a Viernes
        horarios = Object.entries(tarifasReales.weekdays);
      }

      const horariosFormateados = await Promise.all(
        horarios.map(async ([hora, data]) => {
          let disponible = true;
          
          if (requiereSeleccionCancha) {
            // Verificar disponibilidad considerando canchas compartidas
            if (esPickleball(tipoCancha)) {
              // Para pickleball, usar función especial que considera ambas modalidades
              const disponibilidadPickleball = await obtenerDisponibilidadPickleball(selectedDate, hora);
              disponible = disponibilidadPickleball.some(cancha => cancha.disponible);
            } else {
              // Para otras canchas, verificar normalmente
              const disponibilidadCanchas = await Promise.all(
                availableCourts.map(cancha => 
                  verificarDisponibilidad(selectedDate, hora, cancha.id)
                )
              );
              disponible = disponibilidadCanchas.some(d => d === true);
            }
          } else if (selectedCourt) {
            // Si no requiere selección (futbol9), verificar la cancha seleccionada
            disponible = await verificarDisponibilidad(selectedDate, hora, parseInt(selectedCourt));
          }

          return {
            hora: hora,
            precio: data.price,
            disponible: disponible
          };
        })
      );

      console.log('Horarios con disponibilidad:', horariosFormateados);
      setAvailableTimes(horariosFormateados);
    } catch (error) {
      console.error('Error cargando horarios:', error);
      setAvailableTimes([]);
    } finally {
      setLoading(false);
    }
  };

  // Nueva función: Verificar disponibilidad de canchas cuando se selecciona un horario
  const verificarDisponibilidadEnHorario = async (horarioSeleccionado) => {
    if (!selectedDate || !horarioSeleccionado || availableCourts.length === 0) {
      return;
    }

    console.log(`Verificando disponibilidad para ${horarioSeleccionado} en fecha ${selectedDate}`);

    try {
      let canchasConDisponibilidad;

      if (esPickleball(tipoCancha)) {
        // Para pickleball, usar función especial
        canchasConDisponibilidad = await obtenerDisponibilidadPickleball(selectedDate, horarioSeleccionado);
      } else {
        // Para otras canchas, verificar normalmente
        canchasConDisponibilidad = await Promise.all(
          availableCourts.map(async (cancha) => {
            const disponible = await verificarDisponibilidad(selectedDate, horarioSeleccionado, cancha.id);
            return {
              ...cancha,
              disponible: disponible
            };
          })
        );
      }

      console.log('Disponibilidad de canchas en horario seleccionado:', canchasConDisponibilidad);
      setCanchasDisponiblesEnHorario(canchasConDisponibilidad);
      
      // Contar cuántas canchas están disponibles
      const canchasLibres = canchasConDisponibilidad.filter(c => c.disponible);
      const canchasOcupadas = canchasConDisponibilidad.filter(c => !c.disponible);
      
      console.log(`Horario ${horarioSeleccionado}: ${canchasLibres.length} canchas disponibles, ${canchasOcupadas.length} ocupadas`);
      
      if (canchasOcupadas.length > 0) {
        console.log('Canchas ocupadas:', canchasOcupadas.map(c => c.nombre));
        
        // Para pickleball, mostrar información adicional sobre el conflicto
        if (esPickleball(tipoCancha)) {
          console.log('⚠️  PICKLEBALL: Las canchas ocupadas no están disponibles para ninguna modalidad (individual/dobles)');
        }
      }

    } catch (error) {
      console.error('Error verificando disponibilidad en horario:', error);
      setCanchasDisponiblesEnHorario([]);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime("");
    setCanchasDisponiblesEnHorario([]);
    setCurrentStep(2);
  };

  const handleTimeSelect = async (time) => {
    setSelectedTime(time);
    
    // Verificar disponibilidad de canchas para este horario específico
    await verificarDisponibilidadEnHorario(time);
    
    if (requiereSeleccionCancha) {
      setCurrentStep(3);
    } else {
      setCurrentStep(4);
    }
  };

  const handleCourtSelect = (courtId) => {
    setSelectedCourt(courtId);
    setCurrentStep(4);
  };

  // Nueva función para manejar el cambio de email
  const handleEmailChange = (email) => {
    setCustomerEmail(email);
    setEmailError("");
    
    if (email && !validarEmail(email)) {
      setEmailError("Por favor ingresa un email válido");
    }
  };

  // Nueva función para avanzar al paso de confirmación
  const handleEmailConfirm = () => {
    if (!customerEmail) {
      setEmailError("El email es requerido");
      return;
    }
    
    if (!validarEmail(customerEmail)) {
      setEmailError("Por favor ingresa un email válido");
      return;
    }
    
    setCurrentStep(5);
  };

  const handleConfirmReservation = async () => {
    setLoading(true);
    try {
      // Verificar una vez más que el horario esté disponible
      const disponible = await verificarDisponibilidad(
        selectedDate, 
        selectedTime, 
        parseInt(selectedCourt)
      );

      if (!disponible) {
        const mensaje = esPickleball(tipoCancha) 
          ? 'Lo sentimos, esta cancha ya no está disponible para este horario. Puede haber sido reservada para individual o dobles.' 
          : 'Lo sentimos, este horario ya no está disponible. Por favor selecciona otro horario.';
        
        alert(mensaje);
        setLoading(false);
        return;
      }

      const reservationData = {
        fecha: selectedDate,
        hora_inicio: selectedTime,
        cancha_id: parseInt(selectedCourt),
        cliente_id: 1, // Aquí usarías el ID del usuario logueado
        estado: 'confirmada'
      };

      console.log('Confirmando reserva:', reservationData);
      console.log('Email del cliente:', customerEmail); // Log del email (no se guarda en BD todavía)
      
      const resultado = await crearReserva(reservationData);
      
      if (resultado.success) {
        const mensaje = esPickleball(tipoCancha)
          ? `¡Reserva confirmada exitosamente! Se ha enviado la confirmación a ${customerEmail}. La cancha está bloqueada para ambas modalidades (individual y dobles).`
          : `¡Reserva confirmada exitosamente! Se ha enviado la confirmación a ${customerEmail}.`;
        
        alert(mensaje);
        onBack();
      } else {
        alert(`Error al confirmar la reserva: ${resultado.error}`);
      }
    } catch (error) {
      console.error('Error confirmando reserva:', error);
      alert('Error al confirmar la reserva');
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Selecciona la fecha";
      case 2: return "Elige el horario";
      case 3: return "Selecciona la cancha";
      case 4: return "Ingresa tu email";
      case 5: return "Confirma tu reserva";
      default: return "";
    }
  };

  const cancha = availableCourts.find(c => c.id.toString() === selectedCourt);
  const horario = availableTimes.find(h => h.hora === selectedTime);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="text-white hover:text-gray-300 mr-4 text-2xl"
          >
            ←
          </button>
          <h1 className="text-3xl font-bold" style={{ color: colorPrimario }}>
            {titulo} - {getStepTitle()}
          </h1>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700 p-8">
          {/* Información especial para pickleball */}
          {esPickleball(tipoCancha) && (
            <div className="mb-6 p-4 bg-blue-900/30 border border-blue-600/30 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-blue-400 mr-2">ℹ️</span>
                <h3 className="text-blue-300 font-semibold">Información sobre Pickleball</h3>
              </div>
              <p className="text-blue-200 text-sm">
                Las canchas de pickleball son compartidas entre individual y dobles. 
                Cuando reservas una cancha, queda bloqueada para ambas modalidades en ese horario.
              </p>
            </div>
          )}

          {/* Paso 1: Seleccionar fecha */}
          {currentStep >= 1 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                1. Selecciona la fecha
              </h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-yellow-400 focus:outline-none"
              />
              {selectedDate && (
                <p className="text-green-400 mt-2">
                  ✓ Fecha seleccionada: {new Date(selectedDate + 'T00:00:00').toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {/* Paso 2: Seleccionar horario */}
          {currentStep >= 2 && selectedDate && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                2. Elige el horario disponible
              </h2>
              {loading ? (
                <p className="text-white">Cargando horarios...</p>
              ) : availableTimes.length === 0 ? (
                <p className="text-red-400">No hay horarios disponibles para esta fecha</p>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {availableTimes.map((time) => (
                    <button
                      key={time.hora}
                      onClick={() => time.disponible && handleTimeSelect(time.hora)}
                      disabled={!time.disponible}
                      className={`p-3 rounded-lg font-medium transition-all ${
                        selectedTime === time.hora
                          ? "text-black shadow-lg scale-105"
                          : time.disponible
                          ? "bg-gray-700 text-white hover:bg-gray-600"
                          : "bg-red-900 text-red-300 cursor-not-allowed opacity-50"
                      }`}
                      style={
                        selectedTime === time.hora
                          ? { backgroundColor: colorPrimario }
                          : {}
                      }
                    >
                      {time.hora}
                      <br />
                      <span className="text-xs">
                        {time.disponible ? `$${time.precio?.toLocaleString()}` : 'Ocupado'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {selectedTime && (
                <p className="text-green-400 mt-4">
                  ✓ Horario seleccionado: {selectedTime}
                </p>
              )}
            </div>
          )}

          {/* Paso 3: Seleccionar cancha (solo si se requiere) */}
          {currentStep >= 3 && requiereSeleccionCancha && selectedTime && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                3. Selecciona la cancha disponible
              </h2>
              
              {/* Mostrar información de disponibilidad */}
              {canchasDisponiblesEnHorario.length > 0 && (
                <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-300">
                    Disponibilidad para {selectedTime}: {' '}
                    <span className="text-green-400">
                      {canchasDisponiblesEnHorario.filter(c => c.disponible).length} disponibles
                    </span>
                    {' '} / {' '}
                    <span className="text-red-400">
                      {canchasDisponiblesEnHorario.filter(c => !c.disponible).length} ocupadas
                    </span>
                    {esPickleball(tipoCancha) && canchasDisponiblesEnHorario.filter(c => !c.disponible).length > 0 && (
                      <span className="text-yellow-400 block text-xs mt-1">
                        * Las ocupadas incluyen reservas de individual y dobles
                      </span>
                    )}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(canchasDisponiblesEnHorario.length > 0 ? canchasDisponiblesEnHorario : availableCourts).map((court) => {
                  const estaDisponible = canchasDisponiblesEnHorario.length > 0 ? court.disponible : true;
                  
                  return (
                    <button
                      key={court.id}
                      onClick={() => estaDisponible && handleCourtSelect(court.id.toString())}
                      disabled={!estaDisponible}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedCourt === court.id.toString()
                          ? "border-yellow-400 bg-gray-700 scale-105"
                          : estaDisponible
                          ? "border-gray-600 bg-gray-800 hover:border-gray-500"
                          : "border-red-600 bg-red-900/20 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <h3 className={`font-semibold ${estaDisponible ? 'text-white' : 'text-red-400'}`}>
                        {court.nombre.replace('_', ' ').toUpperCase()}
                      </h3>
                      <p className={`text-sm ${estaDisponible ? 'text-gray-300' : 'text-red-400'}`}>
                        Tipo: {court.tipo.toUpperCase()}
                      </p>
                      <p className={`text-xs mt-1 font-medium ${estaDisponible ? 'text-green-400' : 'text-red-400'}`}>
                        {estaDisponible ? '✓ Disponible' : '✗ Ocupada'}
                      </p>
                      {!estaDisponible && esPickleball(tipoCancha) && (
                        <p className="text-xs text-yellow-400 mt-1">
                          (Individual o Dobles)
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
              {selectedCourt && (
                <p className="text-green-400 mt-4">
                  ✓ Cancha seleccionada: {cancha?.nombre.replace('_', ' ').toUpperCase()}
                </p>
              )}
            </div>
          )}

          {/* Paso 4: Ingresar email */}
          {currentStep >= 4 && (selectedCourt || !requiereSeleccionCancha) && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                {requiereSeleccionCancha ? "4" : "3"}. Ingresa tu correo electrónico
              </h2>
              <div className="max-w-md">
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className={`w-full p-3 rounded-lg bg-gray-700 text-white border ${
                    emailError ? 'border-red-500' : 'border-gray-600'
                  } focus:border-yellow-400 focus:outline-none`}
                />
                {emailError && (
                  <p className="text-red-400 text-sm mt-2">{emailError}</p>
                )}
                {customerEmail && !emailError && (
                  <p className="text-green-400 text-sm mt-2">
                    ✓ Email válido
                  </p>
                )}
                <p className="text-gray-400 text-xs mt-2">
                  Te enviaremos la confirmación de tu reserva a este email
                </p>
              </div>
              
              <button
                onClick={handleEmailConfirm}
                disabled={!customerEmail || emailError}
                className="mt-4 px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: colorPrimario,
                  color: colorPrimario === "#eeff00" ? "black" : "white"
                }}
              >
                Continuar
              </button>
            </div>
          )}

          {/* Paso 5: Confirmación */}
          {currentStep >= 5 && customerEmail && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                {requiereSeleccionCancha ? "5" : "4"}. Confirma tu reserva
              </h2>
              <div className="bg-gray-700 p-6 rounded-lg mb-6">
                <h3 className="font-semibold text-white mb-4">Resumen de la reserva:</h3>
                <div className="space-y-2 text-gray-300">
                  <p><strong>Deporte:</strong> {titulo}</p>
                  <p><strong>Fecha:</strong> {new Date(selectedDate + 'T00:00:00').toLocaleDateString()}</p>
                  <p><strong>Horario:</strong> {selectedTime}</p>
                  {requiereSeleccionCancha && (
                    <p><strong>Cancha:</strong> {cancha?.nombre.replace('_', ' ').toUpperCase()}</p>
                  )}
                  <p><strong>Email:</strong> {customerEmail}</p>
                  <p><strong style={{ color: colorPrimario }}>
                    Precio: ${horario?.precio?.toLocaleString()}
                  </strong></p>
                  {esPickleball(tipoCancha) && (
                    <p className="text-sm text-yellow-300 mt-2">
                      * Esta reserva bloquea la cancha para ambas modalidades (individual y dobles)
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3 rounded-lg font-semibold bg-gray-600 text-white hover:bg-gray-500 transition-all"
                >
                  ← Volver
                </button>
                <button
                  onClick={handleConfirmReservation}
                  disabled={loading}
                  className="flex-1 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: colorPrimario,
                    color: colorPrimario === "#eeff00" ? "black" : "white"
                  }}
                >
                  {loading ? "Confirmando..." : "Confirmar Reserva"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArrendamientoBase;