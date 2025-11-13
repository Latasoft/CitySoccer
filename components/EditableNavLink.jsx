'use client';

import { useState, useEffect } from 'react';
import { useAdminMode } from '@/contexts/AdminModeContext';
import { localContentService } from '@/lib/localContentService';
import { Edit2, Save, X } from 'lucide-react';

/**
 * Componente para hacer texto de links editables sin cambiar el href
 * Solo permite editar el texto mostrado, no el código HTML
 */
const EditableNavLink = ({ 
  itemId,
  defaultText,
  className = '',
  onClick,
  children,
  ...props 
}) => {
  const { isAdminMode } = useAdminMode();
  const [text, setText] = useState(defaultText);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Cargar texto desde navigation.json
  useEffect(() => {
    const loadText = async () => {
      try {
        const { data } = await localContentService.getPageContent('navigation');
        
        if (data && data.menu_items) {
          // Buscar el item por ID en el array plano o en submenus
          const findItem = (items) => {
            for (const item of items) {
              if (item.id === itemId) return item;
              if (item.submenu) {
                const found = findItem(item.submenu);
                if (found) return found;
              }
            }
            return null;
          };
          
          const item = findItem(data.menu_items);
          if (item && item.text) {
            setText(item.text);
          }
        }
      } catch (error) {
        console.error('Error cargando texto nav:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadText();
  }, [itemId]);

  const handleEdit = (e) => {
    if (!isAdminMode) return;
    e.preventDefault();
    e.stopPropagation();
    setEditedText(text);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Leer todo el navigation.json
      const { data } = await localContentService.getPageContent('navigation');
      
      if (!data || !data.menu_items) {
        throw new Error('No se pudo cargar el menú');
      }
      
      // Actualizar el texto del item específico
      const updateItem = (items) => {
        return items.map(item => {
          if (item.id === itemId) {
            return { ...item, text: editedText };
          }
          if (item.submenu) {
            return { ...item, submenu: updateItem(item.submenu) };
          }
          return item;
        });
      };
      
      const updatedMenuItems = updateItem(data.menu_items);
      
      // Guardar todo el objeto actualizado
      const response = await fetch('/api/content/navigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menu_items: updatedMenuItems, logo_alt: data.logo_alt })
      });
      
      if (!response.ok) throw new Error('Error al guardar');
      
      setText(editedText);
      setIsEditing(false);
    } catch (error) {
      console.error('Error guardando:', error);
      alert('Error al guardar el texto');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedText('');
    setIsEditing(false);
  };

  // Modal de edición
  if (isEditing) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]" onClick={handleCancel}>
        <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-white text-lg font-bold mb-4">Editar texto del menú</h3>
          
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-yellow-400 focus:outline-none mb-4"
            autoFocus
          />
          
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayText = loading ? defaultText : text;

  // En modo admin, mostrar con indicador editable
  if (isAdminMode) {
    return (
      <span 
        className={`${className} relative group`}
        onDoubleClick={handleEdit}
        title="Doble clic o clic en el lápiz para editar"
        {...props}
      >
        {displayText}
        <button
          onClick={handleEdit}
          className="inline-flex items-center ml-1 opacity-0 group-hover:opacity-100 text-yellow-400 transition-opacity hover:text-yellow-300"
          type="button"
          aria-label="Editar texto"
        >
          <Edit2 className="w-3 h-3" />
        </button>
      </span>
    );
  }

  // Vista normal
  return (
    <span className={className} onClick={onClick} {...props}>
      {displayText}
    </span>
  );
};

export default EditableNavLink;
