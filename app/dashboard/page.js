'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { 
  Users, 
  Calendar, 
  MapPin, 
  Trophy, 
  LogOut, 
  Activity,
  DollarSign,
  Clock,
  TrendingUp
} from 'lucide-react';

export default function Dashboard() {
  const [admin, setAdmin] = useState(null);
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

  useEffect(() => {
    // Verificar autenticación
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
      router.push('/login');
      return;
    }
    
    setAdmin(JSON.parse(adminData));
    loadDashboardData();
  }, [router]);

  const loadDashboardData = async () => {
    try {
      // Cargar estadísticas
      await Promise.all([
        loadGeneralStats(),
        loadTopClientes(),
        loadReservasRecientes()
      ]);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

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
    await supabase.auth.signOut();
    localStorage.removeItem('admin');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-[#ffee00] text-xl">Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950">
      {/* Header */}
      <header className="bg-gray-800/50 border-b border-gray-700 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#ffee00]">CitySoccer Admin</h1>
              <p className="text-gray-300">Panel de Administración</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white font-semibold">{admin?.correo}</p>
                <p className="text-gray-400 text-sm capitalize">{admin?.rol}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-800/50 rounded-xl p-6 h-fit">
            <nav className="space-y-2">
              {[
                { id: 'overview', label: 'Resumen', icon: Activity },
                { id: 'clientes', label: 'Clientes', icon: Users },
                { id: 'reservas', label: 'Reservas', icon: Calendar },
                { id: 'canchas', label: 'Canchas', icon: MapPin },
                { id: 'tarifas', label: 'Tarifas', icon: DollarSign },              
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'reservas') {
                      router.push('/dashboard/reservas');
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
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-8">
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

            {/* Otras pestañas */}
            {activeTab !== 'overview' && (
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
  );
}