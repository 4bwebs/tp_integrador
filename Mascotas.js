const Mascotas = [];

let listaMascotas = document.getElementById("lista-mascotas");

let total = document.getElementById("total");

let formulario = document.getElementById("form-mascotas");

document.addEventListener('DOMContentLoaded', () => {
  listaMascotas = document.getElementById("listado-mascotas");
  total = document.getElementById("total");
  formulario = document.getElementById("form-paciente");

  const buscadorMascotas = document.getElementById('buscadorMascotas');
  const miContador = document.getElementById('mi-contador');
  const inputPaciente = document.getElementById('nombrePaciente');
  const inputDueno = document.getElementById('NombreDueno');
  const inputPeso = document.getElementById('peso');
  const inputEdad = document.getElementById('edad');
  const inputColor = document.getElementById('color');

  const STORAGE_KEY = 'mascotas';
  let mascotas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  let idEditando = null;

  function renderizarTabla() {
    if (!listaMascotas) return;
    listaMascotas.innerHTML = '';
    if (mascotas.length === 0) {
      listaMascotas.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No hay mascotas.</td></tr>`;
      if (total) total.textContent = '0';
      if (miContador) miContador.textContent = '0 mascotas';
      return;
    }
    if (total) total.textContent = mascotas.length;
    if (miContador) miContador.textContent = `${mascotas.length} mascotas`;
    const filtro = buscadorMascotas ? buscadorMascotas.value.toLowerCase() : "";
    const listaFiltrada = mascotas.filter(m => m.nombreMascota.toLowerCase().includes(filtro) || m.nombreDuenio.toLowerCase().includes(filtro));
        if (listaFiltrada.length === 0 && filtro !== "") {
      listaMascotas.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-3">No se encontró "${filtro}"</td></tr>`;
      return;
    }

    listaFiltrada.forEach(masc => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${masc.nombreMascota}</td>
        <td>${masc.nombreDuenio}</td>
        <td>${masc.peso}</td>
        <td>${masc.edad}</td>
        <td>${masc.color}</td>
        <td>
          <button class="btn btn-sm btn-warning me-1" onclick="cargarParaEditar('${masc.idMascota}')">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="eliminarMascota('${masc.idMascota}')">Eliminar</button>
        </td>
      `;
      listaMascotas.appendChild(tr);
    });
  }

  formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const nueva = { 
      idMascota: idEditando || crypto.randomUUID(),
       nombreMascota: inputPaciente.value.trim(), 
       nombreDuenio: inputDueno.value.trim(), 
       peso: inputPeso.value,
        edad: inputEdad.value, 
        color: inputColor.value.trim()
      };

    if (idEditando) {
       mascotas = mascotas.map(m => m.idMascota === idEditando ? nueva : m); 
       idEditando = null;
        formulario.querySelector('button[type="submit"]').textContent = 'Agregar Paciente';
      } else {
         mascotas.push(nueva);
      }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mascotas)); 
    renderizarTabla(); 
    formulario.reset();
  });

    if (buscadorMascotas) buscadorMascotas.addEventListener('input', renderizarTabla);
   window.cargarParaEditar = function (id) { const masc = mascotas.find(v => v.idMascota === id); if (!masc) return; inputPaciente.value = masc.nombreMascota; inputDueno.value = masc.nombreDuenio; inputPeso.value = masc.peso; inputEdad.value = masc.edad; inputColor.value = masc.color; idEditando = id; formulario.querySelector('button[type="submit"]').textContent = 'Actualizar'; window.scrollTo({ top: 0, behavior: 'smooth' }); };
    window.eliminarMascota = function (id) { if (confirm('¿Eliminar?')) { mascotas = mascotas.filter(v => v.idMascota !== id); localStorage.setItem(STORAGE_KEY, JSON.stringify(mascotas)); renderizarTabla(); } };
   renderizarTabla();
   });

  window.eliminarMascota = function(id) {
        idEliminarMascota = id;
        const modalElement = document.getElementById('modalEliminar');
        if (modalElement) {
            const modalBootstrap = bootstrap.Modal.getOrCreateInstance(modalElement);
            modalBootstrap.show();
        }
      };

    
    const ConfirmarEliminar = document.getElementById('confirmarEliminar');
    if (ConfirmarEliminar) {
        ConfirmarEliminar.addEventListener('click', () => {
            if (idEliminarMascota !== null) {
                mascotas = mascotas.filter(m => m.idMascota !== idEliminarMascota);
                guardarYActualizar();
                
                // Si estabas editando justo el registro que borraste, reseteamos el form
                const idOculto = document.getElementById('idMascota').value;
                if (idOculto === idEliminarMascota) {
                    resetearFormulario();
                }

                // Ocultar el modal mediante Bootstrap
                const modalElement = document.getElementById('modalEliminar');
                const modalBootstrap = bootstrap.Modal.getInstance(modalElement);
                if (modalBootstrap) {
                    modalBootstrap.hide();
                }

                idEliminarMascota = null;
            }
       });
    }        
        
    renderizarTabla(); 
