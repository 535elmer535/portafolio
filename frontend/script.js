/**
 * script.js — Star Web
 * JavaScript moderno, limpio y organizado.
 * Sin dependencias externas.
 */

'use strict';

/* =============================================================================
   1. NAVBAR — scroll effect & mobile menu
   ============================================================================= */
const navbar  = document.getElementById('navbar');
const burger  = document.getElementById('burger');
const navMobile = document.getElementById('nav-mobile');

/**
 * Añade/quita la clase .scrolled al navbar según posición de scroll.
 */
function handleNavbarScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}

/**
 * Abre/cierra el menú móvil.
 */
function toggleMobileMenu() {
  const isOpen = navMobile.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', String(isOpen));
  navMobile.setAttribute('aria-hidden', String(!isOpen));
}

/**
 * Cierra el menú móvil al hacer clic en un enlace.
 */
function closeMobileOnLinkClick(e) {
  if (e.target.tagName === 'A') {
    navMobile.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    navMobile.setAttribute('aria-hidden', 'true');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
burger.addEventListener('click', toggleMobileMenu);
navMobile.addEventListener('click', closeMobileOnLinkClick);

// Inicializar estado correcto
handleNavbarScroll();


/* =============================================================================
   2. REVEAL ON SCROLL — animación de entrada de elementos
   ============================================================================= */

/**
 * Observa todos los elementos .reveal y añade .visible cuando entran
 * al viewport, activando la transición CSS de fade-in + slide-up.
 */
function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Pequeño delay escalonado para grupos de tarjetas

          const delay = entry.target.closest('.services-grid, .portfolio-grid, .testimonios-grid')
            ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 80
            : 0;

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}


/* =============================================================================
   3. CONTACT FORM — validación y feedback
   ============================================================================= */

/**
 * Maneja el envío del formulario con validación básica y feedback al usuario.
 */
function initContactForm() {
  const form     = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    feedback.className = 'form-feedback';
    feedback.textContent = '';

    const nombre  = form.nombre.value.trim();
    const email   = form.email.value.trim();
    const servicio = form.servicio.value;
    const mensaje = form.mensaje.value.trim();

    // Validación simple
    if (!nombre || !email || !servicio || !mensaje) {
      feedback.textContent = 'Por favor completa todos los campos requeridos.';
      feedback.classList.add('error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      feedback.textContent = 'Ingresa un correo electrónico válido.';
      feedback.classList.add('error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const telefono = '59168446992';
    const textoWhatsApp = [
      '¡Hola!',
      '',
      '*Nuevo mensaje de contacto:*',
      `• *Nombre:* ${nombre}`,
      `• *Email:* ${email}`,
      `• *Servicio:* ${servicio}`,
      `• *Mensaje:* ${mensaje}`
    ].join('\n');
    const urlWhatsApp = `https://wa.me/${telefono}?text=${encodeURIComponent(textoWhatsApp)}`;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Redirigiendo...';

    feedback.textContent = 'Redirigiendo a WhatsApp...';
    feedback.classList.add('success');

    setTimeout(() => {
      window.open(urlWhatsApp, '_blank', 'noopener');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar a WhatsApp';
      feedback.textContent = '';
      feedback.className = 'form-feedback';
    }, 1000);
  });
}


/* =============================================================================
   4. BACK TO TOP — botón de regreso al inicio
   ============================================================================= */

/**
 * Muestra/oculta el botón de scroll al top según posición vertical.
 */
function initBackToTop() {
  const btn = document.getElementById('back-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =============================================================================
   5. PORTFOLIO HOVER — accesibilidad con teclado
   ============================================================================= */

/**
 * Permite activar el overlay de portafolio con tecla Enter/Space.
 */
function initPortfolioA11y() {
  document.querySelectorAll('.portfolio-item').forEach(item => {
    item.setAttribute('tabindex', '0');
  });
}

/* =============================================================================
   6. INIT — arranque cuando el DOM está listo
   ============================================================================= */
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initContactForm();
  initBackToTop();
  initPortfolioA11y();
});
