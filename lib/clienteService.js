/**
 * Servicio para gestión de clientes en Supabase
 */

import { getSupabaseServiceClient } from './supabaseClients'

const supabase = getSupabaseServiceClient()

/**
 * Buscar o crear un cliente basándose en los datos de la transacción
 * @param {Object} clienteData - Datos del cliente
 * @param {string} clienteData.email - Email del cliente
 * @param {string} clienteData.nombre - Nombre del cliente
 * @param {string} [clienteData.telefono] - Teléfono del cliente (opcional)
 * @param {string} [clienteData.rut] - RUT del cliente (opcional)
 * @returns {Promise<{success: boolean, cliente: Object|null, error: string|null}>}
 */
export async function buscarOCrearCliente({ email, nombre, telefono = null, rut = null }) {
  try {
    // 1. Intentar buscar cliente por correo (campo en BD)
    const { data: clienteExistente, error: buscarError } = await supabase
      .from('clientes')
      .select('*')
      .eq('correo', email)
      .single()

    // Si se encontró el cliente, actualizarlo con nuevos datos si existen
    if (clienteExistente && !buscarError) {
      console.log('Cliente existente encontrado:', clienteExistente.id)
      
      // Actualizar datos si son diferentes
      const actualizaciones = {}
      if (telefono && telefono !== clienteExistente.telefono) {
        actualizaciones.telefono = telefono
      }
      if (rut && rut !== clienteExistente.rut) {
        actualizaciones.rut = rut
      }
      if (nombre && nombre !== clienteExistente.nombre) {
        actualizaciones.nombre = nombre
      }

      // Si hay datos nuevos, actualizar
      if (Object.keys(actualizaciones).length > 0) {
        actualizaciones.actualizado_en = new Date().toISOString()
        
        const { error: updateError } = await supabase
          .from('clientes')
          .update(actualizaciones)
          .eq('id', clienteExistente.id)

        if (updateError) {
          console.error('Error actualizando cliente:', updateError)
        } else {
          console.log('Cliente actualizado con nuevos datos')
        }
      }

      return {
        success: true,
        cliente: clienteExistente,
        error: null
      }
    }

    // 2. Si no existe, crear nuevo cliente
    console.log('Cliente no existe, creando nuevo...')
    
    const { data: nuevoCliente, error: crearError } = await supabase
      .from('clientes')
      .insert({
        correo: email,
        nombre: nombre,
        telefono: telefono,
        rut: rut,
        creado_en: new Date().toISOString(),
        actualizado_en: new Date().toISOString()
      })
      .select()
      .single()

    if (crearError) {
      console.error('Error creando cliente:', crearError)
      return {
        success: false,
        cliente: null,
        error: `Error creando cliente: ${crearError.message}`
      }
    }

    console.log('Nuevo cliente creado:', nuevoCliente.id)
    return {
      success: true,
      cliente: nuevoCliente,
      error: null
    }

  } catch (error) {
    console.error('Error en buscarOCrearCliente:', error)
    return {
      success: false,
      cliente: null,
      error: `Error interno: ${error.message}`
    }
  }
}

/**
 * Obtener cliente por ID
 * @param {number} clienteId - ID del cliente
 * @returns {Promise<Object|null>}
 */
export async function obtenerClientePorId(clienteId) {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', clienteId)
      .single()

    if (error) {
      console.error('Error obteniendo cliente:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error en obtenerClientePorId:', error)
    return null
  }
}

/**
 * Obtener todas las reservas de un cliente
 * @param {number} clienteId - ID del cliente
 * @returns {Promise<Array>}
 */
export async function obtenerReservasDeCliente(clienteId) {
  try {
    const { data, error } = await supabase
      .from('reservas')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('fecha', { ascending: false })

    if (error) {
      console.error('Error obteniendo reservas:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error en obtenerReservasDeCliente:', error)
    return []
  }
}
