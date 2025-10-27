'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

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
        
        if (error) {
          console.error('Error obteniendo sesión:', error);
          clearLocalSession();
          setLoading(false);
          return;
        }

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
    signOut,
    requireAuth,
    requireAdmin
  };
};