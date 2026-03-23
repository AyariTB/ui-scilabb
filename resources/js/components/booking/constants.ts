/**
 * BOOKING CONSTANTS — Konfigurasi visual dan opsi filter untuk fitur booking.
 * 
 * File ini dipindahkan dari pages/manager/bookings/ ke components/booking/
 * agar bisa dipakai bersama oleh role manager, admin, dan role lainnya.
 */

import type { BookingStatus, PaymentStatus, BookingStatusFilter } from '@/types/booking.types';

/** 
 * KONFIGURASI VISUAL BADGE STATUS PESANAN
 */
export const BOOKING_STATUS_CONFIG: Record<
    BookingStatus,
    { label: string; badgeClass: string; dotClass: string }
> = {
    MENUNGGU_VERIFIKASI_PESANAN: {
        label: 'Menunggu Verif. Pesanan',
        badgeClass: 'bg-amber-50 text-amber-600 border border-amber-200',
        dotClass: 'bg-amber-500',
    },
    PESANAN_TERVERIFIKASI: {
        label: 'Pesanan Terverifikasi',
        badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200',
        dotClass: 'bg-blue-500',
    },
    PESANAN_DITOLAK: {
        label: 'Pesanan Ditolak',
        badgeClass: 'bg-red-50 text-red-700 border border-red-200',
        dotClass: 'bg-red-500',
    },
    DIBATALKAN: {
        label: 'Dibatalkan',
        badgeClass: 'bg-slate-100 text-slate-600 border border-slate-200',
        dotClass: 'bg-slate-400',
    },
    SELESAI: {
        label: 'Selesai',
        badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        dotClass: 'bg-emerald-500',
    },
};

/** 
 * KONFIGURASI VISUAL BADGE STATUS PEMBAYARAN
 */
export const PAYMENT_STATUS_CONFIG: Record<
    PaymentStatus,
    { label: string; badgeClass: string }
> = {
    BELUM_BAYAR: {
        label: 'Belum Bayar',
        badgeClass: 'bg-orange-50 text-orange-600 border border-orange-200',
    },
    MENUNGGU_VERIFIKASI_PEMBAYARAN: {
        label: 'Menunggu Verif. Pembayaran',
        badgeClass: 'bg-amber-50 text-amber-600 border border-amber-200',
    },
    LUNAS: {
        label: 'Lunas',
        badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    },
    DIBAYAR_SEBAGIAN: {
        label: 'Belum Lunas',
        badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    },
    BUKTI_DITOLAK: {
        label: 'Bukti Ditolak',
        badgeClass: 'bg-red-50 text-red-600 border border-red-200',
    },
};

/** 
 * KONFIGURASI VISUAL BADGE TIPE BOOKING (Internal/Eksternal)
 */
export const BOOKING_TYPE_CONFIG: Record<
    'internal' | 'external',
    { label: string; badgeClass: string }
> = {
    internal: {
        label: 'Internal',
        badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200',
    },
    external: {
        label: 'Eksternal',
        badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200',
    },
};

/** 
 * OPSI FILTER STATUS UNTUK DROPDOWN
 */
export const STATUS_FILTER_OPTIONS: { value: BookingStatusFilter; label: string }[] = [
    { value: 'SEMUA', label: 'Semua Status' },
    { value: 'MENUNGGU_VERIFIKASI_PESANAN', label: 'Menunggu Verifikasi Pesanan' },
    { value: 'PESANAN_TERVERIFIKASI', label: 'Pesanan Terverifikasi' },
    { value: 'MENUNGGU_VERIFIKASI_PEMBAYARAN', label: 'Menunggu Verif. Pembayaran' },
    { value: 'LUNAS', label: 'Lunas' },
    { value: 'DIBAYAR_SEBAGIAN', label: 'Belum Lunas' },
    { value: 'PESANAN_DITOLAK', label: 'Ditolak' },
];

export const ROWS_PER_PAGE_OPTIONS = [5, 10, 20];
