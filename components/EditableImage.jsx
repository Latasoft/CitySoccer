'use client';
import { useState, useEffect } from 'react';
import { useAdminMode } from '@/contexts/AdminModeContext';
import { useContent } from '@/contexts/ContentContext';
import { imageService } from '@/lib/adminService';
import { dynamicImageService } from '@/lib/dynamicImageService';
import { Upload, X, Check, Loader2 } from 'lucide-react';

const EditableImage = ({ 
  src, 
  alt, 
  categoria, 
  className = '', 
  style = {},
  onImageChange,
  pageKey = 'default',
  fieldKey,
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
  const [currentSrc, setCurrentSrc] = useState(src);
  const [loading, setLoading] = useState(true); // Empezar en true para cargar desde JSON
  const [cacheBuster, setCacheBuster] = useState(Date.now()); // Para forzar recarga de imagen

  // Generar fieldKey automático si no se proporciona
  const imageFieldKey = fieldKey || `${categoria}_image`;

  // Cargar imagen desde JSON al montar (solo una vez)
  useEffect(() => {
    if (!pageKey || !imageFieldKey) {
      setCurrentSrc(src);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const debugMode = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

    const loadImageUrl = async () => {
      try {
        setLoading(true);
        const { data, error } = await getField(pageKey, imageFieldKey);
        
        if (!isMounted) return;
        
        if (error) {
          if (debugMode) {
            console.error(`[EditableImage] Error cargando ${pageKey}.${imageFieldKey}:`, error);
          }
          setCurrentSrc(src); // Fallback al src original
          return;
        }
        
        if (data) {
          if (debugMode) {
            console.log(`[EditableImage] ✅ Cargando desde JSON: ${pageKey}.${imageFieldKey} =`, data);
          }
          setCurrentSrc(data);
          setCacheBuster(Date.now()); // Forzar recarga al cargar desde JSON
        } else {
          if (debugMode) {
            console.log(`[EditableImage] ℹ️ No hay valor en JSON para ${pageKey}.${imageFieldKey}, usando src prop:`, src);
          }
          setCurrentSrc(src);
        }
      } catch (error) {
        console.error(`[EditableImage] Error en loadImageUrl:`, error);
        setCurrentSrc(src);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadImageUrl();
    
    return () => {
      isMounted = false;
    };
  }, [pageKey, imageFieldKey]); // Removido 'src' de dependencias

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

      // Generar nombre único con timestamp
      const fileName = `${categoria}_${Date.now()}`;
      
      const { data, error } = await imageService.upload(file, categoria, fileName);
      
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
      
      // Actualizar el estado local inmediatamente con cache-busting
      setCurrentSrc(newImageUrl);
      setCacheBuster(Date.now()); // Forzar recarga de la imagen
      
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

  // Añadir cache-busting a la URL de la imagen
  const getSrcWithCacheBusting = (url) => {
    if (!url) return url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${cacheBuster}`;
  };

  const imgElement = currentSrc ? (
    <img
      src={getSrcWithCacheBusting(currentSrc)}
      alt={alt}
      className={`${className} ${
        isAdminMode 
          ? 'cursor-pointer hover:ring-4 hover:ring-[#ffee00] hover:ring-opacity-70 transition-all duration-200' 
          : ''
      }`}
      style={style}
      onClick={handleImageClick}
      title={isAdminMode ? `Clic para cambiar imagen (${categoria})` : alt}
      onError={(e) => {
        // Si la imagen falla al cargar, usar placeholder
        e.target.onerror = null; // Prevenir loop infinito
        e.target.src = '/Logo2.png';
      }}
    />
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
      <svg className="w-1/3 h-1/3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
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