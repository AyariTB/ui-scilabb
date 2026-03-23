export type BookingStatus =
    | 'MENUNGGU_VERIFIKASI_PESANAN'
    | 'PESANAN_TERVERIFIKASI'
    | 'PESANAN_DITOLAK'
    | 'DIBATALKAN'
    | 'SELESAI';

/** Status pembayaran, terpisah dari status pesanan */
export type PaymentStatus =
    | 'BELUM_BAYAR'
    | 'MENUNGGU_VERIFIKASI_PEMBAYARAN'
    | 'LUNAS'
    | 'DIBAYAR_SEBAGIAN'
    | 'BUKTI_DITOLAK';

/** Tipe pemesanan: internal (dalam kampus) vs external (luar kampus) */
export type UserType = 'internal' | 'external';

/** Informasi pemesan (snapshot dari profil saat booking dibuat) */
export interface BookerInfo {
    name: string;
    institution: string;
    email: string;
    phone: string;
}

/** Bukti pembayaran yang diupload user */
export interface PaymentProof {
    image_url: string;
    /** Nominal yang tertulis di bukti transfer */
    amount_on_receipt: number;
    note?: string;
    uploaded_at: string;
}

/**
 * Pesanan lain yang tanggalnya overlap dengan pesanan ini.
 * Digunakan untuk menampilkan panel konflik di detail.
 */
export interface ConflictingBooking {
    booking_code: string;
    booker_name: string;
    booking_status: BookingStatus;
    start_date: string;
    end_date: string;
}

/** Catatan internal dari admin/manager */
export interface InternalNote {
    id: string;
    author: string;
    content: string;
    created_at: string;
    updated_at?: string;
}

/** Detail layanan yang dipesan (khusus multi-item seperti lab/SAS) */
export interface BookingItem {
    id: string;
    service_name: string;
    quantity: number;
    price: number; // Harga per unit
}

/** Data lengkap satu pesanan (sesuai response API backend) */
export interface Booking {
    id: string;
    booking_code: string;

    // Relasi user & activity
    booker: BookerInfo;
    activity_name: string;

    // Tanggal peminjaman
    start_date: string;   // ISO date string: "2026-03-20"
    end_date: string;     // ISO date string: "2026-03-25"
    duration_days: number;

    // Keuangan (snapshot saat pesanan dibuat)
    price_per_day: number;
    total_price: number;

    // Status
    booking_status: BookingStatus;
    payment_status: PaymentStatus;

    // Tipe pemesanan (internal kampus vs eksternal/umum) — opsional, relevan untuk lab
    user_type?: UserType;
    
    // Nama penyedia layanan (contoh: "Lab Kimia Terpadu")
    provider_name?: string;

    // Nama layanan tunggal (opsional, fallback jika bukan multi-item)
    service_name?: string;

    // Item layanan majemuk (untuk pesanan lebih dari satu layanan)
    items?: BookingItem[];

    // Payload opsional
    special_request?: string;
    rejection_reason?: string;
    payment_deadline?: string; // ISO datetime, muncul setelah terverifikasi
    payment_proofs: PaymentProof[];

    // Data relasi untuk panel konflik
    conflicting_bookings: ConflictingBooking[];

    // Catatan internal
    internal_notes: InternalNote[];

    created_at: string;
    updated_at: string;
}

// ============================================================
// FILTER & SORT TYPES
// ============================================================

/** Opsi filter status pesanan untuk dropdown */
export type BookingStatusFilter =
    | 'SEMUA'
    | 'MENUNGGU_VERIFIKASI_PESANAN'
    | 'PESANAN_TERVERIFIKASI'
    | 'MENUNGGU_VERIFIKASI_PEMBAYARAN'
    | 'LUNAS'
    | 'DIBAYAR_SEBAGIAN'
    | 'PESANAN_DITOLAK';

export interface BookingFilters {
    search: string;
    status: BookingStatusFilter;
    date_from: string;
    date_to: string;
}

// ============================================================
// API REQUEST PAYLOAD TYPES
// Payload dikirim ke backend saat melakukan aksi pada pesanan.
// ============================================================

export interface ApproveBookingPayload {
    payment_deadline: string; // ISO datetime
    admin_note?: string;
}

export interface RejectBookingPayload {
    reason: string;
}

export interface ConfirmPaymentPayload {
    is_lunas: boolean;
    admin_note?: string;
}

export interface RejectPaymentPayload {
    reason: string;
    request_reupload: boolean;
}

export interface NegotiatePricePayload {
    new_price: number;
    note: string;
}

export interface AddInternalNotePayload {
    content: string;
}

export interface UpdateInternalNotePayload {
    content: string;
}

// ============================================================
// API RESPONSE WRAPPER TYPES
// Struktur response standar dari backend Laravel.
// ============================================================

export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
}
