import { writeFile, mkdir } from 'fs/promises';
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

    // Obtener la extensión del archivo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generar nombre único
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, '_');
    const fileName = `${category}_${timestamp}_${originalName}`;
    
    // Crear directorio si no existe
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', category);
    const fs = require('fs');
    if (!fs.existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    // Guardar archivo
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    
    // URL pública del archivo
    const publicUrl = `/uploads/${category}/${fileName}`;
    
    console.log(`✅ Archivo subido: ${publicUrl}`);
    
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
    console.error('Error subiendo archivo:', error);
    return NextResponse.json(
      { error: 'Error al subir el archivo', details: error.message },
      { status: 500 }
    );
  }
}
