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
      console.error('Error actualizando precios en batch:', error);
      return { data: null, error };
    }
  },

  // Eliminar precio
  delete: async (id) => {
    try {
      const { data, error } = await supabase
        .from('precios')
        .delete()
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error eliminando precio:', error);
      return { data: null, error };
    }
  },

  // Toggle activo/inactivo
  toggleActive: async (id, activo) => {
    try {
      const { data, error } = await supabase
        .from('precios')
        .update({ 
          activo,
          actualizado_en: new Date().toISOString()
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error cambiando estado activo:', error);
      return { data: null, error };
    }
  },

  // Obtener horarios únicos disponibles
  getAvailableHours: () => {
    const hours = [];
    for (let i = 9; i <= 23; i++) {
      hours.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return hours;
  },

  // Verificar si existe un precio
  exists: async (tipoCancha, diaSemana, hora) => {
    try {
      const { data, error } = await supabase
        .from('precios')
        .select('id')
        .eq('tipo_cancha', tipoCancha)
        .eq('dia_semana', diaSemana)
        .eq('hora', hora)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no encontrado
      return { exists: !!data, data, error: null };
    } catch (error) {
      console.error('Error verificando existencia de precio:', error);
      return { exists: false, data: null, error };
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
        valor: '+56974265020',
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

// ===========================================
// SERVICIOS PARA CMS - GESTIÓN DE PÁGINAS
// ===========================================

// Servicio para gestión de páginas
export const pagesService = {
  // Obtener todas las páginas
  getAll: async () => {
    try {
      console.log('[CMS DEBUG] pagesService.getAll - Iniciando consulta...');
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('creado_en', { ascending: false });
      
      console.log('[CMS DEBUG] pagesService.getAll - Resultado:', { count: data?.length, data, error });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('[CMS ERROR] Error obteniendo páginas:', error);
      return { data: null, error };
    }
  },

  // Obtener página por slug
  getBySlug: async (slug) => {
    try {
      console.log('[CMS DEBUG] pagesService.getBySlug - Buscando:', slug);
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .single();
      
      console.log('[CMS DEBUG] pagesService.getBySlug - Resultado:', { data, error });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error(`[CMS ERROR] Error obteniendo página ${slug}:`, error);
      return { data: null, error };
    }
  },

  // Obtener página por ID
  getById: async (id) => {
    try {
      console.log('[CMS DEBUG] pagesService.getById - Buscando ID:', id);
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('id', id)
        .single();
      
      console.log('[CMS DEBUG] pagesService.getById - Resultado:', { data, error });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error(`[CMS ERROR] Error obteniendo página por ID ${id}:`, error);
      return { data: null, error };
    }
  },

  // Obtener página con sus secciones
  getWithSections: async (slug) => {
    try {
      const { data: page, error: pageError } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (pageError) throw pageError;

      const { data: sections, error: sectionsError } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_id', page.id)
        .eq('activa', true)
        .order('orden', { ascending: true });
      
      if (sectionsError) throw sectionsError;

      return { data: { ...page, sections }, error: null };
    } catch (error) {
      console.error(`Error obteniendo página con secciones ${slug}:`, error);
      return { data: null, error };
    }
  },

  // Crear nueva página
  create: async (pageData) => {
    try {
      console.log('[CMS DEBUG] pagesService.create - Datos:', pageData);
      const { data, error } = await supabase
        .from('pages')
        .insert([pageData])
        .select();
      
      console.log('[CMS DEBUG] pagesService.create - Resultado:', { data, error });
      if (error) throw error;
      return { data: data[0], error: null };
    } catch (error) {
      console.error('[CMS ERROR] Error creando página:', error);
      return { data: null, error };
    }
  },

  // Actualizar página
  update: async (id, pageData) => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .update(pageData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return { data: data[0], error: null };
    } catch (error) {
      console.error('Error actualizando página:', error);
      return { data: null, error };
    }
  },

  // Eliminar página
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { data: true, error: null };
    } catch (error) {
      console.error('Error eliminando página:', error);
      return { data: null, error };
    }
  },

  // Publicar/despublicar página
  togglePublish: async (id, publicada) => {
    try {
      const updateData = { 
        publicada,
        publicado_en: publicada ? new Date().toISOString() : null
      };
      
      const { data, error } = await supabase
        .from('pages')
        .update(updateData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return { data: data[0], error: null };
    } catch (error) {
      console.error('Error publicando página:', error);
      return { data: null, error };
    }
  }
};

// Servicio para gestión de secciones de página
export const pageSectionsService = {
  // Obtener secciones de una página
  getByPageId: async (pageId) => {
    try {
      console.log('[CMS DEBUG] pageSectionsService.getByPageId - PageID:', pageId);
      const { data, error } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_id', pageId)
        .order('orden', { ascending: true });
      
      console.log('[CMS DEBUG] pageSectionsService.getByPageId - Resultado:', { count: data?.length, data, error });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('[CMS ERROR] Error obteniendo secciones:', error);
      return { data: null, error };
    }
  },

  // Crear nueva sección
  create: async (sectionData) => {
    try {
      console.log('[CMS DEBUG] pageSectionsService.create - Datos:', sectionData);
      const { data, error } = await supabase
        .from('page_sections')
        .insert([sectionData])
        .select();
      
      console.log('[CMS DEBUG] pageSectionsService.create - Resultado:', { data, error });
      if (error) throw error;
      return { data: data[0], error: null };
    } catch (error) {
      console.error('[CMS ERROR] Error creando sección:', error);
      return { data: null, error };
    }
  },

  // Actualizar sección
  update: async (id, sectionData) => {
    try {
      const { data, error } = await supabase
        .from('page_sections')
        .update(sectionData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return { data: data[0], error: null };
    } catch (error) {
      console.error('Error actualizando sección:', error);
      return { data: null, error };
    }
  },

  // Eliminar sección
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('page_sections')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { data: true, error: null };
    } catch (error) {
      console.error('Error eliminando sección:', error);
      return { data: null, error };
    }
  },

  // Reordenar secciones
  reorder: async (pageId, orderedSectionIds) => {
    try {
      // Actualizar el orden de cada sección
      const updates = orderedSectionIds.map((sectionId, index) => 
        supabase
          .from('page_sections')
          .update({ orden: index })
          .eq('id', sectionId)
          .eq('page_id', pageId)
      );

      await Promise.all(updates);
      return { data: true, error: null };
    } catch (error) {
      console.error('Error reordenando secciones:', error);
      return { data: null, error };
    }
  }
};

// Servicio para plantillas de secciones
export const sectionTemplatesService = {
  // Obtener todas las plantillas
  getAll: async () => {
    try {
      console.log('[CMS DEBUG] sectionTemplatesService.getAll - Consultando...');
      const { data, error } = await supabase
        .from('section_templates')
        .select('*')
        .order('categoria', { ascending: true })
        .order('nombre', { ascending: true });
      
      console.log('[CMS DEBUG] sectionTemplatesService.getAll - Resultado:', { count: data?.length, data, error });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('[CMS ERROR] Error obteniendo plantillas:', error);
      return { data: null, error };
    }
  },

  // Obtener plantilla por tipo
  getByType: async (tipo) => {
    try {
      const { data, error } = await supabase
        .from('section_templates')
        .select('*')
        .eq('tipo', tipo)
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error(`Error obteniendo plantilla ${tipo}:`, error);
      return { data: null, error };
    }
  },

  // Obtener plantillas por categoría
  getByCategory: async (categoria) => {
    try {
      const { data, error } = await supabase
        .from('section_templates')
        .select('*')
        .eq('categoria', categoria)
        .order('nombre', { ascending: true });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error(`Error obteniendo plantillas de categoría ${categoria}:`, error);
      return { data: null, error };
    }
  }
};

// ===========================================
// SERVICIOS PARA DÍAS BLOQUEADOS Y HORARIOS
// ===========================================

export const diasBloqueadosService = {
  // Obtener todos los días bloqueados
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('dias_bloqueados')
        .select('*')
        .order('fecha', { ascending: true });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo días bloqueados:', error);
      return { data: null, error };
    }
  },

  // Obtener días bloqueados futuros
  getFuturos: async () => {
    try {
      const hoy = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('dias_bloqueados')
        .select('*')
        .gte('fecha', hoy)
        .order('fecha', { ascending: true });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo días bloqueados futuros:', error);
      return { data: null, error };
    }
  },

  // Verificar si una fecha está bloqueada
  isBlocked: async (fecha) => {
    try {
      const { data, error } = await supabase
        .from('dias_bloqueados')
        .select('*')
        .eq('fecha', fecha)
        .single();
      
      return { isBlocked: !!data, data, error: null };
    } catch (error) {
      return { isBlocked: false, data: null, error };
    }
  },

  // Crear día bloqueado
  create: async (fecha, motivo, bloqueadoPor) => {
    try {
      const { data, error } = await supabase
        .from('dias_bloqueados')
        .insert({
          fecha,
          motivo,
          bloqueado_por: bloqueadoPor
        })
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creando día bloqueado:', error);
      return { data: null, error };
    }
  },

  // Eliminar día bloqueado
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('dias_bloqueados')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error eliminando día bloqueado:', error);
      return { error };
    }
  },

  // Eliminar por fecha
  deleteByFecha: async (fecha) => {
    try {
      const { error } = await supabase
        .from('dias_bloqueados')
        .delete()
        .eq('fecha', fecha);
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error eliminando día bloqueado por fecha:', error);
      return { error };
    }
  }
};

// ============================================================================
// SERVICIO DE GESTIÓN DE MENÚ DE NAVEGACIÓN
// ============================================================================

export const menuService = {
  // Obtener todos los items del menú
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('orden', { ascending: true });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo items de menú:', error);
      return { data: null, error };
    }
  },

  // Obtener solo items activos (para mostrar en el sitio)
  getActive: async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('activo', true)
        .order('orden', { ascending: true });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo items activos:', error);
      return { data: null, error };
    }
  },

  // Obtener estructura jerárquica (con hijos)
  getHierarchy: async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items_con_hijos')
        .select('*')
        .eq('activo', true);
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo jerarquía de menú:', error);
      return { data: null, error };
    }
  },

  // Crear nuevo item
  create: async (itemData) => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([itemData])
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creando item de menú:', error);
      return { data: null, error };
    }
  },

  // Actualizar item existente
  update: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error actualizando item de menú:', error);
      return { data: null, error };
    }
  },

  // Eliminar item
  delete: async (id) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error eliminando item de menú:', error);
      return { error };
    }
  },

  // Toggle activo/inactivo
  toggleActive: async (id, activo) => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .update({ activo })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error cambiando estado de item:', error);
      return { data: null, error };
    }
  },

  // Reordenar items (batch update)
  reorder: async (items) => {
    try {
      // Actualizar orden de todos los items
      const updates = items.map((item, index) => 
        supabase
          .from('menu_items')
          .update({ orden: index + 1 })
          .eq('id', item.id)
      );

      const results = await Promise.all(updates);
      
      // Verificar si hubo errores
      const errors = results.filter(r => r.error);
      if (errors.length > 0) {
        throw errors[0].error;
      }

      return { error: null };
    } catch (error) {
      console.error('Error reordenando items:', error);
      return { error };
    }
  },

  // Duplicar item (útil para crear variantes)
  duplicate: async (id) => {
    try {
      // Obtener item original
      const { data: original, error: fetchError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;

      // Crear copia
      const { id: _, creado_en, actualizado_en, ...itemData } = original;
      const copy = {
        ...itemData,
        label: `${original.label} (copia)`,
        orden: original.orden + 1,
        activo: false // Desactivado por defecto
      };

      const { data, error } = await supabase
        .from('menu_items')
        .insert([copy])
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error duplicando item:', error);
      return { data: null, error };
    }
  }
};

// ============================================================================
// SERVICIO DE CONTENIDO EDITABLE DE PÁGINAS
// ============================================================================

export const editableContentService = {
  // Obtener todo el contenido de una página
  getPageContent: async (pageKey) => {
    try {
      const { data, error } = await supabase
        .from('editable_content')
        .select('*')
        .eq('page_key', pageKey)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo contenido de página:', error);
      return { data: null, error };
    }
  },

  // Obtener contenido como objeto key-value
  getPageContentAsObject: async (pageKey) => {
    try {
      const { data, error } = await supabase
        .from('editable_content')
        .select('field_key, field_value')
        .eq('page_key', pageKey);
      
      if (error) throw error;

      // Convertir array a objeto
      const contentObj = {};
      if (data) {
        data.forEach(item => {
          contentObj[item.field_key] = item.field_value;
        });
      }
      
      return { data: contentObj, error: null };
    } catch (error) {
      console.error('Error obteniendo contenido como objeto:', error);
      return { data: null, error };
    }
  },

  // Obtener todos los campos para administración
  getAllContent: async () => {
    try {
      const { data, error } = await supabase
        .from('editable_content')
        .select('*')
        .order('page_key', { ascending: true })
        .order('field_group', { ascending: true })
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo todo el contenido:', error);
      return { data: null, error };
    }
  },

  // Obtener contenido agrupado por página
  getContentGroupedByPage: async () => {
    try {
      const { data, error } = await supabase
        .from('editable_content')
        .select('*')
        .order('page_key', { ascending: true })
        .order('display_order', { ascending: true });
      
      if (error) throw error;

      // Agrupar por página
      const grouped = {};
      if (data) {
        data.forEach(item => {
          if (!grouped[item.page_key]) {
            grouped[item.page_key] = [];
          }
          grouped[item.page_key].push(item);
        });
      }
      
      return { data: grouped, error: null };
    } catch (error) {
      console.error('Error obteniendo contenido agrupado:', error);
      return { data: null, error };
    }
  },

  // Actualizar un campo específico
  updateField: async (id, fieldValue) => {
    try {
      const { data, error } = await supabase
        .from('editable_content')
        .update({ field_value: fieldValue })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error actualizando campo:', error);
      return { data: null, error };
    }
  },

  // Actualizar múltiples campos de una página (batch)
  updatePageContent: async (pageKey, updates) => {
    try {
      // updates es un objeto: { field_key: nuevo_valor }
      const updatePromises = Object.entries(updates).map(([fieldKey, fieldValue]) =>
        supabase
          .from('editable_content')
          .update({ field_value: fieldValue })
          .eq('page_key', pageKey)
          .eq('field_key', fieldKey)
      );

      const results = await Promise.all(updatePromises);
      
      // Verificar errores
      const errors = results.filter(r => r.error);
      if (errors.length > 0) {
        throw errors[0].error;
      }

      return { error: null };
    } catch (error) {
      console.error('Error actualizando contenido de página:', error);
      return { error };
    }
  },

  // Crear nuevo campo
  createField: async (fieldData) => {
    try {
      const { data, error } = await supabase
        .from('editable_content')
        .insert([fieldData])
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creando campo:', error);
      return { data: null, error };
    }
  },

  // Eliminar campo
  deleteField: async (id) => {
    try {
      const { error } = await supabase
        .from('editable_content')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error eliminando campo:', error);
      return { error };
    }
  },

  // Obtener páginas disponibles (únicas)
  getAvailablePages: async () => {
    try {
      const { data, error } = await supabase
        .from('editable_content')
        .select('page_key')
        .order('page_key', { ascending: true });
      
      if (error) throw error;

      // Obtener valores únicos
      const uniquePages = [...new Set(data.map(item => item.page_key))];
      
      return { data: uniquePages, error: null };
    } catch (error) {
      console.error('Error obteniendo páginas disponibles:', error);
      return { data: null, error };
    }
  }
};

// ===========================================
// SERVICIOS PARA GESTIÓN DE USUARIOS ADMIN
// ===========================================

export const adminUsersService = {
  // Obtener todos los usuarios admin
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('creado_en', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error obteniendo usuarios admin:', error);
      return { data: null, error };
    }
  },

  // Verificar si un usuario es admin por user_id
  isAdmin: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, activo')
        .eq('user_id', userId)
        .eq('activo', true)
        .single();
      
      if (error) {
        // Si no encuentra el registro, retornar false sin error
        if (error.code === 'PGRST116') {
          return { data: false, error: null };
        }
        throw error;
      }
      
      return { data: true, error: null };
    } catch (error) {
      console.error('Error verificando si es admin:', error);
      return { data: false, error };
    }
  },

  // Agregar un nuevo usuario admin
  create: async (userId, email, nombre = null) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .insert([{
          user_id: userId,
          email: email,
          nombre: nombre,
          activo: true
        }])
        .select();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creando usuario admin:', error);
      return { data: null, error };
    }
  },

  // Actualizar usuario admin
  update: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .update({
          ...updates,
          actualizado_en: new Date().toISOString()
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error actualizando usuario admin:', error);
      return { data: null, error };
    }
  },

  // Desactivar usuario admin
  deactivate: async (id) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .update({
          activo: false,
          actualizado_en: new Date().toISOString()
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error desactivando usuario admin:', error);
      return { data: null, error };
    }
  },

  // Activar usuario admin
  activate: async (id) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .update({
          activo: true,
          actualizado_en: new Date().toISOString()
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error activando usuario admin:', error);
      return { data: null, error };
    }
  }
};