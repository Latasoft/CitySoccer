'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { buscarOCrearClienteReserva, crearReservaConValidacion, actualizarEstadoReserva, eliminarReserva as eliminarReservaService } from '@/lib/reservaService';
import CalendarioReservas from './components/CalendarioReservas';
import * as XLSX from 'xlsx';
import {
  Calendar,
  Plus,
  Search,
  Filter,
  X,
  CheckCircle2,
  Clock,
  Trash2,
  User,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Download,
  LayoutGrid,
  List
} from 'lucide-react';

export default function ReservasPage() {
  const router = useRouter();
  const { user, loading: authLoading, userRole, isAdmin } = useAuth();

  // Datos
  const [reservas, setReservas] = useState([]);
  const [total, setTotal] = useState(0);
  const [canchas, setCanchas] = useState([]);

  // UI
  const [loading, setLoading] = useState(true);
  const [loadingCanchas, setLoadingCanchas] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('tabla'); // 'tabla' o 'calendario'

  // Filtros y paginación
  const [search, setSearch] = useState('');
  const [fecha, setFecha] = useState('');
  const [estado, setEstado] = useState('todas'); // 'todas' | 'pendiente' | 'confirmada' | 'cancelada'
  const [canchaId, setCanchaId] = useState('todas');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Modal nueva reserva
  const [openModal, setOpenModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fecha: '',
    hora_inicio: '',
    cancha_id: '',
    cliente_nombre: '',
    cliente_correo: '',
    cliente_telefono: '',
  });

  useEffect(() => {
    // Verificar autenticación con hook
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  const loadCanchas = async () => {
    try {
      setLoadingCanchas(true);
      const { data, error } = await supabase
        .from('canchas')
        .select('id, nombre, tipo')
        .order('nombre', { ascending: true });
      if (error) throw error;
      setCanchas(data || []);
    } catch (e) {
      console.error(e);
      setError('No se pudieron cargar las canchas.');
    } finally {
      setLoadingCanchas(false);
    }
  };

  const fetchReservas = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('reservas')
        .select(`
          id,
          fecha,
          hora_inicio,
          estado,
          creado_en,
          cancha_id,
          cliente_id,
          clientes ( id, nombre, correo, telefono ),
          canchas ( id, nombre, tipo )
        `, { count: 'exact' })
        .order('fecha', { ascending: false })
        .order('hora_inicio', { ascending: false });

      if (fecha) query = query.eq('fecha', fecha);
      if (estado !== 'todas') query = query.eq('estado', estado);
      if (canchaId !== 'todas') query = query.eq('cancha_id', Number(canchaId));

      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;
      setReservas(data || []);
      setTotal(count || 0);
    } catch (e) {
      console.error(e);
      setError('Error cargando reservas.');
    } finally {
      setLoading(false);
    }
  }, [page, estado, fecha, canchaId]);

  // useEffect para cargar datos
  useEffect(() => {
    loadCanchas();
  }, []);

  useEffect(() => {
    fetchReservas();
  }, [page, fecha, estado, canchaId, fetchReservas]);

  const filteredBySearch = useMemo(() => {
    if (!search.trim()) return reservas;
    const s = search.toLowerCase();
    return reservas.filter(r => {
      const nombre = r.clientes?.nombre?.toLowerCase() || '';
      const correo = r.clientes?.correo?.toLowerCase() || '';
      const cancha = r.canchas?.nombre?.toLowerCase() || '';
      const fechaStr = r.fecha || '';
      const hora = r.hora_inicio || '';
      return (
        nombre.includes(s) ||
        correo.includes(s) ||
        cancha.includes(s) ||
        fechaStr.includes(s) ||
        hora.includes(s)
      );
    });
  }, [reservas, search]);

  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize));

  const resetFiltros = () => {
    setFecha('');
    setEstado('todas');
    setCanchaId('todas');
    setSearch('');
    setPage(1);
  };

  const onOpenNew = () => {
    setForm({
      fecha: '',
      hora_inicio: '',
      cancha_id: '',
      cliente_nombre: '',
      cliente_correo: '',
      cliente_telefono: '',
    });
    setOpenModal(true);
  };

  const guardarReserva = async (e) => {
    e.preventDefault();
    if (!form.fecha || !form.hora_inicio || !form.cancha_id || !form.cliente_nombre) {
      setError('Completa fecha, hora, cancha y nombre del cliente.');
      return;
    }
    try {
      setSaving(true);
      setError('');

      // Buscar o crear cliente usando el servicio
      const clienteResult = await buscarOCrearClienteReserva({
        nombre: form.cliente_nombre,
        correo: form.cliente_correo,
        telefono: form.cliente_telefono
      });

      if (!clienteResult.success) {
        setError(clienteResult.error || 'Error al procesar datos del cliente.');
        return;
      }

      const clienteId = clienteResult.clienteId;

      // Crear reserva con validación usando el servicio
      const reservaResult = await crearReservaConValidacion({
        fecha: form.fecha,
        hora_inicio: form.hora_inicio,
        cancha_id: Number(form.cancha_id),
        cliente_id: clienteId,
        estado: 'pendiente'
      });

      if (!reservaResult.success) {
        setError(reservaResult.error || 'Error al crear la reserva.');
        return;
      }

      setOpenModal(false);
      await fetchReservas();
    } catch (e) {
      console.error(e);
      setError('No se pudo guardar la reserva.');
    } finally {
      setSaving(false);
    }
  };

  const cambiarEstado = async (id, nuevo) => {
    try {
      const result = await actualizarEstadoReserva(id, nuevo);
      if (!result.success) {
        setError(result.error || 'No se pudo actualizar el estado.');
        return;
      }
      await fetchReservas();
    } catch (e) {
      console.error(e);
      setError('No se pudo actualizar el estado.');
    }
  };

  const eliminarReserva = async (id) => {
    if (!confirm('¿Eliminar esta reserva?')) return;
    try {
      const result = await eliminarReservaService(id);
      if (!result.success) {
        setError(result.error || 'No se pudo eliminar la reserva.');
        return;
      }
      await fetchReservas();
    } catch (e) {
      console.error(e);
      setError('No se pudo eliminar la reserva.');
    }
  };

  const exportarAExcel = async () => {
    try {
      // Obtener TODAS las reservas sin paginación y con los filtros aplicados
      let query = supabase
        .from('reservas')
        .select(`
          id,
          fecha,
          hora_inicio,
          estado,
          creado_en,
          transaction_id,
          clientes ( nombre, correo, telefono ),
          canchas ( nombre, tipo )
        `)
        .order('fecha', { ascending: false })
        .order('hora_inicio', { ascending: false });

      if (fecha) query = query.eq('fecha', fecha);
      if (estado !== 'todas') query = query.eq('estado', estado);
      if (canchaId !== 'todas') query = query.eq('cancha_id', Number(canchaId));

      const { data, error } = await query;
      if (error) throw error;

      if (!data || data.length === 0) {
        alert('No hay reservas para exportar con los filtros actuales');
        return;
      }

      // Obtener montos de las transacciones
      const transactionIds = data.map(r => r.transaction_id).filter(Boolean);
      const { data: transactions } = await supabase
        .from('transactions')
        .select('order_id, amount')
        .in('order_id', transactionIds);

      // Crear mapa de montos por transaction_id
      const montosMap = {};
      if (transactions) {
        transactions.forEach(t => {
          montosMap[t.order_id] = t.amount;
        });
      }

      // Preparar datos para Excel
      const excelData = data.map((reserva, index) => ({
        'N°': index + 1,
        'Fecha': reserva.fecha || '',
        'Hora': reserva.hora_inicio || '',
        'Cancha': formatNombreCancha(reserva.canchas),
        'Cliente': reserva.clientes?.nombre || 'Sin nombre',
        'Correo': reserva.clientes?.correo || '',
        'Teléfono': reserva.clientes?.telefono || '',
        'Monto': reserva.transaction_id && montosMap[reserva.transaction_id] 
          ? `$${montosMap[reserva.transaction_id].toLocaleString('es-CL')}` 
          : 'N/A',
        'Estado': reserva.estado ? reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1) : '',
        'Fecha Reserva': reserva.creado_en ? new Date(reserva.creado_en).toLocaleString('es-CL') : ''
      }));

      // Crear libro de Excel
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Ajustar ancho de columnas
      const columnWidths = [
        { wch: 5 },  // N°
        { wch: 12 }, // Fecha
        { wch: 8 },  // Hora
        { wch: 20 }, // Cancha
        { wch: 25 }, // Cliente
        { wch: 30 }, // Correo
        { wch: 15 }, // Teléfono
        { wch: 12 }, // Monto
        { wch: 12 }, // Estado
        { wch: 20 }  // Fecha Reserva
      ];
      worksheet['!cols'] = columnWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservas');

      // Generar nombre de archivo con fecha actual
      const fechaActual = new Date().toISOString().split('T')[0];
      const nombreArchivo = `reservas_citysoccer_${fechaActual}.xlsx`;

      // Descargar archivo
      XLSX.writeFile(workbook, nombreArchivo);
      
      // Mostrar mensaje de éxito
      alert(`✅ Se exportaron ${data.length} reserva(s) a Excel correctamente`);
    } catch (e) {
      console.error('Error exportando a Excel:', e);
      alert('Error al exportar las reservas a Excel');
    }
  };

  // Función para formatear fecha
  const formatFecha = (fecha) => {
    if (!fecha) return '';
    const [year, month, day] = fecha.split('-');
    const shortYear = year.slice(-2);
    return `${day}-${month}-${shortYear}`;
  };

  // Función para formatear nombre de cancha
  const formatNombreCancha = (cancha) => {
    if (!cancha) return 'Cancha desconocida';
    
    // Si ya tiene formato completo, devolverlo
    if (cancha.nombre && cancha.nombre.toLowerCase().includes('cancha')) {
      return cancha.nombre;
    }
    
    // Si es formato tipo "f7_1", "f7_2", etc.
    if (cancha.nombre && cancha.nombre.match(/^[a-zA-Z]+\d*_\d+$/)) {
      const parts = cancha.nombre.split('_');
      const tipo = parts[0].toUpperCase();
      const numero = parts[1];
      return `Cancha ${numero} ${tipo}`;
    }
    
    // Si solo tiene número y tipo separado
    if (cancha.tipo && cancha.nombre) {
      return `Cancha ${cancha.nombre} ${cancha.tipo.toUpperCase()}`;
    }
    
    // Fallback
    return cancha.nombre || `Cancha ${cancha.id}`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-[#ffee00] text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950">
      <header className="bg-gray-800/50 border-b border-gray-700 backdrop-blur-sm">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#ffee00]">Reservas</h1>
              <p className="text-sm sm:text-base text-gray-300">
                {userRole === 'empleado' ? 'Consulta de reservas' : 'Gestión de reservas'}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-wrap">
              {/* Toggle de vista */}
              <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1 border border-gray-700">
                <button
                  onClick={() => setViewMode('tabla')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition ${
                    viewMode === 'tabla' 
                      ? 'bg-[#ffee00] text-black font-semibold' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                  title="Vista de tabla"
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">Tabla</span>
                </button>
                <button
                  onClick={() => setViewMode('calendario')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition ${
                    viewMode === 'calendario' 
                      ? 'bg-[#ffee00] text-black font-semibold' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                  title="Vista de calendario"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Calendario</span>
                </button>
              </div>

              {isAdmin && (
                <button
                  onClick={exportarAExcel}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-700/50 transition text-sm sm:text-base whitespace-nowrap"
                  title="Exportar a Excel"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Excel</span>
                </button>
              )}
              
              <Link
                href="/dashboard"
                className="px-3 sm:px-4 py-2 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-700/50 transition text-sm sm:text-base whitespace-nowrap"
              >
                {userRole === 'empleado' ? 'Inicio' : 'Volver'}
              </Link>
              
              {isAdmin && (
                <button
                  onClick={onOpenNew}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#ffee00] text-black font-semibold rounded-lg hover:bg-[#e6d000] transition text-sm sm:text-base whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" /> Nueva Reserva
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Filtros */}
        <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700 mb-4 sm:mb-6">
          <div className="flex flex-col gap-3">
            {/* Búsqueda */}
            <div className="w-full">
              <label className="text-xs sm:text-sm text-gray-300 mb-1 block">Buscar</label>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cliente, correo, cancha, fecha..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm sm:text-base text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                />
              </div>
            </div>
            
            {/* Filtros en grid responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-xs sm:text-sm text-gray-300 mb-1 block">Fecha</label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => { setFecha(e.target.value); setPage(1); }}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm sm:text-base text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm text-gray-300 mb-1 block">Estado</label>
                <select
                  value={estado}
                  onChange={(e) => { setEstado(e.target.value); setPage(1); }}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm sm:text-base text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                >
                  <option value="todas">Todas</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
              <div>
                <label className="text-xs sm:text-sm text-gray-300 mb-1 block">Cancha</label>
                <select
                  value={canchaId}
                  onChange={(e) => { setCanchaId(e.target.value); setPage(1); }}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm sm:text-base text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                >
                  <option value="todas">Todas</option>
                  {loadingCanchas ? (
                    <option disabled>Cargando...</option>
                  ) : (
                    canchas.map(c => (
                      <option key={c.id} value={c.id}>
                        {formatNombreCancha(c)}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div>
                <label className="text-xs sm:text-sm text-gray-300 mb-1 block invisible">Acción</label>
                <button
                  onClick={resetFiltros}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-700 text-gray-200 rounded-lg hover:bg-gray-700/50 transition"
                >
                  <Filter className="w-4 h-4" /> Limpiar
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Vista de calendario o tabla */}
        {viewMode === 'calendario' ? (
          <CalendarioReservas reservas={reservas} canchas={canchas} />
        ) : (
          <>
            {/* Tabla */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[768px]">
              <thead className="bg-gray-800/70">
                <tr>
                  <th className="text-left text-gray-300 text-xs sm:text-sm font-semibold px-2 sm:px-4 py-3">Fecha</th>
                  <th className="text-left text-gray-300 text-xs sm:text-sm font-semibold px-2 sm:px-4 py-3">Hora</th>
                  <th className="text-left text-gray-300 text-xs sm:text-sm font-semibold px-2 sm:px-4 py-3">Cancha</th>
                  <th className="text-left text-gray-300 text-xs sm:text-sm font-semibold px-2 sm:px-4 py-3">Cliente</th>
                  <th className="text-left text-gray-300 text-xs sm:text-sm font-semibold px-2 sm:px-4 py-3">Estado</th>
                  {isAdmin && (
                    <th className="text-right text-gray-300 text-xs sm:text-sm font-semibold px-2 sm:px-4 py-3">Acciones</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="text-center text-gray-300 px-4 py-8">
                      Cargando reservas...
                    </td>
                  </tr>
                ) : filteredBySearch.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="text-center text-gray-400 px-4 py-8">
                      No hay reservas para mostrar.
                    </td>
                  </tr>
                ) : (
                  filteredBySearch.map((r) => (
                    <tr key={r.id} className="border-t border-gray-700/70 hover:bg-gray-700/20 transition-colors">
                      <td className="px-2 sm:px-4 py-3 text-gray-200 text-xs sm:text-sm whitespace-nowrap">{formatFecha(r.fecha)}</td>
                      <td className="px-2 sm:px-4 py-3 text-gray-200 text-xs sm:text-sm whitespace-nowrap">{r.hora_inicio}</td>
                      <td className="px-2 sm:px-4 py-3 text-gray-200 text-xs sm:text-sm">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#ffee00] flex-shrink-0" />
                          <span className="truncate">{formatNombreCancha(r.canchas)}</span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-3">
                        <div className="text-gray-100 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate max-w-[100px] sm:max-w-none">{r.clientes?.nombre || 'Cliente'}</span>
                        </div>
                        {r.clientes?.correo && (
                          <div className="text-gray-400 text-xs truncate max-w-[120px] sm:max-w-none">{r.clientes.correo}</div>
                        )}
                      </td>
                      <td className="px-2 sm:px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                          ${r.estado === 'confirmada' ? 'bg-green-600/30 text-green-300 border border-green-600/50' :
                            r.estado === 'pendiente' ? 'bg-yellow-600/30 text-yellow-300 border border-yellow-600/50' :
                            'bg-red-600/30 text-red-300 border border-red-600/50'}`}>
                          {r.estado}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-2 sm:px-4 py-3">
                          <div className="flex justify-end gap-1 sm:gap-2 flex-wrap">
                            {r.estado !== 'confirmada' && (
                              <button
                                onClick={() => cambiarEstado(r.id, 'confirmada')}
                                className="px-2 sm:px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm flex items-center gap-1"
                                title="Confirmar"
                              >
                                <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Confirmar</span>
                              </button>
                            )}
                            {r.estado !== 'cancelada' && (
                              <button
                                onClick={() => cambiarEstado(r.id, 'cancelada')}
                                className="px-2 sm:px-3 py-1.5 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white text-xs sm:text-sm flex items-center gap-1"
                                title="Cancelar"
                              >
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Cancelar</span>
                              </button>
                            )}
                            <button
                              onClick={() => eliminarReserva(r.id)}
                              className="px-2 sm:px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm flex items-center gap-1"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">Eliminar</span>
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3 sm:px-4 py-3 border-t border-gray-700">
            <div className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              Página {page} de {totalPages} • {total} resultados
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-2 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-700/50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-2 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-700/50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
            </div>
          </>
        )}
      </div>

      {/* Modal Nueva Reserva */}
      {openModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-xl bg-gray-900 border border-gray-700 rounded-xl">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#ffee00]" />
                Nueva Reserva
              </h3>
              <button
                onClick={() => setOpenModal(false)}
                className="p-1 rounded-lg hover:bg-gray-800 text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={guardarReserva} className="px-5 py-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Fecha</label>
                  <input
                    type="date"
                    value={form.fecha}
                    onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Hora inicio</label>
                  <input
                    type="time"
                    value={form.hora_inicio}
                    onChange={(e) => setForm({ ...form, hora_inicio: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-300 mb-1 block">Cancha</label>
                  <select
                    value={form.cancha_id}
                    onChange={(e) => setForm({ ...form, cancha_id: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                    required
                  >
                    <option value="">Selecciona una cancha</option>
                    {canchas.map(c => (
                      <option key={c.id} value={c.id}>
                        {formatNombreCancha(c)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-300 mb-1 block">Nombre del cliente</label>
                  <input
                    value={form.cliente_nombre}
                    onChange={(e) => setForm({ ...form, cliente_nombre: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                    placeholder="Juan Pérez"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Correo</label>
                  <input
                    type="email"
                    value={form.cliente_correo}
                    onChange={(e) => setForm({ ...form, cliente_correo: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                    placeholder="correo@dominio.com"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">Teléfono</label>
                  <input
                    value={form.cliente_telefono}
                    onChange={(e) => setForm({ ...form, cliente_telefono: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                    placeholder="+56 9 7426 5019"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-900/40 border border-red-700 text-red-200 px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-[#ffee00] text-black font-semibold hover:bg-[#e6d000] disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}