#!/bin/bash

echo "🔍 DIAGNÓSTICO DE RENDER - CitySoccer"
echo "========================================"
echo ""

echo "1️⃣ Directorio de trabajo actual:"
pwd
echo ""

echo "2️⃣ Variables de entorno relevantes:"
echo "NODE_ENV: $NODE_ENV"
echo "CWD: $(pwd)"
echo ""

echo "3️⃣ Estructura del proyecto:"
ls -lah /opt/render/project/src/
echo ""

echo "4️⃣ Verificar /public/content (build):"
if [ -d "/opt/render/project/src/public/content" ]; then
  echo "✅ Directorio existe"
  ls -lah /opt/render/project/src/public/content/
else
  echo "❌ Directorio NO existe"
fi
echo ""

echo "5️⃣ Verificar disco persistente /var/data/content:"
if [ -d "/var/data/content" ]; then
  echo "✅ Disco persistente existe"
  ls -lah /var/data/content/
else
  echo "❌ Disco persistente NO existe"
fi
echo ""

echo "6️⃣ Verificar symlink:"
if [ -L "/opt/render/project/src/public/content" ]; then
  echo "✅ Es un symlink"
  ls -lah /opt/render/project/src/public/ | grep content
  echo "Apunta a: $(readlink -f /opt/render/project/src/public/content)"
else
  echo "⚠️ NO es un symlink (es directorio real)"
fi
echo ""

echo "7️⃣ Verificar archivo navigation.json:"
echo "En build:"
if [ -f "/opt/render/project/src/public/content/navigation.json" ]; then
  echo "✅ Existe en /public/content"
  ls -lh /opt/render/project/src/public/content/navigation.json
  echo "Primeras líneas:"
  head -n 5 /opt/render/project/src/public/content/navigation.json
else
  echo "❌ NO existe en /public/content"
fi
echo ""

echo "En disco persistente:"
if [ -f "/var/data/content/navigation.json" ]; then
  echo "✅ Existe en /var/data/content"
  ls -lh /var/data/content/navigation.json
else
  echo "❌ NO existe en /var/data/content"
fi
echo ""

echo "8️⃣ Contenido completo de discos persistentes:"
echo "📁 /var/data/uploads:"
ls -laR /var/data/uploads/ 2>/dev/null || echo "No accesible"
echo ""
echo "📁 /var/data/content:"
ls -laR /var/data/content/ 2>/dev/null || echo "No accesible"
echo ""

echo "9️⃣ Procesos Node.js activos:"
ps aux | grep node
echo ""

echo "🔟 Últimas 20 líneas del log de la aplicación:"
if [ -f "/opt/render/project/src/debug.log" ]; then
  tail -n 20 /opt/render/project/src/debug.log
else
  echo "debug.log no encontrado"
fi
echo ""

echo "1️⃣1️⃣ Uso de disco y espacio disponible:"
df -h
echo ""

echo "1️⃣2️⃣ Tamaño de directorios importantes:"
du -sh /opt/render/project/src/public/content 2>/dev/null || echo "/public/content no accesible"
du -sh /var/data/content 2>/dev/null || echo "/var/data/content no accesible"
du -sh /var/data/uploads 2>/dev/null || echo "/var/data/uploads no accesible"
echo ""

echo "1️⃣3️⃣ Permisos de archivos críticos:"
ls -lah /var/data/ 2>/dev/null || echo "/var/data/ no accesible"
echo ""

echo "1️⃣4️⃣ Intentar leer navigation.json con Node.js:"
node -e "
try {
  const fs = require('fs');
  const path = require('path');
  
  console.log('CWD:', process.cwd());
  
  const publicPath = path.join(process.cwd(), 'public', 'content', 'navigation.json');
  console.log('Ruta pública:', publicPath);
  console.log('Existe?', fs.existsSync(publicPath));
  
  if (fs.existsSync(publicPath)) {
    const content = JSON.parse(fs.readFileSync(publicPath, 'utf8'));
    console.log('✅ Contenido leído OK');
    console.log('Menu items:', content.menu_items?.length || 0);
  }
  
  const diskPath = '/var/data/content/navigation.json';
  console.log('Ruta disco persistente:', diskPath);
  console.log('Existe?', fs.existsSync(diskPath));
  
  if (fs.existsSync(diskPath)) {
    const content = JSON.parse(fs.readFileSync(diskPath, 'utf8'));
    console.log('✅ Contenido del disco leído OK');
    console.log('Menu items:', content.menu_items?.length || 0);
  }
} catch (error) {
  console.error('❌ Error:', error.message);
}
" 2>/dev/null || echo "Node.js no disponible"
echo ""

echo "========================================"
echo "✅ Diagnóstico completado"
echo ""
echo "SOLUCIONES RÁPIDAS:"
echo ""
echo "💡 Si navigation.json NO está en /var/data/content, ejecuta:"
echo "   cp /opt/render/project/src/public/content/navigation.json /var/data/content/"
echo ""
echo "💡 Si /public/content NO es symlink, ejecuta:"
echo "   rm -rf /opt/render/project/src/public/content"
echo "   ln -sf /var/data/content /opt/render/project/src/public/content"
echo ""
echo "💡 Para copiar TODOS los archivos de content al disco persistente:"
echo "   cp -r /opt/render/project/src/.next/static/../public/content/* /var/data/content/ 2>/dev/null || true"
echo "   # O desde el directorio del build original:"
echo "   find /opt/render/project -name 'navigation.json' -type f"
echo ""
