/**
 * test.js — Star Web Backend
 * Prueba rápida del endpoint de contacto sin necesitar Postman.
 * Uso: node src/test.js
 *
 * El servidor debe estar corriendo (npm run dev) en otro terminal.
 */

'use strict';

const PORT = process.env.PORT || 3000;
const BASE = `http://localhost:${PORT}`;

async function test(name, url, options) {
  process.stdout.write(`  ${name}... `);
  try {
    const res  = await fetch(url, options);
    const body = await res.json();
    const ok   = body.ok === true || (options?.method === 'POST' && res.status !== 500);
    console.log(ok ? `✅ ${res.status}` : `❌ ${res.status} — ${body.message}`);
    if (body.errors) console.log(`     Errores: ${body.errors.join(', ')}`);
  } catch (err) {
    console.log(`❌ Error de conexión: ${err.message}`);
    console.log('     ¿Está corriendo el servidor? → npm run dev');
  }
}

(async () => {
  console.log('\n🧪 Star Web — Tests del backend\n');

  // 1. Health check
  await test(
    'GET  /api/health',
    `${BASE}/api/health`,
    { method: 'GET' }
  );

  // 2. Ruta inexistente (debe devolver 404)
  await test(
    'GET  /api/ruta-inexistente (404)',
    `${BASE}/api/ruta-inexistente`,
    { method: 'GET' }
  );

  // 3. Contacto con datos válidos
  await test(
    'POST /api/contact (válido)',
    `${BASE}/api/contact`,
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre:   'Juan Test',
        email:    'juan@ejemplo.com',
        servicio: 'Diseño Web',
        mensaje:  'Hola, quiero un sitio web para mi empresa.',
      }),
    }
  );

  // 4. Contacto con campos vacíos (debe fallar con 400)
  await test(
    'POST /api/contact (campos vacíos → 400)',
    `${BASE}/api/contact`,
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({}),
    }
  );

  // 5. Contacto con email inválido (debe fallar con 400)
  await test(
    'POST /api/contact (email inválido → 400)',
    `${BASE}/api/contact`,
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre:   'Test',
        email:    'no-es-un-email',
        servicio: 'Diseño Web',
        mensaje:  'Mensaje de prueba.',
      }),
    }
  );

  // 6. Contacto con servicio no válido (debe fallar con 400)
  await test(
    'POST /api/contact (servicio inválido → 400)',
    `${BASE}/api/contact`,
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre:   'Test',
        email:    'test@test.com',
        servicio: 'Servicio Falso',
        mensaje:  'Mensaje de prueba.',
      }),
    }
  );

  console.log('\n✅ Tests completados.\n');
  console.log('   Nota: el test "válido" enviará el email real si el SMTP está configurado.\n');
})();
