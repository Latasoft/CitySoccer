'use client';

import { useState, useEffect } from 'react';
import { pricesService } from '@/lib/adminService';
import { invalidatePricesCache as invalidateDynamicCache } from '@/lib/dynamicConfigService';
import { invalidatePricesCache as invalidateHookCache } from '@/hooks/usePrices';
import { notifyPriceChange } from '@/lib/notificationService';
import { useScheduleConfig } from '@/hooks/useScheduleConfig';
import { useAuth } from '@/hooks/useAuth';
import { DollarSign, Save, Loader2, AlertCircle, CheckCircle2, Plus, X, Trash2 } from 'lucide-react';
import { CURRENCY } from '@/lib/constants';

// Función helper para invalidar todos los cachés de precios
const invalidatePricesCache = () => {
  invalidateDynamicCache();
  invalidateHookCache();
};

/**
 * Componente MEJORADO para administrar precios de canchas
 * - Vista de grilla (horarios × días)
 * - Eliminar horarios con X
 * - Agregar nuevos horarios con +
 * - Toggle activo/inactivo
 */
const PricesAdminGrid = () => {
  const { user } = useAuth();
  const { isWeekdaysActive, isSaturdayActive, isSundayActive, loading: loadingConfig } = useScheduleConfig();
  const [precios, setPrecios] = useState([]);
  const [preciosOriginales, setPreciosOriginales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('futbol7');
  const [showAddModal, setShowAddModal] = useState(false);
  const [horas, setHoras] = useState([]); // Horarios dinámicos de BD
  const [newSlot, setNewSlot] = useState({
    dia_semana: 'weekdays',
    hora: '09:00',
    precio: 25000
  });

  const tiposCanchas = [
    { id: 'futbol7', name: 'Fútbol 7', color: 'bg-blue-500' },
    { id: 'futbol9', name: 'Fútbol 9', color: 'bg-green-500' },
    { id: 'pickleball', name: 'Pickleball Individual', color: 'bg-purple-500' },
    { id: 'pickleball-dobles', name: 'Pickleball Dobles', color: 'bg-pink-500' }
  ];

  const diasSemana = [
    { id: 'weekdays', name: 'Lun-Vie' },
    { id: 'saturday', name: 'Sábado' },
    { id: 'sunday', name: 'Domingo' }
  ];

  // Cargar horarios disponibles de BD
  useEffect(() => {
    const loadHorarios = async () => {
      const horariosDisponibles = await pricesService.getAvailableHours();
      setHoras(horariosDisponibles);
      if (horariosDisponibles.length > 0) {
        setNewSlot(prev => ({ ...prev, hora: horariosDisponibles[0] }));
      }
    };
    loadHorarios();
  }, []);

  useEffect(() => {
    loadPrecios();
  }, [activeTab]);

  const loadPrecios = async () => {
    try {
      setLoading(true);
      const { data, error } = await pricesService.getAll();
      if (error) throw error;
      setPrecios(data || []);
      setPreciosOriginales(JSON.parse(JSON.stringify(data || []))); // Copia profunda
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

  const handleDeleteSlot = async (precioId) => {
    if (!confirm('¿Eliminar este horario? Esta acción no se puede deshacer.')) return;

    try {
      const { error } = await pricesService.delete(precioId);
      if (error) throw error;

      setMessage({ type: 'success', text: 'Horario eliminado correctamente' });
      invalidatePricesCache();
      await loadPrecios();

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error eliminando horario:', error);
      setMessage({ type: 'error', text: 'Error al eliminar el horario' });
    }
  };

  const handleAddSlot = async () => {
    try {
      // Verificar si ya existe
      const { exists } = await pricesService.exists(activeTab, newSlot.dia_semana, newSlot.hora);
      if (exists) {
        setMessage({ type: 'error', text: 'Ya existe un horario para ese día y hora' });
        return;
      }

      const { error } = await pricesService.create({
        tipo_cancha: activeTab,
        dia_semana: newSlot.dia_semana,
        hora: newSlot.hora,
        precio: parseInt(newSlot.precio) || 0,
        activo: true
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Horario agregado correctamente' });
      invalidatePricesCache();
      setShowAddModal(false);
      await loadPrecios();

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error agregando horario:', error);
      setMessage({ type: 'error', text: 'Error al agregar el horario' });
    }
  };

  const handleToggleActive = async (precioId, currentActivo) => {
    try {
      const { error } = await pricesService.toggleActive(precioId, !currentActivo);
      if (error) throw error;

      setMessage({ 
        type: 'success', 
        text: currentActivo ? 'Horario desactivado' : 'Horario activado' 
      });
      invalidatePricesCache();
      await loadPrecios();

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error cambiando estado:', error);
      setMessage({ type: 'error', text: 'Error al cambiar estado' });
    }
  };

  const savePrecios = async () => {
    try {
      console.log('🔍💰 savePrecios: Iniciando guardado...');
      setSaving(true);
      
      console.log('🔍💰 Invalidando cachés...');
      invalidatePricesCache();
      
      console.log('🔍💰 Llamando a pricesService.updateBatch con', precios.length, 'precios');
      const { error } = await pricesService.updateBatch(precios);
      
      console.log('🔍💰 Respuesta de updateBatch:', { hasError: !!error, errorMsg: error?.message });
      
      if (error) {
        console.error('🔍💰 ERROR en updateBatch:', error);
        throw error;
      }
      
      console.log('🔍💰 Detectando cambios...');
      const cambios = detectarCambios();
      console.log('🔍💰 Cambios detectados:', cambios.length);
      
      if (cambios.length > 0) {
        console.log('🔍💰 Enviando notificación...');
        await notifyPriceChange({
          adminNombre: user?.email || 'Administrador',
          tipoCancha: tiposCanchas.find(t => t.id === activeTab)?.name || activeTab,
          cambiosRealizados: cambios
        });
        console.log('🔍💰 Notificación enviada');
      }
      
      console.log('🔍💰 ✅ Guardado exitoso, recargando precios...');
      setMessage({ type: 'success', text: 'Precios actualizados correctamente' });
      await loadPrecios();
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('🔍💰 ERROR CRÍTICO guardando precios:', error.message, error);
      setMessage({ type: 'error', text: `Error al guardar: ${error.message}` });
    } finally {
      console.log('🔍💰 Finally: Reseteando estado de guardado');
      setSaving(false);
    }
  };

  // Detectar qué cambios se realizaron
  const detectarCambios = () => {
    const cambios = [];
    const preciosActuales = precios.filter(p => p.tipo_cancha === activeTab);
    const preciosOriginalesTab = preciosOriginales.filter(p => p.tipo_cancha === activeTab);

    preciosActuales.forEach(precioActual => {
      const precioOriginal = preciosOriginalesTab.find(p => p.id === precioActual.id);
      
      if (precioOriginal && precioOriginal.precio !== precioActual.precio) {
        const diaLabel = diasSemana.find(d => d.id === precioActual.dia_semana)?.name || precioActual.dia_semana;
        cambios.push(
          `${diaLabel} ${precioActual.hora}: $${precioOriginal.precio.toLocaleString('es-CL')} → $${precioActual.precio.toLocaleString('es-CL')}`
        );
      }
    });

    return cambios;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: CURRENCY
    }).format(amount);
  };

  const getPrecioCell = (diaSemana, hora) => {
    return precios.find(p => 
      p.tipo_cancha === activeTab && 
      p.dia_semana === diaSemana && 
      p.hora === hora
    );
  };

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
            <h2 className="text-2xl font-bold text-white">Gestión de Precios - Vista Grilla</h2>
            <p className="text-gray-400">Administra horarios con vista de tabla</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => {
              // Determinar el primer día activo para el valor inicial
              const primerDiaActivo = isWeekdaysActive ? 'weekdays' 
                : isSaturdayActive ? 'saturday' 
                : isSundayActive ? 'sunday' 
                : 'weekdays';
              
              setNewSlot({
                dia_semana: primerDiaActivo,
                hora: '09:00',
                precio: 25000
              });
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar Horario
          </button>
          <button
            onClick={savePrecios}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-[#ffee00] hover:bg-[#e6d000] text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
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

      {/* Grilla de Precios */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-600 bg-gray-700 p-3 text-left text-white font-semibold sticky left-0 z-10">
                Día / Hora
              </th>
              {horas.map(hora => (
                <th key={hora} className="border border-gray-600 bg-gray-700 p-3 text-center text-white font-semibold min-w-[120px]">
                  {hora}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {diasSemana
              .filter(dia => {
                if (dia.id === 'weekdays') return isWeekdaysActive;
                if (dia.id === 'saturday') return isSaturdayActive;
                if (dia.id === 'sunday') return isSundayActive;
                return true;
              })
              .map(dia => (
              <tr key={dia.id}>
                <td className="border border-gray-600 bg-gray-700 p-3 font-semibold text-white sticky left-0 z-10">
                  {dia.name}
                </td>
                {horas.map(hora => {
                  const precio = getPrecioCell(dia.id, hora);
                  return (
                    <td key={`${dia.id}-${hora}`} className="border border-gray-600 p-2">
                      {precio ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-1">
                            <input
                              type="number"
                              value={precio.precio}
                              onChange={(e) => handlePriceChange(precio.id, e.target.value)}
                              className="w-full bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#ffee00]"
                              min="0"
                              step="1000"
                            />
                            <button
                              onClick={() => handleDeleteSlot(precio.id)}
                              className="text-red-400 hover:text-red-300 p-1"
                              title="Eliminar horario"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">{formatCurrency(precio.precio)}</span>
                            <button
                              onClick={() => handleToggleActive(precio.id, precio.activo)}
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                precio.activo 
                                  ? 'bg-green-900/50 text-green-300' 
                                  : 'bg-gray-700 text-gray-400'
                              }`}
                              title={precio.activo ? 'Desactivar' : 'Activar'}
                            >
                              {precio.activo ? '✓' : '✗'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 text-sm py-2">
                          -
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Agregar Horario */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Agregar Nuevo Horario</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Día de la Semana</label>
                <select
                  value={newSlot.dia_semana}
                  onChange={(e) => setNewSlot({ ...newSlot, dia_semana: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  {diasSemana
                    .filter(dia => {
                      if (dia.id === 'weekdays') return isWeekdaysActive;
                      if (dia.id === 'saturday') return isSaturdayActive;
                      if (dia.id === 'sunday') return isSundayActive;
                      return true;
                    })
                    .map(dia => (
                      <option key={dia.id} value={dia.id}>{dia.name}</option>
                    ))
                  }
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Hora</label>
                <select
                  value={newSlot.hora}
                  onChange={(e) => setNewSlot({ ...newSlot, hora: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  {horas.map(hora => (
                    <option key={hora} value={hora}>{hora}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Precio (CLP)</label>
                <input
                  type="number"
                  value={newSlot.precio}
                  onChange={(e) => setNewSlot({ ...newSlot, precio: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  min="0"
                  step="1000"
                />
                <p className="text-sm text-gray-400 mt-1">{formatCurrency(newSlot.precio)}</p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddSlot}
                  className="flex-1 px-4 py-2 bg-[#ffee00] text-black font-semibold rounded-lg hover:bg-[#e6d000] transition"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leyenda */}
      <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
        <h3 className="text-sm font-semibold text-white mb-2">Leyenda:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <X className="w-4 h-4 text-red-400" />
            <span className="text-gray-300">Eliminar horario</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded text-xs bg-green-900/50 text-green-300">✓</span>
            <span className="text-gray-300">Activo</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded text-xs bg-gray-700 text-gray-400">✗</span>
            <span className="text-gray-300">Inactivo</span>
          </div>
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">Agregar horario nuevo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricesAdminGrid;
