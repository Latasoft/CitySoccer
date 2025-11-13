import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Cliente con Service Role Key (solo en servidor)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request) {
  try {
    const { action, ...data } = await request.json();

    switch (action) {
      case 'create':
        return await createUser(data);
      case 'delete':
        return await deleteUser(data);
      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error en API usuarios:', error);
    return NextResponse.json(
      { error: 'Error procesando solicitud', details: error.message },
      { status: 500 }
    );
  }
}

async function createUser({ nombre, correo, password, rol_id }) {
  try {
    // 1. Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: correo,
      password: password,
      email_confirm: true,
      user_metadata: {
        nombre: nombre
      }
    });

    if (authError) throw authError;

    // 2. Insertar en admin_users con el rol
    const { error: insertError } = await supabaseAdmin
      .from('admin_users')
      .insert({
        user_id: authData.user.id,
        email: correo,
        nombre: nombre,
        rol_id: rol_id,
        activo: true,
      });

    if (insertError) {
      // Si falla la inserción, eliminar el usuario de Auth
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      data: { user_id: authData.user.id, email: correo, nombre }
    });

  } catch (error) {
    console.error('Error creando usuario:', error);
    return NextResponse.json(
      { error: 'Error al crear el usuario', details: error.message },
      { status: 500 }
    );
  }
}

async function deleteUser({ userId }) {
  try {
    // 1. Eliminar de admin_users primero
    const { error: deleteError } = await supabaseAdmin
      .from('admin_users')
      .delete()
      .eq('user_id', userId);

    if (deleteError) throw deleteError;

    // 2. Eliminar de Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (authError) {
      console.warn('Error eliminando de Auth:', authError);
    }

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado correctamente'
    });

  } catch (error) {
    console.error('Error eliminando usuario:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el usuario', details: error.message },
      { status: 500 }
    );
  }
}
