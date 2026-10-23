const Mascotas = [];

let listaMascotas = document.getElementById("lista-mascotas");

let total = document.getElementById("total");

let formulario = document.getElementById("form-mascotas");

document.addEventListener('DOMContentLoaded', () => {
    // 1. Referencias a elementos del DOM
    const listaMascotas = document.getElementById("listado-mascotas") || document.getElementById("lista-mascotas");
    const total = document.getElementById("total");
    const formulario = document.getElementById("form-mascotas") || document.getElementById("form-paciente");
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
    let idEliminarMascota = null;

    function renderizarTabla() {
        if (!listaMascotas) return;
        listaMascotas.innerHTML = '';

        if (mascotas.length === 0) {
            listaMascotas.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No hay mascotas registradas.</td></tr>`;
            if (total) total.textContent = '0';
            if (miContador) miContador.textContent = '0 mascotas';
            return;
        }
        
        if (total) total.textContent = mascotas.length;
        if (miContador) miContador.textContent = `${mascotas.length} mascotas`;

        const filtro = buscadorMascotas ? buscadorMascotas.value.toLowerCase() : "";
        const listaFiltrada = mascotas.filter(m => 
            m.nombreMascota.toLowerCase().includes(filtro) || 
            m.nombreDuenio.toLowerCase().includes(filtro)
        );

        if (listaFiltrada.length === 0 && filtro !== "") {
            listaFiltrada.innerHTML = '';
            listaMascotas.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No se encontró "${filtro}"</td></tr>`;
            return;
        }

        listaFiltrada.forEach(masc => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${masc.nombreMascota}</td>
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

    function guardarYActualizar() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mascotas));
        renderizarTabla();
    }

    function resetearFormulario() {
        if (formulario) formulario.reset();
        idEditando = null;
        const btnSubmit = formulario ? formulario.querySelector('button[type="submit"]') : null;
        if (btnSubmit) btnSubmit.textContent = 'Agregar Paciente';
    }

    if (formulario) {
        formulario.addEventListener('submit', (e) => {
            e.preventDefault();
            const nueva = { 
                idMascota: idEditando || crypto.randomUUID(),
                nombreMascota: inputPaciente ? inputPaciente.value.trim() : '', 
                nombreDuenio: inputDueno ? inputDueno.value.trim() : '', 
                peso: inputPeso ? inputPeso.value : '',
                edad: inputEdad ? inputEdad.value : '', 
                color: inputColor ? inputColor.value.trim() : ''
            };

            if (idEditando) {
                mascotas = mascotas.map(m => m.idMascota === idEditando ? nueva : m); 
            } else {
                mascotas.push(nueva);
            }

            guardarYActualizar();
            resetearFormulario();
        });
    }

    if (buscadorMascotas) {
        buscadorMascotas.addEventListener('input', renderizarTabla);
    }

    window.cargarParaEditar = function (id) {
        const masc = mascotas.find(v => v.idMascota === id);
        if (!masc) return;

        if (inputPaciente) inputPaciente.value = masc.nombreMascota;
        if (inputDueno) inputDueno.value = masc.nombreDuenio;
        if (inputPeso) inputPeso.value = masc.peso;
        if (inputEdad) inputEdad.value = masc.edad;
        if (inputColor) inputColor.value = masc.color;
        
        idEditando = id;
        const btnSubmit = formulario ? formulario.querySelector('button[type="submit"]') : null;
        if (btnSubmit) btnSubmit.textContent = 'Actualizar';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.eliminarMascota = function (id) {
        idEliminarMascota = id;
        const modalElement = document.getElementById('modalEliminar');
        if (modalElement) {
            const modalBootstrap = bootstrap.Modal.getOrCreateInstance(modalElement);
            modalBootstrap.show();
        }
    };

    const confirmarEliminarBtn = document.getElementById('confirmarEliminar');
    if (confirmarEliminarBtn) {
        confirmarEliminarBtn.addEventListener('click', () => {
            if (idEliminarMascota !== null) {
                mascotas = mascotas.filter(m => m.idMascota !== idEliminarMascota);
                guardarYActualizar();
                
                if (idEditando === idEliminarMascota) {
                    resetearFormulario();
                }

                const modalElement = document.getElementById('modalEliminar');
                if (modalElement) {
                    const modalBootstrap = bootstrap.Modal.getInstance(modalElement);
                    if (modalBootstrap) {
                        modalBootstrap.hide();
                    }
                }

                idEliminarMascota = null;
            }
        });
    }

    renderizarTabla();
});