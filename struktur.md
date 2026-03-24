# Refactor

Created: March 6, 2026 7:48 PM

[REBUILD_BLUEPRINT](https://www.notion.so/REBUILD_BLUEPRINT-31b90e76722f8042936ce4acf0389f7b?pvs=21)

# 🏛️ Blueprint Rebuild — Platform Layanan Riset Unhas

> **Versi:** 2.0 — Full Platform (semua modul)
**Dibuat:** Maret 2026
> 
> 
> Dokumen ini adalah panduan resmi rebuild dari nol untuk seluruh platform,
> mencakup semua modul yang ada: Laboratorium, Layanan Mandiri (SAS),
> Kapal Riset, Artikel, dan semua dashboard-nya.
> 

---

## Daftar Isi

1. [Peta Sistem — Semua Modul](about:blank#1-peta-sistem--semua-modul)
2. [Semua Aktor & Role](about:blank#2-semua-aktor--role)
3. [Tech Stack](about:blank#3-tech-stack)
4. [Struktur Folder](about:blank#4-struktur-folder)
5. [Arsitektur & Alur Data](about:blank#5-arsitektur--alur-data)
6. [Roadmap 16 Minggu](about:blank#6-roadmap-16-minggu)
7. [Konvensi Kode & Tim](about:blank#7-konvensi-kode--tim)
8. [Hal Kritis yang Harus Diperhatikan](about:blank#8-hal-kritis-yang-harus-diperhatikan)
9. [Checklist Pre-Launch](about:blank#9-checklist-pre-launch)

---

## 1. Peta Sistem — Semua Modul

Platform ini adalah **sistem manajemen layanan riset universitas** dengan 5 modul utama:

```
PLATFORM LAYANAN RISET UNHAS
│
├── 🌐 PUBLIC / HOMEPAGE
│   ├── Landing page (ringkasan semua layanan)
│   ├── Pencarian global (lab, layanan, alat)
│   ├── Daftar & Detail Laboratorium
│   ├── Daftar & Detail Layanan Lab (per lab)
│   ├── Daftar & Detail Layanan Mandiri (SAS)
│   ├── Daftar & Detail Artikel/Berita
│   ├── Halaman Kapal Riset (Explorer-1 & Explorer-2)
│   └── Auth: Login, Register, Lupa Password
│
├── 👤 USER PORTAL (auth: client)
│   ├── Profil & pengaturan akun
│   ├── Riwayat pesanan layanan lab
│   ├── Detail pesanan + upload bukti bayar
│   ├── Pengajuan Layanan Mandiri (isi form SAS)
│   └── Pesanan kapal riset (Explorer-1)
│
├── 🔬 LABORATORY PORTAL (auth: head_of_lab)
│   ├── Dashboard ringkasan pesanan
│   ├── Manajemen pesanan (verifikasi, tolak, konfirmasi bayar)
│   ├── Manajemen alat laboratorium (CRUD)
│   └── Profil akun kepala lab
│
├── 📋 SAS PORTAL (auth: head_of_sas)
│   ├── Daftar submission forum SAS
│   ├── Detail jawaban submission per user
│   └── Profil akun
│
├── 🚢 VESSEL MANAGER PORTAL (auth: manager)
│   ├── Dashboard ringkasan kapal
│   ├── Manajemen pesanan kapal Explorer-1
│   ├── Verifikasi pembayaran kapal
│   ├── Kalender & blokir tanggal (Explorer-1)
│   ├── CRUD alat & fasilitas (kedua kapal)
│   ├── Edit info kapal (kedua kapal)
│   ├── WYSIWYG panduan/SOP (Explorer-1 only)
│   └── Laporan & export
│
└── ⚙️ ADMIN DASHBOARD (auth: admin / super_admin)
    ├── Dashboard statistik & grafik
    ├── Manajemen Laboratorium (CRUD)
    ├── Manajemen Layanan per Lab (CRUD)
    ├── Manajemen Alat per Lab (CRUD)
    ├── Manajemen Layanan Mandiri / SAS (CRUD)
    ├── Manajemen Forum SAS (CRUD)
    ├── Manajemen Artikel & Berita (CRUD, WYSIWYG)
    ├── Manajemen Pengguna (CRUD, atur role)
    ├── Semua Pesanan Layanan Lab (read + aksi)
    └── Semua Transaksi (laporan keuangan)
```

---

## 2. Semua Aktor & Role

| Role | Guard | Deskripsi | Akses Utama |
| --- | --- | --- | --- |
| **Guest** | — | Pengunjung tanpa akun | Baca semua halaman publik |
| **Client / User** | `client` | Peminjam layanan (mhs, dosen, peneliti) | Pesan layanan lab, isi SAS, pesan kapal, lihat pesanan sendiri |
| **Head of Lab** | `head_of_lab` | Kepala laboratorium | Kelola pesanan & alat di labnya sendiri |
| **Head of SAS** | `head_of_sas` | Pengelola Layanan Mandiri | Kelola submission SAS forum |
| **Manager** | `manager` | Pengelola kapal riset | Semua hal tentang kapal (Explorer-1 & 2) |
| **Admin** | `admin` | Administrator sistem | Semua modul kecuali pengaturan sistem |
| **Super Admin** | `admin` | Admin tertinggi | Semua akses termasuk manajemen admin |

> **Catatan Desain:** Semua role menggunakan **tabel `users` yang sama**. Perbedaan akses dikontrol oleh kolom `role` (string/enum) + middleware `EnsureRole`. Tidak perlu 7 tabel user yang berbeda.
> 

---

## 3. Tech Stack

### Ringkasan

```
┌──────────────────────────────────────────────────────────┐
│                    TECH STACK FINAL                       │
├─────────────────────┬────────────────────────────────────┤
│ Backend Framework   │ Laravel 12 (PHP 8.3)               │
│ Frontend Framework  │ React 19 + TypeScript 5            │
│ SSR Bridge          │ Inertia.js v2                      │
│ Build Tool          │ Vite 6                              │
│ CSS Framework       │ TailwindCSS v4                     │
│ UI Components       │ shadcn/ui (Radix UI base)          │
│ Form Validation     │ React Hook Form + Zod              │
│ Server State        │ TanStack Query v5                  │
│ Client State        │ Zustand v5                         │
│ Calendar/Booking    │ FullCalendar v6                    │
│ Rich Text Editor    │ Tiptap v2                          │
│ Charts              │ Recharts                           │
│ Primary Database    │ PostgreSQL 16                      │
│ Cache & Queue       │ Redis 7 + Laravel Horizon          │
│ File Storage        │ Cloudflare R2 (S3-compatible)      │
│ Email Service       │ Resend.com + Laravel Mail          │
│ Error Monitoring    │ Sentry                             │
│ Backend Testing     │ Pest PHP v3                        │
│ Frontend Testing    │ Vitest + React Testing Library     │
│ E2E Testing         │ Playwright                         │
│ CI/CD               │ GitHub Actions                     │
│ Containerization    │ Docker + Docker Compose            │
│ Hosting             │ Railway.app (atau VPS)             │
└─────────────────────┴────────────────────────────────────┘
```

### Mengapa Masing-masing Dipilih

### PostgreSQL (bukan MySQL)

Domain ini punya banyak query berbasis **date range** (pesanan lab, pemesanan kapal, kalender). PostgreSQL punya operator range native yang jauh lebih efisien, ENUM type native, dan constraint `EXCLUDE USING` untuk mencegah overlap booking di level database.

### TypeScript (bukan JavaScript)

Proyek ini punya **business logic yang kompleks**: multiple status state machine (pesanan lab, SAS, kapal), perhitungan harga internal/eksternal, multi-role access. TypeScript menghilangkan seluruh kelas bug yang hanya ketahuan saat runtime.

### TanStack Query (bukan Axios manual)

Menggantikan pola Axios manual yang ada — cache otomatis, deduplikasi request, loading/error state konsisten, background refetch. Cocok untuk dashboard yang membutuhkan data real-time.

### shadcn/ui (bukan Material Tailwind)

Headless — kita miliki sepenuhnya kodenya, tidak tergantung library version. Dapat dikustomisasi penuh sesuai brand universitas. Lebih accessible (Radix UI base).

### Cloudflare R2 (bukan local storage)

File upload saat ini (identitas, bukti bayar, foto lab, foto alat, foto kapal) disimpan lokal — **hilang saat server restart atau redeploy**. R2 gratis 10GB, S3-compatible, CDN bawaan.

---

## 4. Struktur Folder

```
platform-riset-unhas/
│
├── 📁 app/
│   │
│   ├── 📁 Domain/                        # Business Logic (framework-agnostic)
│   │   ├── 📁 Laboratory/
│   │   │   ├── LabOrderService.php       # Logika verifikasi, state pesanan lab
│   │   │   └── OrderStatus.php           # PHP Enum: wait, verified, done, rejected
│   │   ├── 📁 StandaloneService/
│   │   │   └── SASSubmissionService.php  # Logika submit & validasi forum SAS
│   │   ├── 📁 Vessel/
│   │   │   ├── VesselBookingService.php  # Logika booking kapal, cegah double booking
│   │   │   ├── CalendarService.php       # Hitung tanggal tidak tersedia
│   │   │   └── BookingStatus.php         # PHP Enum: menunggu, terverifikasi, dll
│   │   └── 📁 Notification/
│   │       └── NotificationService.php   # Centralized email dispatch
│   │
│   ├── 📁 Http/
│   │   ├── 📁 Controllers/
│   │   │   ├── 📁 Public/                # Halaman publik tanpa auth
│   │   │   │   ├── HomeController.php
│   │   │   │   ├── LabController.php
│   │   │   │   ├── ServiceController.php
│   │   │   │   ├── SASController.php
│   │   │   │   ├── ArticleController.php
│   │   │   │   └── VesselController.php
│   │   │   ├── 📁 User/                  # Client auth
│   │   │   │   ├── ProfileController.php
│   │   │   │   ├── LabOrderController.php
│   │   │   │   ├── SASSubmissionController.php
│   │   │   │   └── VesselBookingController.php
│   │   │   ├── 📁 HeadOfLab/             # Kepala Lab auth
│   │   │   │   ├── LabDashboardController.php
│   │   │   │   ├── LabOrderManagementController.php
│   │   │   │   └── LabToolController.php
│   │   │   ├── 📁 HeadOfSAS/             # Kepala SAS auth
│   │   │   │   └── SASForumManagementController.php
│   │   │   ├── 📁 Manager/               # Manager kapal auth
│   │   │   │   ├── VesselDashboardController.php
│   │   │   │   ├── VesselBookingManagementController.php
│   │   │   │   ├── VesselPaymentController.php
│   │   │   │   ├── VesselCalendarController.php
│   │   │   │   ├── VesselInfoController.php
│   │   │   │   ├── VesselEquipmentController.php
│   │   │   │   ├── VesselFacilityController.php
│   │   │   │   ├── VesselGuideController.php
│   │   │   │   └── VesselReportController.php
│   │   │   ├── 📁 Admin/                 # Admin & Super Admin auth
│   │   │   │   ├── AdminDashboardController.php
│   │   │   │   ├── AdminLabController.php        # CRUD lab
│   │   │   │   ├── AdminServiceController.php    # CRUD layanan lab
│   │   │   │   ├── AdminToolController.php       # CRUD alat lab
│   │   │   │   ├── AdminSASController.php        # CRUD layanan mandiri
│   │   │   │   ├── AdminSASForumController.php   # CRUD forum SAS
│   │   │   │   ├── AdminArticleController.php    # CRUD artikel
│   │   │   │   ├── AdminUserController.php       # CRUD pengguna & role
│   │   │   │   ├── AdminOrderController.php      # Lihat semua pesanan
│   │   │   │   └── AdminTransactionController.php
│   │   │   └── 📁 Auth/
│   │   │       └── AuthController.php
│   │   │
│   │   ├── 📁 Middleware/
│   │   │   ├── EnsureRole.php            # Middleware generic: EnsureRole::class('admin')
│   │   │   └── HandleInertiaRequests.php # Share auth + role ke semua halaman
│   │   │
│   │   └── 📁 Requests/                  # Form Request Validation (WAJIB semua input)
│   │       ├── 📁 Lab/
│   │       │   ├── StoreLabRequest.php
│   │       │   ├── StoreServiceRequest.php
│   │       │   └── ServiceSubmissionRequest.php
│   │       ├── 📁 SAS/
│   │       │   ├── StoreSASRequest.php
│   │       │   └── SASSubmissionRequest.php
│   │       ├── 📁 Vessel/
│   │       │   ├── StoreVesselBookingRequest.php
│   │       │   └── UploadBookingPaymentRequest.php
│   │       └── 📁 User/
│   │           └── UpdateProfileRequest.php
│   │
│   ├── 📁 Models/
│   │   ├── User.php
│   │   ├── Faculty.php                   # ref_faculties
│   │   ├── Lab.php                       # laboratoriums
│   │   ├── Service.php                   # layanan per lab
│   │   ├── Tool.php                      # alat per lab atau kapal
│   │   ├── CartOrder.php                 # keranjang order lab
│   │   ├── Order.php                     # item dalam cart_order
│   │   ├── OrderEvent.php                # riwayat status order
│   │   ├── StandaloneService.php         # layanan mandiri
│   │   ├── SASForum.php                  # form dinamis per SAS
│   │   ├── SASForumAnswer.php            # jawaban user per field form
│   │   ├── Article.php
│   │   ├── Vessel.php
│   │   ├── VesselPhoto.php
│   │   ├── VesselEquipment.php
│   │   ├── VesselEquipmentPhoto.php
│   │   ├── VesselFacility.php
│   │   ├── VesselFacilityPhoto.php
│   │   ├── VesselGuide.php
│   │   ├── VesselBooking.php
│   │   ├── VesselBookingPayment.php
│   │   └── BlockedDate.php
│   │
│   ├── 📁 Jobs/                          # SEMUA task berat → Queue
│   │   ├── SendLabOrderMail.php
│   │   ├── SendVesselBookingMail.php
│   │   ├── GenerateOrderReportPdf.php
│   │   └── GenerateVesselReportPdf.php
│   │
│   ├── 📁 Mail/
│   │   ├── LabOrderCreated.php
│   │   ├── LabOrderVerified.php
│   │   ├── LabOrderRejected.php
│   │   ├── LabPaymentConfirmed.php
│   │   ├── VesselBookingCreated.php
│   │   ├── VesselBookingVerified.php
│   │   └── VesselPaymentConfirmed.php
│   │
│   └── 📁 Providers/
│       └── AppServiceProvider.php
│
├── 📁 resources/js/                      # Frontend React + TypeScript
│   │
│   ├── 📁 pages/                         # Inertia Pages (lowercase, per portal)
│   │   │
│   │   ├── 📁 public/                    # Halaman publik
│   │   │   ├── Home.tsx
│   │   │   ├── Search.tsx
│   │   │   ├── 📁 lab/
│   │   │   │   ├── LabIndex.tsx          # Daftar semua lab
│   │   │   │   └── LabDetail.tsx         # Detail lab + layanan + alat
│   │   │   ├── 📁 service/
│   │   │   │   ├── ServiceIndex.tsx      # Daftar layanan (bisa filter by lab)
│   │   │   │   ├── ServiceDetail.tsx
│   │   │   │   └── ServiceSubmission.tsx # Form pesan layanan lab
│   │   │   ├── 📁 sas/
│   │   │   │   ├── SASIndex.tsx          # Daftar layanan mandiri
│   │   │   │   ├── SASDetail.tsx
│   │   │   │   └── SASFormSubmission.tsx # Isi form dinamis SAS
│   │   │   ├── 📁 article/
│   │   │   │   ├── ArticleIndex.tsx
│   │   │   │   └── ArticleDetail.tsx
│   │   │   └── 📁 vessel/
│   │   │       ├── VesselDetail.tsx      # Detail Explorer-1 & Explorer-2 (kondisional)
│   │   │       └── VesselCalendar.tsx    # Kalender publik Explorer-1
│   │   │
│   │   ├── 📁 user/                      # Portal User (client auth)
│   │   │   ├── Profile.tsx
│   │   │   ├── 📁 lab-orders/
│   │   │   │   ├── LabOrderList.tsx
│   │   │   │   └── LabOrderDetail.tsx    # Detail + upload bukti bayar
│   │   │   └── 📁 vessel-bookings/
│   │   │       ├── VesselBookingForm.tsx
│   │   │       ├── VesselBookingList.tsx
│   │   │       └── VesselBookingDetail.tsx
│   │   │
│   │   ├── 📁 head-of-lab/               # Portal Kepala Lab
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Account.tsx
│   │   │   ├── 📁 orders/
│   │   │   │   ├── OrderList.tsx
│   │   │   │   └── OrderDetail.tsx       # Verifikasi item, konfirmasi bayar
│   │   │   └── 📁 tools/
│   │   │       ├── ToolList.tsx
│   │   │       ├── ToolAdd.tsx
│   │   │       └── ToolEdit.tsx
│   │   │
│   │   ├── 📁 head-of-sas/               # Portal Kepala SAS
│   │   │   ├── Login.tsx
│   │   │   ├── Account.tsx
│   │   │   └── 📁 forum/
│   │   │       ├── ForumAnswerList.tsx
│   │   │       └── ForumAnswerDetail.tsx
│   │   │
│   │   ├── 📁 manager/                   # Portal Manager Kapal
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── 📁 bookings/
│   │   │   │   ├── BookingList.tsx
│   │   │   │   └── BookingDetail.tsx
│   │   │   ├── Payments.tsx
│   │   │   ├── Calendar.tsx
│   │   │   ├── Reports.tsx
│   │   │   └── 📁 vessel/
│   │   │       ├── VesselInfo.tsx
│   │   │       ├── Equipment.tsx
│   │   │       ├── Facilities.tsx
│   │   │       └── Guide.tsx             # WYSIWYG Tiptap (Explorer-1 only)
│   │   │
│   │   ├── 📁 admin/                     # Dashboard Admin
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx             # Grafik statistik + ringkasan
│   │   │   ├── 📁 labs/
│   │   │   │   ├── LabList.tsx
│   │   │   │   ├── LabAdd.tsx
│   │   │   │   └── LabEdit.tsx
│   │   │   ├── 📁 services/
│   │   │   │   ├── ServiceList.tsx
│   │   │   │   ├── ServiceAdd.tsx
│   │   │   │   └── ServiceEdit.tsx
│   │   │   ├── 📁 tools/
│   │   │   │   ├── ToolList.tsx
│   │   │   │   ├── ToolAdd.tsx
│   │   │   │   └── ToolEdit.tsx
│   │   │   ├── 📁 sas/
│   │   │   │   ├── SASList.tsx
│   │   │   │   ├── SASAdd.tsx
│   │   │   │   ├── SASEdit.tsx
│   │   │   │   ├── SASForumList.tsx      # Manage forum fields
│   │   │   │   └── SASForumAnswers.tsx
│   │   │   ├── 📁 articles/
│   │   │   │   ├── ArticleList.tsx
│   │   │   │   ├── ArticleAdd.tsx        # WYSIWYG Tiptap
│   │   │   │   └── ArticleEdit.tsx
│   │   │   ├── 📁 users/
│   │   │   │   ├── UserList.tsx
│   │   │   │   ├── UserAdd.tsx
│   │   │   │   └── UserEdit.tsx
│   │   │   ├── 📁 orders/
│   │   │   │   ├── OrderList.tsx
│   │   │   │   └── OrderDetail.tsx
│   │   │   └── Transactions.tsx
│   │   │
│   │   └── 📁 auth/                      # Shared auth pages
│   │       ├── Login.tsx
│   │       ├── Register.tsx
│   │       ├── ForgotPassword.tsx
│   │       └── ResetPassword.tsx
│   │
│   ├── 📁 components/
│   │   ├── 📁 ui/                        # Primitives (shadcn/ui)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   └── Toast.tsx
│   │   │
│   │   ├── 📁 layout/
│   │   │   ├── PublicLayout.tsx          # Navbar publik + footer
│   │   │   ├── UserLayout.tsx            # Layout user portal
│   │   │   ├── HeadOfLabLayout.tsx       # Sidebar lab dashboard
│   │   │   ├── HeadOfSASLayout.tsx
│   │   │   ├── ManagerLayout.tsx         # Sidebar vessel manager
│   │   │   └── AdminLayout.tsx           # Sidebar admin dashboard
│   │   │
│   │   ├── 📁 shared/                    # Komponen reusable lintas modul
│   │   │   ├── DataTable.tsx             # Tabel dengan search+filter+pagination
│   │   │   ├── ConfirmModal.tsx          # Modal konfirmasi aksi
│   │   │   ├── StatCard.tsx              # Card statistik dashboard
│   │   │   ├── FileUpload.tsx            # Drag&drop, preview, validasi
│   │   │   ├── RichTextEditor.tsx        # Wrapper Tiptap
│   │   │   ├── EmptyState.tsx
│   │   │   └── StatusBadge.tsx           # Badge warna per status
│   │   │
│   │   ├── 📁 lab/                       # Komponen spesifik modul Lab
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── LabCard.tsx
│   │   │   ├── OrderStatusTimeline.tsx   # Riwayat event pesanan
│   │   │   └── ServiceSubmissionForm.tsx # Form pesan layanan (cart)
│   │   │
│   │   ├── 📁 sas/
│   │   │   ├── SASCard.tsx
│   │   │   └── DynamicFormField.tsx      # Render field form SAS (text/image/option)
│   │   │
│   │   └── 📁 vessel/
│   │       ├── ImageCarousel.tsx
│   │       ├── VesselTabs.tsx
│   │       ├── EquipmentCard.tsx
│   │       ├── FacilityCard.tsx
│   │       ├── GuideRenderer.tsx         # Render HTML + auto TOC
│   │       ├── BookingCalendar.tsx        # Date picker + blocked dates
│   │       └── PriceSummary.tsx
│   │
│   ├── 📁 hooks/
│   │   ├── useAuth.ts
│   │   ├── useRole.ts                    # cek role user aktif
│   │   ├── useLab.ts                     # TanStack Query untuk lab data
│   │   └── useVesselBooking.ts
│   │
│   ├── 📁 stores/
│   │   └── ui.store.ts                   # Sidebar, theme, dll (Zustand)
│   │
│   ├── 📁 lib/
│   │   ├── axios.ts                      # Axios instance + interceptor
│   │   ├── query-client.ts               # TanStack Query config
│   │   └── utils.ts                      # cn(), formatCurrency(), formatDate()
│   │
│   ├── 📁 types/                         # TypeScript type definitions
│   │   ├── user.types.ts
│   │   ├── lab.types.ts                  # Lab, Service, Tool, CartOrder, Order
│   │   ├── sas.types.ts                  # StandaloneService, SASForum, SASForumAnswer
│   │   ├── vessel.types.ts               # Vessel, Booking, Payment, BlockedDate
│   │   ├── article.types.ts
│   │   └── inertia.types.ts              # PageProps shared semua halaman
│   │
│   ├── 📁 schemas/                       # Zod validation schemas
│   │   ├── lab-order.schema.ts
│   │   ├── sas-submission.schema.ts
│   │   └── vessel-booking.schema.ts
│   │
│   ├── app.tsx
│   └── bootstrap.ts
│
├── 📁 routes/
│   ├── web.php                           # Include semua route file
│   ├── auth.php
│   ├── 📁 public/
│   │   └── public.routes.php
│   ├── 📁 user/
│   │   └── user.routes.php
│   ├── 📁 head-of-lab/
│   │   └── lab.routes.php
│   ├── 📁 head-of-sas/
│   │   └── sas.routes.php
│   ├── 📁 manager/
│   │   └── manager.routes.php
│   └── 📁 admin/
│       └── admin.routes.php
│
├── 📁 database/
│   ├── 📁 migrations/                    # Satu file = satu tabel
│   ├── 📁 seeders/
│   │   ├── DatabaseSeeder.php
│   │   ├── UserSeeder.php
│   │   ├── FacultySeeder.php
│   │   ├── LabSeeder.php
│   │   ├── ServiceSeeder.php
│   │   ├── SASSeeder.php
│   │   ├── ArticleSeeder.php
│   │   └── VesselSeeder.php
│   └── 📁 factories/
│
├── 📁 tests/
│   ├── 📁 Feature/
│   │   ├── 📁 Lab/
│   │   │   ├── ServiceSubmissionTest.php
│   │   │   └── OrderVerificationTest.php
│   │   ├── 📁 SAS/
│   │   │   └── SASSubmissionTest.php
│   │   ├── 📁 Vessel/
│   │   │   ├── VesselBookingTest.php
│   │   │   └── DoubleBookingPreventionTest.php
│   │   └── 📁 Auth/
│   │       └── RoleAccessControlTest.php
│   ├── 📁 Unit/
│   │   └── 📁 Domain/
│   │       ├── LabOrderServiceTest.php
│   │       ├── CalendarServiceTest.php
│   │       └── PriceCalculationTest.php
│   └── 📁 Frontend/
│       ├── DynamicFormField.test.tsx
│       └── PriceSummary.test.tsx
│
├── 📁 docker/
│   ├── 📁 php/
│   │   └── Dockerfile
│   ├── 📁 nginx/
│   │   └── default.conf
│   └── docker-compose.yml
│
├── 📁 .github/
│   └── 📁 workflows/
│       ├── ci.yml                        # Test + lint di setiap PR
│       └── deploy.yml                    # Deploy ke production (manual approval)
│
└── 📁 docs/
    ├── SETUP.md                          # Setup dev environment (wajib)
    ├── ARCHITECTURE.md                   # ADR + keputusan teknis
    ├── DOMAIN.md                         # Alur bisnis semua modul
    ├── CONTRIBUTING.md
    └── DEPLOYMENT.md
```

---

## 5. Arsitektur & Alur Data

### 5.1 Alur Request

```
Browser → Nginx → Laravel Middleware Stack → Controller → Domain Service → Model → PostgreSQL
                                                ↓
                                          Inertia::render()
                                                ↓
                                          React + TypeScript (di browser)
```

**Prinsip:**
- **Controller = tipis.** Hanya: validasi input via Form Request, panggil Domain Service, return render/redirect.
- **Domain Service = gemuk.** Semua business logic: kalkulasi harga, state transition, cegah double booking.
- **Model = data layer.** Relationship, scope, cast. Tidak ada business logic.

### 5.2 State Machine Pesanan Lab

```
[User submit] → WAIT (menunggu_konfirmasi_kepala_lab)
    │
    ├─ Kepala Lab TOLAK ──► REJECTED (terminal)
    │
    └─ Kepala Lab VERIFIKASI (per item: accepted/rejected)
            │
            ▼
        VERIFIED (menunggu_pembayaran)
            │
            ├─ Kepala Lab TOLAK BAYAR ──► PAYMENT_REJECTED → kembali ke VERIFIED
            │
            └─ Kepala Lab ACC BAYAR
                    │
                    ▼
                DONE (selesai, payment_status: paid/unpaid)
```

### 5.3 State Machine Pesanan Kapal (Explorer-1)

```
[User submit] → MENUNGGU_VERIFIKASI
    │
    ├─ Manager TOLAK ──► DITOLAK
    ├─ User CANCEL ──► DIBATALKAN
    │
    └─ Manager SETUJUI
            │
            ▼
        TERVERIFIKASI (kirim email instruksi bayar)
            │
            │ [User upload bukti]
            ▼
        MENUNGGU_VERIFIKASI_PEMBAYARAN
            │
            ├─ Manager TOLAK ──► BUKTI_DITOLAK → user upload ulang
            └─ Manager ACC
                    │
                    ▼
                LUNAS → SELESAI
```

### 5.4 Logika SAS Forum (Layanan Mandiri)

```
Admin buat StandaloneService
    │
    └─ Admin buat SASForum (array field dinamis: type=text/image/option)
            │
            ▼
    User isi form di halaman publik SAS
    (DynamicFormField merender field sesuai type)
            │
            ▼
    Tersimpan sebagai SASForumAnswer (1 row per field, per user)
            │
            ▼
    Kepala SAS lihat & review jawaban di portal
```

### 5.5 Database Schema (ERD Ringkas)

```
users ──────────────────────────────────────────────────────
  │                                                         │
  ├─► laboratoriums                                         │
  │     ├─► services ──► orders ──► cart_orders            │
  │     └─► tools                      └─► order_events    │
  │                                                         │
  ├─► standalone_services                                   │
  │     └─► sas_forums                                      │
  │           └─► sas_forum_answers                         │
  │                                                         │
  ├─► vessel_bookings ──► vessel_booking_payments           │
  │                                                         │
  ├─► vessels                                               │
  │     ├─► vessel_photos                                   │
  │     ├─► vessel_equipment ──► vessel_equipment_photos    │
  │     ├─► vessel_facilities ──► vessel_facility_photos    │
  │     ├─► vessel_guides                                   │
  │     └─► blocked_dates                                   │
  │                                                         │
  └─► articles ────────────────────────────────────────────
```

---

## 6. Roadmap 16 Minggu

> **Prinsip:** Setiap fase menghasilkan sesuatu yang *bisa didemonstrasikan dan ditest*.
> 

### Fase 0 — Setup Pondasi (Minggu 1–2)

| Task | Est. |
| --- | --- |
| Init proyek Laravel 12 baru | 0.5 hari |
| Setup TypeScript + Vite 6 + React 19 + Inertia.js v2 | 1 hari |
| Install TailwindCSS v4 + shadcn/ui + konfigurasi tema | 1 hari |
| Setup Docker + docker-compose (PHP, Nginx, PostgreSQL, Redis) | 1 hari |
| Setup GitHub Actions CI (lint + test on PR) | 0.5 hari |
| Setup ESLint + Prettier + Pint + PHPStan | 0.5 hari |
| Setup Sentry (error monitoring) | 0.5 hari |
| Tulis `docs/SETUP.md` yang bisa diikuti orang baru | 0.5 hari |

**✅ Deliverable:** Clone → `docker compose up` → app berjalan. CI hijau.

---

### Fase 1 — Database & Core Domain (Minggu 3–4)

| Task | Catatan |
| --- | --- |
| Buat semua migrations (semua tabel) | PostgreSQL: ENUM native, UUID, constraint |
| Buat semua Eloquent Models | Relationship, casts, scopes |
| Buat PHP Enums: `OrderStatus`, `BookingStatus`, `PaymentStatus` | Tidak boleh pakai string literal |
| Buat `LabOrderService` + unit test | Logika verifikasi, state transition |
| Buat `CalendarService` + unit test | Logika date overlap, tanggal tidak tersedia |
| Buat `VesselBookingService` + unit test | Double booking prevention via DB transaction |
| Buat semua seeders dengan data demo realistis | Harus bisa seed ulang kapan saja |

**✅ Deliverable:** Database siap, unit test domain 100% passing.

---

### Fase 2 — Auth & Routing (Minggu 5)

| Task | Catatan |
| --- | --- |
| Setup auth: login, register, forgot/reset password | Satu flow untuk semua role |
| Setup route groups: public, user, head-of-lab, head-of-sas, manager, admin |  |
| Middleware `EnsureRole` yang generic & reusable |  |
| `HandleInertiaRequests` — share auth + role + flash data |  |
| TypeScript types: `User`, `Role`, `PageProps` |  |
| Halaman login per portal (minimal, polish belakangan) |  |
| Feature test: authorization (siapa boleh akses apa) | Pest PHP |

**✅ Deliverable:** Semua role bisa login, route protection berjalan.

---

### Fase 3 — Halaman Publik (Minggu 6–7)

| Task | Catatan |
| --- | --- |
| `PublicLayout` — Navbar + footer + dropdown navigasi |  |
| `Home.tsx` — Landing page dengan semua section |  |
| `LabIndex` + `LabDetail` (layanan + alat per lab) |  |
| `ServiceIndex` + `ServiceDetail` |  |
| `SASIndex` + `SASDetail` |  |
| `ArticleIndex` + `ArticleDetail` |  |
| `Search.tsx` — Pencarian global |  |
| `VesselDetail.tsx` — Explorer-1 & 2 kondisional |  |
| `VesselCalendar.tsx` — Kalender publik |  |

**✅ Deliverable:** Semua halaman publik bisa diakses, data dari database.

---

### Fase 4 — Alur Pemesanan Layanan Lab (Minggu 8)

| Task | Catatan |
| --- | --- |
| `ServiceSubmission.tsx` — Form cart layanan (pilih qty, tanggal, deskripsi) | Harga internal/eksternal otomatis |
| `ServiceSubmissionRequest` — Validasi backend |  |
| `LabOrderController` — store, list, detail |  |
| `LabOrderList.tsx` + `LabOrderDetail.tsx` (user) | Detail + upload bukti bayar |
| Email job `SendLabOrderMail` via queue |  |
| Feature test: complete order submission flow |  |

**✅ Deliverable:** User bisa pesan layanan lab, email terkirim.

---

### Fase 5 — Alur SAS (Minggu 9)

| Task | Catatan |
| --- | --- |
| `DynamicFormField.tsx` — Render field SAS (text/image/option) |  |
| `SASFormSubmission.tsx` |  |
| `SASSubmissionController` + `SASSubmissionService` | Validasi file image, cegah submit ganda |
| Simpan file ke Cloudflare R2 | Via Spatie Media Library |

**✅ Deliverable:** User bisa submit form SAS dinamis dengan upload gambar.

---

### Fase 6 — Alur Pemesanan Kapal (Minggu 10)

| Task | Catatan |
| --- | --- |
| `VesselBookingForm.tsx` — Date picker + disabled dates + kalkulasi harga |  |
| `VesselBookingController` — store + validasi overlap | DB transaction wajib |
| `VesselBookingList` + `VesselBookingDetail` (user) |  |
| Upload bukti bayar kapal | Cloudflare R2 |
| Email notifikasi kapal |  |
| Feature test: double booking prevention |  |

**✅ Deliverable:** User bisa pesan kapal, double booking tercegah.

---

### Fase 7 — Portal Kepala Lab & SAS (Minggu 11)

| Task | Catatan |
| --- | --- |
| `HeadOfLabLayout` + Login |  |
| `OrderList` + `OrderDetail` (verifikasi item, konfirmasi bayar) |  |
| CRUD alat lab |  |
| `HeadOfSASLayout` + Login |  |
| `ForumAnswerList` + `ForumAnswerDetail` |  |

**✅ Deliverable:** Kepala lab bisa kelola pesanan dan alat labnya.

---

### Fase 8 — Portal Manager Kapal (Minggu 12)

| Task | Catatan |
| --- | --- |
| `ManagerLayout` + Login |  |
| Dashboard ringkasan kapal |  |
| Manajemen pesanan kapal (verifikasi, tolak, selesai) |  |
| Verifikasi pembayaran |  |
| Kalender + blokir tanggal (FullCalendar) |  |
| CRUD alat & fasilitas kapal (kedua kapal) |  |
| Edit info kapal |  |
| WYSIWYG panduan (Tiptap, Explorer-1 only) | Sanitasi HTML sebelum simpan |
| Laporan + export CSV/PDF (queue job) |  |

**✅ Deliverable:** Manager bisa kelola siklus lengkap pemesanan kapal.

---

### Fase 9 — Dashboard Admin (Minggu 13–14)

| Task | Catatan |
| --- | --- |
| `AdminLayout` + Login |  |
| Dashboard statistik (grafik Recharts, multi-filter) |  |
| CRUD Laboratorium (dengan upload gambar, VA, QR code) |  |
| CRUD Layanan per Lab (harga internal/eksternal) |  |
| CRUD Alat per Lab |  |
| CRUD Layanan Mandiri (SAS) |  |
| CRUD Forum SAS (bangun field dinamis) |  |
| CRUD Artikel (Tiptap WYSIWYG) |  |
| CRUD Pengguna (atur role) |  |
| Lihat semua pesanan lab |  |
| Laporan Transaksi |  |

**✅ Deliverable:** Admin bisa mengelola seluruh konten dan pengguna sistem.

---

### Fase 10 — Testing, Polish & Launch (Minggu 15–16)

| Task | Catatan |
| --- | --- |
| Feature test coverage audit (target ≥70%) |  |
| E2E test alur kritis (Playwright) | Lab order flow, kapal booking flow, admin CRUD |
| Performance audit | Lighthouse ≥80, fix N+1 query |
| Security audit | OWASP Top 10, file upload, XSS, CSRF, rate limiting |
| UI/UX polish — responsive mobile |  |
| Load testing: 50 concurrent users |  |
| Setup Redis queue monitoring (Laravel Horizon) |  |
| Setup backup otomatis (spatie/laravel-backup) |  |
| Tulis `docs/DEPLOYMENT.md` |  |
| Deploy production + setup monitoring |  |

**✅ Deliverable:** Sistem live, stabil, terdokumentasi, temonitor.

---

### Timeline Visual

```
MGG  01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16
     ═══════════════════════════════════════════════
F0   ████
F1      ████
F2          ██
F3            ████
F4                ██
F5                  ██
F6                    ██
F7                      ██
F8                        ██
F9                          ████
F10                             ████
```

---

## 7. Konvensi Kode & Tim

### Naming Convention

| Elemen | Konvensi | Contoh |
| --- | --- | --- |
| PHP Class | PascalCase | `LabOrderService` |
| PHP Method | camelCase | `verifyOrder()` |
| DB Table | snake_case plural | `cart_orders`, `sas_forums` |
| DB Column | snake_case | `head_of_lab_id`, `payment_status` |
| TS File (Component) | PascalCase | `OrderDetail.tsx` |
| TS File (Hook/Util) | camelCase | `useRole.ts`, `utils.ts` |
| TS Interface | PascalCase | `CartOrder`, `SASForum` |
| Enum Value | SCREAMING_SNAKE | `OrderStatus.WAIT` |
| Git Branch | `feat/` atau `fix/` | `feat/lab-order-flow` |
| Commit | `type(scope): pesan` | `feat(admin): add article WYSIWYG` |

### Aturan Wajib Controller

```php
// ✅ BENAR — Controller hanya orchestration
public function store(StoreLabOrderRequest $request): Response
{
    $order = $this->labOrderService->create(
        $request->validated(),
        $request->user('client')
    );
    return redirect()->route('user.lab-orders.show', $order);
}

// ❌ SALAH — Jangan taruh logika bisnis di Controller
public function store(Request $request): Response
{
    // kalkulasi harga, cek service, buat cart, kirim email... TIDAK DI SINI
}
```

### Aturan TypeScript

```tsx
// ✅ BENAR — Selalu type explicit untuk Inertia props
interface OrderDetailProps {
  cartOrder: CartOrder;
  auth: { user: User };
}
export default function OrderDetail({ cartOrder, auth }: OrderDetailProps) {}

// ❌ SALAH — Jangan gunakan `any`
export default function OrderDetail({ cartOrder, auth }: any) {}
```

### Branching Strategy

```
main ────────────────────────────────► Production
  │
develop ──────────────────────────► Staging (auto-deploy)
  │
  ├── feat/lab-order-flow ──► PR → develop (review 1 orang min.)
  ├── feat/vessel-calendar ──► PR → develop
  └── fix/sas-image-upload ──► PR → develop
```

**Aturan:**
- Tidak boleh push langsung ke `main` atau `develop`
- Semua perubahan via Pull Request, minimal 1 reviewer
- CI (test + lint) harus **hijau** sebelum merge
- Setiap PR wajib deskripsi: apa yang diubah dan mengapa

---

## 8. Hal Kritis yang Harus Diperhatikan

### 🔴 Keamanan (Jika Salah, Fatal)

| Risiko | Mitigasi |
| --- | --- |
| **Mass Assignment** | Selalu definisikan `$fillable` di semua Model |
| **File Upload Exploits** | Validasi MIME type di backend (bukan hanya ekstensi). Simpan di R2, **bukan di `public/`** |
| **XSS via WYSIWYG** | Sanitasi HTML dari Tiptap sebelum disimpan ke DB. Gunakan `HTMLPurifier` atau `DOMPurify` |
| **SQL Injection** | Selalu pakai Eloquent/query builder. Jangan string concat di query |
| **Unauthorized Access** | Middleware `EnsureRole` di semua route yang butuh auth. Jangan andalkan UI saja |
| **Harga Internal/Eksternal** | Harga harus diambil dari DB server-side saat submit, jangan percaya harga dari form frontend |
| **Double Booking Kapal** | Wajib `DB::transaction()` + query lock. Ini tidak cukup dengan validasi biasa |
| **Secrets** | Semua di `.env` + GitHub Secrets. **Tidak boleh ada** credentials di kode |
| `APP_DEBUG=false` di production | Wajib, atau stack trace bocor ke user |

### 🟠 Logika Bisnis (Rentan Bug)

| Area | Yang Harus Diperhatikan |
| --- | --- |
| **Harga pesanan lab** | Snapshot harga saat pesan (`price_per_item` tersimpan di `orders`), jangan lookup ulang dari `services`. Harga bisa berubah. |
| **Status pesanan** | Gunakan PHP Enum untuk status, bukan string literal. Ini mencegah typo yang sulit ditemukan. |
| **Upload bukti bayar** | Satu pesanan bisa upload ulang (jika ditolak). Simpan history semua upload, bukan overwrite. |
| **Tanggal tidak tersedia kapal** | Pending booking juga harus memblokir tanggal (Opsi Aman), bukan hanya yang sudah verified. |
| **Forum SAS** | Satu user hanya boleh submit sekali per SAS. Cek `sas_forum_answers` sebelum simpan. |
| **Identitas user** | Foto identitas (KTP, KTM) sangat sensitif. Tidak boleh di-serve via URL publik. Harus via endpoint yang dicek auth. |

### 🟡 Performa (Akan Terasa Saat Data Besar)

| Area | Solusi |
| --- | --- |
| **N+1 Query** | Selalu gunakan eager loading: `with(['service', 'user', 'orderEvents'])` |
| **Dashboard stats** | Cache dengan Redis, invalidate saat ada perubahan data |
| **Export PDF/laporan** | Wajib via Queue Job, jangan blocking HTTP request |
| **Gambar** | Upload ke R2, serve via CDN Cloudflare. Jangan simpan base64 di DB. |
| **Index Database** | Wajib index pada: `user_id`, `lab_id`, `status`, `start_date`, `end_date`, `slug` |

### 🟢 Pengalaman Tim (Untuk Keberlanjutan)

| Area | Solusi |
| --- | --- |
| **Onboarding** | `docs/SETUP.md` harus bisa diikuti orang baru dalam 15 menit |
| **Domain kompleks** | `docs/DOMAIN.md` menjelaskan semua alur bisnis dengan diagram |
| **Seed data** | Database harus bisa di-seed ulang kapan saja dengan data demo lengkap |
| **Tidak ada “magic string”** | Semua konstanta (status, role, dll.) harus jadi Enum atau konstanta bernama |
| **Komponen besar** | File React > 250 baris → pecah jadi sub-komponen |
| **Satu tanggung jawab** | Service untuk lab jangan campur logika kapal. Pisah per domain. |

---

## 9. Checklist Pre-Launch

### Keamanan

- [ ]  `APP_DEBUG=false`, `APP_ENV=production`
- [ ]  HTTPS aktif (via Cloudflare)
- [ ]  Rate limiting di route login, register, submission
- [ ]  File upload: validasi MIME backend, stored di R2
- [ ]  HTML WYSIWYG disanitasi sebelum disimpan
- [ ]  Foto identitas user tidak accessible via URL publik
- [ ]  `composer audit` + `npm audit` — tidak ada critical vulnerability
- [ ]  Semua secrets di environment variable

### Fungsionalitas

- [ ]  Alur pesanan lab dari awal sampai selesai ✓
- [ ]  Alur SAS submission & review ✓
- [ ]  Alur booking kapal + bayar ✓
- [ ]  Semua email terkirim via queue ✓
- [ ]  Export PDF/CSV berjalan via queue ✓
- [ ]  File upload ke R2 berfungsi ✓
- [ ]  Semua role bisa login dan akses halaman yang sesuai ✓
- [ ]  Tidak bisa akses halaman di luar role ✓

### Testing

- [ ]  Feature test coverage ≥ 70%
- [ ]  Double booking prevention test passing
- [ ]  Authorization test semua route passing
- [ ]  E2E test (Playwright): lab order flow, kapal booking flow
- [ ]  Manual QA di Chrome, Firefox, Safari (mobile + desktop)

### Performa

- [ ]  Lighthouse score ≥ 80 di semua halaman utama
- [ ]  Tidak ada N+1 query (cek via Telescope di staging)
- [ ]  Semua gambar via CDN Cloudflare
- [ ]  Dashboard stats di-cache dengan Redis

### Infrastruktur

- [ ]  Laravel Horizon berjalan + monitoring
- [ ]  Backup database otomatis harian (spatie/laravel-backup)
- [ ]  Sentry terhubung dan menerima events
- [ ]  Uptime monitoring aktif
- [ ]  `docs/DEPLOYMENT.md` sudah ada dan ditest

---

## Referensi Tools

| Library | Link | Digunakan Untuk |
| --- | --- | --- |
| Laravel 12 | laravel.com | Backend framework |
| Inertia.js v2 | inertiajs.com | SSR bridge |
| shadcn/ui | ui.shadcn.com | UI components |
| TanStack Query | tanstack.com/query | Server state management |
| React Hook Form | react-hook-form.com | Form handling |
| Zod | zod.dev | Schema validation |
| Tiptap | tiptap.dev | WYSIWYG editor (artikel + panduan kapal) |
| FullCalendar | fullcalendar.io | Kalender booking kapal |
| Recharts | recharts.org | Grafik dashboard |
| Spatie Media Library | spatie.be/docs/laravel-medialibrary | File storage ke R2 |
| Spatie Permission | spatie.be/docs/laravel-permission | Role management |
| Pest PHP | pestphp.com | Backend testing |
| Playwright | playwright.dev | E2E testing |
| Cloudflare R2 | developers.cloudflare.com/r2 | File storage |
| Resend | resend.com | Email service |
| Sentry | sentry.io | Error monitoring |

---

> **Dokumen ini hidup.** Update setiap kali ada keputusan arsitektur baru.
Pindahkan ke `docs/ARCHITECTURE.md` setelah repo baru terbentuk.
>