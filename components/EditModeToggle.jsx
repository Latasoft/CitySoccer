'use client';

import { useAdminMode } from '@/contexts/AdminModeContext';
import { Edit2, Eye } from 'lucide-react';
import Link from 'next/link';

const EditModeToggle = () => {
  const { isAdminMode, toggleAdminMode, isAdmin } = useAdminMode();

  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Toggle de modo edición */}
      <button
        onClick={toggleAdminMode}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
          isAdminMode
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
        title={isAdminMode ? 'Modo Vista Previa' : 'Modo Edición'}
      >
        {isAdminMode ? (
          <Eye className="w-6 h-6 text-white" />
        ) : (
          <Edit2 className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Indicador de estado */}
      {isAdminMode && (
        <div className="bg-green-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium flex items-center gap-2 animate-pulse">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          Modo Edición Activo
        </div>
      )}

      {/* Acceso rápido al dashboard */}
      <Link
        href="/dashboard"
        className="w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-full shadow-lg flex items-center justify-center transition-all"
        title="Ir al Dashboard"
      >
        <span className="text-white text-xl">📊</span>
      </Link>
    </div>
  );
};

export default EditModeToggle;
