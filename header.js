document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.getElementById('login-link');
    const panelLink = document.getElementById('panel-link');
    const logoutLink = document.getElementById('logout-link');

    
    if (typeof usuarioLogueado === 'function' && usuarioLogueado()) {
        
        if (loginLink) loginLink.style.display = 'none';
        
       
        if (panelLink) panelLink.style.display = 'block';
        if (logoutLink) logoutLink.style.display = 'block'; 
    } else {
        if (loginLink) loginLink.style.display = 'block';
        if (panelLink) panelLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'none';
    }
});