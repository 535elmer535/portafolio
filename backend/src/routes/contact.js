/**
 * routes/contact.js
 * POST /api/contact — recibe el formulario, valida y envía el email.
 */

'use strict';

const express              = require('express');
const { validateContact }  = require('../utils/validator');
const { sendContactEmail } = require('../utils/mailer');

const router = express.Router();

/**
 * POST /api/contact
 *
 * Body esperado (JSON):
 *   { nombre, email, servicio, mensaje }
 *
 * Respuestas:
 *   200 → { ok: true,  message: "..." }
 *   400 → { ok: false, message: "...", errors: [...] }
 *   500 → { ok: false, message: "Error interno..." }
 */
router.post('/', async (req, res) => {
  /* 1. Validar y sanitizar */
  const { valid, errors, data } = validateContact(req.body);

  if (!valid) {
    return res.status(400).json({
      ok:      false,
      message: 'Datos inválidos.',
      errors,
    });
  }

  /* 2. Intentar enviar el email */
  try {
    await sendContactEmail(data);

    console.log(`[CONTACTO] Email enviado → ${data.email} | Servicio: ${data.servicio}`);

    return res.status(200).json({
      ok:      true,
      message: '¡Mensaje enviado! Te responderemos en menos de 24 horas.',
    });

  } catch (err) {
    console.error(`[CONTACTO] Error al enviar email: ${err.message}`);

    return res.status(500).json({
      ok:      false,
      message: 'Hubo un problema al enviar tu mensaje. Por favor intenta de nuevo o contáctanos por WhatsApp.',
    });
  }
});

module.exports = router;
