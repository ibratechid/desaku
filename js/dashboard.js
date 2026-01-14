// Dashboard functionality for DESAKU

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('desaku.currentUser'));
    
    if (currentUser) {
        // Set user name in header
        const userNameElements = document.querySelectorAll('#userName');
        userNameElements.forEach(el => {
            el.textContent = currentUser.fullname || currentUser.username;
        });
        
        // Set role name in sidebar
        const roleNameElements = document.querySelectorAll('#roleName');
        roleNameElements.forEach(el => {
            const roleNames = {
                'admin': 'Administrator',
                'rt': 'RT Dashboard',
                'rw': 'RW Dashboard',
                'kepala-desa': 'Kepala Desa',
                'warga': 'Warga Dashboard'
            };
            el.textContent = roleNames[currentUser.role] || 'Dashboard';
        });
    }
    
    // Load data based on role
    switch(currentUser.role) {
        case 'admin':
            loadAdminDashboard();
            break;
        case 'rt':
            loadRtDashboard();
            break;
        case 'rw':
            loadRwDashboard();
            break;
        case 'kepala-desa':
            loadKepalaDesaDashboard();
            break;
        case 'warga':
            loadWargaDashboard();
            break;
    }
});

function loadAdminDashboard() {
    // Load statistics
    const suratList = JSON.parse(localStorage.getItem('desaku.surat') || '[]');
    
    document.getElementById('totalSurat').textContent = suratList.length;
    document.getElementById('pendingSurat').textContent = suratList.filter(s => s.status === 'pending').length;
    document.getElementById('processSurat').textContent = suratList.filter(s => s.status === 'process').length;
    document.getElementById('approvedSurat').textContent = suratList.filter(s => s.status === 'approved').length;
    
    // Load recent surat
    loadRecentSurat();
}

function loadRtDashboard() {
    const currentUser = JSON.parse(localStorage.getItem('desaku.currentUser'));
    const suratList = JSON.parse(localStorage.getItem('desaku.surat') || '[]');
    
    // Filter surat pending for this RT
    const pendingSurat = suratList.filter(s => 
        s.status === 'pending' && 
        s.rt === currentUser.rt
    );
    
    loadPendingSuratTable(pendingSurat);
}

function loadRwDashboard() {
    const currentUser = JSON.parse(localStorage.getItem('desaku.currentUser'));
    const suratList = JSON.parse(localStorage.getItem('desaku.surat') || '[]');
    
    // Filter surat process for this RW (approved by RT)
    const pendingSurat = suratList.filter(s => 
        s.status === 'process' && 
        s.currentApproval === 'rw' &&
        s.rw === currentUser.rw
    );
    
    loadPendingSuratTable(pendingSurat);
}

function loadKepalaDesaDashboard() {
    const suratList = JSON.parse(localStorage.getItem('desaku.surat') || '[]');
    
    // Filter surat process for Kepala Desa (approved by RW)
    const pendingSurat = suratList.filter(s => 
        s.status === 'process' && 
        s.currentApproval === 'kepala-desa'
    );
    
    loadPendingSuratTable(pendingSurat);
}

function loadWargaDashboard() {
    const currentUser = JSON.parse(localStorage.getItem('desaku.currentUser'));
    const suratList = JSON.parse(localStorage.getItem('desaku.surat') || '[]');
    
    // Filter surat by current user
    const mySurat = suratList.filter(s => s.pemohonId === currentUser.id);
    
    loadMySuratTable(mySurat);
}

function loadRecentSurat() {
    const suratList = JSON.parse(localStorage.getItem('desaku.surat') || '[]');
    const recentSurat = suratList.slice(0, 10);
    
    const tableBody = document.querySelector('#recentSurat tbody');
    tableBody.innerHTML = '';
    
    recentSurat.forEach(surat => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${surat.nomor}</td>
            <td>${surat.jenis}</td>
            <td>${surat.pemohon}</td>
            <td><span class="status-badge status-${surat.status}">${surat.status}</span></td>
            <td>${surat.tanggal}</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="viewSurat('${surat.id}')">View</button>
                ${surat.status !== 'approved' ? `<button class="btn btn-warning btn-sm" onclick="editSurat('${surat.id}')">Edit</button>` : ''}
                <button class="btn btn-success btn-sm" onclick="downloadSurat('${surat.id}')">PDF</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function loadPendingSuratTable(suratList) {
    const tableBody = document.querySelector('#pendingSurat tbody');
    tableBody.innerHTML = '';
    
    suratList.forEach(surat => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${surat.nomor}</td>
            <td>${surat.jenis}</td>
            <td>${surat.pemohon}</td>
            <td>${surat.tanggal}</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="viewSurat('${surat.id}')">View</button>
                <button class="btn btn-success btn-sm" onclick="approveSurat('${surat.id}')">Approve</button>
                <button class="btn btn-danger btn-sm" onclick="rejectSurat('${surat.id}')">Reject</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function loadMySuratTable(suratList) {
    const tableBody = document.querySelector('#mySurat tbody');
    tableBody.innerHTML = '';
    
    suratList.forEach(surat => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${surat.nomor}</td>
            <td>${surat.jenis}</td>
            <td><span class="status-badge status-${surat.status}">${surat.status}</span></td>
            <td>${surat.tanggal}</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="viewSurat('${surat.id}')">View</button>
                ${surat.status === 'approved' ? `<button class="btn btn-success btn-sm" onclick="downloadSurat('${surat.id}')">Download</button>` : ''}
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Placeholder functions for actions
function viewSurat(id) {
    alert('View surat with ID: ' + id);
}

function editSurat(id) {
    alert('Edit surat with ID: ' + id);
}

function downloadSurat(id) {
    alert('Download surat with ID: ' + id);
}

function approveSurat(id) {
    if (confirm('Apakah Anda yakin ingin menyetujui surat ini?')) {
        updateSuratStatus(id, 'approved');
    }
}

function rejectSurat(id) {
    const reason = prompt('Masukkan alasan penolakan:');
    if (reason) {
        updateSuratStatus(id, 'rejected', reason);
    }
}

function updateSuratStatus(id, status, reason = '') {
    const suratList = JSON.parse(localStorage.getItem('desaku.surat') || '[]');
    const updatedSurat = suratList.map(surat => {
        if (surat.id === id) {
            return { ...surat, status, rejectionReason: reason };
        }
        return surat;
    });
    
    localStorage.setItem('desaku.surat', JSON.stringify(updatedSurat));
    
    // Refresh the dashboard
    window.location.reload();
}