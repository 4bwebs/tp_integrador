document.addEventListener('DOMContentLoaded', () => {
    console.log("¡JavaScript conectado correctamente!");
    const formVeterinario = document.getElementById('form-veterinario');
    const listadoVeterinarios = document.getElementById('listado-veterinarios');
    const totalVeterinarios = document.getElementById('total-veterinarios');
    const btnCancelar = document.getElementById('btnCancelar');
    const formTitulo = document.getElementById('form-titulo');
    const btnGuardar = document.getElementById('btnGuardar');

    // Clave para LocalStorage exigida en la consigna
    const STORAGE_KEY = 'veterinarios';

    // Obtener veterinarios almacenados o inicializar array vacío
    let veterinarios = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // Función para renderizar la tabla y el contador total
    function renderizarTabla() {
        listadoVeterinarios.innerHTML = '';
        
        if (veterinarios.length === 0) {
            listadoVeterinarios.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">No hay veterinarios registrados.</td></tr>`;
            totalVeterinarios.textContent = '0';
            return;
        }

        totalVeterinarios.textContent = veterinarios.length;

        veterinarios.forEach(vet => {
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

    // Manejar el envío del formulario (Alta o Modificación)
    formVeterinario.addEventListener('submit', (e) => {
        e.preventDefault();

        const idEditando = document.getElementById('idVeterinario').value;
        const matricula = parseInt(document.getElementById('matricula').value);
        const nombre = document.getElementById('nombre').value.trim();
        const especializacion = document.getElementById('especialidad').value;
        const valorConsulta = parseFloat(document.getElementById('valorConsulta').value);

        if (idEditando) {
            // Si hay un ID, estamos editando un registro existente
            veterinarios = veterinarios.map(vet => {
                if (vet.idVeterinario === idEditando) {
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
            // Si no hay ID, es un alta nueva (generamos UID automáticamente)
            const nuevoVeterinario = {
                idVeterinario: crypto.randomUUID(),
                matricula,
                nombre,
                especializacion,
                valorConsulta
            };
            veterinarios.push(nuevoVeterinario);
        }

        // Guardar cambios y actualizar la interfaz
        guardarYActualizar();
        resetearFormulario();
    });

    // Guardar en LocalStorage y redibujar la tabla
    function guardarYActualizar() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(veterinarios));
        renderizarTabla();
    }

    // Limpiar el formulario y volver al modo "Registrar"
    function resetearFormulario() {
        formVeterinario.reset();
        document.getElementById('idVeterinario').value = '';
        formTitulo.textContent = 'Registrar Veterinario';
        btnGuardar.textContent = 'Registrar';
    }
 // Botón cancelar
    btnCancelar.addEventListener('click', () => {
        resetearFormulario();
    });

    // Funciones globales accesibles desde los botones de la tabla dinámicos
    window.cargarParaEditar = function(id) {
        const vet = veterinarios.find(v => v.idVeterinario === id);
        if (!vet) return;

        document.getElementById('idVeterinario').value = vet.idVeterinario;
        document.getElementById('matricula').value = vet.matricula;
        document.getElementById('nombre').value = vet.nombre;
        document.getElementById('especialidad').value = vet.especialidad;
        document.getElementById('valorConsulta').value = vet.valorConsulta;

        formTitulo.textContent = 'Editar Veterinario';
        btnGuardar.textContent = 'Actualizar';
        
        // Desplazarse suavemente hacia arriba en pantallas chicas si es necesario
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    let idEliminarVeterinario = null;

    window.eliminarVeterinario = function(id) {
        idEliminarVeterinario = id;
        const modalEliminar = document.getElementById('modalEliminar');
        const modalBootstrap = new bootstrap.Modal(modalEliminar);
        modalBootstrap.show();
    };

    document.getElementById('confirmarEliminar').addEventListener('click', () => {
        if (idEliminarVeterinario) {
            veterinarios = veterinarios.filter(vet => vet.idVeterinario !== idEliminarVeterinario);
            guardarYActualizar();
            idEliminarVeterinario = null;
        }
        const modalEliminar = document.getElementById('modalEliminar');
        const modalBootstrap = bootstrap.Modal.getInstance(modalEliminar);
        modalBootstrap.hide();
    });

    // Inicializar la tabla al cargar la página por primera vez
    renderizarTabla();
});
