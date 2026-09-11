/* Validaciones de login, registro y contacto. Se ejecutan también en tiempo real. */
(function () {
  'use strict';

  const EMAIL_RFC2822 = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  const CONTRASENA = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{4,10}$/;

  function campo(id) { return document.querySelector(`#${id}`); }

  function obtenerError(id) {
    const input = campo(id);
    if (!input) return null;
    let error = document.querySelector(`#error-${id}`);
    if (!error) {
      error = document.createElement('span');
      error.id = `error-${id}`;
      error.className = 'mensaje-error';
      input.closest('.campo')?.appendChild(error);
    }
    return error;
  }

  function mostrarError(id, mensaje) {
    const input = campo(id);
    const error = obtenerError(id);
    if (input) input.classList.toggle('campo-invalido', Boolean(mensaje));
    if (error) error.textContent = mensaje || '';
    return !mensaje;
  }

  function mensajeFormulario(formulario, texto, exito) {
    let mensaje = formulario.querySelector('.mensaje-formulario');
    if (!mensaje) {
      mensaje = document.createElement('p');
      mensaje.className = 'mensaje-formulario';
      mensaje.setAttribute('role', exito ? 'status' : 'alert');
      formulario.appendChild(mensaje);
    }
    mensaje.dataset.tipo = exito ? 'success' : 'error';
    mensaje.textContent = texto;
  }

  function validarEmail(id, obligatorio) {
    const valor = campo(id)?.value.trim() || '';
    if (!valor && !obligatorio) return mostrarError(id, '');
    if (!valor) return mostrarError(id, 'El correo es obligatorio.');
    if (valor.length > 100) return mostrarError(id, 'Máximo 100 caracteres.');
    return mostrarError(id, EMAIL_RFC2822.test(valor) ? '' : 'Ingresa un correo válido.');
  }

  function validarContrasena(id) {
    const valor = campo(id)?.value || '';
    if (!valor) return mostrarError(id, 'La contraseña es obligatoria.');
    if (valor.length < 4 || valor.length > 10) return mostrarError(id, 'Debe tener entre 4 y 10 caracteres.');
    return mostrarError(id, CONTRASENA.test(valor) ? '' : 'Usa letras, números y al menos un carácter especial.');
  }

  function validarRun(valor) {
    const run = String(valor || '').trim().toUpperCase();
    if (!/^\d{7,8}[0-9K]$/.test(run)) return false;
    const cuerpo = run.slice(0, -1);
    const digito = run.slice(-1);
    let suma = 0;
    let multiplicador = 2;
    for (let i = cuerpo.length - 1; i >= 0; i -= 1) {
      suma += Number(cuerpo[i]) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    const resto = 11 - (suma % 11);
    const esperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
    return digito === esperado;
  }

  function validarTexto(id, nombre, maximo) {
    const input = campo(id);
    const valor = input?.value.trim() || '';
    if (!valor) {
      const frase = id === 'direccion' ? 'es obligatoria' : id === 'apellidos' ? 'son obligatorios' : 'es obligatorio';
      return mostrarError(id, `${nombre} ${frase}.`);
    }
    if (valor.length > maximo) return mostrarError(id, `Máximo ${maximo} caracteres.`);
    return mostrarError(id, '');
  }

  function validarLogin(formulario) {
    const correoValido = validarEmail('correo', true);
    const contrasenaValida = validarContrasena('contrasena');
    return correoValido && contrasenaValida;
  }

  function validarRegistro() {
    const run = campo('run')?.value.trim().toUpperCase() || '';
    const runValido = mostrarError('run', !run ? 'El RUN es obligatorio.' : validarRun(run) ? '' : 'RUN inválido. Usa formato 19011022K, sin puntos ni guion.');
    const nombreValido = validarTexto('nombre', 'El nombre', 50);
    const apellidosValido = validarTexto('apellidos', 'Los apellidos', 100);
    const correoValido = validarEmail('correo', true);
    const confirmarCorreo = campo('confirmar-correo')?.value.trim() || '';
    const confirmarCorreoValido = mostrarError('confirmar-correo', !confirmarCorreo ? 'Confirma tu correo.' : confirmarCorreo !== (campo('correo')?.value.trim() || '') ? 'Los correos no coinciden.' : '');
    const contrasenaValida = validarContrasena('contrasena');
    const confirmarContrasena = campo('confirmar-contrasena')?.value || '';
    const confirmarContrasenaValida = mostrarError('confirmar-contrasena', !confirmarContrasena ? 'Confirma tu contraseña.' : confirmarContrasena !== (campo('contrasena')?.value || '') ? 'Las contraseñas no coinciden.' : '');
    const regionValida = mostrarError('region', campo('region')?.value ? '' : 'Selecciona una región.');
    const comunaValida = mostrarError('comuna', campo('comuna')?.value ? '' : 'Selecciona una comuna.');
    const direccionValida = validarTexto('direccion', 'La dirección', 300);
    return runValido && nombreValido && apellidosValido && correoValido && confirmarCorreoValido &&
      contrasenaValida && confirmarContrasenaValida && regionValida && comunaValida && direccionValida;
  }

  function edadEnAnios(fecha) {
    if (!fecha) return 0;
    const nacimiento = new Date(`${fecha}T00:00:00`);
    if (Number.isNaN(nacimiento.getTime())) return 0;
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const aunNoCumple = hoy.getMonth() < nacimiento.getMonth() ||
      (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());
    if (aunNoCumple) edad -= 1;
    return edad;
  }

  function esCumpleanos(fecha) {
    if (!fecha) return false;
    const nacimiento = new Date(`${fecha}T00:00:00`);
    const hoy = new Date();
    return nacimiento.getMonth() === hoy.getMonth() && nacimiento.getDate() === hoy.getDate();
  }

  function registrarUsuario(formulario) {
    const M = window.MilSabores;
    const correo = campo('correo').value.trim().toLowerCase();
    const promocion = campo('codigo-promocional')?.value.trim().toUpperCase() || '';
    const edad = edadEnAnios(campo('fecha-nacimiento')?.value || '');
    const duoc = /@(duoc\.cl|profesor\.duoc\.cl)$/i.test(correo);
    const usuario = {
      run: campo('run').value.trim().toUpperCase(),
      nombre: campo('nombre').value.trim(),
      apellidos: campo('apellidos').value.trim(),
      correo,
      contrasena: campo('contrasena').value,
      fechaNacimiento: campo('fecha-nacimiento')?.value || '',
      region: campo('region').value,
      comuna: campo('comuna').value,
      direccion: campo('direccion').value.trim(),
      codigoPromocional: promocion,
      beneficios: {
        descuentoEdad50: edad >= 50,
        descuentoVitalicio: promocion === 'FELICES50',
        tortaCumpleanosDuoc: duoc && esCumpleanos(campo('fecha-nacimiento')?.value || '')
      }
    };

    M.guardarJSON(M.STORAGE_USER, usuario);

M.guardarJSON(M.STORAGE_SESSION, {
  correo: usuario.correo,
  nombre: usuario.nombre
});

  window.dispatchEvent(new Event('mil:sesion-actualizada'));

mensajeFormulario(
  formulario,
  'Registro exitoso. Tu cuenta quedó guardada en este navegador.',
  true
);
  }

  function iniciarLogin() {
    const formulario = document.querySelector('#form-login');
    if (!formulario) return;
    const actualizar = () => { validarLogin(formulario); };
    ['correo', 'contrasena'].forEach((id) => campo(id)?.addEventListener('input', actualizar));
    formulario.addEventListener('submit', (evento) => {
      evento.preventDefault();
      if (!validarLogin(formulario)) return;

      const M = window.MilSabores;
      const usuario = M.usuarioActual();
      const correo = campo('correo').value.trim().toLowerCase();
      const contrasena = campo('contrasena').value;
      if (usuario && usuario.correo === correo && usuario.contrasena !== contrasena) {
        mostrarError('contrasena', 'La contraseña no coincide con la cuenta registrada.');
        return;
      }
      M.guardarJSON(M.STORAGE_SESSION, {
  correo,
  nombre: usuario?.nombre || 'Cliente'
});
      M.notificar('Sesión iniciada correctamente.');
    });
    window.dispatchEvent(new Event('mil:sesion-actualizada'));


  }

  function iniciarRegistro() {
    const formulario = document.querySelector('#form-registro');
    if (!formulario) return;
    const campos = ['run', 'nombre', 'apellidos', 'correo', 'confirmar-correo', 'contrasena', 'confirmar-contrasena', 'region', 'comuna', 'direccion'];
    campos.forEach((id) => campo(id)?.addEventListener('input', validarRegistro));
    ['region', 'comuna'].forEach((id) => campo(id)?.addEventListener('change', validarRegistro));
    formulario.addEventListener('submit', (evento) => {
      evento.preventDefault();
      if (validarRegistro()) registrarUsuario(formulario);
      else mensajeFormulario(formulario, 'Revisa los campos marcados antes de continuar.', false);
    });
  }

  function iniciarContacto() {
    const formulario = document.querySelector('#form-contacto');
    if (!formulario) return;
    ['nombre', 'correo', 'comentario'].forEach((id) => campo(id)?.addEventListener('input', () => {
      if (id === 'nombre') validarTexto('nombre', 'El nombre', 100);
      if (id === 'correo') validarEmail('correo', false);
      if (id === 'comentario') {
        const valor = campo('comentario').value.trim();
        mostrarError('comentario', !valor ? 'El comentario es obligatorio.' : valor.length > 500 ? 'Máximo 500 caracteres.' : '');
      }
    }));
    formulario.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const nombreValido = validarTexto('nombre', 'El nombre', 100);
      const correoValido = validarEmail('correo', false);
      const comentario = campo('comentario').value.trim();
      const comentarioValido = mostrarError('comentario', !comentario ? 'El comentario es obligatorio.' : comentario.length > 500 ? 'Máximo 500 caracteres.' : '');
      if (!(nombreValido && correoValido && comentarioValido)) {
        mensajeFormulario(formulario, 'Revisa los campos marcados antes de enviar.', false);
        return;
      }
      const M = window.MilSabores;
      const mensajes = M.leerJSON('milSaboresMensajes', []);
      mensajes.push({ nombre: campo('nombre').value.trim(), correo: campo('correo').value.trim(), comentario, fecha: new Date().toISOString() });
      M.guardarJSON('milSaboresMensajes', mensajes);
      mensajeFormulario(formulario, 'Mensaje enviado correctamente. Gracias por contactarnos.', true);
      M.notificar('Tu mensaje fue enviado.');
      formulario.reset();
    });
  }

  function iniciar() {
    iniciarLogin();
    iniciarRegistro();
    iniciarContacto();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
}());
