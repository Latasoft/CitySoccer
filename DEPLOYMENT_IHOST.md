# Guía de Deployment para iHost

## Pasos para subir CitySoccer a iHost

### 1. Preparar archivos para subir
Después de ejecutar `npm run build`, los archivos estáticos se generan en la carpeta `out/`

### 2. Archivos a subir
- Todo el contenido de la carpeta `out/`
- Archivo `.htaccess` (creado automáticamente)

### 3. Configuración de iHost

#### Estructura en el servidor:
```
public_html/
├── index.html
├── _next/
├── images/
├── .htaccess
└── [otros archivos de out/]
```

#### Configuración .htaccess
El archivo `.htaccess` debe estar en la raíz de `public_html` con la siguiente configuración:

```apache
RewriteEngine On

# Handle Angular and React Router
RewriteBase /

# Handle Next.js trailing slashes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^([^/]+)/?$ /$1.html [L,QSA]

# Fallback to index.html for SPA routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set X-XSS-Protection "1; mode=block"

# Cache control for static assets
<filesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
</filesMatch>
```

### 4. Pasos de subida

1. **Conectar por FTP/cPanel**
   - Host: tu_dominio.cl
   - Usuario: tu_usuario_ihost
   - Password: tu_password_ihost

2. **Navegar a public_html**
   - Eliminar archivos existentes (si los hay)
   - Mantener copia de seguridad si es necesario

3. **Subir archivos**
   - Subir TODO el contenido de la carpeta `out/`
   - Asegurarse de que el archivo `.htaccess` esté en la raíz

4. **Verificar**
   - Visitar https://citysoccer.cl
   - Probar navegación entre páginas
   - Verificar que las imágenes carguen correctamente

### 5. Solución de problemas comunes

#### Error 404:
- Verificar que `.htaccess` esté correctamente configurado
- Verificar que todos los archivos estén en `public_html`

#### Imágenes no cargan:
- Verificar que la carpeta `images/` esté subida
- Verificar permisos de archivos (755 para carpetas, 644 para archivos)

#### Rutas no funcionan:
- Verificar configuración de RewriteRule en `.htaccess`
- Verificar que el servidor soporte mod_rewrite

### 6. Comandos útiles

```bash
# Hacer build
npm run build

# Comprimir archivos para subida más rápida
cd out
zip -r citysoccer-build.zip .
```

### 7. Notas importantes

- iHost soporta sitios estáticos
- Las APIs de Next.js NO funcionarán en hosting estático
- Solo funciona el contenido generado estáticamente
- Asegurarse de que `output: 'export'` esté en `next.config.mjs`
