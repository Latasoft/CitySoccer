import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

let server;

app.prepare().then(() => {
  server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Environment: ${dev ? 'development' : 'production'}`);
  });

  // Configurar keepAlive para mejor rendimiento
  server.keepAliveTimeout = 65000; // Mayor que el load balancer (típicamente 60s)
  server.headersTimeout = 66000; // Debe ser mayor que keepAliveTimeout

  // Graceful shutdown
  const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received, starting graceful shutdown...`);
    
    // Dejar de aceptar nuevas conexiones
    server.close(async () => {
      console.log('Server closed to new connections');
      
      try {
        // Importar dinámicamente el cleanup de Supabase
        const { cleanup } = await import('./lib/supabaseClient.js');
        await cleanup();
        
        console.log('Cleanup completed successfully');
        process.exit(0);
      } catch (error) {
        console.error('Error during cleanup:', error);
        process.exit(1);
      }
    });

    // Timeout de seguridad (forzar cierre después de 30s)
    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 30000);
  };

  // Escuchar señales de shutdown
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  
  // Manejar errores no capturados
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
  });
});
