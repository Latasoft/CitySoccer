import { NextResponse } from 'next/server';

/**
 * Endpoint para recibir logs del cliente y mostrarlos en la terminal del servidor
 * Útil para debugging de componentes React en producción/desarrollo
 */
export async function POST(request) {
  try {
    const { level, message, data, component } = await request.json();
    
    // Emoji según nivel
    const emoji = {
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
      debug: '🔍',
      success: '✅'
    }[level] || '📝';
    
    // Timestamp
    const timestamp = new Date().toISOString().substring(11, 23); // HH:mm:ss.SSS
    
    // Formatear mensaje
    const prefix = component ? `[${component}]` : '';
    const dataStr = data ? `\n${JSON.stringify(data, null, 2)}` : '';
    
    // Log en terminal del servidor
    console.log(`${emoji} ${timestamp} ${prefix} ${message}${dataStr}`);
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('❌ Error en endpoint de logs:', error);
    return NextResponse.json({ error: 'Error procesando log' }, { status: 500 });
  }
}
