/**
 * middleware/rateLimiter.js
 * Limita peticiones para proteger el servidor de spam y ataques.
 */

'use strict';

const rateLimit = require('express-rate-limit');

/**
 * Limiter GLOBAL — 100 peticiones por IP cada 15 minutos.
 * Se aplica a todas las rutas.
 */
const rateLimiter = rateLimit({
  windowMs:         15 * 60 * 1000, // 15 minutos
  max:              100,
  standardHeaders:  true,
  legacyHeaders:    false,
  message: {
    ok:      false,
    message: 'Demasiadas peticiones desde esta IP. Intenta de nuevo en 15 minutos.',
  },
});

/**
 * Limiter específico para el formulario de CONTACTO:
 * máximo 5 envíos por IP cada hora.
 * Evita spam al formulario.
 */
const contactLimiter = rateLimit({
  windowMs:        60 * 60 * 1000, // 1 hora
  max:             5,
  standardHeaders: true,
  legacyHeaders:   false,
  message: {
    ok:      false,
    message: 'Has enviado demasiados mensajes. Espera un momento antes de intentarlo de nuevo.',
  },
});

module.exports = { rateLimiter, contactLimiter };
