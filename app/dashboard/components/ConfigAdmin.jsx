'use client';

import { useState, useEffect } from 'react';
import { configService } from '@/lib/adminService';
import { Settings, Save, Loader2, AlertCircle, CheckCircle2, Phone, Mail, MapPin, Instagram, MessageCircle, Clock } from 'lucide-react';

const ConfigAdmin = () => {
  const [configuraciones, setConfiguraciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const iconMap = {
    telefono_principal: Phone,
    whatsapp: MessageCircle,
    email_principal: Mail,
    direccion: MapPin,
    instagram: Instagram,
    facebook: Instagram,
    horario_semana: Clock,
    horario_sabado: Clock,
    horario_domingo: Clock,
  };

  const categoryLabels = {
    contacto: 'Información de Contacto',
    redes_sociales: 'Redes Sociales',
    operacion: 'Horarios de Operación'
  };

  useEffect(() => {
    loadConfiguraciones();
  }, []);

  const loadConfiguraciones = async () => {
    try {
      setLoading(true);
      const { data, error } = await configService.getAll();
      if (error) throw error;
      setConfiguraciones(data || []);
    } catch (error) {
      console.error('Error cargando configuraciones:', error);
      setMessage({ type: 'error', text: 'Error al cargar las configuraciones' });
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (id, newValue) => {
    setConfiguraciones(prev => prev.map(config => 
      config.id === id ? { ...config, valor: newValue } : config
    ));
  };

  const saveConfig = async (config) => {
    try {
      setSaving(config.id);
      const { error } = await configService.update(config.id, config.valor);
      if (error) throw error;
      
      setMessage({ type: 'success', text: `${config.descripcion} actualizada correctamente` });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error guardando configuración:', error);
      setMessage({ type: 'error', text: 'Error al guardar la configuración' });
    } finally {
      setSaving(null);
    }
  };

  const getInputType = (tipo) => {
    switch (tipo) {
      case 'email': return 'email';
      case 'telefono': return 'tel';
      case 'numero': return 'number';
      case 'url': return 'url';
      default: return 'text';
    }
  };

  const configsByCategory = configuraciones.reduce((acc, config) => {
    if (!acc[config.categoria]) {
      acc[config.categoria] = [];
    }
    acc[config.categoria].push(config);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#ffee00]" />
        <span className="ml-2 text-gray-300">Cargando configuraciones...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#ffee00] rounded-lg flex items-center justify-center">
          <Settings className="w-5 h-5 text-black" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Configuración General</h2>
          <p className="text-gray-400">Administra la información de contacto, redes sociales y horarios</p>
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

      {/* Configurations by Category */}
      <div className="space-y-6">
        {Object.entries(configsByCategory).map(([categoria, configs]) => (
          <div key={categoria} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              {categoryLabels[categoria] || categoria}
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {configs.map((config) => {
                const IconComponent = iconMap[config.clave] || Settings;
                
                return (
                  <div key={config.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <IconComponent className="w-4 h-4 text-gray-300" />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="text-sm font-medium text-white block">
                            {config.descripcion}
                          </label>
                          <p className="text-xs text-gray-400 mt-1">
                            Clave: {config.clave}
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          {config.tipo === 'texto' && config.valor && config.valor.length > 50 ? (
                            <textarea
                              value={config.valor}
                              onChange={(e) => handleConfigChange(config.id, e.target.value)}
                              className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffee00] focus:border-transparent resize-none"
                              rows="3"
                            />
                          ) : (
                            <input
                              type={getInputType(config.tipo)}
                              value={config.valor}
                              onChange={(e) => handleConfigChange(config.id, e.target.value)}
                              className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffee00] focus:border-transparent"
                              placeholder={`Ingresa ${config.descripcion.toLowerCase()}`}
                            />
                          )}
                          
                          <button
                            onClick={() => saveConfig(config)}
                            disabled={saving === config.id}
                            className="px-3 py-2 bg-[#ffee00] hover:bg-[#e6d000] text-black font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            {saving === config.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        
                        {/* Preview for specific fields */}
                        {config.clave === 'telefono_principal' && config.valor && (
                          <div className="text-xs text-gray-400">
                            Preview: <a href={`tel:${config.valor}`} className="text-[#ffee00] hover:underline">{config.valor}</a>
                          </div>
                        )}
                        
                        {config.clave === 'whatsapp' && config.valor && (
                          <div className="text-xs text-gray-400">
                            Preview: <a href={`https://wa.me/${config.valor.replace('+', '')}`} className="text-[#ffee00] hover:underline" target="_blank" rel="noopener noreferrer">WhatsApp</a>
                          </div>
                        )}
                        
                        {config.clave === 'email_principal' && config.valor && (
                          <div className="text-xs text-gray-400">
                            Preview: <a href={`mailto:${config.valor}`} className="text-[#ffee00] hover:underline">{config.valor}</a>
                          </div>
                        )}
                        
                        {config.clave === 'instagram' && config.valor && (
                          <div className="text-xs text-gray-400">
                            Preview: <a href={`https://instagram.com/${config.valor.replace('@', '')}`} className="text-[#ffee00] hover:underline" target="_blank" rel="noopener noreferrer">{config.valor}</a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-6 border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
            <h4 className="font-medium text-white mb-2">Contacto Principal</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Teléfono:</span>
                <span className="text-white">{configuraciones.find(c => c.clave === 'telefono_principal')?.valor || 'No configurado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span className="text-white text-xs">{configuraciones.find(c => c.clave === 'email_principal')?.valor || 'No configurado'}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
            <h4 className="font-medium text-white mb-2">Redes Sociales</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Instagram:</span>
                <span className="text-white">{configuraciones.find(c => c.clave === 'instagram')?.valor || 'No configurado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">WhatsApp:</span>
                <span className="text-white text-xs">{configuraciones.find(c => c.clave === 'whatsapp')?.valor || 'No configurado'}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
            <h4 className="font-medium text-white mb-2">Ubicación</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Dirección:</span>
                <span className="text-white text-xs">{configuraciones.find(c => c.clave === 'direccion')?.valor || 'No configurado'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigAdmin;