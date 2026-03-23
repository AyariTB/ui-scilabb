/**
 * MANAGER BOOKING DETAIL - Halaman detail pesanan bagi manager.
 * 
 * Menggunakan BookingDetailView untuk assembly UI.
 * Menghubungkan ke React Query hooks untuk sinkronisasi data.
 */

import { useParams } from 'react-router-dom';
import ManagerLayout from '@/components/layout/ManagerLayout';
import { BookingDetailView } from '@/components/booking';
import {
    useBookingDetail,
    useApproveBooking,
    useRejectBooking,
    useConfirmPayment,
    useNegotiatePrice,
    useRejectPayment,
    useUnverifyBooking,
    useAddNote,
    useUpdateNote,
    useDeleteNote,
} from '@/hooks/useBooking';

export default function BookingDetail() {
    const { id } = useParams<{ id: string }>();

    // --- Data Fetching ---
    const { data: booking, isLoading, isError } = useBookingDetail(id);

    // --- Mutation Hooks ---
    const approveMutation = useApproveBooking(id!);
    const rejectOrderMutation = useRejectBooking(id!);
    const confirmPaymentMutation = useConfirmPayment(id!);
    const negotiatePriceMutation = useNegotiatePrice(id!);
    const rejectPaymentMutation = useRejectPayment(id!);
    const unverifyMutation = useUnverifyBooking(id!);
    const addNoteMutation = useAddNote(id!);
    const updateNoteMutation = useUpdateNote(id!, ''); // NoteId handled internally
    const deleteNoteMutation = useDeleteNote(id!, '');

    const isActionLoading = 
        approveMutation.isPending || 
        rejectOrderMutation.isPending || 
        confirmPaymentMutation.isPending || 
        negotiatePriceMutation.isPending || 
        rejectPaymentMutation.isPending || 
        unverifyMutation.isPending || 
        addNoteMutation.isPending;

    return (
        <ManagerLayout>
            <BookingDetailView
                booking={booking}
                isLoading={isLoading}
                isError={isError}
                isActionLoading={isActionLoading}
                breadcrumbTitle="Daftar Pesanan"
                breadcrumbUrl="/manager/orders"
                assetLabel="Nama Kapal"
                assetName="KR Unhas Explorer-1"
                
                // Mutation Handlers
                onApprove={async (d) => { await approveMutation.mutateAsync({ payment_deadline: d }); }}
                onRejectOrder={async (r) => { await rejectOrderMutation.mutateAsync({ reason: r }); }}
                onConfirmPayment={async (l) => { await confirmPaymentMutation.mutateAsync({ is_lunas: l }); }}
                onRejectPayment={async (r) => { await rejectPaymentMutation.mutateAsync({ reason: r, request_reupload: true }); }}
                onNegotiatePrice={async (p, n) => { await negotiatePriceMutation.mutateAsync({ new_price: p, note: n }); }}
                onUnverify={async () => { await unverifyMutation.mutateAsync(); }}
                onSaveNote={async (c, nid) => { 
                    if (nid) {
                        await updateNoteMutation.mutateAsync({ content: c }, { onSuccess: () => {}, onSettled: () => {}, onError: () => {} });
                    } else {
                        await addNoteMutation.mutateAsync({ content: c });
                    }
                }}
                onDeleteNote={async (nid) => {
                    await deleteNoteMutation.mutateAsync(undefined, { onSuccess: () => {}, onSettled: () => {}, onError: () => {} });
                }}
            />
        </ManagerLayout>
    );
}
