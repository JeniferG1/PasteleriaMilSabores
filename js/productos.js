/* Catálogo, filtros y botones de compra. */
(function () {
  'use strict';

  function construirTarjeta(producto) {
    const M = window.MilSabores;
    return `
      <article class="product-card" data-codigo="${M.escaparHTML(producto.codigo)}">
        <a href="detalle-producto.html?codigo=${encodeURIComponent(producto.codigo)}">
          <img src="${M.escaparHTML(producto.imagen)}" alt="${M.escaparHTML(producto.nombre)}" loading="lazy">
          <h3>${M.escaparHTML(producto.nombre)}</h3>
        </a>
        <p class="precio">${M.formatearPrecio(producto.precio)}</p>
        <p class="producto-tamano">Tamaño: ${M.escaparHTML(producto.tamano)}</p>
        <button type="button" class="btn-add-cart" data-codigo="${M.escaparHTML(producto.codigo)}">Añadir</button>
      </article>`;
  }

  function iniciarCatalogo() {
    const M = window.MilSabores;
    const lista = document.querySelector('#lista-productos');
    const filtroCategoria = document.querySelector('#filtro-categoria');
    const filtroTamano = document.querySelector('#filtro-tamano');
    if (!lista || !M) return;

    function renderizar() {
      const categoria = filtroCategoria ? filtroCategoria.value : 'todas';
      const tamano = filtroTamano ? filtroTamano.value : 'todos';
      const filtrados = M.productos.filter((producto) =>
        (categoria === 'todas' || producto.categoria === categoria) &&
        (tamano === 'todos' || producto.tamano === tamano)
      );

      if (!filtrados.length) {
        lista.innerHTML = '<p role="status">No hay productos que coincidan con los filtros seleccionados.</p>';
        return;
      }
      lista.innerHTML = filtrados.map(construirTarjeta).join('');
    }

    renderizar();
    filtroCategoria?.addEventListener('change', renderizar);
    filtroTamano?.addEventListener('change', renderizar);

    lista.addEventListener('click', (evento) => {
      const boton = evento.target.closest('.btn-add-cart');
      if (!boton) return;
      evento.preventDefault();
      M.agregarAlCarrito(boton.dataset.codigo, 1, '');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarCatalogo);
  } else {
    iniciarCatalogo();
  }
}());
