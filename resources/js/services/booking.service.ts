/**
 * BOOKING SERVICE 
 * Cara pakai:
 *   import { bookingService } from '@/services/booking.service';
 *   bookingService.getAll({ page: 1 });
 */

import apiClient from '@/lib/axios';
import type {
    Booking,
    ApiResponse,
    PaginatedResponse,
    ApproveBookingPayload,
    RejectBookingPayload,
    ConfirmPaymentPayload,
    RejectPaymentPayload,
    NegotiatePricePayload,
    AddInternalNotePayload,
    UpdateInternalNotePayload,
} from '@/types/booking.types';

// --- Query param untuk GET /api/bookings ---
export interface GetBookingsParams {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
    sort_by?: string;
    sort_dir?: 'asc' | 'desc';
}

export const bookingService = {
    // --- READ ---

    /** GET /api/bookings — daftar pesanan dengan filter & paginasi */
    getAll: (params?: GetBookingsParams) =>
        apiClient
            .get<PaginatedResponse<Booking>>('/api/bookings', { params })
            .then((r) => r.data),

    /** GET /api/bookings/:id — detail satu pesanan */
    getById: (id: string) =>
        apiClient
            .get<ApiResponse<Booking>>(`/api/bookings/${id}`)
            .then((r) => r.data.data),

    // --- BOOKING ACTIONS ---

    /** POST /api/bookings/:id/approve */
    approve: (id: string, payload: ApproveBookingPayload) =>
        apiClient
            .post<ApiResponse<Booking>>(`/api/bookings/${id}/approve`, payload)
            .then((r) => r.data.data),

    /** POST /api/bookings/:id/reject */
    reject: (id: string, payload: RejectBookingPayload) =>
        apiClient
            .post<ApiResponse<Booking>>(`/api/bookings/${id}/reject`, payload)
            .then((r) => r.data.data),

    /** POST /api/bookings/:id/unverify */
    unverify: (id: string) =>
        apiClient
            .post<ApiResponse<Booking>>(`/api/bookings/${id}/unverify`)
            .then((r) => r.data.data),

    // --- PAYMENT ACTIONS ---

    /** POST /api/bookings/:id/confirm-payment */
    confirmPayment: (id: string, payload: ConfirmPaymentPayload) =>
        apiClient
            .post<ApiResponse<Booking>>(`/api/bookings/${id}/confirm-payment`, payload)
            .then((r) => r.data.data),

    /** POST /api/bookings/:id/reject-payment */
    rejectPayment: (id: string, payload: RejectPaymentPayload) =>
        apiClient
            .post<ApiResponse<Booking>>(`/api/bookings/${id}/reject-payment`, payload)
            .then((r) => r.data.data),

    /** POST /api/bookings/:id/negotiate-price */
    negotiatePrice: (id: string, payload: NegotiatePricePayload) =>
        apiClient
            .post<ApiResponse<Booking>>(`/api/bookings/${id}/negotiate-price`, payload)
            .then((r) => r.data.data),

    // --- INTERNAL NOTES ---
    addNote: (id: string, payload: AddInternalNotePayload) =>
        apiClient
            .post<ApiResponse<Booking>>(`/api/bookings/${id}/notes`, payload)
            .then((r) => r.data.data),

    /** PUT /api/bookings/:id/notes/:noteId */
    updateNote: (id: string, noteId: string, payload: UpdateInternalNotePayload) =>
        apiClient
            .put<ApiResponse<Booking>>(`/api/bookings/${id}/notes/${noteId}`, payload)
            .then((r) => r.data.data),

    /** DELETE /api/bookings/:id/notes/:noteId */
    deleteNote: (id: string, noteId: string) =>
        apiClient
            .delete<ApiResponse<Booking>>(`/api/bookings/${id}/notes/${noteId}`)
            .then((r) => r.data.data),
};
