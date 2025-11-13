'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

const AdminModeContext = createContext();

export const useAdminMode = () => {
  const context = useContext(AdminModeContext);
  if (!context) {
    throw new Error('useAdminMode must be used within AdminModeProvider');
  }
  return context;
};

export const AdminModeProvider = ({ children }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  // Función para verificar si el usuario es admin consultando la tabla admin_users
  const checkIfUserIsAdmin = async (userId) => {
    console.log(`[AdminMode] 🔍 Verificando permisos de admin para userId: ${userId}`);
    
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, activo')
        .eq('user_id', userId)
        .eq('activo', true)
        .single();

      if (error) {
        // Si no encuentra el registro, no es admin
        console.log(`[AdminMode] ⚠️ Usuario NO es admin - no encontrado en admin_users o inactivo`);
        return false;
      }

      console.log(`[AdminMode] ✅ Usuario ES admin - registro encontrado:`, data);
      return data ? true : false;
    } catch (error) {
      console.error('[AdminMode] ❌ Error verificando permisos de admin:', error);
      return false;
    }
  };

  useEffect(() => {
    // Verificar sesión existente
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session?.user) {
          const userId = session.user.id;
          const userEmail = session.user.email;
          const isUserAdmin = await checkIfUserIsAdmin(userId);
          
          setUser(session.user);
          setIsAdmin(isUserAdmin);
          
          console.log(`[AdminMode] 🔐 Sesión detectada:`, {
            email: userEmail,
            userId: userId,
            isAdmin: isUserAdmin ? '✅ ES ADMIN' : '❌ NO ES ADMIN'
          });
          
          // Sincronizar con localStorage para el dashboard
          if (isUserAdmin) {
            localStorage.setItem('admin', JSON.stringify({
              correo: userEmail,
              rol: 'admin',
              userId: userId
            }));
          } else {
            localStorage.removeItem('admin');
          }
        } else {
          // No hay sesión activa, limpiar datos locales
          setUser(null);
          setIsAdmin(false);
          localStorage.removeItem('admin');
        }
      } catch (error) {
        console.error('Error verificando sesión:', error);
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem('admin');
      }
    };

    checkSession();

    // Escuchar cambios en el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          const userId = session.user.id;
          const userEmail = session.user.email;
          const isUserAdmin = await checkIfUserIsAdmin(userId);
          
          setUser(session.user);
          setIsAdmin(isUserAdmin);
          
          console.log(`[AdminMode] 🔄 Estado de autenticación actualizado:`, {
            email: userEmail,
            userId: userId,
            isAdmin: isUserAdmin ? '✅ ES ADMIN' : '❌ NO ES ADMIN'
          });
          
          // Sincronizar con localStorage
          if (isUserAdmin) {
            localStorage.setItem('admin', JSON.stringify({
              correo: userEmail,
              rol: 'admin',
              userId: userId
            }));
          } else {
            localStorage.removeItem('admin');
          }
        } else {
          // Usuario desconectado
          setUser(null);
          setIsAdmin(false);
          localStorage.removeItem('admin');
          setIsAdminMode(false); // También desactivar modo admin
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const toggleAdminMode = () => {
    if (isAdmin) {
      const newMode = !isAdminMode;
      setIsAdminMode(newMode);
      console.log(`[AdminMode] ${newMode ? '✏️ MODO EDICIÓN ACTIVADO' : '👁️ MODO VISTA ACTIVADO'}`);
    } else {
      console.warn('[AdminMode] ⚠️ Intento de toggle sin permisos de admin');
    }
  };

  const exitAdminMode = () => {
    setIsAdminMode(false);
  };

  return (
    <AdminModeContext.Provider value={{
      isAdminMode,
      isAdmin,
      toggleAdminMode,
      exitAdminMode
    }}>
      {children}
    </AdminModeContext.Provider>
  );
};

// Exportar el componente toggle
export const AdminModeToggle = ({ className = '' }) => {
  const { isAdminMode, toggleAdminMode, isAdmin } = useAdminMode();

  if (!isAdmin) return null;

  return (
    <button
      onClick={toggleAdminMode}
      className={`px-3 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg ${
        isAdminMode 
          ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
          : 'bg-[#ffee00] hover:bg-[#e6d000] text-black'
      } ${className}`}
    >
      {isAdminMode ? '🚫 Salir Admin' : '⚙️ Modo Admin'}
    </button>
  );
};