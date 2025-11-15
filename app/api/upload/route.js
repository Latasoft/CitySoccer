import { NextResponse } from 'next/server';
import { uploadFile } from '@/lib/contentStorage';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const category = formData.get('category') || 'general';
    
    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Validar tamaño (50MB máximo)
    if (file.size > 52428800) {
      return NextResponse.json(
        { error: 'Archivo demasiado grande. Máximo 50MB' },
        { status: 400 }
      );
    }

    console.log('📤 Subiendo archivo a Supabase Storage:', {
      nombre: file.name,
      tamaño: `${(file.size / 1024).toFixed(2)} KB`,
      tipo: file.type,
      categoría: category
    });
    
    // Convertir File a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Subir a Supabase Storage
    const result = await uploadFile(buffer, category, file.name);
    
    if (!result.success) {
      throw new Error(result.error || 'Error subiendo a Supabase Storage');
    }
    
    console.log(`✅ Archivo subido exitosamente a Supabase Storage`);
    console.log(`   URL: ${result.url}`);
    console.log(`   Path: ${result.path}`);
    
    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        fileName: result.fileName,
        path: result.path,
        size: file.size,
        type: file.type
      },
      message: 'Archivo subido exitosamente a Supabase Storage'
    });
    
  } catch (error) {
    console.error('❌ Error subiendo archivo:', error);
    console.error('   Stack:', error.stack);
    
    return NextResponse.json(
      { 
        error: 'Error al subir el archivo', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
