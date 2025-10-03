import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

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
    let transactionStatus = 'PENDING'
    switch (status?.status) {
      case 'APPROVED':
        transactionStatus = 'APPROVED'
        break
      case 'REJECTED':
        transactionStatus = 'REJECTED'
        break
      case 'PENDING':
        transactionStatus = 'PENDING'
        break
      default:
        transactionStatus = 'FAILED'
    }

    console.log('Mapped transaction status:', transactionStatus)

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
      hora: existingTransaction.hora
    })

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
    if (transactionStatus === 'APPROVED' && existingTransaction.cancha_id) {
      console.log('Creating reservation for approved payment...')
      
      try {
        // Crear la reserva en la tabla reservas
        const { data: reservaData, error: reservaError } = await supabase
          .from('reservas')
          .insert({
            cliente_id: 1, // Siempre cliente ID 1 como especificaste
            cancha_id: existingTransaction.cancha_id,
            fecha: existingTransaction.fecha,
            hora_inicio: existingTransaction.hora,
            estado: 'confirmada' // Siempre confirmada
          })
          .select()
          .single()

        if (reservaError) {
          console.error('Error creating reservation:', reservaError)
          // No falla el webhook, solo loguea el error
          return NextResponse.json({ 
            received: true,
            status: transactionStatus,
            orderId: reference,
            message: 'Webhook processed successfully but reservation creation failed',
            reservationError: reservaError.message
          })
        }

        console.log('Reservation created successfully:', reservaData)

        return NextResponse.json({ 
          received: true,
          status: transactionStatus,
          orderId: reference,
          message: 'Webhook processed successfully and reservation created',
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
  
  return NextResponse.json({ 
    message: 'CitySoccer Webhook endpoint is working',
    timestamp: new Date().toISOString(),
    url: 'https://0kt1mzhf-3000.brs.devtunnels.ms/arrendarcancha/api/payment/webhook',
    methods: ['GET', 'POST'],
    status: 'OK'
  })
}