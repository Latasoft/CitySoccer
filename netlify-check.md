# Verificación de Deployment en Netlify

## Pasos para resolver el problema de iHost:

### 1. Verificar configuración en Netlify
- [ ] Ir a Netlify Dashboard
- [ ] Seleccionar el proyecto CitySoccer
- [ ] Verificar que el build fue exitoso
- [ ] Verificar que el dominio `citysoccer.cl` está configurado

### 2. Configuración de DNS
- [ ] Ir al panel de control de tu proveedor de dominio
- [ ] Cambiar los DNS records:
  - **Tipo A**: `75.2.60.5` (IP de Netlify)
  - **CNAME**: `your-netlify-site.netlify.app`
  - **O configurar Name Servers**: `dns1.p08.nsone.net`, `dns2.p08.nsone.net`

### 3. Verificar en iHost
- [ ] Ir a tu panel de iHost
- [ ] Pausar o eliminar el servicio de hosting para `citysoccer.cl`
- [ ] O cambiar la configuración para que no interfiera

### 4. Verificar variables de entorno
- [ ] En Netlify, ir a Site settings > Environment variables
- [ ] Agregar las variables de Supabase:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 5. Forzar nuevo deploy
- [ ] Hacer un pequeño cambio en el código
- [ ] Push a GitHub
- [ ] O usar "Trigger deploy" en Netlify

### URLs importantes:
- Netlify Dashboard: https://app.netlify.com/
- DNS Checker: https://dnschecker.org/
- Tu sitio en Netlify: [URL-DE-TU-SITIO].netlify.app