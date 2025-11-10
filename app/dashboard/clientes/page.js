'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import {
  Users,
  Search,
  Filter,
  Trophy,
  Calendar,
  MapPin,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';

export default function ClientesPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);

  // Datos
  const [clientes, setClientes] = useState([]);
  const [total, setTotal] = useState(0);
  const [canchas, setCanchas] = useState([]);

  // UI
  const [loading, setLoading] = useState(true);
  const [loadingCanchas, setLoadingCanchas] = useState(true);
  const [error, setError] = useState('');

  // Filtros y paginación
  const [search, setSearch] = useState('');
  const [canchaId, setCanchaId] = useState('todas');
  const [orderBy, setOrderBy] = useState('reservas_desc');
  const [page, setPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
      router.push('/login');
      return;
    }
    setAdmin(JSON.parse(adminData));
  }, [router]);

  useEffect(() => {
    loadCanchas();
  }, []);

  const fetchClientes = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Query para obtener clientes con reservas confirmadas
      let query = supabase
        .from('clientes')
        .select(`
          id,
          nombre,
          correo,
          telefono,
          creado_en,
          reservas!inner (
            id,
            cancha_id,
            estado,
            fecha
          )
        `, { count: 'exact' })
        .eq('reservas.estado', 'confirmada'); // Solo reservas confirmadas

      // Filtrar por cancha específica si se selecciona
      if (canchaId !== 'todas') {
        query = query.eq('reservas.cancha_id', Number(canchaId));
      }

      const { data: rawData, error } = await query;
      if (error) throw error;

      // Procesar datos para contar reservas confirmadas por cliente
      const clientesMap = new Map();
      
      if (rawData) {
        rawData.forEach(item => {
          const clienteId = item.id;
          if (!clientesMap.has(clienteId)) {
            clientesMap.set(clienteId, {
              id: item.id,
              nombre: item.nombre,
              correo: item.correo,
              telefono: item.telefono,
              creado_en: item.creado_en,
              reservas_confirmadas: 0
            });
          }
          
          const cliente = clientesMap.get(clienteId);
          cliente.reservas_confirmadas++;
        });
      }

      let clientesArray = Array.from(clientesMap.values());

      // Ordenar según la opción seleccionada
      switch (orderBy) {
        case 'reservas_desc':
          clientesArray.sort((a, b) => b.reservas_confirmadas - a.reservas_confirmadas);
          break;
        case 'reservas_asc':
          clientesArray.sort((a, b) => a.reservas_confirmadas - b.reservas_confirmadas);
          break;
        case 'nombre_asc':
          clientesArray.sort((a, b) => a.nombre.localeCompare(b.nombre));
          break;
        case 'nombre_desc':
          clientesArray.sort((a, b) => b.nombre.localeCompare(a.nombre));
          break;
      }

      setTotal(clientesArray.length);

      // Paginación
      const from = (page - 1) * pageSize;
      const paginatedClientes = clientesArray.slice(from, from + pageSize);
      
      setClientes(paginatedClientes);
    } catch (e) {
      console.error(e);
      setError('Error cargando clientes.');
    } finally {
      setLoading(false);
    }
  }, [page, canchaId, orderBy]);

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

  // useEffect para cargar datos
  useEffect(() => {
    loadCanchas();
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [page, canchaId, orderBy, fetchClientes]);

  const filteredBySearch = useMemo(() => {
    if (!search.trim()) return clientes;
    const s = search.toLowerCase();
    return clientes.filter(c => {
      const nombre = c.nombre?.toLowerCase() || '';
      const correo = c.correo?.toLowerCase() || '';
      const telefono = c.telefono || '';
      return nombre.includes(s) || correo.includes(s) || telefono.includes(s);
    });
  }, [clientes, search]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const resetFiltros = () => {
    setCanchaId('todas');
    setOrderBy('reservas_desc');
    setSearch('');
    setPage(1);
  };

  const formatNombreCancha = (cancha) => {
    if (!cancha) return 'Cancha desconocida';
    
    if (cancha.nombre && cancha.nombre.match(/^[a-zA-Z]+\d*_\d+$/)) {
      const parts = cancha.nombre.split('_');
      const tipo = parts[0].toUpperCase();
      const numero = parts[1];
      return `Cancha ${numero} ${tipo}`;
    }
    
    if (cancha.tipo && cancha.nombre) {
      return `Cancha ${cancha.nombre} ${cancha.tipo.toUpperCase()}`;
    }
    
    return cancha.nombre || `Cancha ${cancha.id}`;
  };

  if (!admin) {
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
              <h1 className="text-xl sm:text-2xl font-bold text-[#ffee00]">Clientes</h1>
              <p className="text-sm sm:text-base text-gray-300">Ranking de clientes por reservas confirmadas</p>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-700/50 transition whitespace-nowrap"
            >
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Filtros */}
        <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700 mb-4 sm:mb-6">
          <div className="flex flex-col gap-3">
            {/* Búsqueda */}
            <div className="w-full">
              <label className="text-xs sm:text-sm text-gray-300 mb-1 block">Buscar cliente</label>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Nombre, correo o teléfono..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm sm:text-base text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                />
              </div>
            </div>
            
            {/* Filtros en grid responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="text-xs sm:text-sm text-gray-300 mb-1 block">Filtrar por cancha</label>
                <select
                  value={canchaId}
                  onChange={(e) => { setCanchaId(e.target.value); setPage(1); }}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm sm:text-base text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                >
                  <option value="todas">Todas las canchas</option>
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
                <label className="text-xs sm:text-sm text-gray-300 mb-1 block">Ordenar por</label>
                <select
                  value={orderBy}
                  onChange={(e) => { setOrderBy(e.target.value); setPage(1); }}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm sm:text-base text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                >
                  <option value="reservas_desc">Más reservas</option>
                  <option value="reservas_asc">Menos reservas</option>
                  <option value="nombre_asc">Nombre A-Z</option>
                  <option value="nombre_desc">Nombre Z-A</option>
                </select>
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="text-xs sm:text-sm text-gray-300 mb-1 block invisible">Acción</label>
                <button
                  onClick={resetFiltros}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-700 text-gray-200 rounded-lg hover:bg-gray-700/50 transition"
                >
                  <Filter className="w-4 h-4" /> Limpiar filtros
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

        {/* Tabla de Clientes */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-800/70">
                <tr>
                  <th className="text-left text-gray-300 text-xs sm:text-sm font-semibold px-2 sm:px-4 py-3">#</th>
                  <th className="text-left text-gray-300 text-xs sm:text-sm font-semibold px-2 sm:px-4 py-3">Cliente</th>
                  <th className="text-left text-gray-300 text-xs sm:text-sm font-semibold px-2 sm:px-4 py-3">Contacto</th>
                  <th className="text-center text-gray-300 text-xs sm:text-sm font-semibold px-2 sm:px-4 py-3">Reservas</th>
                  <th className="text-left text-gray-300 text-xs sm:text-sm font-semibold px-2 sm:px-4 py-3">Desde</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-300 px-4 py-8">
                      Cargando clientes...
                    </td>
                  </tr>
                ) : filteredBySearch.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-400 px-4 py-8">
                      No hay clientes para mostrar.
                    </td>
                  </tr>
                ) : (
                  filteredBySearch.map((cliente, index) => (
                    <tr key={cliente.id} className="border-t border-gray-700/70 hover:bg-gray-700/20 transition-colors">
                      <td className="px-2 sm:px-4 py-3 sm:py-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          {orderBy.includes('reservas') && (
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#ffee00] text-black rounded-full flex items-center justify-center font-bold text-xs sm:text-sm">
                              {(page - 1) * pageSize + index + 1}
                            </div>
                          )}
                          {orderBy.includes('reservas') && cliente.reservas_confirmadas >= 10 && (
                            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" title="Cliente VIP (10+ reservas)" />
                          )}
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-white font-semibold text-xs sm:text-base truncate">{cliente.nombre}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4">
                        <div className="space-y-1">
                          {cliente.correo && (
                            <div className="flex items-center gap-1 sm:gap-2 text-gray-300 text-xs sm:text-sm">
                              <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                              <span className="truncate max-w-[150px] sm:max-w-none">{cliente.correo}</span>
                            </div>
                          )}
                          {cliente.telefono && (
                            <div className="flex items-center gap-1 sm:gap-2 text-gray-300 text-xs sm:text-sm">
                              <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                              <span>{cliente.telefono}</span>
                            </div>
                          )}
                          {!cliente.correo && !cliente.telefono && (
                            <span className="text-gray-500 text-xs sm:text-sm">Sin contacto</span>
                          )}
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-center">
                        <span className="bg-[#ffee00] text-black px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap">
                          {cliente.reservas_confirmadas}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4">
                        <div className="flex items-center gap-1 sm:gap-2 text-gray-300 text-xs sm:text-sm">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                          <span className="whitespace-nowrap">{new Date(cliente.creado_en).toLocaleDateString()}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3 sm:px-4 py-3 border-t border-gray-700">
              <div className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
                Página {page} de {totalPages} • {total} clientes
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-3 py-2 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="px-3 py-2 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Estadísticas resumen */}
        <div className="mt-4 sm:mt-6 bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-700">
          <div className="text-center text-gray-300 text-xs sm:text-base">
            <p>
              Mostrando <span className="text-[#ffee00] font-semibold">{filteredBySearch.length}</span> clientes
              {canchaId !== 'todas' && (
                <> filtrados por cancha seleccionada</>
              )}
              • Total de reservas confirmadas: <span className="text-green-400 font-semibold">
                {filteredBySearch.reduce((sum, c) => sum + c.reservas_confirmadas, 0)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}