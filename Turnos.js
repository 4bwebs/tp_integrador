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

let turnos = JSON.parse(localStorage.getItem('turnos')) || [];

function guardar() {
    localStorage.setItem('turnos', JSON.stringify(turnos));
}

function mostrar() {
    const tbody = document.getElementById('tablaTurnos');
    tbody.innerHTML = '';
    if (turnos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Todavía no hay turnos registrados.</td></tr>';
        return;
    }
    turnos.forEach((t, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${t.mascota}</td>
                <td>${t.dueno}</td>
                <td>${t.fecha}</td>
                <td>${t.hora}</td>
                <td>${t.motivo}</td>
                <td><button class="btn btn-sm btn-danger" onclick="eliminarTurno(${index})">Eliminar</button></td>
            </tr>`;
    });
}

let turnoAEliminar = null;

function eliminarTurno(index) {
    turnoAEliminar = index;
    const modal = new bootstrap.Modal(document.getElementById('modalEliminar'));
    modal.show();
}

document.getElementById('btnConfirmarEliminar').addEventListener('click', function() {
    if (turnoAEliminar !== null) {
        turnos.splice(turnoAEliminar, 1);
        guardar();
        mostrar();
        turnoAEliminar = null;
    }
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalEliminar'));
    modal.hide();
});

document.getElementById('formTurno').addEventListener('submit', function(e) {
    e.preventDefault();
    turnos.push({
        mascota: document.getElementById('mascota').value,
        dueno: document.getElementById('dueno').value,
        fecha: document.getElementById('fecha').value,
        hora: document.getElementById('hora').value,
        motivo: document.getElementById('motivo').value
    });
    guardar();
    mostrar();
    this.reset();
    const modalGuardado = new bootstrap.Modal(document.getElementById('modalGuardado'));
modalGuardado.show();
});

mostrar();