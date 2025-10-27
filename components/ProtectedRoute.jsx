'use client';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAdmin, loading, requireAuth, requireAdmin: authRequireAdmin } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (requireAdmin) {
        authRequireAdmin();
      } else {
        requireAuth();
      }
    }
  }, [loading, requireAdmin, authRequireAdmin, requireAuth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ffee00] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <h2 className="text-2xl font-bold text-[#ffee00] mb-4">Acceso Denegado</h2>
          <p className="text-gray-300 mb-6">No tienes permisos de administrador para acceder a esta página.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-[#ffee00] text-black font-semibold rounded-lg hover:bg-[#e6d000] transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <h2 className="text-2xl font-bold text-[#ffee00] mb-4">Sesión Requerida</h2>
          <p className="text-gray-300 mb-6">Debes iniciar sesión para acceder a esta página.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 bg-[#ffee00] text-black font-semibold rounded-lg hover:bg-[#e6d000] transition-colors"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;