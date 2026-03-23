/**
 * MOCK DATA
 * Cara integrasi: ganti MOCK_BOOKINGS dengan response dari GET /api/bookings
 * Semua keys menggunakan snake_case.
 */

import type { Booking } from '@/types/booking.types';

export const MOCK_BOOKINGS: Booking[] = [
    // --- Menunggu Verifikasi Pesanan (dengan konflik) ---
    {
        id: 'bk-001',
        booking_code: 'PES-2026-0042',
        booker: {
            name: 'Dr. Budi Santoso',
            institution: 'Dept. Ilmu Kelautan, FIKP Unhas',
            email: 'budi.santoso@unhas.ac.id',
            phone: '082145678901',
        },
        activity_name: 'Ekspedisi Oseanografi Teluk Bone — Sampling CTD',
        start_date: '2026-03-28',
        end_date: '2026-04-02',
        duration_days: 6,
        price_per_day: 5_000_000,
        total_price: 30_000_000,
        booking_status: 'MENUNGGU_VERIFIKASI_PESANAN',
        payment_status: 'BELUM_BAYAR',
        user_type: 'internal',
        special_request: 'Membutuhkan crane untuk menurunkan instrumen CTD berat. Mohon pastikan palka kargo tersedia.',
        payment_proofs: [],
        conflicting_bookings: [
            {
                booking_code: 'PES-2026-0041',
                booker_name: 'Prof. Dewi Rahayu',
                booking_status: 'PESANAN_TERVERIFIKASI',
                start_date: '2026-03-30',
                end_date: '2026-04-03',
            },
        ],
        internal_notes: [],
        created_at: '2026-03-18T10:22:00+08:00',
        updated_at: '2026-03-18T10:22:00+08:00',
    },

    // --- Menunggu Verifikasi Pesanan (tanpa konflik) ---
    {
        id: 'bk-002',
        booking_code: 'PES-2026-0043',
        booker: {
            name: 'Siti Nurhaliza',
            institution: 'Program Studi Biologi Laut, FMIPA Unhas',
            email: 'siti.nurhaliza@student.unhas.ac.id',
            phone: '081234567890',
        },
        activity_name: 'Penelitian Ekosistem Terumbu Karang Spermonde',
        start_date: '2026-04-10',
        end_date: '2026-04-14',
        duration_days: 5,
        price_per_day: 5_000_000,
        total_price: 25_000_000,
        booking_status: 'MENUNGGU_VERIFIKASI_PESANAN',
        payment_status: 'BELUM_BAYAR',
        payment_proofs: [],
        conflicting_bookings: [],
        internal_notes: [],
        created_at: '2026-03-19T08:00:00+08:00',
        updated_at: '2026-03-19T08:00:00+08:00',
    },

    // --- Pesanan Terverifikasi — Belum Bayar (dengan deadline) ---
    {
        id: 'bk-003',
        booking_code: 'PES-2026-0041',
        booker: {
            name: 'Prof. Dewi Rahayu',
            institution: 'Pusat Penelitian Lingkungan Hidup, Unhas',
            email: 'dewi.rahayu@unhas.ac.id',
            phone: '087654321098',
        },
        activity_name: 'Survei Kualitas Air Laut Selat Makassar',
        start_date: '2026-03-30',
        end_date: '2026-04-03',
        duration_days: 5,
        price_per_day: 5_000_000,
        total_price: 25_000_000,
        booking_status: 'PESANAN_TERVERIFIKASI',
        payment_status: 'BELUM_BAYAR',
        payment_deadline: '2026-03-23T23:59:00+08:00',
        payment_proofs: [],
        conflicting_bookings: [],
        internal_notes: [
            {
                id: 'note-001',
                author: 'Admin Kapal',
                content: 'Pesanan disetujui. Silakan transfer ke rek BNI 1234567890 a.n. UKK Unhas.',
                created_at: '2026-03-20T09:15:00+08:00',
            },
        ],
        created_at: '2026-03-15T14:00:00+08:00',
        updated_at: '2026-03-20T09:15:00+08:00',
    },

    // --- Menunggu Verifikasi Pembayaran ---
    {
        id: 'bk-004',
        booking_code: 'PES-2026-0040',
        booker: {
            name: 'Andi Pratama',
            institution: 'Fakultas Teknik Kelautan, Institut Teknologi Makassar',
            email: 'andi.pratama@itm.ac.id',
            phone: '089876543210',
        },
        activity_name: 'Pengujian Hidrodinamika Kapal Purse Seine',
        start_date: '2026-03-22',
        end_date: '2026-03-26',
        duration_days: 5,
        price_per_day: 5_000_000,
        total_price: 25_000_000,
        booking_status: 'PESANAN_TERVERIFIKASI',
        payment_status: 'MENUNGGU_VERIFIKASI_PEMBAYARAN',
        payment_deadline: '2026-03-22T23:59:00+08:00',
        payment_proofs: [
            {
                image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
                amount_on_receipt: 15_000_000,
                note: 'Cicilan 1 dari BNI Mobile Banking. Sisa 10jt.',
                uploaded_at: '2026-03-20T14:30:00+08:00',
            },
        ],
        conflicting_bookings: [],
        internal_notes: [],
        created_at: '2026-03-12T09:00:00+08:00',
        updated_at: '2026-03-20T14:30:00+08:00',
    },

    // --- Menunggu Verifikasi Pembayaran — nominal TIDAK SESUAI ---
    {
        id: 'bk-005',
        booking_code: 'PES-2026-0039',
        booker: {
            name: 'Reza Firmansyah',
            institution: 'Lembaga Riset Kelautan Nasional',
            email: 'reza.firmansyah@lrkn.go.id',
            phone: '081355667788',
        },
        activity_name: 'Pengambilan Sampel Plankton Perairan Sulawesi Selatan',
        start_date: '2026-03-24',
        end_date: '2026-03-27',
        duration_days: 4,
        price_per_day: 5_000_000,
        total_price: 20_000_000,
        booking_status: 'PESANAN_TERVERIFIKASI',
        payment_status: 'MENUNGGU_VERIFIKASI_PEMBAYARAN',
        payment_deadline: '2026-03-23T23:59:00+08:00',
        payment_proofs: [
            {
                image_url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
                amount_on_receipt: 19_500_000,
                note: 'Bukti transfer terlampir.',
                uploaded_at: '2026-03-20T11:00:00+08:00',
            },
        ],
        conflicting_bookings: [],
        internal_notes: [],
        created_at: '2026-03-10T10:00:00+08:00',
        updated_at: '2026-03-20T11:00:00+08:00',
    },

    // --- LUNAS — Pembayaran Terkonfirmasi ---
    {
        id: 'bk-006',
        booking_code: 'PES-2026-0035',
        booker: {
            name: 'Dr. Rahmat Hidayat',
            institution: 'Pusat Kajian Pesisir dan Laut, Unhas',
            email: 'rahmat.hidayat@unhas.ac.id',
            phone: '082233445566',
        },
        activity_name: 'Riset Sedimentasi Muara Sungai Jeneberang',
        start_date: '2026-04-05',
        end_date: '2026-04-09',
        duration_days: 5,
        price_per_day: 5_000_000,
        total_price: 25_000_000,
        booking_status: 'PESANAN_TERVERIFIKASI',
        payment_status: 'LUNAS',
        payment_proofs: [
            {
                image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
                amount_on_receipt: 12_500_000,
                note: 'DP 50% confirmed.',
                uploaded_at: '2026-03-05T09:00:00+08:00',
            },
            {
                image_url: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&q=80',
                amount_on_receipt: 12_500_000,
                note: 'Pelunasan confirmed.',
                uploaded_at: '2026-03-07T15:00:00+08:00',
            },
        ],
        conflicting_bookings: [],
        internal_notes: [
            {
                id: 'note-002',
                author: 'Admin Kapal',
                content: 'Pembayaran telah dikonfirmasi. Dokumen perjanjian dikirim via email.',
                created_at: '2026-03-08T10:30:00+08:00',
            },
        ],
        created_at: '2026-03-01T08:00:00+08:00',
        updated_at: '2026-03-08T10:30:00+08:00',
    },

    // --- Pesanan DITOLAK ---
    {
        id: 'bk-007',
        booking_code: 'PES-2026-0031',
        booker: {
            name: 'Yulia Kartika',
            institution: 'Universitas Brawijaya — Fakultas Perikanan',
            email: 'yulia.kartika@ub.ac.id',
            phone: '085678901234',
        },
        activity_name: 'Ekspedisi Sampling Ikan Pelagis Besar',
        start_date: '2026-03-15',
        end_date: '2026-03-20',
        duration_days: 6,
        price_per_day: 5_000_000,
        total_price: 30_000_000,
        booking_status: 'PESANAN_DITOLAK',
        payment_status: 'BELUM_BAYAR',
        rejection_reason:
            'Kapal dijadwalkan untuk perawatan rutin (dry dock) pada periode yang sama. Silakan pilih tanggal alternatif setelah 1 April 2026.',
        payment_proofs: [],
        conflicting_bookings: [],
        internal_notes: [],
        created_at: '2026-03-05T13:00:00+08:00',
        updated_at: '2026-03-10T09:00:00+08:00',
    },

    // --- Bukti Bayar DITOLAK - Minta Upload Ulang ---
    {
        id: 'bk-008',
        booking_code: 'PES-2026-0038',
        booker: {
            name: 'Muhammad Fakhri',
            institution: 'Kementerian Kelautan dan Perikanan RI',
            email: 'm.fakhri@kkp.go.id',
            phone: '081298765432',
        },
        activity_name: 'Monitoring Biodiversitas Kawasan Konservasi Laut',
        start_date: '2026-04-15',
        end_date: '2026-04-19',
        duration_days: 5,
        price_per_day: 5_000_000,
        total_price: 25_000_000,
        booking_status: 'PESANAN_TERVERIFIKASI',
        payment_status: 'BUKTI_DITOLAK',
        payment_deadline: '2026-04-10T23:59:00+08:00',
        rejection_reason:
            'Bukti transfer tidak terbaca (gambar buram). Mohon upload ulang dengan kualitas gambar yang jelas.',
        payment_proofs: [
            {
                image_url: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&q=80',
                amount_on_receipt: 25_000_000,
                note: 'Bukti transfer.',
                uploaded_at: '2026-03-17T16:00:00+08:00',
            },
            {
                image_url: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&q=80',
                amount_on_receipt: 25_000_000,
                note: 'Bukti transfer.',
                uploaded_at: '2026-03-17T16:00:00+08:00',
            },
        ],
        conflicting_bookings: [],
        internal_notes: [
            {
                id: 'note-003',
                author: 'Admin Kapal',
                content: 'Penolakan bukti bayar: gambar tidak terbaca. User sudah diberitahu via email.',
                created_at: '2026-03-18T10:00:00+08:00',
            },
        ],
        created_at: '2026-03-08T12:00:00+08:00',
        updated_at: '2026-03-18T10:00:00+08:00',
    },

    // --- Dibayar Sebagian (Cicilan Confirmed) ---
    {
        id: 'bk-009',
        booking_code: 'PES-2026-0045',
        booker: {
            name: 'Andi Wijaya',
            institution: 'Fakultas Kelautan, Universitas Hasanuddin',
            email: 'andi.wijaya@unhas.ac.id',
            phone: '081223344556',
        },
        activity_name: 'Monitoring Terumbu Karang Spermonde',
        start_date: '2026-04-20',
        end_date: '2026-04-25',
        duration_days: 5,
        price_per_day: 5_000_000,
        total_price: 25_000_000,
        booking_status: 'PESANAN_TERVERIFIKASI',
        payment_status: 'DIBAYAR_SEBAGIAN',
        payment_deadline: '2026-04-15T23:59:00+08:00',
        payment_proofs: [
            {
                image_url: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&q=80',
                amount_on_receipt: 10_000_000,
                note: 'Cicilan 1 - Transfer Kampus',
                uploaded_at: '2026-03-20T10:00:00+08:00',
            },
        ],
        conflicting_bookings: [],
        internal_notes: [
            {
                id: 'note-004',
                author: 'Admin Kapal',
                content: 'Pembayaran cicilan pertama Rp 10jt sudah dikonfirmasi. Sisa Rp 15jt.',
                created_at: '2026-03-20T11:00:00+08:00',
            },
        ],
        created_at: '2026-03-20T08:00:00+08:00',
        updated_at: '2026-03-20T11:00:00+08:00',
    },

    // --- Harga Hasil Negosiasi ---
    {
        id: 'bk-010',
        booking_code: 'PES-2026-0046',
        booker: {
            name: 'Lestari Putri',
            institution: 'NGO Sahabat Laut',
            email: 'lestari.p@sahabatlaut.org',
            phone: '081334455667',
        },
        activity_name: 'Edukasi Ekosistem Bakau',
        start_date: '2026-05-01',
        end_date: '2026-05-03',
        duration_days: 2,
        price_per_day: 5_000_000,
        total_price: 8_000_000, 
        booking_status: 'PESANAN_TERVERIFIKASI',
        payment_status: 'BELUM_BAYAR',
        payment_deadline: '2026-04-20T23:59:00+08:00',
        payment_proofs: [],
        conflicting_bookings: [],
        internal_notes: [
            {
                id: 'note-005',
                author: 'System (Negosiasi)',
                content: 'Total harga diubah ke Rp 8.000.000. Catatan: Diskon khusus NGO mitra kampus.',
                created_at: '2026-03-20T15:00:00+08:00',
            },
        ],
        created_at: '2026-03-20T12:00:00+08:00',
        updated_at: '2026-03-20T15:00:00+08:00',
    },

    // --- Pesanan Laboratorium ---
    {
        id: 'bk-011',
        booking_code: 'LAB-2026-0101',
        booker: {
            name: 'Andi Mahasiswa',
            institution: 'FMIPA Universitas Hasanuddin',
            email: 'andi.mhs@sci.unhas.ac.id',
            phone: '081234123412',
        },
        activity_name: 'Pengujian Sampel Tanah',
        service_name: 'Uji Kadar Air dan Mineral',
        start_date: '2026-03-25',
        end_date: '2026-03-26',
        duration_days: 1,
        price_per_day: 500_000,
        total_price: 500_000,
        booking_status: 'MENUNGGU_VERIFIKASI_PESANAN',
        payment_status: 'BELUM_BAYAR',
        user_type: 'internal',
        payment_proofs: [],
        conflicting_bookings: [],
        internal_notes: [],
        created_at: '2026-03-21T10:00:00+08:00',
        updated_at: '2026-03-21T10:00:00+08:00',
    },

    // --- Layanan Mandiri (SAS) ---
    {
        id: 'bk-012',
        booking_code: 'SAS-2026-0005',
        booker: {
            name: 'PT. Teknologi Maritim',
            institution: 'Perusahaan Swasta',
            email: 'contact@tekmar.co.id',
            phone: '085512345678',
        },
        activity_name: 'Pembuatan Prototype Sensor Pasang Surut',
        service_name: 'Layanan Mandiri',
        start_date: '2026-04-01',
        end_date: '2026-04-30',
        duration_days: 30,
        price_per_day: 1_000_000,
        total_price: 30_000_000,
        booking_status: 'PESANAN_TERVERIFIKASI',
        payment_status: 'MENUNGGU_VERIFIKASI_PEMBAYARAN',
        user_type: 'external',
        payment_proofs: [
            {
                image_url: 'https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&q=80',
                amount_on_receipt: 15_000_000,
                note: 'DP 50%',
                uploaded_at: '2026-03-22T08:00:00+08:00',
            }
        ],
        conflicting_bookings: [],
        internal_notes: [],
        created_at: '2026-03-20T09:00:00+08:00',
        updated_at: '2026-03-20T10:00:00+08:00',
    },    

    // --- Pesanan Multi-Layanan (Lab A) dari User yang Sama ---
    {
        id: 'bk-013',
        booking_code: 'LAB-2026-0150',
        booker: {
            name: 'Dr. Ilham Saputra',
            institution: 'Universitas Terbuka',
            email: 'ilham.saputra@ut.ac.id',
            phone: '081122334455',
        },
        activity_name: 'Penelitian Sifat Mekanik Material',
        provider_name: 'Laboratorium Material dan Metalurgi',
        start_date: '2026-04-10',
        end_date: '2026-04-12',
        duration_days: 2,
        price_per_day: 1_750_000,
        total_price: 3_500_000,
        booking_status: 'MENUNGGU_VERIFIKASI_PESANAN',
        payment_status: 'BELUM_BAYAR',
        user_type: 'external',
        items: [
            { id: 'itm-01', service_name: 'Uji Tarik (Tensile Test)', quantity: 5, price: 300_000 },
            { id: 'itm-02', service_name: 'Uji Kekerasan (Hardness Test)', quantity: 10, price: 200_000 },
        ],
        payment_proofs: [],
        conflicting_bookings: [],
        internal_notes: [],
        created_at: '2026-03-22T08:00:00+08:00',
        updated_at: '2026-03-22T08:00:00+08:00',
    },

    // --- Pesanan Multi-Layanan (Lab B) dari User yang Sama ---
    {
        id: 'bk-014',
        booking_code: 'LAB-2026-0151',
        booker: {
            name: 'Dr. Ilham Saputra',
            institution: 'Universitas Terbuka',
            email: 'ilham.saputra@ut.ac.id',
            phone: '081122334455',
        },
        activity_name: 'Penelitian Komposisi Material',
        provider_name: 'Laboratorium Kimia Analitik',
        start_date: '2026-04-11',
        end_date: '2026-04-11',
        duration_days: 1,
        price_per_day: 1_500_000,
        total_price: 1_500_000,
        booking_status: 'MENUNGGU_VERIFIKASI_PESANAN',
        payment_status: 'BELUM_BAYAR',
        user_type: 'external',
        items: [
            { id: 'itm-03', service_name: 'Analisis SEM-EDX', quantity: 1, price: 1_500_000 },
        ],
        payment_proofs: [],
        conflicting_bookings: [],
        internal_notes: [],
        created_at: '2026-03-22T08:05:00+08:00',
        updated_at: '2026-03-22T08:05:00+08:00',
    },
];
