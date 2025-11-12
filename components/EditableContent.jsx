'use client';

import { useState, useEffect } from 'react';
import { useAdminMode } from '@/contexts/AdminModeContext';
import { editableContentService } from '@/lib/adminService';
import { Edit2, Save, X, Loader2 } from 'lucide-react';

/**
 * Componente para hacer elementos editables in-place usando editable_content
 * Simplificado y ligero - solo carga cuando se hace clic en editar
 * 
 * @param {string} pageKey - Identificador de la página
 * @param {string} fieldKey - Identificador del campo
 * @param {string} fieldType - Tipo: text, textarea, image, url
 * @param {string} defaultValue - Valor por defecto
 * @param {string} as - Elemento HTML (span, h1, h2, p, a, img)
 * @param {string} className - Clases CSS
 */
const EditableContent = ({ 
  pageKey, 
  fieldKey, 
  fieldType = 'text',
  defaultValue = '', 
  as: Component = 'span',
  className = '',
  children,
  ...props 
}) => {
  const { isAdminMode } = useAdminMode();
  const [value, setValue] = useState(defaultValue);
  const [editedValue, setEditedValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fieldId, setFieldId] = useState(null);

  // Cargar valor desde DB al montar el componente
  useEffect(() => {
    let isMounted = true;
    
    const loadValue = async () => {
      try {
        const { data, error } = await editableContentService.getPageContent(pageKey);
        
        if (!isMounted) return;
        
        if (error) throw error;
        
        if (data) {
          const field = data.find(f => f.field_key === fieldKey);
          if (field) {
            setValue(field.field_value || defaultValue);
            setFieldId(field.id);
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
  }, [pageKey, fieldKey, defaultValue]);

  const handleEdit = () => {
    setEditedValue(value);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!fieldId) {
      alert('Error: No se pudo obtener el ID del campo. Recarga la página.');
      return;
    }

    try {
      setSaving(true);
      
      const { data, error } = await editableContentService.updateField(fieldId, editedValue);
      
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

  // Modo edición activo
  if (isEditing) {
    return (
      <div className="relative inline-block w-full min-w-[200px]">
        {fieldType === 'textarea' ? (
          <textarea
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            className="w-full bg-gray-800 border-2 border-[#ffee00] rounded px-3 py-2 text-white text-sm"
            rows={3}
            autoFocus
          />
        ) : fieldType === 'image' ? (
          <div className="space-y-2">
            <input
              type="text"
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              className="w-full bg-gray-800 border-2 border-[#ffee00] rounded px-3 py-2 text-white text-sm"
              placeholder="URL de la imagen"
              autoFocus
            />
          </div>
        ) : (
          <input
            type={fieldType === 'url' ? 'url' : 'text'}
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            className="w-full bg-gray-800 border-2 border-[#ffee00] rounded px-3 py-2 text-white text-sm"
            autoFocus
          />
        )}
        
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium"
          >
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            Guardar
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs font-medium"
          >
            <X className="w-3 h-3" />
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  // Vista normal (usuario no admin O modo admin desactivado)
  if (!isAdminMode) {
    const displayValue = loaded ? value : (children || defaultValue);
    
    if (fieldType === 'image' && Component === 'img') {
      return <Component src={displayValue} className={className} {...props} />;
    }
    if (Component === 'a') {
      return <Component href={displayValue} className={className} {...props}>{children}</Component>;
    }
    return <Component className={className} {...props}>{displayValue}</Component>;
  }

  // Vista admin con botón editar (SIEMPRE visible si modo admin está activo)
  const displayValue = loaded ? value : (children || defaultValue);
  
  return (
    <div className="group relative inline-block">
      {fieldType === 'image' && Component === 'img' ? (
        <Component src={displayValue} className={className} {...props} />
      ) : Component === 'a' ? (
        <Component href={displayValue} className={className} {...props}>
          {children}
        </Component>
      ) : (
        <Component className={className} {...props}>
          {displayValue}
        </Component>
      )}
      
      <button
        onClick={handleEdit}
        className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#ffee00] text-black p-1 rounded-full shadow-lg hover:scale-110 z-10"
        title="Editar"
      >
        <Edit2 className="w-3 h-3" />
      </button>
    </div>
  );
};

export default EditableContent;
