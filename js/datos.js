/* Datos y utilidades compartidas de Pastelería Mil Sabores. */
(function (global) {
  'use strict';

  const productos = [
    {
      codigo: 'TC001', categoria: 'tortas-cuadradas', tamano: 'mediano',
      nombre: 'Torta Cuadrada de Chocolate', precio: 45000,
      imagen: 'Torta cuadrada de chocolate.jpg',
      descripcion: 'Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales.'
    },
    {
      codigo: 'TC002', categoria: 'tortas-cuadradas', tamano: 'grande',
      nombre: 'Torta Cuadrada de Frutas', precio: 50000,
      imagen: 'img/torta-cuadrada-frutas.jpg',
      descripcion: 'Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones.'
    },
    {
      codigo: 'TT001', categoria: 'tortas-circulares', tamano: 'mediano',
      nombre: 'Torta Circular de Vainilla', precio: 40000,
      imagen: 'img/torta-circular-vainilla.jpg',
      descripcion: 'Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión.'
    },
    {
      codigo: 'TT002', categoria: 'tortas-circulares', tamano: 'grande',
      nombre: 'Torta Circular de Manjar', precio: 42000,
      imagen: 'img/torta-circular-manjar.jpg',
      descripcion: 'Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos.'
    },
    {
      codigo: 'PI001', categoria: 'postres-individuales', tamano: 'individual',
      nombre: 'Mousse de Chocolate', precio: 5000,
      imagen: 'img/mousse-chocolate.jpg',
      descripcion: 'Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate.'
    },
    {
      codigo: 'PI002', categoria: 'postres-individuales', tamano: 'individual',
      nombre: 'Tiramisú Clásico', precio: 5500,
      imagen: 'img/tiramisu.jpg',
      descripcion: 'Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida.'
    },
    {
      codigo: 'PSA001', categoria: 'sin-azucar', tamano: 'mediano',
      nombre: 'Torta Sin Azúcar de Naranja', precio: 48000,
      imagen: 'img/torta-sin-azucar-naranja.jpg',
      descripcion: 'Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables.'
    },
    {
      codigo: 'PSA002', categoria: 'sin-azucar', tamano: 'grande',
      nombre: 'Cheesecake Sin Azúcar', precio: 47000,
      imagen: 'img/cheesecake-sin-azucar.jpg',
      descripcion: 'Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa.'
    },
    {
      codigo: 'PT001', categoria: 'tradicional', tamano: 'individual',
      nombre: 'Empanada de Manzana', precio: 3000,
      imagen: 'img/empanada-manzana.jpg',
      descripcion: 'Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda.'
    },
    {
      codigo: 'PT002', categoria: 'tradicional', tamano: 'individual',
      nombre: 'Tarta de Santiago', precio: 6000,
      imagen: 'img/tarta-santiago.jpg',
      descripcion: 'Tradicional tarta española hecha con almendras, azúcar y huevos, una delicia para los amantes de los postres clásicos.'
    },
    {
      codigo: 'PG001', categoria: 'sin-gluten', tamano: 'individual',
      nombre: 'Brownie Sin Gluten', precio: 4000,
      imagen: 'img/brownie-sin-gluten.jpg',
      descripcion: 'Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor.'
    },
    {
      codigo: 'PG002', categoria: 'sin-gluten', tamano: 'chico',
      nombre: 'Pan Sin Gluten', precio: 3500,
      imagen: 'img/pan-sin-gluten.jpg',
      descripcion: 'Suave y esponjoso, ideal para sándwiches o para acompañar cualquier comida.'
    },
    {
      codigo: 'PV001', categoria: 'vegana', tamano: 'mediano',
      nombre: 'Torta Vegana de Chocolate', precio: 50000,
      imagen: 'img/torta-vegana-chocolate.jpg',
      descripcion: 'Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos.'
    },
    {
      codigo: 'PV002', categoria: 'vegana', tamano: 'chico',
      nombre: 'Galletas Veganas de Avena', precio: 4500,
      imagen: 'img/galletas-veganas.jpg',
      descripcion: 'Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano.'
    },
    {
      codigo: 'TE001', categoria: 'especiales', tamano: 'grande',
      nombre: 'Torta Especial de Cumpleaños', precio: 55000,
      imagen: 'img/torta-especial-cumpleanos.jpg',
      descripcion: 'Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos.'
    },
    {
      codigo: 'TE002', categoria: 'especiales', tamano: 'grande',
      nombre: 'Torta Especial de Boda', precio: 60000,
      imagen: 'img/torta-especial-boda.jpg',
      descripcion: 'Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda.'
    }
  ];

  const STORAGE_CART = 'milSaboresCarrito';
  const STORAGE_USER = 'milSaboresUsuario';
  const STORAGE_SESSION = 'milSaboresSesion';

  function leerJSON(clave, valorPorDefecto) {
    try {
      const valor = global.localStorage.getItem(clave);
      return valor ? JSON.parse(valor) : valorPorDefecto;
    } catch (error) {
      return valorPorDefecto;
    }
  }

  function guardarJSON(clave, valor) {
    try {
      global.localStorage.setItem(clave, JSON.stringify(valor));
      return true;
    } catch (error) {
      return false;
    }
  }

  function buscarProducto(codigo) {
    return productos.find((producto) => producto.codigo === String(codigo)) || null;
  }

  function limitarCantidad(cantidad) {
    const numero = Number.parseInt(cantidad, 10);
    return Number.isFinite(numero) ? Math.min(99, Math.max(1, numero)) : 1;
  }

  function normalizarItem(item) {
    const producto = buscarProducto(item && item.codigo);
    if (!producto) return null;
    return {
      codigo: producto.codigo,
      cantidad: limitarCantidad(item.cantidad),
      mensaje: String((item && item.mensaje) || '').trim().slice(0, 100)
    };
  }

  function obtenerCarrito() {
    const guardado = leerJSON(STORAGE_CART, []);
    if (!Array.isArray(guardado)) return [];
    return guardado
      .map(normalizarItem)
      .filter(Boolean)
      .map((item) => Object.assign({}, buscarProducto(item.codigo), item));
  }

  function guardarCarrito(items) {
    const normalizados = (Array.isArray(items) ? items : [])
      .map(normalizarItem)
      .filter(Boolean);
    guardarJSON(STORAGE_CART, normalizados);
    emitir('mil:carrito-actualizado', { carrito: obtenerCarrito() });
    return obtenerCarrito();
  }

  function claveItem(item) {
    return `${item.codigo}::${item.mensaje || ''}`;
  }

  function agregarAlCarrito(codigo, cantidad, mensaje) {
    const producto = buscarProducto(codigo);
    if (!producto) return false;

    const carrito = obtenerCarrito().map((item) => ({
      codigo: item.codigo,
      cantidad: item.cantidad,
      mensaje: item.mensaje
    }));
    const nuevo = {
      codigo: producto.codigo,
      cantidad: limitarCantidad(cantidad),
      mensaje: String(mensaje || '').trim().slice(0, 100)
    };
    const existente = carrito.find((item) => claveItem(item) === claveItem(nuevo));

    if (existente) {
      existente.cantidad = Math.min(99, existente.cantidad + nuevo.cantidad);
    } else {
      carrito.push(nuevo);
    }

    guardarCarrito(carrito);
    notificar(`${producto.nombre} se añadió al carrito.`);
    return true;
  }

  function cambiarCantidad(clave, cantidad) {
    const carrito = obtenerCarrito()
      .map((item) => ({ codigo: item.codigo, cantidad: item.cantidad, mensaje: item.mensaje }));
    const item = carrito.find((elemento) => claveItem(elemento) === clave);
    if (!item) return;
    item.cantidad = limitarCantidad(cantidad);
    guardarCarrito(carrito);
  }

  function quitarDelCarrito(clave) {
    const carrito = obtenerCarrito()
      .map((item) => ({ codigo: item.codigo, cantidad: item.cantidad, mensaje: item.mensaje }))
      .filter((item) => claveItem(item) !== clave);
    guardarCarrito(carrito);
  }

  function totalUnidades() {
    return obtenerCarrito().reduce((total, item) => total + item.cantidad, 0);
  }

  function totalCarrito() {
    return obtenerCarrito().reduce((total, item) => total + item.precio * item.cantidad, 0);
  }

  function usuarioActual() {
    return leerJSON(STORAGE_USER, null);
  }

  function informacionDescuento(cupon) {
    const usuario = usuarioActual();
    const codigo = String(cupon || '').trim().toUpperCase();
    let porcentaje = 0;
    let motivo = '';

    if (usuario && usuario.beneficios && usuario.beneficios.descuentoEdad50) {
      porcentaje = 50;
      motivo = 'Descuento de aniversario (50%)';
    } else if (usuario && usuario.beneficios && usuario.beneficios.descuentoVitalicio) {
      porcentaje = 10;
      motivo = 'Beneficio FELICES50 (10%)';
    }

    if (codigo === 'FELICES50' && porcentaje < 10) {
      porcentaje = 10;
      motivo = 'Cupón FELICES50 (10%)';
    }

    return { porcentaje, motivo };
  }

  function formatearPrecio(valor) {
    const numero = Number(valor) || 0;
    return `${new Intl.NumberFormat('es-CL', {
      style: 'currency', currency: 'CLP', maximumFractionDigits: 0
    }).format(numero)} CLP`;
  }

  function escaparHTML(valor) {
    return String(valor == null ? '' : valor)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function emitir(nombre, detalle) {
    if (typeof global.dispatchEvent !== 'function') return;
    global.dispatchEvent(new CustomEvent(nombre, { detail: detalle || {} }));
  }

  function notificar(mensaje, tipo) {
    emitir('mil:notificacion', { mensaje, tipo: tipo || 'info' });
  }

  global.MilSabores = {
    productos,
    STORAGE_CART,
    STORAGE_USER,
    STORAGE_SESSION,
    leerJSON,
    guardarJSON,
    buscarProducto,
    obtenerCarrito,
    guardarCarrito,
    agregarAlCarrito,
    cambiarCantidad,
    quitarDelCarrito,
    claveItem,
    totalUnidades,
    totalCarrito,
    usuarioActual,
    informacionDescuento,
    formatearPrecio,
    escaparHTML,
    notificar
  };
}(window));
