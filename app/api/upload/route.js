import { NextResponse } from 'next/server';
import { uploadFile } from '@/lib/contentStorage';

export async function POST(request) {
  try {
    console.log('📨 [API Upload] Recibiendo request...');
    
    const formData = await request.formData();
    const file = formData.get('file');
    const category = formData.get('category') || 'general';
    
    console.log('📨 [API Upload] FormData parseado:', {
      hasFile: !!file,
      category,
      fileType: file?.type,
      fileName: file?.name,
      fileSize: file?.size
    });
    
    if (!file) {
      console.error('❌ [API Upload] No se proporcionó archivo');
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Validar tamaño (50MB máximo)
    if (file.size > 52428800) {
      console.error('❌ [API Upload] Archivo demasiado grande:', file.size);
      return NextResponse.json(
        { error: 'Archivo demasiado grande. Máximo 50MB' },
        { status: 400 }
      );
    }

    console.log('📤 [API Upload] Subiendo archivo a Supabase Storage:', {
      nombre: file.name,
      tamaño: `${(file.size / 1024).toFixed(2)} KB`,
      tipo: file.type,
      categoría: category
    });
    
    // Convertir File a Buffer
    console.log('🔄 [API Upload] Convirtiendo File a Buffer...');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log('✅ [API Upload] Buffer creado, tamaño:', buffer.length);
    
    // Subir a Supabase Storage
    console.log('📤 [API Upload] Llamando a uploadFile()...');
    const result = await uploadFile(buffer, category, file.name);
    
    console.log('📤 [API Upload] Resultado de uploadFile:', result);
    
    if (!result.success) {
      console.error('❌ [API Upload] uploadFile falló:', result.error);
      throw new Error(result.error || 'Error subiendo a Supabase Storage');
    }
    
    console.log(`✅ [API Upload] Archivo subido exitosamente a Supabase Storage`);
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
    console.error('❌ [API Upload] Error crítico:', error);
    console.error('   Message:', error.message);
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
