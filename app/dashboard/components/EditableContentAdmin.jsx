'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { editableContentService } from '@/lib/adminService';
import { 
  FileText, 
  Save, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  Image as ImageIcon,
  Video,
  Link as LinkIcon,
  Type,
  Hash,
  Plus,
  Trash2,
  Eye,
  Upload
} from 'lucide-react';

/**
 * Componente para administrar contenido editable de páginas
 * - Home (logo, video, textos)
 * - Páginas de arriendo (imágenes, características, textos)
 */
const EditableContentAdmin = () => {
  const [contentByPage, setContentByPage] = useState({});
  const [selectedPage, setSelectedPage] = useState('home');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editedValues, setEditedValues] = useState({});

  const pageLabels = {
    'home': 'Página Principal (Home)',
    'arriendo_futbol7': 'Arriendo Fútbol 7',
    'arriendo_futbol9': 'Arriendo Fútbol 9',
    'arriendo_pickleball-individual': 'Arriendo Pickleball Individual',
    'arriendo_pickleball-dobles': 'Arriendo Pickleball Dobles',
    'footer': 'Footer (Pie de página)',
    'component_benefits': 'Componente: Beneficios',
    'component_cta': 'Componente: Call to Action',
    'component_programs': 'Componente: Programas'
  };

  const fieldTypeIcons = {
    'text': Type,
    'textarea': FileText,
    'image': ImageIcon,
    'video': Video,
    'url': LinkIcon,
    'number': Hash
  };

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await editableContentService.getContentGroupedByPage();
      if (error) throw error;
      setContentByPage(data || {});
    } catch (error) {
      console.error('Error cargando contenido:', error);
      setMessage({ type: 'error', text: 'Error al cargar el contenido' });
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (fieldId, newValue) => {
    setEditedValues(prev => ({
      ...prev,
      [fieldId]: newValue
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Agrupar cambios por página
      const changesByPage = {};
      Object.entries(editedValues).forEach(([fieldId, value]) => {
        const field = Object.values(contentByPage)
          .flat()
          .find(f => f.id === parseInt(fieldId));
        
        if (field) {
          if (!changesByPage[field.page_key]) {
            changesByPage[field.page_key] = {};
          }
          changesByPage[field.page_key][field.field_key] = value;
        }
      });

      // Guardar cambios por página
      for (const [pageKey, updates] of Object.entries(changesByPage)) {
        const { error } = await editableContentService.updatePageContent(pageKey, updates);
        if (error) throw error;
      }

      setMessage({ type: 'success', text: 'Contenido actualizado correctamente' });
      setEditedValues({});
      await loadContent();

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error guardando contenido:', error);
      setMessage({ type: 'error', text: 'Error al guardar los cambios' });
    } finally {
      setSaving(false);
    }
  };

  const renderField = (field) => {
    const Icon = fieldTypeIcons[field.field_type] || Type;
    const currentValue = editedValues[field.id] ?? field.field_value;

    return (
      <div key={field.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
            <Icon className="w-4 h-4 text-gray-300" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-white mb-1">
              {field.field_label}
            </label>
            {field.help_text && (
              <p className="text-xs text-gray-400 mb-2">{field.help_text}</p>
            )}

            {/* Text */}
            {field.field_type === 'text' && (
              <input
                type="text"
                value={currentValue || ''}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                placeholder={field.field_label}
              />
            )}

            {/* Textarea */}
            {field.field_type === 'textarea' && (
              <textarea
                value={currentValue || ''}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                rows={3}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                placeholder={field.field_label}
              />
            )}

            {/* URL */}
            {field.field_type === 'url' && (
              <div className="space-y-2">
                <input
                  type="url"
                  value={currentValue || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                  placeholder="https://..."
                />
                {currentValue && (
                  <a
                    href={currentValue}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                  >
                    <Eye className="w-3 h-3" />
                    Ver enlace
                  </a>
                )}
              </div>
            )}

            {/* Image */}
            {field.field_type === 'image' && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={currentValue || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                  placeholder="/images/..."
                />
                {currentValue && (
                  <div className="relative w-full h-32 bg-gray-800 rounded-lg overflow-hidden">
                    <Image
                      src={currentValue}
                      alt={field.field_label}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover"
                      onError={(e) => {
                        e.target.src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  💡 Sube la imagen al servidor y pega la ruta aquí, o usa la pestaña "Imágenes"
                </p>
              </div>
            )}

            {/* Video */}
            {field.field_type === 'video' && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={currentValue || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                  placeholder="/videos/..."
                />
                <p className="text-xs text-gray-500">
                  💡 Formatos recomendados: MP4, WebM. Máx 10MB
                </p>
              </div>
            )}

            {/* Number */}
            {field.field_type === 'number' && (
              <input
                type="number"
                value={currentValue || ''}
                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                placeholder={field.field_label}
              />
            )}

            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>Campo: {field.field_key}</span>
              {field.is_required && (
                <span className="text-red-400">* Obligatorio</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const currentPageContent = contentByPage[selectedPage] || [];
  const groupedBySection = currentPageContent.reduce((acc, field) => {
    const group = field.field_group || 'general';
    if (!acc[group]) acc[group] = [];
    acc[group].push(field);
    return acc;
  }, {});

  const hasChanges = Object.keys(editedValues).length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#ffee00]" />
        <span className="ml-2 text-gray-300">Cargando contenido...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ffee00] rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Contenido Editable</h2>
            <p className="text-gray-400">Administra textos, imágenes y videos de las páginas</p>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="flex items-center gap-2 px-4 py-2 bg-[#ffee00] hover:bg-[#e6d000] text-black font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Guardando...' : hasChanges ? 'Guardar Cambios' : 'Sin Cambios'}
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

      {/* Selector de Página */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <label className="block text-sm font-medium text-gray-300 mb-3">Seleccionar Página:</label>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {Object.keys(contentByPage).map(pageKey => (
            <button
              key={pageKey}
              onClick={() => setSelectedPage(pageKey)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedPage === pageKey
                  ? 'bg-[#ffee00] text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {pageLabels[pageKey] || pageKey}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido por Secciones */}
      {currentPageContent.length === 0 ? (
        <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 text-center">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No hay contenido editable para esta página</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedBySection).map(([sectionName, fields]) => (
            <div key={sectionName} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4 capitalize flex items-center gap-2">
                <span className="w-2 h-2 bg-[#ffee00] rounded-full"></span>
                {sectionName === 'general' ? 'General' : 
                 sectionName === 'hero' ? 'Sección Hero' :
                 sectionName === 'brand' ? 'Marca' :
                 sectionName === 'benefits' ? 'Beneficios' :
                 sectionName === 'features' ? 'Características' :
                 sectionName === 'contact' ? 'Contacto' :
                 sectionName === 'social' ? 'Redes Sociales' :
                 sectionName === 'cta' ? 'Llamado a la Acción' :
                 sectionName === 'info' ? 'Información' :
                 sectionName}
              </h3>
              <div className="grid gap-4">
                {fields.map(field => renderField(field))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ayuda */}
      <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-300">
            <p className="font-semibold mb-1">💡 Consejos:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-200">
              <li>Los cambios se guardan al hacer clic en "Guardar Cambios"</li>
              <li>Para imágenes y videos, primero súbelos al servidor usando la pestaña "Imágenes"</li>
              <li>Las URLs deben comenzar con http:// o https://</li>
              <li>Los campos marcados con * son obligatorios</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditableContentAdmin;
