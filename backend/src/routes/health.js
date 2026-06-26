/**
 * routes/health.js
 * GET /api/health — endpoint de salud del servidor.
 * Útil para monitoreo en plataformas como Render, Railway, etc.
 */

'use strict';

const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    ok:          true,
    status:      'online',
    service:     'Star Web Backend',
    environment: process.env.NODE_ENV || 'development',
    timestamp:   new Date().toISOString(),
    uptime:      `${Math.floor(process.uptime())}s`,
  });
});

module.exports = router;
