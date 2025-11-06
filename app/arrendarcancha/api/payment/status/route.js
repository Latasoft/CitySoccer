import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Configuración para rutas dinámicas
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

export async function GET(request) {
  try {
    console.log('=== Payment Status Check ===')
    
    // Verificar que Supabase esté inicializado
    if (!supabase) {
      console.error('Supabase client not initialized')
      return NextResponse.json(
        { error: 'Error de configuración del servidor' },
        { status: 500 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')

    console.log('Checking status for orderId:', orderId)

    if (!orderId) {
      console.log('No orderId provided')
      return NextResponse.json(
        { error: 'Order ID requerido' },
        { status: 400 }
      )
    }

    console.log('Querying Supabase for transaction...')
    const { data: transaction, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('order_id', orderId)
      .single()

    if (error) {
      console.error('Supabase query error:', error)
      return NextResponse.json(
        { error: 'Error consultando transacción', details: error.message },
        { status: 500 }
      )
    }

    if (!transaction) {
      console.log('Transaction not found')
      return NextResponse.json(
        { error: 'Transacción no encontrada' },
        { status: 404 }
      )
    }

    console.log('Transaction found:', {
      orderId: transaction.order_id,
      status: transaction.status,
      getnet_status: transaction.getnet_status,
      webhook_received_at: transaction.webhook_received_at,
      updated_at: transaction.updated_at
    })

    const response = {
      orderId: transaction.order_id,
      status: transaction.status,
      amount: transaction.amount,
      currency: transaction.currency,
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at,
      paymentMethod: transaction.payment_method,
      authorizationCode: transaction.authorization_code,
      getnetStatus: transaction.getnet_status,
      webhookReceived: !!transaction.webhook_received_at
    }

    console.log('Returning response:', response)
    return NextResponse.json(response)

  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}