'use client';

import { useState, useEffect } from 'react';
import { useAdminMode } from '@/contexts/AdminModeContext';
import { localContentService } from '@/lib/localContentService';
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
 * @param {function} onSave - Callback opcional después de guardar exitosamente
 */
const EditableContent = ({ 
  pageKey, 
  fieldKey, 
  fieldType = 'text',
  defaultValue = '', 
  as: Component = 'span',
  className = '',
  children,
  onSave,
  ...props 
}) => {
  const { isAdminMode } = useAdminMode();
  
  // Inicializar con localStorage si existe
  const cacheKey = `content_${pageKey}_${fieldKey}`;
  const [value, setValue] = useState(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(cacheKey);
      return cached || defaultValue;
    }
    return defaultValue;
  });
  
  const [editedValue, setEditedValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Cargar valor desde archivo JSON al montar el componente
  useEffect(() => {
    let isMounted = true;
    
    const loadValue = async () => {
      console.log(`[EditableContent] 🔄 Cargando ${pageKey}.${fieldKey}...`);
      
      try {
        const { data, error } = await localContentService.getPageContent(pageKey);
        
        if (!isMounted) {
          console.log(`[EditableContent] ⚠️ Componente desmontado antes de cargar ${pageKey}.${fieldKey}`);
          return;
        }
        
        if (error) {
          console.error(`[EditableContent] ❌ Error loading ${pageKey}.${fieldKey}:`, error);
          setLoading(false);
          return;
        }
        
        console.log(`[EditableContent] 📦 Datos recibidos para ${pageKey}:`, {
          totalFields: Object.keys(data || {}).length,
          fields: Object.keys(data || {}),
          buscando: fieldKey
        });
        
        if (data && data[fieldKey] !== undefined) {
          console.log(`[EditableContent] ✅ Campo encontrado ${pageKey}.${fieldKey}:`, {
            value: data[fieldKey]?.substring?.(0, 50) + (data[fieldKey]?.length > 50 ? '...' : '') || data[fieldKey]
          });
          const newValue = data[fieldKey];
          setValue(newValue);
          // Guardar en localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem(cacheKey, newValue);
          }
        } else {
          console.warn(`[EditableContent] ⚠️ Campo NO encontrado: ${pageKey}.${fieldKey} - usando defaultValue`);
        }
      } catch (error) {
        console.error(`[EditableContent] 💥 Exception cargando ${pageKey}.${fieldKey}:`, error);
      } finally {
        if (isMounted) {
          setLoading(false);
          console.log(`[EditableContent] ✓ Carga completada para ${pageKey}.${fieldKey}`);
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

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleEdit();
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log(`\n${'~'.repeat(60)}`);
      console.log(`✏️ GUARDANDO ${pageKey}.${fieldKey}`);
      console.log(`Valor anterior: ${value?.substring?.(0, 100) || value}`);
      console.log(`Valor nuevo: ${editedValue?.substring?.(0, 100) || editedValue}`);
      console.log('~'.repeat(60));
      
      const { data, error } = await localContentService.updateField(pageKey, fieldKey, editedValue);
      
      if (error) {
        console.error(`[EditableContent] ❌ Error del servicio:`, error);
        throw error;
      }
      
      console.log(`[EditableContent] ✅ Guardado exitoso:`, data);
      setValue(editedValue);
      setIsEditing(false);
      
      // Guardar en localStorage inmediatamente
      if (typeof window !== 'undefined') {
        localStorage.setItem(cacheKey, editedValue);
      }
      
      // Llamar callback opcional después de guardar
      if (onSave && typeof onSave === 'function') {
        onSave(editedValue);
      }
    } catch (error) {
      console.error(`[EditableContent] 💥 Error guardando ${pageKey}.${fieldKey}:`, error);
      alert(`Error al guardar: ${error.message || 'Error desconocido'}`);
    } finally {
      setSaving(false);
      console.log(`[EditableContent] ✓ Proceso de guardado finalizado para ${pageKey}.${fieldKey}`);
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
    // Mientras carga, mostrar indicador
    if (loading) {
      // Filtrar children de props para elementos void
      const { children: _, ...restProps } = props;
      
      // Para elementos void (auto-cerrados) no usar children
      if (Component === 'input') {
        return <Component className={className} placeholder="⏳ Cargando..." {...restProps} />;
      }
      if (Component === 'img' || fieldType === 'image') {
        return <Component className={className} alt="Cargando..." {...restProps} />;
      }
      return <Component className={className} {...props}>⏳ Cargando...</Component>;
    }
    
    const displayValue = value || defaultValue;
    
    if (fieldType === 'image' && Component === 'img') {
      const { children: _, ...restProps } = props;
      return <Component src={displayValue} className={className} {...restProps} />;
    }
    if (Component === 'a') {
      // Usar children si existen, sino usar displayValue
      const linkContent = children || displayValue;
      return <Component href={props.href} className={className} {...props}>{linkContent}</Component>;
    }
    if (Component === 'input') {
      const { children: _, ...restProps } = props;
      return <Component className={className} placeholder={displayValue} {...restProps} />;
    }
    return <Component className={className} {...props}>{displayValue}</Component>;
  }

  // Vista admin con botón editar (SIEMPRE visible si modo admin está activo)
  const displayValue = loading ? '⏳ Cargando...' : (value || defaultValue);
  
  // Filtrar children de props para elementos void
  const { children: _, ...propsWithoutChildren } = props;
  
  return (
    <div className="group relative inline-block border-2 border-dashed border-yellow-400/30 hover:border-yellow-400/60 transition-all rounded px-1">
      {fieldType === 'image' && Component === 'img' ? (
        <Component src={displayValue} className={className} {...propsWithoutChildren} />
      ) : Component === 'a' ? (
        <Component 
          href={props.href} 
          className={className} 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          {...props}
        >
          {children || displayValue}
        </Component>
      ) : Component === 'button' ? (
        <Component 
          className={className} 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          {...props}
        >
          {displayValue}
        </Component>
      ) : Component === 'input' ? (
        <Component 
          className={className} 
          placeholder={displayValue}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          {...propsWithoutChildren}
        />
      ) : (
        <Component className={className} {...props}>
          {displayValue}
        </Component>
      )}
      
      <button
        onClick={handleEditClick}
        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#ffee00] text-black p-1.5 rounded-full shadow-lg hover:scale-110 z-10"
        title="Editar"
      >
        <Edit2 className="w-3 h-3" />
      </button>
    </div>
  );
};

export default EditableContent;
