'use client';
import { useState, useEffect } from 'react';
import { useAdminMode } from '@/contexts/AdminModeContext';
import { useContent } from '@/contexts/ContentContext';
import { localContentService } from '@/lib/localContentService';
import { dynamicImageService } from '@/lib/dynamicImageService';
import { Upload, X, Check, Loader2 } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

const EditableImage = ({ 
  src, 
  alt, 
  categoria, 
  className = '', 
  style = {},
  onImageChange,
  pageKey = 'default',
  fieldKey,
  width,
  height,
  fill = false,
  priority = false,
  sizes,
  quality = 75,
  objectFit = 'cover',
  children, // Capturar y descartar (no permitido en img)
  dangerouslySetInnerHTML, // Capturar y descartar (no permitido en img)
  ...props 
}) => {
  const { isAdminMode } = useAdminMode();
  const { getField, updateField } = useContent();
  const [showUploader, setShowUploader] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [currentSrc, setCurrentSrc] = useState(null); // null = no cargado aún
  const [loading, setLoading] = useState(true);

  // Generar fieldKey automático si no se proporciona
  const imageFieldKey = fieldKey || `${categoria}_image`;

  // Cargar imagen desde JSON al montar (solo una vez)
  useEffect(() => {
    if (!pageKey || !imageFieldKey) {
      console.log(`[EditableImage] Sin pageKey o fieldKey, usando src directamente:`, src);
      setCurrentSrc(src || '');
      setLoading(false);
      return;
    }

    let isMounted = true;
    const debugMode = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

    const loadImageUrl = async () => {
      try {
        console.log(`[EditableImage] Cargando ${pageKey}.${imageFieldKey}...`);
        
        const { data, error } = await getField(pageKey, imageFieldKey);
        
        if (!isMounted) {
          console.log(`[EditableImage] Componente desmontado antes de cargar`);
          return;
        }
        
        if (error) {
          console.error(`[EditableImage] Error cargando ${pageKey}.${imageFieldKey}:`, error);
          // Usar src como fallback
          setCurrentSrc(src || '');
          setLoading(false);
          return;
        }
        
        console.log(`[EditableImage] Data recibida para ${pageKey}.${imageFieldKey}:`, data);
        
        if (data) {
          console.log(`[EditableImage] ✅ Imagen cargada desde JSON:`, data);
          setCurrentSrc(data);
        } else {
          console.log(`[EditableImage] No hay data en JSON, usando src:`, src);
          setCurrentSrc(src || '');
        }
        setLoading(false);
      } catch (error) {
        console.error(`[EditableImage] Exception en loadImageUrl:`, error);
        setCurrentSrc(src || '');
        setLoading(false);
      }
    };

    loadImageUrl();
    
    return () => {
      isMounted = false;
    };
  }, [pageKey, imageFieldKey, src, getField]); // Agregado src y getField

  const handleImageClick = (e) => {
    if (isAdminMode) {
      e.preventDefault();
      e.stopPropagation();
      setShowUploader(true);
    }
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress('Subiendo imagen...');

      // ✅ Usar localContentService directamente (no pasa por Supabase)
      const { data, error } = await localContentService.uploadFile(file, categoria);
      
      if (error) throw error;

      const newImageUrl = data.url;
      setUploadProgress('Guardando en contenido...');

      // Guardar la nueva URL en el JSON de contenido usando contexto compartido
      if (pageKey && imageFieldKey) {
        const { error: saveError } = await updateField(
          pageKey, 
          imageFieldKey, 
          newImageUrl
        );
        
        if (saveError) {
          console.error('[EditableImage] Error guardando URL en JSON:', saveError);
          throw new Error('No se pudo guardar la URL en el contenido');
        }
      }

      setUploadProgress('¡Imagen subida exitosamente! 🎉');
      
      // Agregar timestamp para forzar recarga SOLO después de upload
      const urlWithCacheBust = newImageUrl.includes('?') 
        ? `${newImageUrl}&t=${Date.now()}` 
        : `${newImageUrl}?t=${Date.now()}`;
      
      // Actualizar el estado local con cache-busting
      setCurrentSrc(urlWithCacheBust);
      
      // Disparar recarga de imágenes dinámicas
      dynamicImageService.forceReload();
      
      // Notificar el cambio con URL
      if (onImageChange) {
        onImageChange(newImageUrl);
      }

      // Mostrar notificación de éxito y cerrar modal
      setTimeout(() => {
        setUploadProgress('✅ Imagen actualizada correctamente');
        setUploading(false);
        setShowUploader(false);
        setUploadProgress('');
      }, 1500);

    } catch (error) {
      console.error('Error subiendo imagen:', error);
      setUploadProgress(`Error: ${error.message || 'Intenta de nuevo'}`);
      setTimeout(() => {
        setUploading(false);
        setUploadProgress('');
      }, 3000);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileSelect(imageFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  // Mostrar spinner mientras carga
  if (loading) {
    return (
      <div
        className={`${className} bg-gray-200 flex items-center justify-center`}
        style={style}
      >
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  // Solo agregar cache-busting cuando la URL cambia (no en cada render)
  const finalSrc = currentSrc;

  // Wrapper para manejar clicks en modo admin
  const handleWrapperClick = (e) => {
    if (isAdminMode) {
      e.preventDefault();
      e.stopPropagation();
      handleImageClick(e);
    }
  };

  // Mostrar skeleton mientras carga
  if (loading || !finalSrc) {
    return (
      <div 
        className={`relative group/editable-image ${className} ${fill ? 'w-full h-full' : ''} bg-gray-300/20 animate-pulse flex items-center justify-center ${
          isAdminMode 
            ? 'cursor-pointer hover:ring-4 hover:ring-[#ffee00] hover:ring-opacity-70 transition-all duration-200' 
            : ''
        }`}
        style={style}
        onClick={handleWrapperClick}
      >
        {isAdminMode && (
          <>
            <div className="text-center">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600 text-sm">Cargando...</p>
            </div>
            <div className="absolute top-2 right-2 bg-[#ffee00] text-black p-2 rounded-full shadow-lg opacity-0 group-hover/editable-image:opacity-100 transition-opacity pointer-events-none z-10">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          </>
        )}
      </div>
    );
  }

  const imgElement = finalSrc ? (
    <div 
      className={`relative group/editable-image ${fill ? 'w-full h-full' : ''}`}
      onClick={handleWrapperClick}
      style={{ cursor: isAdminMode ? 'pointer' : 'default' }}
    >
      <OptimizedImage
        src={finalSrc}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        className={`${className} ${
          isAdminMode 
            ? 'hover:ring-4 hover:ring-[#ffee00] hover:ring-opacity-70 transition-all duration-200' 
            : ''
        }`}
        style={style}
        priority={priority}
        quality={quality}
        sizes={sizes}
        objectFit={objectFit}
        title={isAdminMode ? `Clic para cambiar imagen (${categoria})` : alt}
        onLoad={() => console.log(`[EditableImage] ✅ Imagen cargada:`, finalSrc)}
        onError={(e) => {
          console.error(`[EditableImage] ❌ Error cargando imagen:`, finalSrc);
          // OptimizedImage maneja fallback automáticamente
        }}
        {...props}
      />
      {isAdminMode && (
        <div className="absolute top-2 right-2 bg-[#ffee00] text-black p-2 rounded-full shadow-lg opacity-0 group-hover/editable-image:opacity-100 transition-opacity pointer-events-none z-10">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
      )}
    </div>
  ) : (
    <div
      className={`${className} bg-gray-200 flex items-center justify-center ${
        isAdminMode 
          ? 'cursor-pointer hover:ring-4 hover:ring-[#ffee00] hover:ring-opacity-70 transition-all duration-200' 
          : ''
      }`}
      style={style}
      onClick={handleImageClick}
      title={isAdminMode ? `Clic para agregar imagen (${categoria})` : alt}
    >
      {isAdminMode && (
        <div className="text-center">
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600 text-sm">Clic para agregar imagen</p>
        </div>
      )}
      {!isAdminMode && (
        <svg className="w-1/3 h-1/3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )}
    </div>
  );

  return (
    <>
      {imgElement}

      {/* Modal de subida */}
      {showUploader && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Cambiar {categoria} - {alt}
              </h3>
              <button
                onClick={() => setShowUploader(false)}
                disabled={uploading}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#ffee00] mb-4" />
                <p className="text-gray-600">{uploadProgress}</p>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragOver ? 'border-[#ffee00] bg-[#ffee00]/10' : 'border-gray-300'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  Arrastra una imagen aquí o haz clic para seleccionar
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handleFileSelect(file);
                  }}
                  className="hidden"
                  id={`upload-${categoria}`}
                />
                <label
                  htmlFor={`upload-${categoria}`}
                  className="inline-block px-4 py-2 bg-[#ffee00] hover:bg-[#e6d000] text-black font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  Seleccionar Archivo
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Formatos soportados: JPG, PNG, WEBP (máx. 5MB)
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EditableImage;