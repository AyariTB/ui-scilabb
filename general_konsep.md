# Penjelasan Projek Saat Ini

Created: March 8, 2026 9:33 AM

Secara keseluruhan, proyek merupakan **Platform Layanan Riset Unhas**. Ini adalah sebuah sistem informasi berbasis web berskala besar (enterprise) yang dirancang untuk mendigitalisasi, mempusatkan, dan mengotomatisasi seluruh proses manajemen pemesanan layanan riset di Universitas Hasanuddin (Unhas).

Berikut adalah penjelasan rincinya, dari identitas proyek, pengguna, fitur perlalaman, hingga alur bisnisnya.

---

### **1. Identitas & Tujuan Sistem**

Sistem ini dibuat untuk mempertemukan dua sisi:

- **Pihak Klien:** Mahasiswa, dosen, peneliti (baik internal kampus maupun eksternal/umum) yang membutuhkan layanan lab, meminjam alat, atau menyewa kapal riset.
- **Pihak Universitas:** Para kepala laboratorium, pengelola layanan mandiri (SAS), manajer kapal, dan admin pusat yang mengelola dan memverifikasi pesanan serta mengawasi aset Universitas.

**Tujuannya:** Menggantikan proses manual/paper-based menjadi full-digital. Mulai dari melihat katalog layanan, mengecek ketersediaan kapal via kalender, memesan, perhitungan harga otomatis (beda harga untuk internal vs eksternal), hingga proses verifikasi bertingkat dan konfirmasi pembayaran.

---

### **2. Aktor dalam Sistem (Role & Akses)**

Sistem ini menggunakan satu pintu login (satu tabel `users`), namun membagi akses pengguna ke dalam 6 peran (role) yang memiliki dashboard/portal masing-masing:

1. **Guest (Tamu):** Pengunjung web biasa. Bisa melihat beranda, mencari layanan, melihat profil laboratorium, detail alat, dan mengecek kalender kapal. Tidak bisa memesan.
2. **Client / User:** Pemesan layanan. Mereka harus mendaftar dan melengkapi identitas (upload KTP/KTM) serta status (internal/eksternal). Mereka bisa memesan layanan, melihat riwayat pesanan, dan mengunggah bukti pembayaran.
3. **Head of Lab (Kepala Lab):** Bertanggung jawab atas 1 laboratorium tertentu. Mereka hanya bisa mengelola pesanan yang masuk ke lab-nya dan mengelola inventaris alat di lab-nya.
4. **Head of SAS (Kepala Layanan Mandiri):** Bertanggung jawab memonitor formulir khusus (Stand-Alone Service) yang diisi oleh klien.
5. **Manager Kapal:** Mengelola aset "Explorer-1" dan "Explorer-2" (Kapal Riset). Menerima/menolak sewa kapal dan memblokir tanggal ketersediaan.
6. **Admin / Super Admin:** Mengelola keseluruhan master data (CRUD Lab, CRUD Layanan, menambah pengguna, membuat artikel, mengatur formulir dinamis SAS, dan memantau seluruh transaksi keuangan).

---

### **3. Tiga Modul Utama Sistem**

Proyek ini dibagi menjadi 3 pilar layanan utama:

### **A. Modul Laboratorium & Alat**

- **Katalog Publik:** Daftar semua lab di universitas, dibagi per fakultas. User bisa melihat deskripsi lab, daftar layanan (beserta harga internal/eksternal yang berbeda), dan daftar alat lengkap dengan spesifikasinya.
- **Sistem Keranjang (Cart):** User dapat memilih beberapa layanan sekaligus dari sebuah lab, menentukan jumlah sampel, menentukan tanggal, lalu mengirimkan permintaan (Submit).

### **B. Modul Stand-Alone Service (SAS) / Layanan Mandiri**

Ini adalah modul khusus untuk layanan yang tidak masuk ke lab, melainkan berupa **Formulir Dinamis**.

- **Admin System:** Admin bisa merakit formulir (seperti Google Forms). Admin bebas menambahkan field berupa: Teks, Upload Gambar, atau Pilihan Ganda.
- **Client System:** User melihat SAS ini, mengeklik "Isi Formulir", dan form akan di-render sesuai racikan Admin secara dinamis.
- Setelah disubmit, jawabannya masuk ke portal **Head of SAS** untuk diperiksa.

### **C. Modul Kapal Riset (Explorer-1 & Explorer-2)**

- Diperuntukkan bagi peneliti yang ingin menyewa kapal.
- **Fasilitas & Alat Kapal:** Kapal memiliki data inventaris peralatannya sendiri.
- **Kalender Ketersediaan:** Terdapat sistem Kalender Pintar. User bisa melihat tanggal berapa saja kapal sedang disewa atau diblokir (maintenance), dan tanggal mana yang kosong.
- Editor Panduan/SOP Kapal (Teks lengkap / Editor WYSIWYG) khusus Explorer-1.

---

### **4. Alur Bisnis (Proses yang Berjalan)**

Agar lebih jelas, ini rentetan kejadian jika seseorang memesan di dalam sistem:

### **Alur 1: Memesan Layanan Laboratorium (Yang Terkompleks)**

1. **Pesan:** User login, masuk ke detail Layanan, memasukkan kuantitas (misal: 5 sampel uji lab).
2. **Dihitung Sistem:** Sistem otomatis mengecek apakah User dari dalam kampus atau luar kampus. Harga dikalikan otomatis sesuai statusnya.
3. **Validasi Kepala Lab (Status: Menunggu):** Pesanan masuk ke Dashboard Kepala Lab. Kepala Lab akan mereview. Kepala Lab bisa **Menyetujui** atau **Menolak** (wajib beri alasan). *Catatan: Kepala Lab bisa menolak sebagian item, dan menyetujui sebagian item lainnya.*
4. **Pembayaran (Status: Terverifikasi):** Jika disetujui, User dapat notifikasi untuk membayar dan nilai total akhirnya berapa.
5. **Upload Bukti:** User transfer ke rekening/VA lab, lalu foto struknya dan diupload ke website.
6. **Konfirmasi Final (Status: Selesai):** Kepala Lab mengecek foto struk. Jika uang masuk, Kepala lab klik "Lunas". Selesai.

### **Alur 2: Memesan Kapal Riset**

1. **Pilih Tanggal:** User masuk ke halaman Kapal, membuka kalender interaktif. Hari yang merah tidak bisa diklik. User memblok jarak tanggal (misal 10-12 Maret).
2. **Kirim Proposal:** User mengisi tujuan penggunan dan mengupload dokumen izin.
3. **Lock Transient:** Sesaat setelah user memesan, tanggal tersebut *otomatis terkunci* agar tidak dipesan orang lain (cegah *Double Booking*).
4. **Verifikasi Manager:** Manager kapal mengecek izin. Jika Ditolak, tanggal di kalender akan hijau kembali. Jika Disetujui, lanjut ke tahap pembayaran (mirip alur Lab).

---

### **5. Detail Fitur Per Portal Dashboard**

Agar terorganisir, sistem membagi tampilan (UI) menjadi beberapa area:

- **Halaman Depan (Homepage):** Landing page aesthetic, pencarian global (Global Search engine untuk artikel, lab, sas, alat), daftar artikel/berita kampus, info lengkap lab/kapal.
- **Halaman User (Client):** Pengaturan identitas KTP/KTM, tabel riwayat pesanan (semua history pemesanan), pelacakan status (Status Timeline bar), tombol upload bukti transfer.
- **Portal Kepala Lab:** Menampilkan daftar pesanan *hanya* untuk lab-nya, grafik sederhana pesanan masuk hari ini, tombol untuk update status alat (Rusak, Tersedia), dan tabel untuk menolak/ACC pesanan.
- **Portal Admin Utama:** Memegang seluruh kendali. Punya fitur **CRUD (Create, Read, Update, Delete)** untuk:
    - Manajemen Data Laboratorium & Fakultas
    - Manajemen Data Layanan (Set harga internal/eksternal)
    - Pembuat Artikel Berita (menggunakan Rich Text Editor / Tiptap)
    - Merakit form SAS.
    - Mem-Banned User / Mengganti Role User (menunjuk seseorang jadi kepala lab).
    - Laporan Transaksi / Keuangan menyeluruh semua lab.

---

### **6. Arsitektur / Tech Stack Proyek Ini**

Sistem ini dirancang sangat modern dan performa tinggi untuk standar enterprise kampus:

- **Backend:** Laravel 12 (PHP) — Mengatur segala logika keamanan, cek bentrok tanggal kalender, manajemen antrean (queue), dan koneksi database.
- **Frontend / UI:** React 19 (ditulis dengan bahasa TypeScript yang ketat tipe) + Inertia.js untuk komunikasi data tanpa reload.
- **Styling:** Tailwind CSS + Radix UI (shadcn/ui) untuk membuat tampilan yang sangat premium, komponen interaktif seperti pop-up pembayaran, tanggal, dan tabel.
- **Database:** PostgreSQL — Dipilih karena kehebatannya dalam menangani bentrok jangkauan tanggal (untuk booking kapal) dan pencarian data kompleks.

**Kesimpulan:** Sistem ini bukan sekadar website company profile. Ini adalah **Sistem Enterprise Resource Planning (ERP) mikro berfokus pada e-Commerce layanan/aset/riset** yang mencakup etalase, engine perhitungan harga dinamis otomatis (internal/eksternal), engine penanggalan kapal untuk mencegah double-booking, serta workflow (alur status) pemesanan terpusat dari request hingga "Uang Diterima".