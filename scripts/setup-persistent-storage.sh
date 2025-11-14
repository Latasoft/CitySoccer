#!/bin/bash

# Script de inicialización para Render
# Crea symlinks desde /var/data (persistente) a /public/uploads

echo "🔗 Configurando symlinks para disco persistente..."

# Directorio persistente en Render
PERSISTENT_DIR="/var/data/uploads"
PUBLIC_DIR="/opt/render/project/src/public"

# Crear directorio público si no existe
mkdir -p "$PUBLIC_DIR"

# Si uploads ya existe como directorio normal, hacer backup
if [ -d "$PUBLIC_DIR/uploads" ] && [ ! -L "$PUBLIC_DIR/uploads" ]; then
  echo "⚠️  Moviendo uploads existente a persistente..."
  mv "$PUBLIC_DIR/uploads" "$PERSISTENT_DIR" 2>/dev/null || true
fi

# Crear directorios en disco persistente si no existen
mkdir -p "$PERSISTENT_DIR/carousel"
mkdir -p "$PERSISTENT_DIR/images"
mkdir -p "$PERSISTENT_DIR/videos"

# Crear symlink desde public/uploads al disco persistente
rm -rf "$PUBLIC_DIR/uploads" 2>/dev/null || true
ln -sf "$PERSISTENT_DIR" "$PUBLIC_DIR/uploads"

echo "✅ Symlink creado: $PUBLIC_DIR/uploads -> $PERSISTENT_DIR"

# Verificar
if [ -L "$PUBLIC_DIR/uploads" ]; then
  echo "✅ Symlink verificado correctamente"
  ls -la "$PUBLIC_DIR/uploads"
else
  echo "❌ Error creando symlink"
  exit 1
fi

# Content en su propio disco persistente
PERSISTENT_CONTENT="/var/data/content"
mkdir -p "$PERSISTENT_CONTENT"

# Copiar contenido inicial si el disco persistente está vacío
if [ ! "$(ls -A $PERSISTENT_CONTENT)" ]; then
  echo "📦 Copiando contenido inicial a disco persistente..."
  if [ -d "$PUBLIC_DIR/content" ]; then
    cp -r "$PUBLIC_DIR/content/"* "$PERSISTENT_CONTENT/" 2>/dev/null || true
  fi
fi

# Crear symlink
rm -rf "$PUBLIC_DIR/content" 2>/dev/null || true
ln -sf "$PERSISTENT_CONTENT" "$PUBLIC_DIR/content"

echo "✅ Symlink de content creado: $PUBLIC_DIR/content -> $PERSISTENT_CONTENT"

# Verificar
if [ -L "$PUBLIC_DIR/content" ]; then
  echo "✅ Symlink de content verificado"
  ls -la "$PUBLIC_DIR/content"
else
  echo "❌ Error creando symlink de content"
fi

echo "✅ Symlink creado: $PUBLIC_DIR/content -> $PERSISTENT_CONTENT"
echo "✅ Configuración de persistencia completada"
