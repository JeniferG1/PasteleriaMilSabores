/* Fuente de regiones y comunas para el formulario de registro. */
(function (global) {
  'use strict';

  const regionesComunas = {
    metropolitana: [
      'Santiago', 'Maipú', 'Puente Alto', 'Las Condes', 'La Florida', 
      , 'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central', 'Huechuraba', 
      'Independencia', 'La Cisterna', 'La Granja', 'La Pintana', 'La Reina', 'Lo Barnechea', 
      'Lo Espejo', 'Lo Prado', 'Macul', 'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén', 'Providencia', 'Pudahuel', 
      'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'San Joaquín', 'San Miguel', 'San Ramón', 'Vitacura'
    ],
    araucania: [
      'Temuco', 'Angol',
      ,'Cholchol','Cunco','Curarrehue','Freire','Galvarino','Gorbea','Lautaro',
      'Loncoche','Melipeuco','Nueva Imperial','Padre Las Casas','Perquenco','Pitrufquén',
      'Pucón','Saavedra','Teodoro Schmidt','Toltén','Vilcún','Villarrica'
    ],
    nuble: [
      'Chillán',  'San Carlos', 'Bulnes', 'Coihueco',
       'Chillán Viejo', 'El Carmen', 'Pemuco', 'Pinto', 'Quillón', 'San Ignacio', 'Yungay'
    ]
  };

  function iniciarRegiones() {
    const region = document.querySelector('#region');
    const comuna = document.querySelector('#comuna');
    if (!region || !comuna) return;

    const seleccionInicial = region.value;
    region.innerHTML = `
      <option value="">-- Seleccione la región --</option>
      <option value="metropolitana">Región Metropolitana de Santiago</option>
      <option value="araucania">Región de la Araucanía</option>
      <option value="nuble">Región de Ñuble</option>`;
    region.value = seleccionInicial;

    function actualizarComunas() {
      const comunas = regionesComunas[region.value] || [];
      comuna.innerHTML = '<option value="">-- Seleccione la comuna --</option>' +
        comunas.map((nombre) => `<option value="${nombre}">${nombre}</option>`).join('');
      comuna.disabled = comunas.length === 0;
    }

    region.addEventListener('change', actualizarComunas);
    actualizarComunas();
  }

  global.REGIONES_COMUNAS = regionesComunas;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarRegiones);
  } else {
    iniciarRegiones();
  }
}(window));
