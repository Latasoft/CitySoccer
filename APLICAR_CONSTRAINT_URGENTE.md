# INSTRUCCIONES CRÍTICAS - APLICAR CONSTRAINT DE UNICIDAD

## ⚠️ ACCIÓN REQUERIDA INMEDIATAMENTE

El constraint de unicidad para prevenir dobles reservas **NO está aplicado** en la base de datos de producción.

### Pasos para aplicar:

1. **Ir a Supabase Dashboard**
   - https://supabase.com/dashboard/project/[tu-proyecto]

2. **Abrir SQL Editor**
   - Menú lateral → SQL Editor → New Query

3. **Ejecutar el script**
   - Copiar todo el contenido de: `database/46_apply_unique_constraint.sql`
   - Pegar en el editor
   - Click en "Run"

4. **Verificar resultado**
   - Deberías ver: `✅ El índice único ya existe` o `✅ Índice único creado exitosamente`

### ¿Qué hace este constraint?

Previene que dos usuarios reserven la misma cancha, fecha y hora simultáneamente.

**Sin este constraint:**
- ❌ Dos pagos pueden procesar al mismo tiempo
- ❌ Ambos crean reservas en la BD
- ❌ Conflicto detectado DESPUÉS del pago
- ❌ Requiere reembolso manual

**Con este constraint:**
- ✅ La BD rechaza la segunda reserva automáticamente
- ✅ El webhook detecta el error 23505
- ✅ Se envía email de reembolso automático
- ✅ Se notifica al admin del conflicto

### Verificar que funciona:

Después de aplicar, revisa los logs del webhook. Si hay un conflicto, deberías ver:

```
⚠️ Violación de unique constraint detectada
⚠️ CONFLICTO DE RESERVA: La cancha ya fue reservada por otro usuario
✅ Email de reembolso enviado al cliente
```

## OTROS FIXES APLICADOS EN ESTE COMMIT:

1. ✅ Teléfono ahora se guarda correctamente en transacciones
2. ✅ Detección mejorada de conflictos en webhook (incluye error de BD)
3. ✅ PDF optimizado (sin emojis, una página)
4. ✅ Días activos sincronizados entre horarios/precios/tablas

**PENDIENTE:**
- ⚠️ Aplicar el constraint en Supabase (instrucciones arriba)
