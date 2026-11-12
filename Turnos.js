if (!usuarioLogueado()){
    window.location.href = 'login.html';
}

let datos = {};
try {
    datos = JSON.parse(sessionStorage.getItem('Usuario')) || {};
} catch(e) {
    datos = {};
}

let nombre = datos.firstName || datos.username || 'Administrador';

nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);

const spanNombre = document.getElementById('NombreUsuario');
if (spanNombre) {
    spanNombre.textContent = nombre;
} 

// Verificación de sesión
if (typeof usuarioLogueado === 'function' && !usuarioLogueado()) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const formTurno = document.getElementById('formTurno');
    const tbodyTurnos = document.getElementById('tablaTurnos');
    const selectMascota = document.getElementById('selectMascotaTurno');
    const selectVeterinario = document.getElementById('selectVeterinarioTurno');
    const inputIdTurno = document.getElementById('turno'); 

    const STORAGE_KEY_TURNOS = 'turnos';
    let turnos = JSON.parse(localStorage.getItem(STORAGE_KEY_TURNOS)) || [];

    // 1. Cargar los <select> con los datos de LocalStorage de Mascotas y Veterinarios
    function cargarSelectores() {
        const mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];
        const veterinarios = JSON.parse(localStorage.getItem('veterinarios')) || [];

        // Llenar select de Mascotas
        if (selectMascota) {
            selectMascota.innerHTML = '<option value="" disabled selected>Seleccione una Mascota...</option>';
            mascotas.forEach(m => {
                const opt = document.createElement('option');
                opt.value = m.idMascota; 
                opt.textContent = `${m.nombreMascota} (Dueño: ${m.nombreDuenio})`;
                selectMascota.appendChild(opt);
            });
        }

        // Llenar select de Veterinarios
        if (selectVeterinario) {
            selectVeterinario.innerHTML = '<option value="" disabled selected>Seleccione un veterinario...</option>';
            veterinarios.forEach(v => {
                const opt = document.createElement('option');
                opt.value = v.idVeterinario; 
                opt.textContent = `Dr/a. ${v.nombre} - ${v.especializacion || v.especialidad || ''}`;
                selectVeterinario.appendChild(opt);
            });
        }
    }

    // 2. Guardar en LocalStorage
    function guardar() {
        localStorage.setItem(STORAGE_KEY_TURNOS, JSON.stringify(turnos));
    }

    // 3. Renderizar tabla cruzando los IDs para mostrar nombres legibles
    function mostrarTurnos() {
        if (!tbodyTurnos) return;
        tbodyTurnos.innerHTML = '';

        if (turnos.length === 0) {
            tbodyTurnos.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-3">No hay turnos programados.</td></tr>';
            return;
        }

        const mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];
        const veterinarios = JSON.parse(localStorage.getItem('veterinarios')) || [];

        turnos.forEach((t) => {
            const masc = mascotas.find(m => m.idMascota === t.mascota);
            const vet = veterinarios.find(v => v.idVeterinario === t.veterinario);

            const nombreMascota = masc ? masc.nombreMascota : 'Mascota no encontrada';
            const nombreVet = vet ? vet.nombre : 'Veterinario no asignado';

            tbodyTurnos.innerHTML += `
                <tr>
                    <td>${t.fecha} - ${t.hora}</td>
                    <td>${nombreMascota} ${t.motivo ? `<br><small class="text-muted">Motivo: ${t.motivo}</small>` : ''}</td>
                    <td>${nombreVet}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="eliminarTurno('${t.idTurno}')">Cancelar</button>
                    </td>
                </tr>`;
        });
    }

    // 4. Registrar Turno al hacer submit
    if (formTurno) {
        formTurno.addEventListener('submit', (e) => {
            e.preventDefault();

            // Capturamos los campos de tu HTML (fecha, hora, motivo separados)
            const nuevoTurno = {
                idTurno: inputIdTurno.value ? inputIdTurno.value : crypto.randomUUID(),
                mascota: selectMascota.value,         
                veterinario: selectVeterinario.value, 
                fecha: document.getElementById('fecha').value,
                hora: document.getElementById('hora').value,
                motivo: document.getElementById('motivo').value.trim()
            };

            if (inputIdTurno.value) {
                turnos = turnos.map(t => t.idTurno === inputIdTurno.value ? nuevoTurno : t);
                inputIdTurno.value = '';
            } else {
                turnos.push(nuevoTurno);
            }

            guardar();
            mostrarTurnos();
            formTurno.reset();
            cargarSelectores();

            // Mostrar modal de éxito si existe en el HTML
            const modalElement = document.getElementById('modalGuardado');
            if (modalElement) {
                const modalGuardado = new bootstrap.Modal(modalElement);
                modalGuardado.show();
            } else {
                alert('¡Turno registrado con éxito!');
            }
        });
    }

    // 5. Función global para eliminar turno
    window.eliminarTurno = function(idTurno) {
        if (confirm('¿Estás seguro de que deseas cancelar este turno?')) {
            turnos = turnos.filter(t => t.idTurno !== idTurno);
            guardar();
            mostrarTurnos();
        }
    };

    // Inicializar al cargar la página
    cargarSelectores();
    mostrarTurnos();
});