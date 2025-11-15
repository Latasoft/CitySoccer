import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { saveContent } from '@/lib/contentStorage';

// IMPORTANTE: Eliminar este endpoint después de la migración

export async function POST(request) {
  try {
    // Verificar token de seguridad
    const { token } = await request.json();
    
    if (token !== process.env.MIGRATION_TOKEN) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 403 }
      );
    }

    console.log('🚀 Iniciando migración de contenido a Supabase Storage...\n');

    // Rutas de directorios de contenido
    const LOCAL_CONTENT_DIRS = [
      '/var/data/uploads/content', // Producción en Render
      path.resolve(process.cwd(), 'public/content'),
    ];

    // Encontrar directorio que existe
    let contentDir = null;
    for (const dir of LOCAL_CONTENT_DIRS) {
      if (fs.existsSync(dir)) {
        console.log(`📁 Directorio de contenido encontrado: ${dir}`);
        contentDir = dir;
        break;
      }
    }

    if (!contentDir) {
      return NextResponse.json(
        { error: 'No se encontró ningún directorio de contenido' },
        { status: 404 }
      );
    }

    // Leer todos los archivos JSON
    const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.json'));
    
    if (files.length === 0) {
      return NextResponse.json(
        { message: 'No se encontraron archivos JSON para migrar' },
        { status: 200 }
      );
    }

    console.log(`📦 Archivos encontrados: ${files.length}\n`);

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    // Migrar cada archivo
    for (const file of files) {
      const pageKey = file.replace('.json', '');
      const filePath = path.join(contentDir, file);

      try {
        // Leer contenido del archivo
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        
        console.log(`📤 Migrando: ${pageKey}...`);
        
        // Subir a Supabase Storage
        const result = await saveContent(pageKey, content);
        
        if (result.success) {
          console.log(`   ✅ Éxito: ${result.url}`);
          successCount++;
          results.push({
            pageKey,
            success: true,
            url: result.url
          });
        } else {
          console.error(`   ❌ Error: ${result.error}`);
          errorCount++;
          results.push({
            pageKey,
            success: false,
            error: result.error
          });
        }
      } catch (error) {
        console.error(`   ❌ Error procesando ${pageKey}:`, error.message);
        errorCount++;
        results.push({
          pageKey,
          success: false,
          error: error.message
        });
      }
    }

    // Resumen
    return NextResponse.json({
      success: errorCount === 0,
      summary: {
        total: files.length,
        exitosos: successCount,
        errores: errorCount
      },
      results,
      message: errorCount === 0 
        ? '🎉 Migración completada exitosamente' 
        : '⚠️ Migración completada con errores'
    });

  } catch (error) {
    console.error('❌ Error fatal en migración:', error);
    return NextResponse.json(
      { error: 'Error en migración', details: error.message },
      { status: 500 }
    );
  }
}
