import { supabase } from './supabaseClient';

// ===========================================
// SERVICIOS PARA GESTIÓN DE CONFIGURACIÓN
// ===========================================

// Servicio para configuraciones generales (teléfonos, emails, redes sociales)
export const configService = {
  // Obtener todas las configuraciones
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('configuraciones')
        .select('*')
        .order('categoria');
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo configuraciones:', error);
      return { data: null, error };
    }
  },

  // Obtener configuración por clave
  getByKey: async (clave) => {
    try {
      const { data, error } = await supabase
        .from('configuraciones')
        .select('*')
        .eq('clave', clave)
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error(`Error obteniendo configuración ${clave}:`, error);
      return { data: null, error };
    }
  },

  // Actualizar configuración
  update: async (id, valor) => {
    try {
      const { data, error } = await supabase
        .from('configuraciones')
        .update({ 
          valor,
          actualizado_en: new Date().toISOString()
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error actualizando configuración:', error);
      return { data: null, error };
    }
  },

  // Crear nueva configuración
  create: async (configuracion) => {
    try {
      const { data, error } = await supabase
        .from('configuraciones')
        .insert([{
          ...configuracion,
          creado_en: new Date().toISOString(),
          actualizado_en: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creando configuración:', error);
      return { data: null, error };
    }
  }
};

// Servicio para precios
export const pricesService = {
  // Obtener todos los precios
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('precios')
        .select('*')
        .order('tipo_cancha', { ascending: true })
        .order('dia_semana', { ascending: true })
        .order('hora', { ascending: true });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo precios:', error);
      return { data: null, error };
    }
  },

  // Obtener precios por tipo de cancha
  getByType: async (tipoCancha) => {
    try {
      const { data, error } = await supabase
        .from('precios')
        .select('*')
        .eq('tipo_cancha', tipoCancha)
        .order('dia_semana', { ascending: true })
        .order('hora', { ascending: true });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error(`Error obteniendo precios para ${tipoCancha}:`, error);
      return { data: null, error };
    }
  },

  // Actualizar precio
  update: async (id, precio) => {
    try {
      const { data, error } = await supabase
        .from('precios')
        .update({ 
          precio,
          actualizado_en: new Date().toISOString()
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error actualizando precio:', error);
      return { data: null, error };
    }
  },

  // Crear precio
  create: async (precioData) => {
    try {
      const { data, error } = await supabase
        .from('precios')
        .insert([{
          ...precioData,
          creado_en: new Date().toISOString(),
          actualizado_en: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creando precio:', error);
      return { data: null, error };
    }
  },

  // Actualizar múltiples precios
  updateBatch: async (precios) => {
    try {
      const updates = precios.map(precio => ({
        ...precio,
        actualizado_en: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('precios')
        .upsert(updates, { onConflict: 'id' })
        .select();
      
      if (error) {
        console.error('❌ Error de Supabase en updateBatch:', error);
        throw error;
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('💥 Error actualizando precios en lote:', error);
      return { data: null, error };
    }
  }
};

// Servicio para gestión de imágenes
export const imageService = {
  // Obtener todas las imágenes
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('imagenes')
        .select('*')
        .order('categoria')
        .order('nombre');
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo imágenes:', error);
      return { data: null, error };
    }
  },

  // Obtener imágenes por categoría
  getByCategory: async (categoria) => {
    try {
      const { data, error } = await supabase
        .from('imagenes')
        .select('*')
        .eq('categoria', categoria)
        .order('nombre');
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error(`Error obteniendo imágenes de categoría ${categoria}:`, error);
      return { data: null, error };
    }
  },

  // Subir imagen a Supabase Storage
  upload: async (file, categoria, nombre) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${categoria}/${nombre}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('imagenes')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('imagenes')
        .getPublicUrl(fileName);

      // Guardar referencia en la base de datos
      const { data: dbData, error: dbError } = await supabase
        .from('imagenes')
        .upsert([{
          nombre,
          categoria,
          url: publicUrl,
          archivo_nombre: fileName,
          creado_en: new Date().toISOString(),
          actualizado_en: new Date().toISOString()
        }])
        .select();

      if (dbError) throw dbError;

      return { data: dbData[0], error: null };
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      return { data: null, error };
    }
  },

  // Eliminar imagen
  delete: async (id) => {
    try {
      // Obtener información de la imagen
      const { data: imagen, error: getError } = await supabase
        .from('imagenes')
        .select('archivo_nombre')
        .eq('id', id)
        .single();

      if (getError) throw getError;

      // Eliminar archivo del storage
      const { error: storageError } = await supabase.storage
        .from('imagenes')
        .remove([imagen.archivo_nombre]);

      if (storageError) throw storageError;

      // Eliminar referencia de la base de datos
      const { data, error } = await supabase
        .from('imagenes')
        .delete()
        .eq('id', id)
        .select();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error eliminando imagen:', error);
      return { data: null, error };
    }
  }
};

// Servicio para contenido editable
export const contentService = {
  // Obtener todo el contenido
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('contenido_editable')
        .select('*')
        .order('seccion')
        .order('clave');
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo contenido:', error);
      return { data: null, error };
    }
  },

  // Obtener contenido por sección
  getBySection: async (seccion) => {
    try {
      const { data, error } = await supabase
        .from('contenido_editable')
        .select('*')
        .eq('seccion', seccion)
        .order('clave');
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error(`Error obteniendo contenido de sección ${seccion}:`, error);
      return { data: null, error };
    }
  },

  // Actualizar contenido
  update: async (id, contenido) => {
    try {
      const { data, error } = await supabase
        .from('contenido_editable')
        .update({ 
          contenido,
          actualizado_en: new Date().toISOString()
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error actualizando contenido:', error);
      return { data: null, error };
    }
  }
};

// Función helper para inicializar datos por defecto
export const initializeDefaultData = async () => {
  try {
    console.log('Inicializando datos por defecto...');

    // Verificar si ya existen datos
    const { data: existingConfig } = await configService.getAll();
    if (existingConfig && existingConfig.length > 0) {
      console.log('Los datos ya están inicializados');
      return { success: true, message: 'Datos ya inicializados' };
    }

    // Configuraciones por defecto
    const defaultConfigurations = [
      {
        clave: 'telefono_principal',
        valor: '+56974265019',
        descripcion: 'Teléfono principal de contacto',
        categoria: 'contacto',
        tipo: 'texto'
      },
      {
        clave: 'email_principal',
        valor: 'contacto@citysoccer.cl',
        descripcion: 'Email principal de contacto',
        categoria: 'contacto',
        tipo: 'email'
      },
      {
        clave: 'instagram',
        valor: '@citysoccersantiago',
        descripcion: 'Usuario de Instagram',
        categoria: 'redes_sociales',
        tipo: 'texto'
      },
      {
        clave: 'direccion',
        valor: 'Tiltil 2569, Macul',
        descripcion: 'Dirección de las instalaciones',
        categoria: 'contacto',
        tipo: 'texto'
      }
    ];

    // Insertar configuraciones
    for (const config of defaultConfigurations) {
      await configService.create(config);
    }

    console.log('Datos por defecto inicializados correctamente');
    return { success: true, message: 'Datos inicializados correctamente' };
  } catch (error) {
    console.error('Error inicializando datos por defecto:', error);
    return { success: false, error };
  }
};