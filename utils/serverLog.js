/**
 * Utilidad para enviar logs del cliente al servidor
 * Los logs aparecerán en la terminal donde corre npm run dev
 * Usa batching para agrupar múltiples logs en 1 request
 * SOLO ACTIVO EN DESARROLLO
 */

const isDevelopment = process.env.NODE_ENV === 'development' || 
                     typeof window !== 'undefined' && window.location.hostname === 'localhost';

let logBatch = [];
let batchTimer = null;
const BATCH_DELAY = 50; // ms para agrupar logs

const flushLogs = () => {
  if (logBatch.length === 0 || !isDevelopment) return;
  
  const logsToSend = [...logBatch];
  logBatch = [];
  
  fetch('/api/log/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ logs: logsToSend }),
    keepalive: true
  }).catch(() => {}); // Ignorar errores silenciosamente
};

const sendLogToServer = (level, message, data = null, component = null) => {
  // Solo logs en desarrollo
  if (!isDevelopment) return;
  
  try {
    // En desarrollo, también mostrar en consola del navegador
    const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
    console[consoleMethod](`[${component || 'Client'}] ${message}`, data || '');
    
    // Agregar al batch
    logBatch.push({
      level,
      message,
      data,
      component,
      timestamp: new Date().toISOString()
    });
    
    // Reiniciar timer
    clearTimeout(batchTimer);
    batchTimer = setTimeout(flushLogs, BATCH_DELAY);
    
  } catch (error) {
    // Si falla el log, no debe romper la app
  }
};

export const serverLog = {
  info: (message, data, component) => sendLogToServer('info', message, data, component),
  warn: (message, data, component) => sendLogToServer('warn', message, data, component),
  error: (message, data, component) => sendLogToServer('error', message, data, component),
  debug: (message, data, component) => sendLogToServer('debug', message, data, component),
  success: (message, data, component) => sendLogToServer('success', message, data, component),
};

export default serverLog;
