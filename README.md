# DESAKU - Sistem Pembuatan Surat Desa

**DESAKU** adalah sistem pembuatan surat desa yang lengkap dengan workflow approval multi-level dan manajemen data warga.

## Fitur Utama

### 1. Sistem Autentikasi Multi-Role
- 5 Role: Administrator, RT, RW, Kepala Desa, Warga
- Login/Logout dengan localStorage persistence
- Role-based access control

### 2. Workflow Approval
**Warga → RT → RW → Kepala Desa → Disetujui**
- Warga mengajukan surat
- RT review dan approve/reject
- RW review dan approve/reject
- Kepala Desa final approval
- Status tracking: Pending, Process, Approved, Rejected

### 3. Dashboard Per Role
- **Administrator**: Statistik lengkap, surat terbaru, chart
- **RT/RW/Kepala Desa**: Surat pending yang perlu ditindaklanjuti
- **Warga**: Status pengajuan surat saya

### 4. Master Data Management
- **Master User**: CRUD user dengan 5 role
- **Master Jenis Surat**: CRUD jenis surat dengan format nomor custom
- **Master Data Warga**: CRUD warga dengan data lengkap (NIK, alamat, dll)
- **Master TTD & Cap**: Upload digital signatures dan stamps
- **Master Nomor Surat**: Auto-increment counter per jenis surat

### 5. Fitur Tambahan
- Auto-generate nomor surat berdasarkan format
- Filter dan pencarian surat
- Export PDF dengan TTD dan cap digital
- Pengaturan desa (logo, branding, informasi)
- Responsive design (mobile-first)
- SEO-friendly HTML structure

## Teknologi
- **HTML5** - Struktur semantik dan SEO-friendly
- **CSS3** - Desain responsive dan modern
- **Vanilla JavaScript** - Tanpa framework eksternal
- **localStorage** - Data persistence
- **No external dependencies** - Pure front-end solution

## Struktur File

```
desaku/
├── index.html                  # Halaman Login
├── dashboard/
│   ├── admin.html              # Dashboard Administrator
│   ├── rt.html                 # Dashboard RT
│   ├── rw.html                 # Dashboard RW
│   ├── kepala-desa.html        # Dashboard Kepala Desa
│   └── warga.html              # Dashboard Warga
├── pages/
│   ├── daftar-surat.html       # Daftar Surat
│   ├── ajukan-surat.html       # Form Pengajuan Surat
│   ├── master-user.html         # Master User
│   ├── master-jenis-surat.html  # Master Jenis Surat
│   ├── master-warga.html        # Master Data Warga
│   ├── master-ttd.html          # Master TTD & Cap
│   ├── master-nomor-surat.html  # Master Nomor Surat
│   └── setting.html             # Pengaturan
├── css/
│   └── style.css               # Stylesheet utama
├── js/
│   ├── auth.js                 # Autentikasi
│   ├── app.js                  # Aplikasi utama
│   ├── dashboard.js            # Dashboard functionality
│   ├── surat.js                # Surat management
│   ├── master.js               # Master data management
│   ├── storage.js              # Storage utility
│   ├── api.js                  # API integration
│   └── utils.js                # Utility functions
├── assets/
│   ├── images/                 # Gambar dan logo
│   └── icons/                  # Icons
└── README.md                   # Dokumentasi
```

## Data Sample

Sistem sudah dilengkapi dengan data sample untuk testing:

### Users
- **Admin**: `admin` / `admin123`
- **RT 01**: `rt1` / `rt123`
- **RT 02**: `rt2` / `rt123`
- **RW 01**: `rw1` / `rw123`
- **Kepala Desa**: `kepala` / `kepala123`
- **Warga 1**: `warga1` / `warga123`
- **Warga 2**: `warga2` / `warga123`

### Jenis Surat
1. Surat Keterangan (SK)
2. Surat Pengantar (SP)
3. Surat Usaha (SU)
4. Surat Domisili (SD)
5. Surat Keterangan Kelakuan Baik (SKK)

### Data Warga
Tersedia 3 data warga sample dengan data lengkap.

## Cara Penggunaan

### 1. Login
- Buka `index.html`
- Masukkan username, password, dan pilih role
- Klik "Masuk"

### 2. Administrator
- Kelola semua master data
- Lihat statistik dan surat terbaru
- Edit pengaturan desa

### 3. RT/RW/Kepala Desa
- Lihat surat pending yang perlu ditindaklanjuti
- Approve atau reject surat dengan catatan
- Lihat history approval

### 4. Warga
- Ajukan surat baru
- Lihat status pengajuan
- Download surat yang disetujui

## Workflow Approval

```
Warga Submit → Status: Pending (RT)
        ↓
RT Approve → Status: Process (RW)
        ↓
RW Approve → Status: Process (Kepala Desa)
        ↓
Kepala Desa Approve → Status: Disetujui (Final)
        ↓
Surat siap download dengan TTD dan cap digital
```

## Format Nomor Surat

Setiap jenis surat memiliki format nomor custom:
- `SK/{nomor}/{bulan}/{tahun}` → SK/001/01/2023
- `SP/{nomor}/{bulan}/{tahun}` → SP/001/01/2023
- Counter auto-increment per bulan

## Responsive Design

- Mobile: 480px+
- Tablet: 768px+
- Desktop: 1024px+

## SEO Optimization

- Semantic HTML5
- Meta tags untuk deskripsi
- Title tags per halaman
- Responsive meta tag

## Keamanan

- Password stored in localStorage (for demo only)
- Role-based access control
- Form validation
- Edit disabled for approved surat

## Development Notes

### LocalStorage Structure

```javascript
// Users
localStorage.getItem('desaku.users')

// Jenis Surat
localStorage.getItem('desaku.jenisSurat')

// Data Warga
localStorage.getItem('desaku.warga')

// Surat
localStorage.getItem('desaku.surat')

// Counters
localStorage.getItem('desaku.suratCounters')

// Desa Settings
localStorage.getItem('desaku.desa')

// Current User
localStorage.getItem('desaku.currentUser')
```

### Future Enhancements

- Integrasi API Alamat Indonesia (real API)
- PDF generation dengan library seperti jsPDF
- File upload ke server (backend integration)
- Notifikasi real-time
- Export data ke Excel
- Backup/restore data

## Kontribusi

Silakan fork repository ini dan submit pull request untuk fitur atau perbaikan baru.

## Lisensi

MIT License - Free for personal and commercial use.

## Kontak

Untuk pertanyaan atau dukungan, silakan hubungi:
- Email: support@desaku.com
- Website: https://desaku.com

---

**DESAKU** - Membangun desa digital, satu surat pada satu waktu.