'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAdminMode } from '@/contexts/AdminModeContext';
import { useAuth } from '@/hooks/useAuth';
import { 
  Users, 
  Calendar, 
  MapPin, 
  Trophy, 
  LogOut, 
  Activity,
  DollarSign,
  Clock,
  TrendingUp,
  Images,
  Menu
} from 'lucide-react';

// Importar componentes de administración
import PricesAdmin from './components/PricesAdminGrid';
import ImageAdmin from './components/ImageAdmin';
import HorariosAdmin from './components/HorariosAdmin';
import NavigationAdmin from './components/NavigationAdmin';

export default function Dashboard() {
  const { isAdmin: isAdminMode } = useAdminMode();
  const { user, loading: authLoading, isAdmin, userRole } = useAuth();
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalReservas: 0,
    reservasHoy: 0,
    ingresosMes: 0
  });
  const [topClientes, setTopClientes] = useState([]);
  const [reservasRecientes, setReservasRecientes] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Función para cargar datos del dashboard
  const loadDashboardData = useCallback(async () => {
    let timeoutId = null;
    
    try {
      // Timeout de seguridad: forzar loading=false después de 15 segundos
      timeoutId = setTimeout(() => {
        console.error('⏱️ TIMEOUT cargando dashboard (15s)');
        setLoading(false);
      }, 15000);
      
      // Cargar estadísticas
      await Promise.all([
        loadGeneralStats(),
        loadTopClientes(),
        loadReservasRecientes()
      ]);
      
      // Cancelar timeout si terminó bien
      if (timeoutId) clearTimeout(timeoutId);
    } catch (error) {
      console.error('Error cargando datos:', error);
      if (timeoutId) clearTimeout(timeoutId);
    } finally {
      // SIEMPRE cambiar loading a false
      setLoading(false);
    }
  }, []);

  // Verificar autenticación y cargar datos
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    
    if (user && !authLoading) {
      // Cargar datos solo para admins
      if (userRole === 'admin') {
        loadDashboardData();
      } else {
        // Para empleados, no redirigir automáticamente
        // Solo cargar cuando estén en la página
        setLoading(false);
      }
    }
  }, [authLoading, user, userRole, router, loadDashboardData]);

  const loadGeneralStats = async () => {
    try {
      // Total clientes únicos
      const { data: clientesData, error: clientesError } = await supabase
        .from('clientes')
        .select('id', { count: 'exact' });

      // Total reservas
      const { data: reservasData, error: reservasError } = await supabase
        .from('reservas')
        .select('id', { count: 'exact' });

      // Reservas de hoy
      const hoy = new Date().toISOString().split('T')[0];
      const { data: reservasHoyData, error: reservasHoyError } = await supabase
        .from('reservas')
        .select('id', { count: 'exact' })
        .eq('fecha', hoy);

      // Calcular ingresos del mes
      const inicioMes = new Date();
      inicioMes.setDate(1);
      const { data: reservasMes } = await supabase
        .from('reservas')
        .select('*')
        .gte('fecha', inicioMes.toISOString().split('T')[0]);

      // Calcular ingresos estimados (precio promedio por tipo de cancha)
      let ingresosMes = 0;
      if (reservasMes) {
        ingresosMes = reservasMes.length * 35000; // Precio promedio estimado
      }

      setStats({
        totalClientes: clientesData?.length || 0,
        totalReservas: reservasData?.length || 0,
        reservasHoy: reservasHoyData?.length || 0,
        ingresosMes
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const loadTopClientes = async () => {
    try {
      const { data: reservas } = await supabase
        .from('reservas')
        .select(`
          cliente_id,
          clientes(nombre, correo)
        `)
        .not('cliente_id', 'is', null);

      if (reservas) {
        // Contar reservas por cliente
        const clienteCount = {};
        reservas.forEach(reserva => {
          const clienteId = reserva.cliente_id;
          if (clienteId && reserva.clientes) {
            if (!clienteCount[clienteId]) {
              clienteCount[clienteId] = {
                count: 0,
                cliente: reserva.clientes
              };
            }
            clienteCount[clienteId].count++;
          }
        });

        // Convertir a array y ordenar
        const topClientes = Object.entries(clienteCount)
          .map(([id, data]) => ({
            id,
            nombre: data.cliente?.nombre || 'Cliente',
            correo: data.cliente?.correo || '',
            reservas: data.count
          }))
          .sort((a, b) => b.reservas - a.reservas)
          .slice(0, 5);

        setTopClientes(topClientes);
      }
    } catch (error) {
      console.error('Error cargando top clientes:', error);
    }
  };

  const loadReservasRecientes = async () => {
    try {
      const { data } = await supabase
        .from('reservas')
        .select(`
          *,
          clientes(nombre, correo),
          canchas(nombre, tipo)
        `)
        .order('creado_en', { ascending: false })
        .limit(6);

      setReservasRecientes(data || []);
    } catch (error) {
      console.error('Error cargando reservas recientes:', error);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true); // Mostrar indicador de carga
      await supabase.auth.signOut();
      localStorage.removeItem('admin');
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Forzar limpieza local y redirigir
      localStorage.removeItem('admin');
      router.push('/login');
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-[#ffee00] text-xl">Cargando dashboard...</div>
      </div>
    );
  }
  
  // Vista simple para empleados
  if (userRole === 'empleado') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950">
        {/* Header */}
        <header className="bg-gray-800/50 border-b border-gray-700 backdrop-blur-sm">
          <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#ffee00]">CitySoccer - Panel Empleado</h1>
                <p className="text-sm sm:text-base text-gray-300">Consulta de Reservas</p>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="text-left sm:text-right flex-1 sm:flex-initial">
                  <p className="text-white font-semibold text-sm sm:text-base truncate">{user?.email}</p>
                  <p className="text-gray-400 text-xs sm:text-sm">Empleado</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors text-sm sm:text-base whitespace-nowrap"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Cerrar Sesión</span>
                  <span className="sm:hidden">Salir</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido para empleados */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-8 text-center">
              <Calendar className="w-16 h-16 text-[#ffee00] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Gestión de Reservas</h2>
              <p className="text-gray-300 mb-6">
                Accede a la vista de reservas para consultar y gestionar las reservas de los clientes
              </p>
              <button
                onClick={() => router.push('/dashboard/reservas')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#ffee00] text-black font-semibold rounded-lg hover:bg-[#e6d000] transition"
              >
                <Calendar className="w-5 h-5" />
                Ver Reservas
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950">
      {/* Header */}
      <header className="bg-gray-800/50 border-b border-gray-700 backdrop-blur-sm">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#ffee00]">CitySoccer Admin</h1>
              <p className="text-sm sm:text-base text-gray-300">Panel de Administración</p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="text-left sm:text-right flex-1 sm:flex-initial">
                <p className="text-white font-semibold text-sm sm:text-base truncate">{user?.email}</p>
                <p className="text-gray-400 text-xs sm:text-sm capitalize">
                  {userRole === 'admin' ? 'Administrador' : 'Empleado'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors text-sm sm:text-base whitespace-nowrap"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
                <span className="sm:hidden">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Sidebar - Horizontal en móvil, vertical en desktop */}
            <aside className="w-full lg:w-64 flex-shrink-0">
            {/* Vista móvil - Tabs horizontales con scroll */}
            <nav className="lg:hidden overflow-x-auto pb-2">
              <div className="flex gap-2 min-w-max">
                {[
                  { id: 'overview', label: 'Resumen', icon: Activity },
                  { id: 'clientes', label: 'Clientes', icon: Users },
                  { id: 'reservas', label: 'Reservas', icon: Calendar },
                  { id: 'canchas', label: 'Canchas', icon: MapPin },
                  { id: 'precios', label: 'Precios', icon: DollarSign },
                  { id: 'horarios', label: 'Horarios', icon: Clock },
                  { id: 'usuarios', label: 'Usuarios', icon: Users },
                  { id: 'navegacion', label: 'Menú', icon: Menu },
                  { id: 'imagenes', label: 'Imágenes', icon: Images },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'reservas') {
                        router.push('/dashboard/reservas');
                      } else if (item.id === 'clientes') {
                        router.push('/dashboard/clientes');
                      } else if (item.id === 'usuarios') {
                        router.push('/dashboard/usuarios');
                      } else {
                        setActiveTab(item.id);
                      }
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap text-sm ${
                      activeTab === item.id
                        ? 'bg-[#ffee00] text-black font-semibold'
                        : 'text-gray-300 bg-gray-800/50 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </nav>

            {/* Vista desktop - Sidebar vertical */}
            <nav className="hidden lg:block bg-gray-800/50 rounded-xl p-6">
              <div className="space-y-2">
                {[
                  { id: 'overview', label: 'Resumen', icon: Activity },
                  { id: 'clientes', label: 'Clientes', icon: Users },
                  { id: 'reservas', label: 'Reservas', icon: Calendar },
                  { id: 'canchas', label: 'Canchas', icon: MapPin },
                  { id: 'precios', label: 'Precios', icon: DollarSign },
                  { id: 'horarios', label: 'Config Horarios', icon: Clock },
                  { id: 'usuarios', label: 'Usuarios', icon: Users },
                  { id: 'navegacion', label: 'Navegación', icon: Menu },
                  { id: 'imagenes', label: 'Imágenes', icon: Images },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'reservas') {
                        router.push('/dashboard/reservas');
                      } else if (item.id === 'clientes') {
                        router.push('/dashboard/clientes');
                      } else if (item.id === 'usuarios') {
                        router.push('/dashboard/usuarios');
                      } else {
                        setActiveTab(item.id);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-[#ffee00] text-black font-semibold'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 w-full lg:w-auto overflow-x-hidden">
            {activeTab === 'overview' && (
              <div className="space-y-6 sm:space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      title: 'Total Clientes',
                      value: stats.totalClientes,
                      icon: Users,
                      color: 'from-blue-500 to-blue-600',
                      change: '+12%',
                      clickable: false
                    },
                    {
                      title: 'Total Reservas',
                      value: stats.totalReservas,
                      icon: Calendar,
                      color: 'from-green-500 to-green-600',
                      change: '+8%',
                      clickable: true,
                      action: () => router.push('/dashboard/reservas')
                    },
                    {
                      title: 'Reservas Hoy',
                      value: stats.reservasHoy,
                      icon: Clock,
                      color: 'from-purple-500 to-purple-600',
                      change: '+5%',
                      clickable: true,
                      action: () => {
                        const today = new Date().toISOString().split('T')[0];
                        router.push(`/dashboard/reservas?fecha=${today}`);
                      }
                    },
                    {
                      title: 'Ingresos del Mes',
                      value: `$${stats.ingresosMes.toLocaleString()}`,
                      icon: DollarSign,
                      color: 'from-yellow-500 to-yellow-600',
                      change: '+15%',
                      clickable: false
                    }
                  ].map((stat, index) => (
                    <div 
                      key={index} 
                      className={`bg-gray-800/50 rounded-xl p-6 border border-gray-700 ${
                        stat.clickable ? 'cursor-pointer hover:bg-gray-800/70 transition-colors' : ''
                      }`}
                      onClick={stat.clickable ? stat.action : undefined}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-green-400 text-sm font-semibold">{stat.change}</span>
                      </div>
                      <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                      {stat.clickable && (
                        <p className="text-[#ffee00] text-xs mt-2">Click para ver detalles →</p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Top Clientes */}
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                      <Trophy className="w-6 h-6 text-[#ffee00]" />
                      Clientes Más Frecuentes
                    </h2>
                    <div className="space-y-4">
                      {topClientes.map((cliente, index) => (
                        <div key={cliente.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 bg-[#ffee00] text-black rounded-full flex items-center justify-center font-bold">
                              {index + 1}
                            </span>
                            <div>
                              <p className="text-white font-medium">{cliente.nombre}</p>
                              <p className="text-gray-300 text-sm">{cliente.correo}</p>
                            </div>
                          </div>
                          <span className="bg-[#ffee00] text-black px-3 py-1 rounded-full text-sm font-bold">
                            {cliente.reservas} reservas
                          </span>
                        </div>
                      ))}
                      {topClientes.length === 0 && (
                        <p className="text-gray-400 text-center py-4">No hay datos de clientes disponibles</p>
                      )}
                    </div>
                  </div>

                  {/* Reservas Recientes */}
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-white flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-[#ffee00]" />
                        Reservas Recientes
                      </h2>
                      <button
                        onClick={() => router.push('/dashboard/reservas')}
                        className="text-[#ffee00] hover:text-[#e6d000] text-sm font-medium transition-colors"
                      >
                        Ver todas →
                      </button>
                    </div>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {reservasRecientes.map((reserva) => (
                        <div key={reserva.id} className="p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors cursor-pointer"
                             onClick={() => router.push('/dashboard/reservas')}>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-white font-medium">
                                {reserva.clientes?.nombre || 'Cliente'}
                              </p>
                              <p className="text-gray-300 text-sm">
                                {reserva.clientes?.correo}
                              </p>
                              <p className="text-[#ffee00] text-sm">
                                {reserva.canchas?.nombre || `Cancha ${reserva.cancha_id}`} - {reserva.fecha}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {reserva.hora_inicio} - Estado: 
                                <span className={`ml-1 px-2 py-0.5 rounded text-xs font-semibold
                                  ${reserva.estado === 'confirmada' ? 'bg-green-600/30 text-green-300' :
                                    reserva.estado === 'pendiente' ? 'bg-yellow-600/30 text-yellow-300' :
                                    'bg-red-600/30 text-red-300'}`}>
                                  {reserva.estado}
                                </span>
                              </p>
                            </div>
                            <span className="text-xs text-gray-400">
                              {new Date(reserva.creado_en).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                      {reservasRecientes.length === 0 && (
                        <p className="text-gray-400 text-center py-4">No hay reservas recientes</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pestañas de administración */}
            {activeTab === 'precios' && <PricesAdmin />}
            {activeTab === 'horarios' && <HorariosAdmin />}
            {activeTab === 'navegacion' && <NavigationAdmin />}
            {activeTab === 'imagenes' && <ImageAdmin />}

            {/* Otras pestañas */}
            {!['overview', 'precios', 'horarios', 'navegacion', 'imagenes'].includes(activeTab) && (
              <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 text-center">
                <div className="text-[#ffee00] text-6xl mb-4">🚧</div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Sección en Desarrollo
                </h2>
                <p className="text-gray-400 mb-6">
                  La sección de {activeTab} estará disponible próximamente.
                </p>
                <button
                  onClick={() => setActiveTab('overview')}
                  className="px-6 py-3 bg-[#ffee00] text-black font-semibold rounded-lg hover:bg-[#e6d000] transition-colors"
                >
                  Volver al Resumen
                </button>
              </div>
            )}
          </main>
          </div>
        </div>
      </div>
    </div>
  );
}