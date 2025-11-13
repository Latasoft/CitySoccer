import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Ruta del archivo JSON
    const filePath = path.join(process.cwd(), 'public', 'content', 'navigation.json');
    
    // Guardar el archivo completo
    await writeFile(filePath, JSON.stringify(body, null, 2), 'utf-8');
    
    console.log(`✅ Navigation guardado`);
    
    return NextResponse.json({
      success: true,
      data: body,
      message: 'Navigation actualizado exitosamente'
    });
    
  } catch (error) {
    console.error('Error guardando navigation:', error);
    return NextResponse.json(
      { error: 'Error al guardar navigation', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'content', 'navigation.json');
    const fs = require('fs');
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Navigation no encontrado' },
        { status: 404 }
      );
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const content = JSON.parse(fileContent);
    
    return NextResponse.json({
      success: true,
      data: content
    });
    
  } catch (error) {
    console.error('Error leyendo navigation:', error);
    return NextResponse.json(
      { error: 'Error al leer navigation', details: error.message },
      { status: 500 }
    );
  }
}
