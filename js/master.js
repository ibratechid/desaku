// Master Data Management for DESAKU

document.addEventListener('DOMContentLoaded', function() {
    // Initialize data if not exists
    initializeData();
    
    // Load data based on page
    if (window.location.pathname.includes('master-user.html')) {
        loadUserTable();
    } else if (window.location.pathname.includes('master-jenis-surat.html')) {
        loadJenisSuratTable();
    } else if (window.location.pathname.includes('master-warga.html')) {
        loadWargaTable();
    } else if (window.location.pathname.includes('master-nomor-surat.html')) {
        loadNomorSuratSettings();
    } else if (window.location.pathname.includes('setting.html')) {
        loadSettings();
    }
});

function initializeData() {
    // Initialize users if not exists
    if (!localStorage.getItem('desaku.users')) {
        const initialUsers = [
            { id: 'user-1', username: 'admin', password: 'admin123', fullname: 'Administrator', role: 'admin' },
            { id: 'user-2', username: 'rt1', password: 'rt123', fullname: 'RT 01', role: 'rt', rt: '01', rw: '01' },
            { id: 'user-3', username: 'rt2', password: 'rt123', fullname: 'RT 02', role: 'rt', rt: '02', rw: '01' },
            { id: 'user-4', username: 'rw1', password: 'rw123', fullname: 'RW 01', role: 'rw', rw: '01' },
            { id: 'user-5', username: 'kepala', password: 'kepala123', fullname: 'Kepala Desa', role: 'kepala-desa' }
        ];
        
        localStorage.setItem('desaku.users', JSON.stringify(initialUsers));
    }
    
    // Initialize jenis surat if not exists
    if (!localStorage.getItem('desaku.jenisSurat')) {
        const initialJenisSurat = [
            { id: 'jenis-1', kode: 'SK', nama: 'Surat Keterangan', formatNomor: 'SK/{nomor}/{bulan}/{tahun}' },
            { id: 'jenis-2', kode: 'SP', nama: 'Surat Pengantar', formatNomor: 'SP/{nomor}/{bulan}/{tahun}' },
            { id: 'jenis-3', kode: 'SU', nama: 'Surat Usaha', formatNomor: 'SU/{nomor}/{bulan}/{tahun}' },
            { id: 'jenis-4', kode: 'SD', nama: 'Surat Domisili', formatNomor: 'SD/{nomor}/{bulan}/{tahun}' },
            { id: 'jenis-5', kode: 'SKK', nama: 'Surat Keterangan Kelakuan Baik', formatNomor: 'SKK/{nomor}/{bulan}/{tahun}' }
        ];
        
        localStorage.setItem('desaku.jenisSurat', JSON.stringify(initialJenisSurat));
    }
    
    // Initialize warga if not exists
    if (!localStorage.getItem('desaku.warga')) {
        const initialWarga = [
            {
                id: 'warga-1',
                nik: '1234567890123451',
                nama: 'Budi Santoso',
                jk: 'L',
                tempatLahir: 'Jakarta',
                tanggalLahir: '1985-05-15',
                pekerjaan: 'Petani',
                statusPerkawinan: 'Kawin',
                kewarganegaraan: 'Indonesia',
                noHp: '081234567890',
                rt: '01',
                rw: '01',
                dusun: 'Dusun 1',
                kelurahan: 'Desa Maju',
                kecamatan: 'Kecamatan Maju',
                kabupaten: 'Kabupaten Maju',
                provinsi: 'Jawa Barat'
            },
            {
                id: 'warga-2',
                nik: '1234567890123452',
                nama: 'Siti Aminah',
                jk: 'P',
                tempatLahir: 'Bandung',
                tanggalLahir: '1990-08-22',
                pekerjaan: 'Ibu Rumah Tangga',
                statusPerkawinan: 'Kawin',
                kewarganegaraan: 'Indonesia',
                noHp: '081234567891',
                rt: '01',
                rw: '01',
                dusun: 'Dusun 1',
                kelurahan: 'Desa Maju',
                kecamatan: 'Kecamatan Maju',
                kabupaten: 'Kabupaten Maju',
                provinsi: 'Jawa Barat'
            }
        ];
        
        localStorage.setItem('desaku.warga', JSON.stringify(initialWarga));
    }
    
    // Initialize surat counters if not exists
    if (!localStorage.getItem('desaku.suratCounters')) {
        const initialCounters = {
            'SK': 1,
            'SP': 1,
            'SU': 1,
            'SD': 1,
            'SKK': 1
        };
        
        localStorage.setItem('desaku.suratCounters', JSON.stringify(initialCounters));
    }
    
    // Initialize desa settings if not exists
    if (!localStorage.getItem('desaku.desa')) {
        const initialDesa = {
            namaDesa: 'Desa Maju',
            kecamatan: 'Kecamatan Maju',
            kabupaten: 'Kabupaten Maju',
            provinsi: 'Jawa Barat',
            alamatDesa: 'Jl. Raya Desa No. 1',
            kontak: '081234567890',
            email: 'desamaju@email.com'
        };
        
        localStorage.setItem('desaku.desa', JSON.stringify(initialDesa));
    }
}

// User Management
function loadUserTable() {
    const users = JSON.parse(localStorage.getItem('desaku.users') || '[]');
    const tableBody = document.querySelector('#userTable tbody');
    tableBody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.fullname}</td>
            <td>${getRoleName(user.role)}</td>
            <td>${user.rt ? `${user.rt}/${user.rw || '-'}` : '-'}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editUser('${user.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteUser('${user.id}')">Hapus</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function getRoleName(role) {
    const roleNames = {
        'admin': 'Administrator',
        'rt': 'RT',
        'rw': 'RW',
        'kepala-desa': 'Kepala Desa',
        'warga': 'Warga'
    };
    return roleNames[role] || role;
}

function openUserModal(userId = null) {
    const modal = document.getElementById('userModal');
    const form = document.getElementById('userForm');
    const modalTitle = document.getElementById('modalTitle');
    
    if (userId) {
        // Edit mode
        const users = JSON.parse(localStorage.getItem('desaku.users') || '[]');
        const user = users.find(u => u.id === userId);
        
        if (user) {
            modalTitle.textContent = 'Edit User';
            document.getElementById('userId').value = user.id;
            document.getElementById('username').value = user.username;
            document.getElementById('password').value = '';
            document.getElementById('fullname').value = user.fullname;
            document.getElementById('role').value = user.role;
            document.getElementById('rt').value = user.rt || '';
            document.getElementById('rw').value = user.rw || '';
        }
    } else {
        // Add mode
        modalTitle.textContent = 'Tambah User';
        form.reset();
        document.getElementById('userId').value = '';
    }
    
    modal.style.display = 'block';
}

function closeUserModal() {
    document.getElementById('userModal').style.display = 'none';
}

function editUser(userId) {
    openUserModal(userId);
}

function deleteUser(userId) {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
        const users = JSON.parse(localStorage.getItem('desaku.users') || '[]');
        const updatedUsers = users.filter(u => u.id !== userId);
        localStorage.setItem('desaku.users', JSON.stringify(updatedUsers));
        loadUserTable();
    }
}

// Jenis Surat Management
function loadJenisSuratTable() {
    const jenisSurat = JSON.parse(localStorage.getItem('desaku.jenisSurat') || '[]');
    const tableBody = document.querySelector('#jenisSuratTable tbody');
    tableBody.innerHTML = '';
    
    jenisSurat.forEach(jenis => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${jenis.kode}</td>
            <td>${jenis.nama}</td>
            <td>${jenis.formatNomor}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editJenisSurat('${jenis.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteJenisSurat('${jenis.id}')">Hapus</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function openJenisSuratModal(jenisId = null) {
    const modal = document.getElementById('jenisSuratModal');
    const form = document.getElementById('jenisSuratForm');
    const modalTitle = document.getElementById('modalTitle');
    
    if (jenisId) {
        // Edit mode
        const jenisSurat = JSON.parse(localStorage.getItem('desaku.jenisSurat') || '[]');
        const jenis = jenisSurat.find(j => j.id === jenisId);
        
        if (jenis) {
            modalTitle.textContent = 'Edit Jenis Surat';
            document.getElementById('jenisSuratId').value = jenis.id;
            document.getElementById('kodeJenis').value = jenis.kode;
            document.getElementById('namaJenis').value = jenis.nama;
            document.getElementById('formatNomor').value = jenis.formatNomor;
        }
    } else {
        // Add mode
        modalTitle.textContent = 'Tambah Jenis Surat';
        form.reset();
        document.getElementById('jenisSuratId').value = '';
    }
    
    modal.style.display = 'block';
}

function closeJenisSuratModal() {
    document.getElementById('jenisSuratModal').style.display = 'none';
}

function editJenisSurat(jenisId) {
    openJenisSuratModal(jenisId);
}

function deleteJenisSurat(jenisId) {
    if (confirm('Apakah Anda yakin ingin menghapus jenis surat ini?')) {
        const jenisSurat = JSON.parse(localStorage.getItem('desaku.jenisSurat') || '[]');
        const updatedJenis = jenisSurat.filter(j => j.id !== jenisId);
        localStorage.setItem('desaku.jenisSurat', JSON.stringify(updatedJenis));
        loadJenisSuratTable();
    }
}

// Warga Management
function loadWargaTable() {
    const wargaList = JSON.parse(localStorage.getItem('desaku.warga') || '[]');
    const tableBody = document.querySelector('#wargaTable tbody');
    tableBody.innerHTML = '';
    
    wargaList.forEach(warga => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${warga.nik}</td>
            <td>${warga.nama}</td>
            <td>${warga.jk === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
            <td>${warga.rt}/${warga.rw}</td>
            <td>${warga.dusun}, ${warga.kelurahan}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editWarga('${warga.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteWarga('${warga.id}')">Hapus</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function openWargaModal(wargaId = null) {
    const modal = document.getElementById('wargaModal');
    const form = document.getElementById('wargaForm');
    const modalTitle = document.getElementById('modalTitle');
    
    if (wargaId) {
        // Edit mode
        const wargaList = JSON.parse(localStorage.getItem('desaku.warga') || '[]');
        const warga = wargaList.find(w => w.id === wargaId);
        
        if (warga) {
            modalTitle.textContent = 'Edit Data Warga';
            document.getElementById('wargaId').value = warga.id;
            document.getElementById('nik').value = warga.nik;
            document.getElementById('nama').value = warga.nama;
            document.getElementById('jk').value = warga.jk;
            document.getElementById('tempatLahir').value = warga.tempatLahir;
            document.getElementById('tanggalLahir').value = warga.tanggalLahir;
            document.getElementById('pekerjaan').value = warga.pekerjaan;
            document.getElementById('statusPerkawinan').value = warga.statusPerkawinan;
            document.getElementById('kewarganegaraan').value = warga.kewarganegaraan;
            document.getElementById('noHp').value = warga.noHp;
            document.getElementById('rt').value = warga.rt;
            document.getElementById('rw').value = warga.rw;
            document.getElementById('dusun').value = warga.dusun;
            document.getElementById('kelurahan').value = warga.kelurahan;
            document.getElementById('kecamatan').value = warga.kecamatan;
            document.getElementById('kabupaten').value = warga.kabupaten;
            document.getElementById('provinsi').value = warga.provinsi;
        }
    } else {
        // Add mode
        modalTitle.textContent = 'Tambah Data Warga';
        form.reset();
        document.getElementById('wargaId').value = '';
        document.getElementById('kewarganegaraan').value = 'Indonesia';
    }
    
    modal.style.display = 'block';
}

function closeWargaModal() {
    document.getElementById('wargaModal').style.display = 'none';
}

function editWarga(wargaId) {
    openWargaModal(wargaId);
}

function deleteWarga(wargaId) {
    if (confirm('Apakah Anda yakin ingin menghapus data warga ini?')) {
        const wargaList = JSON.parse(localStorage.getItem('desaku.warga') || '[]');
        const updatedWarga = wargaList.filter(w => w.id !== wargaId);
        localStorage.setItem('desaku.warga', JSON.stringify(updatedWarga));
        loadWargaTable();
    }
}

// Nomor Surat Management
function loadNomorSuratSettings() {
    const jenisSurat = JSON.parse(localStorage.getItem('desaku.jenisSurat') || '[]');
    const counters = JSON.parse(localStorage.getItem('desaku.suratCounters') || '{}');
    const jenisSuratSelect = document.getElementById('jenisSuratSelect');
    
    // Populate jenis surat dropdown
    jenisSurat.forEach(jenis => {
        const option = document.createElement('option');
        option.value = jenis.kode;
        option.textContent = jenis.nama;
        jenisSuratSelect.appendChild(option);
    });
    
    // Load counter table
    const tableBody = document.querySelector('#counterTable tbody');
    tableBody.innerHTML = '';
    
    jenisSurat.forEach(jenis => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${jenis.nama}</td>
            <td>${counters[jenis.kode] || 1}</td>
            <td>${jenis.formatNomor}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editCounter('${jenis.kode}')">Edit</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Handle jenis surat selection
    jenisSuratSelect.addEventListener('change', function() {
        const selectedKode = this.value;
        const selectedJenis = jenisSurat.find(j => j.kode === selectedKode);
        
        if (selectedJenis) {
            document.getElementById('formatPreview').value = selectedJenis.formatNomor;
            document.getElementById('currentCounter').value = counters[selectedKode] || 1;
            
            // Generate example number
            const counter = counters[selectedKode] || 1;
            const today = new Date();
            const bulan = String(today.getMonth() + 1).padStart(2, '0');
            const tahun = today.getFullYear();
            
            let example = selectedJenis.formatNomor
                .replace('{nomor}', counter)
                .replace('{bulan}', bulan)
                .replace('{tahun}', tahun);
            
            document.getElementById('exampleNumber').value = example;
        }
    });
}

function saveNomorSettings() {
    const jenisKode = document.getElementById('jenisSuratSelect').value;
    const counter = parseInt(document.getElementById('currentCounter').value);
    
    if (!jenisKode || isNaN(counter)) {
        alert('Silakan pilih jenis surat dan masukkan counter yang valid');
        return;
    }
    
    const counters = JSON.parse(localStorage.getItem('desaku.suratCounters') || '{}');
    counters[jenisKode] = counter;
    localStorage.setItem('desaku.suratCounters', JSON.stringify(counters));
    
    alert('Pengaturan nomor surat berhasil disimpan!');
    loadNomorSuratSettings();
}

// Settings Management
function loadSettings() {
    const desa = JSON.parse(localStorage.getItem('desaku.desa') || '{}');
    
    // Load desa info
    document.getElementById('namaDesa').value = desa.namaDesa || '';
    document.getElementById('kecamatan').value = desa.kecamatan || '';
    document.getElementById('kabupaten').value = desa.kabupaten || '';
    document.getElementById('provinsi').value = desa.provinsi || '';
    document.getElementById('alamatDesa').value = desa.alamatDesa || '';
    document.getElementById('kontak').value = desa.kontak || '';
    document.getElementById('email').value = desa.email || '';
    
    // Handle form submission
    const desaForm = document.getElementById('desaForm');
    desaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const updatedDesa = {
            namaDesa: document.getElementById('namaDesa').value,
            kecamatan: document.getElementById('kecamatan').value,
            kabupaten: document.getElementById('kabupaten').value,
            provinsi: document.getElementById('provinsi').value,
            alamatDesa: document.getElementById('alamatDesa').value,
            kontak: document.getElementById('kontak').value,
            email: document.getElementById('email').value
        };
        
        localStorage.setItem('desaku.desa', JSON.stringify(updatedDesa));
        alert('Pengaturan desa berhasil disimpan!');
    });
}

function saveBranding() {
    // In a real implementation, this would handle file uploads and save to localStorage
    alert('Fungsi upload logo dan background akan diimplementasikan dengan API yang sesuai');
}

function saveSignatures() {
    // In a real implementation, this would handle TTD and cap uploads
    alert('Fungsi upload TTD dan cap digital akan diimplementasikan dengan API yang sesuai');
}

// Form handlers for modals
function setupFormHandlers() {
    // User form handler
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userId = document.getElementById('userId').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const fullname = document.getElementById('fullname').value;
            const role = document.getElementById('role').value;
            const rt = document.getElementById('rt').value;
            const rw = document.getElementById('rw').value;
            
            const users = JSON.parse(localStorage.getItem('desaku.users') || '[]');
            
            if (userId) {
                // Update existing user
                const updatedUsers = users.map(user => {
                    if (user.id === userId) {
                        return {
                            ...user,
                            username,
                            fullname,
                            role,
                            rt: role === 'rt' ? rt : undefined,
                            rw: role === 'rt' || role === 'rw' ? rw : undefined
                        };
                    }
                    return user;
                });
                localStorage.setItem('desaku.users', JSON.stringify(updatedUsers));
            } else {
                // Add new user
                const newUser = {
                    id: 'user-' + Date.now(),
                    username,
                    password: password || 'default123',
                    fullname,
                    role,
                    rt: role === 'rt' ? rt : undefined,
                    rw: role === 'rt' || role === 'rw' ? rw : undefined
                };
                users.push(newUser);
                localStorage.setItem('desaku.users', JSON.stringify(users));
            }
            
            closeUserModal();
            loadUserTable();
        });
    }
    
    // Jenis Surat form handler
    const jenisSuratForm = document.getElementById('jenisSuratForm');
    if (jenisSuratForm) {
        jenisSuratForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const jenisId = document.getElementById('jenisSuratId').value;
            const kode = document.getElementById('kodeJenis').value;
            const nama = document.getElementById('namaJenis').value;
            const formatNomor = document.getElementById('formatNomor').value;
            
            const jenisSurat = JSON.parse(localStorage.getItem('desaku.jenisSurat') || '[]');
            
            if (jenisId) {
                // Update existing jenis surat
                const updatedJenis = jenisSurat.map(jenis => {
                    if (jenis.id === jenisId) {
                        return { ...jenis, kode, nama, formatNomor };
                    }
                    return jenis;
                });
                localStorage.setItem('desaku.jenisSurat', JSON.stringify(updatedJenis));
            } else {
                // Add new jenis surat
                const newJenis = {
                    id: 'jenis-' + Date.now(),
                    kode,
                    nama,
                    formatNomor
                };
                jenisSurat.push(newJenis);
                localStorage.setItem('desaku.jenisSurat', JSON.stringify(jenisSurat));
            }
            
            closeJenisSuratModal();
            loadJenisSuratTable();
        });
    }
    
    // Warga form handler
    const wargaForm = document.getElementById('wargaForm');
    if (wargaForm) {
        wargaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const wargaId = document.getElementById('wargaId').value;
            const nik = document.getElementById('nik').value;
            const nama = document.getElementById('nama').value;
            const jk = document.getElementById('jk').value;
            const tempatLahir = document.getElementById('tempatLahir').value;
            const tanggalLahir = document.getElementById('tanggalLahir').value;
            const pekerjaan = document.getElementById('pekerjaan').value;
            const statusPerkawinan = document.getElementById('statusPerkawinan').value;
            const kewarganegaraan = document.getElementById('kewarganegaraan').value;
            const noHp = document.getElementById('noHp').value;
            const rt = document.getElementById('rt').value;
            const rw = document.getElementById('rw').value;
            const dusun = document.getElementById('dusun').value;
            const kelurahan = document.getElementById('kelurahan').value;
            const kecamatan = document.getElementById('kecamatan').value;
            const kabupaten = document.getElementById('kabupaten').value;
            const provinsi = document.getElementById('provinsi').value;
            
            const wargaList = JSON.parse(localStorage.getItem('desaku.warga') || '[]');
            
            if (wargaId) {
                // Update existing warga
                const updatedWarga = wargaList.map(warga => {
                    if (warga.id === wargaId) {
                        return {
                            ...warga,
                            nik,
                            nama,
                            jk,
                            tempatLahir,
                            tanggalLahir,
                            pekerjaan,
                            statusPerkawinan,
                            kewarganegaraan,
                            noHp,
                            rt,
                            rw,
                            dusun,
                            kelurahan,
                            kecamatan,
                            kabupaten,
                            provinsi
                        };
                    }
                    return warga;
                });
                localStorage.setItem('desaku.warga', JSON.stringify(updatedWarga));
            } else {
                // Add new warga
                const newWarga = {
                    id: 'warga-' + Date.now(),
                    nik,
                    nama,
                    jk,
                    tempatLahir,
                    tanggalLahir,
                    pekerjaan,
                    statusPerkawinan,
                    kewarganegaraan,
                    noHp,
                    rt,
                    rw,
                    dusun,
                    kelurahan,
                    kecamatan,
                    kabupaten,
                    provinsi
                };
                wargaList.push(newWarga);
                localStorage.setItem('desaku.warga', JSON.stringify(wargaList));
            }
            
            closeWargaModal();
            loadWargaTable();
        });
    }
}

// Initialize form handlers when DOM is loaded
setupFormHandlers();