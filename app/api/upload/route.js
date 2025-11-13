import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

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

    // Obtener buffer del archivo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generar nombre único
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, '_');
    const fileName = `${category}_${timestamp}_${originalName}`;
    
    // Determinar directorio de upload
    // En Render: /opt/render/project/src/public/uploads
    // En local: {cwd}/public/uploads
    const publicDir = path.join(process.cwd(), 'public');
    const uploadDir = path.join(publicDir, 'uploads', category);
    
    console.log('📁 Directorio de upload:', uploadDir);
    console.log('📂 Public dir:', publicDir);
    console.log('🔍 Public dir existe:', existsSync(publicDir));
    
    // Crear directorio si no existe
    if (!existsSync(uploadDir)) {
      console.log('🏗️  Creando directorio:', uploadDir);
      await mkdir(uploadDir, { recursive: true });
    }
    
    // Guardar archivo
    const filePath = path.join(uploadDir, fileName);
    console.log('💾 Guardando en:', filePath);
    
    await writeFile(filePath, buffer);
    
    // Verificar que se guardó
    if (!existsSync(filePath)) {
      throw new Error('Archivo no se guardó correctamente');
    }
    
    // URL pública del archivo
    const publicUrl = `/uploads/${category}/${fileName}`;
    
    console.log(`✅ Archivo subido exitosamente: ${publicUrl}`);
    console.log(`   Tamaño: ${(file.size / 1024).toFixed(2)} KB`);
    console.log(`   Tipo: ${file.type}`);
    
    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        fileName: fileName,
        size: file.size,
        type: file.type
      },
      message: 'Archivo subido exitosamente'
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
