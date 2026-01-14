// Surat Management for DESAKU

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('desaku.currentUser'));
    
    // Set user name in header
    const userNameElements = document.querySelectorAll('#userName');
    userNameElements.forEach(el => {
        el.textContent = currentUser.fullname || currentUser.username;
    });
    
    // Load surat data for daftar-surat.html
    if (window.location.pathname.includes('daftar-surat.html')) {
        loadSuratTable();
        loadFilters();
    }
    
    // Load form for ajukan-surat.html
    if (window.location.pathname.includes('ajakan-surat.html')) {
        loadSuratForm();
    }
});

function loadSuratTable() {
    const currentUser = JSON.parse(localStorage.getItem('desaku.currentUser'));
    const suratList = JSON.parse(localStorage.getItem('desaku.surat') || '[]');
    
    // Filter based on user role
    let filteredSurat = suratList;
    
    if (currentUser.role === 'warga') {
        filteredSurat = suratList.filter(s => s.pemohonId === currentUser.wargaId);
    } else if (currentUser.role === 'rt') {
        filteredSurat = suratList.filter(s => s.rt === currentUser.rt);
    } else if (currentUser.role === 'rw') {
        filteredSurat = suratList.filter(s => s.rw === currentUser.rw);
    }
    
    const tableBody = document.querySelector('#suratTable tbody') || document.querySelector('#recentSurat tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    const statusMap = {
        'pending': 'Pending',
        'process': 'Process', 
        'disetujui': 'Disetujui',
        'ditolak': 'Ditolak'
    };
    
    filteredSurat.forEach(surat => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${surat.nomor}</td>
            <td>${surat.jenis}</td>
            <td>${surat.pemohon}</td>
            <td><span class="status-badge status-${surat.status}">${statusMap[surat.status] || surat.status}</span></td>
            <td>${formatDate(surat.tanggal)}</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="viewSurat('${surat.id}')">Lihat</button>
                ${surat.status === 'disetujui' ? `<button class="btn btn-success btn-sm" onclick="downloadSurat('${surat.id}')">Download PDF</button>` : ''}
                ${surat.status !== 'disetujui' && currentUser.role !== 'warga' ? `<button class="btn btn-warning btn-sm" onclick="editSurat('${surat.id}')">Edit</button>` : ''}
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function canEditSurat(surat) {
    const currentUser = JSON.parse(localStorage.getItem('desaku.currentUser'));
    return surat.status !== 'disetujui' && currentUser.role !== 'warga';
}

function loadFilters() {
    // Load jenis surat filter
    const jenisSuratList = JSON.parse(localStorage.getItem('desaku.jenisSurat') || '[]');
    const filterJenis = document.getElementById('filterJenis');
    
    if (filterJenis) {
        jenisSuratList.forEach(jenis => {
            const option = document.createElement('option');
            option.value = jenis.kode;
            option.textContent = jenis.nama;
            filterJenis.appendChild(option);
        });
    }
}

function applyFilters() {
    // Get filter values
    const status = document.getElementById('filterStatus').value;
    const jenis = document.getElementById('filterJenis').value;
    const tanggal = document.getElementById('filterTanggal').value;
    const pemohon = document.getElementById('filterPemohon').value.toLowerCase();
    
    // Filter surat
    const suratList = JSON.parse(localStorage.getItem('desaku.surat') || '[]');
    const filteredSurat = suratList.filter(surat => {
        return (!status || surat.status === status) &&
               (!jenis || surat.jenisKode === jenis) &&
               (!tanggal || surat.tanggal === tanggal) &&
               (!pemohon || surat.pemohon.toLowerCase().includes(pemohon));
    });
    
    // Update table
    const tableBody = document.querySelector('#suratTable tbody');
    tableBody.innerHTML = '';
    
    filteredSurat.forEach(surat => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${surat.nomor}</td>
            <td>${surat.jenis}</td>
            <td>${surat.pemohon}</td>
            <td><span class="status-badge status-${surat.status}">${surat.status}</span></td>
            <td>${surat.tanggal}</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="viewSurat('${surat.id}')">View</button>
                ${canEditSurat(surat) ? `<button class="btn btn-warning btn-sm" onclick="editSurat('${surat.id}')">Edit</button>` : ''}
                <button class="btn btn-success btn-sm" onclick="downloadSurat('${surat.id}')">PDF</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function resetFilters() {
    document.getElementById('filterStatus').value = '';
    document.getElementById('filterJenis').value = '';
    document.getElementById('filterTanggal').value = '';
    document.getElementById('filterPemohon').value = '';
    
    loadSuratTable();
}

function loadSuratForm() {
    const currentUser = JSON.parse(localStorage.getItem('desaku.currentUser'));
    const jenisSuratList = JSON.parse(localStorage.getItem('desaku.jenisSurat') || '[]');
    const wargaList = JSON.parse(localStorage.getItem('desaku.warga') || '[]');
    
    // Load jenis surat dropdown
    const jenisSuratSelect = document.getElementById('jenisSurat');
    if (jenisSuratSelect) {
        jenisSuratList.forEach(jenis => {
            const option = document.createElement('option');
            option.value = jenis.kode;
            option.textContent = jenis.nama;
            jenisSuratSelect.appendChild(option);
        });
        
        // Add event listener to generate nomor surat
        jenisSuratSelect.addEventListener('change', function() {
            const selectedJenis = this.value;
            if (selectedJenis) {
                const nomorSurat = generateNomorSurat(selectedJenis);
                document.getElementById('nomorSurat').value = nomorSurat;
            } else {
                document.getElementById('nomorSurat').value = '';
            }
        });
    }
    
    // Load current user data
    const currentWarga = wargaList.find(w => w.id === currentUser.wargaId);
    if (currentWarga) {
        document.getElementById('namaPemohon').value = currentWarga.nama;
        document.getElementById('nikPemohon').value = currentWarga.nik;
        document.getElementById('rtPemohon').value = `${currentWarga.rt}/${currentWarga.rw}`;
        document.getElementById('dusunPemohon').value = currentWarga.dusun;
    }
    
    // Handle form submission
    const suratForm = document.getElementById('suratForm');
    if (suratForm) {
        suratForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const jenisSurat = document.getElementById('jenisSurat').value;
            const catatan = document.getElementById('catatan').value;
            const isiSurat = document.getElementById('isiSurat')?.value || catatan;
            
            if (!jenisSurat) {
                alert('Mohon pilih jenis surat');
                return;
            }
            
            // Generate nomor surat
            const nomorSurat = generateNomorSurat(jenisSurat);
            
            // Create new surat
            const newSurat = {
                id: generateId(),
                nomor: nomorSurat,
                jenis: jenisSuratList.find(j => j.kode === jenisSurat).nama,
                jenisId: jenisSuratList.find(j => j.kode === jenisSurat).id,
                tanggal: new Date().toISOString().split('T')[0],
                pemohon: currentWarga.nama,
                pemohonId: currentUser.wargaId,
                nik: currentWarga.nik,
                rt: currentWarga.rt,
                rw: currentWarga.rw,
                dusun: currentWarga.dusun,
                isi: isiSurat || 'Surat keterangan untuk keperluan administrasi',
                status: 'pending',
                currentApproval: 'rt',
                approvalHistory: [
                    {
                        id: 'approval-' + Date.now(),
                        role: 'warga',
                        action: 'submit',
                        userId: currentUser.username,
                        date: new Date().toISOString(),
                        notes: 'Surat diajukan'
                    }
                ]
            };
            
            // Save to localStorage
            const suratList = JSON.parse(localStorage.getItem('desaku.surat') || '[]');
            suratList.push(newSurat);
            localStorage.setItem('desaku.surat', JSON.stringify(suratList));
            
            // Update counter
            updateSuratCounter(jenisSurat);
            
            alert('Surat berhasil diajukan!');
            window.location.href = '../dashboard/warga.html';
        });
    }
}

function generateNomorSurat(jenisKode) {
    const jenisSuratList = JSON.parse(localStorage.getItem('desaku.jenisSurat') || '[]');
    const counters = JSON.parse(localStorage.getItem('desaku.suratCounters') || '{}');
    
    const jenis = jenisSuratList.find(j => j.kode === jenisKode);
    if (!jenis) return 'ERROR';
    
    const counter = counters[jenisKode] || 1;
    const today = new Date();
    const bulan = String(today.getMonth() + 1).padStart(2, '0');
    const tahun = today.getFullYear();
    
    // Replace placeholders in format
    let nomor = jenis.formatNomor
        .replace('{nomor}', String(counter).padStart(3, '0'))
        .replace('{bulan}', bulan)
        .replace('{tahun}', tahun);
    
    return nomor;
}

function updateSuratCounter(jenisKode) {
    const counters = JSON.parse(localStorage.getItem('desaku.suratCounters') || '{}');
    counters[jenisKode] = (counters[jenisKode] || 1) + 1;
    localStorage.setItem('desaku.suratCounters', JSON.stringify(counters));
}

function generateId() {
    return 'surat-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

// Helper functions
function viewSurat(id) {
    const suratList = JSON.parse(localStorage.getItem('desaku.surat') || '[]');
    const surat = suratList.find(s => s.id === id);
    
    if (surat) {
        let history = '';
        if (surat.approvalHistory) {
            history = '\n\nHistory Approval:\n';
            surat.approvalHistory.forEach(h => {
                const approvalUser = JSON.parse(localStorage.getItem('desaku.users') || '[]').find(u => u.username === h.userId);
                history += `${formatDateTime(h.date)} - ${h.action} by ${approvalUser?.fullname || h.userId} - ${h.notes || ''}\n`;
            });
        }
        
        alert(`Surat Detail:\n\nNomor: ${surat.nomor}\nJenis: ${surat.jenis}\nPemohon: ${surat.pemohon}\nNIK: ${surat.nik}\nRT/RW: ${surat.rt}/${surat.rw}\nStatus: ${surat.status}\nTanggal: ${formatDate(surat.tanggal)}\n\nIsi Surat:\n${surat.isi}\n\nCatatan: ${surat.catatan || '-'}${history}`);
    }
}

function editSurat(id) {
    alert('Fitur edit surat akan diimplementasikan');
}

function downloadSurat(id) {
    // Use dashboard.js functions for PDF generation
    if (typeof downloadSuratPDF === 'function') {
        downloadSuratPDF(id);
    } else {
        alert('Fitur PDF generation memerlukan library html2pdf.js');
    }
}