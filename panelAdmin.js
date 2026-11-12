if (!usuarioLogueado()){
    window.location.href = 'login.html';
}

const mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];
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

document.getElementById('totalPacientes').textContent = mascotas.length + ' mascotas registradas';
const veterinarios = JSON.parse(localStorage.getItem('veterinarios')) || [];
const turnos = JSON.parse(localStorage.getItem('turnos')) || [];
const historias = JSON.parse(localStorage.getItem('historias_clinicas')) || [];

document.getElementById('totalVeterinarios').textContent = veterinarios.length + ' veterinarios registrados';
document.getElementById('totalTurnos').textContent = turnos.length + ' turnos registrados';
document.getElementById('totalHistorias').textContent = historias.length + ' historias clínicas registradas';




