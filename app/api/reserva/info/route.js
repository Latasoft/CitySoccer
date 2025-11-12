import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Configuración para rutas
export const dynamic = 'force-dynamic'
export const revalidate = 0

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

/**
 * GET /api/reserva/info?orderId=xxx
 * Obtiene información de una reserva por order ID
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const reservaId = searchParams.get('id')

    if (!orderId && !reservaId) {
      return NextResponse.json(
        { error: 'Order ID o Reserva ID requerido' },
        { status: 400 }
      )
    }

    let query = supabase
      .from('reservas')
      .select(`
        *,
        clientes (
          nombre,
          correo,
          telefono
        ),
        canchas (
          nombre
        )
      `)

    if (reservaId) {
      query = query.eq('id', reservaId)
    } else if (orderId) {
      query = query.eq('transaction_id', orderId)
    }

    const { data: reserva, error } = await query.single()

    if (error || !reserva) {
      console.error('Error obteniendo reserva:', error)
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      reserva: reserva
    })

  } catch (error) {
    console.error('❌ Error en endpoint de info:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}
