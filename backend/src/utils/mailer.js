/**
 * utils/mailer.js
 * Configura nodemailer y expone la función para enviar emails de contacto.
 *
 * Configuración recomendada con Gmail:
 *   EMAIL_SERVICE=gmail
 *   EMAIL_USER=tu_correo@gmail.com
 *   EMAIL_PASS=xxxx xxxx xxxx xxxx   ← Contraseña de aplicación de Google
 *   EMAIL_TO=destino@gmail.com        ← Dónde llegan los contactos
 *
 * Si usas otro proveedor SMTP (Outlook, Hostinger, etc.)
 * puedes ignorar EMAIL_SERVICE y usar SMTP_HOST / SMTP_PORT:
 *   SMTP_HOST=smtp.hostinger.com
 *   SMTP_PORT=465
 */

'use strict';

const nodemailer = require('nodemailer');

/* ---------------------------------------------------------------------------
   Crear transporter según variables de entorno
   --------------------------------------------------------------------------- */
function createTransporter() {
  // Opción A: proveedor conocido (gmail, outlook, yahoo…)
  if (process.env.EMAIL_SERVICE) {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Opción B: SMTP genérico (Hostinger, cPanel, Mailgun, etc.)
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST   || 'smtp.example.com',
    port:   Number(process.env.SMTP_PORT) || 465,
    secure: Number(process.env.SMTP_PORT) === 465, // true para 465, false para 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

const transporter = createTransporter();

/* ---------------------------------------------------------------------------
   Plantilla HTML del email que llega al dueño del sitio
   --------------------------------------------------------------------------- */
function buildHtml({ nombre, email, servicio, mensaje }) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <style>
    body        { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
    .card       { background: #ffffff; border-radius: 8px; max-width: 560px; margin: auto; padding: 32px; }
    .header     { background: #147d76; border-radius: 6px 6px 0 0; padding: 20px 32px; }
    .header h1  { color: #ffffff; margin: 0; font-size: 20px; }
    .body       { padding: 24px 0 0; }
    .field      { margin-bottom: 16px; }
    .label      { font-size: 11px; font-weight: 700; text-transform: uppercase;
                  letter-spacing: 0.06em; color: #147d76; margin-bottom: 4px; }
    .value      { font-size: 15px; color: #222; line-height: 1.5; }
    .divider    { border: none; border-top: 1px solid #ebebeb; margin: 20px 0; }
    .footer     { font-size: 12px; color: #999; text-align: center; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>⭐ Nuevo mensaje de contacto — Star Web</h1>
    </div>
    <div class="body">
      <div class="field">
        <div class="label">Nombre</div>
        <div class="value">${nombre}</div>
      </div>
      <hr class="divider" />
      <div class="field">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${email}" style="color:#147d76;">${email}</a></div>
      </div>
      <hr class="divider" />
      <div class="field">
        <div class="label">Servicio de interés</div>
        <div class="value">${servicio}</div>
      </div>
      <hr class="divider" />
      <div class="field">
        <div class="label">Mensaje</div>
        <div class="value">${mensaje.replace(/\n/g, '<br>')}</div>
      </div>
    </div>
    <div class="footer">
      Enviado desde el formulario de contacto de starweb.studio
    </div>
  </div>
</body>
</html>
  `.trim();
}

/* ---------------------------------------------------------------------------
   Función principal: envía el email al dueño del sitio
   --------------------------------------------------------------------------- */
async function sendContactEmail({ nombre, email, servicio, mensaje }) {
  const to = process.env.EMAIL_TO || process.env.EMAIL_USER;

  const mailOptions = {
    from:     `"Star Web" <${process.env.EMAIL_USER}>`,
    to,
    replyTo:  email,          // Responder directamente va al cliente
    subject:  `📩 Nuevo contacto — ${nombre} (${servicio})`,
    text: [
      `Nombre  : ${nombre}`,
      `Email   : ${email}`,
      `Servicio: ${servicio}`,
      `Mensaje : ${mensaje}`,
    ].join('\n'),
    html: buildHtml({ nombre, email, servicio, mensaje }),
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Verifica que las credenciales SMTP son correctas al arrancar.
 * Solo muestra un warning si falla (no detiene el servidor).
 */
async function verifyConnection() {
  try {
    await transporter.verify();
    console.log('   ✉️  SMTP: conexión verificada correctamente.');
  } catch (err) {
    console.warn(`   ⚠️  SMTP: no se pudo verificar la conexión → ${err.message}`);
    console.warn('      Revisa EMAIL_USER, EMAIL_PASS y EMAIL_SERVICE en tu .env');
  }
}

module.exports = { sendContactEmail, verifyConnection };
