import { getSupabaseServiceClient } from '@/lib/supabaseClients'
import { NextResponse } from 'next/server'
import { generateReservationPDF } from '@/lib/pdfService'

// Configuración para rutas
export const dynamic = 'force-dynamic'
export const revalidate = 0

const supabase = getSupabaseServiceClient()

/**
 * GET /api/reserva/pdf?id=123
 * Genera y descarga el PDF del comprobante de una reserva
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const reservaId = searchParams.get('id')

    if (!reservaId) {
      return NextResponse.json(
        { error: 'ID de reserva requerido' },
        { status: 400 }
      )
    }

    console.log('📄 Generando PDF para reserva:', reservaId)

    // Obtener datos completos de la reserva
    const { data: reserva, error: reservaError } = await supabase
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
      .eq('id', reservaId)
      .single()

    if (reservaError || !reserva) {
      console.error('Error obteniendo reserva:', reservaError)
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }

    // Obtener datos de la transacción
    const { data: transaction } = await supabase
      .from('transactions')
      .select('*')
      .eq('order_id', reserva.transaction_id)
      .single()

    // Generar PDF
    const pdfResult = await generateReservationPDF({
      reservaId: reserva.id,
      orderId: reserva.transaction_id || 'N/A',
      clienteNombre: reserva.clientes?.nombre || 'Cliente',
      clienteEmail: reserva.clientes?.correo || '',
      clienteTelefono: reserva.clientes?.telefono || '',
      canchaInfo: reserva.canchas?.nombre || `Cancha #${reserva.cancha_id}`,
      fecha: new Date(reserva.fecha).toLocaleDateString('es-CL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      horaInicio: reserva.hora_inicio,
      horaFin: reserva.hora_fin,
      monto: transaction?.amount || 0,
      metodoPago: transaction?.payment_method || 'No especificado',
      fechaPago: transaction?.created_at ? new Date(transaction.created_at).toLocaleDateString('es-CL') : new Date().toLocaleDateString('es-CL'),
      autorizacion: transaction?.authorization_code || null
    })

    if (!pdfResult.success) {
      console.error('Error generando PDF:', pdfResult.error)
      return NextResponse.json(
        { error: 'Error generando PDF', details: pdfResult.error },
        { status: 500 }
      )
    }

    console.log('✅ PDF generado exitosamente:', pdfResult.filename)

    // Retornar PDF como descarga
    return new NextResponse(pdfResult.buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${pdfResult.filename}"`,
        'Content-Length': pdfResult.buffer.length.toString()
      }
    })

  } catch (error) {
    console.error('❌ Error en endpoint de PDF:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}
