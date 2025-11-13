/**
 * Servicio de cola de emails con sistema de reintentos
 * Maneja emails fallidos y permite reintentos automáticos
 */

import { supabase } from './supabaseClient';

export const emailQueueService = {
  /**
   * Agregar email a la cola de reintentos
   */
  addToQueue: async ({
    emailType,
    recipient,
    subject,
    htmlContent,
    attachments = [],
    data = {},
    scheduledFor = new Date()
  }) => {
    try {
      const { data: queueData, error } = await supabase
        .from('email_queue')
        .insert({
          email_type: emailType,
          recipient,
          subject,
          html_content: htmlContent,
          attachments: JSON.stringify(attachments),
          data: JSON.stringify(data),
          status: 'pending',
          scheduled_for: scheduledFor.toISOString(),
          attempts: 0
        })
        .select();

      if (error) throw error;

      console.log('✅ Email agregado a cola:', {
        id: queueData[0].id,
        type: emailType,
        recipient
      });

      return { success: true, data: queueData[0] };
    } catch (error) {
      console.error('❌ Error agregando email a cola:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Marcar email de cola como enviado
   */
  markAsSent: async (queueId, messageId) => {
    try {
      const { error } = await supabase
        .from('email_queue')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          processed_at: new Date().toISOString()
        })
        .eq('id', queueId);

      if (error) throw error;

      console.log('✅ Email de cola marcado como enviado:', queueId);
      return { success: true };
    } catch (error) {
      console.error('❌ Error marcando email como enviado:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Marcar email de cola como fallido
   */
  markAsFailed: async (queueId, errorMessage) => {
    try {
      // Obtener intentos actuales
      const { data: current } = await supabase
        .from('email_queue')
        .select('attempts, max_attempts')
        .eq('id', queueId)
        .single();

      const newAttempts = (current?.attempts || 0) + 1;
      const maxAttempts = current?.max_attempts || 3;
      const isFinalFailure = newAttempts >= maxAttempts;

      const { error } = await supabase
        .from('email_queue')
        .update({
          status: isFinalFailure ? 'failed' : 'pending',
          attempts: newAttempts,
          last_error: errorMessage,
          processed_at: new Date().toISOString(),
          // Reintento programado para 5 minutos después
          scheduled_for: isFinalFailure 
            ? null 
            : new Date(Date.now() + 5 * 60 * 1000).toISOString()
        })
        .eq('id', queueId);

      if (error) throw error;

      console.log(isFinalFailure ? '❌ Email falló definitivamente' : '⚠️ Email programado para reintento', {
        queueId,
        attempts: newAttempts,
        maxAttempts
      });

      return { success: true, isFinalFailure };
    } catch (error) {
      console.error('❌ Error marcando email como fallido:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener emails pendientes de la cola
   */
  getPendingEmails: async (limit = 10) => {
    try {
      const { data, error } = await supabase
        .from('email_queue')
        .select('*')
        .eq('status', 'pending')
        .lte('scheduled_for', new Date().toISOString())
        .lt('attempts', 3)
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('❌ Error obteniendo emails pendientes:', error);
      return { success: false, error: error.message, data: [] };
    }
  }
};

export const emailLogService = {
  /**
   * Registrar email enviado
   */
  logEmail: async ({
    reservationId = null,
    recipient,
    emailType,
    status = 'sent',
    messageId = null,
    errorMessage = null,
    metadata = {}
  }) => {
    try {
      const { data, error } = await supabase
        .from('email_logs')
        .insert({
          reservation_id: reservationId,
          recipient,
          email_type: emailType,
          status,
          message_id: messageId,
          error_message: errorMessage,
          metadata: JSON.stringify(metadata),
          sent_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;

      return { success: true, data: data[0] };
    } catch (error) {
      console.error('❌ Error registrando email:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Actualizar estado de email
   */
  updateStatus: async (logId, status, metadata = {}) => {
    try {
      const updates = {
        status,
        metadata: JSON.stringify(metadata)
      };

      // Agregar timestamp según el estado
      if (status === 'delivered') {
        updates.delivered_at = new Date().toISOString();
      } else if (status === 'bounced') {
        updates.bounced_at = new Date().toISOString();
      } else if (status === 'opened') {
        updates.opened_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('email_logs')
        .update(updates)
        .eq('id', logId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('❌ Error actualizando estado de email:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtener historial de emails de una reserva
   */
  getReservationEmails: async (reservationId) => {
    try {
      const { data, error } = await supabase
        .from('email_logs')
        .select('*')
        .eq('reservation_id', reservationId)
        .order('sent_at', { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('❌ Error obteniendo emails de reserva:', error);
      return { success: false, error: error.message, data: [] };
    }
  }
};

export const adminEmailService = {
  /**
   * Obtener admins activos que deben recibir notificaciones
   */
  getAdminRecipients: async (notificationType = 'all') => {
    try {
      const { data, error } = await supabase
        .from('admin_email_notifications')
        .select('admin_email, admin_name')
        .eq('active', true)
        .or(`notification_types.cs.{${notificationType}},notification_types.cs.{all}`);

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('❌ Error obteniendo admins:', error);
      // Fallback a admin por defecto
      return { 
        success: true, 
        data: [{ admin_email: process.env.ADMIN_EMAIL || 'citysoccersantiago@gmail.com' }] 
      };
    }
  }
};
