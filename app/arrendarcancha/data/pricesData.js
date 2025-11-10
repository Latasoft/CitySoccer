import { dynamicConfigService } from '@/lib/dynamicConfigService';

/**
 * Función para obtener precios dinámicos desde la base de datos
 * No utiliza valores hardcodeados - todos los precios vienen de Supabase
 */
export const getPricesData = async () => {
  try {
    const dynamicPrices = await dynamicConfigService.getPrices();
    return dynamicPrices;
  } catch (error) {
    console.error('❌ Error obteniendo precios desde BD:', error);
    throw new Error('No se pudieron cargar los precios. Por favor verifica la conexión a la base de datos.');
  }
};

// Exportar función principal como pricesData para compatibilidad
export const pricesData = getPricesData;
