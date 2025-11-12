'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  pagesService, 
  pageSectionsService, 
  sectionTemplatesService 
} from '@/lib/adminService';
import SectionEditorVisual from '@/app/dashboard/components/SectionEditorVisual';
import {
  ArrowLeft,
  Plus,
  Save,
  Eye,
  Loader2,
  GripVertical,
  Trash2,
  Edit,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

const PageBuilder = () => {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id;

  const [page, setPage] = useState(null);
  const [sections, setSections] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  const loadPageData = useCallback(async () => {
    try {
      console.log('[PageBuilder] Iniciando carga. PageID:', pageId);
      setLoading(true);
      
      // Cargar página por ID
      console.log('[PageBuilder] Cargando página por ID...');
      const { data: pageData, error: pageError } = await pagesService.getById(pageId);
      console.log('[PageBuilder] Página cargada:', { pageData, pageError });
      if (pageError) throw pageError;
      setPage(pageData);

      // Cargar secciones de la página
      console.log('[PageBuilder] Cargando secciones para page_id:', pageData?.id);
      const { data: sectionsData, error: sectionsError } = await pageSectionsService.getByPageId(pageData?.id);
      console.log('[PageBuilder] Secciones cargadas:', { sectionsData, sectionsError });
      if (sectionsError) throw sectionsError;
      setSections(sectionsData || []);

      // Cargar plantillas disponibles
      console.log('[PageBuilder] Cargando plantillas...');
      const { data: templatesData, error: templatesError } = await sectionTemplatesService.getAll();
      console.log('[PageBuilder] Plantillas cargadas:', { templatesData, templatesError });
      if (templatesError) throw templatesError;
      setTemplates(templatesData || []);

    } catch (error) {
      console.error('[PageBuilder] Error cargando datos:', error);
      setMessage({ type: 'error', text: 'Error al cargar la página' });
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  const handleAddSection = async (template) => {
    try {
      const newSection = {
        page_id: pageId,
        tipo_seccion: template.tipo,
        orden: sections.length + 1,
        configuracion: template.schema || {},
        activa: true
      };

      const { data, error } = await pageSectionsService.create(newSection);
      if (error) throw error;

      setSections([...sections, data]);
      setShowTemplateLibrary(false);
      setMessage({ type: 'success', text: 'Sección agregada correctamente' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error agregando sección:', error);
      setMessage({ type: 'error', text: 'Error al agregar la sección' });
    }
  };

  const handleUpdateSection = async (sectionId, updatedConfig) => {
    try {
      const { error } = await pageSectionsService.update(sectionId, {
        configuracion: updatedConfig
      });
      if (error) throw error;

      setSections(sections.map(s => 
        s.id === sectionId ? { ...s, configuracion: updatedConfig } : s
      ));
      setEditingSection(null);
      setMessage({ type: 'success', text: 'Sección actualizada correctamente' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error actualizando sección:', error);
      setMessage({ type: 'error', text: 'Error al actualizar la sección' });
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!confirm('¿Estás seguro de eliminar esta sección?')) return;

    try {
      const { error } = await pageSectionsService.delete(sectionId);
      if (error) throw error;

      setSections(sections.filter(s => s.id !== sectionId));
      setMessage({ type: 'success', text: 'Sección eliminada correctamente' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error eliminando sección:', error);
      setMessage({ type: 'error', text: 'Error al eliminar la sección' });
    }
  };

  const handleMoveSection = async (index, direction) => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    // Swap sections
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    
    // Update orden
    const updatedSections = newSections.map((section, idx) => ({
      ...section,
      orden: idx + 1
    }));

    setSections(updatedSections);

    // Save order to database
    try {
      const orderedIds = updatedSections.map(s => s.id);
      const { error } = await pageSectionsService.reorder(pageId, orderedIds);
      if (error) throw error;
    } catch (error) {
      console.error('Error reordenando secciones:', error);
      setMessage({ type: 'error', text: 'Error al reordenar secciones' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#ffee00]" />
        <span className="ml-2 text-gray-300">Cargando página...</span>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-300">Página no encontrada</p>
        <Link href="/dashboard" className="text-[#ffee00] hover:underline mt-4 inline-block">
          Volver al Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-white">{page.titulo}</h2>
            <p className="text-gray-400">Editor de Contenido</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/${page.slug}`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition"
          >
            <Eye className="w-4 h-4" />
            Vista Previa
          </Link>
          <button
            onClick={() => setShowTemplateLibrary(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#ffee00] text-black font-semibold rounded-lg hover:bg-[#e6d000] transition"
          >
            <Plus className="w-4 h-4" />
            Agregar Sección
          </button>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`flex items-center gap-2 p-3 rounded-lg ${
          message.type === 'success' ? 'bg-green-900/50 border border-green-700 text-green-300' :
          'bg-red-900/50 border border-red-700 text-red-300'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      {/* Sections */}
      <div className="space-y-4">
        {sections.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center">
            <p className="text-gray-400 mb-4">Esta página no tiene secciones todavía</p>
            <button
              onClick={() => setShowTemplateLibrary(true)}
              className="px-4 py-2 bg-[#ffee00] text-black font-semibold rounded-lg hover:bg-[#e6d000] transition"
            >
              Agregar Primera Sección
            </button>
          </div>
        ) : (
          sections.map((section, index) => (
            <div
              key={section.id}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <GripVertical className="w-5 h-5 text-gray-500 cursor-move" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">
                        {section.tipo_seccion === 'hero' && '🎯 Hero / Cabecera'}
                        {section.tipo_seccion === 'card-grid' && '📦 Cuadrícula de Tarjetas'}
                        {section.tipo_seccion === 'text-image' && '📝 Texto + Imagen'}
                        {section.tipo_seccion === 'cta' && '🎯 Llamado a la Acción'}
                        {section.tipo_seccion === 'gallery' && '🖼️ Galería de Imágenes'}
                        {!['hero', 'card-grid', 'text-image', 'cta', 'gallery'].includes(section.tipo_seccion) && section.tipo_seccion}
                      </span>
                      <span className="text-xs text-gray-400">#{section.orden}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {section.configuracion?.titulo || section.configuracion?.descripcion || 'Sin título'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleMoveSection(index, 'up')}
                    disabled={index === 0}
                    className="p-2 rounded hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    title="Mover arriba"
                  >
                    <ChevronUp className="w-4 h-4 text-gray-300" />
                  </button>
                  <button
                    onClick={() => handleMoveSection(index, 'down')}
                    disabled={index === sections.length - 1}
                    className="p-2 rounded hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    title="Mover abajo"
                  >
                    <ChevronDown className="w-4 h-4 text-gray-300" />
                  </button>
                  <button
                    onClick={() => setEditingSection(section)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition flex items-center gap-2"
                    title="Editar contenido"
                  >
                    <Edit className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-medium">Editar</span>
                  </button>
                  <button
                    onClick={() => handleDeleteSection(section.id)}
                    className="p-2 rounded hover:bg-red-900/50 transition"
                    title="Eliminar sección"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Template Library Modal */}
      {showTemplateLibrary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full border border-gray-700 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Biblioteca de Secciones</h3>
              <button
                onClick={() => setShowTemplateLibrary(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-[#ffee00] transition cursor-pointer"
                  onClick={() => handleAddSection(template)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-white">{template.nombre}</h4>
                      <p className="text-xs text-gray-400 mt-1">{template.categoria}</p>
                    </div>
                    <Plus className="w-5 h-5 text-[#ffee00]" />
                  </div>
                  <p className="text-sm text-gray-400">{template.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section Editor Modal */}
      {editingSection && (
        <SectionEditorVisual
          section={editingSection}
          onSave={(updatedConfig) => handleUpdateSection(editingSection.id, updatedConfig)}
          onCancel={() => setEditingSection(null)}
        />
      )}
    </div>
  );
};

export default PageBuilder;
