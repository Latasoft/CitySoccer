/** Constantes globales */

// ============================================================================
// CONFIGURACIÓN DE PAGOS
// ============================================================================

export const CURRENCY = 'CLP';
export const CURRENCY_SYMBOL = '$';

/**
 * Prefijo para los IDs de orden de pago
 */
export const ORDER_ID_PREFIX = 'CS-';

/**
 * Tiempo de expiración de sesión de pago en minutos
 */
export const PAYMENT_EXPIRATION_MINUTES = 15;

/**
 * Timeout para requests a GetNet en milisegundos
 */
export const GETNET_TIMEOUT_MS = 30000;

/**
 * User Agent enviado a GetNet
 */
export const USER_AGENT = 'CitySoccer/1.0';

/**
 * Tipo de documento para GetNet (Chile)
 */
export const DOCUMENT_TYPE = 'CLRUT';

// ============================================================================
// DATOS GENÉRICOS/FALLBACK PARA GETNET
// ============================================================================

export const DEFAULT_SURNAME = 'Usuario';
export const DEFAULT_RUT = '11111111-1';
export const DEFAULT_PHONE = '+56912345678';
export const DEFAULT_IP = '0.0.0.0';

/**
 * Descripción por defecto para transacciones
 */
export const getDefaultPaymentDescription = (orderId) => `Pago CitySoccer - ${orderId}`;

// ============================================================================
// ESTADOS DE TRANSACCIONES
// ============================================================================

/**
 * Estados posibles de una transacción
 */
export const TRANSACTION_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  FAILED: 'FAILED'
};

/**
 * Mapeo de estados de GetNet a estados internos
 */
export const GETNET_STATUS_MAP = {
  'APPROVED': TRANSACTION_STATUS.APPROVED,
  'REJECTED': TRANSACTION_STATUS.REJECTED,
  'PENDING': TRANSACTION_STATUS.PENDING,
};

/**
 * Estado por defecto cuando no se puede mapear
 */
export const DEFAULT_TRANSACTION_STATUS = TRANSACTION_STATUS.FAILED;

// ============================================================================
// ESTADOS DE RESERVAS
// ============================================================================

/**
 * Estados posibles de una reserva
 */
export const RESERVATION_STATUS = {
  CONFIRMADA: 'confirmada',
  CANCELADA: 'cancelada',
  COMPLETADA: 'completada',
  PENDIENTE: 'pendiente'
};

/**
 * Estado inicial de una reserva cuando el pago es aprobado
 */
export const DEFAULT_RESERVATION_STATUS = RESERVATION_STATUS.CONFIRMADA;

// ============================================================================
// CONFIGURACIÓN DE RESERVAS
// ============================================================================

/**
 * Duración por defecto de una reserva en horas
 * TODO: Hacer esto configurable por tipo de cancha
 */
export const DEFAULT_RESERVATION_DURATION_HOURS = 1;

/**
 * Calcular hora de fin basada en hora de inicio
 * @param {string} horaInicio
 * @param {number} durationHours
 * @returns {string}
 */
export const calculateEndTime = (horaInicio, durationHours = DEFAULT_RESERVATION_DURATION_HOURS) => {
  const [hours, minutes] = horaInicio.split(':');
  const endHour = parseInt(hours) + durationHours;
  return `${endHour.toString().padStart(2, '0')}:${minutes}`;
};

// ============================================================================
// TIMEOUTS Y REINTENTOS
// ============================================================================


export const MAX_PAYMENT_STATUS_ATTEMPTS = 8;

/**
 * Delay entre intentos de verificación en milisegundos
 */
export const PAYMENT_STATUS_RETRY_DELAY_MS = 1000;

/**
 * Tiempo de caché para configuración dinámica en milisegundos
 */
export const CONFIG_CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutos

/**
 * Tiempo que se muestra un mensaje de éxito/error en milisegundos
 */
export const MESSAGE_DISPLAY_DURATION_MS = 3000;

/**
 * Tiempo de display corto para mensajes en milisegundos
 */
export const MESSAGE_DISPLAY_SHORT_MS = 2000;

// ============================================================================
// EMAILS DE ADMINISTRADORES
// ============================================================================

/**
 * Lista de emails con permisos de administrador
 * TODO: Mover esto a base de datos
 */
export const ADMIN_EMAILS = [
  'admin@citysoccer.com',
  'administrador@citysoccer.com',
];

// ============================================================================
// CONFIGURACIÓN POR DEFECTO
// ============================================================================

/**
 * Configuración de contacto por defecto (fallbacks)
 * Estos valores se usan cuando no hay configuración en la BD
 */
export const DEFAULT_CONTACT_CONFIG = {
  whatsapp: '+56974265020',
  email_principal: 'contacto@citysoccer.cl',
  telefono_principal: '+56974265020',
  instagram: '@citysoccersantiago',
  facebook: 'CitySoccerSantiago',
  direccion: 'Tiltil 2569, Macul',
  horario_semana: 'Lunes a Viernes: 9:00 - 23:00',
  horario_sabado: 'Sábados: 9:00 - 23:00',
  horario_domingo: 'Domingos: 9:00 - 23:00',
  descripcion_principal: 'Centro deportivo de fútbol y pickleball en Santiago',
  hero_titulo: 'CitySoccer',
  hero_subtitulo: 'Tu espacio deportivo en Santiago'
};

// ============================================================================
// MENSAJES DE ERROR
// ============================================================================

/**
 * Mensajes de error estandarizados
 */
export const ERROR_MESSAGES = {
  PAYMENT_CREATION: 'Error creando el pago',
  CONNECTION: 'Error de conexión',
  MISSING_FIELDS: 'Faltan datos requeridos',
  INVALID_DATA: 'Datos inválidos',
  DATABASE: 'Error en la base de datos',
  TRANSACTION_NOT_FOUND: 'Transacción no encontrada',
  UNAVAILABLE: 'Este horario ya no está disponible',
  GETNET_ERROR: 'Error del procesador de pagos',
  INTERNAL_ERROR: 'Error interno del servidor'
};

// ============================================================================
// MENSAJES DE ÉXITO
// ============================================================================

/**
 * Mensajes de éxito estandarizados
 */
export const SUCCESS_MESSAGES = {
  PAYMENT_CREATED: 'Pago creado exitosamente',
  RESERVATION_CREATED: 'Reserva creada exitosamente',
  WEBHOOK_PROCESSED: 'Webhook procesado exitosamente',
  CONFIG_UPDATED: 'Configuración actualizada',
  IMAGE_UPLOADED: 'Imagen subida exitosamente'
};

// ============================================================================
// UI HELPERS - ESTILOS Y UTILIDADES
// ============================================================================

/**
 * Obtener clases CSS para el estado de reserva
 * @param {string} estado - Estado de la reserva (confirmada, pendiente, cancelada)
 * @returns {string} Clases CSS de Tailwind
 */
export const getReservationStatusClass = (estado) => {
  switch (estado) {
    case RESERVATION_STATUS.CONFIRMADA:
      return 'bg-green-600/30 text-green-300 border-green-600/50';
    case RESERVATION_STATUS.PENDIENTE:
      return 'bg-yellow-600/30 text-yellow-300 border-yellow-600/50';
    case RESERVATION_STATUS.CANCELADA:
      return 'bg-red-600/30 text-red-300 border-red-600/50';
    default:
      return 'bg-gray-600/30 text-gray-300 border-gray-600/50';
  }
};

/**
 * Obtener clases CSS para el estado de transacción
 * @param {string} status - Estado de la transacción (APPROVED, REJECTED, PENDING, FAILED)
 * @returns {string} Clases CSS de Tailwind
 */
export const getTransactionStatusClass = (status) => {
  switch (status) {
    case TRANSACTION_STATUS.APPROVED:
      return 'bg-green-600/30 text-green-300 border-green-600/50';
    case TRANSACTION_STATUS.REJECTED:
      return 'bg-red-600/30 text-red-300 border-red-600/50';
    case TRANSACTION_STATUS.PENDING:
      return 'bg-yellow-600/30 text-yellow-300 border-yellow-600/50';
    case TRANSACTION_STATUS.FAILED:
      return 'bg-gray-600/30 text-gray-300 border-gray-600/50';
    default:
      return 'bg-gray-600/30 text-gray-300 border-gray-600/50';
  }
};

// ============================================================================
// VALIDACIONES
// ============================================================================

/**
 * Monto mínimo para un pago
 */
export const MIN_PAYMENT_AMOUNT = 100;

/**
 * Regex para validar email
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Regex para validar teléfono chileno
 */
export const PHONE_REGEX = /^(\+?56)?9\d{8}$/;

/**
 * Regex para validar RUT chileno
 */
export const RUT_REGEX = /^\d{7,8}[0-9Kk]$/;

/**
 * Longitud mínima para nombre
 */
export const MIN_NAME_LENGTH = 2;
