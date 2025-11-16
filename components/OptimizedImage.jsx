'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

/**
 * Wrapper de next/image con optimizaciones y fallback
 * - Maneja errores con fallback automático
 * - Soporte para fill (antiguos objectFit)
 * - Lazy loading por defecto
 * - Blur placeholder opcional
 * - Compatibilidad con sistema editable
 */
const OptimizedImage = ({
  src,
  alt = '',
  width,
  height,
  fill = false,
  className = '',
  style = {},
  priority = false,
  quality = 75,
  sizes,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
  objectFit = 'cover',
  objectPosition = 'center',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Actualizar imgSrc cuando cambia el prop src (importante para cache-busting con ?v=)
  useEffect(() => {
    if (src !== imgSrc) {
      setImgSrc(src);
      setHasError(false); // Reset error state
    }
  }, [src]);

  // Determinar si la imagen es remota (Supabase) o local
  const isRemote = imgSrc?.startsWith('http://') || imgSrc?.startsWith('https://');
  const isSupabase = imgSrc?.includes('supabase.co');

  // Fallback genérico si no hay src
  const fallbackSrc = '/imgPrincipal.jpeg';

  // Si no hay src válido, usar fallback
  const finalSrc = imgSrc || fallbackSrc;

  // Handler de error con fallback
  const handleError = (e) => {
    console.warn(`[OptimizedImage] Error cargando imagen: ${imgSrc}`);
    setHasError(true);
    
    // Intentar fallback solo si no estamos ya en el fallback
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }

    // Llamar handler externo si existe
    if (onError) {
      onError(e);
    }
  };

  // Handler de carga exitosa
  const handleLoad = (e) => {
    setHasError(false);
    if (onLoad) {
      onLoad(e);
    }
  };

  // Para imágenes remotas de Supabase, usar unoptimized si hay problemas
  const shouldUnoptimize = isRemote && hasError;

  // Configuración de sizes por defecto si no se proporciona
  const defaultSizes = fill 
    ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
    : undefined;

  // Solo usar blur placeholder si:
  // 1. Se proporcionó blurDataURL explícitamente, O
  // 2. Es una imagen local (no remota) Y placeholder es 'blur'
  const shouldUseBlur = blurDataURL || (!isRemote && placeholder === 'blur');
  const finalPlaceholder = shouldUseBlur ? 'blur' : 'empty';

  // Si usamos fill, no necesitamos width/height
  if (fill) {
    return (
      <Image
        src={finalSrc}
        alt={alt}
        fill
        className={className}
        style={{
          objectFit,
          objectPosition,
          ...style
        }}
        quality={quality}
        priority={priority}
        sizes={sizes || defaultSizes}
        placeholder={finalPlaceholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        unoptimized={shouldUnoptimize}
        {...props}
      />
    );
  }

  // Si tenemos dimensiones específicas
  if (width && height) {
    return (
      <Image
        src={finalSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={{
          objectFit,
          objectPosition,
          ...style
        }}
        quality={quality}
        priority={priority}
        sizes={sizes}
        placeholder={finalPlaceholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        unoptimized={shouldUnoptimize}
        {...props}
      />
    );
  }

  // Fallback: usar dimensiones automáticas con fill (requiere position: relative en padre)
  console.warn('[OptimizedImage] Sin dimensiones especificadas, usando fill. Asegúrate que el padre tenga position: relative');
  
  return (
    <div className={`relative ${className}`} style={style}>
      <Image
        src={finalSrc}
        alt={alt}
        fill
        style={{
          objectFit,
          objectPosition,
        }}
        quality={quality}
        priority={priority}
        sizes={sizes || defaultSizes}
        placeholder={finalPlaceholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        unoptimized={shouldUnoptimize}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
