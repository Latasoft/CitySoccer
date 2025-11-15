import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { uploadFile } from '@/lib/contentStorage';

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

    console.log('🚀 Iniciando migración de imágenes a Supabase Storage...\n');

    // Rutas de directorios de imágenes
    const UPLOAD_DIRS = [
      '/var/data/uploads', // Producción en Render
      path.resolve(process.cwd(), 'public/uploads'),
    ];

    // Encontrar directorio que existe
    let uploadsDir = null;
    for (const dir of UPLOAD_DIRS) {
      if (fs.existsSync(dir)) {
        console.log(`📁 Directorio de uploads encontrado: ${dir}`);
        uploadsDir = dir;
        break;
      }
    }

    if (!uploadsDir) {
      return NextResponse.json(
        { error: 'No se encontró ningún directorio de uploads' },
        { status: 404 }
      );
    }

    // Extensiones de imagen válidas
    const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.svg'];

    const results = [];
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    let totalSize = 0;

    // Función recursiva para procesar directorios
    async function processDirectory(dirPath, category = '') {
      const items = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dirPath, item.name);
        
        if (item.isDirectory()) {
          // Recursión en subdirectorios
          const subCategory = category ? `${category}/${item.name}` : item.name;
          await processDirectory(fullPath, subCategory);
        } else if (item.isFile()) {
          const ext = path.extname(item.name).toLowerCase();
          
          // Solo procesar imágenes
          if (!IMAGE_EXTENSIONS.includes(ext)) {
            skippedCount++;
            continue;
          }

          try {
            // Leer archivo
            const buffer = fs.readFileSync(fullPath);
            const stats = fs.statSync(fullPath);
            totalSize += stats.size;

            const folder = category || 'general';
            const fileName = item.name;

            console.log(`📤 Migrando: ${folder}/${fileName} (${(stats.size / 1024).toFixed(2)} KB)`);

            // Subir a Supabase Storage
            const result = await uploadFile(buffer, folder, fileName);

            if (result.success) {
              console.log(`   ✅ Éxito: ${result.url}`);
              successCount++;
              results.push({
                file: `${folder}/${fileName}`,
                success: true,
                url: result.url,
                size: stats.size
              });
            } else {
              console.error(`   ❌ Error: ${result.error}`);
              errorCount++;
              results.push({
                file: `${folder}/${fileName}`,
                success: false,
                error: result.error
              });
            }

          } catch (error) {
            console.error(`   ❌ Error procesando ${item.name}:`, error.message);
            errorCount++;
            results.push({
              file: `${category}/${item.name}`,
              success: false,
              error: error.message
            });
          }
        }
      }
    }

    // Procesar todos los archivos
    await processDirectory(uploadsDir);

    const totalFiles = successCount + errorCount;

    // Resumen
    return NextResponse.json({
      success: errorCount === 0,
      summary: {
        total: totalFiles,
        exitosos: successCount,
        errores: errorCount,
        omitidos: skippedCount,
        totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2)
      },
      results: results.slice(0, 50), // Solo primeros 50 para no saturar respuesta
      message: errorCount === 0 
        ? '🎉 Migración de imágenes completada exitosamente' 
        : '⚠️ Migración de imágenes completada con errores'
    });

  } catch (error) {
    console.error('❌ Error fatal en migración de imágenes:', error);
    return NextResponse.json(
      { error: 'Error en migración de imágenes', details: error.message },
      { status: 500 }
    );
  }
}
