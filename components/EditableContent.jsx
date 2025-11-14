'use client';

import { useState, useEffect } from 'react';
import { useAdminMode } from '@/contexts/AdminModeContext';
import { useContent } from '@/contexts/ContentContext';
import { Edit2, Save, X, Loader2 } from 'lucide-react';

/**
 * Componente para hacer elementos editables in-place usando editable_content
 * Optimizado con caché compartido - evita múltiples llamadas al API
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
  const { getField, updateField } = useContent();
  
  // Inicializar con defaultValue, el servidor tiene prioridad
  const cacheKey = `content_${pageKey}_${fieldKey}`;
  const [value, setValue] = useState(defaultValue);
  
  const [editedValue, setEditedValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Cargar valor desde caché compartido al montar el componente
  useEffect(() => {
    let isMounted = true;
    
    const loadValue = async () => {
      const debugMode = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';
      
      if (debugMode) {
        console.log(`[EditableContent] 🔄 Cargando ${pageKey}.${fieldKey}...`);
      }
      
      try {
        const { data, error } = await getField(pageKey, fieldKey);
        
        if (!isMounted) {
          if (debugMode) {
            console.log(`[EditableContent] ⚠️ Componente desmontado antes de cargar ${pageKey}.${fieldKey}`);
          }
          return;
        }
        
        if (error) {
          console.error(`[EditableContent] ❌ Error loading ${pageKey}.${fieldKey}:`, error);
          setLoading(false);
          return;
        }
        
        // getField ya devuelve solo el valor del campo
        if (data !== undefined && data !== null) {
          if (debugMode) {
            console.log(`[EditableContent] ✅ Campo encontrado ${pageKey}.${fieldKey}:`, {
              value: typeof data === 'string' ? data.substring(0, 50) + (data.length > 50 ? '...' : '') : data
            });
          }
          setValue(data);
          // Guardar en localStorage como backup
          if (typeof window !== 'undefined') {
            localStorage.setItem(cacheKey, data);
          }
        } else {
          if (debugMode) {
            console.warn(`[EditableContent] ⚠️ Campo NO encontrado: ${pageKey}.${fieldKey} - usando defaultValue`);
          }
          setValue(defaultValue);
        }
      } catch (error) {
        console.error(`[EditableContent] 💥 Exception cargando ${pageKey}.${fieldKey}:`, error);
        setValue(defaultValue);
      } finally {
        if (isMounted) {
          setLoading(false);
          if (debugMode) {
            console.log(`[EditableContent] ✓ Carga completada para ${pageKey}.${fieldKey}`);
          }
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
      const debugMode = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';
      
      if (debugMode) {
        console.log(`\n${'~'.repeat(60)}`);
        console.log(`✏️ GUARDANDO ${pageKey}.${fieldKey}`);
        console.log(`Valor anterior: ${value?.substring?.(0, 100) || value}`);
        console.log(`Valor nuevo: ${editedValue?.substring?.(0, 100) || editedValue}`);
        console.log('~'.repeat(60));
      }
      
      const { data, error } = await updateField(pageKey, fieldKey, editedValue);
      
      if (error) {
        console.error(`[EditableContent] ❌ Error del servicio:`, error);
        throw error;
      }
      
      if (debugMode) {
        console.log(`[EditableContent] ✅ Guardado exitoso:`, data);
      }
      
      setValue(editedValue);
      setIsEditing(false);
      
      // Guardar en localStorage inmediatamente
      if (typeof window !== 'undefined') {
        localStorage.setItem(cacheKey, editedValue);
      }
      
      // CRÍTICO: Invalidar cache del ContentContext para forzar recarga
      // Esto asegura que otros componentes vean el valor actualizado
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('content-updated', { 
          detail: { pageKey, fieldKey, newValue: editedValue } 
        }));
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
      if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') {
        console.log(`[EditableContent] ✓ Proceso de guardado finalizado para ${pageKey}.${fieldKey}`);
      }
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
  
  // Determinar si debemos usar span o div basado en el elemento
  const isInlineElement = ['span', 'a', 'input', 'label'].includes(Component);
  const WrapperComponent = isInlineElement ? 'span' : 'div';
  
  // Para botones, no envolver - solo mostrar el contenido con un indicador visual diferente
  if (Component === 'button') {
    return (
      <>
        <Component 
          className={`${className} ring-2 ring-yellow-400/50 hover:ring-yellow-400 relative`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleEdit();
          }}
          {...props}
        >
          {displayValue}
          <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-yellow-400 text-black text-xs px-1 rounded-full">✏️</span>
        </Component>
      </>
    );
  }
  
  // Para spans dentro de botones o elementos inline, no agregar botón de edición anidado
  // Solo mostrar el contenido con borde visual
  if (Component === 'span') {
    return (
      <Component 
        className={`${className} border-b-2 border-dashed border-yellow-400/50 hover:border-yellow-400 cursor-pointer`}
        onClick={handleEditClick}
        title="Clic para editar"
      >
        {displayValue}
      </Component>
    );
  }
  
  return (
    <WrapperComponent className="group relative inline-block border-2 border-dashed border-yellow-400/30 hover:border-yellow-400/60 transition-all rounded px-1">
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
    </WrapperComponent>
  );
};

export default EditableContent;
