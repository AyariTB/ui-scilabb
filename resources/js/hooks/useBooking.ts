/**
 * Saat ini menggunakan MOCK_BOOKINGS. Untuk integrasi backend:
 * 1. Uncomment baris yang menggunakan bookingService
 * 2. Hapus/comment baris yang menggunakan MOCK_BOOKINGS
 * 3. Tidak ada perubahan yang diperlukan di komponen UI
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService, type GetBookingsParams } from '@/services/booking.service';
import { MOCK_BOOKINGS } from '@/mocks/booking.mock';
import type {
    Booking,
    ApproveBookingPayload,
    RejectBookingPayload,
    ConfirmPaymentPayload,
    RejectPaymentPayload,
    NegotiatePricePayload,
    AddInternalNotePayload,
    UpdateInternalNotePayload,
} from '@/types/booking.types';

// --- QUERY KEYS (sentralisasi agar mudah di-invalidate) ---
export const bookingKeys = {
    all: ['bookings'] as const,
    lists: () => [...bookingKeys.all, 'list'] as const,
    list: (params: GetBookingsParams) => [...bookingKeys.lists(), params] as const,
    details: () => [...bookingKeys.all, 'detail'] as const,
    detail: (id: string) => [...bookingKeys.details(), id] as const,
};

// --- READ HOOKS ---

/**
 * Hook untuk mengambil daftar pesanan.
 * Mengembalikan data dalam format yang siap untuk tabel (sudah flat, tidak perlu wrapping).
 *
 * TODO Integrasi: Ganti implementasi queryFn dengan bookingService.getAll(params)
 */
export function useBookings(params?: GetBookingsParams) {
    return useQuery({
        queryKey: bookingKeys.list(params ?? {}),
        queryFn: async (): Promise<Booking[]> => {
            // --- MOCK (hapus saat integrasi) ---
            await new Promise((r) => setTimeout(r, 400));
            return MOCK_BOOKINGS;

            // --- PRODUKSI (uncomment saat integrasi) ---
            // const response = await bookingService.getAll(params);
            // return response.data;
        },
        staleTime: 1000 * 30, // 30 detik sebelum refetch otomatis
    });
}

/**
 * Hook untuk mengambil detail satu pesanan berdasarkan ID.
 *
 * TODO Integrasi: Ganti implementasi queryFn dengan bookingService.getById(id)
 */
export function useBookingDetail(id: string | undefined) {
    return useQuery({
        queryKey: bookingKeys.detail(id ?? ''),
        queryFn: async (): Promise<Booking> => {
            // --- MOCK (hapus saat integrasi) ---
            await new Promise((r) => setTimeout(r, 600));
            const found = MOCK_BOOKINGS.find((b) => b.id === id);
            if (!found) throw new Error('Pesanan tidak ditemukan');
            return found;

            // --- PRODUKSI (uncomment saat integrasi) ---
            // return bookingService.getById(id!);
        },
        enabled: !!id,
        staleTime: 1000 * 30,
    });
}

// --- MUTATION HOOKS ---
// Setiap mutasi otomatis membatalkan cache detail booking terkait
// sehingga UI akan refresh dengan data terbaru dari server.

function useBookingMutation<TVariables>(
    id: string,
    mutationFn: (variables: TVariables) => Promise<Booking>
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn,
        onSuccess: (updatedBooking) => {
            // Update cache detail langsung dengan data dari server
            queryClient.setQueryData(bookingKeys.detail(id), updatedBooking);
            // Invalidate list agar badge counter dan tabel ikut terupdate
            queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
        },
    });
}

/** Setujui pesanan: POST /api/bookings/:id/approve */
export function useApproveBooking(id: string) {
    return useBookingMutation<ApproveBookingPayload>(id, async (payload) => {
        // --- MOCK ---
        await new Promise((r) => setTimeout(r, 1200));
        const booking = MOCK_BOOKINGS.find((b) => b.id === id)!;
        return { ...booking, booking_status: 'PESANAN_TERVERIFIKASI', payment_deadline: payload.payment_deadline } as Booking;
        // --- PRODUKSI ---
        // return bookingService.approve(id, payload);
    });
}

/** Tolak pesanan: POST /api/bookings/:id/reject */
export function useRejectBooking(id: string) {
    return useBookingMutation<RejectBookingPayload>(id, async (payload) => {
        // --- MOCK ---
        await new Promise((r) => setTimeout(r, 1000));
        const booking = MOCK_BOOKINGS.find((b) => b.id === id)!;
        return { ...booking, booking_status: 'PESANAN_DITOLAK', rejection_reason: payload.reason } as Booking;
        // --- PRODUKSI ---
        // return bookingService.reject(id, payload);
    });
}

/** Batalkan verifikasi: POST /api/bookings/:id/unverify */
export function useUnverifyBooking(id: string) {
    return useBookingMutation<void>(id, async () => {
        // --- MOCK ---
        await new Promise((r) => setTimeout(r, 800));
        const booking = MOCK_BOOKINGS.find((b) => b.id === id)!;
        return { ...booking, booking_status: 'MENUNGGU_VERIFIKASI_PESANAN' } as Booking;
        // --- PRODUKSI ---
        // return bookingService.unverify(id);
    });
}

/** Konfirmasi pembayaran: POST /api/bookings/:id/confirm-payment */
export function useConfirmPayment(id: string) {
    return useBookingMutation<ConfirmPaymentPayload>(id, async (payload) => {
        // --- MOCK ---
        await new Promise((r) => setTimeout(r, 1000));
        const booking = MOCK_BOOKINGS.find((b) => b.id === id)!;
        return { ...booking, payment_status: payload.is_lunas ? 'LUNAS' : 'DIBAYAR_SEBAGIAN' } as Booking;
        // --- PRODUKSI ---
        // return bookingService.confirmPayment(id, payload);
    });
}

/** Tolak bukti pembayaran: POST /api/bookings/:id/reject-payment */
export function useRejectPayment(id: string) {
    return useBookingMutation<RejectPaymentPayload>(id, async (payload) => {
        // --- MOCK ---
        await new Promise((r) => setTimeout(r, 1000));
        const booking = MOCK_BOOKINGS.find((b) => b.id === id)!;
        return { ...booking, payment_status: 'BUKTI_DITOLAK', rejection_reason: payload.reason } as Booking;
        // --- PRODUKSI ---
        // return bookingService.rejectPayment(id, payload);
    });
}

/** Negosiasi harga: POST /api/bookings/:id/negotiate-price */
export function useNegotiatePrice(id: string) {
    return useBookingMutation<NegotiatePricePayload>(id, async (payload) => {
        // --- MOCK ---
        await new Promise((r) => setTimeout(r, 1200));
        const booking = MOCK_BOOKINGS.find((b) => b.id === id)!;
        const priceNote = {
            id: crypto.randomUUID(),
            author: 'System (Negosiasi)',
            content: `Total harga diubah ke Rp ${payload.new_price.toLocaleString('id-ID')}. Catatan: ${payload.note}`,
            created_at: new Date().toISOString(),
        };
        return { ...booking, total_price: payload.new_price, internal_notes: [...booking.internal_notes, priceNote] } as Booking;
        // --- PRODUKSI ---
        // return bookingService.negotiatePrice(id, payload);
    });
}

/** Tambah catatan internal: POST /api/bookings/:id/notes */
export function useAddNote(id: string) {
    return useBookingMutation<AddInternalNotePayload>(id, async (payload) => {
        // --- MOCK ---
        await new Promise((r) => setTimeout(r, 500));
        const booking = MOCK_BOOKINGS.find((b) => b.id === id)!;
        const newNote = { id: crypto.randomUUID(), author: 'Admin Kapal', content: payload.content, created_at: new Date().toISOString() };
        return { ...booking, internal_notes: [...booking.internal_notes, newNote] } as Booking;
        // --- PRODUKSI ---
        // return bookingService.addNote(id, payload);
    });
}

/** Update catatan internal: PUT /api/bookings/:id/notes/:noteId */
export function useUpdateNote(id: string, noteId: string) {
    return useBookingMutation<UpdateInternalNotePayload>(id, async (payload) => {
        // --- MOCK ---
        await new Promise((r) => setTimeout(r, 500));
        const booking = MOCK_BOOKINGS.find((b) => b.id === id)!;
        return {
            ...booking,
            internal_notes: booking.internal_notes.map((n) =>
                n.id === noteId ? { ...n, content: payload.content, updated_at: new Date().toISOString() } : n
            ),
        } as Booking;
        // --- PRODUKSI ---
        // return bookingService.updateNote(id, noteId, payload);
    });
}

/** Hapus catatan internal: DELETE /api/bookings/:id/notes/:noteId */
export function useDeleteNote(id: string, noteId: string) {
    return useBookingMutation<void>(id, async () => {
        // --- MOCK ---
        await new Promise((r) => setTimeout(r, 500));
        const booking = MOCK_BOOKINGS.find((b) => b.id === id)!;
        return { ...booking, internal_notes: booking.internal_notes.filter((n) => n.id !== noteId) } as Booking;
        // --- PRODUKSI ---
        // return bookingService.deleteNote(id, noteId);
    });
}
