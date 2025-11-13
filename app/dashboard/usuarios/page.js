'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { Plus, X, Mail, User, Lock, Eye, EyeOff, Trash2, UserCheck, UserX } from 'lucide-react';

export default function UsuariosPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAdmin } = useAuth();

  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    password: '',
    rol_id: 2, // Por defecto empleado
  });

  // Verificar que sea admin
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/dashboard');
    }
  }, [authLoading, user, isAdmin, router]);

  // Cargar roles
  useEffect(() => {
    loadRoles();
  }, []);

  // Cargar usuarios
  useEffect(() => {
    if (user && isAdmin) {
      loadUsuarios();
    }
  }, [user, isAdmin]);

  const loadRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      setRoles(data || []);
    } catch (e) {
      console.error('Error cargando roles:', e);
    }
  };

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔍 Intentando cargar usuarios con user_roles JOIN...');
      
      // Intentar cargar con user_roles
      const { data, error } = await supabase
        .from('admin_users')
        .select(`
          id,
          user_id,
          email,
          nombre,
          activo,
          creado_en,
          user_roles (
            id,
            nombre,
            descripcion
          )
        `)
        .order('creado_en', { ascending: false });

      if (error) {
        console.error('❌ Error con JOIN:', error);
        console.log('🔄 Intentando sin JOIN...');
        
        // Si falla, intentar sin JOIN
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('admin_users')
          .select('id, user_id, email, nombre, activo, creado_en, rol_id')
          .order('creado_en', { ascending: false });
        
        if (fallbackError) {
          console.error('❌ Error sin JOIN también:', fallbackError);
          throw fallbackError;
        }
        
        console.log('✅ Datos cargados sin JOIN:', fallbackData);
        
        // Agregar rol basado en rol_id
        const usuariosConRol = (fallbackData || []).map(u => ({
          ...u,
          user_roles: {
            id: u.rol_id || 1,
            nombre: u.rol_id === 2 ? 'empleado' : 'admin',
            descripcion: u.rol_id === 2 ? 'Empleado' : 'Administrador'
          }
        }));
        
        console.log('✅ Usuarios con roles asignados:', usuariosConRol);
        setUsuarios(usuariosConRol);
      } else {
        console.log('✅ Datos cargados con JOIN:', data);
        setUsuarios(data || []);
      }
    } catch (e) {
      console.error('❌ Error fatal cargando usuarios:', e);
      console.error('Detalles del error:', {
        message: e.message,
        hint: e.hint,
        details: e.details,
        code: e.code
      });
      setError(`Error: ${e.message || 'Desconocido'}. Revisa la consola para más detalles.`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNew = () => {
    setForm({
      nombre: '',
      correo: '',
      password: '',
      rol_id: 2, // Empleado por defecto
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setForm({
      nombre: '',
      correo: '',
      password: '',
      rol_id: 2,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.nombre || !form.correo || !form.password) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      setSaving(true);
      setError('');

      // Llamar a API route para crear usuario (usa Service Role Key)
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          nombre: form.nombre,
          correo: form.correo,
          password: form.password,
          rol_id: form.rol_id
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.details || result.error || 'Error desconocido');
      }

      alert('✅ Usuario creado exitosamente');
      handleCloseModal();
      loadUsuarios();
    } catch (e) {
      console.error('Error creando usuario:', e);
      setError(e.message || 'Error al crear el usuario');
      alert('Error al crear el usuario: ' + (e.message || 'Desconocido'));
    } finally {
      setSaving(false);
    }
  };

  const toggleActivo = async (usuarioId, currentActivo) => {
    if (!confirm(`¿Estás seguro de ${currentActivo ? 'desactivar' : 'activar'} este usuario?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ activo: !currentActivo })
        .eq('id', usuarioId);

      if (error) throw error;

      alert(`✅ Usuario ${currentActivo ? 'desactivado' : 'activado'} correctamente`);
      loadUsuarios();
    } catch (e) {
      console.error('Error actualizando usuario:', e);
      alert('Error al actualizar el usuario');
    }
  };

  const eliminarUsuario = async (usuarioId, userId) => {
    if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      // Llamar a API route para eliminar usuario
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          userId: userId
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.details || result.error || 'Error desconocido');
      }

      alert('✅ Usuario eliminado correctamente');
      loadUsuarios();
    } catch (e) {
      console.error('Error eliminando usuario:', e);
      alert('Error al eliminar el usuario: ' + (e.message || 'Desconocido'));
    }
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center">
        <div className="text-gray-300">Verificando permisos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#ffee00]">Gestión de Usuarios</h1>
              <p className="text-gray-300">Administrar empleados y permisos</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-700/50 transition"
              >
                Volver
              </Link>
              <button
                onClick={handleOpenNew}
                className="flex items-center gap-2 px-4 py-2 bg-[#ffee00] text-black font-semibold rounded-lg hover:bg-[#e6d000] transition"
              >
                <Plus className="w-4 h-4" /> Nuevo Usuario
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Tabla de usuarios */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/70">
                <tr>
                  <th className="text-left text-gray-300 text-sm font-semibold px-4 py-3">Nombre</th>
                  <th className="text-left text-gray-300 text-sm font-semibold px-4 py-3">Correo</th>
                  <th className="text-left text-gray-300 text-sm font-semibold px-4 py-3">Rol</th>
                  <th className="text-left text-gray-300 text-sm font-semibold px-4 py-3">Estado</th>
                  <th className="text-left text-gray-300 text-sm font-semibold px-4 py-3">Fecha Creación</th>
                  <th className="text-right text-gray-300 text-sm font-semibold px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-300 px-4 py-8">
                      Cargando usuarios...
                    </td>
                  </tr>
                ) : usuarios.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-400 px-4 py-8">
                      No hay usuarios registrados.
                    </td>
                  </tr>
                ) : (
                  usuarios.map((u) => (
                    <tr key={u.id} className="border-t border-gray-700/70 hover:bg-gray-700/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-gray-200">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{u.nombre}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{u.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          u.user_roles?.nombre === 'admin'
                            ? 'bg-purple-600/30 text-purple-300 border border-purple-600/50'
                            : 'bg-blue-600/30 text-blue-300 border border-blue-600/50'
                        }`}>
                          {u.user_roles?.nombre || 'Sin rol'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          u.activo
                            ? 'bg-green-600/30 text-green-300 border border-green-600/50'
                            : 'bg-gray-600/30 text-gray-300 border border-gray-600/50'
                        }`}>
                          {u.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-sm">
                        {new Date(u.creado_en).toLocaleDateString('es-CL')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => toggleActivo(u.id, u.activo)}
                            className={`px-3 py-1.5 rounded-lg text-white text-sm flex items-center gap-1 ${
                              u.activo
                                ? 'bg-yellow-600 hover:bg-yellow-700'
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                            title={u.activo ? 'Desactivar' : 'Activar'}
                          >
                            {u.activo ? (
                              <><UserX className="w-4 h-4" /> Desactivar</>
                            ) : (
                              <><UserCheck className="w-4 h-4" /> Activar</>
                            )}
                          </button>
                          <button
                            onClick={() => eliminarUsuario(u.id, u.user_id)}
                            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm flex items-center gap-1"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" /> Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Nuevo Usuario */}
      {openModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="text-lg font-bold text-[#ffee00]">Nuevo Usuario</h3>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-700 rounded-lg transition"
                disabled={saving}
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Nombre */}
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Nombre Completo *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Juan Pérez"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                    required
                    disabled={saving}
                  />
                </div>
              </div>

              {/* Correo */}
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Correo Electrónico *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={form.correo}
                    onChange={(e) => setForm({ ...form, correo: e.target.value })}
                    placeholder="usuario@example.com"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                    required
                    disabled={saving}
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Contraseña *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-10 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                    required
                    minLength={6}
                    disabled={saving}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    disabled={saving}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Debe tener al menos 6 caracteres</p>
              </div>

              {/* Rol */}
              <div>
                <label className="text-sm text-gray-300 mb-1 block">Rol *</label>
                <select
                  value={form.rol_id}
                  onChange={(e) => setForm({ ...form, rol_id: parseInt(e.target.value) })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#ffee00]"
                  required
                  disabled={saving}
                >
                  {roles.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre.charAt(0).toUpperCase() + rol.nombre.slice(1)} - {rol.descripcion}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#ffee00] hover:bg-[#e6d000] text-black font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={saving}
                >
                  {saving ? 'Creando...' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
