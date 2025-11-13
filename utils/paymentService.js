/**
 * Servicio de pagos para CitySoccer
 * Maneja la creación de pagos y comunicación con la API
 */
import { CURRENCY } from '@/lib/constants'

export const createPayment = async ({
  amount,
  buyerName,
  buyerEmail,
  buyerPhone,
  description,
  fecha,
  hora,
  cancha_id
}) => {
  const formData = {
    amount,
    currency: CURRENCY,
    buyerName,
    buyerEmail,
    buyerPhone,
    description,
    fecha,
    hora,
    cancha_id
  }

  try {
    const response = await fetch('/arrendarcancha/api/payment/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    
    const data = await response.json()

    // Manejar error 409 - Conflicto de disponibilidad
    if (response.status === 409) {
      console.error('⚠️ Conflicto de disponibilidad:', data)
      return { 
        success: false, 
        error: data.error || 'Esta cancha ya está reservada para ese horario',
        code: 'SLOT_UNAVAILABLE',
        shouldRefresh: true // Indicar que debe refrescar la disponibilidad
      }
    }

    if (data.success) {
      window.location.href = data.checkoutUrl
      return { success: true, checkoutUrl: data.checkoutUrl }
    } else {
      console.error('Payment creation failed:', data)
      return { success: false, error: data.error || 'Error creando el pago' }
    }
  } catch (error) {
    console.error('Request error:', error)
    return { success: false, error: 'Error de conexión' }
  }
}

/**
 * Verificar el estado de un pago
 * @param {string} paymentId - ID del pago a verificar
 */
export const checkPaymentStatus = async (paymentId) => {
  try {
    const response = await fetch(`/arrendarcancha/api/payment/status?paymentId=${paymentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error checking payment status:', error)
    return { success: false, error: 'Error verificando el estado del pago' }
  }
}

/**
 * Formatear el precio para mostrar en la UI
 * @param {number} price - Precio en pesos chilenos
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: CURRENCY,
    minimumFractionDigits: 0
  }).format(price)
}

/**
 * Validar datos de pago antes de enviar
 * @param {Object} paymentData - Datos del pago a validar
 */
export const validatePaymentData = (paymentData) => {
  const errors = []

  if (!paymentData.amount || paymentData.amount < 100) {
    errors.push('El monto debe ser mayor a $100')
  }

  if (!paymentData.buyerName || paymentData.buyerName.trim().length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres')
  }

  if (!paymentData.buyerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentData.buyerEmail)) {
    errors.push('Email inválido')
  }

  if (!paymentData.buyerPhone || !/^\+56\d{9}$/.test(paymentData.buyerPhone)) {
    errors.push('Teléfono inválido (debe estar en formato +56912345678)')
  }

  if (!paymentData.fecha) {
    errors.push('La fecha es requerida')
  }

  if (!paymentData.hora) {
    errors.push('La hora es requerida')
  }

  if (!paymentData.cancha_id) {
    errors.push('El ID de cancha es requerido')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}