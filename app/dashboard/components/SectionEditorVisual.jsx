'use client';

import { useState } from 'react';
import { X, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

const SectionEditorVisual = ({ section, onSave, onCancel }) => {
  const [config, setConfig] = useState(section.configuracion || {});

  const updateField = (field, value) => {
    setConfig({ ...config, [field]: value });
  };

  const updateCardField = (index, field, value) => {
    const newCards = [...(config.cards || [])];
    newCards[index] = { ...newCards[index], [field]: value };
    setConfig({ ...config, cards: newCards });
  };

  const addCard = () => {
    const newCards = [...(config.cards || []), {}];
    setConfig({ ...config, cards: newCards });
  };

  const deleteCard = (index) => {
    const newCards = (config.cards || []).filter((_, i) => i !== index);
    setConfig({ ...config, cards: newCards });
  };

  const updateImageField = (index, field, value) => {
    const newImages = [...(config.imagenes || [])];
    newImages[index] = { ...newImages[index], [field]: value };
    setConfig({ ...config, imagenes: newImages });
  };

  const addImage = () => {
    const newImages = [...(config.imagenes || []), {}];
    setConfig({ ...config, imagenes: newImages });
  };

  const deleteImage = (index) => {
    const newImages = (config.imagenes || []).filter((_, i) => i !== index);
    setConfig({ ...config, imagenes: newImages });
  };

  const renderHeroEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
        <input
          type="text"
          value={config.titulo || ''}
          onChange={(e) => updateField('titulo', e.target.value)}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
          placeholder="Ej: Bienvenidos a City Soccer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Subtítulo</label>
        <textarea
          value={config.subtitulo || ''}
          onChange={(e) => updateField('subtitulo', e.target.value)}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white resize-none"
          rows="3"
          placeholder="Texto descriptivo debajo del título"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Imagen de Fondo (URL)</label>
        <input
          type="text"
          value={config.imagen_fondo || ''}
          onChange={(e) => updateField('imagen_fondo', e.target.value)}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
          placeholder="/images/hero.jpg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Texto del Botón</label>
          <input
            type="text"
            value={config.cta_texto || ''}
            onChange={(e) => updateField('cta_texto', e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
            placeholder="Ej: Reservar Ahora"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">URL del Botón</label>
          <input
            type="text"
            value={config.cta_url || ''}
            onChange={(e) => updateField('cta_url', e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
            placeholder="/contacto"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Altura</label>
          <select
            value={config.altura || 'medium'}
            onChange={(e) => updateField('altura', e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
          >
            <option value="small">Pequeña</option>
            <option value="medium">Media</option>
            <option value="large">Grande</option>
            <option value="fullscreen">Pantalla Completa</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Alineación</label>
          <select
            value={config.alineacion || 'center'}
            onChange={(e) => updateField('alineacion', e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
          >
            <option value="left">Izquierda</option>
            <option value="center">Centro</option>
            <option value="right">Derecha</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Opacidad de Fondo Oscuro (0-1)
        </label>
        <input
          type="number"
          min="0"
          max="1"
          step="0.1"
          value={config.overlay_opacity || 0.5}
          onChange={(e) => updateField('overlay_opacity', parseFloat(e.target.value))}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
        />
      </div>
    </div>
  );

  const renderCardGridEditor = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Título de la Sección</label>
        <input
          type="text"
          value={config.titulo || ''}
          onChange={(e) => updateField('titulo', e.target.value)}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
          placeholder="Ej: Nuestros Servicios"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
        <input
          type="text"
          value={config.descripcion || ''}
          onChange={(e) => updateField('descripcion', e.target.value)}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
          placeholder="Texto debajo del título"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Columnas</label>
          <select
            value={config.columnas || 3}
            onChange={(e) => updateField('columnas', parseInt(e.target.value))}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
          >
            <option value="2">2 Columnas</option>
            <option value="3">3 Columnas</option>
            <option value="4">4 Columnas</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Fondo</label>
          <select
            value={config.fondo_oscuro ? 'true' : 'false'}
            onChange={(e) => updateField('fondo_oscuro', e.target.value === 'true')}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
          >
            <option value="false">Claro</option>
            <option value="true">Oscuro</option>
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-300">Tarjetas</label>
          <button
            onClick={addCard}
            className="flex items-center gap-1 px-3 py-1 bg-[#ffee00] text-black text-sm rounded hover:bg-[#e6d000]"
          >
            <Plus className="w-4 h-4" />
            Agregar Tarjeta
          </button>
        </div>

        <div className="space-y-4">
          {(config.cards || []).map((card, index) => (
            <div key={index} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-400">Tarjeta {index + 1}</span>
                <button
                  onClick={() => deleteCard(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={card.icono || ''}
                  onChange={(e) => updateCardField(index, 'icono', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  placeholder="Icono (emoji): ⚽"
                />

                <input
                  type="text"
                  value={card.titulo || ''}
                  onChange={(e) => updateCardField(index, 'titulo', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  placeholder="Título de la tarjeta"
                />

                <textarea
                  value={card.descripcion || ''}
                  onChange={(e) => updateCardField(index, 'descripcion', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm resize-none"
                  rows="2"
                  placeholder="Descripción"
                />

                <input
                  type="text"
                  value={card.imagen || ''}
                  onChange={(e) => updateCardField(index, 'imagen', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  placeholder="URL de imagen (opcional)"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={card.url || ''}
                    onChange={(e) => updateCardField(index, 'url', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                    placeholder="URL del enlace (opcional)"
                  />

                  <input
                    type="text"
                    value={card.url_texto || ''}
                    onChange={(e) => updateCardField(index, 'url_texto', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                    placeholder="Texto del enlace"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTextImageEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
        <input
          type="text"
          value={config.titulo || ''}
          onChange={(e) => updateField('titulo', e.target.value)}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
          placeholder="Título de la sección"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Contenido (HTML permitido)</label>
        <textarea
          value={config.contenido || ''}
          onChange={(e) => updateField('contenido', e.target.value)}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white resize-none font-mono text-sm"
          rows="8"
          placeholder="<p>Tu contenido aquí. Puedes usar HTML básico.</p>"
        />
        <p className="text-xs text-gray-500 mt-1">
          Tip: Usa &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt; para dar formato
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">URL de la Imagen</label>
        <input
          type="text"
          value={config.imagen || ''}
          onChange={(e) => updateField('imagen', e.target.value)}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
          placeholder="/images/about.jpg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Posición de la Imagen</label>
          <select
            value={config.posicion_imagen || 'right'}
            onChange={(e) => updateField('posicion_imagen', e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
          >
            <option value="left">Izquierda</option>
            <option value="right">Derecha</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Fondo</label>
          <select
            value={config.fondo_oscuro ? 'true' : 'false'}
            onChange={(e) => updateField('fondo_oscuro', e.target.value === 'true')}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
          >
            <option value="false">Claro</option>
            <option value="true">Oscuro</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderCTAEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
        <input
          type="text"
          value={config.titulo || ''}
          onChange={(e) => updateField('titulo', e.target.value)}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
          placeholder="¿Listo para comenzar?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
        <input
          type="text"
          value={config.descripcion || ''}
          onChange={(e) => updateField('descripcion', e.target.value)}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
          placeholder="Texto de apoyo"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Botón Principal - Texto</label>
          <input
            type="text"
            value={config.cta_primario_texto || ''}
            onChange={(e) => updateField('cta_primario_texto', e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
            placeholder="Reservar Ahora"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Botón Principal - URL</label>
          <input
            type="text"
            value={config.cta_primario_url || ''}
            onChange={(e) => updateField('cta_primario_url', e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
            placeholder="/arrendarcancha"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Botón Secundario - Texto (opcional)</label>
          <input
            type="text"
            value={config.cta_secundario_texto || ''}
            onChange={(e) => updateField('cta_secundario_texto', e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
            placeholder="Contacto"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Botón Secundario - URL</label>
          <input
            type="text"
            value={config.cta_secundario_url || ''}
            onChange={(e) => updateField('cta_secundario_url', e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
            placeholder="/contacto"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Color de Fondo</label>
        <select
          value={config.fondo_color || 'amarillo'}
          onChange={(e) => updateField('fondo_color', e.target.value)}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
        >
          <option value="amarillo">Amarillo (Brand)</option>
          <option value="negro">Negro</option>
          <option value="gradiente">Gradiente Amarillo</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Imagen de Fondo (opcional)</label>
        <input
          type="text"
          value={config.imagen_fondo || ''}
          onChange={(e) => updateField('imagen_fondo', e.target.value)}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
          placeholder="/images/cta-bg.jpg"
        />
      </div>
    </div>
  );

  const renderGalleryEditor = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Título (opcional)</label>
        <input
          type="text"
          value={config.titulo || ''}
          onChange={(e) => updateField('titulo', e.target.value)}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
          placeholder="Galería de Fotos"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Layout</label>
          <select
            value={config.layout || 'grid'}
            onChange={(e) => updateField('layout', e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
          >
            <option value="grid">Cuadrícula</option>
            <option value="masonry">Mosaico</option>
            <option value="carousel">Carrusel</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Columnas</label>
          <select
            value={config.columnas || 3}
            onChange={(e) => updateField('columnas', parseInt(e.target.value))}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
          >
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Fondo</label>
          <select
            value={config.fondo_oscuro ? 'true' : 'false'}
            onChange={(e) => updateField('fondo_oscuro', e.target.value === 'true')}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
          >
            <option value="false">Claro</option>
            <option value="true">Oscuro</option>
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-300">Imágenes</label>
          <button
            onClick={addImage}
            className="flex items-center gap-1 px-3 py-1 bg-[#ffee00] text-black text-sm rounded hover:bg-[#e6d000]"
          >
            <Plus className="w-4 h-4" />
            Agregar Imagen
          </button>
        </div>

        <div className="space-y-3">
          {(config.imagenes || []).map((img, index) => (
            <div key={index} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-400">Imagen {index + 1}</span>
                <button
                  onClick={() => deleteImage(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={img.url || ''}
                  onChange={(e) => updateImageField(index, 'url', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  placeholder="URL de la imagen"
                />

                <input
                  type="text"
                  value={img.titulo || ''}
                  onChange={(e) => updateImageField(index, 'titulo', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  placeholder="Título (opcional, se muestra al pasar el mouse)"
                />

                <input
                  type="text"
                  value={img.alt || ''}
                  onChange={(e) => updateImageField(index, 'alt', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  placeholder="Texto alternativo (SEO)"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEditor = () => {
    switch (section.tipo_seccion) {
      case 'hero':
        return renderHeroEditor();
      case 'card-grid':
        return renderCardGridEditor();
      case 'text-image':
        return renderTextImageEditor();
      case 'cta':
        return renderCTAEditor();
      case 'gallery':
        return renderGalleryEditor();
      default:
        return (
          <div className="text-gray-400 text-center py-8">
            <p>Editor no disponible para este tipo de sección.</p>
            <p className="text-sm mt-2">Tipo: {section.tipo_seccion}</p>
          </div>
        );
    }
  };

  const sectionTypeNames = {
    'hero': 'Hero / Cabecera',
    'card-grid': 'Cuadrícula de Tarjetas',
    'text-image': 'Texto + Imagen',
    'cta': 'Llamado a la Acción',
    'gallery': 'Galería de Imágenes'
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h3 className="text-xl font-bold text-white">
              Editar Sección: {sectionTypeNames[section.tipo_seccion] || section.tipo_seccion}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Completa los campos para configurar esta sección
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderEditor()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700 bg-gray-800/50">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(config)}
            className="px-6 py-2 bg-[#ffee00] text-black font-semibold rounded-lg hover:bg-[#e6d000] transition"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionEditorVisual;
