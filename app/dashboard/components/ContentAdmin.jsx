'use client';

import { useState, useEffect } from 'react';
import { contentService } from '@/lib/adminService';
import { FileText, Save, Loader2, AlertCircle, CheckCircle2, Edit3, Type, Hash } from 'lucide-react';

const ContentAdmin = () => {
  const [contenido, setContenido] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedSection, setSelectedSection] = useState('todas');
  const [editingContent, setEditingContent] = useState(null);

  const secciones = [
    { id: 'todas', name: 'Todas las Secciones' },
    { id: 'hero', name: 'Hero / Portada', description: 'Contenido principal de la página de inicio' },
    { id: 'about', name: 'Sobre Nosotros', description: 'Información de la empresa' },
    { id: 'servicios', name: 'Servicios', description: 'Descripción de servicios ofrecidos' },
    { id: 'contacto', name: 'Contacto', description: 'Información de contacto' },
    { id: 'eventos', name: 'Eventos', description: 'Contenido de eventos y actividades' },
    { id: 'academias', name: 'Academias', description: 'Información de academias deportivas' }
  ];

  const iconMap = {
    hero: Hash,
    about: FileText,
    servicios: Type,
    contacto: Edit3,
    eventos: FileText,
    academias: Type,
  };

  useEffect(() => {
    loadContenido();
  }, []);

  const loadContenido = async () => {
    try {
      setLoading(true);
      const { data, error } = await contentService.getAll();
      if (error) throw error;
      setContenido(data || []);
    } catch (error) {
      console.error('Error cargando contenido:', error);
      setMessage({ type: 'error', text: 'Error al cargar el contenido' });
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (id, newContent) => {
    setContenido(prev => prev.map(item => 
      item.id === id ? { ...item, contenido: newContent } : item
    ));
  };

  const saveContent = async (content) => {
    try {
      setSaving(content.id);
      const { error } = await contentService.update(content.id, content.contenido);
      if (error) throw error;
      
      setMessage({ type: 'success', text: `Contenido "${content.clave}" actualizado correctamente` });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      setEditingContent(null);
    } catch (error) {
      console.error('Error guardando contenido:', error);
      setMessage({ type: 'error', text: 'Error al guardar el contenido' });
    } finally {
      setSaving(null);
    }
  };

  const filteredContent = selectedSection === 'todas' 
    ? contenido 
    : contenido.filter(item => item.seccion === selectedSection);

  const contentBySection = contenido.reduce((acc, item) => {
    acc[item.seccion] = (acc[item.seccion] || 0) + 1;
    return acc;
  }, {});

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
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#ffee00] rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-black" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Contenido Editable</h2>
          <p className="text-gray-400">Administra los textos y contenido del sitio web</p>
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-white">{contenido.length}</div>
          <div className="text-gray-400 text-sm">Total de Elementos</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-white">{Object.keys(contentBySection).length}</div>
          <div className="text-gray-400 text-sm">Secciones</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-white">{contentBySection.hero || 0}</div>
          <div className="text-gray-400 text-sm">Contenido Hero</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-white">{contentBySection.servicios || 0}</div>
          <div className="text-gray-400 text-sm">Contenido Servicios</div>
        </div>
      </div>

      {/* Section Filter */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-3">Filtrar por Sección</h3>
        <div className="flex flex-wrap gap-2">
          {secciones.map((seccion) => (
            <button
              key={seccion.id}
              onClick={() => setSelectedSection(seccion.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedSection === seccion.id
                  ? 'bg-[#ffee00] text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {seccion.name}
              {seccion.id !== 'todas' && contentBySection[seccion.id] && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-600 rounded-full">
                  {contentBySection[seccion.id]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content List */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          {selectedSection === 'todas' ? 'Todo el Contenido' : secciones.find(s => s.id === selectedSection)?.name}
          <span className="ml-2 text-gray-400">({filteredContent.length})</span>
        </h3>
        
        {filteredContent.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No hay contenido en esta sección</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContent.map((item) => {
              const IconComponent = iconMap[item.seccion] || FileText;
              const isEditing = editingContent === item.id;
              
              return (
                <div key={item.id} className="bg-gray-900/50 rounded-lg p-6 border border-gray-600">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-gray-300" />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-white">{item.descripcion || item.clave}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>Sección: <span className="text-[#ffee00] capitalize">{item.seccion}</span></span>
                            <span>Clave: <span className="text-gray-300">{item.clave}</span></span>
                            <span>Tipo: <span className="text-gray-300 capitalize">{item.tipo}</span></span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingContent(isEditing ? null : item.id)}
                            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors text-sm flex items-center gap-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            {isEditing ? 'Cancelar' : 'Editar'}
                          </button>
                          
                          {isEditing && (
                            <button
                              onClick={() => saveContent(item)}
                              disabled={saving === item.id}
                              className="px-3 py-1 bg-[#ffee00] hover:bg-[#e6d000] text-black font-medium rounded-lg transition-colors text-sm flex items-center gap-1"
                            >
                              {saving === item.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Save className="w-3 h-3" />
                              )}
                              Guardar
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {isEditing ? (
                        <div className="space-y-2">
                          {item.tipo === 'texto' && item.contenido.length > 100 ? (
                            <textarea
                              value={item.contenido}
                              onChange={(e) => handleContentChange(item.id, e.target.value)}
                              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ffee00] focus:border-transparent resize-none"
                              rows="6"
                              placeholder="Ingresa el contenido..."
                            />
                          ) : (
                            <input
                              type="text"
                              value={item.contenido}
                              onChange={(e) => handleContentChange(item.id, e.target.value)}
                              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#ffee00] focus:border-transparent"
                              placeholder="Ingresa el contenido..."
                            />
                          )}
                          
                          <div className="text-xs text-gray-400">
                            Caracteres: {item.contenido.length}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                            <p className="text-gray-200 leading-relaxed">
                              {item.contenido || (
                                <span className="text-gray-500 italic">Sin contenido</span>
                              )}
                            </p>
                          </div>
                          
                          <div className="text-xs text-gray-400">
                            Última actualización: {new Date(item.actualizado_en).toLocaleString('es-CL')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Preview */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-6 border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-4">Vista Previa del Contenido Principal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Hero Content */}
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
            <h4 className="font-medium text-white mb-3 flex items-center gap-2">
              <Hash className="w-4 h-4 text-[#ffee00]" />
              Sección Hero
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-400">Título:</span>
                <p className="text-white text-xs mt-1">
                  {contenido.find(c => c.seccion === 'hero' && c.clave === 'titulo_principal')?.contenido || 'No configurado'}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Subtítulo:</span>
                <p className="text-white text-xs mt-1">
                  {contenido.find(c => c.seccion === 'hero' && c.clave === 'subtitulo')?.contenido || 'No configurado'}
                </p>
              </div>
            </div>
          </div>

          {/* About Content */}
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
            <h4 className="font-medium text-white mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#ffee00]" />
              Sobre Nosotros
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-400">Título:</span>
                <p className="text-white text-xs mt-1">
                  {contenido.find(c => c.seccion === 'about' && c.clave === 'titulo')?.contenido || 'No configurado'}
                </p>
              </div>
              <div>
                <span className="text-gray-400">Descripción:</span>
                <p className="text-white text-xs mt-1 line-clamp-2">
                  {contenido.find(c => c.seccion === 'about' && c.clave === 'descripcion')?.contenido || 'No configurado'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentAdmin;