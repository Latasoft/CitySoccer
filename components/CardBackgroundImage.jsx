'use client';

import { useState, useEffect } from 'react';
import { useAdminMode } from '@/contexts/AdminModeContext';
import { localContentService } from '@/lib/localContentService';
import { Edit2, Save, X, Loader2, Upload } from 'lucide-react';

/**
 * Componente especial para imágenes de fondo editables en CardCarousel
 */
const CardBackgroundImage = ({ 
  pageKey, 
  fieldKey, 
  defaultValue,
  className = '',
  showPlaceholder = true
}) => {
  const { isAdminMode } = useAdminMode();
  
  // Inicializar con defaultValue, el servidor tiene prioridad
  const cacheKey = `content_${pageKey}_${fieldKey}`;
  const [value, setValue] = useState(defaultValue);
  
  const [editedValue, setEditedValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fieldId, setFieldId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Cargar valor desde archivo JSON y actualizar localStorage
  useEffect(() => {
    let isMounted = true;
    
    const loadValue = async () => {
      try {
        const { data, error } = await localContentService.getPageContent(pageKey);
        
        if (!isMounted) return;
        
        if (error) {
          console.error(`Error loading ${pageKey}.${fieldKey}:`, error);
          setLoading(false);
          return;
        }
        
        if (data && data[fieldKey] !== undefined) {
          const newValue = data[fieldKey];
          setValue(newValue);
          // Guardar en localStorage como backup
          if (typeof window !== 'undefined') {
            localStorage.setItem(cacheKey, newValue);
          }
        } else {
          // Si no hay valor en servidor, intentar localStorage
          if (typeof window !== 'undefined') {
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
              setValue(cached);
            }
          }
        }
      } catch (error) {
        console.error(`Error cargando ${pageKey}.${fieldKey}:`, error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadValue();
    
    return () => {
      isMounted = false;
    };
  }, [pageKey, fieldKey, defaultValue, cacheKey]);

  const handleEdit = () => {
    setEditedValue(value);
    setIsEditing(true);
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    try {
      setUploading(true);

      // Subir archivo a /public/uploads/carousel/
      const { data, error } = await localContentService.uploadFile(file, 'carousel');
      
      if (error) throw error;

      // Actualizar el campo en el archivo JSON con la nueva URL
      const { error: updateError } = await localContentService.updateField(pageKey, fieldKey, data.url);
      
      if (updateError) throw updateError;

      const newUrl = data.url;
      setValue(newUrl);
      setEditedValue(newUrl);
      setIsEditing(false);
      
      // Guardar en localStorage inmediatamente
      if (typeof window !== 'undefined') {
        localStorage.setItem(cacheKey, newUrl);
      }
      
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      alert('Error al subir la imagen. Intenta de nuevo.');
    } finally {
      setUploading(false);
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

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const { data, error } = await localContentService.updateField(pageKey, fieldKey, editedValue);
      
      if (error) throw error;
      
      setValue(editedValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Error guardando:', error);
      alert(`Error al guardar: ${error.message || 'Error desconocido'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedValue('');
    setIsEditing(false);
  };

  // Modo edición
  if (isEditing) {
    return (
      <div className="absolute inset-0 z-30 bg-black/95 p-4 flex flex-col gap-4 overflow-y-auto">
        {/* Zona de drag and drop para subir imagen */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver 
              ? 'border-yellow-400 bg-yellow-400/10' 
              : 'border-gray-600 hover:border-yellow-400/50'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-white">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p>Subiendo imagen...</p>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-white mb-2">Arrastra una imagen aquí</p>
              <p className="text-gray-400 text-sm mb-3">o</p>
              <label className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded cursor-pointer font-semibold">
                Seleccionar archivo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </>
          )}
        </div>

        {/* Separador */}
        <div className="flex items-center gap-2">
          <div className="flex-1 border-t border-gray-600"></div>
          <span className="text-gray-400 text-sm">o ingresar URL</span>
          <div className="flex-1 border-t border-gray-600"></div>
        </div>

        {/* Input manual de URL */}
        <div className="flex-1">
          <label className="block text-white text-sm mb-2">URL de la Imagen:</label>
          <input
            type="text"
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-yellow-400 focus:outline-none"
            placeholder="/ruta/imagen.jpg o https://..."
            disabled={uploading}
          />
          {editedValue && (
            <div className="mt-2">
              <img 
                src={editedValue} 
                alt="Preview" 
                className="w-full h-32 object-cover rounded"
                onError={(e) => e.target.src = '/Logo2.png'}
              />
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Guardando...' : 'Guardar URL'}
          </button>
          <button
            onClick={handleCancel}
            disabled={saving || uploading}
            className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  const displayValue = loading ? defaultValue : value;
  const hasImage = displayValue && displayValue.trim() !== '';

  // Modo admin - mostrar con botón editar
  if (isAdminMode) {
    return (
      <div className="group relative w-full h-full">
        <div
          className={`${className} ${!hasImage ? 'bg-gray-200 flex items-center justify-center' : ''}`}
          style={hasImage ? { backgroundImage: `url(${displayValue})` } : {}}
        >
          {!hasImage && (
            <svg className="w-1/4 h-1/4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </div>
        <div className="absolute inset-0 border-2 border-dashed border-yellow-400/0 group-hover:border-yellow-400/60 transition-all pointer-events-none" />
        <button
          onClick={handleEdit}
          className="absolute top-2 right-2 bg-yellow-400 hover:bg-yellow-500 text-black p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
          title="Editar imagen de fondo"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Vista normal
  return (
    <div
      className={`${className} ${!hasImage ? 'bg-gray-200 flex items-center justify-center' : ''}`}
      style={hasImage ? { backgroundImage: `url(${displayValue})` } : {}}
    >
      {!hasImage && (
        <svg className="w-1/4 h-1/4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )}
    </div>
  );
};

export default CardBackgroundImage;
