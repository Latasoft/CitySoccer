'use client';

import { useState, useEffect } from 'react';
import { imageService } from '@/lib/adminService';
import { Images, Upload, Trash2, Loader2, AlertCircle, CheckCircle2, Eye, Edit3, Plus } from 'lucide-react';

const ImageAdmin = () => {
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    file: null,
    nombre: '',
    categoria: 'hero',
    descripcion: ''
  });

  const categorias = [
    { 
      id: 'todas', 
      name: 'Todas las Categorías',
      description: 'Ver todas las imágenes'
    },
    { 
      id: 'hero', 
      name: 'Hero / Portada', 
      description: 'Imagen de fondo de la página principal (detrás del video)',
      usage: '🏠 Página principal - Fondo del hero'
    },
    { 
      id: 'logos', 
      name: 'Logos', 
      description: 'Logo principal del sitio web',
      usage: '🏠 Página principal - Logo en el hero'
    },
    { 
      id: 'canchas', 
      name: 'Canchas', 
      description: 'Fotos de las instalaciones deportivas',
      usage: '🏠 Carrusel principal - Tarjetas de Fútbol y Pickleball'
    },
    { 
      id: 'eventos', 
      name: 'Eventos', 
      description: 'Imágenes de entrenamientos y actividades',
      usage: '🏠 Carrusel principal - Tarjetas de Clases, Academia y Summer Camp'
    },
    { 
      id: 'equipos', 
      name: 'Equipos', 
      description: 'Fotos de equipos y jugadores',
      usage: '📝 Contenido futuro - Páginas de equipos'
    },
    { 
      id: 'general', 
      name: 'General', 
      description: 'Otras imágenes para uso variado',
      usage: '📝 Contenido general del sitio'
    },
    { 
      id: 'quienes-somos', 
      name: 'Quienes Somos', 
      description: 'Imágenes de la página "Quienes Somos"',
      usage: '👥 Página Quienes Somos - Grid de imágenes principales'
    },
    { 
      id: 'summer-camp', 
      name: 'Summer Camp', 
      description: 'Imágenes de la página "Summer Camp"',
      usage: '🏕️ Página Summer Camp - Grid de 3 imágenes del hero'
    },
    { 
      id: 'academias', 
      name: 'Academias', 
      description: 'Imágenes para academia de fútbol y pickleball',
      usage: '🏆 Páginas Academia - Grid de imágenes de entrenamiento'
    },
    { 
      id: 'clases', 
      name: 'Clases Particulares', 
      description: 'Imágenes para clases particulares',
      usage: '👨‍🏫 Páginas Clases - Grid de imágenes de entrenamiento personalizado'
    }
  ];

  useEffect(() => {
    loadImagenes();
  }, []);

  const loadImagenes = async () => {
    try {
      setLoading(true);
      const { data, error } = await imageService.getAll();
      if (error) throw error;
      setImagenes(data || []);
    } catch (error) {
      console.error('Error cargando imágenes:', error);
      setMessage({ type: 'error', text: 'Error al cargar las imágenes' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Por favor selecciona un archivo de imagen válido' });
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'El archivo debe ser menor a 5MB' });
        return;
      }

      setUploadForm(prev => ({
        ...prev,
        file,
        nombre: prev.nombre || file.name.split('.')[0]
      }));
    }
  };

  const uploadImage = async () => {
    try {
      if (!uploadForm.file || !uploadForm.nombre || !uploadForm.categoria) {
        setMessage({ type: 'error', text: 'Por favor completa todos los campos requeridos' });
        return;
      }

      setUploading(true);
      const { data, error } = await imageService.upload(
        uploadForm.file,
        uploadForm.categoria,
        uploadForm.nombre
      );
      
      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Imagen subida correctamente' });
      setShowUploadModal(false);
      setUploadForm({ file: null, nombre: '', categoria: 'hero', descripcion: '' });
      loadImagenes();
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      setMessage({ type: 'error', text: 'Error al subir la imagen' });
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      return;
    }

    try {
      const { error } = await imageService.delete(id);
      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Imagen eliminada correctamente' });
      loadImagenes();
    } catch (error) {
      console.error('Error eliminando imagen:', error);
      setMessage({ type: 'error', text: 'Error al eliminar la imagen' });
    }
  };

  const copyImageUrl = (url) => {
    navigator.clipboard.writeText(url);
    setMessage({ type: 'success', text: 'URL de imagen copiada al portapapeles' });
    setTimeout(() => setMessage({ type: '', text: '' }), 2000);
  };

  const filteredImages = selectedCategory === 'todas' 
    ? imagenes 
    : imagenes.filter(img => img.categoria === selectedCategory);

  const imagesByCategory = imagenes.reduce((acc, img) => {
    acc[img.categoria] = (acc[img.categoria] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#ffee00]" />
        <span className="ml-2 text-gray-300">Cargando imágenes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ffee00] rounded-lg flex items-center justify-center">
            <Images className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Gestión de Imágenes</h2>
            <p className="text-gray-400">Administra las imágenes del sitio web</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#ffee00] hover:bg-[#e6d000] text-black font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Subir Imagen
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-white">{imagenes.length}</div>
          <div className="text-gray-400 text-sm">Total de Imágenes</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-white">{Object.keys(imagesByCategory).length}</div>
          <div className="text-gray-400 text-sm">Categorías</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-white">{imagesByCategory.hero || 0}</div>
          <div className="text-gray-400 text-sm">Imágenes Hero</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <div className="text-2xl font-bold text-white">{imagesByCategory.canchas || 0}</div>
          <div className="text-gray-400 text-sm">Fotos Canchas</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-3">Filtrar por Categoría</h3>
        <div className="flex flex-wrap gap-2">
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              onClick={() => setSelectedCategory(categoria.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === categoria.id
                  ? 'bg-[#ffee00] text-black'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {categoria.name}
              {categoria.id !== 'todas' && imagesByCategory[categoria.id] && (
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-600 rounded-full">
                  {imagesByCategory[categoria.id]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Guía de Uso de Imágenes */}
      {selectedCategory !== 'todas' && (
        <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            ¿Dónde se ven estas imágenes?
          </h3>
          <div className="bg-blue-800/30 rounded-lg p-4">
            <p className="text-blue-200 font-medium mb-2">
              {categorias.find(c => c.id === selectedCategory)?.usage}
            </p>
            <p className="text-blue-300 text-sm">
              {categorias.find(c => c.id === selectedCategory)?.description}
            </p>
            {selectedCategory === 'logos' && (
              <div className="mt-3 text-blue-200 text-sm">
                💡 <strong>Tip:</strong> La primera imagen en esta categoría será el logo principal del sitio.
              </div>
            )}
            {selectedCategory === 'hero' && (
              <div className="mt-3 text-blue-200 text-sm">
                💡 <strong>Tip:</strong> Esta imagen aparece como fondo del video en la página principal cuando el video no se puede reproducir.
              </div>
            )}
            {selectedCategory === 'canchas' && (
              <div className="mt-3 text-blue-200 text-sm">
                💡 <strong>Tip:</strong> Las primeras dos imágenes se usan para las tarjetas de Fútbol y Pickleball en el carrusel principal.
              </div>
            )}
            {selectedCategory === 'eventos' && (
              <div className="mt-3 text-blue-200 text-sm">
                💡 <strong>Tip:</strong> Las primeras tres imágenes se usan para las tarjetas de Clases, Academia y Summer Camp.
              </div>
            )}
            {selectedCategory === 'logos' && (
              <div className="mt-3 text-blue-200 text-sm">
                💡 <strong>Tip:</strong> La imagen más reciente (marcada como PRINCIPAL) se muestra en la página de inicio. Sube una nueva imagen para cambiar el logo principal.
              </div>
            )}
            {selectedCategory === 'hero' && (
              <div className="mt-3 text-blue-200 text-sm">
                💡 <strong>Tip:</strong> La imagen más reciente se usa como fondo/poster del video en la página principal.
              </div>
            )}
            {selectedCategory === 'quienes-somos' && (
              <div className="mt-3 text-blue-200 text-sm">
                💡 <strong>Tip:</strong> Las imágenes más recientes se muestran en el grid de la página "Quienes Somos". La primera imagen ocupa toda la fila superior.
              </div>
            )}
            {selectedCategory === 'general' && (
              <div className="mt-3 text-blue-200 text-sm">
                💡 <strong>Tip:</strong> Estas imágenes se usan en varias páginas del sitio como contenido decorativo y complementario.
              </div>
            )}
            {selectedCategory === 'summer-camp' && (
              <div className="mt-3 text-blue-200 text-sm">
                💡 <strong>Tip:</strong> Las 3 imágenes más recientes se muestran en el grid de Summer Camp. La primera ocupa toda la fila superior.
              </div>
            )}
            {selectedCategory === 'academias' && (
              <div className="mt-3 text-blue-200 text-sm">
                💡 <strong>Tip:</strong> Las 3 imágenes más recientes se usan en las páginas de Academia de Fútbol y Pickleball.
              </div>
            )}
            {selectedCategory === 'clases' && (
              <div className="mt-3 text-blue-200 text-sm">
                💡 <strong>Tip:</strong> Las 3 imágenes más recientes se usan en las páginas de Clases Particulares de Fútbol y Pickleball.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Images Grid */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          {selectedCategory === 'todas' ? 'Todas las Imágenes' : categorias.find(c => c.id === selectedCategory)?.name}
          <span className="ml-2 text-gray-400">({filteredImages.length})</span>
        </h3>
        
        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <Images className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No hay imágenes en esta categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((imagen, index) => (
              <div key={imagen.id} className={`bg-gray-900/50 rounded-lg overflow-hidden border group relative ${
                index === 0 ? 'border-[#ffee00] ring-2 ring-[#ffee00]/50' : 'border-gray-600'
              }`}>
                {/* Indicador de imagen principal */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 z-10 bg-[#ffee00] text-black px-2 py-1 rounded-md text-xs font-bold">
                    PRINCIPAL
                  </div>
                )}
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={imagen.url}
                    alt={imagen.nombre}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(imagen.url, '_blank')}
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                      >
                        <Eye className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={() => copyImageUrl(imagen.url)}
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
                      >
                        <Edit3 className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={() => deleteImage(imagen.id)}
                        className="p-2 bg-red-500/20 backdrop-blur-sm rounded-lg hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-300" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="font-medium text-white truncate">{imagen.nombre}</h4>
                  <p className="text-xs text-gray-400 mt-1 capitalize">{imagen.categoria}</p>
                  {imagen.descripcion && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{imagen.descripcion}</p>
                  )}
                  <div className="mt-3 text-xs text-gray-500">
                    ID: {imagen.id}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Subir Nueva Imagen</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Seleccionar Archivo *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#ffee00] file:text-black hover:file:bg-[#e6d000] file:cursor-pointer"
                />
                {uploadForm.file && (
                  <p className="text-xs text-gray-400 mt-1">
                    Archivo seleccionado: {uploadForm.file.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre de la Imagen *
                </label>
                <input
                  type="text"
                  value={uploadForm.nombre}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, nombre: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                  placeholder="ej: cancha-futbol-principal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Categoría *
                </label>
                <select
                  value={uploadForm.categoria}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, categoria: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                >
                  {categorias.slice(1).map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción (Opcional)
                </label>
                <textarea
                  value={uploadForm.descripcion}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, descripcion: e.target.value }))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffee00] resize-none"
                  rows="3"
                  placeholder="Describe brevemente la imagen..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={uploadImage}
                disabled={uploading || !uploadForm.file || !uploadForm.nombre}
                className="flex-1 px-4 py-2 bg-[#ffee00] hover:bg-[#e6d000] text-black font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Subir
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageAdmin;