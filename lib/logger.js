import { appendFile } from 'fs/promises';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'debug.log');

/**
 * Logger que escribe tanto a consola como a archivo
 */
export const logger = {
  log: async (prefix, message, data = null) => {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ${prefix} ${message}${data ? ' | ' + JSON.stringify(data, null, 2) : ''}\n`;
    
    // Escribir a consola
    console.log(`${prefix} ${message}`, data || '');
    
    // Escribir a archivo (solo en servidor)
    if (typeof window === 'undefined') {
      try {
        await appendFile(LOG_FILE, logLine);
      } catch (error) {
        console.error('Error escribiendo log:', error);
      }
    }
  },

  error: async (prefix, message, error) => {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ${prefix} ERROR: ${message} | ${error?.message || error}\nStack: ${error?.stack || 'N/A'}\n`;
    
    // Escribir a consola
    console.error(`${prefix} ERROR: ${message}`, error);
    
    // Escribir a archivo (solo en servidor)
    if (typeof window === 'undefined') {
      try {
        await appendFile(LOG_FILE, logLine);
      } catch (error) {
        console.error('Error escribiendo log:', error);
      }
    }
  }
};
