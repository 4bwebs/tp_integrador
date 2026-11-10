if (!usuarioLogueado()){
    window.location.href = 'login.html';
}

const mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];
document.getElementById('NombreUsuario').textContent = sessionStorage.getItem('usuario');
document.getElementById('totalPacientes').textContent = mascotas.length + ' mascotas registradas';
const veterinarios = JSON.parse(localStorage.getItem('veterinarios')) || [];
const turnos = JSON.parse(localStorage.getItem('turnos')) || [];
const historias = JSON.parse(localStorage.getItem('historias')) || [];

document.getElementById('totalVeterinarios').textContent = veterinarios.length + ' veterinarios registrados';
document.getElementById('totalTurnos').textContent = turnos.length + ' turnos registrados';
document.getElementById('totalHistorias').textContent = historias.length + ' historias clínicas registradas';
