
const veterinarios = [];

let listaVeterinarios = document.getElementById("listado-veterinarios");

let totalVeterinarios = document.getElementById("total-veterinarios");

let formulario = document.getElementById("form-veterinario");

document.addEventListener('DOMContentLoaded', () => {
    const formVeterinario = document.getElementById('form-veterinario');
    const listadoVeterinarios = document.getElementById('listado-veterinarios');
    const totalVeterinarios = document.getElementById('total-veterinarios');
    const btnCancelar = document.getElementById('btnCancelar');
    const formTitulo = document.getElementById('form-titulo');
    const btnGuardar = document.getElementById('btnGuardar');
    const buscadorVeterinarios = document.getElementById('buscadorVeterinarios');
    const contadorVeterinarios = document.getElementById('contadorVeterinarios');   
    
    // Clave para LocalStorage 
    const STORAGE_KEY = 'veterinarios';

    let veterinarios = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    let idEliminarVeterinario = null;

    function renderizarTabla() {
        if (!listadoVeterinarios) return;
        listadoVeterinarios.innerHTML = '';
        
        if (veterinarios.length === 0) {
            listadoVeterinarios.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">No hay veterinarios registrados.</td></tr>`;
            if (totalVeterinarios) totalVeterinarios.textContent = '0';
            if (contadorVeterinarios) contadorVeterinarios.textContent = '0 veterinarios';
            return;
        }

        if (totalVeterinarios) totalVeterinarios.textContent = veterinarios.length;
        if (contadorVeterinarios) contadorVeterinarios.textContent = `${veterinarios.length} veterinarios`;
        const filtro = buscadorVeterinarios ? buscadorVeterinarios.value.toLowerCase() : "";
        const listaFiltrada = veterinarios.filter(v =>
             v.nombre.toLowerCase().includes(filtro) || 
             v.especializacion.toLowerCase().includes(filtro)
        );
         
        if (listaFiltrada.length === 0 && filtro !== "") {
            listadoVeterinarios.innerHTML = `<tr><td colspan="5" class="text-center py-3">No se encontró "${filtro}"</td></tr>`;
         return;
        }
       
        listaFiltrada.forEach(vet => {
            const tr = document.createElement('tr');
            
            // Formatear el valor de la consulta en formato moneda (ARS)
            const valorFormateado = Number(vet.valorConsulta).toLocaleString('es-AR', {
                style: 'currency',
                currency: 'ARS'
            });

            tr.innerHTML = `
                <td>${vet.matricula}</td>
                <td>${vet.nombre}</td>
                <td>${vet.especializacion}</td>
                <td>${valorFormateado}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="cargarParaEditar('${vet.idVeterinario}')">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarVeterinario('${vet.idVeterinario}')">Eliminar</button>
                </td>
            `;
            listadoVeterinarios.appendChild(tr);
        });
    }

    function guardarYActualizar(){
        localStorage.setItem(STORAGE_KEY, JSON.stringify(veterinarios));
        renderizarTabla();
    }
    
    function resetearFormulario() {
        formVeterinario.reset();
        document.getElementById('idVEterinario').value = '';
        if (formTitulo) formTitulo.textContent = 'Registrar Veterinario';
        if (btnGuardar) btnGuardar.textContent = 'Registrar';
        idEditando = null;
    }

    formulario.addEventListener('submit', (e) => { 
        e.preventDefault();
        const idOculto = document.getElementById('idVeterinario').value;
        const matricula = parseInt(document.getElementById('matricula').value);
        const nombre = document.getElementById('nombre').value.trim();
        const especializacion = document.getElementById('especializacion').value;
        const valorConsulta = parseFloat(document.getElementById('valorConsulta').value);

        if (idOculto) {
            // Edición
            veterinarios = veterinarios.map(vet => {
                if (vet.idVeterinario === idOculto) {
                    return {
                        ...vet,
                        matricula,
                        nombre,
                        especializacion,
                        valorConsulta
                    };
                }
                return vet;
            });
        } else {
            // Alta nueva
            const nuevoVeterinario = {
                idVeterinario: crypto.randomUUID(),
                matricula,
                nombre,
                especializacion,
                valorConsulta
            };
            veterinarios.push(nuevoVeterinario);
        }

        guardarYActualizar();
        resetearFormulario();
    });

    // Botón cancelar
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            resetearFormulario();
        });
    }

    // Buscador en tiempo real
    if (buscadorVeterinarios) {
        buscadorVeterinarios.addEventListener('input', renderizarTabla);
    }

    // Cargar datos en el formulario para editar
    window.cargarParaEditar = function(id) {
        const vet = veterinarios.find(v => v.idVeterinario === id);
        if (!vet) return;

        document.getElementById('idVeterinario').value = vet.idVeterinario;
        document.getElementById('matricula').value = vet.matricula;
        document.getElementById('nombre').value = vet.nombre;
        document.getElementById('especializacion').value = vet.especializacion;
        document.getElementById('valorConsulta').value = vet.valorConsulta;

        if (formTitulo) formTitulo.textContent = 'Editar Veterinario';
        if (btnGuardar) btnGuardar.textContent = 'Actualizar';
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    
    window.eliminarVeterinario = function(id) {
        idEliminarVeterinario = id;
        const modalElement = document.getElementById('modalEliminar');
        if (modalElement) {
            const modalBootstrap = new bootstrap.Modal(modalElement);
            modalBootstrap.show();
        }
    };

    
    const ConfirmarEliminar = document.getElementById('confirmarEliminar');
    if (ConfirmarEliminar) {
        ConfirmarEliminar.addEventListener('click', () => {
            if (idEliminarVeterinario !== null) {
                veterinarios = veterinarios.filter(v => v.idVeterinario !== idEliminarVeterinario);
                guardarYActualizar();
                
                // Si estabas editando justo el registro que borraste, reseteamos el form
                const idOculto = document.getElementById('idVeterinario').value;
                if (idOculto === idEliminarVeterinario) {
                    resetearFormulario();
                }

                // Ocultar el modal mediante Bootstrap
                const modalElement = document.getElementById('modalEliminar');
                const modalBootstrap = bootstrap.Modal.getInstance(modalElement);
                if (modalBootstrap) {
                    modalBootstrap.hide();
                }

                idEliminarVeterinario = null;
            }
        });
    }

    renderizarTabla();
});


     