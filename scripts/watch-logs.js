// Script para monitorear debug.log en tiempo real
const { spawn } = require('child_process');
const path = require('path');

const logFile = path.join(process.cwd(), 'debug.log');

console.log('📋 Monitoreando logs en tiempo real...');
console.log('📁 Archivo:', logFile);
console.log('🔄 Presiona Ctrl+C para detener\n');
console.log('='.repeat(80));

// Crear archivo si no existe
const fs = require('fs');
if (!fs.existsSync(logFile)) {
  fs.writeFileSync(logFile, `[${new Date().toISOString()}] Log iniciado\n`);
}

// Usar tail en PowerShell (Get-Content -Wait)
const tail = spawn('powershell', [
  '-Command',
  `Get-Content -Path "${logFile}" -Wait -Tail 20`
], {
  stdio: 'inherit',
  shell: true
});

tail.on('error', (error) => {
  console.error('Error ejecutando tail:', error);
  console.log('\nIntentando método alternativo...\n');
  
  // Fallback: leer archivo periódicamente
  let lastSize = 0;
  setInterval(() => {
    try {
      const stats = fs.statSync(logFile);
      if (stats.size > lastSize) {
        const stream = fs.createReadStream(logFile, {
          start: lastSize,
          end: stats.size
        });
        stream.on('data', (chunk) => {
          process.stdout.write(chunk.toString());
        });
        lastSize = stats.size;
      }
    } catch (err) {
      // Ignorar errores de lectura
    }
  }, 500);
});

tail.on('close', (code) => {
  console.log(`\n\n📋 Monitor de logs cerrado (código: ${code})`);
});
