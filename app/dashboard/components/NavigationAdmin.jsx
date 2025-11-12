'use client';

import { useState, useEffect } from 'react';
import { menuService } from '@/lib/adminService';
import { 
  Menu, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  MoveUp, 
  MoveDown, 
  Eye, 
  EyeOff,
  Copy,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

/**
 * Componente para administrar el menú de navegación del sitio
 * - Ver todos los items
 * - Crear, editar, eliminar items
 * - Reordenar con botones arriba/abajo
 * - Toggle activo/inactivo
 * - Soporte para submenús (parent_id)
 */
const NavigationAdmin = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    url: '',
    descripcion: '',
    icono: '',
    parent_id: null,
    externo: false,
    visible_mobile: true,
    visible_desktop: true,
    activo: true
  });

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await menuService.getAll();
      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      console.error('Error cargando menú:', error);
      setMessage({ type: 'error', text: 'Error al cargar el menú' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        label: item.label,
        url: item.url,
        descripcion: item.descripcion || '',
        icono: item.icono || '',
        parent_id: item.parent_id || null,
        externo: item.externo || false,
        visible_mobile: item.visible_mobile ?? true,
        visible_desktop: item.visible_desktop ?? true,
        activo: item.activo ?? true
      });
    } else {
      setEditingItem(null);
      setFormData({
        label: '',
        url: '',
        descripcion: '',
        icono: '',
        parent_id: null,
        externo: false,
        visible_mobile: true,
        visible_desktop: true,
        activo: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSaveItem = async () => {
    try {
      setSaving(true);
      
      // Determinar el orden para el nuevo item
      let orden = menuItems.length + 1;
      if (!editingItem) {
        const maxOrden = Math.max(...menuItems.map(m => m.orden), 0);
        orden = maxOrden + 1;
      }

      const itemData = {
        ...formData,
        orden: editingItem ? editingItem.orden : orden
      };

      let result;
      if (editingItem) {
        result = await menuService.update(editingItem.id, itemData);
      } else {
        result = await menuService.create(itemData);
      }

      if (result.error) throw result.error;

      setMessage({ 
        type: 'success', 
        text: editingItem ? 'Item actualizado correctamente' : 'Item creado correctamente' 
      });
      handleCloseModal();
      await loadMenuItems();

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error guardando item:', error);
      setMessage({ type: 'error', text: 'Error al guardar el item' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!confirm('¿Eliminar este item del menú? Esta acción no se puede deshacer.')) return;

    try {
      const { error } = await menuService.delete(id);
      if (error) throw error;

      setMessage({ type: 'success', text: 'Item eliminado correctamente' });
      await loadMenuItems();

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error eliminando item:', error);
      setMessage({ type: 'error', text: 'Error al eliminar el item' });
    }
  };

  const handleToggleActive = async (id, currentActivo) => {
    try {
      const { error } = await menuService.toggleActive(id, !currentActivo);
      if (error) throw error;

      setMessage({ 
        type: 'success', 
        text: currentActivo ? 'Item desactivado' : 'Item activado' 
      });
      await loadMenuItems();

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error cambiando estado:', error);
      setMessage({ type: 'error', text: 'Error al cambiar estado' });
    }
  };

  const handleMoveUp = async (item) => {
    const currentIndex = menuItems.findIndex(m => m.id === item.id);
    if (currentIndex === 0) return;

    const newItems = [...menuItems];
    [newItems[currentIndex - 1], newItems[currentIndex]] = [newItems[currentIndex], newItems[currentIndex - 1]];

    setMenuItems(newItems);
    await menuService.reorder(newItems);
  };

  const handleMoveDown = async (item) => {
    const currentIndex = menuItems.findIndex(m => m.id === item.id);
    if (currentIndex === menuItems.length - 1) return;

    const newItems = [...menuItems];
    [newItems[currentIndex + 1], newItems[currentIndex]] = [newItems[currentIndex], newItems[currentIndex + 1]];

    setMenuItems(newItems);
    await menuService.reorder(newItems);
  };

  const handleDuplicate = async (id) => {
    try {
      const { error } = await menuService.duplicate(id);
      if (error) throw error;

      setMessage({ type: 'success', text: 'Item duplicado correctamente' });
      await loadMenuItems();

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error duplicando item:', error);
      setMessage({ type: 'error', text: 'Error al duplicar el item' });
    }
  };

  const rootItems = menuItems.filter(item => !item.parent_id);
  const getChildren = (parentId) => menuItems.filter(item => item.parent_id === parentId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#ffee00]" />
        <span className="ml-2 text-gray-300">Cargando menú...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ffee00] rounded-lg flex items-center justify-center">
            <Menu className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Gestión de Navegación</h2>
            <p className="text-gray-400">Administra los items del menú principal</p>
          </div>
        </div>
        
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[#ffee00] hover:bg-[#e6d000] text-black font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Agregar Item
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`flex items-center gap-2 p-3 rounded-lg ${
          message.type === 'success' ? 'bg-green-900/50 border border-green-700 text-green-300' :
          'bg-red-900/50 border border-red-700 text-red-300'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {/* Lista de Items */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <div className="space-y-2">
          {rootItems.map((item, index) => (
            <div key={item.id}>
              {/* Item Principal */}
              <div className={`flex items-center justify-between p-4 rounded-lg border ${
                item.activo 
                  ? 'bg-gray-800 border-gray-600' 
                  : 'bg-gray-800/50 border-gray-700 opacity-60'
              }`}>
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleMoveUp(item)}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(item)}
                      disabled={index === rootItems.length - 1}
                      className="text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{item.label}</span>
                      {item.externo && <ExternalLink className="w-3 h-3 text-gray-400" />}
                    </div>
                    <div className="text-sm text-gray-400">{item.url}</div>
                    {item.descripcion && (
                      <div className="text-xs text-gray-500 mt-1">{item.descripcion}</div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActive(item.id, item.activo)}
                      className={`p-2 rounded ${
                        item.activo 
                          ? 'text-green-400 hover:bg-green-900/30' 
                          : 'text-gray-500 hover:bg-gray-700'
                      }`}
                      title={item.activo ? 'Desactivar' : 'Activar'}
                    >
                      {item.activo ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDuplicate(item.id)}
                      className="p-2 text-blue-400 hover:bg-blue-900/30 rounded"
                      title="Duplicar"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="p-2 text-yellow-400 hover:bg-yellow-900/30 rounded"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-red-400 hover:bg-red-900/30 rounded"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Subitems */}
              {getChildren(item.id).map(child => (
                <div key={child.id} className="ml-12 mt-2">
                  <div className={`flex items-center justify-between p-3 rounded-lg border ${
                    child.activo 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-700/50 border-gray-600 opacity-60'
                  }`}>
                    <div className="flex items-center gap-2 flex-1">
                      <div className="text-gray-500">└─</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white text-sm">{child.label}</span>
                          {child.externo && <ExternalLink className="w-3 h-3 text-gray-400" />}
                        </div>
                        <div className="text-xs text-gray-400">{child.url}</div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleActive(child.id, child.activo)}
                          className={`p-1 rounded ${
                            child.activo 
                              ? 'text-green-400 hover:bg-green-900/30' 
                              : 'text-gray-500 hover:bg-gray-700'
                          }`}
                        >
                          {child.activo ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={() => handleOpenModal(child)}
                          className="p-1 text-yellow-400 hover:bg-yellow-900/30 rounded"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(child.id)}
                          className="p-1 text-red-400 hover:bg-red-900/30 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {rootItems.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No hay items en el menú. Agrega el primero.
            </div>
          )}
        </div>
      </div>

      {/* Modal Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Editar Item' : 'Nuevo Item'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Texto del Menú *</label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    placeholder="Ej: Inicio"
                    required
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-300 mb-2">URL *</label>
                  <input
                    type="text"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    placeholder="Ej: /inicio o https://..."
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Descripción (tooltip)</label>
                <input
                  type="text"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  placeholder="Descripción opcional"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Ícono (lucide-react)</label>
                  <input
                    type="text"
                    value={formData.icono}
                    onChange={(e) => setFormData({ ...formData, icono: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    placeholder="Ej: Home, User, Settings"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Item Padre (submenú)</label>
                  <select
                    value={formData.parent_id || ''}
                    onChange={(e) => setFormData({ ...formData, parent_id: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="">Sin padre (raíz)</option>
                    {rootItems.filter(item => !editingItem || item.id !== editingItem.id).map(item => (
                      <option key={item.id} value={item.id}>{item.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.externo}
                    onChange={(e) => setFormData({ ...formData, externo: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-300">Enlace externo (nueva pestaña)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.activo}
                    onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-300">Activo</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.visible_mobile}
                    onChange={(e) => setFormData({ ...formData, visible_mobile: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-300">Visible en móvil</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.visible_desktop}
                    onChange={(e) => setFormData({ ...formData, visible_desktop: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-300">Visible en desktop</span>
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveItem}
                  disabled={saving || !formData.label || !formData.url}
                  className="flex-1 px-4 py-2 bg-[#ffee00] text-black font-semibold rounded-lg hover:bg-[#e6d000] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingItem ? 'Actualizar' : 'Crear'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationAdmin;
