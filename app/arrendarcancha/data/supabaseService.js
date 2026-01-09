import { supabase } from '@/lib/supabaseClient';

// Obtener tarifas reales de la base de datos
export const obtenerTarifasPorTipo = async (tipoCancha) => {
  try {
    const { data, error } = await supabase
      .from('precios')
      .select('*')
      .eq('tipo_cancha', tipoCancha)
      .eq('activo', true) // Solo precios activos
      .order('hora');

    if (error) {
      console.error(`❌ Error de Supabase obteniendo tarifas para ${tipoCancha}:`, error);
      throw error;
    }
    
    console.log(`🔍 Datos RAW de Supabase para ${tipoCancha}:`, {
      totalRegistros: data?.length || 0,
      primeros3: data?.slice(0, 3),
      tiposUnicos: data ? [...new Set(data.map(p => p.tipo_cancha))] : [],
      preciosNoZero: data?.filter(p => p.precio > 0).length || 0
    });
    
    // Si no hay datos en Supabase, retornar null para que muestre error
    if (!data || data.length === 0) {
      console.error(`❌ No hay tarifas activas en Supabase para: ${tipoCancha}`);
      return null;
    }
    
    // Organizar tarifas por día de la semana
    const tarifasOrganizadas = {
      weekdays: {},
      saturday: {},
      sunday: {}
    };

    data.forEach(precio => {
      // Solo incluir precios mayores a 0
      if (precio.precio <= 0) {
        return; // Skip precios en $0
      }

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

    console.log(`✅ Tarifas organizadas para ${tipoCancha}:`, {
      weekdays: Object.keys(tarifasOrganizadas.weekdays).length,
      saturday: Object.keys(tarifasOrganizadas.saturday).length,
      sunday: Object.keys(tarifasOrganizadas.sunday).length
    });

    // Verificar que haya al menos algunos precios configurados
    const totalPreciosValidos = 
      Object.keys(tarifasOrganizadas.weekdays).length +
      Object.keys(tarifasOrganizadas.saturday).length +
      Object.keys(tarifasOrganizadas.sunday).length;

    if (totalPreciosValidos === 0) {
      console.error(`❌ No hay precios válidos (> $0) configurados para: ${tipoCancha}`);
      return null;
    }

    return tarifasOrganizadas;
  } catch (error) {
    console.error(`❌ Error obteniendo tarifas para ${tipoCancha}:`, error);
    throw error; // Propagar el error para que se maneje en el hook
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

// Verificar disponibilidad considerando canchas compartidas (pickleball y fútbol)
export const verificarDisponibilidad = async (fecha, horaInicio, canchaId) => {
  try {
    // Primero obtener información de la cancha para saber su tipo
    const { data: canchaInfo, error: canchaError } = await supabase
      .from('canchas')
      .select('tipo, nombre')
      .eq('id', canchaId)
      .single();

    if (canchaError) throw canchaError;

    // Determinar si es una cancha de pickleball (individual o dobles)
    const esPickleball = canchaInfo.tipo === 'pickleball' || canchaInfo.tipo === 'pickleball-dobles';
    const esFutbol = canchaInfo.tipo === 'futbol7' || canchaInfo.tipo === 'futbol9';

    let condicionesConsulta = supabase
      .from('reservas')
      .select('*, canchas!inner(tipo, nombre)')
      .eq('fecha', fecha)
      .eq('hora_inicio', horaInicio)
      .neq('estado', 'cancelada'); // No contar las canceladas

    if (esPickleball) {
      // REGLA CRÍTICA: Las canchas de pickleball son compartidas entre individual y dobles
      // Si reservo "pickleball_1" para individual, bloquea la misma cancha física para dobles
      
      // Buscar TODAS las canchas con el mismo nombre físico (individual Y dobles)
      const { data: canchasRelacionadas, error: relacionError } = await supabase
        .from('canchas')
        .select('id, tipo, nombre')
        .eq('nombre', canchaInfo.nombre) // Mismo nombre físico
        .in('tipo', ['pickleball', 'pickleball-dobles']); // Ambas modalidades

      if (relacionError) throw relacionError;

      // Si solo existe una modalidad, usar solo el ID actual
      const idsRelacionados = canchasRelacionadas && canchasRelacionadas.length > 0
        ? canchasRelacionadas.map(c => c.id)
        : [canchaId];

      console.log(`🏓 Verificando pickleball: Cancha ${canchaInfo.nombre} - IDs relacionados:`, idsRelacionados);

      // Verificar si CUALQUIERA de las modalidades (individual o dobles) tiene reserva
      condicionesConsulta = condicionesConsulta.in('cancha_id', idsRelacionados);
    } else if (esFutbol) {
    // REGLA: Las canchas de fútbol 7 y fútbol 9 comparten espacios físicos.
    
    // 1. Buscar el grupo de la cancha actual
    const { data: grupoData, error: grupoError } = await supabase
      .from('cancha_grupo_miembros')
      .select('grupo_id')
      .eq('cancha_id', canchaId)
      .single();

    if (grupoError && grupoError.code !== 'PGRST116') {
      throw grupoError;
    }

    let idsRelacionados = [canchaId];

    if (grupoData) {
      // 2. Obtener TODAS las canchas del grupo Y SU TIPO
      // Se usa la relación con la tabla 'canchas' (verifica que se llame así en tu BD)
      const { data: canchasGrupo, error: canchasGrupoError } = await supabase
        .from('cancha_grupo_miembros')
        .select(`
          cancha_id,
          canchas (
            tipo
          )
        `)
        .eq('grupo_id', grupoData.grupo_id);

      if (canchasGrupoError) throw canchasGrupoError;

      if (canchasGrupo && canchasGrupo.length > 0) {
        
        // 3. Lógica de filtrado inteligente
        if (tipoCancha === 'futbol9') {
          // Si soy F9 (Padre), me bloquea CUALQUIER cancha del grupo
          idsRelacionados = canchasGrupo.map(c => c.cancha_id);
        } else {
          // Si soy F7 (Hijo), solo me bloquean: Yo misma O la cancha F9.
          // NO me bloquean mis hermanas F7.
          idsRelacionados = canchasGrupo
            .filter(c => {
              const esMismaCancha = c.cancha_id === canchaId;
              // Verificar si es la cancha padre (F9)
              const datosCancha = Array.isArray(c.canchas) ? c.canchas[0] : c.canchas;
              const esCanchaPadre = datosCancha?.tipo === 'futbol9';
              
              return esMismaCancha || esCanchaPadre;
            })
            .map(c => c.cancha_id);
        }
      }
    }
    // Aplicar el filtro a la consulta final
    condicionesConsulta = condicionesConsulta.in('cancha_id', idsRelacionados);

    } else {
      // Para otras canchas, verificar normalmente solo la cancha específica
      condicionesConsulta = condicionesConsulta.eq('cancha_id', canchaId);
    }

    const { data, error } = await condicionesConsulta;

    if (error) throw error;

    const estaDisponible = data.length === 0;

    if (!estaDisponible && esPickleball) {
      console.log(`⚠️ Cancha de pickleball ocupada: ${canchaInfo.nombre} - ${fecha} ${horaInicio}`);
      console.log(`Reserva existente bloquea ambas modalidades (individual y dobles)`);
    }

    if (!estaDisponible && esFutbol) {
      console.log(`⚠️ Cancha de fútbol ocupada: ${canchaInfo.nombre} (${canchaInfo.tipo}) - ${fecha} ${horaInicio}`);
      console.log(`Reserva existente bloquea canchas que comparten el mismo espacio físico`);
    }

    return estaDisponible;
  } catch (error) {
    console.error('Error verificando disponibilidad:', error);
    return false; // En caso de error, asumir que no está disponible por seguridad
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
        error: 'Este horario ya no está disponible. La reserva pudo haber sido tomada por otro usuario.',
        code: 'SLOT_UNAVAILABLE'
      };
    }

    const { data, error } = await supabase
      .from('reservas')
      .insert([reservaData])
      .select();

    if (error) {
      // Detectar violación de unique constraint (doble reserva)
      if (error.code === '23505') {
        console.error('⚠️ Violación de unique constraint detectada:', error);
        return { 
          success: false, 
          error: 'Este horario ya no está disponible. La reserva fue tomada por otro usuario.',
          code: 'SLOT_UNAVAILABLE',
          dbError: error.message
        };
      }
      throw error;
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error creando reserva:', error);
    return { 
      success: false, 
      error: error.message,
      code: 'DATABASE_ERROR'
    };
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
