'use client';
import { useState } from 'react';
import { useAdminMode } from '@/contexts/AdminModeContext';
import { imageService } from '@/lib/adminService';
import { dynamicImageService } from '@/lib/dynamicImageService';
import { Upload, X, Check, Loader2 } from 'lucide-react';

const EditableImage = ({ 
  src, 
  alt, 
  categoria, 
  className = '', 
  style = {},
  fallbackSrc = '/imgPrincipal.jpeg',
  onImageChange,
  pageKey, // Capturar y descartar (legacy prop)
  fieldKey, // Capturar y descartar (legacy prop)
  children, // Capturar y descartar (no permitido en img)
  dangerouslySetInnerHTML, // Capturar y descartar (no permitido en img)
  ...props 
}) => {
  const { isAdminMode } = useAdminMode();
  const [showUploader, setShowUploader] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

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

      // Generar nombre único
      const fileName = `${categoria}_${Date.now()}`;
      
      const { data, error } = await imageService.upload(file, categoria, fileName);
      
      if (error) throw error;

      setUploadProgress('¡Imagen subida exitosamente! 🎉');
      
      // Disparar recarga de imágenes dinámicas
      dynamicImageService.forceReload();
      
      // Notificar el cambio
      if (onImageChange) {
        onImageChange(data.url);
      }

      // Mostrar notificación de éxito
      setTimeout(() => {
        setUploadProgress('✅ Imagen actualizada. Recargando página...');
      }, 1000);

      // Esperar un poco para que se procese la recarga y luego recargar página
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Error subiendo imagen:', error);
      setUploadProgress('Error al subir la imagen. Intenta de nuevo.');
    } finally {
      setTimeout(() => {
        setUploading(false);
        setShowUploader(false);
        setUploadProgress('');
      }, 2000);
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

  const imgElement = (
    <img
      src={src || fallbackSrc}
      alt={alt}
      className={`${className} ${
        isAdminMode 
          ? 'cursor-pointer hover:ring-4 hover:ring-[#ffee00] hover:ring-opacity-70 transition-all duration-200' 
          : ''
      }`}
      style={style}
      onClick={handleImageClick}
      title={isAdminMode ? `Clic para cambiar imagen (${categoria})` : alt}
    />
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