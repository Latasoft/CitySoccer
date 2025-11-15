import { NextResponse } from 'next/server';
import { getContent } from '@/lib/contentStorage';

// Endpoint de diagnóstico para Footer
// Acceder: https://citysoccer.cl/api/debug/footer

export async function GET() {
  console.log('\n' + '='.repeat(70));
  console.log('🔍 DIAGNÓSTICO DE FOOTER');
  console.log('='.repeat(70));
  
  const results = {
    timestamp: new Date().toISOString(),
    tests: []
  };

  // Test 1: Verificar variables de entorno
  console.log('\n📋 1. Variables de Entorno:');
  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasServiceKey = !!process.env.SUPABASE_SERVICE_KEY;
  
  console.log('   NEXT_PUBLIC_SUPABASE_URL:', hasSupabaseUrl ? '✅' : '❌');
  console.log('   SUPABASE_SERVICE_KEY:', hasServiceKey ? '✅' : '❌');
  
  results.tests.push({
    name: 'Variables de Entorno',
    status: hasSupabaseUrl && hasServiceKey ? 'pass' : 'fail',
    details: {
      hasSupabaseUrl,
      hasServiceKey,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'N/A'
    }
  });

  // Test 2: Cargar footer.json
  console.log('\n📄 2. Cargando footer.json desde Supabase Storage:');
  try {
    const footerContent = await getContent('footer');
    
    if (!footerContent) {
      console.error('   ❌ footer.json NO EXISTE o está vacío');
      results.tests.push({
        name: 'Carga de footer.json',
        status: 'fail',
        error: 'Contenido vacío o no existe'
      });
    } else {
      console.log('   ✅ footer.json cargado exitosamente');
      console.log('   Campos encontrados:', Object.keys(footerContent).length);
      console.log('   Campos:', Object.keys(footerContent).join(', '));
      
      results.tests.push({
        name: 'Carga de footer.json',
        status: 'pass',
        details: {
          fieldCount: Object.keys(footerContent).length,
          fields: Object.keys(footerContent)
        }
      });

      // Test 3: Verificar footer_image específicamente
      console.log('\n📷 3. Verificando footer_image:');
      if (footerContent.footer_image) {
        console.log('   ✅ footer_image existe');
        console.log('   URL:', footerContent.footer_image);
        console.log('   Tipo:', typeof footerContent.footer_image);
        console.log('   Longitud:', footerContent.footer_image.length);
        
        // Test 4: Verificar si la URL es accesible
        console.log('\n🌐 4. Verificando accesibilidad de la imagen:');
        try {
          const imageResponse = await fetch(footerContent.footer_image, { method: 'HEAD' });
          console.log('   Status:', imageResponse.status);
          console.log('   Content-Type:', imageResponse.headers.get('content-type'));
          
          results.tests.push({
            name: 'footer_image field',
            status: 'pass',
            details: {
              url: footerContent.footer_image,
              exists: true,
              httpStatus: imageResponse.status,
              contentType: imageResponse.headers.get('content-type')
            }
          });
        } catch (error) {
          console.error('   ❌ Error verificando imagen:', error.message);
          results.tests.push({
            name: 'footer_image field',
            status: 'warning',
            details: {
              url: footerContent.footer_image,
              exists: true,
              httpError: error.message
            }
          });
        }
      } else {
        console.error('   ❌ footer_image NO EXISTE en el JSON');
        results.tests.push({
          name: 'footer_image field',
          status: 'fail',
          error: 'Campo footer_image no existe en footer.json'
        });
      }

      // Test 5: Verificar otros campos importantes
      console.log('\n📝 5. Otros campos importantes:');
      const importantFields = ['contact_phone', 'contact_address', 'hours_weekdays'];
      importantFields.forEach(field => {
        const exists = !!footerContent[field];
        console.log(`   ${exists ? '✅' : '❌'} ${field}:`, exists ? footerContent[field] : 'NO EXISTE');
      });
    }
  } catch (error) {
    console.error('   ❌ Error cargando footer.json:', error);
    results.tests.push({
      name: 'Carga de footer.json',
      status: 'error',
      error: error.message
    });
  }

  console.log('\n' + '='.repeat(70));
  console.log('✅ DIAGNÓSTICO COMPLETADO');
  console.log('='.repeat(70) + '\n');

  // Resumen
  const passCount = results.tests.filter(t => t.status === 'pass').length;
  const failCount = results.tests.filter(t => t.status === 'fail').length;
  const errorCount = results.tests.filter(t => t.status === 'error').length;

  results.summary = {
    total: results.tests.length,
    passed: passCount,
    failed: failCount,
    errors: errorCount,
    status: failCount === 0 && errorCount === 0 ? 'healthy' : 'issues'
  };

  return NextResponse.json(results, {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/json'
    }
  });
}
