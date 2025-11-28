/**
 * Servicio centralizado para gestión de reservas
 * Incluye: retry automático, timeout, validación robusta de conflictos
 * Compatible con reservas manuales (admin) y públicas (webhook)
 */

import { executeQuery } from './supabaseClient';
import { supabase } from './supabaseClient';

/**
 * Configuración de timeouts y reintentos para reservas
 */
const RESERVA_CONFIG = {
  maxRetries: 3,
  timeout: 10000, // 10 segundos
  retryDelay: 1000 // 1 segundo entre reintentos
};

/**
 * Validar disponibilidad de una cancha en un horario específico
 * Considera solapamiento de horarios, no solo coincidencia exacta
 * 
 * @param {Object} params
 * @param {string} params.fecha - Fecha en formato YYYY-MM-DD
 * @param {string} params.hora_inicio - Hora de inicio en formato HH:MM
 * @param {string} params.hora_fin - Hora de fin en formato HH:MM (opcional, por defecto +1 hora)
 * @param {number} params.cancha_id - ID de la cancha
 * @param {number} params.reserva_id - ID de reserva a excluir (para ediciones)
 * @returns {Promise<{available: boolean, conflictos: Array, error?: string}>}
 */
export const validarDisponibilidadReserva = async ({
  fecha,
  hora_inicio,
  hora_fin = null,
  cancha_id,
  reserva_id = null
}) => {
  try {
    // Si no se proporciona hora_fin, calcular +1 hora por defecto
    if (!hora_fin) {
      const [hours, minutes] = hora_inicio.split(':').map(Number);
      const endHour = hours + 1;
      hora_fin = `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    console.log('🔍 Validando disponibilidad:', {
      fecha,
      hora_inicio,
      hora_fin,
      cancha_id,
      reserva_id
    });

    // Query con retry automático y timeout
    const result = await executeQuery(
      () => {
        let query = supabase
          .from('reservas')
          .select('id, hora_inicio, hora_fin, estado, clientes(nombre)')
          .eq('fecha', fecha)
          .eq('cancha_id', cancha_id)
          .neq('estado', 'cancelada');

        // Excluir la reserva actual si es una edición
        if (reserva_id) {
          query = query.neq('id', reserva_id);
        }

        return query;
      },
      {
        maxRetries: RESERVA_CONFIG.maxRetries,
        timeout: RESERVA_CONFIG.timeout,
        retryDelay: RESERVA_CONFIG.retryDelay,
        onRetry: (attempt, error) => {
          console.warn(`⚠️ Reintento ${attempt}/${RESERVA_CONFIG.maxRetries} validando disponibilidad:`, error.message);
        }
      }
    );

    if (result.error) {
      throw result.error;
    }

    const reservasExistentes = result.data || [];

    // Verificar solapamiento de horarios
    const conflictos = reservasExistentes.filter(reserva => {
      const existingStart = reserva.hora_inicio;
      const existingEnd = reserva.hora_fin || calcularHoraFin(reserva.hora_inicio);

      // Convertir a minutos para facilitar comparación
      const newStartMin = timeToMinutes(hora_inicio);
      const newEndMin = timeToMinutes(hora_fin);
      const existingStartMin = timeToMinutes(existingStart);
      const existingEndMin = timeToMinutes(existingEnd);

      // Hay conflicto si hay solapamiento
      // Nueva reserva empieza antes de que termine la existente
      // Y nueva reserva termina después de que empiece la existente
      const haySolapamiento = 
        newStartMin < existingEndMin && newEndMin > existingStartMin;

      if (haySolapamiento) {
        console.warn('⚠️ Conflicto detectado:', {
          reserva_id: reserva.id,
          cliente: reserva.clientes?.nombre,
          horario_existente: `${existingStart}-${existingEnd}`,
          horario_nuevo: `${hora_inicio}-${hora_fin}`
        });
      }

      return haySolapamiento;
    });

    const disponible = conflictos.length === 0;

    console.log(disponible ? '✅ Cancha disponible' : '❌ Cancha no disponible', {
      conflictosEncontrados: conflictos.length
    });

    return {
      available: disponible,
      conflictos: conflictos.map(c => ({
        id: c.id,
        hora_inicio: c.hora_inicio,
        hora_fin: c.hora_fin,
        cliente: c.clientes?.nombre,
        estado: c.estado
      }))
    };

  } catch (error) {
    console.error('❌ Error validando disponibilidad:', error);
    return {
      available: false,
      conflictos: [],
      error: error.message || 'Error al verificar disponibilidad'
    };
  }
};

/**
 * Buscar o crear cliente por email, teléfono o nombre
 * Con retry automático
 * 
 * @param {Object} clienteData
 * @param {string} clienteData.nombre - Nombre del cliente (requerido)
 * @param {string} clienteData.correo - Email del cliente (opcional)
 * @param {string} clienteData.telefono - Teléfono del cliente (opcional)
 * @returns {Promise<{success: boolean, clienteId?: number, error?: string}>}
 */
export const buscarOCrearClienteReserva = async ({ nombre, correo, telefono }) => {
  try {
    console.log('👤 Buscando o creando cliente:', { nombre, correo, telefono });

    let clienteId = null;

    // Intentar buscar cliente existente por correo o teléfono
    if (correo || telefono) {
      const orConditions = [];
      if (correo) orConditions.push(`correo.eq.${correo}`);
      if (telefono) orConditions.push(`telefono.eq.${telefono}`);

      const searchResult = await executeQuery(
        () => supabase
          .from('clientes')
          .select('id, nombre, correo, telefono')
          .or(orConditions.join(','))
          .limit(1),
        {
          maxRetries: RESERVA_CONFIG.maxRetries,
          timeout: RESERVA_CONFIG.timeout,
          onRetry: (attempt, error) => {
            console.warn(`⚠️ Reintento ${attempt} buscando cliente:`, error.message);
          }
        }
      );

      if (searchResult.error) {
        throw searchResult.error;
      }

      if (searchResult.data && searchResult.data.length > 0) {
        clienteId = searchResult.data[0].id;
        console.log('✅ Cliente existente encontrado:', clienteId);
      }
    }

    // Si no se encontró, crear nuevo cliente
    if (!clienteId) {
      const createResult = await executeQuery(
        () => supabase
          .from('clientes')
          .insert({
            nombre,
            correo: correo || null,
            telefono: telefono || null
          })
          .select('id')
          .single(),
        {
          maxRetries: RESERVA_CONFIG.maxRetries,
          timeout: RESERVA_CONFIG.timeout,
          onRetry: (attempt, error) => {
            console.warn(`⚠️ Reintento ${attempt} creando cliente:`, error.message);
          }
        }
      );

      if (createResult.error) {
        throw createResult.error;
      }

      clienteId = createResult.data.id;
      console.log('✅ Nuevo cliente creado:', clienteId);
    }

    return {
      success: true,
      clienteId
    };

  } catch (error) {
    console.error('❌ Error gestionando cliente:', error);
    
    // Proporcionar mensaje específico según el tipo de error
    let errorMessage = 'Error al procesar datos del cliente';
    
    if (error.message?.includes('timeout') || error.message?.includes('Query timeout')) {
      errorMessage = 'Tiempo de espera agotado. Por favor, intenta nuevamente.';
    } else if (error.code === '23505') {
      errorMessage = 'Ya existe un cliente con ese correo o teléfono.';
    } else if (error.code === '23503') {
      errorMessage = 'Error de referencia en la base de datos.';
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Crear una nueva reserva con validación robusta
 * Incluye validación de conflictos y retry automático
 * 
 * @param {Object} reservaData
 * @param {string} reservaData.fecha - Fecha en formato YYYY-MM-DD
 * @param {string} reservaData.hora_inicio - Hora de inicio HH:MM
 * @param {string} reservaData.hora_fin - Hora de fin HH:MM (opcional)
 * @param {number} reservaData.cancha_id - ID de la cancha
 * @param {number} reservaData.cliente_id - ID del cliente
 * @param {string} reservaData.estado - Estado de la reserva (default: 'pendiente')
 * @param {string} reservaData.transaction_id - ID de transacción (opcional)
 * @returns {Promise<{success: boolean, data?: Object, error?: string, code?: string}>}
 */
export const crearReservaConValidacion = async (reservaData) => {
  const {
    fecha,
    hora_inicio,
    hora_fin = null,
    cancha_id,
    cliente_id,
    estado = 'pendiente',
    transaction_id = null
  } = reservaData;

  try {
    console.log('📝 Creando reserva:', reservaData);

    // Calcular hora_fin si no se proporciona
    const horaFinCalculada = hora_fin || calcularHoraFin(hora_inicio);

    // 1. Validar disponibilidad con validación robusta
    const validacion = await validarDisponibilidadReserva({
      fecha,
      hora_inicio,
      hora_fin: horaFinCalculada,
      cancha_id
    });

    if (!validacion.available) {
      console.warn('⚠️ Cancha no disponible:', validacion.conflictos);
      
      let errorMessage = 'Ya existe una reserva en ese horario.';
      if (validacion.conflictos.length > 0) {
        const conflicto = validacion.conflictos[0];
        errorMessage = `Conflicto con reserva existente (${conflicto.hora_inicio}-${conflicto.hora_fin})`;
        if (conflicto.cliente) {
          errorMessage += ` - Cliente: ${conflicto.cliente}`;
        }
      }

      return {
        success: false,
        error: errorMessage,
        code: 'SLOT_UNAVAILABLE',
        conflictos: validacion.conflictos
      };
    }

    // 2. Crear la reserva con retry automático
    const createResult = await executeQuery(
      () => supabase
        .from('reservas')
        .insert({
          fecha,
          hora_inicio,
          hora_fin: horaFinCalculada,
          cancha_id,
          cliente_id,
          estado,
          transaction_id
        })
        .select(`
          *,
          clientes(id, nombre, correo, telefono),
          canchas(id, nombre, tipo)
        `)
        .single(),
      {
        maxRetries: RESERVA_CONFIG.maxRetries,
        timeout: RESERVA_CONFIG.timeout,
        onRetry: (attempt, error) => {
          console.warn(`⚠️ Reintento ${attempt} creando reserva:`, error.message);
        }
      }
    );

    if (createResult.error) {
      // Manejo específico de violación de unique constraint
      if (createResult.error.code === '23505') {
        console.error('⚠️ Violación de unique constraint (doble reserva):', createResult.error);
        return {
          success: false,
          error: 'Este horario fue reservado por otro usuario mientras procesábamos tu solicitud.',
          code: 'SLOT_UNAVAILABLE',
          dbError: createResult.error.message
        };
      }

      throw createResult.error;
    }

    console.log('✅ Reserva creada exitosamente:', createResult.data.id);

    return {
      success: true,
      data: createResult.data
    };

  } catch (error) {
    console.error('❌ Error creando reserva:', error);

    // Proporcionar mensaje específico según el tipo de error
    let errorMessage = 'Error al crear la reserva';
    let errorCode = 'DATABASE_ERROR';

    if (error.message?.includes('timeout') || error.message?.includes('Query timeout')) {
      errorMessage = 'Tiempo de espera agotado. La reserva no se completó. Por favor, verifica e intenta nuevamente.';
      errorCode = 'TIMEOUT';
    } else if (error.code === '23503') {
      errorMessage = 'Datos inválidos: cliente o cancha no encontrados.';
      errorCode = 'INVALID_REFERENCE';
    }

    return {
      success: false,
      error: errorMessage,
      code: errorCode
    };
  }
};

/**
 * Actualizar estado de una reserva existente
 * Con retry automático
 * 
 * @param {number} reservaId - ID de la reserva
 * @param {string} nuevoEstado - Nuevo estado ('pendiente', 'confirmada', 'cancelada', 'completada')
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const actualizarEstadoReserva = async (reservaId, nuevoEstado) => {
  try {
    console.log('🔄 Actualizando estado de reserva:', { reservaId, nuevoEstado });

    const result = await executeQuery(
      () => supabase
        .from('reservas')
        .update({ estado: nuevoEstado })
        .eq('id', reservaId)
        .select(),
      {
        maxRetries: RESERVA_CONFIG.maxRetries,
        timeout: RESERVA_CONFIG.timeout,
        onRetry: (attempt, error) => {
          console.warn(`⚠️ Reintento ${attempt} actualizando estado:`, error.message);
        }
      }
    );

    if (result.error) {
      throw result.error;
    }

    console.log('✅ Estado actualizado exitosamente');

    return { success: true };

  } catch (error) {
    console.error('❌ Error actualizando estado:', error);

    let errorMessage = 'Error al actualizar el estado de la reserva';
    if (error.message?.includes('timeout')) {
      errorMessage = 'Tiempo de espera agotado. Recarga la página para verificar el estado.';
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Eliminar una reserva
 * Con retry automático
 * 
 * @param {number} reservaId - ID de la reserva
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const eliminarReserva = async (reservaId) => {
  try {
    console.log('🗑️ Eliminando reserva:', reservaId);

    const result = await executeQuery(
      () => supabase
        .from('reservas')
        .delete()
        .eq('id', reservaId),
      {
        maxRetries: RESERVA_CONFIG.maxRetries,
        timeout: RESERVA_CONFIG.timeout,
        onRetry: (attempt, error) => {
          console.warn(`⚠️ Reintento ${attempt} eliminando reserva:`, error.message);
        }
      }
    );

    if (result.error) {
      throw result.error;
    }

    console.log('✅ Reserva eliminada exitosamente');

    return { success: true };

  } catch (error) {
    console.error('❌ Error eliminando reserva:', error);

    let errorMessage = 'Error al eliminar la reserva';
    if (error.message?.includes('timeout')) {
      errorMessage = 'Tiempo de espera agotado. Recarga la página para verificar.';
    }

    return {
      success: false,
      error: errorMessage
    };
  }
};

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

/**
 * Convertir hora HH:MM a minutos desde medianoche
 * @param {string} time - Hora en formato HH:MM
 * @returns {number} Minutos desde medianoche
 */
function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Calcular hora de fin sumando 1 hora a la hora de inicio
 * @param {string} horaInicio - Hora en formato HH:MM
 * @param {number} duracionHoras - Duración en horas (default: 1)
 * @returns {string} Hora de fin en formato HH:MM
 */
function calcularHoraFin(horaInicio, duracionHoras = 1) {
  const [hours, minutes] = horaInicio.split(':').map(Number);
  const endHour = hours + duracionHoras;
  return `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Validar formato de hora HH:MM
 * @param {string} time - Hora a validar
 * @returns {boolean}
 */
export function validarFormatoHora(time) {
  if (!time) return false;
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return regex.test(time);
}

/**
 * Validar formato de fecha YYYY-MM-DD
 * @param {string} date - Fecha a validar
 * @returns {boolean}
 */
export function validarFormatoFecha(date) {
  if (!date) return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) return false;
  
  // Validar que sea una fecha válida
  const timestamp = Date.parse(date);
  return !isNaN(timestamp);
}
