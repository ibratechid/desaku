// Authentication System for DESAKU

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;

            // Validate inputs
            if (!username || !password || !role) {
                showError('Semua field harus diisi');
                return;
            }

            // Check credentials (in a real app, this would be an API call)
            const users = JSON.parse(localStorage.getItem('desaku.users') || '[]');
            const user = users.find(u => u.username === username && u.password === password && u.role === role);

            if (user) {
                // Store current user in localStorage
                localStorage.setItem('desaku.currentUser', JSON.stringify(user));
                
                // Redirect based on role
                switch(role) {
                    case 'admin':
                        window.location.href = 'dashboard/admin.html';
                        break;
                    case 'rt':
                        window.location.href = 'dashboard/rt.html';
                        break;
                    case 'rw':
                        window.location.href = 'dashboard/rw.html';
                        break;
                    case 'kepala-desa':
                        window.location.href = 'dashboard/kepala-desa.html';
                        break;
                    case 'warga':
                        window.location.href = 'dashboard/warga.html';
                        break;
                }
            } else {
                showError('Username, password, atau role tidak valid');
            }
        });
    }

    // Check if user is already logged in
    const currentUser = localStorage.getItem('desaku.currentUser');
    if (currentUser && !window.location.pathname.includes('login')) {
        // User is logged in, no action needed
    } else if (!currentUser && !window.location.pathname.includes('login')) {
        // Redirect to login if not logged in
        window.location.href = 'index.html';
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        
        // Hide error after 3 seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }
});

// Logout function
function logout() {
    localStorage.removeItem('desaku.currentUser');
    window.location.href = 'index.html';
}