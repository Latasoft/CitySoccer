# 🔄 Configuración Híbrida: Netlify + DNS iHost

## 🎯 Objetivo
- Proyecto deployado en Netlify (performance, CDN, SSL)
- DNS gestionado en iHost (control, flexibilidad)
- Mejor de ambos mundos

## 📋 Configuración DNS en iHost

### Records principales para Netlify:

```dns
# Dominio principal → Netlify
Tipo: A
Nombre: @
Valor: 75.2.60.5
TTL: 3600

# Backup IP Netlify
Tipo: A  
Nombre: @
Valor: 99.83.190.102
TTL: 3600

# Subdominio www → Netlify
Tipo: CNAME
Nombre: www
Valor: [TU-SITIO].netlify.app
TTL: 3600
```

### Records opcionales (si usas otros servicios):

```dns
# Email en iHost
Tipo: MX
Nombre: @
Valor: mail.tudominio.cl
Prioridad: 10

# Subdominio mail
Tipo: CNAME
Nombre: mail
Valor: servidor-ihost.cl

# Otros subdominios en iHost
Tipo: CNAME
Nombre: admin
Valor: servidor-ihost.cl
```

## ⚙️ Configuración en Netlify

### 1. Agregar Dominio Personalizado
1. Netlify Dashboard → Site settings
2. Domain management → Add custom domain
3. Ingresar: `citysoccer.cl`
4. **IMPORTANTE:** NO cambiar nameservers
5. Netlify detectará DNS externo automáticamente

### 2. SSL Configuration
- Netlify configurará SSL automáticamente
- Let's Encrypt certificate se generará
- Habilitar "Force HTTPS"

## 🔧 Pasos Detallados

### Paso 1: Identificar tu URL de Netlify
En tu dashboard de Netlify, encontrar la URL:
```
Ejemplo: citysoccer-app.netlify.app
```

### Paso 2: Configurar en iHost
1. **Panel iHost → DNS Management**
2. **Eliminar records antiguos** (A, CNAME hacia iHost)
3. **Agregar nuevos records** (ver tabla arriba)
4. **Guardar cambios**

### Paso 3: Configurar en Netlify  
1. **Site settings → Domain management**
2. **Add custom domain: citysoccer.cl**
3. **Verificar:** Netlify muestra "DNS configured externally"
4. **Esperar:** SSL se configura automáticamente

### Paso 4: Verificación
- `nslookup citysoccer.cl` → debe mostrar IPs de Netlify
- `https://citysoccer.cl` → debe cargar desde Netlify
- SSL activo automáticamente

## ⏱️ Tiempos de Propagación

- **DNS:** 1-4 horas (típicamente 30 minutos)
- **SSL:** 10-30 minutos después de DNS
- **Verificar cada:** 15-30 minutos

## 🛠️ Ventajas de esta Configuración

### ✅ Beneficios Netlify:
- CDN global (velocidad)
- SSL automático y gratuito
- Deploy automático desde GitHub
- Optimizaciones automáticas
- 99.9% uptime

### ✅ Beneficios iHost DNS:
- Control total sobre DNS
- Interfaz familiar
- Soporte local en español
- Flexibilidad para subdominios
- Mantener email en iHost

## 🔍 Verificación y Testing

### Comandos útiles:
```bash
# Verificar DNS
nslookup citysoccer.cl

# Verificar propagación
dig citysoccer.cl

# Verificar SSL
curl -I https://citysoccer.cl

# Verificar performance
curl -w "@format.txt" https://citysoccer.cl
```

### Herramientas online:
- DNS Checker: https://dnschecker.org/
- SSL Test: https://www.ssllabs.com/ssltest/
- Performance: https://pagespeed.web.dev/

## 🚨 Troubleshooting

### Problema: DNS no propaga
**Solución:**
- Verificar TTL en iHost (usar 3600 o menos)
- Limpiar cache DNS local: `ipconfig /flushdns`
- Esperar propagación completa

### Problema: SSL no se genera
**Solución:**
- Verificar que DNS esté propagado primero
- En Netlify: "Verify DNS configuration"
- Intentar "Provision certificate" manualmente

### Problema: Sitio no carga
**Solución:**
- Verificar que el deploy en Netlify esté activo
- Revisar logs en Netlify
- Verificar que `out/` folder se generó correctamente

## 📞 Soporte

- **iHost DNS:** Panel iHost → Soporte
- **Netlify:** https://www.netlify.com/support/
- **Verificación:** Usar herramientas online mencionadas

---

## ✅ Checklist Final

- [ ] URL de Netlify identificada
- [ ] Records A configurados en iHost (75.2.60.5, 99.83.190.102)
- [ ] CNAME www configurado en iHost
- [ ] Dominio agregado en Netlify
- [ ] DNS propagado (verificar con nslookup)
- [ ] SSL activo en Netlify
- [ ] HTTPS funcionando
- [ ] Redirección www → no-www (o viceversa)
- [ ] Todas las páginas cargan correctamente

**¡Esta configuración te dará lo mejor de ambos mundos!**