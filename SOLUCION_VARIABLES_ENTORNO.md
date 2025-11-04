# 🚨 SOLUCIÓN: Variables de Entorno Faltantes en Render

## 📋 Problema Identificado
Las variables de entorno de Supabase NO están llegando al cliente en producción, causando errores 401 "Invalid API key".

## ✅ Cambios Realizados
1. **Mejorado `next.config.mjs`**: Configuración reforzada para variables de entorno
2. **Agregado diagnóstico**: Script para detectar variables faltantes
3. **Mejorado logging**: Más información de debug en la consola

## 🛠️ PASOS PARA SOLUCIONAR EN RENDER

### Paso 1: Verificar Variables en Render
1. Ve a tu servicio en Render
2. **Environment** → **Environment Variables**
3. Verifica que estén **EXACTAMENTE** estas variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://dtezcpcxeafjwofoqejb.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZXpjcGN4ZWFmandvZm9xZWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTAyMzAsImV4cCI6MjA3MTEyNjIzMH0.6Y3DreGQKgeBlNYQ2foRbJx0NZtQaop_eSTfCOcwW8Q
   NEXT_PUBLIC_BASE_URL = https://citysoccer.onrender.com
   SUPABASE_SERVICE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZXpjcGN4ZWFmandvZm9xZWpiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTU1MDIzMCwiZXhwIjoyMDcxMTI2MjMwfQ.cOY1VRdOU1ESdSMAcvLg9qtOlYH-7NbM4yei1c6YWAk
   NODE_VERSION = 20
   ```

### Paso 2: Redeploy FORZADO
**⚠️ CRÍTICO**: Las variables deben existir ANTES del build
1. Después de configurar las variables
2. **Manual Deploy** → **Deploy Latest Commit**
3. Espera a que termine el build completamente

### Paso 3: Verificar en Logs de Build
En los logs del build de Render, deberías ver algo como:
```
Creating an optimized production build...
Environment variables loaded
```

### Paso 4: Verificar en el Sitio
1. Abre el sitio desplegado
2. Abre Developer Tools (F12)
3. Ve a la pestaña **Console**
4. Busca los logs de diagnóstico:
   ```
   🔍 DIAGNÓSTICO DE VARIABLES DE ENTORNO
   Supabase URL: CONFIGURADA ✅
   Supabase ANON Key: CONFIGURADA ✅
   ```

## 🔧 Si el Problema Persiste

### Opción A: Crear nuevo servicio en Render
A veces Render tiene problemas con variables. Crear un nuevo servicio:
1. **New** → **Web Service**
2. Conectar el mismo repositorio
3. Configurar las variables ANTES del primer deploy

### Opción B: Verificar formato de variables
- Sin espacios antes/después del `=`
- Sin comillas extras
- Nombres exactos (case-sensitive)

### Opción C: Build Command personalizado
En Render, cambiar el Build Command a:
```bash
npm install && npm run build
```

## 📊 Scripts de Verificación

### Local (para testing):
```bash
node verify-env.js
```

### En el sitio web (consola del navegador):
Las variables deberían aparecer en los logs automáticamente.

## 🆘 Si Nada Funciona

1. **Variables hardcodeadas temporalmente** (SOLO para testing):
   ```javascript
   // En lib/supabaseClient.js - TEMPORAL
   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dtezcpcxeafjwofoqejb.supabase.co';
   const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'tu_anon_key_aqui';
   ```

2. **Contactar soporte de Render** si las variables no se cargan en el build

## ✅ Confirmación de Éxito
Sabrás que funciona cuando:
- ❌ Desaparecen los errores 401 en la consola
- ✅ Las tarifas se cargan correctamente
- ✅ Los logs muestran "CONFIGURADA ✅"
- ✅ El sitio funciona igual que en local

---
**Nota**: Estos cambios ya están commiteados en el repositorio. Solo necesitas hacer el redeploy en Render.