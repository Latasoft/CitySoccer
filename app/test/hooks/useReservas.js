import { useState, useEffect } from 'react';
import { canchasConfig } from '../data/canchasConfig';

export const useReservas = (tipoCancha) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [reservaActual, setReservaActual] = useState({
    tipoCancha: tipoCancha,
    canchaId: '',
    fecha: '',
    horario: '',
    duracion: 0,
    precio: 0
  });

  const config = canchasConfig[tipoCancha];

  // Generar horarios disponibles basados en la configuración
  const generarHorarios = (fecha, canchaId) => {
    if (!config || !fecha || !canchaId) return [];
    
    const horarios = [];
    const { inicio, fin, duracionSlot } = config.horarios;
    
    for (let hora = inicio; hora < fin; hora++) {
      const horaFormateada = `${hora.toString().padStart(2, '0')}:00`;
      horarios.push({
        hora: horaFormateada,
        disponible: true, // Aquí harías la consulta real a la BD
        precio: calcularPrecio(hora, fecha)
      });
    }
    
    return horarios;
  };

  const calcularPrecio = (hora, fecha) => {
    if (!config) return 0;
    
    const fechaObj = new Date(fecha);
    const esFinSemana = fechaObj.getDay() === 0 || fechaObj.getDay() === 6;
    const esNoche = hora >= 18;
    
    if (esFinSemana) return config.precios.finSemana;
    if (esNoche) return config.precios.noche;
    return config.precios.dia;
  };

  const actualizarReserva = (campo, valor) => {
    setReservaActual(prev => ({
      ...prev,
      [campo]: valor,
      ...(campo === 'fecha' || campo === 'canchaId' ? 
        { horario: '', precio: 0 } : {}
      )
    }));
  };

  const confirmarReserva = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Aquí harías la llamada a tu API/Supabase
      console.log('Confirmando reserva:', reservaActual);
      
      // Simulación de API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        reserva: {
          ...reservaActual,
          id: Date.now(),
          estado: 'confirmada'
        }
      };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reservaActual.fecha && reservaActual.canchaId) {
      const horarios = generarHorarios(reservaActual.fecha, reservaActual.canchaId);
      setHorariosDisponibles(horarios);
    }
  }, [reservaActual.fecha, reservaActual.canchaId, tipoCancha]);

  useEffect(() => {
    if (reservaActual.horario && reservaActual.fecha) {
      const hora = parseInt(reservaActual.horario.split(':')[0]);
      const precio = calcularPrecio(hora, reservaActual.fecha);
      setReservaActual(prev => ({ ...prev, precio }));
    }
  }, [reservaActual.horario, reservaActual.fecha]);

  return {
    config,
    loading,
    error,
    horariosDisponibles,
    reservaActual,
    actualizarReserva,
    confirmarReserva
  };
};