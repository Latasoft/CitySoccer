import { getSupabaseServiceClient } from '@/lib/supabaseClients'
import { NextResponse } from 'next/server'
import { buscarOCrearCliente } from '@/lib/clienteService'
import { crearReserva } from '@/app/arrendarcancha/data/supabaseService'
import {
  TRANSACTION_STATUS,
  GETNET_STATUS_MAP,
  DEFAULT_TRANSACTION_STATUS,
  RESERVATION_STATUS,
  DEFAULT_RESERVATION_STATUS,
  calculateEndTime,
  ERROR_MESSAGES
} from '@/lib/constants'
import { 
  sendReservationConfirmation, 
  sendAdminReservationNotification,
  sendRefundNotification 
} from '@/lib/emailService'
import { generateReservationPDF } from '@/lib/pdfService'

// Configuración para rutas
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Usar singleton del service client
const supabase = getSupabaseServiceClient()

export async function POST(request) {
  try {
    console.log('=== Webhook POST Received ===')
    console.log('Timestamp:', new Date().toISOString())
    console.log('Request headers:', Object.fromEntries(request.headers.entries()))
    
    let body
    try {
      body = await request.json()
    } catch (e) {
      console.log('Failed to parse JSON, trying text...')
      const text = await request.text()
      console.log('Raw body:', text)
      return NextResponse.json({ 
        received: true, 
        error: 'Invalid JSON',
        rawBody: text
      }, { status: 400 })
    }
    
    console.log('Webhook payload:', JSON.stringify(body, null, 2))

    // Extraer datos del webhook de Getnet
    const { requestID, reference, status } = body

    console.log('Extracted webhook data:', {
      requestID,
      reference,
      status: status?.status,
      reason: status?.reason,
      message: status?.message,
      authorization: status?.authorization,
      paymentMethod: status?.paymentMethod
    })

    if (!requestID && !reference) {
      console.log('No requestID or reference found - this might be a test webhook')
      return NextResponse.json({ 
        received: true, 
        message: 'Test webhook received successfully',
        body: body
      })
    }

    if (!reference) {
      console.log('Missing reference in webhook')
      return NextResponse.json({ 
        received: false, 
        error: 'Missing reference (order ID)' 
      }, { status: 400 })
    }

    // Mapear estados de Getnet a nuestros estados
    const getnetStatus = status?.status
    const transactionStatus = GETNET_STATUS_MAP[getnetStatus] || DEFAULT_TRANSACTION_STATUS

    console.log('Mapped transaction status:', { 
      getnetStatus, 
      mappedStatus: transactionStatus 
    })

    // Verificar si la transacción existe
    const { data: existingTransaction, error: findError } = await supabase
      .from('transactions')
      .select('*')
      .eq('order_id', reference)
      .single()

    if (findError) {
      console.error('Database query error:', findError)
      return NextResponse.json({ 
        received: false, 
        error: 'Database query failed',
        details: findError.message
      }, { status: 500 })
    }

    if (!existingTransaction) {
      console.error('Transaction not found for reference:', reference)
      return NextResponse.json({ 
        received: false, 
        error: 'Transaction not found' 
      }, { status: 404 })
    }

    console.log('Found existing transaction:', {
      orderId: existingTransaction.order_id,
      currentStatus: existingTransaction.status,
      newStatus: transactionStatus,
      cancha_id: existingTransaction.cancha_id,
      fecha: existingTransaction.fecha,
      hora: existingTransaction.hora,
      webhookAlreadyProcessed: existingTransaction.webhook_received_at
    })

    // PREVENIR DUPLICACIÓN: Si el webhook ya fue procesado con el mismo estado, ignorar
    if (existingTransaction.status === transactionStatus && existingTransaction.webhook_received_at) {
      console.log('⚠️ Webhook duplicado detectado - mismo estado ya procesado:', {
        orderId: reference,
        status: transactionStatus,
        webhookTime: existingTransaction.webhook_received_at
      })
      
      return NextResponse.json({ 
        received: true,
        duplicate: true,
        message: 'Webhook already processed with same status',
        status: transactionStatus,
        orderId: reference
      })
    }

    // Actualizar transacción en Supabase
    const { data, error } = await supabase
      .from('transactions')
      .update({
        status: transactionStatus,
        getnet_status: status?.status,
        getnet_reason: status?.reason,
        getnet_message: status?.message,
        payment_method: status?.paymentMethod,
        authorization_code: status?.authorization,
        updated_at: new Date().toISOString(),
        webhook_received_at: new Date().toISOString()
      })
      .eq('order_id', reference)
      .select()

    if (error) {
      console.error('Database update error:', error)
      return NextResponse.json({ 
        received: false, 
        error: 'Database update failed',
        details: error.message
      }, { status: 500 })
    }

    console.log('Transaction updated successfully:', data)

    // Si el pago fue aprobado, crear la reserva
    if (transactionStatus === TRANSACTION_STATUS.APPROVED && existingTransaction.cancha_id) {
      console.log('Creating reservation for approved payment...')
      
      try {
        // 1. Buscar o crear cliente con los datos de la transacción
        console.log('Buscando o creando cliente...')
        const resultadoCliente = await buscarOCrearCliente({
          email: existingTransaction.buyer_email,
          nombre: existingTransaction.buyer_name,
          telefono: existingTransaction.buyer_phone,
          rut: existingTransaction.buyer_rut
        })

        if (!resultadoCliente.success) {
          console.error('Error gestionando cliente:', resultadoCliente.error)
          return NextResponse.json({ 
            received: true,
            status: transactionStatus,
            orderId: reference,
            message: 'Webhook processed but client creation failed',
            error: resultadoCliente.error
          })
        }

        const cliente = resultadoCliente.cliente
        console.log('Cliente obtenido/creado:', cliente.id)

        // 2. Calcular hora_fin usando helper function
        const horaInicio = existingTransaction.hora
        const horaFin = calculateEndTime(horaInicio)
        
        console.log('Horarios:', { hora_inicio: horaInicio, hora_fin: horaFin })

        // 3. Crear la reserva usando crearReserva con validación de disponibilidad
        console.log('Intentando crear reserva con validación de disponibilidad...')
        
        const resultadoReserva = await crearReserva({
          cliente_id: cliente.id,
          cancha_id: existingTransaction.cancha_id,
          fecha: existingTransaction.fecha,
          hora_inicio: horaInicio,
          hora_fin: horaFin,
          transaction_id: reference,
          estado: DEFAULT_RESERVATION_STATUS
        })

        if (!resultadoReserva.success) {
          console.error('Error o conflicto al crear reserva:', resultadoReserva.error)
          
          // Si el error es de disponibilidad (código específico o mensaje)
          if (resultadoReserva.code === 'SLOT_UNAVAILABLE' || resultadoReserva.error.includes('no está disponible')) {
            console.warn('⚠️ CONFLICTO DE RESERVA: La cancha ya fue reservada por otro usuario')
            console.warn('⚠️ ACCIÓN REQUERIDA: Reembolsar pago al usuario:', {
              orderId: reference,
              cliente: existingTransaction.buyer_email,
              monto: existingTransaction.amount,
              errorCode: resultadoReserva.code,
              dbError: resultadoReserva.dbError
            })
            
            // ENVIAR EMAIL AUTOMÁTICO DE REEMBOLSO AL CLIENTE
            const refundEmailResult = await sendRefundNotification({
              clienteEmail: existingTransaction.buyer_email,
              clienteNombre: existingTransaction.buyer_name,
              orderId: reference,
              monto: existingTransaction.amount,
              motivo: 'La cancha ya fue reservada por otro usuario mientras procesábamos tu pago',
              fecha: new Date(existingTransaction.fecha).toLocaleDateString('es-CL'),
              horaInicio: existingTransaction.hora,
              canchaInfo: 'Cancha solicitada'
            })

            if (refundEmailResult.success) {
              console.log('✅ Email de reembolso enviado al cliente')
            } else {
              console.error('⚠️ No se pudo enviar email de reembolso:', refundEmailResult.error)
            }

            // NOTIFICAR AL ADMIN DEL CONFLICTO
            try {
              const adminNotificationResult = await sendAdminReservationNotification({
                clienteNombre: existingTransaction.buyer_name,
                clienteEmail: existingTransaction.buyer_email,
                clienteTelefono: existingTransaction.buyer_phone || 'No proporcionado',
                canchaInfo: `CONFLICTO - Cancha ID: ${existingTransaction.cancha_id}`,
                fecha: new Date(existingTransaction.fecha).toLocaleDateString('es-CL'),
                horaInicio: existingTransaction.hora,
                horaFin: calculateEndTime(existingTransaction.hora),
                monto: existingTransaction.amount,
                reservaId: 'CONFLICTO',
                orderId: reference,
                metodoPago: status?.paymentMethod || 'No especificado'
              })

              if (adminNotificationResult.success) {
                console.log('✅ Alerta de conflicto enviada al admin')
              }
            } catch (adminError) {
              console.error('⚠️ Error enviando alerta al admin:', adminError)
            }
            
            return NextResponse.json({ 
              received: true,
              status: transactionStatus,
              orderId: reference,
              warning: 'PAYMENT_CONFLICT',
              message: 'Pago aprobado pero cancha ya reservada. Email de reembolso enviado al cliente.',
              refund_email_sent: refundEmailResult.success,
              action_required: 'Procesar reembolso manualmente en plataforma de pagos',
              cliente: {
                email: existingTransaction.buyer_email,
                nombre: existingTransaction.buyer_name,
                monto: existingTransaction.amount
              }
            })
          }
          
          // Otro tipo de error
          return NextResponse.json({ 
            received: true,
            status: transactionStatus,
            orderId: reference,
            message: 'Webhook processed but reservation creation failed',
            reservationError: resultadoReserva.error
          })
        }

        const reservaData = resultadoReserva.data[0]
        console.log('Reservation created successfully:', reservaData)

        // ============================================
        // ENVIAR EMAILS CON PDF ADJUNTO
        // ============================================
        try {
          console.log('📧 Generando PDF y enviando correos...')

          // Obtener información de la cancha
          const { data: canchaData } = await supabase
            .from('canchas')
            .select('nombre')
            .eq('id', reservaData.cancha_id)
            .single()

          const canchaInfo = canchaData?.nombre || `Cancha #${reservaData.cancha_id}`

          // 1. Generar PDF del comprobante
          const pdfResult = await generateReservationPDF({
            reservaId: reservaData.id,
            orderId: reference,
            clienteNombre: cliente.nombre,
            clienteEmail: cliente.correo, // Campo correcto en BD
            clienteTelefono: cliente.telefono || 'No proporcionado',
            canchaInfo: canchaInfo,
            fecha: new Date(reservaData.fecha).toLocaleDateString('es-CL', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            horaInicio: reservaData.hora_inicio,
            horaFin: reservaData.hora_fin || horaFin,
            monto: existingTransaction.amount,
            metodoPago: status?.paymentMethod || 'Tarjeta de Crédito/Débito',
            fechaPago: new Date().toLocaleDateString('es-CL'),
            autorizacion: status?.authorization
          })

          const pdfBuffer = pdfResult.success ? pdfResult.buffer : null

          if (!pdfResult.success) {
            console.error('⚠️ Error generando PDF:', pdfResult.error)
          }

          // 2. Enviar email de confirmación al cliente (con PDF adjunto)
          const emailClienteResult = await sendReservationConfirmation({
            clienteEmail: cliente.correo, // Campo correcto en BD
            clienteNombre: cliente.nombre,
            canchaInfo: canchaInfo,
            fecha: new Date(reservaData.fecha).toLocaleDateString('es-CL', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            horaInicio: reservaData.hora_inicio,
            horaFin: reservaData.hora_fin || horaFin,
            monto: existingTransaction.amount,
            reservaId: reservaData.id,
            orderId: reference,
            pdfBuffer: pdfBuffer
          })

          if (emailClienteResult.success) {
            console.log('✅ Email de confirmación enviado al cliente:', cliente.correo)
          } else {
            console.error('⚠️ No se pudo enviar email al cliente:', emailClienteResult.error)
          }

          // 3. Enviar notificación al administrador
          const emailAdminResult = await sendAdminReservationNotification({
            clienteNombre: cliente.nombre,
            clienteEmail: cliente.correo, // Campo correcto en BD
            clienteTelefono: cliente.telefono || 'No proporcionado',
            canchaInfo: canchaInfo,
            fecha: new Date(reservaData.fecha).toLocaleDateString('es-CL', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            horaInicio: reservaData.hora_inicio,
            horaFin: reservaData.hora_fin || horaFin,
            monto: existingTransaction.amount,
            reservaId: reservaData.id,
            orderId: reference,
            metodoPago: status?.paymentMethod || 'No especificado'
          })

          if (emailAdminResult.success) {
            console.log('✅ Notificación enviada al administrador')
          } else {
            console.error('⚠️ No se pudo enviar notificación al admin:', emailAdminResult.error)
          }

        } catch (emailError) {
          console.error('❌ Error en proceso de envío de emails:', emailError)
          // No fallar el webhook si los emails fallan
        }

        return NextResponse.json({ 
          received: true,
          status: transactionStatus,
          orderId: reference,
          message: 'Webhook processed successfully and reservation created',
          cliente: {
            id: cliente.id,
            nombre: cliente.nombre,
            email: cliente.email
          },
          reservation: {
            id: reservaData.id,
            cancha_id: reservaData.cancha_id,
            fecha: reservaData.fecha,
            hora_inicio: reservaData.hora_inicio,
            estado: reservaData.estado
          }
        })

      } catch (reservaError) {
        console.error('Exception creating reservation:', reservaError)
        return NextResponse.json({ 
          received: true,
          status: transactionStatus,
          orderId: reference,
          message: 'Webhook processed successfully but reservation creation failed',
          reservationError: reservaError.message
        })
      }
    }

    return NextResponse.json({ 
      received: true,
      status: transactionStatus,
      orderId: reference,
      message: 'Webhook processed successfully'
    })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ 
      received: false, 
      error: error.message 
    }, { status: 500 })
  }
}

export async function GET(request) {
  console.log('=== Webhook GET Request ===')
  console.log('Timestamp:', new Date().toISOString())
  console.log('URL:', request.url)
  console.log('Headers:', Object.fromEntries(request.headers.entries()))
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  
  if (!baseUrl) {
    return NextResponse.json({ 
      error: 'Server configuration error: NEXT_PUBLIC_BASE_URL not set'
    }, { status: 500 })
  }
  
  return NextResponse.json({ 
    message: 'CitySoccer Webhook endpoint is working',
    timestamp: new Date().toISOString(),
    url: `${baseUrl}/arrendarcancha/api/payment/webhook`,
    methods: ['GET', 'POST'],
    status: 'OK'
  })
}