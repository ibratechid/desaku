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
            { id: 'user-1', username: 'admin', password: 'demo123', fullname: 'Administrator', role: 'admin' },
            { id: 'user-2', username: 'rt1', password: 'demo123', fullname: 'RT 01', role: 'rt', rt: '01', rw: '01' },
            { id: 'user-3', username: 'rw1', password: 'demo123', fullname: 'RW 01', role: 'rw', rw: '01' },
            { id: 'user-4', username: 'kepala', password: 'demo123', fullname: 'Kepala Desa', role: 'kepala-desa' },
            { id: 'user-5', username: 'warga1', password: 'demo123', fullname: 'Budi Santoso', role: 'warga', wargaId: 'warga-1' },
            { id: 'user-6', username: 'warga2', password: 'demo123', fullname: 'Siti Aminah', role: 'warga', wargaId: 'warga-2' }
        ];
        
        // Jenis Surat
        const jenisSurat = [
            { id: 'jenis-1', kode: 'SK', nama: 'Surat Keterangan', formatNomor: 'SK/{nomor}/{bulan}/{tahun}', deskripsi: 'Surat untuk keterangan resmi dari desa' },
            { id: 'jenis-2', kode: 'SP', nama: 'Surat Pengantar', formatNomor: 'SP/{nomor}/{bulan}/{tahun}', deskripsi: 'Surat pengantar untuk keperluan administrasi' },
            { id: 'jenis-3', kode: 'SU', nama: 'Surat Usaha', formatNomor: 'SU/{nomor}/{bulan}/{tahun}', deskripsi: 'Surat keterangan usaha mikro/kecil' },
            { id: 'jenis-4', kode: 'SD', nama: 'Surat Domisili', formatNomor: 'SD/{nomor}/{bulan}/{tahun}', deskripsi: 'Surat keterangan domisili tempat tinggal' },
            { id: 'jenis-5', kode: 'SKK', nama: 'Surat Keterangan Kelakuan Baik', formatNomor: 'SKK/{nomor}/{bulan}/{tahun}', deskripsi: 'Surat keterangan kelakuan baik' }
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
            email: 'desamaju@email.com',
            logo: null,
            background: null
        };

        // Surat Counters
        const counters = {
            'SK': 1,
            'SP': 1,
            'SU': 1,
            'SD': 1,
            'SKK': 1
        };

        // Sample Surat dengan Approval Workflow
        const suratList = [
            {
                id: 'surat-1',
                nomor: 'SK/001/01/2025',
                jenis: 'Surat Keterangan',
                jenisId: 'jenis-1',
                tanggal: '2025-01-14',
                pemohon: 'Budi Santoso',
                pemohonId: 'warga-1',
                rt: '01',
                rw: '01',
                isi: 'Surat keterangan bahwa yang tersebut di bawah ini benar-benar warga Desa Maju.',
                status: 'pending',
                currentApproval: 'rt',
                approvalHistory: [
                    {
                        id: 'approval-1',
                        role: 'warga',
                        action: 'submit',
                        userId: 'warga1',
                        date: '2025-01-14T08:00:00',
                        notes: 'Surat diajukan'
                    }
                ]
            },
            {
                id: 'surat-2',
                nomor: 'SP/001/01/2025',
                jenis: 'Surat Pengantar',
                jenisId: 'jenis-2',
                tanggal: '2025-01-13',
                pemohon: 'Siti Aminah',
                pemohonId: 'warga-2',
                rt: '01',
                rw: '01',
                isi: 'Surat pengantar untuk keperluan pembuatan KTP.',
                status: 'process',
                currentApproval: 'rw',
                approvalHistory: [
                    {
                        id: 'approval-2',
                        role: 'warga',
                        action: 'submit',
                        userId: 'warga2',
                        date: '2025-01-13T09:00:00',
                        notes: 'Surat diajukan'
                    },
                    {
                        id: 'approval-3',
                        role: 'rt',
                        action: 'approve',
                        userId: 'rt1',
                        date: '2025-01-13T14:30:00',
                        notes: 'Surat disetujui di tingkat RT'
                    }
                ]
            }
        ];

        // Set all data
        this.setItem('users', users);
        this.setItem('jenisSurat', jenisSurat);
        this.setItem('warga', warga);
        this.setItem('desa', desa);
        this.setItem('suratCounters', counters);
        this.setItem('surat', suratList);
    }
}

// Initialize sample data if not exists
if (!localStorage.getItem('desaku.users')) {
    DesakuStorage.initializeSampleData();
}