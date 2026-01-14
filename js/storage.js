// Storage Utility for DESAKU

class DesakuStorage {
    static getItem(key) {
        return JSON.parse(localStorage.getItem(`desaku.${key}`) || '[]');
    }

    static setItem(key, value) {
        localStorage.setItem(`desaku.${key}`, JSON.stringify(value));
    }

    static removeItem(key) {
        localStorage.removeItem(`desaku.${key}`);
    }

    static clear() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('desaku.')) {
                localStorage.removeItem(key);
            }
        });
    }

    static initializeSampleData() {
        // Users
        const users = [
            { id: 'user-1', username: 'admin', password: 'admin123', fullname: 'Administrator', role: 'admin' },
            { id: 'user-2', username: 'rt1', password: 'rt123', fullname: 'RT 01', role: 'rt', rt: '01', rw: '01' },
            { id: 'user-3', username: 'rt2', password: 'rt123', fullname: 'RT 02', role: 'rt', rt: '02', rw: '01' },
            { id: 'user-4', username: 'rw1', password: 'rw123', fullname: 'RW 01', role: 'rw', rw: '01' },
            { id: 'user-5', username: 'kepala', password: 'kepala123', fullname: 'Kepala Desa', role: 'kepala-desa' },
            { id: 'user-6', username: 'warga1', password: 'warga123', fullname: 'Budi Santoso', role: 'warga', wargaId: 'warga-1' },
            { id: 'user-7', username: 'warga2', password: 'warga123', fullname: 'Siti Aminah', role: 'warga', wargaId: 'warga-2' }
        ];
        
        // Jenis Surat
        const jenisSurat = [
            { id: 'jenis-1', kode: 'SK', nama: 'Surat Keterangan', formatNomor: 'SK/{nomor}/{bulan}/{tahun}' },
            { id: 'jenis-2', kode: 'SP', nama: 'Surat Pengantar', formatNomor: 'SP/{nomor}/{bulan}/{tahun}' },
            { id: 'jenis-3', kode: 'SU', nama: 'Surat Usaha', formatNomor: 'SU/{nomor}/{bulan}/{tahun}' },
            { id: 'jenis-4', kode: 'SD', nama: 'Surat Domisili', formatNomor: 'SD/{nomor}/{bulan}/{tahun}' },
            { id: 'jenis-5', kode: 'SKK', nama: 'Surat Keterangan Kelakuan Baik', formatNomor: 'SKK/{nomor}/{bulan}/{tahun}' }
        ];

        // Warga
        const warga = [
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
            },
            {
                id: 'warga-3',
                nik: '1234567890123453',
                nama: 'Ahmad Subagja',
                jk: 'L',
                tempatLahir: 'Surabaya',
                tanggalLahir: '1978-11-30',
                pekerjaan: 'Wiraswasta',
                statusPerkawinan: 'Kawin',
                kewarganegaraan: 'Indonesia',
                noHp: '081234567892',
                rt: '02',
                rw: '01',
                dusun: 'Dusun 2',
                kelurahan: 'Desa Maju',
                kecamatan: 'Kecamatan Maju',
                kabupaten: 'Kabupaten Maju',
                provinsi: 'Jawa Barat'
            }
        ];

        // Desa Settings
        const desa = {
            namaDesa: 'Desa Maju',
            kecamatan: 'Kecamatan Maju',
            kabupaten: 'Kabupaten Maju',
            provinsi: 'Jawa Barat',
            alamatDesa: 'Jl. Raya Desa No. 1',
            kontak: '081234567890',
            email: 'desamaju@email.com'
        };

        // Surat Counters
        const counters = {
            'SK': 1,
            'SP': 1,
            'SU': 1,
            'SD': 1,
            'SKK': 1
        };

        // Set all data
        this.setItem('users', users);
        this.setItem('jenisSurat', jenisSurat);
        this.setItem('warga', warga);
        this.setItem('desa', desa);
        this.setItem('suratCounters', counters);
    }
}

// Initialize sample data if not exists
if (!localStorage.getItem('desaku.users')) {
    DesakuStorage.initializeSampleData();
}