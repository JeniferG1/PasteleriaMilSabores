/* Vista de detalle, galería, relacionados y personalización. */
(function () {
  'use strict';

  function construirRelacionado(producto) {
    const M = window.MilSabores;
    return `
      <article class="product-card" data-codigo="${M.escaparHTML(producto.codigo)}">
        <a href="detalle-producto.html?codigo=${encodeURIComponent(producto.codigo)}">
          <img src="${M.escaparHTML(producto.imagen)}" alt="${M.escaparHTML(producto.nombre)}" loading="lazy">
          <h3>${M.escaparHTML(producto.nombre)}</h3>
        </a>
        <p class="precio">${M.formatearPrecio(producto.precio)}</p>
        <button type="button" class="btn-add-cart" data-codigo="${M.escaparHTML(producto.codigo)}">Añadir</button>
      </article>`;
  }

  function iniciarDetalle() {
    const M = window.MilSabores;
    const producto = M && M.buscarProducto(new URLSearchParams(window.location.search).get('codigo') || 'TC001');
    if (!producto) {
      M?.notificar('El producto solicitado no existe.', 'error');
      window.setTimeout(() => { window.location.href = 'productos.html'; }, 500);
      return;
    }

    const imagenPrincipal = document.querySelector('#imagen-principal');
    const nombre = document.querySelector('#nombre-producto');
    const precio = document.querySelector('#precio-producto');
    const descripcion = document.querySelector('#descripcion-producto');
    const breadcrumb = document.querySelector('#breadcrumb-producto');

    if (imagenPrincipal) {
      imagenPrincipal.src = producto.imagen;
      imagenPrincipal.alt = producto.nombre;
    }
    if (nombre) nombre.textContent = producto.nombre;
    if (precio) precio.textContent = M.formatearPrecio(producto.precio);
    if (descripcion) descripcion.textContent = producto.descripcion;
    if (breadcrumb) breadcrumb.textContent = producto.nombre;
    document.title = `${producto.nombre} - Pastelería Mil Sabores`;

    document.querySelectorAll('.miniaturas img').forEach((miniatura) => {
      miniatura.src = producto.imagen;
      miniatura.alt = `Vista de ${producto.nombre}`;
      miniatura.addEventListener('click', () => {
        if (imagenPrincipal) imagenPrincipal.src = miniatura.src;
      });
    });

    const relacionados = document.querySelector('#lista-relacionados');
    if (relacionados) {
      const lista = M.productos
        .filter((elemento) => elemento.categoria === producto.categoria && elemento.codigo !== producto.codigo)
        .slice(0, 4);
      relacionados.innerHTML = (lista.length ? lista : M.productos.filter((elemento) => elemento.codigo !== producto.codigo).slice(0, 4))
        .map(construirRelacionado).join('');
      relacionados.addEventListener('click', (evento) => {
        const boton = evento.target.closest('.btn-add-cart');
        if (boton) {
          evento.preventDefault();
          M.agregarAlCarrito(boton.dataset.codigo, 1, '');
        }
      });
    }

    const formulario = document.querySelector('#form-agregar-carrito');
    formulario?.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const cantidad = Number.parseInt(document.querySelector('#cantidad')?.value || '1', 10);
      const mensaje = document.querySelector('#mensaje-personalizado')?.value.trim() || '';
      if (mensaje.length > 100) {
        M.notificar('El mensaje personalizado no puede superar los 100 caracteres.', 'error');
        return;
      }
      M.agregarAlCarrito(producto.codigo, cantidad, mensaje);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarDetalle);
  } else {
    iniciarDetalle();
  }
}());
