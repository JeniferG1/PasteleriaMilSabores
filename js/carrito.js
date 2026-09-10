/* Render y operaciones del carrito persistido en localStorage. */
(function () {
  'use strict';

  let cuponAplicado = '';

  function mensajeCupon(texto, tipo) {
    let elemento = document.querySelector('#mensaje-cupon');
    if (!elemento) {
      elemento = document.createElement('p');
      elemento.id = 'mensaje-cupon';
      elemento.setAttribute('role', 'status');
      const boton = document.querySelector('#btn-aplicar-cupon');
      boton?.insertAdjacentElement('afterend', elemento);
    }
    elemento.textContent = texto;
    elemento.dataset.tipo = tipo || 'info';
  }

  function construirItem(item) {
    const M = window.MilSabores;
    const clave = M.claveItem(item);
    return `
      <article class="carrito-item" data-clave="${M.escaparHTML(clave)}">
        <div class="carrito-item-info">
          <h3>${M.escaparHTML(item.nombre)}</h3>
          <p class="precio">${M.formatearPrecio(item.precio)} cada uno</p>
          ${item.mensaje ? `<p>Mensaje: <em>${M.escaparHTML(item.mensaje)}</em></p>` : ''}
        </div>
        <div class="carrito-item-controles">
          <label>Cantidad
            <input class="input-cantidad" type="number" min="1" max="99" value="${item.cantidad}" aria-label="Cantidad de ${M.escaparHTML(item.nombre)}">
          </label>
          <strong>${M.formatearPrecio(item.precio * item.cantidad)}</strong>
          <button type="button" class="btn-secundario btn-quitar" data-accion="quitar">Eliminar</button>
        </div>
      </article>`;
  }

  function renderizar() {
    const M = window.MilSabores;
    const contenedor = document.querySelector('#carrito-items');
    const total = document.querySelector('#carrito-total');
    if (!contenedor || !M) return;

    const carrito = M.obtenerCarrito();
    const subtotal = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
    const descuento = M.informacionDescuento(cuponAplicado);
    const montoDescuento = Math.round(subtotal * descuento.porcentaje / 100);
    const totalFinal = subtotal - montoDescuento;

    if (!carrito.length) {
      contenedor.innerHTML = '<p id="carrito-vacio">Tu carrito está vacío. <a href="productos.html">Ver productos</a></p>';
    } else {
      contenedor.innerHTML = carrito.map(construirItem).join('');
    }

    const resumen = document.querySelector('.carrito-resumen');
    let detalle = document.querySelector('#detalle-totales');
    if (!detalle && resumen) {
      detalle = document.createElement('div');
      detalle.id = 'detalle-totales';
      const totalActual = document.querySelector('#carrito-total')?.parentElement;
      totalActual?.insertAdjacentElement('beforebegin', detalle);
    }
    if (detalle) {
      detalle.innerHTML = `
        <p>Subtotal: <span>${M.formatearPrecio(subtotal)}</span></p>
        <p>Descuento: <span>${descuento.porcentaje ? `-${M.formatearPrecio(montoDescuento)}` : M.formatearPrecio(0)}</span></p>`;
    }
    if (total) total.textContent = M.formatearPrecio(totalFinal);

    const pagar = document.querySelector('#btn-pagar');
    if (pagar) pagar.disabled = carrito.length === 0;
  }

  function iniciarCarrito() {
    const M = window.MilSabores;
    if (!M) return;
    renderizar();

    document.querySelector('#carrito-items')?.addEventListener('click', (evento) => {
      const boton = evento.target.closest('[data-accion="quitar"]');
      if (!boton) return;
      const item = boton.closest('.carrito-item');
      if (!item) return;
      M.quitarDelCarrito(item.dataset.clave);
      M.notificar('Producto eliminado del carrito.');
      renderizar();
    });

    document.querySelector('#carrito-items')?.addEventListener('change', (evento) => {
      const input = evento.target.closest('.input-cantidad');
      const item = input?.closest('.carrito-item');
      if (!input || !item) return;
      const cantidad = Number.parseInt(input.value, 10);
      if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 99) {
        input.value = '1';
        M.notificar('La cantidad debe estar entre 1 y 99.', 'error');
        return;
      }
      M.cambiarCantidad(item.dataset.clave, cantidad);
      renderizar();
    });

    document.querySelector('#btn-aplicar-cupon')?.addEventListener('click', () => {
      const entrada = document.querySelector('#cupon');
      const codigo = entrada?.value.trim().toUpperCase() || '';
      if (!codigo) {
        cuponAplicado = '';
        mensajeCupon('Ingresa un código para aplicar un descuento.', 'error');
        renderizar();
        return;
      }
      if (codigo !== 'FELICES50') {
        cuponAplicado = '';
        mensajeCupon('El cupón no es válido.', 'error');
        renderizar();
        return;
      }
      cuponAplicado = codigo;
      mensajeCupon('Cupón FELICES50 aplicado: 10% de descuento.', 'success');
      renderizar();
    });

    document.querySelector('#btn-pagar')?.addEventListener('click', () => {
      const carrito = M.obtenerCarrito();
      if (!carrito.length) {
        M.notificar('Agrega al menos un producto antes de pagar.', 'error');
        return;
      }
      const descuento = M.informacionDescuento(cuponAplicado);
      const subtotal = M.totalCarrito();
      const total = subtotal - Math.round(subtotal * descuento.porcentaje / 100);
      const confirmar = typeof window.confirm !== 'function' || window.confirm(`Total a pagar: ${M.formatearPrecio(total)}. ¿Confirmar pedido?`);
      if (!confirmar) return;

      const pedido = {
        numero: `MS-${Date.now().toString().slice(-8)}`,
        fecha: new Date().toISOString(),
        items: carrito,
        total,
        estado: 'Preparando pedido'
      };
      const pedidos = M.leerJSON('milSaboresPedidos', []);
      pedidos.push(pedido);
      M.guardarJSON('milSaboresPedidos', pedidos);
      M.guardarCarrito([]);
      cuponAplicado = '';
      const cupon = document.querySelector('#cupon');
      if (cupon) cupon.value = '';
      mensajeCupon('', 'info');
      renderizar();
      M.notificar(`Pedido ${pedido.numero} confirmado. ¡Gracias por tu compra!`);
    });

    window.addEventListener('mil:carrito-actualizado', renderizar);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarCarrito);
  } else {
    iniciarCarrito();
  }
}());
