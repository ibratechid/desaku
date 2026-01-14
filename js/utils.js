// Utility Functions for DESAKU

class DesakuUtils {
    static formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    }

    static formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', { 
            style: 'currency', 
            currency: 'IDR',
            minimumFractionDigits: 0 
        }).format(amount);
    }

    static generateId(prefix = 'id') {
        return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }

    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static validatePhone(phone) {
        const re = /^[0-9]{10,15}$/;
        return re.test(phone);
    }

    static validateNIK(nik) {
        const re = /^[0-9]{16}$/;
        return re.test(nik);
    }

    static getStatusColor(status) {
        const colors = {
            'pending': '#f39c12',
            'process': '#3498db',
            'approved': '#27ae60',
            'rejected': '#e74c3c'
        };
        return colors[status] || '#95a5a6';
    }

    static getRoleColor(role) {
        const colors = {
            'admin': '#e74c3c',
            'rt': '#f39c12',
            'rw': '#3498db',
            'kepala-desa': '#27ae60',
            'warga': '#95a5a6'
        };
        return colors[role] || '#7f8c8d';
    }

    static getRoleName(role) {
        const names = {
            'admin': 'Administrator',
            'rt': 'RT',
            'rw': 'RW',
            'kepala-desa': 'Kepala Desa',
            'warga': 'Warga'
        };
        return names[role] || role;
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    static showLoading() {
        const loading = document.createElement('div');
        loading.id = 'loadingOverlay';
        loading.style.position = 'fixed';
        loading.style.top = '0';
        loading.style.left = '0';
        loading.style.width = '100%';
        loading.style.height = '100%';
        loading.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        loading.style.display = 'flex';
        loading.style.justifyContent = 'center';
        loading.style.alignItems = 'center';
        loading.style.zIndex = '9999';
        
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.style.width = '50px';
        spinner.style.height = '50px';
        spinner.style.border = '5px solid #f3f3f3';
        spinner.style.borderTop = '5px solid #3498db';
        spinner.style.borderRadius = '50%';
        spinner.style.animation = 'spin 1s linear infinite';
        
        loading.appendChild(spinner);
        document.body.appendChild(loading);
    }

    static hideLoading() {
        const loading = document.getElementById('loadingOverlay');
        if (loading) {
            loading.remove();
        }
    }

    static showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Style the toast
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.padding = '12px 20px';
        toast.style.borderRadius = '4px';
        toast.style.color = 'white';
        toast.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        toast.style.zIndex = '10000';
        toast.style.animation = 'fadeIn 0.3s, fadeOut 0.3s 2.7s';
        
        // Set color based on type
        const colors = {
            'success': '#27ae60',
            'error': '#e74c3c',
            'warning': '#f39c12',
            'info': '#3498db'
        };
        toast.style.backgroundColor = colors[type] || colors['info'];
        
        document.body.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    static confirmAction(message, callback) {
        if (confirm(message)) {
            callback();
        }
    }

    static copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            this.showToast('Teks berhasil disalin', 'success');
        } catch (err) {
            this.showToast('Gagal menyalin teks', 'error');
        }
        
        document.body.removeChild(textarea);
    }
}