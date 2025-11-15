const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Faltan variables de entorno');
  process.exit(1);
}

async function uploadFooterJson() {
  try {
    const filePath = path.join(__dirname, '../public/content/footer.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    console.log('📤 Subiendo footer.json a Supabase Storage...');
    
    const response = await fetch(
      `${SUPABASE_URL}/storage/v1/object/content/footer.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: fileContent
      }
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${await response.text()}`);
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/content/footer.json`;
    console.log('✅ footer.json subido exitosamente!');
    console.log('📍 URL:', publicUrl);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

uploadFooterJson();
