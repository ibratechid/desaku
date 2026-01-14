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
    document.getElementById('approvedSurat').textContent = suratList.filter(s => s.status === 'disetujui').length;
    
    // Load recent surat
    loadRecentSurat();
}

function loadRtDashboard() {
    const currentUser = JSON.parse(localStorage.getItem('desaku.currentUser'));
    const suratList = JSON.parse(localStorage.getItem('desaku.surat') || '[]');
    
    // Filter surat pending for this RT
    const pendingSurat = suratList.filter(s => 
        s.status === 'pending' && 
        s.currentApproval === 'rt' &&
        s.rt === currentUser.rt
    );
    
    // Load counter
    document.getElementById('pendingApprovalCount').textContent = pendingSurat.length;
    
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
    
    // Load counter
    document.getElementById('pendingApprovalCount').textContent = pendingSurat.length;
    
    loadPendingSuratTable(pendingSurat);
}

function loadKepalaDesaDashboard() {
    const suratList = JSON.parse(localStorage.getItem('desaku.surat') || '[]');
    
    // Filter surat process for Kepala Desa (approved by RW)
    const pendingSurat = suratList.filter(s => 
        s.status === 'process' && 
        s.currentApproval === 'kepala-desa'
    );
    
    // Load counter
    document.getElementById('pendingApprovalCount').textContent = pendingSurat.length;
    
    loadPendingSuratTable(pendingSurat);
}

function loadWargaDashboard() {
    const currentUser = JSON.parse(localStorage.getItem('desaku.currentUser'));
    const suratList = JSON.parse(localStorage.getItem('desaku.surat') || '[]');
    
    // Filter surat by current user
    const mySurat = suratList.filter(s => s.pemohonId === currentUser.wargaId);
    
    // Load statistics
    document.getElementById('pendingCount').textContent = mySurat.filter(s => s.status === 'pending').length;
    document.getElementById('processCount').textContent = mySurat.filter(s => s.status === 'process').length;
    document.getElementById('approvedCount').textContent = mySurat.filter(s => s.status === 'disetujui').length;
    
    loadMySuratTable(mySurat);
}

function loadRecentSurat() {
    const suratList = JSON.parse(localStorage.getItem('desaku.surat') || '[]');
    const recentSurat = suratList.slice(-5).reverse(); // 5 surat terbaru
    
    const tableBody = document.querySelector('#recentSurat tbody');
    tableBody.innerHTML = '';
    
    recentSurat.forEach(surat => {
        const row = document.createElement('tr');
        const statusMap = {
            'pending': 'Pending',
            'process': 'Process',
            'disetujui': 'Disetujui',
            'ditolak': 'Ditolak'
        };
        row.innerHTML = `
            <td>${surat.nomor}</td>
            <td>${surat.jenis}</td>
            <td>${surat.pemohon}</td>
            <td><span class="status-badge status-${surat.status}">${statusMap[surat.status] || surat.status}</span></td>
            <td>${formatDate(surat.tanggal)}</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="viewSurat('${surat.id}')">Lihat</button>
                ${surat.status !== 'disetujui' ? `<button class="btn btn-warning btn-sm" onclick="editSurat('${surat.id}')">Edit</button>` : ''}
                ${surat.status === 'disetujui' ? `<button class="btn btn-success btn-sm" onclick="downloadSurat('${surat.id}')">PDF</button>` : ''}
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function loadPendingSuratTable(suratList) {
    const tableBody = document.querySelector('#pendingSurat tbody') || document.querySelector('#recentSurat tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    suratList.forEach(surat => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${surat.nomor}</td>
            <td>${surat.jenis}</td>
            <td>${surat.pemohon}</td>
            <td>${formatDate(surat.tanggal)}</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="viewSurat('${surat.id}')">Lihat</button>
                <button class="btn btn-success btn-sm" onclick="approveSurat('${surat.id}')">Setujui</button>
                <button class="btn btn-danger btn-sm" onclick="rejectSurat('${surat.id}')">Tolak</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function loadMySuratTable(suratList) {
    const tableBody = document.querySelector('#mySurat tbody') || document.querySelector('#recentSurat tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    const statusMap = {
        'pending': 'Pending',
        'process': 'Process',
        'disetujui': 'Disetujui',
        'ditolak': 'Ditolak'
    };
    
    suratList.forEach(surat => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${surat.nomor}</td>
            <td>${surat.jenis}</td>
            <td><span class="status-badge status-${surat.status}">${statusMap[surat.status] || surat.status}</span></td>
            <td>${formatDate(surat.tanggal)}</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="viewSurat('${surat.id}')">Lihat</button>
                ${surat.status === 'disetujui' ? `<button class="btn btn-success btn-sm" onclick="downloadSurat('${surat.id}')">Download PDF</button>` : ''}
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Placeholder functions for actions
function viewSurat(id) {
    const suratList = JSON.parse(localStorage.getItem('desaku.surat') || '[]');
    const surat = suratList.find(s => s.id === id);
    
    if (surat) {
        let history = '';
        if (surat.approvalHistory) {
            history = '<h4>History Approval:</h4><ul>';
            surat.approvalHistory.forEach(h => {
                const user = JSON.parse(localStorage.getItem('desaku.currentUser'));
                const approvalUser = JSON.parse(localStorage.getItem('desaku.users') || '[]').find(u => u.username === h.userId);
                history += `<li>${formatDateTime(h.date)} - ${h.action} by ${approvalUser?.fullname || h.userId} - ${h.notes || ''}</li>`;
            });
            history += '</ul>';
        }
        
        alert(`Surat: ${surat.nomor}\nJenis: ${surat.jenis}\nPemohon: ${surat.pemohon}\nStatus: ${surat.status}\n\nIsi Surat:\n${surat.isi}\n\n${history}`);
    }
}

function editSurat(id) {
    // Only allow editing for pending status and by the creator
    const currentUser = JSON.parse(localStorage.getItem('desaku.currentUser'));
    const suratList = JSON.parse(localStorage.getItem('desaku.surat') || '[]');
    const surat = suratList.find(s => s.id === id);
    
    if (surat.status !== 'pending') {
        alert('Surat tidak dapat diedit karena sudah dalam proses approval.');
        return;
    }
    
    if (surat.pemohonId !== currentUser.wargaId && currentUser.role !== 'admin') {
        alert('Anda tidak memiliki hak untuk mengedit surat ini.');
        return;
    }
    
    // Open edit modal or redirect to edit page
    alert('Fitur edit surat akan diimplementasikan');
}

function downloadSurat(id) {
    // Generate PDF using html2pdf.js
    const suratList = JSON.parse(localStorage.getItem('desaku.surat') || '[]');
    const surat = suratList.find(s => s.id === id);
    
    if (surat.status !== 'disetujui') {
        alert('Surat hanya dapat didownload setelah disetujui.');
        return;
    }
    
    // Create PDF content
    const pdfContent = generateSuratPDF(surat);
    
    // Use html2pdf.js to generate PDF
    if (typeof html2pdf !== 'undefined') {
        html2pdf().set({
            margin: 1,
            filename: `${surat.nomor}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        }).from(pdfContent).save();
    } else {
        alert('Fitur PDF generation memerlukan library html2pdf.js');
    }
}

// Make it globally available
function downloadSuratPDF(id) {
    downloadSurat(id);
}

function approveSurat(id) {
    if (confirm('Apakah Anda yakin ingin menyetujui surat ini?')) {
        const currentUser = JSON.parse(localStorage.getItem('desaku.currentUser'));
        updateSuratStatus(id, 'approve', currentUser);
    }
}

function rejectSurat(id) {
    const reason = prompt('Masukkan alasan penolakan:');
    if (reason) {
        const currentUser = JSON.parse(localStorage.getItem('desaku.currentUser'));
        updateSuratStatus(id, 'reject', currentUser, reason);
    }
}

function updateSuratStatus(id, action, user, reason = '') {
    const suratList = JSON.parse(localStorage.getItem('desaku.surat') || '[]');
    const suratIndex = suratList.findIndex(surat => surat.id === id);
    
    if (suratIndex === -1) {
        alert('Surat tidak ditemukan');
        return;
    }
    
    const surat = suratList[suratIndex];
    const currentUser = JSON.parse(localStorage.getItem('desaku.currentUser'));
    
    // Validate approval permission
    if (surat.currentApproval !== currentUser.role) {
        alert('Anda tidak berwenang untuk menyetujui surat ini saat ini.');
        return;
    }
    
    // Add to approval history
    if (!surat.approvalHistory) {
        surat.approvalHistory = [];
    }
    
    const approvalEntry = {
        id: 'approval-' + Date.now(),
        role: currentUser.role,
        action: action === 'approve' ? 'approve' : 'reject',
        userId: currentUser.username,
        date: new Date().toISOString(),
        notes: reason || (action === 'approve' ? 'Surat disetujui' : 'Surat ditolak')
    };
    
    surat.approvalHistory.push(approvalEntry);
    
    // Update status based on workflow
    if (action === 'reject') {
        surat.status = 'ditolak';
        surat.currentApproval = null;
    } else {
        // Workflow progression
        if (currentUser.role === 'rt') {
            surat.status = 'process';
            surat.currentApproval = 'rw';
        } else if (currentUser.role === 'rw') {
            surat.status = 'process';
            surat.currentApproval = 'kepala-desa';
        } else if (currentUser.role === 'kepala-desa') {
            surat.status = 'disetujui';
            surat.currentApproval = null;
        }
    }
    
    suratList[suratIndex] = surat;
    localStorage.setItem('desaku.surat', JSON.stringify(suratList));
    
    // Refresh the dashboard
    window.location.reload();
}

function generateSuratPDF(surat) {
    // Create a temporary div with the PDF content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #1B5E20; margin: 0;">PEMERINTAHAN DESA MAJU</h2>
                <h3 style="margin: 5px 0;">KECAMATAN MAJU, KABUPATEN MAJU</h3>
                <p style="margin: 0;">Jl. Raya Desa No. 1</p>
            </div>
            
            <hr style="border: 2px solid #1B5E20; margin: 20px 0;">
            
            <div style="text-align: center; margin: 30px 0;">
                <h3 style="text-decoration: underline; color: #1B5E20;">${surat.jenis}</h3>
            </div>
            
            <div style="margin: 30px 0;">
                <p>Yang bertanda tangan di bawah ini, Kepala Desa Maju, Kecamatan Maju, Kabupaten Maju, Provinsi Jawa Barat, dengan ini Menerangkan bahwa:</p>
                
                <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #1B5E20;">
                    <p><strong>Nama:</strong> ${surat.pemohon}</p>
                    <p><strong>RT/RW:</strong> ${surat.rt}/${surat.rw}</p>
                    <p><strong>Desa:</strong> Desa Maju</p>
                    <p><strong>Kecamatan:</strong> Kecamatan Maju</p>
                </div>
                
                <p>Berdasarkan data yang ada di kantor Desa Maju, dengan ini menerangkan bahwa yang tersebut di atas adalah benar-benar warga Desa Maju dan berkelakuan baik.</p>
                
                <p>Surat keterangan ini diberikan untuk keperluan ${surat.jenis.toLowerCase()}.</p>
                
                <p>Demikian surat keterangan ini dibuat dengan sebenarnya, untuk dapat dipergunakan sebagaimana mestinya.</p>
            </div>
            
            <div style="margin-top: 50px; text-align: right;">
                <p>Maju, ${formatDate(new Date())}</p>
                <br><br><br>
                <p><strong>KEPALA DESA MAJU</strong></p>
                <br><br>
                <p>(Tanda Tangan & Cap Digital)</p>
            </div>
        </div>
    `;
    
    return tempDiv;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('id-ID', options);
}