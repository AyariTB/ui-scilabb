import { useParams } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
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

export default function OrderDetail() {
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
    const updateNoteMutation = useUpdateNote(id!, ''); // NoteId di-handle internal oleh mock
    const deleteNoteMutation = useDeleteNote(id!, '');

    const isActionLoading = 
        approveMutation.isPending || 
        rejectOrderMutation.isPending || 
        confirmPaymentMutation.isPending || 
        negotiatePriceMutation.isPending || 
        rejectPaymentMutation.isPending || 
        unverifyMutation.isPending || 
        addNoteMutation.isPending;

    // Menentukan kategori dari pesanan secara dinamis (Lab/Kapal/SAS)
    const getCategoryName = () => {
        if (!booking) return "Global";
        const name = (booking.activity_name || booking.service_name || '').toLowerCase();
        if (name.includes('kapal') || name.includes('pelayaran') || name.includes('explorer')) return 'Kapal Riset';
        if (name.includes('stand') || name.includes('mandiri') || name.includes('sas')) return 'Layanan Mandiri';
        // default sebagian besar lab
        const isInternalType = booking.user_type ? true : false; 
        return isInternalType ? 'Laboratorium Riset' : 'Layanan Eksternal Lab';
    };

    return (
        <AdminLayout>
            <BookingDetailView
                booking={booking}
                isLoading={isLoading}
                isError={isError}
                isActionLoading={isActionLoading}
                breadcrumbTitle="Semua Pesanan"
                breadcrumbUrl="/admin/orders"
                assetLabel="Kategori Layanan"
                assetName={getCategoryName()}
                
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
        </AdminLayout>
    );
}
