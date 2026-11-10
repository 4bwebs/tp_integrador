if (!usuarioLogueado()){
    window.location.href = 'login.html';
}

const mascotas = JSON.parse(localStorage.getItem('mascotas')) || [];
document.getElementById('NombreUsuario').textContent = sessionStorage.getItem('usuario');
document.getElementById('totalPacientes').textContent = mascotas.length + ' mascotas registradas';