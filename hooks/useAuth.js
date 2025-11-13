'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin' o 'empleado'
  const router = useRouter();

  useEffect(() => {
    // Verificar sesión existente
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error obteniendo sesión:', error);
          clearLocalSession();
          setLoading(false);
          return;
        }

        if (session?.user) {
          // Verificar si es admin en la tabla admin_users
          // Intentar con user_roles, si falla usar solo admin_users
          let adminData = null;
          let roleName = null;
          
          const { data, error } = await supabase
            .from('admin_users')
            .select('*, user_roles(nombre)')
            .eq('user_id', session.user.id)
            .eq('activo', true)
            .single();
          
          if (error) {
            // Si falla (probablemente porque user_roles no existe), intentar sin JOIN
            const { data: fallbackData } = await supabase
              .from('admin_users')
              .select('*')
              .eq('user_id', session.user.id)
              .eq('activo', true)
              .single();
            
            adminData = fallbackData;
            roleName = 'admin'; // Por defecto, todos son admin si no existe la tabla de roles
          } else {
            adminData = data;
            roleName = data?.user_roles?.nombre || 'admin';
          }
          
          const userIsAdmin = !!adminData;
          
          setUser(session.user);
          setIsAdmin(userIsAdmin && roleName === 'admin');
          setUserRole(roleName);
          
          // Sincronizar con localStorage
          if (userIsAdmin) {
            localStorage.setItem('admin', JSON.stringify({
              correo: session.user.email,
              rol: roleName,
              userId: session.user.id
            }));
          } else {
            localStorage.removeItem('admin');
          }
        } else {
          // No hay sesión activa, limpiar datos locales
          clearLocalSession();
        }
      } catch (error) {
        console.error('Error verificando sesión:', error);
        clearLocalSession();
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Escuchar cambios en el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          // Verificar si es admin en la tabla admin_users
          // Intentar con user_roles, si falla usar solo admin_users
          let adminData = null;
          let roleName = null;
          
          const { data, error } = await supabase
            .from('admin_users')
            .select('*, user_roles(nombre)')
            .eq('user_id', session.user.id)
            .eq('activo', true)
            .single();
          
          if (error) {
            // Si falla (probablemente porque user_roles no existe), intentar sin JOIN
            const { data: fallbackData } = await supabase
              .from('admin_users')
              .select('*')
              .eq('user_id', session.user.id)
              .eq('activo', true)
              .single();
            
            adminData = fallbackData;
            roleName = 'admin'; // Por defecto, todos son admin si no existe la tabla de roles
          } else {
            adminData = data;
            roleName = data?.user_roles?.nombre || 'admin';
          }
          
          const userIsAdmin = !!adminData;
          
          setUser(session.user);
          setIsAdmin(userIsAdmin && roleName === 'admin');
          setUserRole(roleName);
          
          // Sincronizar con localStorage
          if (userIsAdmin) {
            localStorage.setItem('admin', JSON.stringify({
              correo: session.user.email,
              rol: roleName,
              userId: session.user.id
            }));
          } else {
            localStorage.removeItem('admin');
          }
        } else {
          // Usuario desconectado
          clearLocalSession();
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const clearLocalSession = () => {
    setUser(null);
    setIsAdmin(false);
    setUserRole(null);
    localStorage.removeItem('admin');
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
      clearLocalSession();
      router.push('/login');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  const requireAuth = (redirectTo = '/login') => {
    if (!loading && !user) {
      router.push(redirectTo);
      return false;
    }
    return true;
  };

  const requireAdmin = (redirectTo = '/') => {
    if (!loading && (!user || !isAdmin)) {
      router.push(redirectTo);
      return false;
    }
    return true;
  };

  return {
    user,
    loading,
    isAdmin,
    userRole, // 'admin' o 'empleado'
    signOut,
    requireAuth,
    requireAdmin
  };
};