import { supabase } from "@/lib/supabaseClient";

// ==================== RESERVAS ====================

// Obtener todas las reservas
export const getAllReservas = async () => {
  try {
    const { data, error } = await supabase
      .from("reservas")
      .select("*")
      .order("creado_en", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("❌ Error al obtener reservas:", error.message);
    return { success: false, error: error.message };
  }
};

// Crear nueva reserva
export const createReserva = async (reservaData) => {
  try {
    const { data, error } = await supabase
      .from("reservas")
      .insert([reservaData])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("❌ Error al crear reserva:", error.message);
    return { success: false, error: error.message };
  }
};

// Verificar disponibilidad de horario - CORREGIDA
export const checkAvailability = async (fecha, horaInicio, canchaId) => {
  try {
    const { data, error } = await supabase
      .from("reservas")
      .select("*")
      .eq("fecha", fecha)
      .eq("hora_inicio", horaInicio)
      .eq("cancha_id", canchaId)
      .neq("estado", "cancelada");

    if (error) throw error;

    // Si NO hay reservas para esa fecha/hora, ESTÁ DISPONIBLE
    const isAvailable = data.length === 0;

    console.log(`Verificando ${fecha} ${horaInicio} ${canchaId}:`, {
      reservasEncontradas: data.length,
      disponible: isAvailable,
      reservas: data,
    });

    return { success: true, available: isAvailable, data };
  } catch (error) {
    console.error("❌ Error al verificar disponibilidad:", error.message);
    return { success: false, error: error.message };
  }
};

// Actualizar estado de reserva
export const updateReservaEstado = async (id, nuevoEstado) => {
  try {
    const { data, error } = await supabase
      .from("reservas")
      .update({ estado: nuevoEstado })
      .eq("id", id)
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("❌ Error al actualizar reserva:", error.message);
    return { success: false, error: error.message };
  }
};

// Eliminar reserva
export const deleteReserva = async (id) => {
  try {
    const { error } = await supabase.from("reservas").delete().eq("id", id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("❌ Error al eliminar reserva:", error.message);
    return { success: false, error: error.message };
  }
};

// ==================== FUNCIÓN PARA OBTENER HORARIOS OCUPADOS ====================

// Obtener horarios ocupados para una fecha específica y cancha
export const getOccupiedSlots = async (fecha, canchaId) => {
  try {
    const { data, error } = await supabase
      .from("reservas")
      .select("hora_inicio")
      .eq("fecha", fecha)
      .eq("cancha_id", canchaId)
      .neq("estado", "cancelada");

    if (error) throw error;

    // Retornar solo las horas ocupadas
    const occupiedTimes = data.map((reserva) => reserva.hora_inicio);

    console.log(`Horarios ocupados para ${fecha} ${canchaId}:`, occupiedTimes);

    return { success: true, occupiedTimes };
  } catch (error) {
    console.error("❌ Error al obtener horarios ocupados:", error.message);
    return { success: false, error: error.message, occupiedTimes: [] };
  }
};

// Obtener canchas ocupadas para una fecha y hora específica
export const getOccupiedFields = async (fecha, horaInicio) => {
  try {
    const { data, error } = await supabase
      .from("reservas")
      .select("cancha_id")
      .eq("fecha", fecha)
      .eq("hora_inicio", horaInicio)
      .neq("estado", "cancelada");

    if (error) throw error;

    // Retornar solo los IDs de canchas ocupadas
    const occupiedFields = data.map((reserva) => reserva.cancha_id);

    console.log(`Canchas ocupadas para ${fecha} ${horaInicio}:`, occupiedFields);

    return { success: true, occupiedFields };
  } catch (error) {
    console.error("❌ Error al obtener canchas ocupadas:", error.message);
    return { success: false, error: error.message, occupiedFields: [] };
  }
};

// ==================== CONEXIÓN ====================

// Verificar conexión a la base de datos
export const testConnection = async (tableName = "reservas") => {
  try {
    const { data, error } = await supabase.from(tableName).select("*").limit(1);

    if (error) throw error;
    console.log(`✅ Conexión Supabase OK - Tabla ${tableName}:`, data);
    return { success: true, data };
  } catch (error) {
    console.error(`❌ Error Supabase - Tabla ${tableName}:`, error.message);
    return { success: false, error: error.message };
  }
};
