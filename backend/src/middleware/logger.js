/**
 * middleware/logger.js
 * Registra cada petición en consola y en archivo de log diario.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '../../logs');

// Crear carpeta logs si no existe
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

/**
 * Devuelve la fecha/hora actual formateada.
 */
function timestamp() {
  return new Date().toISOString();
}

/**
 * Escribe una línea en el archivo de log del día actual.
 * Formato: [ISO_DATE] METHOD /ruta STATUS ms
 */
function writeToFile(line) {
  try {
    const today    = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const filename = path.join(LOG_DIR, `${today}.log`);
    fs.appendFileSync(filename, line + '\n', 'utf8');
  } catch {
    // Si falla la escritura de log, no detener el servidor
  }
}

/**
 * Middleware de logging.
 * Se ejecuta en cada petición entrante.
 */
function requestLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const ms     = Date.now() - start;
    const ip     = req.ip || req.socket?.remoteAddress || '-';
    const line   = `[${timestamp()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms — IP: ${ip}`;

    // Log en consola (coloreado según status)
    if (res.statusCode >= 500) {
      console.error(`❌ ${line}`);
    } else if (res.statusCode >= 400) {
      console.warn(`⚠️  ${line}`);
    } else {
      console.log(`✅ ${line}`);
    }

    // Log en archivo
    writeToFile(line);
  });

  next();
}

module.exports = { requestLogger };
