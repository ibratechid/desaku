// Main Application for DESAKU

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initDesakuApp();
});

function initDesakuApp() {
    // Check if user is logged in
    const currentUser = localStorage.getItem('desaku.currentUser');
    
    // Set up common event listeners
    setupCommonEvents();
    
    // Load page-specific functionality
    loadPageSpecificFunctionality();
}

function setupCommonEvents() {
    // Add any common event listeners here
    console.log('DESAKU Application Initialized');
}

function loadPageSpecificFunctionality() {
    const pathname = window.location.pathname;
    
    // Load functionality based on current page
    if (pathname.includes('dashboard/')) {
        // Dashboard pages
        if (pathname.includes('admin.html')) {
            console.log('Loading Admin Dashboard');
        } else if (pathname.includes('rt.html')) {
            console.log('Loading RT Dashboard');
        } else if (pathname.includes('rw.html')) {
            console.log('Loading RW Dashboard');
        } else if (pathname.includes('kepala-desa.html')) {
            console.log('Loading Kepala Desa Dashboard');
        } else if (pathname.includes('warga.html')) {
            console.log('Loading Warga Dashboard');
        }
    } else if (pathname.includes('pages/')) {
        // Pages
        if (pathname.includes('daftar-surat.html')) {
            console.log('Loading Daftar Surat');
        } else if (pathname.includes('ajukan-surat.html')) {
            console.log('Loading Ajukan Surat');
        } else if (pathname.includes('master-')) {
            console.log('Loading Master Data Page');
        } else if (pathname.includes('setting.html')) {
            console.log('Loading Settings Page');
        }
    }
}

// Helper function to check permissions
function hasPermission(requiredRole) {
    const currentUser = JSON.parse(localStorage.getItem('desaku.currentUser'));
    if (!currentUser) return false;
    
    const roleHierarchy = {
        'admin': 5,
        'kepala-desa': 4,
        'rw': 3,
        'rt': 2,
        'warga': 1
    };
    
    return roleHierarchy[currentUser.role] >= roleHierarchy[requiredRole];
}

// Helper function to redirect based on role
function redirectByRole() {
    const currentUser = JSON.parse(localStorage.getItem('desaku.currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    const rolePages = {
        'admin': 'dashboard/admin.html',
        'rt': 'dashboard/rt.html',
        'rw': 'dashboard/rw.html',
        'kepala-desa': 'dashboard/kepala-desa.html',
        'warga': 'dashboard/warga.html'
    };
    
    window.location.href = rolePages[currentUser.role] || 'dashboard/warga.html';
}

// Helper function to get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('desaku.currentUser'));
}

// Helper function to format date
function formatDate(dateString) {
    return DesakuUtils.formatDate(dateString);
}

// Helper function to show error
function showError(message) {
    DesakuUtils.showToast(message, 'error');
}

// Helper function to show success
function showSuccess(message) {
    DesakuUtils.showToast(message, 'success');
}