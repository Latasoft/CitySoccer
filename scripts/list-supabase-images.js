import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function listImages() {
  try {
    console.log('📂 Listando imágenes en bucket "images"...\n');
    
    const { data, error } = await supabase
      .storage
      .from('images')
      .list('', {
        limit: 100,
        offset: 0,
      });

    if (error) throw error;

    if (!data || data.length === 0) {
      console.log('❌ No hay imágenes en el bucket "images"');
      return;
    }

    console.log(`✅ Encontradas ${data.length} imágenes:\n`);
    data.forEach((file, index) => {
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${file.name}`;
      console.log(`${index + 1}. ${file.name}`);
      console.log(`   URL: ${url}`);
      console.log(`   Tamaño: ${(file.metadata?.size / 1024).toFixed(2)} KB\n`);
    });

    // Buscar específicamente Cancha1 y Pickleball2
    console.log('🔍 Buscando imágenes específicas:');
    const cancha1 = data.find(f => f.name.toLowerCase().includes('cancha'));
    const pickleball = data.find(f => f.name.toLowerCase().includes('pickleball'));
    
    console.log(`  Cancha: ${cancha1 ? '✅ ' + cancha1.name : '❌ No encontrada'}`);
    console.log(`  Pickleball: ${pickleball ? '✅ ' + pickleball.name : '❌ No encontrada'}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listImages();
