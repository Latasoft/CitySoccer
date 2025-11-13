/**
 * Templates de emails para CitySoccer
 * Plantillas HTML responsivas para diferentes tipos de correos
 */

/**
 * Template de confirmación de reserva para el cliente
 */
export const reservationConfirmationTemplate = ({
  clienteNombre,
  canchaInfo,
  fecha,
  horaInicio,
  horaFin,
  monto,
  reservaId,
  orderId
}) => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Reserva - City Soccer</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header con logo y color amarillo -->
          <tr>
            <td style="background-color: #ffee00; padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #000000; font-size: 32px; font-weight: bold;">
                ⚽ CITY SOCCER
              </h1>
              <p style="margin: 10px 0 0 0; color: #000000; font-size: 16px;">
                Tu destino deportivo
              </p>
            </td>
          </tr>

          <!-- Mensaje principal -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px;">
                ¡Reserva Confirmada! ✅
              </h2>
              <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                Hola <strong>${clienteNombre}</strong>,
              </p>
              <p style="margin: 0 0 30px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                Tu reserva ha sido confirmada exitosamente. ¡Nos vemos pronto en la cancha!
              </p>

              <!-- Detalles de la reserva -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9f9f9; border-radius: 8px;">
                <tr>
                  <td style="padding: 25px;">
                    <h3 style="margin: 0 0 15px 0; color: #333333; font-size: 18px;">
                      📋 Detalles de tu Reserva
                    </h3>
                    
                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-size: 14px; width: 40%;">
                          <strong>Cancha:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                          ${canchaInfo}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                          <strong>Fecha:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                          ${fecha}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                          <strong>Horario:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #333333; font-size: 14px;">
                          ${horaInicio} - ${horaFin}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                          <strong>Monto Pagado:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #22c55e; font-size: 18px; font-weight: bold;">
                          $${monto.toLocaleString('es-CL')}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                          <strong>ID Reserva:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #333333; font-size: 14px; font-family: monospace;">
                          #${reservaId}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666666; font-size: 14px;">
                          <strong>ID Orden:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #333333; font-size: 14px; font-family: monospace;">
                          ${orderId}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Instrucciones -->
              <div style="margin: 30px 0; padding: 20px; background-color: #fef3c7; border-left: 4px solid #ffee00; border-radius: 4px;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                  <strong>📌 Importante:</strong> Por favor, llega 10 minutos antes de tu horario reservado. 
                  Presenta este correo o tu ID de reserva en recepción.
                </p>
              </div>

              <!-- Adjunto PDF -->
              <p style="margin: 20px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                📄 <strong>Comprobante adjunto:</strong> Encontrarás tu comprobante en PDF adjunto a este correo.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1f2937; padding: 30px; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 16px; font-weight: bold;">
                City Soccer
              </p>
              <p style="margin: 0 0 15px 0; color: #9ca3af; font-size: 14px;">
                📍 Dirección de las canchas • 📞 +56 9 1234 5678
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} City Soccer. Todos los derechos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

/**
 * Template de notificación de nueva reserva para el admin
 */
export const adminReservationNotificationTemplate = ({
  clienteNombre,
  clienteEmail,
  clienteTelefono,
  canchaInfo,
  fecha,
  horaInicio,
  horaFin,
  monto,
  reservaId,
  orderId,
  metodoPago
}) => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nueva Reserva - City Soccer Admin</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header admin -->
          <tr>
            <td style="background-color: #ef4444; padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                🔔 NUEVA RESERVA
              </h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px;">
                Panel de Administración - City Soccer
              </p>
            </td>
          </tr>

          <!-- Contenido -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                Se ha registrado una nueva reserva en el sistema:
              </p>

              <!-- Info del Cliente -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #eff6ff; border-radius: 8px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 16px;">
                      👤 Información del Cliente
                    </h3>
                    <p style="margin: 5px 0; color: #333333; font-size: 14px;">
                      <strong>Nombre:</strong> ${clienteNombre}
                    </p>
                    <p style="margin: 5px 0; color: #333333; font-size: 14px;">
                      <strong>Email:</strong> ${clienteEmail}
                    </p>
                    <p style="margin: 5px 0; color: #333333; font-size: 14px;">
                      <strong>Teléfono:</strong> ${clienteTelefono || 'No proporcionado'}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Info de la Reserva -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f0fdf4; border-radius: 8px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px 0; color: #15803d; font-size: 16px;">
                      ⚽ Detalles de la Reserva
                    </h3>
                    <p style="margin: 5px 0; color: #333333; font-size: 14px;">
                      <strong>Cancha:</strong> ${canchaInfo}
                    </p>
                    <p style="margin: 5px 0; color: #333333; font-size: 14px;">
                      <strong>Fecha:</strong> ${fecha}
                    </p>
                    <p style="margin: 5px 0; color: #333333; font-size: 14px;">
                      <strong>Horario:</strong> ${horaInicio} - ${horaFin}
                    </p>
                    <p style="margin: 5px 0; color: #333333; font-size: 14px;">
                      <strong>Monto:</strong> <span style="color: #15803d; font-weight: bold;">$${monto.toLocaleString('es-CL')}</span>
                    </p>
                    <p style="margin: 5px 0; color: #333333; font-size: 14px;">
                      <strong>Método de Pago:</strong> ${metodoPago || 'No especificado'}
                    </p>
                    <p style="margin: 5px 0; color: #333333; font-size: 14px;">
                      <strong>ID Reserva:</strong> <code>#${reservaId}</code>
                    </p>
                    <p style="margin: 5px 0; color: #333333; font-size: 14px;">
                      <strong>ID Orden:</strong> <code>${orderId}</code>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Botón Dashboard -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://citysoccer.cl'}/dashboard/reservas" 
                   style="display: inline-block; padding: 15px 40px; background-color: #ffee00; color: #000000; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  Ver en Dashboard
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1f2937; padding: 20px; text-align: center;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                Este es un correo automático del sistema de reservas de City Soccer
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

/**
 * Template de notificación de cambios en configuración para el admin
 */
export const adminConfigChangeNotificationTemplate = ({
  adminNombre,
  tipoConfiguracion,
  cambiosRealizados,
  timestamp
}) => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cambios en Configuración - City Soccer</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #f59e0b; padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                ⚙️ CAMBIOS EN CONFIGURACIÓN
              </h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px;">
                Sistema de Administración - City Soccer
              </p>
            </td>
          </tr>

          <!-- Contenido -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                Se han realizado modificaciones en el sistema:
              </p>

              <!-- Info del cambio -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #fef3c7; border-radius: 8px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px 0; color: #92400e; font-size: 16px;">
                      📝 Información del Cambio
                    </h3>
                    <p style="margin: 5px 0; color: #333333; font-size: 14px;">
                      <strong>Realizado por:</strong> ${adminNombre}
                    </p>
                    <p style="margin: 5px 0; color: #333333; font-size: 14px;">
                      <strong>Tipo:</strong> ${tipoConfiguracion}
                    </p>
                    <p style="margin: 5px 0; color: #333333; font-size: 14px;">
                      <strong>Fecha/Hora:</strong> ${timestamp}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Detalles de los cambios -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9f9f9; border-radius: 8px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 15px 0; color: #333333; font-size: 16px;">
                      🔄 Cambios Realizados
                    </h3>
                    <div style="color: #333333; font-size: 14px; line-height: 1.8;">
                      ${cambiosRealizados}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Nota de seguridad -->
              <div style="margin: 30px 0; padding: 15px; background-color: #fee2e2; border-left: 4px solid #ef4444; border-radius: 4px;">
                <p style="margin: 0; color: #991b1b; font-size: 13px; line-height: 1.6;">
                  <strong>⚠️ Nota de Seguridad:</strong> Si no realizaste estos cambios, 
                  contacta inmediatamente al administrador del sistema.
                </p>
              </div>

              <!-- Botón Dashboard -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://citysoccer.cl'}/dashboard" 
                   style="display: inline-block; padding: 15px 40px; background-color: #ffee00; color: #000000; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  Ir al Dashboard
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1f2937; padding: 20px; text-align: center;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                Este es un correo automático del sistema de administración de City Soccer
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

/**
 * Template de notificación de conflicto de pago / reembolso
 */
export const refundNotificationTemplate = ({
  clienteNombre,
  orderId,
  monto,
  motivo,
  fecha,
  horaInicio,
  canchaInfo
}) => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reembolso en Proceso - City Soccer</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #dc2626; padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                ⚠️ REEMBOLSO EN PROCESO
              </h1>
            </td>
          </tr>

          <!-- Contenido -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #333333;">
                Estimado/a ${clienteNombre},
              </h2>
              
              <p style="margin: 0 0 15px 0; color: #555555; font-size: 16px; line-height: 1.6;">
                Lamentamos informarte que tu reserva <strong>no pudo ser procesada</strong> debido al siguiente motivo:
              </p>

              <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #991b1b; font-weight: bold;">
                  ${motivo}
                </p>
              </div>

              <h3 style="margin: 30px 0 15px 0; color: #333333;">
                Detalles de la Transacción:
              </h3>

              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; background-color: #f9fafb; font-weight: bold;">ID de Orden:</td>
                  <td style="padding: 10px; background-color: #ffffff;">${orderId}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; background-color: #f9fafb; font-weight: bold;">Monto Pagado:</td>
                  <td style="padding: 10px; background-color: #ffffff;">$${monto.toLocaleString('es-CL')}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; background-color: #f9fafb; font-weight: bold;">Cancha:</td>
                  <td style="padding: 10px; background-color: #ffffff;">${canchaInfo}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; background-color: #f9fafb; font-weight: bold;">Fecha:</td>
                  <td style="padding: 10px; background-color: #ffffff;">${fecha}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; background-color: #f9fafb; font-weight: bold;">Hora:</td>
                  <td style="padding: 10px; background-color: #ffffff;">${horaInicio}</td>
                </tr>
              </table>

              <div style="background-color: #eff6ff; border-left: 4px solid: #2563eb; padding: 20px; margin: 30px 0;">
                <h4 style="margin: 0 0 10px 0; color: #1e40af;">
                  💳 Proceso de Reembolso
                </h4>
                <p style="margin: 0; color: #1e3a8a; line-height: 1.6;">
                  Tu reembolso será procesado <strong>dentro de las próximas 24-48 horas</strong>. 
                  El dinero será devuelto al mismo medio de pago utilizado en la transacción original.
                </p>
                <p style="margin: 10px 0 0 0; color: #1e3a8a; line-height: 1.6;">
                  <strong>Tiempo estimado de acreditación:</strong> 5-10 días hábiles (depende de tu banco).
                </p>
              </div>

              <p style="margin: 30px 0 15px 0; color: #555555; font-size: 16px; line-height: 1.6;">
                Nuestro equipo te contactará por email o teléfono para confirmar el reembolso y ofrecerte alternativas.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://wa.me/${process.env.WHATSAPP_NUMBER || '56912345678'}?text=Hola! Tengo consultas sobre mi reembolso (Orden: ${orderId})" 
                   style="display: inline-block; background-color: #16a34a; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  💬 Contactar Soporte
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                <strong>City Soccer Santiago</strong><br/>
                Email: gerencia@citysoccer.cl<br/>
                WhatsApp: +56 9 1234 5678
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                Este es un correo automático. Por favor no respondas a este mensaje.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

