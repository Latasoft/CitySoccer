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

  // Emails autorizados como administradores
  const adminEmails = [
    'benja@gmail.com',
    'admin@citysoccer.com',
    'administrador@citysoccer.com',
    'tiare.latasoft@gmail.com',
  ];

  useEffect(() => {
    // Verificar sesión existente
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session?.user) {
          const userEmail = session.user.email;
          const isUserAdmin = adminEmails.includes(userEmail.toLowerCase());
          
          setUser(session.user);
          setIsAdmin(isUserAdmin);
          
          // Sincronizar con localStorage para el dashboard
          if (isUserAdmin) {
            localStorage.setItem('admin', JSON.stringify({
              correo: userEmail,
              rol: 'admin',
              userId: session.user.id
            }));
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
          const userEmail = session.user.email;
          const isUserAdmin = adminEmails.includes(userEmail.toLowerCase());
          
          setUser(session.user);
          setIsAdmin(isUserAdmin);
          
          // Sincronizar con localStorage
          if (isUserAdmin) {
            localStorage.setItem('admin', JSON.stringify({
              correo: userEmail,
              rol: 'admin',
              userId: session.user.id
            }));
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
      setIsAdminMode(!isAdminMode);
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

      {/* Overlay de instrucciones cuando está en modo admin */}
      {isAdminMode && (
        <div className="fixed top-20 right-4 z-40 bg-black/90 text-white p-4 rounded-lg max-w-sm">
          <h3 className="font-bold text-[#ffee00] mb-2">🎯 Modo Administrador Activo</h3>
          <p className="text-sm">
            Haz clic en cualquier imagen del sitio para cambiarla. 
            Las imágenes editables mostrarán un borde amarillo al pasar el mouse.
          </p>
        </div>
      )}
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