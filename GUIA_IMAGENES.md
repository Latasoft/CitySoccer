# 🖼️ Guía del Sistema de Imágenes Dinámicas

## ¿Cómo funciona?

El sistema de imágenes te permite **subir y gestionar todas las imágenes del sitio web** desde el panel de administración. Las imágenes se organizan por **categorías** y se muestran automáticamente en diferentes partes del sitio.

## 🎯 Categorías y Dónde se Usan

### 🏠 **LOGOS**
- **Dónde se ve:** Logo principal en la página de inicio
- **Recomendación:** Subir el logo oficial de CitySoccer
- **Formato:** PNG con fondo transparente preferiblemente
- **Tamaño:** 200x200px recomendado

### 🌟 **HERO / PORTADA** 
- **Dónde se ve:** Imagen de fondo de la página principal (cuando el video no carga)
- **Recomendación:** Imagen impactante de las instalaciones
- **Formato:** JPG de alta calidad
- **Tamaño:** 1920x1080px (Full HD)

### 🏟️ **CANCHAS**
- **Dónde se ve:** Carrusel principal - Tarjetas de servicios
  - **Imagen 1:** Tarjeta "Arrienda Cancha Fútbol"
  - **Imagen 2:** Tarjeta "Arrienda Cancha Pickleball"
- **Recomendación:** Fotos profesionales de las canchas
- **Formato:** JPG de buena calidad
- **Tamaño:** 800x600px recomendado

### 🎉 **EVENTOS**
- **Dónde se ve:** Carrusel principal - Tarjetas de actividades
  - **Imagen 1:** Tarjeta "Clases Particulares"
  - **Imagen 2:** Tarjeta "Academia Deportiva" 
  - **Imagen 3:** Tarjeta "Summer Camp"
- **Recomendación:** Fotos de entrenamientos y actividades
- **Formato:** JPG de buena calidad
- **Tamaño:** 800x600px recomendado

### ⚽ **EQUIPOS**
- **Dónde se ve:** Contenido futuro (páginas de equipos)
- **Recomendación:** Fotos de jugadores y equipos
- **Uso:** Reservado para futuras funcionalidades

### 📁 **GENERAL**
- **Dónde se ve:** Uso variado en el sitio
- **Recomendación:** Imágenes adicionales para contenido
- **Uso:** Flexible según necesidades

## 📋 Pasos para Cambiar Imágenes

### 1. **Acceder al Panel**
1. Ve a `localhost:3000/dashboard`
2. Inicia sesión como administrador
3. Haz clic en **"Imágenes"** en el menú lateral

### 2. **Subir Nueva Imagen**
1. Haz clic en **"Subir Imagen"**
2. Selecciona la **categoría correcta**
3. Arrastra la imagen o haz clic para seleccionar
4. Escribe un **nombre descriptivo**
5. Haz clic en **"Subir Imagen"**

### 3. **Gestionar Imágenes Existentes**
- **Ver:** Pasa el mouse sobre la imagen y haz clic en el ojo 👁️
- **Copiar URL:** Haz clic en el botón de enlace 🔗
- **Eliminar:** Haz clic en el botón de papelera 🗑️

### 4. **Verificar Cambios**
1. Ve a la página principal: `localhost:3000`
2. Refresca la página (F5)
3. Verifica que las nuevas imágenes aparezcan

## 🎨 Mejores Prácticas

### **Calidad de Imagen**
- ✅ Usa imágenes de **alta resolución**
- ✅ Formatos recomendados: **JPG** para fotos, **PNG** para logos
- ✅ Comprime las imágenes para **carga rápida**

### **Nombres Descriptivos**
- ✅ "Logo CitySoccer 2024"
- ✅ "Cancha Futbol Principal"
- ✅ "Entrenamiento Academia Juvenil"
- ❌ "IMG_001.jpg"

### **Organización**
- ✅ Usa la **categoría correcta** para cada imagen
- ✅ **Elimina imágenes** que ya no uses
- ✅ Mantén **pocas imágenes por categoría** para mejor rendimiento

## 🔄 Sistema de Fallback

Si no hay imágenes en una categoría, el sitio mostrará **imágenes por defecto** que están en la carpeta `/public/`:
- Logo: `/Logo2.png`
- Hero: `/imgPrincipal.jpeg`
- Canchas: `/Cancha1.jpeg`, `/Pickleball2.jpeg`
- Eventos: `/Entrenamiento2.jpeg`, `/Entrenamiento4.jpeg`, `/Entrenamiento5.jpeg`

## 🚀 Beneficios

1. **Autonomía Total:** Cambia imágenes sin tocar código
2. **Tiempo Real:** Los cambios se ven inmediatamente
3. **Profesional:** Mantén el sitio siempre actualizado
4. **Organizado:** Sistema de categorías clara
5. **Respaldo:** Las imágenes se guardan seguras en Supabase

## 📞 Soporte

Si tienes problemas:
1. Verifica que la imagen no sea muy grande (máximo 5MB)
2. Usa formatos compatibles (JPG, PNG, WEBP)
3. Asegúrate de estar logueado como administrador
4. Refresca la página después de subir imágenes

---

¡Disfruta gestionando las imágenes de CitySoccer de forma autónoma! 🎯