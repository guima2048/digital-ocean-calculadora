document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    // Credenciais temporárias fixas
    const CREDENTIALS = {
        username: 'admin',
        password: 'admin123'
    };

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
            // Salvar estado de autenticação
            sessionStorage.setItem('adminAuthenticated', 'true');
            
            // Redirecionar para o dashboard
            window.location.href = 'dashboard.html';
        } else {
            alert('Usuário ou senha incorretos');
        }
    });
}); 