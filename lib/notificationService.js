/**
 * Servicio de notificaciones por email para cambios en el dashboard
 * Envía notificaciones al administrador cuando se modifican configuraciones
 */

/**
 * Notificar cambios en precios
 */
export const notifyPriceChange = async ({
  adminNombre,
  tipoCancha,
  cambiosRealizados
}) => {
  try {
    const response = await fetch('/api/notify/price-change', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        adminNombre,
        tipoCancha,
        cambiosRealizados
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error enviando notificación de precios:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Notificar cambios en horarios
 */
export const notifyScheduleChange = async ({
  adminNombre,
  cambiosRealizados
}) => {
  try {
    const response = await fetch('/api/notify/schedule-change', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        adminNombre,
        cambiosRealizados
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error enviando notificación de horarios:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Notificar cambios generales en configuración
 */
export const notifyConfigChange = async ({
  adminNombre,
  tipoConfiguracion,
  cambiosRealizados
}) => {
  try {
    const response = await fetch('/api/notify/config-change', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        adminNombre,
        tipoConfiguracion,
        cambiosRealizados
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error enviando notificación de configuración:', error);
    return { success: false, error: error.message };
  }
};

export const notificationService = {
  notifyPriceChange,
  notifyScheduleChange,
  notifyConfigChange
};

export default notificationService;
