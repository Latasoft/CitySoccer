/**
 * Script para regenerar todas las páginas estáticas después del deploy
 * Ejecutar: node scripts/regenerate-all-pages.js
 */

const SITE_URL = process.env.SITE_URL || 'https://citysoccer.cl';
const REVALIDATION_TOKEN = process.env.REVALIDATION_TOKEN;

if (!REVALIDATION_TOKEN) {
  console.error('❌ REVALIDATION_TOKEN no está configurado');
  console.log('\nAgrega en Render:');
  console.log('   REVALIDATION_TOKEN=<un_token_secreto_aleatorio>');
  process.exit(1);
}

async function regenerateAll() {
  console.log('\n🔄 Regenerando todas las páginas estáticas...');
  console.log(`   Sitio: ${SITE_URL}\n`);

  try {
    const response = await fetch(`${SITE_URL}/api/revalidate-all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: REVALIDATION_TOKEN })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Error ${response.status}: ${error.error || 'Unknown'}`);
    }

    const result = await response.json();
    
    console.log('✅ Regeneración completada exitosamente\n');
    console.log('📊 Resumen:');
    console.log(`   Total: ${result.summary.total}`);
    console.log(`   Exitosas: ${result.summary.successful}`);
    console.log(`   Fallidas: ${result.summary.failed}\n`);

    if (result.summary.failed > 0) {
      console.log('❌ Páginas con errores:');
      result.results
        .filter(r => r.status === 'error')
        .forEach(r => console.log(`   - ${r.route}: ${r.error}`));
      console.log('');
    }

    console.log('🎉 Todas las páginas están ahora pre-generadas como HTML estático\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

regenerateAll();
