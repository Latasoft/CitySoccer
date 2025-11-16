import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function uploadCanchaImages() {
  try {
    console.log('📤 Subiendo imágenes de canchas a Supabase...\n');

    const imagesToUpload = [
      { local: 'Cancha1.jpeg', supabase: 'canchas/cancha-futbol-1.jpeg', descripcion: 'Fútbol 7' },
      { local: 'Cancha2.jpeg', supabase: 'canchas/cancha-futbol-2.jpeg', descripcion: 'Fútbol 9' },
      { local: 'imgPickleball.jpeg', supabase: 'canchas/cancha-pickleball.jpeg', descripcion: 'Pickleball' },
    ];

    const uploadedUrls = {};

    for (const img of imagesToUpload) {
      const localPath = path.join(process.cwd(), 'public', img.local);
      
      if (!fs.existsSync(localPath)) {
        console.log(`❌ No se encontró: ${img.local}`);
        continue;
      }

      console.log(`📤 Subiendo ${img.local} como ${img.supabase}...`);
      
      const fileBuffer = fs.readFileSync(localPath);
      
      const { data, error } = await supabase
        .storage
        .from('images')
        .upload(img.supabase, fileBuffer, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
        continue;
      }

      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${img.supabase}`;
      uploadedUrls[img.descripcion] = url;
      console.log(`   ✅ Subida exitosa: ${url}\n`);
    }

    console.log('\n📋 URLs generadas:');
    console.log(JSON.stringify(uploadedUrls, null, 2));

    // Ahora actualizar el JSON con las URLs correctas
    console.log('\n📤 Actualizando arrendarcancha.json...');
    
    const { data: existingFile } = await supabase
      .storage
      .from('content')
      .download('arrendarcancha.json');

    let currentContent = {};
    if (existingFile) {
      const text = await existingFile.text();
      currentContent = JSON.parse(text);
    }

    const updatedContent = {
      ...currentContent,
      card1_image: uploadedUrls['Fútbol 7'],
      card2_image: uploadedUrls['Fútbol 9'],
      card3_image: uploadedUrls['Pickleball'],
      card4_image: uploadedUrls['Pickleball']
    };

    const { error: uploadError } = await supabase
      .storage
      .from('content')
      .upload('arrendarcancha.json', JSON.stringify(updatedContent, null, 2), {
        contentType: 'application/json',
        upsert: true
      });

    if (uploadError) throw uploadError;

    console.log('✅ JSON actualizado con las URLs correctas');
    console.log('\n🎉 ¡Proceso completado!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

uploadCanchaImages();
