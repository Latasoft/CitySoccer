'use client';

import { useState } from 'react';
import { useEditMode } from '@/contexts/EditModeContext';
import { Edit, X, Save, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const EditableElement = ({ 
  type = 'text', // 'text', 'image', 'button'
  value, 
  onSave, 
  className = '',
  children,
  field = '',
  placeholder = ''
}) => {
  const { isEditMode } = useEditMode();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');
  const [imageUrl, setImageUrl] = useState(value || '');
  const [uploading, setUploading] = useState(false);

  if (!isEditMode) {
    return <>{children}</>;
  }

  const handleSave = async () => {
    await onSave(type === 'image' ? imageUrl : editValue, field);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value || '');
    setImageUrl(value || '');
    setIsEditing(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar los 5MB');
      return;
    }

    setUploading(true);
    try {
      // Generar nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `cms/${fileName}`;

      // Subir a Supabase Storage
      const { data, error } = await supabase.storage
        .from('imagenes')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('imagenes')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      alert('Error al subir la imagen. Por favor intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative group">
      {/* Elemento original con overlay de edición */}
      <div className={`${isEditMode ? 'outline-dashed outline-2 outline-blue-400/50 hover:outline-blue-500' : ''} ${className}`}>
        {children}
      </div>

      {/* Botón de edición flotante */}
      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
          title={`Editar ${type === 'text' ? 'texto' : type === 'image' ? 'imagen' : 'botón'}`}
        >
          <Edit className="w-4 h-4 text-white" />
        </button>
      )}

      {/* Modal de edición rápida */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-lg w-full border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">
                {type === 'text' && '✏️ Editar Texto'}
                {type === 'image' && '🖼️ Editar Imagen'}
                {type === 'button' && '🔘 Editar Botón'}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {type === 'text' && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
                  {field || 'Contenido'}
                </label>
                {editValue?.length > 100 ? (
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white resize-none"
                    rows="5"
                    placeholder={placeholder}
                  />
                ) : (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    placeholder={placeholder}
                  />
                )}
              </div>
            )}

            {type === 'image' && (
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      URL de la Imagen
                    </label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
                      placeholder="/images/ejemplo.jpg"
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-800 text-gray-400">o</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subir desde tu computador
                  </label>
                  <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-[#ffee00] transition group">
                    <div className="flex items-center gap-2 text-gray-400 group-hover:text-[#ffee00]">
                      <Upload className="w-5 h-5" />
                      <span className="text-sm">
                        {uploading ? 'Subiendo...' : 'Seleccionar imagen'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG, GIF, WebP - Máximo 5MB
                  </p>
                </div>

                {imageUrl && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-400 mb-2">Vista previa:</p>
                    <img 
                      src={imageUrl} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        e.target.src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {type === 'button' && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">
                  Texto del Botón
                </label>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  placeholder="Ej: Reservar Ahora"
                />
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition"
                disabled={uploading}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-[#ffee00] text-black font-semibold rounded-lg hover:bg-[#e6d000] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {uploading ? 'Subiendo...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableElement;
