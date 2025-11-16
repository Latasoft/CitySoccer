/**
 * Script para crear JSON de arriendo_pickleball en Supabase Storage
 */

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables de entorno faltantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const CONTENT_BUCKET = 'content';

async function createJSON() {
  const content = {
    page_title: 'Pickleball Individual',
    page_description: 'Reserva tu cancha de pickleball individual de forma rápida y segura. Elige el horario que más te acomode.'
  };

  const fileName = 'arriendo_pickleball.json';
  const jsonString = JSON.stringify(content, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });

  console.log(`📤 Creando ${fileName} en Supabase Storage...`);

  const { data, error } = await supabase.storage
    .from(CONTENT_BUCKET)
    .upload(fileName, blob, {
      contentType: 'application/json',
      upsert: true,
      cacheControl: '300',
    });

  if (error) {
    console.error(`❌ Error:`, error.message);
    return;
  }

  const { data: urlData } = supabase.storage
    .from(CONTENT_BUCKET)
    .getPublicUrl(fileName);

  console.log(`✅ ${fileName} creado exitosamente`);
  console.log(`   URL: ${urlData.publicUrl}`);
}

createJSON().catch(console.error);
