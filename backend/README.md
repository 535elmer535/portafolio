# Star Web — Backend

API REST con **Node.js + Express** para el formulario de contacto del sitio Star Web.

---

## Estructura

```
backend/
├── src/
│   ├── server.js              ← Punto de entrada
│   ├── routes/
│   │   ├── contact.js         ← POST /api/contact
│   │   └── health.js          ← GET  /api/health
│   ├── middleware/
│   │   ├── rateLimiter.js     ← Límite de peticiones (anti-spam)
│   │   └── logger.js          ← Registro de peticiones
│   └── utils/
│       ├── validator.js       ← Validación del formulario
│       ├── mailer.js          ← Envío de emails con Nodemailer
│       └── test.js            ← Script de prueba
├── logs/                      ← Logs diarios (auto-generado)
├── .env                       ← Variables de entorno (NO subir a Git)
├── .gitignore
├── package.json
└── README.md
```

---

## Instalación

```bash
cd backend
npm install
```

---

## Configuración del email (`.env`)

Abre `.env` y completa tus credenciales:

### Opción A — Gmail (recomendado)

1. Activa la verificación en 2 pasos en tu cuenta Google.
2. Ve a **Cuenta Google → Seguridad → Contraseñas de aplicaciones**.
3. Crea una contraseña de 16 dígitos para "Correo".
4. Pégala en `EMAIL_PASS`.

```env
EMAIL_SERVICE=gmail
EMAIL_USER=tucorreo@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
EMAIL_TO=tucorreo@gmail.com
```

### Opción B — SMTP genérico (Hostinger, cPanel, Mailgun…)

```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
EMAIL_USER=contacto@tudominio.com
EMAIL_PASS=tu_contraseña
EMAIL_TO=tucorreo@gmail.com
```

---

## Comandos

```bash
# Desarrollo (reinicia automáticamente al guardar)
npm run dev

# Producción
npm start

# Tests (el servidor debe estar corriendo en otro terminal)
npm test
```

---

## Endpoints

### `GET /api/health`
Verifica que el servidor está en línea.

**Respuesta:**
```json
{
  "ok": true,
  "status": "online",
  "service": "Star Web Backend",
  "environment": "production",
  "timestamp": "2026-06-25T20:00:00.000Z",
  "uptime": "3600s"
}
```

---

### `POST /api/contact`
Recibe el formulario de contacto, lo valida y envía el email.

**Body (JSON):**
```json
{
  "nombre":   "Juan Pérez",
  "email":    "juan@ejemplo.com",
  "servicio": "Diseño Web",
  "mensaje":  "Hola, quiero un sitio web."
}
```

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "message": "¡Mensaje enviado! Te responderemos en menos de 24 horas."
}
```

**Respuesta con error de validación (400):**
```json
{
  "ok": false,
  "message": "Datos inválidos.",
  "errors": ["El email no tiene un formato válido."]
}
```

**Servicios válidos:** `Diseño Web`, `Branding & Identidad`, `E-commerce`, `Estrategia Digital`, `Motion & Visual`, `Hosting & Soporte`, `Otro`

**Rate limit:** máximo **5 envíos por IP por hora**.

---

## Deploy en Render (gratis)

1. Sube el proyecto a GitHub (solo la carpeta `backend/`).
2. Crea una cuenta en [render.com](https://render.com).
3. Nuevo → **Web Service** → conecta tu repositorio.
4. Configuración:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. En **Environment Variables** agrega todas las variables de tu `.env`.
6. Al desplegarse obtienes una URL tipo `https://starweb-backend.onrender.com`.
7. Actualiza `CORS_ORIGIN` con la URL de tu frontend.

---

## Conectar el frontend al backend

Una vez el backend esté en línea, el formulario del frontend (actualmente redirige a WhatsApp) puede enviar los datos al backend así:

```javascript
// En script.js, dentro de initContactForm(), reemplaza el bloque de WhatsApp por:

const API_URL = 'https://starweb-backend.onrender.com'; // ← tu URL de Render

const res = await fetch(`${API_URL}/api/contact`, {
  method:  'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nombre, email, servicio, mensaje }),
});
const data = await res.json();

if (data.ok) {
  feedback.textContent = data.message;
  feedback.classList.add('success');
  form.reset();
} else {
  feedback.textContent = data.message;
  feedback.classList.add('error');
}
```
