import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Endpoint para regenerar todas las páginas estáticas
// Útil para pre-generar todo el sitio después del build o al hacer cambios masivos

export async function POST(request) {
  try {
    const { token } = await request.json();
    
    // Verificar token de seguridad
    if (token !== process.env.REVALIDATION_TOKEN) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    console.log('🔄 Regenerando todas las páginas estáticas...');

    // Lista de todas las rutas públicas
    const routes = [
      '/',
      '/quienessomos',
      '/servicios',
      '/eventos',
      '/contacto',
      '/summer-camp',
      '/academiadefutbol',
      '/academiadepickleball',
      '/clasesparticularesfutbol',
      '/clasesparticularespickleball',
      '/arrendarcancha',
      '/arrendarcancha/futbol7',
      '/arrendarcancha/futbol9',
      '/arrendarcancha/pickleball-individual',
      '/arrendarcancha/pickleball-dobles',
    ];

    const results = [];

    for (const route of routes) {
      try {
        revalidatePath(route);
        console.log(`✅ Regenerado: ${route}`);
        results.push({ route, status: 'success' });
      } catch (error) {
        console.error(`❌ Error regenerando ${route}:`, error.message);
        results.push({ route, status: 'error', error: error.message });
      }
    }

    const successful = results.filter(r => r.status === 'success').length;
    const failed = results.filter(r => r.status === 'error').length;

    console.log(`\n✅ Regeneración completada: ${successful} exitosas, ${failed} fallidas\n`);

    return NextResponse.json({
      success: true,
      message: `Regeneradas ${successful} de ${routes.length} páginas`,
      results,
      summary: {
        total: routes.length,
        successful,
        failed
      }
    });

  } catch (error) {
    console.error('❌ Error en regeneración masiva:', error);
    return NextResponse.json(
      { error: 'Error en regeneración', details: error.message },
      { status: 500 }
    );
  }
}

// GET para documentación
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/revalidate-all',
    method: 'POST',
    description: 'Regenera todas las páginas estáticas del sitio',
    usage: {
      curl: 'curl -X POST https://citysoccer.cl/api/revalidate-all -H "Content-Type: application/json" -d \'{"token":"YOUR_TOKEN"}\'',
      javascript: `fetch('/api/revalidate-all', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token: 'YOUR_TOKEN' })
})`
    },
    note: 'Requiere REVALIDATION_TOKEN en variables de entorno'
  });
}
