# brainstorming2

Created: February 24, 2026 3:20 AM

# 🚢 Brainstorming & Kerangka Sistem Penyewaan Kapal Riset Universitas

**Versi:** 1.0 — Dokumen Inisiasi Proyek

**Konteks:** Sistem web internal + publik untuk pengelolaan 2 Kapal Riset milik universitas:
- **KR Unhas Explorer-1** — dapat dipinjam/disewa oleh user melalui sistem
- **KR Unhas Explorer-2** — hanya dapat dilihat informasinya (profil kapal, alat, fasilitas), **tidak dapat dipinjam** oleh user, dan **tidak memiliki panduan/SOP peminjaman**

---

## 1. Visi & Scope Sistem

### Pernyataan Masalah

Unit Pengelola Kapal Riset Universitas saat ini (umumnya) mengelola peminjaman via email/telepon/manual → tidak ada visibilitas real-time, rentan double booking, pelaporan keuangan sulit, dan pengalaman pengguna buruk.

### Visi Produk

Platform web yang memungkinkan siapa pun (mahasiswa, dosen, peneliti eksternal) dapat **melihat informasi 2 kapal riset** (Explorer-1 & Explorer-2), **memesan dan membayar** sewa kapal Explorer-1 secara mandiri, sementara Manager dan Admin dapat **mengelola data kedua kapal, jadwal, memverifikasi, memblokir tanggal, dan menghasilkan laporan keuangan** — semuanya dari satu sistem terpadu.

### Scope yang Disepakati

| Dalam Scope | Luar Scope (fase ini) |
| --- | --- |
| 2 kapal: Explorer 1 (sewa) & Explorer 2 (view-only) | Sistem GPS tracking real-time |
| Pemesanan online & kalender (Explorer 1 only) | Payment gateway otomatis (bisa fase 2) |
| Upload bukti pembayaran manual | Manajemen logistik BBM per trip |
| Manajemen alat & fasilitas (kedua kapal) | Integrasi SiAkad/ERP universitas |
| Dashboard laporan & grafik | Mobile app native |
| Notifikasi email | Peminjaman Explorer 2 |
| WYSIWYG panduan (Explorer 1 only) |  |

---

## 2. Peta Aktor & Role

```
┌─────────────────────────────────────────────────────────┐
│                      AKTOR SISTEM                        │
├──────────────┬──────────────────────────────────────────┤
│ GUEST        │ Lihat halaman kedua kapal (Explorer 1&2)  │
│              │ Baca panduan (Explorer 1 only)            │
│              │ TIDAK bisa pesan                          │
├──────────────┼──────────────────────────────────────────┤
│ USER         │ Register/Login                            │
│ (Peminjam)   │ Navbar: dropdown pilih Explorer 1 / 2    │
│              │ Explorer 1: lihat detail, pesan, bayar    │
│              │ Explorer 2: lihat detail SAJA (no pesan)  │
│              │ Buat & kelola pemesanan sendiri (Exp.1)   │
│              │ Upload bukti bayar (Exp.1)                │
│              │ Lihat status real-time (Exp.1)            │
├──────────────┼──────────────────────────────────────────┤
│ MANAGER      │ Verifikasi / tolak pemesanan (Exp.1)      │
│              │ Verifikasi / tolak pembayaran (Exp.1)     │
│              │ Blokir tanggal di kalender (Exp.1)        │
│              │ CRUD alat & fasilitas (KEDUA kapal)       │
│              │ Edit info umum kapal (KEDUA kapal)        │
│              │ Lihat laporan & grafik (Exp.1)            │
│              │ Kelola panduan/SOP WYSIWYG (Exp.1 only)   │
├──────────────┼──────────────────────────────────────────┤
│ ADMIN        │ Semua akses Manager +                     │
│ SUPER ADMIN  │ Manajemen user & role                     │
│              │ Pengaturan sistem                          │
│              │ Akses semua data                           │
└──────────────┴──────────────────────────────────────────┘
```

**Catatan Penting:**
- Apakah “user” hanya internal kampus (SSO) atau juga eksternal (peneliti luar)? Ini menentukan apakah perlu dua jalur registrasi. **Rekomendasi:** Dukung keduanya dengan flag `is_internal` di tabel users.
- **Explorer 2 bersifat read-only** — tidak ada fitur peminjaman, kalender ketersediaan, maupun panduan/SOP. Hanya informasi profil kapal (general, alat, fasilitas).

---

## 3. User Journey Lengkap

### 3.1 Journey User — Pemesanan Berhasil

```
[NAVBAR — Dropdown Kapal: Explorer 1 ▼ / Explorer 2]
        │
        ├─ Pilih Explorer 1 ↓
        │
[LANDING / HALAMAN KAPAL EXPLORER 1]
        │
        ├─ Lihat Tab General (foto, deskripsi, harga)
        ├─ Lihat Tab Alat Kapal
        ├─ Lihat Tab Fasilitas
        └─ Lihat Tab Panduan/SOP Peminjaman
        │
        ▼
[KLIK "PESAN SEKARANG"]
        │
        ├─ Belum login? → Redirect Login → Kembali ke halaman kapal
        └─ Sudah login? ↓
        │
        ▼
[FORM PEMESANAN]
        ├─ Nama, Email, No HP (auto-fill dari profil, bisa diedit)
        ├─ Pilih Tanggal Mulai & Selesai
        │     └─ Kalender tampil tanggal tidak tersedia (disabled):
        │           ① Sudah ada booking approved di tanggal itu
        │           ② Admin blokir tanggal itu
        ├─ Ringkasan harga otomatis (harga/hari × durasi)
        └─ Submit
        │
        ▼
[STATUS: MENUNGGU VERIFIKASI PESANAN]
        │
        └─ Email konfirmasi ke user: "Pesanan diterima, menunggu verifikasi"
        │
        ▼
[MANAGER VERIFIKASI PESANAN]
        │
        ├─ TOLAK → Status: PESANAN DITOLAK
        │           └─ Email ke user: alasan penolakan
        │
        └─ SETUJUI ↓
        │
        ▼
[STATUS: PESANAN TERVERIFIKASI]
        └─ Email ke user: instruksi pembayaran (nomor rekening, jumlah, deadline)
        │
        ▼
[USER UPLOAD BUKTI BAYAR]
        │
        ▼
[STATUS: MENUNGGU VERIFIKASI PEMBAYARAN]
        └─ Email ke user: "Bukti diterima, sedang diverifikasi"
        │
        ▼
[MANAGER VERIFIKASI PEMBAYARAN]
        │
        ├─ TOLAK → Status: BUKTI PEMBAYARAN DITOLAK
        │           └─ Email ke user: alasan penolakan, minta ulang upload
        │
        └─ SETUJUI ↓
        │
        ▼
[STATUS: LUNAS — PEMESANAN DIKONFIRMASI]
        └─ Email ke user: konfirmasi final, detail peminjaman
        │
        ▼
[TANGGAL PEMINJAMAN TIBA]
        │
        ▼
[SELESAI PEMINJAMAN]
        └─ Manager update status → SELESAI
```

### 3.2 Journey User — Lihat Explorer 2 (View Only)

```
[NAVBAR — Dropdown Kapal: Explorer 1 / Explorer 2 ▼]
        │
        └─ Pilih Explorer 2 ↓
        │
[HALAMAN KAPAL EXPLORER 2]
        │
        ├─ Lihat Tab General (foto, deskripsi, spesifikasi)
        ├─ Lihat Tab Alat Kapal
        └─ Lihat Tab Fasilitas
        │
        ╳ TIDAK ADA Tab Panduan/SOP
        ╳ TIDAK ADA tombol "Pesan Sekarang"
        ╳ TIDAK ADA kalender ketersediaan
        │
        └─ Info box: "Kapal ini saat ini tidak tersedia untuk peminjaman."
```

### 3.3 Journey Manager — Harian

```
Login → Dashboard
  ├─ Lihat summary card (pemasukan, belum bayar, dsb.)
  ├─ Lihat pesanan terbaru di quick list
  ├─ Klik pesanan pending → verifikasi/tolak
  ├─ Lihat kalender → blokir tanggal jika perlu
  └─ Lihat grafik penyewaan → export laporan
```

---

## 4. Arsitektur Halaman (Sitemap)

```
PUBLIC / USER
├── /                              Landing page (hero, ringkasan 2 kapal)
│   └── Navbar: [Logo] [Explorer 1 ▼] [Explorer 2 ▼] [Login/Daftar]
│
├── /kapal/explorer-1              Halaman detail Explorer 1
│   ├── Tab: General
│   ├── Tab: Alat Kapal
│   ├── Tab: Fasilitas
│   └── Tab: Panduan/SOP           ← HANYA di Explorer 1
├── /kapal/explorer-1/kalender     Kalender publik ketersediaan (Explorer 1)
├── /pesan/explorer-1              Form pemesanan Explorer 1 (harus login)
│
├── /kapal/explorer-2              Halaman detail Explorer 2 (VIEW ONLY)
│   ├── Tab: General
│   ├── Tab: Alat Kapal
│   └── Tab: Fasilitas
│   ╳ TIDAK ada Tab Panduan
│   ╳ TIDAK ada tombol Pesan / Kalender
│
├── /auth/login
├── /auth/register
└── /dashboard (USER)
    ├── Pesanan Saya (hanya Explorer 1)
    │   └── /pesanan/:id           Detail pesanan + upload bukti bayar
    └── Profil

MANAGER / ADMIN
└── /manager
    ├── Dashboard
    ├── Pesanan                    Tabel pesanan Explorer 1 + filter
    │   └── /pesanan/:id           Detail + aksi verifikasi/tolak
    ├── Pembayaran                 Tabel status pembayaran (Explorer 1)
    ├── Kalender                   Kalender + blokir tanggal (Explorer 1)
    ├── Kapal Explorer 1           ← Pengelolaan data Explorer 1
    │   ├── Tab: Umum              Edit nama, deskripsi, harga, foto
    │   ├── Tab: Alat Kapal        CRUD alat
    │   ├── Tab: Fasilitas         CRUD fasilitas
    │   └── Tab: Panduan/SOP       WYSIWYG editor (HANYA Explorer 1)
    ├── Kapal Explorer 2           ← Pengelolaan data Explorer 2
    │   ├── Tab: Umum              Edit nama, deskripsi, foto
    │   ├── Tab: Alat Kapal        CRUD alat
    │   └── Tab: Fasilitas         CRUD fasilitas
    │   ╳ TIDAK ada Tab Panduan/SOP (read-only ship)
    └── Laporan                    Grafik + export (Explorer 1)
```

---

## 5. Gambaran UI/UX per Halaman

### 5.1 Navbar (User-facing) — Dropdown Kapal

```
┌──────────────────────────────────────────────────────────────┐
│  Logo Universitas  [Explorer 1 ▼] [Explorer 2 ▼]  [Login]  │
│                                                              │
│  Dropdown Explorer 1:           Dropdown Explorer 2:         │
│  ┌─────────────────────┐       ┌─────────────────────┐      │
│  │  📋 Informasi Kapal │       │  📋 Informasi Kapal │      │
│  │  🗓 Kalender        │       └─────────────────────┘      │
│  │  📄 Panduan/SOP     │       (tidak ada kalender/panduan)  │
│  │  📝 Pesan Sekarang  │                                     │
│  └─────────────────────┘                                     │
└──────────────────────────────────────────────────────────────┘
```

### 5.2 Halaman Detail Kapal — Explorer 1 (User-facing)

```
┌──────────────────────────────────────────────────────────────┐
│  NAVBAR: Logo  [Explorer 1 ▼] [Explorer 2 ▼]  [Login]       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────┐  KR Unhas Explorer-1                 │
│  │   [Foto Utama]     │  ⭐ Kapal Riset Oseanografi          │
│  │                    │  📍 Pelabuhan Makassar               │
│  │  ◄ [2] [3] [4] ►  │  💰 Rp 5.000.000 / hari             │
│  └────────────────────┘                                      │
│                                                              │
│  [General] [Alat Kapal] [Fasilitas] [Panduan/SOP]           │
│  ─────────────────────────────────────────────              │
│                                                              │
│  TAB GENERAL:                                                │
│  Deskripsi kapal, spesifikasi teknis (panjang, kapasitas,    │
│  mesin, dll.) dalam format yang mudah dibaca                 │
│                                                              │
│  TAB ALAT KAPAL:                                             │
│  Grid card: [foto alat | nama | keterangan]                  │
│                                                              │
│  TAB FASILITAS:                                              │
│  Grid card: [foto | nama | keterangan]                       │
│                                                              │
│  TAB PANDUAN/SOP:  ← HANYA ada di Explorer 1                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  [Daftar Isi]  │  Konten artikel panduan            │    │
│  │  1. Persyaratan│  scrollable, rendered dari WYSIWYG │    │
│  │  2. Prosedur   │                                    │    │
│  │  3. Biaya      │                                    │    │
│  │  4. Kontak     │                                    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│              [ 🗓 PESAN SEKARANG ]                           │
└──────────────────────────────────────────────────────────────┘
```

### 5.3 Halaman Detail Kapal — Explorer 2 (View Only)

```
┌──────────────────────────────────────────────────────────────┐
│  NAVBAR: Logo  [Explorer 1 ▼] [Explorer 2 ▼]  [Login]       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────┐  KR Unhas Explorer-2                 │
│  │   [Foto Utama]     │  ⭐ Kapal Riset ...                  │
│  │                    │  📍 Pelabuhan Makassar               │
│  │  ◄ [2] [3] [4] ►  │                                      │
│  └────────────────────┘  ╳ TIDAK ada harga sewa              │
│                                                              │
│  [General] [Alat Kapal] [Fasilitas]                         │
│  ─────────────────────────────────  ← TIDAK ada tab Panduan │
│                                                              │
│  TAB GENERAL:                                                │
│  Deskripsi kapal, spesifikasi teknis                         │
│                                                              │
│  TAB ALAT KAPAL:                                             │
│  Grid card: [foto alat | nama | keterangan]                  │
│                                                              │
│  TAB FASILITAS:                                              │
│  Grid card: [foto | nama | keterangan]                       │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ⚠️ Kapal ini saat ini tidak tersedia                │   │
│  │     untuk peminjaman.                                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ╳ TIDAK ADA tombol "Pesan Sekarang"                        │
└──────────────────────────────────────────────────────────────┘
```

### 5.4 Kalender Publik (Explorer 1 Only)

```
┌──────────────────────────────────────────────────────────────┐
│  Ketersediaan Kapal Explorer 1 — Februari 2025              │
│  ◄ Prev                                          Next ►      │
├────┬────┬────┬────┬────┬────┬────────────────────────────────┤
│ Sen│ Sel│ Rab│ Kam│ Jum│ Sab│ Min                            │
├────┴────┴────┴────┴────┴────┴────────────────────────────────┤
│  1    2    3    4    5    6    7                              │
│                                                              │
│  8    9   10   11   12   13   14                             │
│       ████████████████████                                   │
│       Ekspedisi Laut Banda   ← nama kegiatan muncul          │
│                                                              │
│ 15   16   17   18   19   20   21                             │
│       ████████████████████                                   │
│                                                              │
│ 22   23   24 [XX] [XX] [XX]  28  ← [XX] = diblokir admin    │
└──────────────────────────────────────────────────────────────┘

KLIK pada tanggal 9–12 → POPUP:
┌────────────────────────────────┐
│  📅 10 Februari 2025           │
│  ─────────────────────────── │
│  🔵 Ekspedisi Laut Banda       │
│     Oleh: Dr. Budi Santoso     │
│     Departemen: Ilmu Kelautan  │
│     Durasi: 9–16 Feb 2025      │
│  ─────────────────────────── │
│  Status: ✅ Terverifikasi      │
└────────────────────────────────┘

CATATAN PRIVASI: Tampilkan nama kegiatan & dept,
BUKAN nomor HP atau email peminjam.
```

### 5.5 Form Pemesanan (Explorer 1 Only)

```
┌──────────────────────────────────────────────────────────────┐
│  FORM PEMESANAN — KR Unhas Explorer-1                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  INFORMASI PEMESAN                                           │
│  Nama Lengkap:  [Budi Santoso          ] ← auto-fill        │
│  Email:         [budi@unhas.ac.id      ] ← auto-fill        │
│  No. HP:        [08xxxxxxxxxx          ] ← bisa diedit      │
│  Instansi/Unit: [Ilmu Kelautan, FIKP   ]                    │
│                                                              │
│  DETAIL PEMINJAMAN                                           │
│  Nama Kegiatan: [________________________]                   │
│  Tanggal Mulai: [📅 pilih]                                   │
│  Tanggal Selesai: [📅 pilih]                                 │
│                                                              │
│  ┌─────────────────────────────────────────┐                │
│  │  Kalender inline dengan:                │                │
│  │  🔵 = sudah dipesan (disabled)          │                │
│  │  🔴 = diblokir admin (disabled)         │                │
│  │  ⚪ = tersedia (bisa dipilih)           │                │
│  └─────────────────────────────────────────┘                │
│                                                              │
│  RINGKASAN BIAYA                                             │
│  ┌──────────────────────────────────────┐                   │
│  │  Durasi:          5 hari             │                   │
│  │  Harga/hari:      Rp 5.000.000       │                   │
│  │  ─────────────────────────────────  │                   │
│  │  Total:           Rp 25.000.000      │                   │
│  └──────────────────────────────────────┘                   │
│                                                              │
│  Keperluan khusus: [textarea opsional]                       │
│                                                              │
│  ☐ Saya setuju dengan syarat dan ketentuan                   │
│                                                              │
│           [AJUKAN PEMESANAN]                                 │
└──────────────────────────────────────────────────────────────┘
```

### 5.6 Dashboard User — Halaman Pesanan (Explorer 1)

```
┌──────────────────────────────────────────────────────────────┐
│  Pesanan Saya                                                │
├──────────┬───────────────┬─────────────┬───────────────────┤
│  #Kode   │  Tanggal      │  Status     │  Pembayaran       │
│  Pesanan │  Peminjaman   │  Pesanan    │                   │
├──────────┼───────────────┼─────────────┼───────────────────┤
│ PES-0042 │ 15–20 Mar '25 │ ✅ Terverif │ 🔴 Belum Bayar   │
│          │               │             │ [Upload Bukti]    │
├──────────┼───────────────┼─────────────┼───────────────────┤
│ PES-0038 │ 10–16 Feb '25 │ ✅ Terverif │ ✅ Lunas         │
├──────────┼───────────────┼─────────────┼───────────────────┤
│ PES-0035 │ 5–8 Jan '25   │ ❌ Ditolak  │ —                │
└──────────┴───────────────┴─────────────┴───────────────────┘
```

### 5.7 Dashboard Manager

```
┌──────────────────────────────────────────────────────────────┐
│  SIDEBAR          │  MAIN CONTENT                            │
│  ─────────────── │                                          │
│  📊 Dashboard     │  SUMMARY CARDS                          │
│  📋 Pesanan       │  ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  💰 Pembayaran    │  │ Total    │ │ Belum    │ │ Belum   │ │
│  📅 Kalender      │  │Pemasukan │ │ Dikemb.  │ │ Bayar   │ │
│                   │  │Rp 75jt   │ │ 2 pesanan│ │ 3 pes.  │ │
│  🚢 EXPLORER 1   │  └──────────┘ └──────────┘ └─────────┘ │
│     ├ Umum        │                                          │
│     ├ Alat        │  GRAFIK PENYEWAAN (Explorer 1)           │
│     ├ Fasilitas   │  [Pilih range: Bulanan / Tahunan]       │
│     └ Panduan/SOP │  [Bar chart: jumlah/pendapatan per bln] │
│                   │  [Export CSV] [Export PDF]              │
│  � EXPLORER 2   │                                          │
│     ├ Umum        │  PESANAN TERBARU (Explorer 1)            │
│     ├ Alat        │  ┌────────────────────────────────────┐ │
│     └ Fasilitas   │  │ PES-0045 · Andi Pratama             │ │
│  (no Panduan)     │  │ 20–25 Mar 2025                      │ │
│                   │  │ 🟡 Menunggu Verifikasi Pesanan      │ │
│  📈 Laporan       │  │ [Lihat Detail]                      │ │
│                   │  ├────────────────────────────────────┤ │
│                   │  │ PES-0044 · Siti Rahayu             │ │
│                   │  │ 15–18 Mar 2025                      │ │
│                   │  │ 🟠 Menunggu Verifikasi Pembayaran   │ │
│                   │  │ [Lihat Detail]                      │ │
│                   │  └────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### 5.8 Kalender Manager + Blokir Tanggal (Explorer 1 Only)

```
┌──────────────────────────────────────────────────────────────┐
│  KALENDER PEMINJAMAN                    [+ Blokir Tanggal]  │
│  ◄ Feb 2025                                     Mar 2025 ►  │
│                                                              │
│  Sen  Sel  Rab  Kam  Jum  Sab  Min                          │
│                                                              │
│  ████████████████████                                        │
│  PES-0038 · Ekspedisi Laut Banda (Terverifikasi)            │
│                                                              │
│  ░░░░░░  ← DIBLOKIR ADMIN (hover: "Dry dock maintenance")   │
│                                                              │
│  ▒▒▒▒▒▒  ← PENDING (belum terverifikasi, tampil beda)      │
│                                                              │
│  MODAL "Blokir Tanggal":                                     │
│  ┌────────────────────────────────────┐                      │
│  │  Tanggal mulai: [📅]               │                      │
│  │  Tanggal selesai: [📅]             │                      │
│  │  Alasan (opsional): [____________] │                      │
│  │  [Blokir]  [Batal]                 │                      │
│  └────────────────────────────────────┘                      │
└──────────────────────────────────────────────────────────────┘
```

### 5.9 Manager — CRUD Alat/Fasilitas (Kedua Kapal)

```
HALAMAN ALAT KAPAL (Manager)
┌──────────────────────────────────────────────────────────────┐
│  Alat Kapal                              [+ Tambah Alat]    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐  CTD SBE911+                    [✏️] [🗑]      │
│  │  [foto]  │  Instrumen pengukur conductivity,              │
│  │          │  temperature, depth hingga 6800m               │
│  └──────────┘  Kondisi: Baik                                 │
│                                                              │
│  ┌──────────┐  ADCP 150kHz                    [✏️] [🗑]      │
│  │  [foto]  │  Acoustic Doppler Current Profiler...          │
│  └──────────┘                                               │
│                                                              │
└──────────────────────────────────────────────────────────────┘

MODAL TAMBAH/EDIT ALAT:
┌────────────────────────────────────────┐
│  Tambah Alat Kapal                     │
│  ────────────────────────────────────  │
│  Foto: [Drag & drop atau klik upload]  │
│        [Preview foto]                  │
│  Nama Alat: [____________________]     │
│  Keterangan: [textarea]                │
│  Kondisi: [Baik ▼]                     │
│  Catatan tambahan: [textarea]          │
│  [Simpan]  [Batal]                     │
└────────────────────────────────────────┘
```

### 5.10 Manager — WYSIWYG Panduan/SOP (Explorer 1 Only)

```
┌──────────────────────────────────────────────────────────────┐
│  Editor Panduan Peminjaman                                   │
│                                                              │
│  TOOLBAR: B I U | H1 H2 H3 | List | Link | Image | ...     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  # Panduan Tata Cara Peminjaman                      │   │
│  │                                                      │   │
│  │  ## 1. Persyaratan Peminjam                          │   │
│  │  Peminjam harus merupakan civitas akademika...       │   │
│  │                                                      │   │
│  │  ## 2. Prosedur Peminjaman                           │   │
│  │  Langkah 1: Registrasi akun...                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                        [Simpan Panduan]                      │
│                                                              │
│  PREVIEW (Tab):  Daftar Isi auto-generate dari heading H2/H3 │
│  ┌──────────────┬───────────────────────────────────────┐   │
│  │ Daftar Isi   │  Konten dirender dari HTML            │   │
│  │ 1. Persyaratan│                                      │   │
│  │ 2. Prosedur  │                                      │   │
│  │ 3. Pembayaran│                                      │   │
│  └──────────────┴───────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

---

## 6. Logika Bisnis & Status Machine

### 6.1 Status Pesanan

```
                    ┌──────────────────────────────────────┐
                    │          STATUS PESANAN              │
                    └──────────────────────────────────────┘

  [USER SUBMIT]
       │
       ▼
  MENUNGGU_VERIFIKASI_PESANAN
       │
       ├──[Manager Setujui]──► PESANAN_TERVERIFIKASI
       │                              │
       │                              │  [Kirim instruksi bayar ke email]
       │                              │
       │                         USER UPLOAD BUKTI
       │                              │
       │                              ▼
       │                    MENUNGGU_VERIFIKASI_PEMBAYARAN
       │                              │
       │                    ┌─────────┴──────────┐
       │                    ▼                    ▼
       │            [Mgr Setujui]        [Mgr Tolak]
       │                    │                    │
       │                    ▼                    ▼
       │              LUNAS              BUKTI_DITOLAK
       │                                         │
       │                              [User upload ulang]
       │                                         │
       │                         ────────────────┘
       │
       ├──[Manager Tolak]──► PESANAN_DITOLAK
       │
       └──[User Batalkan sebelum terverifikasi]──► DIBATALKAN
```

### 6.2 Status Pembayaran (Terpisah dari Status Pesanan)

```
BELUM_BAYAR
    │
    │ [User upload bukti]
    ▼
MENUNGGU_VERIFIKASI_PEMBAYARAN
    │
    ├──[Manager acc]──► LUNAS
    └──[Manager tolak]──► BUKTI_DITOLAK → kembali ke BELUM_BAYAR
```

**Mengapa dipisah?** Karena laporan keuangan membutuhkan tracking per-dimensi. Status pesanan = logistik. Status pembayaran = keuangan.

### 6.3 Aturan Ketersediaan Tanggal

Tanggal TIDAK TERSEDIA jika:

1. Ada `bookings` dengan `booking_status` IN (`MENUNGGU_VERIFIKASI_PESANAN`, `PESANAN_TERVERIFIKASI`, `LUNAS`) yang overlap dengan tanggal tersebut
2. Ada `blocked_dates` yang dibuat manager yang overlap dengan tanggal tersebut

**Keputusan Desain Kritis:** Apakah tanggal dengan status `MENUNGGU_VERIFIKASI_PESANAN` langsung di-disable untuk user lain? IYA DISABLE

- **Opsi A (Aman):** Ya, langsung disabled → menghindari konflik, tapi bisa ada pesanan pending yang akhirnya ditolak dan tanggal jadi terbuang

### 6.4 Kalkulasi Harga

```
total_harga = harga_per_hari × jumlah_hari
jumlah_hari = (tanggal_selesai - tanggal_mulai) + 1

Contoh: 15 Mar – 20 Mar = 6 hari
```

**Pertanyaan yang harus dijawab sebelum coding:**

- Apakah tanggal_mulai dan tanggal_selesai dihitung inklusif? (Rekomendasi: ya)
- Apakah harga bisa berubah? → bisa

---

## 7. Schema Database & Relasi

### 7.1 ERD (Entity Relationship)

```
users ──────────────────── bookings
  │                            │
  │ (role: manager/admin)      │── payments
  │                            │── booking_dates (derived)
  ▼                            │
user_profiles              vessels
                               │── vessel_photos
                               │── vessel_equipment  ── equipment_photos
                               │── vessel_facilities ── facility_photos
                               │── vessel_guides (1 aktif)
                               └── blocked_dates
```

### 7.2 DDL Lengkap

```sql
-- ============================================================
-- ENUM TYPES
-- ============================================================
CREATE TYPE user_role AS ENUM ('user', 'manager', 'admin', 'super_admin');

CREATE TYPE booking_status AS ENUM (
  'menunggu_verifikasi',
  'terverifikasi',
  'ditolak',
  'dibatalkan',
  'selesai'
);

CREATE TYPE payment_status AS ENUM (
  'belum_bayar',
  'menunggu_verifikasi',
  'lunas',
  'bukti_ditolak'
);

-- ============================================================
-- USERS & AUTH
-- ============================================================
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255),              -- NULL jika pakai SSO only
    full_name       VARCHAR(255) NOT NULL,
    phone           VARCHAR(20),
    institution     VARCHAR(255),              -- instansi/prodi/unit
    role            user_role NOT NULL DEFAULT 'user',
    is_internal     BOOLEAN DEFAULT FALSE,     -- civitas akademika?
    is_active       BOOLEAN DEFAULT TRUE,
    email_verified  BOOLEAN DEFAULT FALSE,
    avatar_url      VARCHAR(500),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- VESSELS (Kapal) — 2 kapal: Explorer 1 (bookable) & Explorer 2 (view-only)
-- ============================================================
CREATE TABLE vessels (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(100) UNIQUE NOT NULL,  -- 'explorer-1', 'explorer-2'
    description     TEXT,                      -- deskripsi umum
    price_per_day   DECIMAL(15,2),             -- NULL jika kapal tidak disewakan
    is_bookable     BOOLEAN DEFAULT FALSE,     -- TRUE = bisa dipinjam (Explorer 1)
    has_guide       BOOLEAN DEFAULT FALSE,     -- TRUE = punya panduan/SOP (Explorer 1)
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vessel_photos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vessel_id       UUID NOT NULL REFERENCES vessels(id) ON DELETE CASCADE,
    url             VARCHAR(500) NOT NULL,
    caption         VARCHAR(255),
    sort_order      INTEGER DEFAULT 0,         -- urutan tampilan
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vessel_equipment (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vessel_id       UUID NOT NULL REFERENCES vessels(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    condition       VARCHAR(100),              -- 'Baik', 'Rusak Ringan', dll
    notes           TEXT,
    sort_order      INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vessel_equipment_photos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_id    UUID NOT NULL REFERENCES vessel_equipment(id) ON DELETE CASCADE,
    url             VARCHAR(500) NOT NULL,
    sort_order      INTEGER DEFAULT 0
);

CREATE TABLE vessel_facilities (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vessel_id       UUID NOT NULL REFERENCES vessels(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    notes           TEXT,
    sort_order      INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vessel_facility_photos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id     UUID NOT NULL REFERENCES vessel_facilities(id) ON DELETE CASCADE,
    url             VARCHAR(500) NOT NULL,
    sort_order      INTEGER DEFAULT 0
);

-- Satu kapal, satu panduan aktif (WYSIWYG disimpan sebagai HTML)
CREATE TABLE vessel_guides (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vessel_id       UUID NOT NULL REFERENCES vessels(id) ON DELETE CASCADE,
    content_html    TEXT NOT NULL,             -- output dari WYSIWYG
    updated_by      UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BLOCKED DATES (Manager blokir tanggal)
-- ============================================================
CREATE TABLE blocked_dates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vessel_id       UUID NOT NULL REFERENCES vessels(id) ON DELETE CASCADE,
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    reason          TEXT,
    blocked_by      UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- ============================================================
-- BOOKINGS (Pesanan)
-- ============================================================
CREATE TABLE bookings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_code    VARCHAR(20) UNIQUE NOT NULL,   -- PES-YYYY-XXXX
    vessel_id       UUID NOT NULL REFERENCES vessels(id),
    user_id         UUID NOT NULL REFERENCES users(id),

    -- Snapshot info pemesan (bisa berubah di profil, ini tetap)
    booker_name     VARCHAR(255) NOT NULL,
    booker_email    VARCHAR(255) NOT NULL,
    booker_phone    VARCHAR(20) NOT NULL,
    booker_institution VARCHAR(255),

    -- Detail peminjaman
    activity_name   VARCHAR(500) NOT NULL,         -- nama kegiatan
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    duration_days   INTEGER NOT NULL,              -- computed

    -- Keuangan (snapshot harga saat booking)
    price_per_day   DECIMAL(15,2) NOT NULL,        -- snapshot!
    total_price     DECIMAL(15,2) NOT NULL,        -- computed

    -- Catatan
    special_notes   TEXT,
    rejection_reason TEXT,                         -- jika ditolak

    -- Status
    booking_status  booking_status NOT NULL DEFAULT 'menunggu_verifikasi',
    payment_status  payment_status NOT NULL DEFAULT 'belum_bayar',

    -- Audit
    verified_by     UUID REFERENCES users(id),
    verified_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_booking_dates CHECK (end_date >= start_date)
);

-- Index untuk cek ketersediaan
CREATE INDEX idx_bookings_vessel_dates
ON bookings(vessel_id, start_date, end_date)
WHERE booking_status NOT IN ('ditolak', 'dibatalkan');

-- ============================================================
-- PAYMENTS (Pembayaran)
-- ============================================================
CREATE TABLE payments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id      UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    amount          DECIMAL(15,2) NOT NULL,
    proof_url       VARCHAR(500),              -- URL bukti transfer
    notes_user      TEXT,                     -- catatan dari user
    notes_manager   TEXT,                     -- catatan verifikasi
    verified_by     UUID REFERENCES users(id),
    verified_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
-- Satu booking bisa punya beberapa record payment (karena bisa ditolak & upload ulang)

-- ============================================================
-- NOTIFICATIONS LOG
-- ============================================================
CREATE TABLE notification_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    booking_id      UUID REFERENCES bookings(id),
    type            VARCHAR(100) NOT NULL,         -- 'booking_created', 'payment_rejected', dll
    email_to        VARCHAR(255) NOT NULL,
    subject         VARCHAR(500),
    sent_at         TIMESTAMPTZ,
    is_sent         BOOLEAN DEFAULT FALSE,
    error_message   TEXT
);
```

### 7.3 Relasi Visual

```
users (1) ──────────── (N) bookings
                              │
                              │ (1)──── (N) payments
                              │
vessels (1) ────────── (N) bookings
  │
  ├── (1:N) vessel_photos
  ├── (1:N) vessel_equipment ─── (1:N) vessel_equipment_photos
  ├── (1:N) vessel_facilities ── (1:N) vessel_facility_photos
  ├── (1:1) vessel_guides
  └── (1:N) blocked_dates
```

### 7.4 Query Kritis: Cek Ketersediaan Tanggal

```sql
-- Apakah tanggal X s/d Y tersedia untuk vessel V?
SELECT COUNT(*) as conflicting
FROM bookings
WHERE vessel_id = :vessel_id
  AND booking_status NOT IN ('ditolak', 'dibatalkan')
  AND start_date <= :requested_end_date
  AND end_date >= :requested_start_date;

-- + cek blocked dates
SELECT COUNT(*) as blocked
FROM blocked_dates
WHERE vessel_id = :vessel_id
  AND start_date <= :requested_end_date
  AND end_date >= :requested_start_date;

-- Jika keduanya = 0, tanggal TERSEDIA
```

### 7.5 Generate Booking Code

```sql
-- Format: PES-2025-0001
CREATE OR REPLACE FUNCTION generate_booking_code()
RETURNS VARCHAR AS $$
DECLARE
  year_part TEXT := TO_CHAR(NOW(), 'YYYY');
  seq_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(
    CAST(SPLIT_PART(booking_code, '-', 3) AS INTEGER)
  ), 0) + 1
  INTO seq_num
  FROM bookings
  WHERE booking_code LIKE 'PES-' || year_part || '-%';

  RETURN 'PES-' || year_part || '-' || LPAD(seq_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;
```

---

## 8. Sistem Notifikasi Email

### 8.1 Trigger Email Matrix

| Event | Penerima | Isi Email |
| --- | --- | --- |
| User buat pesanan | User | Konfirmasi pesanan dibuat, nomor PES-XXXX |
| User buat pesanan | Manager | Ada pesanan baru menunggu verifikasi |
| Manager verifikasi pesanan | User | ✅ Terverifikasi + instruksi pembayaran |
| Manager tolak pesanan | User | ❌ Ditolak + alasan |
| User upload bukti bayar | Manager | Ada bukti pembayaran menunggu verifikasi |
| Manager acc pembayaran | User | ✅ Pembayaran lunas, pesanan dikonfirmasi |
| Manager tolak bukti bayar | User | ❌ Bukti ditolak + alasan + minta upload ulang |
| Manager blokir tanggal | — | (tidak perlu notif) |
| H-3 sebelum peminjaman | User | Pengingat: peminjaman 3 hari lagi |

### 8.2 Template Email Bukti Bayar Ditolak (Contoh)

```
Subjek: [Penyewaan Kapal] Bukti Pembayaran Anda Ditolak — PES-2025-0042

Yth. Budi Santoso,

Kami informasikan bahwa bukti pembayaran untuk pesanan berikut
tidak dapat kami verifikasi:

Nomor Pesanan : PES-2025-0042
Kegiatan      : Survei Oseanografi Laut Banda
Tanggal       : 15 – 20 Maret 2025
Total Tagihan : Rp 25.000.000

Alasan Penolakan:
"Nominal pada bukti transfer tidak sesuai. Terima kiriman sebesar
Rp 20.000.000, seharusnya Rp 25.000.000."

Silakan upload ulang bukti pembayaran yang sesuai melalui tautan berikut:
→ [UPLOAD BUKTI PEMBAYARAN]

Batas waktu pembayaran: 25 Februari 2025 pukul 23:59 WIB

Jika ada pertanyaan, hubungi kami di ukk@unhas.ac.id

Salam,
Unit Kapal Riset Universitas Hasanuddin
```

---

## 9. Edge Cases & Hal Kritis yang Sering Terlewat

### 9.1 Race Condition Double Booking

**Masalah:** Dua user submit pesanan di tanggal sama dalam waktu bersamaan (keduanya lolos cek “tersedia”).

**Solusi:** Gunakan database-level locking:

```sql
-- Saat insert booking, gunakan SELECT FOR UPDATE
BEGIN;
SELECT id FROM vessels WHERE id = :vessel_id FOR UPDATE;
-- lakukan cek konflik
-- jika aman, INSERT booking
COMMIT;
```

Atau: Unique constraint dengan PostgreSQL `EXCLUDE USING`.

### 9.2 Harga Berubah Setelah Booking Dibuat

**Masalah:** Manager ubah `price_per_day`, total di booking lama ikut berubah.

**Solusi:** Sudah diatasi dengan `snapshot` harga di tabel bookings (kolom `price_per_day` dan `total_price` di tabel bookings adalah nilai saat booking dibuat).

### 9.3 User Ubah Profil Setelah Booking

**Masalah:** User ganti nama/email, data pesanan ikut berubah.

**Solusi:** Sudah diatasi dengan `snapshot` booker di tabel bookings.

### 9.4 Batas Waktu Pembayaran

**Masalah:** Pesanan terverifikasi tapi user tidak pernah bayar → tanggal terblokir selamanya.

**Solusi:** Tambahkan `payment_deadline` di bookings. Scheduled job (cron) jalankan setiap hari:

```sql
UPDATE bookings
SET booking_status = 'dibatalkan',
    rejection_reason = 'Batas waktu pembayaran terlewat (otomatis)'
WHERE booking_status = 'terverifikasi'
  AND payment_status = 'belum_bayar'
  AND payment_deadline < NOW();
```

### 9.5 Manager Hapus Alat yang Ada di Booking Aktif

**Masalah:** Tidak relevan langsung (karena booking tidak referens alat), tapi perlu dipikirkan untuk audit.

**Solusi:** Gunakan soft-delete (`deleted_at`) untuk equipment dan facilities, bukan hard-delete.

### 9.6 Kalender Publik — Berapa Banyak Info yang Ditampilkan?

**Keputusan desain:** Tampilkan nama kegiatan + departemen, tapi TIDAK tampilkan nama lengkap peminjam individual, email, atau nomor HP di kalender publik. Data personal hanya terlihat oleh manager/admin.

### 9.7 Concurrent Upload Bukti Bayar

**Masalah:** User klik upload dua kali.

**Solusi:** Disable tombol setelah klik, dan batasi status payment ke satu record `menunggu_verifikasi` aktif.

### 9.8 WYSIWYG XSS

**Masalah:** Manager input HTML berbahaya lewat editor panduan.

**Solusi:** Sanitize HTML output dengan library (DOMPurify di frontend, bleach di backend) sebelum disimpan ke database.

### 9.9 File Upload Security

- Validasi: hanya terima JPG, PNG, PDF
- Scan MIME type dari binary (bukan hanya ekstensi)
- Batasi ukuran: max 5MB per file
- Simpan di private storage (S3/MinIO), serve via signed URL

---

## 10. Tech Stack Rekomendasi

### Opsi A: Laravel + Vue (Cocok untuk Tim PHP)

| Layer | Teknologi |
| --- | --- |
| Frontend | Vue 3 + Inertia.js + Tailwind CSS |
| Backend | Laravel 11 |
| Database | PostgreSQL |
| File Storage | MinIO / AWS S3 |
| Email | Laravel Mail + Mailtrap (dev) / SMTP kampus (prod) |
| Queue | Laravel Queue + Redis |
| Kalender | FullCalendar.io |
| WYSIWYG | TipTap atau Quill.js |
| Auth | Laravel Breeze / Fortify |

### Opsi B: Next.js + FastAPI (Cocok untuk Tim JS/Python)

| Layer | Teknologi |
| --- | --- |
| Frontend | Next.js 14 + TypeScript + Tailwind CSS |
| Backend | FastAPI (Python) |
| Database | PostgreSQL + SQLAlchemy |
| File Storage | MinIO / Cloudflare R2 |
| Email | Resend / SendGrid |
| Queue | Celery + Redis |
| Kalender | FullCalendar.io / react-big-calendar |
| WYSIWYG | TipTap |
| Auth | NextAuth.js + JWT |

**Rekomendasi berdasarkan konteks universitas:** Opsi A (Laravel) lebih mudah di-maintain oleh tim mahasiswa yang berganti setiap tahun karena Laravel ekosistem PHP yang well-documented.

---

## 11. Roadmap & Prioritas Fitur

### Fase 1 — MVP (3–4 bulan)

- [ ]  Auth (register, login, profil)
- [ ]  2 Kapal: Explorer 1 (bookable) & Explorer 2 (view-only)
- [ ]  Navbar dropdown: Explorer 1 & Explorer 2
- [ ]  Halaman detail Explorer 1 (4 tab: General, Alat, Fasilitas, Panduan/SOP)
- [ ]  Halaman detail Explorer 2 (3 tab: General, Alat, Fasilitas — no Panduan)
- [ ]  Kalender ketersediaan Explorer 1 (user-facing, read-only)
- [ ]  Form pemesanan Explorer 1
- [ ]  Dashboard user (lihat & kelola pesanan Explorer 1)
- [ ]  Manager: verifikasi pesanan & pembayaran (Explorer 1)
- [ ]  Manager: blokir tanggal (Explorer 1)
- [ ]  Notifikasi email (semua trigger)
- [ ]  Manager: CRUD alat & fasilitas (KEDUA kapal)
- [ ]  Manager: edit info umum kapal (KEDUA kapal)

### Fase 2 — Penguatan (1–2 bulan)

- [ ]  Manager: WYSIWYG panduan/SOP (Explorer 1 only)
- [ ]  Dashboard Manager: grafik & laporan
- [ ]  Export laporan CSV/PDF
- [ ]  Kalender manager (drag-drop blokir)
- [ ]  Reminder email otomatis (H-3)
- [ ]  Batas waktu pembayaran otomatis
- [ ]  Super admin: manajemen user & role

### Fase 3 — Enhancement (nice-to-have)

- [ ]  Payment gateway (otomatis)
- [ ]  Explorer 2 menjadi bookable (jika kapal siap)
- [ ]  SSO kampus (LDAP/Shibboleth)
- [ ]  Manifest penumpang
- [ ]  Log pelayaran & BBM

---

## 12. Checklist Sebelum Mulai Coding

### Keputusan Bisnis yang Harus Dijawab Dulu

- [ ]  Apakah sistem untuk internal kampus only, atau juga external?
- [ ]  Berapa harga sewa per hari? Apakah ada tarif berbeda (internal vs eksternal)?
- [ ]  Berapa lama batas waktu pembayaran setelah pesanan terverifikasi?
- [ ]  Apakah ada deposit atau biaya lain selain sewa?
- [ ]  Bolehkah user batalkan pesanan sendiri? Sampai tahap apa?
- [ ]  Apakah ada minimum/maksimum durasi sewa?
- [ ]  Informasi apa saja yang boleh tampil di kalender publik?
- [ ]  Apakah perlu approval 2 tahap (dept head + manager) atau cukup 1 tahap?

### Keputusan Teknis yang Harus Dijawab Dulu

- [ ]  Hosting: on-premise server kampus atau cloud?
- [ ]  Domain yang akan digunakan?
- [ ]  Email SMTP: pakai server kampus atau layanan (SendGrid, Resend)?
- [ ]  File storage: server sendiri atau cloud storage?
- [ ]  Apakah akan ada SSO kampus? Kalau ya, protokolnya apa (LDAP, SAML, OAuth)?
- [ ]  Framework/bahasa yang tim paling familiar?
- [ ]  Berapa orang di tim dan apa role mereka?

### Hal Teknis yang Jangan Sampai Terlewat di Awal

- [ ]  Setup environment: dev, staging, production
- [ ]  Git workflow & branching strategy
- [ ]  Backup database otomatis
- [ ]  Error monitoring (Sentry atau sejenisnya)
- [ ]  Logging aksi penting (audit trail)
- [ ]  HTTPS / SSL Certificate
- [ ]  Rate limiting di endpoint kritis
- [ ]  Testing strategy (minimal: feature test untuk booking flow)

---

*Dokumen ini adalah living document. Update setiap ada keputusan baru terkait requirement atau arsitektur.*