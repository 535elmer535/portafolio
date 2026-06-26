/**
 * utils/validator.js
 * Valida y sanitiza los datos del formulario de contacto.
 */

'use strict';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SERVICIOS_VALIDOS = [
  'Diseño Web',
  'Branding & Identidad',
  'E-commerce',
  'Estrategia Digital',
  'Motion & Visual',
  'Hosting & Soporte',
  'Otro',
];

/**
 * Sanitiza un string: elimina etiquetas HTML y recorta espacios.
 * @param {string} str
 * @returns {string}
 */
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<[^>]*>/g, '') // quitar HTML
    .replace(/[<>"'`]/g, '') // quitar caracteres peligrosos
    .trim();
}

/**
 * Valida el payload del formulario de contacto.
 * @param {object} body
 * @returns {{ valid: boolean, errors: string[], data: object }}
 */
function validateContact(body) {
  const errors = [];

  const nombre   = sanitize(body.nombre   || '');
  const email    = sanitize(body.email    || '');
  const servicio = sanitize(body.servicio || '');
  const mensaje  = sanitize(body.mensaje  || '');

  // Nombre
  if (!nombre) {
    errors.push('El nombre es requerido.');
  } else if (nombre.length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres.');
  } else if (nombre.length > 80) {
    errors.push('El nombre no puede superar los 80 caracteres.');
  }

  // Email
  if (!email) {
    errors.push('El email es requerido.');
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push('El email no tiene un formato válido.');
  } else if (email.length > 150) {
    errors.push('El email es demasiado largo.');
  }

  // Servicio
  if (!servicio) {
    errors.push('Debes seleccionar un servicio.');
  } else if (!SERVICIOS_VALIDOS.includes(servicio)) {
    errors.push('El servicio seleccionado no es válido.');
  }

  // Mensaje
  if (!mensaje) {
    errors.push('El mensaje es requerido.');
  } else if (mensaje.length < 10) {
    errors.push('El mensaje debe tener al menos 10 caracteres.');
  } else if (mensaje.length > 1000) {
    errors.push('El mensaje no puede superar los 1000 caracteres.');
  }

  return {
    valid: errors.length === 0,
    errors,
    data: { nombre, email, servicio, mensaje },
  };
}

module.exports = { validateContact };
