/* Comportamiento común de todas las páginas. */
(function () {
  'use strict';

  function actualizarContador() {
    const contador = document.querySelector('#cart-count');
    if (contador && window.MilSabores) {
      contador.textContent = String(window.MilSabores.totalUnidades());
    }
  }

  function actualizarSesion() {
  const M = window.MilSabores;
  const acciones = document.querySelector('.header-actions');

  if (!M || !acciones) return;

  const sesion = M.leerJSON(M.STORAGE_SESSION, null);

  const usuarioAnterior =
    acciones.querySelector('.sesion-usuario');

  const botonCerrarAnterior =
    acciones.querySelector('#btn-cerrar-sesion');

  if (!sesion || !sesion.correo) {
    usuarioAnterior?.remove();
    botonCerrarAnterior?.remove();
    return;
  }

  const enlaceLogin =
    acciones.querySelector('a[href="login.html"]');

  const enlaceRegistro =
    acciones.querySelector('a[href="registro.html"]');

  enlaceLogin?.remove();
  enlaceRegistro?.remove();

  if (!usuarioAnterior) {
    const usuario = document.createElement('span');

    usuario.className = 'sesion-usuario';
    usuario.textContent =
      `Hola, ${sesion.nombre || 'cliente'}`;

    acciones.insertBefore(
      usuario,
      acciones.firstElementChild
    );
  }

  if (!botonCerrarAnterior) {
    const botonCerrar = document.createElement('button');

    botonCerrar.type = 'button';
    botonCerrar.id = 'btn-cerrar-sesion';
    botonCerrar.className = 'btn-secundario';
    botonCerrar.textContent = 'Cerrar sesión';

    botonCerrar.addEventListener('click', () => {
      window.localStorage.removeItem(
        M.STORAGE_SESSION
      );

      M.notificar('Sesión cerrada.');

      window.location.href = 'index.html';
    });

    acciones.insertBefore(
      botonCerrar,
      acciones.querySelector('.cart-link')
    );
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
  actualizarSesion();
  activarFallbackImagenes();

  window.addEventListener(
    'mil:carrito-actualizado',
    actualizarContador
  );

  window.addEventListener(
    'mil:sesion-actualizada',
    actualizarSesion
  );

  window.addEventListener(
    'mil:notificacion',
    mostrarNotificacion
  );

  window.addEventListener('storage', () => {
    actualizarContador();
    actualizarSesion();
  });
}


  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
}());
