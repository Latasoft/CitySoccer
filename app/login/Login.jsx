'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Buscar el administrador en la tabla
      const { data: admin, error: queryError } = await supabase
        .from('administradores')
        .select('*')
        .eq('correo', email)
        .eq('contrasena', password) // En producción, deberías usar hash para las contraseñas
        .single();

      if (queryError || !admin) {
        setError('Credenciales incorrectas. Verifica tu correo y contraseña.');
      } else {
        // Guardar información del administrador en localStorage o sessionStorage
        localStorage.setItem('admin', JSON.stringify({
          id: admin.id,
          correo: admin.correo,
          rol: admin.rol
        }));
        
        // Redirigir al dashboard
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Error inesperado. Intenta nuevamente.');
      console.error('Error de login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen py-20 bg-gradient-to-br from-black via-gray-900 to-gray-950 overflow-hidden flex items-center justify-center">
      <div className="container mx-auto px-6 max-w-md relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#eeff00] leading-tight">
            ADMINISTRADOR
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Acceso al panel de administración
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 shadow-2xl border border-gray-700">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="group">
              <label className="block text-white font-semibold mb-3">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-[#ffee00] transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ffee00] focus:ring-2 focus:ring-[#ffee00]/20 transition-all duration-300"
                  placeholder="admin@citysoccer.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="block text-white font-semibold mb-3">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-[#ffee00] transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ffee00] focus:ring-2 focus:ring-[#ffee00]/20 transition-all duration-300"
                  placeholder="Tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#ffee00] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full mt-8 bg-gradient-to-br from-[#ffee00] to-[#e6d000] rounded-lg p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="flex items-center justify-center gap-3">
                <LogIn className="w-5 h-5 text-gray-900 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-lg font-bold text-gray-900 group-hover:text-black transition-colors">
                  {loading ? 'Verificando...' : 'Acceder al Panel'}
                </span>
              </div>
            </button>
          </form>

          {/* Admin Info */}
          <div className="mt-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
            <p className="text-gray-300 text-sm text-center">
              <span className="text-[#ffee00] font-semibold">Nota:</span> Solo administradores autorizados pueden acceder
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}