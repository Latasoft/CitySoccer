import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function addArrendarCanchaImages() {
  try {
    console.log('📥 Descargando arrendarcancha.json desde Supabase...');
    
    // Descargar el archivo actual
    const { data: existingFile, error: downloadError } = await supabase
      .storage
      .from('content')
      .download('arrendarcancha.json');

    let currentContent = {};
    
    if (existingFile) {
      const text = await existingFile.text();
      currentContent = JSON.parse(text);
      console.log('✅ Archivo actual encontrado');
    } else {
      console.log('⚠️  Archivo no existe, se creará uno nuevo');
    }

    // Agregar los campos de imágenes para las 4 tarjetas
    const updatedContent = {
      ...currentContent,
      card1_image: 'https://ckbebftjgqearfubmgus.supabase.co/storage/v1/object/public/images/carousel/carousel_1763220695738_Cancha1.jpeg',
      card2_image: 'https://ckbebftjgqearfubmgus.supabase.co/storage/v1/object/public/images/carousel/carousel_1763220791220_Cancha2.jpeg',
      card3_image: 'https://ckbebftjgqearfubmgus.supabase.co/storage/v1/object/public/images/carousel/carousel_1763220723581_imgPickleball.jpeg',
      card4_image: 'https://ckbebftjgqearfubmgus.supabase.co/storage/v1/object/public/images/carousel/carousel_1763220723581_imgPickleball.jpeg'
    };

    console.log('📤 Subiendo arrendarcancha.json actualizado...');
    
    // Subir el archivo actualizado
    const { error: uploadError } = await supabase
      .storage
      .from('content')
      .upload('arrendarcancha.json', JSON.stringify(updatedContent, null, 2), {
        contentType: 'application/json',
        upsert: true
      });

    if (uploadError) {
      throw uploadError;
    }

    console.log('✅ Archivo arrendarcancha.json actualizado exitosamente');
    console.log('\n📋 Campos agregados:');
    console.log('  - card1_image (Fútbol 7)');
    console.log('  - card2_image (Fútbol 9)');
    console.log('  - card3_image (Pickleball Individual)');
    console.log('  - card4_image (Pickleball Dobles)');
    console.log('\n🎉 Ahora las imágenes en /arrendarcancha serán editables!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addArrendarCanchaImages();
