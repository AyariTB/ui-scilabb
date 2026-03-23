/**
 * BOOKING UTILS - Helper functions untuk formatting dan kalkulasi data booking.
 */

import type { Booking, BookingStatusFilter } from '@/types/booking.types';

// --- FORMAT HELPERS ---
export function formatIDR(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

export function formatFullDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(dateStr));
}

export function formatShortDate(dateStr: string): string {
    if (!dateStr) return '';
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(dateStr));
}

export function formatDateTime(dateStr: string): string {
    if (!dateStr) return '';
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(dateStr));
}

export function formatDateRange(startDate: string, endDate: string): string {
    const start = formatShortDate(startDate);
    const end = formatShortDate(endDate);
    return `${start} - ${end}`;
}

// --- BUSINESS LOGIC HELPERS ---
/** Hitung countdown sisa waktu pembayaran */
export function getPaymentCountdown(deadline: string): { label: string; isUrgent: boolean } {
    const diff = new Date(deadline).getTime() - Date.now();
    if (diff <= 0) return { label: 'Batas waktu telah habis', isUrgent: true };

    const hours = Math.floor(diff / 3_600_000);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return {
            label: `${days} hari ${hours % 24} jam lagi`,
            isUrgent: days <= 1,
        };
    }
    return { label: `${hours} jam lagi`, isUrgent: true };
}

/**
 * Menentukan apakah status pesanan termasuk dalam filter yang dipilih.
 * Filter LUNAS, DIBAYAR_SEBAGIAN, dan MENUNGGU_VERIFIKASI_PEMBAYARAN
 * menggunakan payment_status sebagai kriteria.
 */
export function matchesStatusFilter(booking: Booking, filter: BookingStatusFilter | string): boolean {
    if (filter === 'SEMUA') return true;
    if (filter === 'LUNAS') return booking.payment_status === 'LUNAS';
    if (filter === 'DIBAYAR_SEBAGIAN') return booking.payment_status === 'DIBAYAR_SEBAGIAN';
    if (filter === 'MENUNGGU_VERIFIKASI_PEMBAYARAN')
        return booking.payment_status === 'MENUNGGU_VERIFIKASI_PEMBAYARAN';
    return booking.booking_status === filter;
}

/** Hitung total nominal dari semua bukti pembayaran */
export function getTotalPaid(booking: Booking): number {
    return booking.payment_proofs.reduce((sum, p) => sum + p.amount_on_receipt, 0);
}

/** Apakah booking memiliki konflik dengan pesanan yang sudah terverifikasi */
export function hasApprovedConflict(booking: Booking): boolean {
    return booking.conflicting_bookings.some((c) => c.booking_status === 'PESANAN_TERVERIFIKASI');
}
