/**
 * server.js — Star Web Backend
 * Punto de entrada principal del servidor Express.
 */

'use strict';

require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');

const { rateLimiter, contactLimiter } = require('./middleware/rateLimiter');
const { requestLogger }               = require('./middleware/logger');
const contactRoutes                   = require('./routes/contact');
const healthRoutes                    = require('./routes/health');

const app  = express();
const PORT = process.env.PORT || 3000;

/* =============================================================================
   1. SEGURIDAD — Helmet añade cabeceras HTTP de seguridad
   ============================================================================= */
app.use(helmet());

/* =============================================================================
   2. CORS — solo permite peticiones desde el frontend autorizado
   ============================================================================= */
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5500')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Permitir peticiones sin origin (Postman, curl, mismo servidor)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origen no permitido → ${origin}`));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

/* =============================================================================
   3. PARSERS — leer JSON y datos de formularios
   ============================================================================= */
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

/* =============================================================================
   4. LOGS — registro de cada petición entrante
   ============================================================================= */
app.use(requestLogger);

/* =============================================================================
   5. RATE LIMITING GLOBAL — máximo 100 peticiones por IP cada 15 minutos
   ============================================================================= */
app.use(rateLimiter);

/* =============================================================================
   6. RUTAS
   ============================================================================= */
app.use('/api/health',  healthRoutes);
app.use('/api/contact', contactLimiter, contactRoutes);

/* =============================================================================
   7. RUTA 404 — cualquier ruta no definida
   ============================================================================= */
app.use((req, res) => {
  res.status(404).json({
    ok:      false,
    message: 'Ruta no encontrada.',
  });
});

/* =============================================================================
   8. MANEJADOR DE ERRORES GLOBAL
   ============================================================================= */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  // Error de CORS
  if (err.message && err.message.startsWith('CORS')) {
    return res.status(403).json({ ok: false, message: err.message });
  }

  res.status(500).json({
    ok:      false,
    message: 'Error interno del servidor.',
  });
});

/* =============================================================================
   9. ARRANQUE
   ============================================================================= */
app.listen(PORT, () => {
  console.log(`\n🚀 Star Web Backend corriendo en http://localhost:${PORT}`);
  console.log(`   Entorno  : ${process.env.NODE_ENV || 'development'}`);
  console.log(`   CORS     : ${allowedOrigins.join(', ')}`);
  console.log(`   Email    : ${process.env.EMAIL_USER || '(no configurado)'}\n`);
});

module.exports = app;
