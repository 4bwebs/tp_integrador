if (!usuarioLogueado()){
    window.location.href = 'login.html';
}

let datos = {};
try {
    datos = JSON.parse(sessionStorage.getItem('Usuario')) || {};
} catch(e) {
    datos = {};
}

let email = datos.email || '';
let nombre = email.split('@')[0].split('.')[0] || datos.username || 'Emily';
nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);

document.getElementById('NombreUsuario').textContent = nombre;

let historias = JSON.parse(localStorage.getItem('historias')) || [];

function guardar() {
    localStorage.setItem('historias', JSON.stringify(historias));
}

function mostrar() {
    const tbody = document.getElementById('tablaHistorias');
    tbody.innerHTML = '';
    if (historias.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center">Todavía no hay historias registradas.</td></tr>';
        return;
    }
    const mascotasUnicas = [...new Map(historias.map(h => [h.mascota, h])).values()];
    mascotasUnicas.forEach((h) => {
        tbody.innerHTML += `
            <tr>
                <td>${h.mascota}</td>
                <td>${h.dueno}</td> <button class="btn btn-sm btn-danger" onclick="eliminarHistoria('${h.mascota}')">Eliminar</button>
                <td><button class="btn btn-sm btn-primary" onclick="verHistorial('${h.mascota}')">Ver historial</button></td> 
            </tr>`;
    });
}

function verHistorial(mascota) {
    const delAnimal = historias.filter(h => h.mascota === mascota);
    document.getElementById('historialCompleto').style.display = 'block';
    document.getElementById('nombreMascotaHistorial').textContent = mascota;
    document.getElementById('contenidoHistorial').innerHTML = delAnimal.map(h => `
        <p><b>${h.fecha}</b> - Dueño: ${h.dueno} <br> Diagnóstico: ${h.diagnostico}</p><hr>
    `).join('');
}

function cerrarHistorial() {
    document.getElementById('historialCompleto').style.display = 'none';
}

document.getElementById('formHistoria').addEventListener('submit', function(e) {
    e.preventDefault();
    historias.push({
        mascota: document.getElementById('mascota').value,
        dueno: document.getElementById('dueno').value,
        fecha: document.getElementById('fecha').value,
        diagnostico: document.getElementById('diagnostico').value
    });
    guardar();
    mostrar();
    this.reset();
    const modalGuardado = new bootstrap.Modal(document.getElementById('modalGuardadoHistoria'));
modalGuardado.show();
});

mostrar();

let mascotaAEliminar = null;

function eliminarHistoria(mascota) {
    mascotaAEliminar = mascota;
    const modal = new bootstrap.Modal(document.getElementById('modalEliminarHistoria'));
    modal.show();
}

document.getElementById('btnConfirmarEliminarHistoria').addEventListener('click', function() {
    if (mascotaAEliminar !== null) {
        historias = historias.filter(h => h.mascota !== mascotaAEliminar);
        localStorage.setItem('historias', JSON.stringify(historias));
        mostrar();
        mascotaAEliminar = null;
    }
    bootstrap.Modal.getInstance(document.getElementById('modalEliminarHistoria')).hide();
});