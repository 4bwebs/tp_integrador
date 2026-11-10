 const listaItems = document.querySelector('.navbar-nav');

if (estaLogueado()) {
    listaItems.innerHTML += `
        <li>
            <a href="panelAdmin.html">Panel</a>
        </li>

        <li>
            <button class="btn btn-secondary" onclick="cerrarSesion()">Cerrar Sesión</button>
        </li>
    `;

    document.getElementById('link-login').remove()
}  