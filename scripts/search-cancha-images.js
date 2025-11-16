import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function searchImages() {
  try {
    console.log('🔍 Buscando Cancha1.jpeg y Pickleball2.jpeg...\n');
    
    // Buscar en carpetas comunes
    const folders = ['', 'uploads', 'logos', 'carousel'];
    
    for (const folder of folders) {
      console.log(`📂 Buscando en: ${folder || 'raíz'}...`);
      
      const { data, error } = await supabase
        .storage
        .from('images')
        .list(folder, {
          limit: 100,
        });

      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
        continue;
      }

      if (data && data.length > 0) {
        console.log(`   ✅ ${data.length} archivos encontrados:`);
        data.forEach(file => {
          const path = folder ? `${folder}/${file.name}` : file.name;
          console.log(`      - ${file.name} ${file.metadata?.mimetype || ''}`);
          
          if (file.name.toLowerCase().includes('cancha') || file.name.toLowerCase().includes('pickleball')) {
            const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${path}`;
            console.log(`        ⭐ MATCH! URL: ${url}`);
          }
        });
      } else {
        console.log(`   📭 Carpeta vacía`);
      }
      console.log('');
    }

    // Verificar si las imágenes están en public/
    console.log('\n📂 Verificando carpeta public/ local...');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

searchImages();
