'use client';

import { useState, useEffect } from 'react';
import { pricesService } from '@/lib/adminService';
import { DollarSign, Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CURRENCY } from '@/lib/constants';

/**
 * Componente para administrar precios de canchas
 */
const PricesAdmin = () => {
  const [precios, setPrecios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('futbol7');

  const tiposCanchas = [
    { id: 'futbol7', name: 'Fútbol 7', color: 'bg-blue-500' },
    { id: 'futbol9', name: 'Fútbol 9', color: 'bg-green-500' },
    { id: 'pickleball', name: 'Pickleball Individual', color: 'bg-purple-500' },
    { id: 'pickleball-dobles', name: 'Pickleball Dobles', color: 'bg-pink-500' }
  ];

  const diasSemana = [
    { id: 'weekdays', name: 'Lunes a Viernes' },
    { id: 'saturday', name: 'Sábados' },
    { id: 'sunday', name: 'Domingos' }
  ];

  useEffect(() => {
    loadPrecios();
  }, []);

  // Recargar precios cuando cambie la pestaña activa
  useEffect(() => {
    loadPrecios();
  }, [activeTab]);

  const loadPrecios = async () => {
    try {
      setLoading(true);
      const { data, error } = await pricesService.getAll();
      if (error) throw error;
      setPrecios(data || []);
    } catch (error) {
      console.error('Error cargando precios:', error);
      setMessage({ type: 'error', text: 'Error al cargar los precios' });
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (id, newPrice) => {
    setPrecios(prev => prev.map(precio => 
      precio.id === id ? { ...precio, precio: parseInt(newPrice) || 0 } : precio
    ));
  };

  const savePrecios = async () => {
    try {
      setSaving(true);
      
      const { data, error } = await pricesService.updateBatch(precios);
      if (error) {
        console.error('❌ Error de Supabase:', error);
        throw error;
      }
      
      setMessage({ type: 'success', text: 'Precios actualizados correctamente' });
      
      // Recargar los datos después de guardar
      await loadPrecios();
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('💥 Error guardando precios:', error);
      setMessage({ type: 'error', text: `Error al guardar los precios: ${error.message}` });
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: CURRENCY
    }).format(amount);
  };

  const preciosByTipo = precios.filter(p => p.tipo_cancha === activeTab);
  const preciosByDia = diasSemana.map(dia => ({
    ...dia,
    precios: preciosByTipo.filter(p => p.dia_semana === dia.id).sort((a, b) => a.hora.localeCompare(b.hora))
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#ffee00]" />
        <span className="ml-2 text-gray-300">Cargando precios...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ffee00] rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Gestión de Precios</h2>
            <p className="text-gray-400">Administra los precios de las canchas por horario</p>
          </div>
        </div>
        
        <button
          onClick={savePrecios}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-[#ffee00] hover:bg-[#e6d000] text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Guardando...' : 'Guardar Cambios'}
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

      {/* Tabs */}
      <div className="border-b border-gray-700">
        <nav className="flex space-x-8">
          {tiposCanchas.map((tipo) => (
            <button
              key={tipo.id}
              onClick={() => setActiveTab(tipo.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tipo.id
                  ? 'border-[#ffee00] text-[#ffee00]'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${tipo.color}`}></div>
                {tipo.name}
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Precios Grid */}
      <div className="space-y-6">
        {preciosByDia.map((dia) => (
          <div key={dia.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">{dia.name}</h3>
            
            {dia.precios.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No hay precios configurados para este día</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {dia.precios.map((precio) => (
                  <div key={precio.id} className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 font-medium">{precio.hora}</span>
                      <span className="text-xs text-gray-500">#{precio.id}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs text-gray-400 uppercase tracking-wide">Precio</label>
                      <input
                        type="number"
                        value={precio.precio}
                        onChange={(e) => handlePriceChange(precio.id, e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#ffee00] focus:border-transparent"
                        min="0"
                        step="1000"
                      />
                      <div className="text-sm text-gray-400">
                        {formatCurrency(precio.precio)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Resumen de Precios - {tiposCanchas.find(t => t.id === activeTab)?.name}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {diasSemana.map((dia) => {
            const preciosDia = preciosByTipo.filter(p => p.dia_semana === dia.id);
            const promedio = preciosDia.length > 0 
              ? preciosDia.reduce((sum, p) => sum + p.precio, 0) / preciosDia.length 
              : 0;
            const minimo = preciosDia.length > 0 ? Math.min(...preciosDia.map(p => p.precio)) : 0;
            const maximo = preciosDia.length > 0 ? Math.max(...preciosDia.map(p => p.precio)) : 0;

            return (
              <div key={dia.id} className="bg-gray-900/50 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">{dia.name}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Promedio:</span>
                    <span className="text-white">{formatCurrency(promedio)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mínimo:</span>
                    <span className="text-green-400">{formatCurrency(minimo)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Máximo:</span>
                    <span className="text-red-400">{formatCurrency(maximo)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Horarios:</span>
                    <span className="text-white">{preciosDia.length}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PricesAdmin;