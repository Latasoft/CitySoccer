import { supabase } from '@/lib/supabaseClient';

// Obtener tarifas reales de la base de datos
export const obtenerTarifasPorTipo = async (tipoCancha) => {
  try {
    const { data, error } = await supabase
      .from('precios')
      .select('*')
      .eq('tipo_cancha', tipoCancha)
      .order('hora');

    if (error) throw error;
    
    // Organizar tarifas por día de la semana
    const tarifasOrganizadas = {
      weekdays: {},
      saturday: {},
      sunday: {}
    };

    data.forEach(precio => {
      const hora = precio.hora.substring(0, 5); // "09:00"
      const diaSemana = precio.dia_semana;
      
      const tarifaData = { price: precio.precio };
      
      if (diaSemana === 'weekdays') { // Lunes a Viernes
        tarifasOrganizadas.weekdays[hora] = tarifaData;
      } else if (diaSemana === 'saturday') { // Sábado
        tarifasOrganizadas.saturday[hora] = tarifaData;
      } else if (diaSemana === 'sunday') { // Domingo
        tarifasOrganizadas.sunday[hora] = tarifaData;
      }
    });

    return tarifasOrganizadas;
  } catch (error) {
    console.error('Error obteniendo tarifas:', error);
    return null;
  }
};

// Obtener reservas existentes para una fecha específica
export const obtenerReservasPorFecha = async (fecha, tipoCancha) => {
  try {
    const { data, error } = await supabase
      .from('reservas')
      .select(`
        *,
        canchas!inner(tipo)
      `)
      .eq('fecha', fecha)
      .eq('canchas.tipo', tipoCancha);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error obteniendo reservas:', error);
    return [];
  }
};

// Verificar disponibilidad considerando canchas compartidas de pickleball
export const verificarDisponibilidad = async (fecha, horaInicio, canchaId) => {
  try {
    // Primero obtener información de la cancha para saber su tipo
    const { data: canchaInfo, error: canchaError } = await supabase
      .from('canchas')
      .select('tipo')
      .eq('id', canchaId)
      .single();

    if (canchaError) throw canchaError;

    let condicionesConsulta = supabase
      .from('reservas')
      .select('*')
      .eq('fecha', fecha)
      .eq('hora_inicio', horaInicio)
      .neq('estado', 'cancelada'); // No contar las canceladas

    // Si es una cancha de pickleball, verificar conflictos con ambas modalidades
    if (canchaInfo.tipo === 'pickleball') {
      // Para pickleball, verificar si la cancha específica está ocupada
      // por cualquier modalidad (individual o dobles)
      condicionesConsulta = condicionesConsulta.eq('cancha_id', canchaId);
    } else {
      // Para otras canchas, verificar normalmente
      condicionesConsulta = condicionesConsulta.eq('cancha_id', canchaId);
    }

    const { data, error } = await condicionesConsulta;

    if (error) throw error;

    const estaDisponible = data.length === 0;
    
    // Log para debugging
    if (!estaDisponible && canchaInfo.tipo === 'pickleball') {
      console.log(`Cancha pickleball ${canchaId} ocupada en ${horaInicio} el ${fecha}:`, data);
    }

    return estaDisponible;
  } catch (error) {
    console.error('Error verificando disponibilidad:', error);
    return false; // En caso de error, asumir que no está disponible
  }
};

// Nueva función específica: Obtener disponibilidad de canchas de pickleball considerando ambas modalidades
export const obtenerDisponibilidadPickleball = async (fecha, horaInicio) => {
  try {
    // Obtener todas las canchas de pickleball
    const { data: canchas, error: canchasError } = await supabase
      .from('canchas')
      .select('*')
      .eq('tipo', 'pickleball');

    if (canchasError) throw canchasError;

    // Para cada cancha, verificar si está ocupada
    const disponibilidad = await Promise.all(
      canchas.map(async (cancha) => {
        const disponible = await verificarDisponibilidad(fecha, horaInicio, cancha.id);
        return {
          ...cancha,
          disponible
        };
      })
    );

    return disponibilidad;
  } catch (error) {
    console.error('Error obteniendo disponibilidad de pickleball:', error);
    return [];
  }
};

// Crear una nueva reserva
export const crearReserva = async (reservaData) => {
  try {
    // Verificar una vez más antes de crear
    const disponible = await verificarDisponibilidad(
      reservaData.fecha, 
      reservaData.hora_inicio, 
      reservaData.cancha_id
    );

    if (!disponible) {
      return { 
        success: false, 
        error: 'Este horario ya no está disponible. La reserva pudo haber sido tomada por otro usuario.' 
      };
    }

    const { data, error } = await supabase
      .from('reservas')
      .insert([reservaData])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creando reserva:', error);
    return { success: false, error: error.message };
  }
};

// Obtener canchas por tipo
export const obtenerCanchasPorTipo = async (tipoCancha) => {
  try {
    const { data, error } = await supabase
      .from('canchas')
      .select('*')
      .eq('tipo', tipoCancha);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error obteniendo canchas:', error);
    return [];
  }
};
