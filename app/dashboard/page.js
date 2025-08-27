'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { 
  Users, 
  Calendar, 
  MapPin, 
  Trophy, 
  Settings, 
  LogOut, 
  Plus,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  Activity,
  DollarSign,
  Target
} from 'lucide-react';

export default function Dashboard() {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({
    totalJugadores: 0,
    totalEquipos: 0,
    partidosHoy: 0,
    ingresosMes: 0
  });
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
      const [jugadores, equipos, partidos] = await Promise.all([
        supabase.from('jugadores').select('id', { count: 'exact' }),
        supabase.from('equipos').select('id', { count: 'exact' }),
        supabase.from('partidos').select('id', { count: 'exact' }).gte('fecha', new Date().toISOString().split('T')[0])
      ]);

      setStats({
        totalJugadores: jugadores.count || 0,
        totalEquipos: equipos.count || 0,
        partidosHoy: partidos.count || 0,
        ingresosMes: 15000 // Placeholder - ajustar según tu lógica de negocio
      });
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
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
                { id: 'jugadores', label: 'Jugadores', icon: Users },
                { id: 'equipos', label: 'Equipos', icon: Trophy },
                { id: 'partidos', label: 'Partidos', icon: Calendar },
                { id: 'canchas', label: 'Canchas', icon: MapPin },
                { id: 'configuracion', label: 'Configuración', icon: Settings }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
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
                      title: 'Total Jugadores',
                      value: stats.totalJugadores,
                      icon: Users,
                      color: 'from-blue-500 to-blue-600',
                      change: '+12%'
                    },
                    {
                      title: 'Equipos Activos',
                      value: stats.totalEquipos,
                      icon: Trophy,
                      color: 'from-green-500 to-green-600',
                      change: '+8%'
                    },
                    {
                      title: 'Partidos Hoy',
                      value: stats.partidosHoy,
                      icon: Calendar,
                      color: 'from-purple-500 to-purple-600',
                      change: '+5%'
                    },
                    {
                      title: 'Ingresos del Mes',
                      value: `$${stats.ingresosMes.toLocaleString()}`,
                      icon: DollarSign,
                      color: 'from-yellow-500 to-yellow-600',
                      change: '+15%'
                    }
                  ].map((stat, index) => (
                    <div key={index} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-green-400 text-sm font-semibold">{stat.change}</span>
                      </div>
                      <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <h2 className="text-xl font-bold text-white mb-6">Acciones Rápidas</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Nuevo Jugador', icon: Plus, color: 'bg-blue-600' },
                      { label: 'Crear Equipo', icon: Plus, color: 'bg-green-600' },
                      { label: 'Programar Partido', icon: Calendar, color: 'bg-purple-600' },
                      { label: 'Ver Reportes', icon: Eye, color: 'bg-orange-600' }
                    ].map((action, index) => (
                      <button
                        key={index}
                        className={`${action.color} hover:opacity-90 text-white p-4 rounded-lg flex items-center gap-3 transition-all hover:scale-105`}
                      >
                        <action.icon className="w-5 h-5" />
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <h2 className="text-xl font-bold text-white mb-6">Actividad Reciente</h2>
                  <div className="space-y-4">
                    {[
                      { action: 'Nuevo jugador registrado', user: 'Carlos Mendoza', time: 'Hace 2 horas' },
                      { action: 'Partido programado', user: 'Equipo A vs Equipo B', time: 'Hace 4 horas' },
                      { action: 'Equipo creado', user: 'Los Tigres FC', time: 'Hace 1 día' },
                      { action: 'Pago procesado', user: '$500 - Inscripción', time: 'Hace 1 día' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{activity.action}</p>
                          <p className="text-gray-400 text-sm">{activity.user}</p>
                        </div>
                        <span className="text-gray-400 text-sm">{activity.time}</span>
                      </div>
                    ))}
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