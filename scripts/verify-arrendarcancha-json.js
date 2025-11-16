import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function verifyJSON() {
  try {
    console.log('📥 Descargando arrendarcancha.json...');
    
    const { data, error } = await supabase
      .storage
      .from('content')
      .download('arrendarcancha.json');

    if (error) throw error;

    const text = await data.text();
    const json = JSON.parse(text);
    
    console.log('\n📋 Contenido actual del JSON:');
    console.log(JSON.stringify(json, null, 2));
    
    console.log('\n🔍 Verificando URLs de imágenes:');
    ['card1_image', 'card2_image', 'card3_image', 'card4_image'].forEach(key => {
      if (json[key]) {
        console.log(`✅ ${key}: ${json[key]}`);
      } else {
        console.log(`❌ ${key}: NO EXISTE`);
      }
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verifyJSON();
