/* Comportamiento común de todas las páginas. */
(function () {
  'use strict';

  function actualizarContador() {
    const contador = document.querySelector('#cart-count');
    if (contador && window.MilSabores) {
      contador.textContent = String(window.MilSabores.totalUnidades());
    }
  }

  function mostrarNotificacion(evento) {
    const detalle = evento.detail || {};
    if (!detalle.mensaje) return;

    let toast = document.querySelector('#mil-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'mil-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      Object.assign(toast.style, {
        position: 'fixed',
        right: '1rem',
        bottom: '1rem',
        zIndex: '100',
        maxWidth: 'min(90vw, 380px)',
        padding: '0.9rem 1.2rem',
        borderRadius: '12px',
        backgroundColor: '#8B4513',
        color: '#fff',
        boxShadow: '0 4px 14px rgba(93, 64, 55, 0.25)',
        fontWeight: '700'
      });
      document.body.appendChild(toast);
    }

    toast.textContent = detalle.mensaje;
    toast.hidden = false;
    window.clearTimeout(toast._timer);
    toast._timer = window.setTimeout(() => { toast.hidden = true; }, 3500);
  }

  function activarFallbackImagenes() {
    document.querySelectorAll('img').forEach((imagen) => {
      imagen.addEventListener('error', () => {
        if (imagen.dataset.fallbackAplicado === 'true') return;
        imagen.dataset.fallbackAplicado = 'true';
        imagen.src = 'img/placeholder-producto.svg';
      }, { once: true });
    });
  }

  function iniciar() {
    actualizarContador();
    activarFallbackImagenes();
    window.addEventListener('mil:carrito-actualizado', actualizarContador);
    window.addEventListener('mil:notificacion', mostrarNotificacion);
    window.addEventListener('storage', actualizarContador);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
}());
