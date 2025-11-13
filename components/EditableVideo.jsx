'use client';

import { useState, useEffect } from 'react';
import { useAdminMode } from '@/contexts/AdminModeContext';
import { localContentService } from '@/lib/localContentService';
import { Edit2, Upload, Loader2, Save, X } from 'lucide-react';

/**
 * Componente para editar video con opción de subir archivo
 */
const EditableVideo = ({ 
  pageKey, 
  fieldKey, 
  defaultValue = '/videofutbol.mp4',
  onSave
}) => {
  const { isAdminMode } = useAdminMode();
  const [value, setValue] = useState(defaultValue);
  const [editedValue, setEditedValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Cargar valor desde archivo JSON
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
          setValue(data[fieldKey]);
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
  }, [pageKey, fieldKey]);

  const handleEdit = () => {
    setEditedValue(value);
    setIsEditing(true);
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    try {
      setUploading(true);

      // Subir video a /public/uploads/videos/
      const { data, error } = await localContentService.uploadFile(file, 'videos');
      
      if (error) throw error;

      // Actualizar el campo en el archivo JSON
      const { error: updateError } = await localContentService.updateField(pageKey, fieldKey, data.url);
      
      if (updateError) throw updateError;

      setValue(data.url);
      setEditedValue(data.url);
      setIsEditing(false);
      
      // Callback para recargar video
      if (onSave && typeof onSave === 'function') {
        onSave(data.url);
      }
      
    } catch (error) {
      console.error('Error subiendo video:', error);
      alert('Error al subir el video. Intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const { data, error } = await localContentService.updateField(pageKey, fieldKey, editedValue);
      
      if (error) throw error;
      
      setValue(editedValue);
      setIsEditing(false);
      
      // Callback para recargar video
      if (onSave && typeof onSave === 'function') {
        onSave(editedValue);
      }
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
      <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h3 className="text-white text-xl font-bold mb-4">Editar Video de Fondo</h3>
          
          {/* Zona de drag and drop para subir video */}
          <div className="border-2 border-dashed border-gray-600 hover:border-yellow-400/50 rounded-lg p-8 text-center mb-4 transition-colors">
            {uploading ? (
              <div className="flex flex-col items-center gap-2 text-white">
                <Loader2 className="w-12 h-12 animate-spin" />
                <p>Subiendo video...</p>
                <p className="text-sm text-gray-400">Esto puede tomar unos momentos</p>
              </div>
            ) : (
              <>
                <Upload className="w-16 h-16 mx-auto mb-3 text-gray-400" />
                <p className="text-white mb-2">Selecciona un video</p>
                <p className="text-gray-400 text-sm mb-3">MP4 recomendado (máx 50MB)</p>
                <label className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded cursor-pointer font-semibold">
                  Seleccionar Video
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </>
            )}
          </div>

          {/* Separador */}
          <div className="flex items-center gap-2 my-4">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="text-gray-400 text-sm">o ingresar URL</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

          {/* Input manual de URL */}
          <div className="mb-4">
            <label className="block text-white text-sm mb-2">URL del Video:</label>
            <input
              type="text"
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded border border-gray-600 focus:border-yellow-400 focus:outline-none"
              placeholder="/ruta/video.mp4 o https://..."
              disabled={uploading}
            />
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving || uploading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-3 rounded flex items-center justify-center gap-2 font-semibold"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {saving ? 'Guardando...' : 'Guardar URL'}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving || uploading}
              className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white px-4 py-3 rounded flex items-center justify-center gap-2 font-semibold"
            >
              <X className="w-5 h-5" />
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vista normal en modo admin
  if (isAdminMode) {
    return (
      <button
        onClick={handleEdit}
        className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded text-sm font-semibold flex items-center gap-2 shadow-lg transition-colors"
        title="Editar video de fondo"
      >
        <Edit2 className="w-4 h-4" />
        Video: {value}
      </button>
    );
  }

  // Vista normal (no visible)
  return null;
};

export default EditableVideo;
