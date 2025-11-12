'use client';

import { useState, useEffect } from 'react';
import { pagesService } from '@/lib/adminService';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  Globe,
  Layout
} from 'lucide-react';
import Link from 'next/link';

const PagesAdmin = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPage, setNewPage] = useState({
    slug: '',
    titulo: '',
    descripcion: '',
    meta_title: '',
    meta_description: '',
    layout_type: 'default'
  });

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      console.log('[PagesAdmin] Iniciando carga de páginas...');
      setLoading(true);
      const { data, error } = await pagesService.getAll();
      console.log('[PagesAdmin] Respuesta getAll:', { data, error });
      if (error) throw error;
      setPages(data || []);
      console.log('[PagesAdmin] Páginas cargadas:', data?.length || 0);
    } catch (error) {
      console.error('[PagesAdmin] Error cargando páginas:', error);
      setMessage({ type: 'error', text: 'Error al cargar las páginas' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = async (e) => {
    e.preventDefault();
    
    try {
      // Generar slug si no existe
      const slug = newPage.slug || newPage.titulo.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      const pageData = {
        ...newPage,
        slug,
        activa: true,
        publicada: false
      };

      const { data, error } = await pagesService.create(pageData);
      if (error) throw error;

      setMessage({ type: 'success', text: `Página "${data.titulo}" creada correctamente` });
      setShowCreateModal(false);
      setNewPage({
        slug: '',
        titulo: '',
        descripcion: '',
        meta_title: '',
        meta_description: '',
        layout_type: 'default'
      });
      loadPages();
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error creando página:', error);
      setMessage({ type: 'error', text: error.message || 'Error al crear la página' });
    }
  };

  const handleTogglePublish = async (page) => {
    try {
      const { error } = await pagesService.togglePublish(page.id, !page.publicada);
      if (error) throw error;

      setMessage({ 
        type: 'success', 
        text: `Página ${!page.publicada ? 'publicada' : 'despublicada'} correctamente` 
      });
      loadPages();
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error publicando página:', error);
      setMessage({ type: 'error', text: 'Error al cambiar estado de publicación' });
    }
  };

  const handleDeletePage = async (page) => {
    if (!confirm(`¿Estás seguro de eliminar la página "${page.titulo}"?`)) return;

    try {
      const { error } = await pagesService.delete(page.id);
      if (error) throw error;

      setMessage({ type: 'success', text: 'Página eliminada correctamente' });
      loadPages();
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error eliminando página:', error);
      setMessage({ type: 'error', text: 'Error al eliminar la página' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#ffee00]" />
        <span className="ml-2 text-gray-300">Cargando páginas...</span>
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
            <h2 className="text-2xl font-bold text-white">Gestión de Páginas</h2>
            <p className="text-gray-400">Crea y administra las páginas de tu sitio web</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#ffee00] text-black font-semibold rounded-lg hover:bg-[#e6d000] transition"
        >
          <Plus className="w-4 h-4" />
          Nueva Página
        </button>
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Páginas</p>
              <p className="text-2xl font-bold text-white">{pages.length}</p>
            </div>
            <Layout className="w-8 h-8 text-[#ffee00]" />
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Publicadas</p>
              <p className="text-2xl font-bold text-white">
                {pages.filter(p => p.publicada).length}
              </p>
            </div>
            <Globe className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Borradores</p>
              <p className="text-2xl font-bold text-white">
                {pages.filter(p => !p.publicada).length}
              </p>
            </div>
            <FileText className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Pages List */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/70">
              <tr>
                <th className="text-left text-gray-300 text-sm font-semibold px-4 py-3">Título</th>
                <th className="text-left text-gray-300 text-sm font-semibold px-4 py-3">Slug</th>
                <th className="text-center text-gray-300 text-sm font-semibold px-4 py-3">Estado</th>
                <th className="text-center text-gray-300 text-sm font-semibold px-4 py-3">Layout</th>
                <th className="text-right text-gray-300 text-sm font-semibold px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pages.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-400">
                    No hay páginas creadas. Crea tu primera página.
                  </td>
                </tr>
              ) : (
                pages.map((page) => (
                  <tr key={page.id} className="border-t border-gray-700/70 hover:bg-gray-700/20 transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-white font-semibold">{page.titulo}</p>
                        {page.descripcion && (
                          <p className="text-gray-400 text-sm mt-1">{page.descripcion}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <code className="text-[#ffee00] bg-gray-900 px-2 py-1 rounded text-sm">
                        /{page.slug}
                      </code>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        page.publicada 
                          ? 'bg-green-600/30 text-green-300 border border-green-600/50' 
                          : 'bg-yellow-600/30 text-yellow-300 border border-yellow-600/50'
                      }`}>
                        {page.publicada ? 'Publicada' : 'Borrador'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center text-gray-300 text-sm">
                      {page.layout_type}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/pages/${page.id}/builder`}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm flex items-center gap-1"
                          title="Editar contenido"
                        >
                          <Edit className="w-4 h-4" />
                          <span className="hidden sm:inline">Editar</span>
                        </Link>
                        
                        <button
                          onClick={() => handleTogglePublish(page)}
                          className={`px-3 py-1.5 rounded-lg text-white text-sm flex items-center gap-1 ${
                            page.publicada 
                              ? 'bg-yellow-600 hover:bg-yellow-700' 
                              : 'bg-green-600 hover:bg-green-700'
                          }`}
                          title={page.publicada ? 'Despublicar' : 'Publicar'}
                        >
                          {page.publicada ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          <span className="hidden sm:inline">
                            {page.publicada ? 'Despublicar' : 'Publicar'}
                          </span>
                        </button>
                        
                        <button
                          onClick={() => handleDeletePage(page)}
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm flex items-center gap-1"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Page Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Crear Nueva Página</h3>
            
            <form onSubmit={handleCreatePage} className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 block mb-1">Título *</label>
                <input
                  type="text"
                  value={newPage.titulo}
                  onChange={(e) => setNewPage({ ...newPage, titulo: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                  placeholder="Ej: Quiénes Somos"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-300 block mb-1">
                  Slug (opcional, se genera automáticamente)
                </label>
                <input
                  type="text"
                  value={newPage.slug}
                  onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                  placeholder="Ej: quienes-somos"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300 block mb-1">Descripción</label>
                <textarea
                  value={newPage.descripcion}
                  onChange={(e) => setNewPage({ ...newPage, descripcion: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffee00] resize-none"
                  rows="3"
                  placeholder="Breve descripción de la página"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300 block mb-1">Meta Título (SEO)</label>
                  <input
                    type="text"
                    value={newPage.meta_title}
                    onChange={(e) => setNewPage({ ...newPage, meta_title: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                    placeholder="Título para SEO"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300 block mb-1">Layout</label>
                  <select
                    value={newPage.layout_type}
                    onChange={(e) => setNewPage({ ...newPage, layout_type: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                  >
                    <option value="default">Default</option>
                    <option value="fullwidth">Ancho Completo</option>
                    <option value="sidebar">Con Sidebar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300 block mb-1">Meta Descripción (SEO)</label>
                <textarea
                  value={newPage.meta_description}
                  onChange={(e) => setNewPage({ ...newPage, meta_description: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffee00] resize-none"
                  rows="2"
                  placeholder="Descripción para motores de búsqueda"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ffee00] text-black font-semibold rounded-lg hover:bg-[#e6d000] transition"
                >
                  Crear Página
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PagesAdmin;
