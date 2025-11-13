'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { diasBloqueadosService } from '@/lib/adminService';
import { notifyScheduleChange } from '@/lib/notificationService';
import { invalidateScheduleConfigCache } from '@/hooks/useScheduleConfig';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Clock, Ban, Trash2, Plus, Save, AlertCircle } from 'lucide-react';

export default function HorariosAdmin() {
  const { user } = useAuth();
  const [horarioInicio, setHorarioInicio] = useState('09:00');
  const [horarioFin, setHorarioFin] = useState('23:00');
  const [intervaloMinutos, setIntervaloMinutos] = useState(60);
  const [diasActivos, setDiasActivos] = useState([]);
  const [diasBloqueados, setDiasBloqueados] = useState([]);
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [nuevoMotivo, setNuevoMotivo] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Estados originales para detectar cambios
  const [estadoOriginal, setEstadoOriginal] = useState({
    horarioInicio: '09:00',
    horarioFin: '23:00',
    intervaloMinutos: 60,
    diasActivos: []
  });

  const diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Cargar configuraciones de horario
      const { data: configs } = await supabase
        .from('configuraciones')
        .select('*')
        .in('clave', ['horario_inicio', 'horario_fin', 'intervalo_reserva_minutos', 'dias_semana_activos']);

      if (configs) {
        const newState = { ...estadoOriginal };
        
        configs.forEach(config => {
          if (config.clave === 'horario_inicio') {
            setHorarioInicio(config.valor);
            newState.horarioInicio = config.valor;
          }
          if (config.clave === 'horario_fin') {
            setHorarioFin(config.valor);
            newState.horarioFin = config.valor;
          }
          if (config.clave === 'intervalo_reserva_minutos') {
            const intervalo = parseInt(config.valor);
            setIntervaloMinutos(intervalo);
            newState.intervaloMinutos = intervalo;
          }
          if (config.clave === 'dias_semana_activos') {
            try {
              const dias = JSON.parse(config.valor);
              setDiasActivos(dias);
              newState.diasActivos = [...dias];
            } catch (e) {
              setDiasActivos(diasSemana);
              newState.diasActivos = [...diasSemana];
            }
          }
        });
        
        setEstadoOriginal(newState);
      }

      // Cargar días bloqueados
      const { data: bloqueados } = await diasBloqueadosService.getFuturos();
      setDiasBloqueados(bloqueados || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
      showMessage('error', 'Error al cargar configuraciones');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHorarios = async () => {
    setSaving(true);
    try {
      // Actualizar horario de inicio
      await supabase
        .from('configuraciones')
        .update({ valor: horarioInicio, actualizado_en: new Date().toISOString() })
        .eq('clave', 'horario_inicio');

      // Actualizar horario de fin
      await supabase
        .from('configuraciones')
        .update({ valor: horarioFin, actualizado_en: new Date().toISOString() })
        .eq('clave', 'horario_fin');

      // Actualizar intervalo
      await supabase
        .from('configuraciones')
        .update({ valor: intervaloMinutos.toString(), actualizado_en: new Date().toISOString() })
        .eq('clave', 'intervalo_reserva_minutos');

      // Actualizar días activos
      await supabase
        .from('configuraciones')
        .update({ valor: JSON.stringify(diasActivos), actualizado_en: new Date().toISOString() })
        .eq('clave', 'dias_semana_activos');

      // Detectar cambios y enviar notificación
      const cambios = detectarCambiosHorarios();
      if (cambios.length > 0) {
        await notifyScheduleChange({
          adminNombre: user?.email || 'Administrador',
          cambiosRealizados: cambios
        });
      }

      // Invalidar cache de configuración para que las tablas se actualicen
      invalidateScheduleConfigCache();

      showMessage('success', 'Horarios actualizados correctamente');
      
      // Actualizar estado original
      setEstadoOriginal({
        horarioInicio,
        horarioFin,
        intervaloMinutos,
        diasActivos: [...diasActivos]
      });
    } catch (error) {
      console.error('Error guardando horarios:', error);
      showMessage('error', 'Error al guardar horarios');
    } finally {
      setSaving(false);
    }
  };

  // Detectar qué cambios se realizaron en horarios
  const detectarCambiosHorarios = () => {
    const cambios = [];
    
    if (estadoOriginal.horarioInicio !== horarioInicio) {
      cambios.push(`Horario de inicio: ${estadoOriginal.horarioInicio} → ${horarioInicio}`);
    }
    
    if (estadoOriginal.horarioFin !== horarioFin) {
      cambios.push(`Horario de fin: ${estadoOriginal.horarioFin} → ${horarioFin}`);
    }
    
    if (estadoOriginal.intervaloMinutos !== intervaloMinutos) {
      cambios.push(`Intervalo de reserva: ${estadoOriginal.intervaloMinutos} min → ${intervaloMinutos} min`);
    }
    
    // Comparar días activos
    const diasAgregados = diasActivos.filter(d => !estadoOriginal.diasActivos.includes(d));
    const diasEliminados = estadoOriginal.diasActivos.filter(d => !diasActivos.includes(d));
    
    if (diasAgregados.length > 0) {
      cambios.push(`Días activados: ${diasAgregados.join(', ')}`);
    }
    
    if (diasEliminados.length > 0) {
      cambios.push(`Días desactivados: ${diasEliminados.join(', ')}`);
    }
    
    return cambios;
  };

  const handleBloquearDia = async () => {
    if (!nuevaFecha) {
      showMessage('error', 'Debe seleccionar una fecha');
      return;
    }

    try {
      const { data: session } = await supabase.auth.getSession();
      const email = session?.session?.user?.email || 'Admin';

      const { error } = await diasBloqueadosService.create(nuevaFecha, nuevoMotivo, email);
      
      if (error) throw error;

      // Enviar notificación de bloqueo
      const fechaFormateada = new Date(nuevaFecha).toLocaleDateString('es-CL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      await notifyScheduleChange({
        adminNombre: user?.email || 'Administrador',
        cambiosRealizados: [
          `Día bloqueado: ${fechaFormateada}`,
          nuevoMotivo ? `Motivo: ${nuevoMotivo}` : 'Sin motivo especificado'
        ]
      });

      showMessage('success', 'Día bloqueado correctamente');
      setNuevaFecha('');
      setNuevoMotivo('');
      loadData();
    } catch (error) {
      console.error('Error bloqueando día:', error);
      showMessage('error', 'Error al bloquear día');
    }
  };

  const handleDesbloquearDia = async (id) => {
    if (!confirm('¿Está seguro de desbloquear este día?')) return;

    try {
      const diaADesbloquear = diasBloqueados.find(d => d.id === id);
      
      const { error } = await diasBloqueadosService.delete(id);
      
      if (error) throw error;

      // Enviar notificación de desbloqueo
      if (diaADesbloquear) {
        const fechaFormateada = new Date(diaADesbloquear.fecha).toLocaleDateString('es-CL', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
        await notifyScheduleChange({
          adminNombre: user?.email || 'Administrador',
          cambiosRealizados: [`Día desbloqueado: ${fechaFormateada}`]
        });
      }

      showMessage('success', 'Día desbloqueado correctamente');
      loadData();
    } catch (error) {
      console.error('Error desbloqueando día:', error);
      showMessage('error', 'Error al desbloquear día');
    }
  };

  const toggleDiaActivo = (dia) => {
    if (diasActivos.includes(dia)) {
      setDiasActivos(diasActivos.filter(d => d !== dia));
    } else {
      setDiasActivos([...diasActivos, dia]);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Configuración de Horarios</h2>
        <p className="text-gray-400">Gestiona los horarios de operación y días bloqueados</p>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`flex items-center gap-2 p-3 rounded-lg ${
          message.type === 'success' ? 'bg-green-900/50 border border-green-700 text-green-300' :
          'bg-red-900/50 border border-red-700 text-red-300'
        }`}>
          <AlertCircle className="w-5 h-5" />
          {message.text}
        </div>
      )}

      {/* Horarios de Operación */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-[#ffee00]" />
          <h3 className="text-xl font-bold text-white">Horarios de Operación</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Hora de Inicio
            </label>
            <input
              type="time"
              value={horarioInicio}
              onChange={(e) => setHorarioInicio(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Hora de Fin
            </label>
            <input
              type="time"
              value={horarioFin}
              onChange={(e) => setHorarioFin(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duración por Bloque (min)
            </label>
            <select
              value={intervaloMinutos}
              onChange={(e) => setIntervaloMinutos(parseInt(e.target.value))}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
            >
              <option value="30">30 minutos</option>
              <option value="60">60 minutos</option>
              <option value="90">90 minutos</option>
              <option value="120">120 minutos</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Días de la Semana Activos
          </label>
          <div className="flex flex-wrap gap-2">
            {diasSemana.map(dia => (
              <button
                key={dia}
                onClick={() => toggleDiaActivo(dia)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  diasActivos.includes(dia)
                    ? 'bg-[#ffee00] text-black'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {dia.charAt(0).toUpperCase() + dia.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveHorarios}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-[#ffee00] text-black font-semibold rounded-lg hover:bg-[#e6d000] transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar Horarios'}
          </button>
        </div>
      </div>

      {/* Bloquear Días Específicos */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Ban className="w-5 h-5 text-red-400" />
          <h3 className="text-xl font-bold text-white">Bloquear Días Específicos</h3>
        </div>

        {/* Formulario para bloquear */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Fecha
            </label>
            <input
              type="date"
              value={nuevaFecha}
              onChange={(e) => setNuevaFecha(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Motivo (opcional)
            </label>
            <input
              type="text"
              value={nuevoMotivo}
              onChange={(e) => setNuevoMotivo(e.target.value)}
              placeholder="Ej: Feriado, Mantenimiento, Evento privado"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white"
            />
          </div>
        </div>

        <button
          onClick={handleBloquearDia}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
        >
          <Plus className="w-4 h-4" />
          Bloquear Día
        </button>

        {/* Lista de días bloqueados */}
        {diasBloqueados.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Días Bloqueados</h4>
            <div className="space-y-2">
              {diasBloqueados.map(dia => (
                <div
                  key={dia.id}
                  className="flex items-center justify-between bg-gray-900 border border-gray-700 rounded-lg p-3"
                >
                  <div>
                    <p className="text-white font-medium">
                      {new Date(dia.fecha + 'T12:00:00').toLocaleDateString('es-CL', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    {dia.motivo && (
                      <p className="text-sm text-gray-400">{dia.motivo}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDesbloquearDia(dia.id)}
                    className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition"
                    title="Desbloquear día"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
