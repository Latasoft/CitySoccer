import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request) {
  try {
    const { pageKey, fieldKey, fieldValue } = await request.json();
    
    if (!pageKey || !fieldKey || fieldValue === undefined) {
      return NextResponse.json(
        { error: 'pageKey, fieldKey y fieldValue son requeridos' },
        { status: 400 }
      );
    }

    // Ruta del archivo JSON
    const filePath = path.join(process.cwd(), 'public', 'content', `${pageKey}.json`);
    
    // Leer el archivo actual
    const fs = require('fs');
    let content = {};
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      content = JSON.parse(fileContent);
    }
    
    // Actualizar el campo
    content[fieldKey] = fieldValue;
    
    // Guardar el archivo
    await writeFile(filePath, JSON.stringify(content, null, 2), 'utf-8');
    
    console.log(`✅ Guardado: ${pageKey}.${fieldKey} = ${fieldValue?.substring(0, 50)}...`);
    
    return NextResponse.json({
      success: true,
      data: { pageKey, fieldKey, fieldValue },
      message: 'Campo actualizado exitosamente'
    });
    
  } catch (error) {
    console.error('Error guardando contenido:', error);
    return NextResponse.json(
      { error: 'Error al guardar el contenido', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageKey = searchParams.get('pageKey');
    
    if (!pageKey) {
      return NextResponse.json(
        { error: 'pageKey es requerido' },
        { status: 400 }
      );
    }
    
    const filePath = path.join(process.cwd(), 'public', 'content', `${pageKey}.json`);
    const fs = require('fs');
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Página no encontrada' },
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
    console.error('Error leyendo contenido:', error);
    return NextResponse.json(
      { error: 'Error al leer el contenido', details: error.message },
      { status: 500 }
    );
  }
}
