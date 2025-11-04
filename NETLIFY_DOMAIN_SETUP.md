# 🌐 Configuración de Dominios en Netlify - CitySoccer

## ✅ Pasos Completados
- [x] Proyecto deployado en Netlify
- [x] Configuración de Next.js para export estático
- [x] Archivo netlify.toml configurado

## 🚀 Configuración de Dominio Personalizado

### 1. Configurar en Netlify Dashboard

1. **Acceder al Dashboard:**
   - Ve a: https://app.netlify.com/
   - Selecciona el proyecto CitySoccer

2. **Agregar Dominio Personalizado:**
   - Site settings → Domain management
   - Custom domains → Add custom domain
   - Ingresa: `citysoccer.cl`
   - Confirma la configuración

### 2. Configuración DNS

#### Opción A: DNS Records en tu proveedor
```
Tipo: A
Nombre: @
Valor: 75.2.60.5

Tipo: CNAME  
Nombre: www
Valor: [tu-sitio].netlify.app
```

#### Opción B: Netlify DNS (Recomendado)
```
Nameservers de Netlify:
- dns1.p08.nsone.net
- dns2.p08.nsone.net  
- dns3.p08.nsone.net
- dns4.p08.nsone.net
```

### 3. Resolver Conflictos con iHost

**⚠️ IMPORTANTE:** Si tienes iHost configurado:

1. **Pausar servicio en iHost:**
   - Panel de iHost → Servicios
   - Pausar hosting para citysoccer.cl

2. **O eliminar configuración:**
   - Eliminar archivos de public_html
   - Liberar el dominio en iHost

### 4. Variables de Entorno en Netlify

**Site settings → Environment variables:**
```
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_aqui
```

### 5. SSL/HTTPS

- ✅ Netlify configura SSL automáticamente
- ✅ Habilitar "Force HTTPS"
- ✅ Verificar certificado Let's Encrypt

### 6. Verificación Final

**Herramientas de verificación:**
- DNS Checker: https://dnschecker.org/
- SSL Checker: https://www.sslshopper.com/ssl-checker.html
- Netlify Status: En tu dashboard

**URLs a verificar:**
- http://citysoccer.cl → debe redirigir a https
- https://citysoccer.cl → debe cargar el sitio
- https://www.citysoccer.cl → debe funcionar

### 7. Tiempo de Propagación

- DNS: 24-48 horas (normalmente 1-4 horas)
- SSL: 10-30 minutos después de DNS
- Verificar cada 30 minutos

### 8. Solución de Problemas

#### Error: "Site not found"
- Verificar DNS records
- Esperar propagación DNS
- Revisar configuración en Netlify

#### Error: SSL
- Esperar a que Netlify genere certificado
- Verificar que DNS esté propagado
- Intentar "Renew certificate" en Netlify

#### Conflicto con iHost
- Verificar que iHost no esté sirviendo el dominio
- Contactar soporte de iHost si es necesario

### 9. Comandos Útiles

```bash
# Verificar DNS
nslookup citysoccer.cl

# Verificar propagación
dig citysoccer.cl

# Verificar SSL
curl -I https://citysoccer.cl
```

### 📞 Contacto y Soporte

- Netlify Support: https://www.netlify.com/support/
- DNS Help: Documentación de tu proveedor de dominio
- Netlify Community: https://community.netlify.com/

---

## 🎯 Checklist Final

- [ ] Dominio agregado en Netlify
- [ ] DNS configurado en proveedor
- [ ] iHost pausado/desactivado  
- [ ] Variables de entorno configuradas
- [ ] SSL habilitado y funcionando
- [ ] Force HTTPS activado
- [ ] Sitio accesible via https://citysoccer.cl
- [ ] Redirección www funcionando
- [ ] Todas las páginas cargan correctamente

**¡Una vez completado este checklist, tu sitio estará completamente funcional en Netlify!**