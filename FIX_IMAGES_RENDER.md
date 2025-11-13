# 🔧 SOLUCIÓN: Imágenes y Videos No Se Cargan en Render

## 📋 Diagnóstico del Problema

**Problema identificado:**
El disco persistente de Render estaba montado en `/opt/render/project/src/public`, lo que reemplazaba TODA la carpeta `public/`, incluyendo las imágenes estáticas que vienen del repositorio Git.

Cuando Render hace un deploy con "disk updated", el disco persistente se actualiza pero NO incluye los archivos del repositorio Git, por lo que:
- ❌ Las imágenes estáticas (Birthday.jpeg, Logo.png, etc.) no estaban disponibles
- ❌ El video principal (videofutbol.mp4) no estaba disponible
- ❌ Las imágenes del carousel subidas por el admin se perdían entre deploys

## ✅ Solución Implementada

### 1. Modificar `render.yaml`

**ANTES:**
```yaml
disks:
  - name: citysoccer-content
    mountPath: /opt/render/project/src/public  # ❌ Monta TODO public
    sizeGB: 5
```

**DESPUÉS:**
```yaml
disks:
  - name: citysoccer-uploads
    mountPath: /opt/render/project/src/public/uploads  # ✅ Solo uploads
    sizeGB: 3
  - name: citysoccer-content
    mountPath: /opt/render/project/src/public/content  # ✅ Solo content
    sizeGB: 1
```

### 2. Modificar `.gitignore`

**ANTES:**
```gitignore
/public/uploads/  # ❌ Excluye TODO uploads incluyendo carousel
```

**DESPUÉS:**
```gitignore
# Excluir uploads dinámicos pero incluir carousel existentes
/public/uploads/images/
/public/uploads/videos/
# Permitir archivos del carousel que ya existen
```

### 3. Estructura de Archivos Resultante

```
public/
├── Birthday.jpeg ✅ (en Git)
├── Birthday2.jpeg ✅ (en Git)
├── Logo.png ✅ (en Git)
├── videofutbol.mp4 ✅ (en Git)
├── ... (27 archivos estáticos en Git)
│
├── uploads/ (Disco persistente en Render)
│   ├── carousel/ ✅ (necesita agregarse a Git)
│   │   ├── carousel_1762997746339_Pickleball.webp
│   │   └── carousel_1763001178311_summer-camp.jpg
│   ├── images/ (vacío, para futuras subidas)
│   └── videos/ (vacío, para futuras subidas)
│
└── content/ (Disco persistente en Render)
    └── ... (JSON files del CMS)
```

## 🚀 Pasos para Aplicar la Solución

### Paso 1: Agregar archivos del carousel a Git

```bash
git add public/uploads/carousel/
git add .gitignore
git add render.yaml
git add scripts/init-render.js
git add scripts/sync-from-supabase.js
git add scripts/backup-to-supabase.js
```

### Paso 2: Hacer commit

```bash
git commit -m "Fix: Configurar disco persistente solo para uploads/content

- Cambiar mountPath de /public a /public/uploads y /public/content
- Permitir archivos del carousel en Git
- Agregar scripts de sincronización con Supabase
- Las imágenes estáticas ahora vienen del repo Git correctamente"
```

### Paso 3: Push a GitHub

```bash
git push origin main
```

### Paso 4: Deploy en Render

Render detectará el cambio en `render.yaml` y te pedirá **actualizar los discos persistentes**.

⚠️ **IMPORTANTE**: Cuando Render te pida actualizar los discos, esto borrará el contenido del disco actual. Por eso es importante que los archivos del carousel estén en Git ahora.

## 📊 Resultado Esperado

Después del deploy:

✅ **Imágenes estáticas**: Se cargan desde el repositorio Git
✅ **Video principal**: Se carga desde el repositorio Git  
✅ **Imágenes del carousel**: Se cargan desde Git en el primer deploy
✅ **Uploads del admin**: Se guardan en el disco persistente
✅ **Contenido JSON**: Se guarda en el disco persistente

## 🔄 Flujo de Trabajo para el Futuro

### Cuando el admin sube una imagen:

1. La imagen se guarda en `/public/uploads/carousel/` (disco persistente)
2. La imagen persiste entre deploys
3. Si quieres hacer backup, usa: `node scripts/backup-to-supabase.js`

### Cuando quieres restaurar desde Supabase:

1. Ejecutar en Render (desde Shell): `node scripts/sync-from-supabase.js`
2. Las imágenes se descargan de Supabase al disco persistente

## ⚠️ Notas Importantes

1. **Primera vez**: El cambio de discos en Render borrará el contenido actual del disco persistente
2. **Archivos del carousel**: Deben estar en Git para que estén disponibles después del cambio
3. **Supabase Storage**: Actualmente vacío, no se pueden restaurar imágenes desde ahí
4. **Backups futuros**: Usar `backup-to-supabase.js` requiere configurar políticas RLS en Supabase

## 🔍 Verificación Post-Deploy

1. Abrir la página principal → Verificar que se vea el video
2. Verificar que las imágenes estáticas se carguen
3. Verificar que el carousel muestre las imágenes
4. Probar subir una nueva imagen en modo admin
5. Hacer otro deploy y verificar que la imagen nueva persista
