/**
 * Servicio de envío de correos electrónicos para CitySoccer
 * Utiliza Nodemailer con Gmail
 */

import nodemailer from 'nodemailer';
import {
  reservationConfirmationTemplate,
  adminReservationNotificationTemplate,
  adminConfigChangeNotificationTemplate
} from './emailTemplates';

// Configuración del transporter de Gmail
let transporter = null;

/**
 * Inicializar el transporter de Nodemailer
 */
const initTransporter = () => {
  if (transporter) return transporter;

  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailAppPassword) {
    console.error('❌ GMAIL_USER o GMAIL_APP_PASSWORD no están configurados');
    return null;
  }

  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword
      },
      // Configuración adicional para mejorar deliverability
      pool: true, // Reutilizar conexiones
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 1000, // 1 segundo entre mensajes
      rateLimit: 5 // Máximo 5 emails por segundo
    });

    console.log('✅ Transporter de Gmail inicializado correctamente');
    return transporter;
  } catch (error) {
    console.error('❌ Error inicializando transporter de Gmail:', error);
    return null;
  }
};

/**
 * Verificar la configuración del transporter
 */
export const verifyEmailConfig = async () => {
  const transport = initTransporter();
  
  if (!transport) {
    return {
      success: false,
      error: 'Transporter no inicializado. Verifica las credenciales de Gmail.'
    };
  }

  try {
    await transport.verify();
    console.log('✅ Configuración de Gmail verificada correctamente');
    return { success: true };
  } catch (error) {
    console.error('❌ Error verificando configuración de Gmail:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Enviar correo de confirmación de reserva al cliente
 */
export const sendReservationConfirmation = async ({
  clienteEmail,
  clienteNombre,
  canchaInfo,
  fecha,
  horaInicio,
  horaFin,
  monto,
  reservaId,
  orderId,
  pdfBuffer = null // Buffer del PDF opcional
}) => {
  const transport = initTransporter();
  
  if (!transport) {
    console.error('❌ No se puede enviar email: transporter no disponible');
    return { success: false, error: 'Servicio de email no disponible' };
  }

  try {
    // Preparar adjuntos
    const attachments = [];
    
    if (pdfBuffer) {
      attachments.push({
        filename: `Comprobante_Reserva_${reservaId}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      });
    }

    // Configurar el correo
    const mailOptions = {
      from: {
        name: 'City Soccer',
        address: process.env.GMAIL_USER
      },
      to: clienteEmail,
      subject: `✅ Reserva Confirmada #${reservaId} - City Soccer`,
      html: reservationConfirmationTemplate({
        clienteNombre,
        canchaInfo,
        fecha,
        horaInicio,
        horaFin,
        monto,
        reservaId,
        orderId
      }),
      attachments
    };

    // Enviar el correo
    const info = await transport.sendMail(mailOptions);
    
    console.log('✅ Email de confirmación enviado:', {
      messageId: info.messageId,
      to: clienteEmail,
      reservaId
    });

    return {
      success: true,
      messageId: info.messageId,
      recipient: clienteEmail
    };

  } catch (error) {
    console.error('❌ Error enviando email de confirmación:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Enviar notificación de nueva reserva al administrador
 */
export const sendAdminReservationNotification = async ({
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
  const transport = initTransporter();
  
  if (!transport) {
    console.warn('⚠️ No se puede enviar notificación al admin: transporter no disponible');
    return { success: false, error: 'Servicio de email no disponible' };
  }

  // Obtener email del admin desde variable de entorno o BD
  const adminEmail = process.env.ADMIN_EMAIL;
  
  if (!adminEmail) {
    console.warn('⚠️ ADMIN_EMAIL no configurado, no se envió notificación');
    return { success: false, error: 'Email de administrador no configurado' };
  }

  try {
    const mailOptions = {
      from: {
        name: 'City Soccer System',
        address: process.env.GMAIL_USER
      },
      to: adminEmail,
      subject: `🔔 Nueva Reserva #${reservaId} - ${fecha} ${horaInicio}`,
      html: adminReservationNotificationTemplate({
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
      }),
      priority: 'high' // Marcar como alta prioridad
    };

    const info = await transport.sendMail(mailOptions);
    
    console.log('✅ Notificación enviada al admin:', {
      messageId: info.messageId,
      to: adminEmail,
      reservaId
    });

    return {
      success: true,
      messageId: info.messageId,
      recipient: adminEmail
    };

  } catch (error) {
    console.error('❌ Error enviando notificación al admin:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Enviar notificación de cambio en configuración al administrador
 */
export const sendConfigChangeNotification = async ({
  adminNombre,
  adminEmail,
  tipoConfiguracion,
  cambiosRealizados
}) => {
  const transport = initTransporter();
  
  if (!transport) {
    console.warn('⚠️ No se puede enviar notificación de cambio: transporter no disponible');
    return { success: false, error: 'Servicio de email no disponible' };
  }

  // Email del admin que recibirá la notificación
  const notificationEmail = process.env.ADMIN_EMAIL;
  
  if (!notificationEmail) {
    console.warn('⚠️ ADMIN_EMAIL no configurado para notificaciones');
    return { success: false, error: 'Email de administrador no configurado' };
  }

  try {
    const timestamp = new Date().toLocaleString('es-CL', {
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    const mailOptions = {
      from: {
        name: 'City Soccer System',
        address: process.env.GMAIL_USER
      },
      to: notificationEmail,
      subject: `⚙️ Cambios en ${tipoConfiguracion} - City Soccer`,
      html: adminConfigChangeNotificationTemplate({
        adminNombre,
        tipoConfiguracion,
        cambiosRealizados,
        timestamp
      }),
      priority: 'normal'
    };

    const info = await transport.sendMail(mailOptions);
    
    console.log('✅ Notificación de cambio enviada:', {
      messageId: info.messageId,
      to: notificationEmail,
      tipo: tipoConfiguracion
    });

    return {
      success: true,
      messageId: info.messageId,
      recipient: notificationEmail
    };

  } catch (error) {
    console.error('❌ Error enviando notificación de cambio:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Enviar email genérico (para uso interno)
 */
export const sendEmail = async ({
  to,
  subject,
  html,
  text = null,
  attachments = []
}) => {
  const transport = initTransporter();
  
  if (!transport) {
    return { success: false, error: 'Servicio de email no disponible' };
  }

  try {
    const mailOptions = {
      from: {
        name: 'City Soccer',
        address: process.env.GMAIL_USER
      },
      to,
      subject,
      html,
      text,
      attachments
    };

    const info = await transport.sendMail(mailOptions);
    
    console.log('✅ Email genérico enviado:', {
      messageId: info.messageId,
      to
    });

    return {
      success: true,
      messageId: info.messageId,
      recipient: to
    };

  } catch (error) {
    console.error('❌ Error enviando email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Exportar el servicio de email
export const emailService = {
  verifyConfig: verifyEmailConfig,
  sendReservationConfirmation,
  sendAdminReservationNotification,
  sendConfigChangeNotification,
  sendEmail
};

export default emailService;
