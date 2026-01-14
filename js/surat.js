// Surat Management for DESAKU

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('desaku.currentUser'));
    
    // Load surat data for daftar-surat.html
    if (window.location.pathname.includes('daftar-surat.html')) {
        loadSuratTable();
        loadFilters();
    }
    
    // Load form for ajukan-surat.html
    if (window.location.pathname.includes('ajukan-surat.html')) {
        loadSuratForm();
    }
});

function loadSuratTable() {
    const suratList = JSON.parse(localStorage.getItem('desaku.surat') || '[]');
    const tableBody = document.querySelector('#suratTable tbody');
    tableBody.innerHTML = '';
    
    suratList.forEach(surat => {
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

function canEditSurat(surat) {
    const currentUser = JSON.parse(localStorage.getItem('desaku.currentUser'));
    return surat.status !== 'approved' && currentUser.role === 'admin';
}

function loadFilters() {
    // Load jenis surat filter
    const jenisSuratList = JSON.parse(localStorage.getItem('desaku.jenisSurat') || '[]');
    const filterJenis = document.getElementById('filterJenis');
    
    jenisSuratList.forEach(jenis => {
        const option = document.createElement('option');
        option.value = jenis.kode;
        option.textContent = jenis.nama;
        filterJenis.appendChild(option);
    });
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
    jenisSuratList.forEach(jenis => {
        const option = document.createElement('option');
        option.value = jenis.kode;
        option.textContent = jenis.nama;
        jenisSuratSelect.appendChild(option);
    });
    
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
    suratForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const jenisSurat = document.getElementById('jenisSurat').value;
        const catatan = document.getElementById('catatan').value;
        
        // Generate nomor surat
        const nomorSurat = generateNomorSurat(jenisSurat);
        
        // Create new surat
        const newSurat = {
            id: generateId(),
            nomor: nomorSurat,
            jenis: jenisSuratList.find(j => j.kode === jenisSurat).nama,
            jenisKode: jenisSurat,
            pemohon: currentWarga.nama,
            pemohonId: currentUser.id,
            nik: currentWarga.nik,
            rt: currentWarga.rt,
            rw: currentWarga.rw,
            dusun: currentWarga.dusun,
            catatan: catatan,
            status: 'pending',
            currentApproval: 'rt',
            tanggal: new Date().toISOString().split('T')[0],
            approvalHistory: []
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
        .replace('{nomor}', counter)
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

// Helper functions
function viewSurat(id) {
    const suratList = JSON.parse(localStorage.getItem('desaku.surat') || '[]');
    const surat = suratList.find(s => s.id === id);
    
    if (surat) {
        alert(`Surat Detail:\n\nNomor: ${surat.nomor}\nJenis: ${surat.jenis}\nPemohon: ${surat.pemohon}\nStatus: ${surat.status}\nTanggal: ${surat.tanggal}\nCatatan: ${surat.catatan || '-'}`);
    }
}

function editSurat(id) {
    alert('Edit surat functionality would be implemented here for ID: ' + id);
}

function downloadSurat(id) {
    alert('Download PDF functionality would be implemented here for ID: ' + id);
}