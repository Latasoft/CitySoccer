import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import axios from 'axios'
import {
  ORDER_ID_PREFIX,
  PAYMENT_EXPIRATION_MINUTES,
  DEFAULT_IP,
  DEFAULT_SURNAME,
  DEFAULT_RUT,
  DEFAULT_PHONE,
  DOCUMENT_TYPE,
  USER_AGENT,
  GETNET_TIMEOUT_MS,
  getDefaultPaymentDescription,
  TRANSACTION_STATUS,
  ERROR_MESSAGES
} from '@/lib/constants'

// Configuración para rutas
export const dynamic = 'force-dynamic'
export const revalidate = 0

let supabase;

try {
  supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )
} catch (error) {
  console.error('Error initializing Supabase client:', error);
}

// Getnet credentials desde variables de entorno
const ENDPOINT_URL = process.env.GETNET_ENDPOINT_URL
const LOGIN = process.env.GETNET_LOGIN
const SECRET_KEY = process.env.GETNET_SECRET_KEY

if (!ENDPOINT_URL || !LOGIN || !SECRET_KEY) {
  console.error('Missing GetNet credentials in environment variables')
}

function generateAuth() {
  const seed = new Date().toISOString()
  const nonceBytes = crypto.randomBytes(16)
  const nonceBase64 = nonceBytes.toString('base64')
  
  const tranKeyBuffer = Buffer.concat([
    nonceBytes,
    Buffer.from(seed, 'utf8'),
    Buffer.from(SECRET_KEY, 'utf8')
  ])
  
  const tranKey = crypto.createHash('sha256').update(tranKeyBuffer).digest('base64')
  
  return {
    login: LOGIN,
    tranKey: tranKey,
    nonce: nonceBase64,
    seed: seed
  }
}

export async function POST(request) {
  try {
    console.log('=== Payment Create API Called ===')
    
    // Verificar que el body existe
    let body
    try {
      body = await request.json()
      console.log('Received body:', JSON.stringify(body, null, 2))
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const { amount, currency, buyerEmail, buyerName, description, fecha, hora, cancha_id } = body
    
    // Campos opcionales - GetNet los requiere pero el frontend no los pide
    const buyerRut = body.buyerRut || null
    const buyerPhone = body.buyerPhone || null

    console.log('Extracted fields:', { amount, currency, buyerEmail, buyerName, buyerRut, buyerPhone, description, fecha, hora, cancha_id })

    // Validar datos requeridos
    if (!amount || !currency || !buyerEmail || !buyerName) {
      console.log('Missing required fields')
      return NextResponse.json(
        { 
          error: 'Faltan datos requeridos',
          missing: {
            amount: !amount,
            currency: !currency,
            buyerEmail: !buyerEmail,
            buyerName: !buyerName
          }
        },
        { status: 400 }
      )
    }

    // VERIFICAR DISPONIBILIDAD ANTES DE CREAR TRANSACCIÓN
    if (cancha_id && fecha && hora) {
      console.log('Verificando disponibilidad de cancha antes de crear transacción...')
      
      const { data: conflicto, error: checkError } = await supabase
        .from('reservas')
        .select('id, cliente_id, estado')
        .eq('cancha_id', cancha_id)
        .eq('fecha', fecha)
        .eq('hora_inicio', hora)
        .neq('estado', 'cancelada')
        .maybeSingle()

      if (checkError) {
        console.error('Error verificando disponibilidad:', checkError)
        return NextResponse.json(
          { 
            error: ERROR_MESSAGES.DATABASE,
            details: 'Error al verificar disponibilidad de la cancha'
          },
          { status: 500 }
        )
      }

      if (conflicto) {
        console.log('⚠️ Cancha ya reservada:', conflicto)
        return NextResponse.json(
          { 
            error: 'Esta cancha ya está reservada para ese horario',
            code: 'SLOT_UNAVAILABLE',
            details: {
              cancha_id,
              fecha,
              hora
            }
          },
          { status: 409 } // 409 Conflict
        )
      }

      console.log('✅ Cancha disponible, procediendo con la transacción...')
    }

    // Crear transacción pendiente en Supabase
    const orderId = `${ORDER_ID_PREFIX}${Date.now()}`
    console.log('Creating transaction with orderId:', orderId)

    const { data: transaction, error: dbError } = await supabase
      .from('transactions')
      .insert({
        order_id: orderId,
        amount: parseInt(amount),
        currency: currency.toUpperCase(),
        buyer_email: buyerEmail,
        buyer_name: buyerName,
        buyer_phone: null,
        buyer_rut: null,
        description: description || getDefaultPaymentDescription(orderId),
        fecha: fecha || null,
        hora: hora || null,
        cancha_id: cancha_id || null,
        status: TRANSACTION_STATUS.PENDING,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database insert error:', dbError)
      return NextResponse.json(
        { 
          error: ERROR_MESSAGES.DATABASE,
          details: dbError.message
        },
        { status: 500 }
      )
    }

    console.log('Transaction created:', transaction)

    // Crear sesión en Getnet
    const expirationDate = new Date()
    expirationDate.setMinutes(expirationDate.getMinutes() + PAYMENT_EXPIRATION_MINUTES)
    const expiration = expirationDate.toISOString()

    const auth = generateAuth()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

    if (!baseUrl) {
      console.error('NEXT_PUBLIC_BASE_URL not set in environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Obtener IP del cliente (requerido por GetNet)
    const clientIpAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
                            || request.headers.get('x-real-ip')
                            || DEFAULT_IP
    
    console.log('Client IP Address:', clientIpAddress)

    const paymentData = {
      auth: auth,
      locale: "es_CL",
      buyer: {
        name: buyerName,
        surname: DEFAULT_SURNAME,
        email: buyerEmail,
        document: buyerRut || DEFAULT_RUT,
        documentType: DOCUMENT_TYPE,
        mobile: buyerPhone || DEFAULT_PHONE
      },
      payment: {
        reference: orderId,
        description: description || getDefaultPaymentDescription(orderId),
        amount: {
          currency: currency.toUpperCase(),
          total: parseInt(amount)
        }
      },
      expiration: expiration,
      ipAddress: clientIpAddress,
      returnUrl: `${baseUrl}/arrendarcancha/payment/result?orderId=${orderId}`,
      cancelUrl: `${baseUrl}/arrendarcancha/payment/cancel?orderId=${orderId}`,
      notificationUrl: `${baseUrl}/arrendarcancha/api/payment/webhook`,
      userAgent: USER_AGENT
    }

    console.log('Sending to Getnet:', JSON.stringify(paymentData, null, 2))
    console.log('Webhook will be sent to:', `${baseUrl}/arrendarcancha/api/payment/webhook`)

    const response = await axios.post(`${ENDPOINT_URL}/api/session/`, paymentData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: GETNET_TIMEOUT_MS
    })

    console.log('Getnet response:', response.data)

    // Actualizar transacción con datos de Getnet
    await supabase
      .from('transactions')
      .update({
        getnet_request_id: response.data.requestID,
        process_url: response.data.processUrl
      })
      .eq('order_id', orderId)

    return NextResponse.json({
      success: true,
      orderId: orderId,
      checkoutUrl: response.data.processUrl,
      requestId: response.data.requestID,
      webhookUrl: `${baseUrl}/arrendarcancha/api/payment/webhook`
    })

  } catch (error) {
    console.error('Payment creation error:', error)
    
    if (error.response) {
      console.error('Getnet API error response:', error.response.data)
      return NextResponse.json(
        { 
          error: ERROR_MESSAGES.GETNET_ERROR,
          details: error.response.data
        },
        { status: error.response.status }
      )
    }
    
    return NextResponse.json(
      { 
        error: ERROR_MESSAGES.INTERNAL_ERROR,
        details: error.message
      },
      { status: 500 }
    )
  }
}