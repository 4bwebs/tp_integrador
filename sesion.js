function obtenerToken(){
    return sessionStorage.getItem('accesstoken');
}

function usuarioLogueado(){
    return obtenerToken() !== null;
}

function cerrarSesionBtn() {
    sessionStorage.removeItem('accesstoken');
    sessionStorage.removeItem('Usuario');

    window.location.href = 'login.html';
}

