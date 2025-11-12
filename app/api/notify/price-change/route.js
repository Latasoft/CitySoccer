import { NextResponse } from 'next/server'
import { sendConfigChangeNotification } from '@/lib/emailService'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * POST /api/notify/price-change
 * Envía notificación al admin sobre cambios en precios
 */
export async function POST(request) {
  try {
    const { adminNombre, tipoCancha, cambiosRealizados } = await request.json()

    if (!adminNombre || !cambiosRealizados) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      )
    }

    // Formatear los cambios para el email
    const cambiosHTML = Array.isArray(cambiosRealizados) 
      ? cambiosRealizados.map(cambio => `<li>${cambio}</li>`).join('')
      : `<p>${cambiosRealizados}</p>`;

    const cambiosFormateados = Array.isArray(cambiosRealizados)
      ? `<ul style="margin: 0; padding-left: 20px;">${cambiosHTML}</ul>`
      : cambiosHTML;

    // Enviar email de notificación
    const result = await sendConfigChangeNotification({
      adminNombre,
      adminEmail: process.env.ADMIN_EMAIL,
      tipoConfiguracion: `Precios de ${tipoCancha || 'Canchas'}`,
      cambiosRealizados: cambiosFormateados
    })

    if (result.success) {
      console.log('✅ Notificación de cambio de precios enviada')
      return NextResponse.json({
        success: true,
        message: 'Notificación enviada correctamente'
      })
    } else {
      console.warn('⚠️ No se pudo enviar notificación:', result.error)
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 })
    }

  } catch (error) {
    console.error('❌ Error en endpoint de notificación de precios:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    )
  }
}
