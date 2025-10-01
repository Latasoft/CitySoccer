import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import axios from 'axios'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Getnet credentials
const ENDPOINT_URL = 'https://checkout.test.getnet.cl'
const LOGIN = '7ffbb7bf1f7361b1200b2e8d74e1d76f'
const SECRET_KEY = 'SnZP3D63n3I9dH9O'

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

    console.log('Extracted fields:', { amount, currency, buyerEmail, buyerName, description, fecha, hora, cancha_id })

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

    // Crear transacción pendiente en Supabase
    const orderId = `CS-${Date.now()}`
    console.log('Creating transaction with orderId:', orderId)

    const { data: transaction, error: dbError } = await supabase
      .from('transactions')
      .insert({
        order_id: orderId,
        amount: parseInt(amount),
        currency: currency.toUpperCase(),
        buyer_email: buyerEmail,
        buyer_name: buyerName,
        description: description || `Pago CitySoccer - ${orderId}`,
        fecha: fecha || null,
        hora: hora || null,
        cancha_id: cancha_id || null,
        status: 'PENDING',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database insert error:', dbError)
      return NextResponse.json(
        { 
          error: 'Error creando transacción',
          details: dbError.message
        },
        { status: 500 }
      )
    }

    console.log('Transaction created:', transaction)

    // Crear sesión en Getnet
    const expirationDate = new Date()
    expirationDate.setMinutes(expirationDate.getMinutes() + 15)
    const expiration = expirationDate.toISOString()

    const auth = generateAuth()
    // Usar la URL del túnel
    const baseUrl = 'https://0kt1mzhf-3000.brs.devtunnels.ms'

    const paymentData = {
      auth: auth,
      locale: "es_CL",
      buyer: {
        name: buyerName,
        surname: "Usuario",
        email: buyerEmail,
        document: "11111111-9",
        documentType: "CLRUT",
        mobile: 3006108300
      },
      payment: {
        reference: orderId,
        description: description || `Pago CitySoccer - ${orderId}`,
        amount: {
          currency: currency.toUpperCase(),
          total: parseInt(amount)
        }
      },
      expiration: expiration,
      ipAddress: "127.0.0.1",
      returnUrl: `${baseUrl}/test/payment/result?orderId=${orderId}`,
      cancelUrl: `${baseUrl}/test/payment/cancel?orderId=${orderId}`,
      userAgent: "CitySoccer/1.0"
    }

    console.log('Sending to Getnet:', JSON.stringify(paymentData, null, 2))
    console.log('Webhook will be sent to:', `${baseUrl}/test/api/payment/webhook`)

    const response = await axios.post(`${ENDPOINT_URL}/api/session/`, paymentData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000
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
      webhookUrl: `${baseUrl}/test/api/payment/webhook`
    })

  } catch (error) {
    console.error('Payment creation error:', error)
    
    if (error.response) {
      console.error('Getnet API error response:', error.response.data)
      return NextResponse.json(
        { 
          error: 'Error del procesador de pagos',
          details: error.response.data
        },
        { status: error.response.status }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error.message
      },
      { status: 500 }
    )
  }
}