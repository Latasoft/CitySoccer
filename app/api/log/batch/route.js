import { NextResponse } from 'next/server';

const LOG_ICONS = {
  info: 'ℹ️',
  warn: '⚠️',
  error: '❌',
  debug: '🔍',
  success: '✅'
};

/**
 * POST /api/log/batch
 * Procesa múltiples logs del cliente en una sola petición
 */
export async function POST(request) {
  try {
    const { logs } = await request.json();
    
    if (!Array.isArray(logs) || logs.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid logs format' }, { status: 400 });
    }

    // Procesar cada log
    logs.forEach(({ level, message, data, component, timestamp }) => {
      const icon = LOG_ICONS[level] || '📝';
      const componentPrefix = component ? `[${component}]` : '';
      const ts = timestamp ? new Date(timestamp).toLocaleTimeString('es-CL', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        fractionalSecondDigits: 3 
      }) : '';
      
      const logMessage = `${icon} ${ts} ${componentPrefix} ${message}`;
      
      if (data) {
        console.log(logMessage);
        console.log(JSON.stringify(data, null, 2));
      } else {
        console.log(logMessage);
      }
    });

    return NextResponse.json({ 
      success: true, 
      processed: logs.length 
    });

  } catch (error) {
    console.error('❌ Error procesando batch de logs:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
