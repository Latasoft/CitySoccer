/**
 * Script de diagnóstico para verificar configuración de Supabase Storage
 * Ejecutar en producción: node scripts/diagnostic-supabase.js
 */

const { createClient } = require('@supabase/supabase-js');

async function diagnose() {
  console.log('\n' + '='.repeat(70));
  console.log('🔍 DIAGNÓSTICO DE SUPABASE STORAGE');
  console.log('='.repeat(70) + '\n');

  // 1. Verificar variables de entorno
  console.log('📋 1. Variables de Entorno:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurada' : '❌ FALTANTE');
  console.log('   SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '✅ Configurada' : '❌ FALTANTE');
  console.log('   URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'N/A');
  console.log('   Key Preview:', process.env.SUPABASE_SERVICE_KEY ? `${process.env.SUPABASE_SERVICE_KEY.substring(0, 20)}...` : 'N/A');
  console.log('');

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error('❌ ERROR: Faltan variables de entorno requeridas');
    console.log('\nConfigura en Render:');
    console.log('   NEXT_PUBLIC_SUPABASE_URL=https://ckbebftjgqearfubmgus.supabase.co');
    console.log('   SUPABASE_SERVICE_KEY=<tu_service_role_key>');
    process.exit(1);
  }

  // 2. Crear cliente
  console.log('🔧 2. Inicializando cliente Supabase...');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
  console.log('   ✅ Cliente creado exitosamente\n');

  // 3. Verificar bucket 'content'
  console.log('📦 3. Verificando bucket "content":');
  try {
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('   ❌ Error listando buckets:', bucketsError.message);
    } else {
      const contentBucket = buckets.find(b => b.name === 'content');
      if (contentBucket) {
        console.log('   ✅ Bucket "content" existe');
        console.log('   - Public:', contentBucket.public ? 'Sí' : 'No');
        console.log('   - ID:', contentBucket.id);
      } else {
        console.error('   ❌ Bucket "content" NO EXISTE');
      }
    }
  } catch (error) {
    console.error('   ❌ Error verificando buckets:', error.message);
  }
  console.log('');

  // 4. Verificar footer.json
  console.log('📄 4. Verificando archivo "footer.json":');
  try {
    const { data, error } = await supabase.storage
      .from('content')
      .download('footer.json');

    if (error) {
      console.error('   ❌ Error descargando footer.json:', error.message);
      console.error('   - Status:', error.statusCode);
      console.error('   - Hint:', error.hint || 'N/A');
    } else {
      const text = await data.text();
      const json = JSON.parse(text);
      console.log('   ✅ footer.json descargado exitosamente');
      console.log('   - Tamaño:', data.size, 'bytes');
      console.log('   - Campos:', Object.keys(json).length);
      console.log('   - Campos:', Object.keys(json).join(', '));
    }
  } catch (error) {
    console.error('   ❌ Error:', error.message);
  }
  console.log('');

  // 5. Verificar URL pública
  console.log('🌐 5. URL Pública de footer.json:');
  const { data: urlData } = supabase.storage
    .from('content')
    .getPublicUrl('footer.json');
  
  console.log('   URL:', urlData.publicUrl);
  
  try {
    const response = await fetch(urlData.publicUrl);
    if (response.ok) {
      console.log('   ✅ URL pública accesible (Status:', response.status, ')');
    } else {
      console.error('   ❌ URL pública NO accesible (Status:', response.status, ')');
    }
  } catch (error) {
    console.error('   ❌ Error verificando URL:', error.message);
  }
  console.log('');

  // 6. Listar archivos en bucket content
  console.log('📁 6. Archivos en bucket "content":');
  try {
    const { data: files, error } = await supabase.storage
      .from('content')
      .list('', { limit: 100 });

    if (error) {
      console.error('   ❌ Error listando archivos:', error.message);
    } else {
      console.log('   Total de archivos:', files.length);
      files.forEach(file => {
        console.log(`   - ${file.name} (${(file.metadata?.size / 1024).toFixed(2)} KB)`);
      });
    }
  } catch (error) {
    console.error('   ❌ Error:', error.message);
  }
  console.log('');

  console.log('='.repeat(70));
  console.log('✅ DIAGNÓSTICO COMPLETADO');
  console.log('='.repeat(70) + '\n');
}

diagnose().catch(console.error);
