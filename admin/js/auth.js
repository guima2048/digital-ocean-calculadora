// Verificar autenticação em todas as páginas do painel
document.addEventListener('DOMContentLoaded', () => {
    // Não verificar na página de login
    if (window.location.pathname.includes('login.html')) {
        return;
    }

    // Verificar se está autenticado
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        window.location.href = 'login.html';
        return;
    }

    // Configurar botão de logout
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            sessionStorage.removeItem('adminAuthenticated');
            window.location.href = 'login.html';
        });
    }

    // Configurar toggle do menu mobile
    const toggleMenu = document.createElement('button');
    toggleMenu.className = 'btn btn-outline-light d-md-none me-2';
    toggleMenu.innerHTML = '<i class="fas fa-bars"></i>';
    
    const topbar = document.querySelector('.topbar');
    if (topbar) {
        topbar.insertBefore(toggleMenu, topbar.firstChild);
        
        toggleMenu.addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('show');
        });
    }
}); 