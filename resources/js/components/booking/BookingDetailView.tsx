import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    AlertTriangle, ArrowLeft, X,
} from 'lucide-react';

// Shared Components
import { BookingHeader } from './BookingHeader';
import { BookingActionsPanel } from './BookingActionsPanel';
import { 
    BookingStatusBanner, 
    BookerInfoCard, 
    BookingInfoCard, 
    PaymentTrackingCard, 
    ConflictingBookingsCard, 
    InternalNotesCard 
} from './cards';
import { 
    ApproveBookingModal, 
    RejectBookingModal, 
    NegotiatePriceModal, 
    VerifyPaymentChoiceModal, 
    AddNoteModal, 
    ImageZoomModal 
} from './modals';
import { getTotalPaid } from './utils';

import type { Booking } from '@/types/booking.types';

// ---TOAST ---
type ToastType = 'success' | 'error' | 'info';
interface ToastItem { id: string; type: ToastType; message: string }

function ToastContainer({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: string) => void }) {
    const colors: Record<ToastType, string> = { success: 'bg-emerald-600', error: 'bg-red-600', info: 'bg-navy' };
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
            {toasts.map((t) => (
                <div key={t.id} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white border border-white/10 ${colors[t.type]} animate-in slide-in-from-right-5 duration-300`}>
                    <span>{t.message}</span>
                    <button onClick={() => onDismiss(t.id)} className="ml-2 opacity-70 hover:opacity-100"><X size={14} /></button>
                </div>
            ))}
        </div>
    );
}

function useToast() {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const push = useCallback((message: string, type: ToastType = 'success') => {
        const id = crypto.randomUUID();
        setToasts((prev) => [...prev, { id, type, message }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
    }, []);
    const dismiss = useCallback((id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);
    return { toasts, push, dismiss };
}

// --- PROPS ---
export interface BookingDetailViewProps {
    booking: Booking | null | undefined;
    isLoading: boolean;
    isError: boolean;
    isActionLoading: boolean;
    breadcrumbTitle: string;
    breadcrumbUrl: string;
    assetLabel?: string;
    assetName?: string;
    
    // Handlers (Mutations)
    onApprove: (deadline: string) => Promise<void>;
    onRejectOrder: (reason: string) => Promise<void>;
    onConfirmPayment: (isLunas: boolean) => Promise<void>;
    onRejectPayment: (reason: string) => Promise<void>;
    onNegotiatePrice: (newPrice: number, note: string) => Promise<void>;
    onUnverify: () => Promise<void>;
    onSaveNote: (content: string, editingNoteId?: string | null) => Promise<void>;
    onDeleteNote: (noteId: string) => Promise<void>;
}

export function BookingDetailView({
    booking,
    isLoading,
    isError,
    isActionLoading,
    breadcrumbTitle,
    breadcrumbUrl,
    assetLabel = 'Nama Kapal',
    assetName = 'KR Explorer-1',
    onApprove,
    onRejectOrder,
    onConfirmPayment,
    onRejectPayment,
    onNegotiatePrice,
    onUnverify,
    onSaveNote,
    onDeleteNote,
}: BookingDetailViewProps) {
    const navigate = useNavigate();
    const { toasts, push, dismiss } = useToast();

    // Local Modal State
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectOrderModal, setShowRejectOrderModal] = useState(false);
    const [showConfirmPaymentModal, setShowConfirmPaymentModal] = useState(false);
    const [showNegotiateModal, setShowNegotiateModal] = useState(false);
    const [showRejectPaymentModal, setShowRejectPaymentModal] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

    // Skeleton
    if (isLoading) return <DetailSkeleton />;
    
    // Error
    if (isError || !booking) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
                <div className="p-4 rounded-full bg-amber-50 text-amber-500 mb-6 border border-amber-100">
                   <AlertTriangle size={48} />
                </div>
                <h2 className="text-xl font-semibold text-navy">Pesanan Tidak Ditemukan</h2>
                <p className="mt-2 text-sm text-slate-400 max-w-sm leading-relaxed">Sistem tidak berhasil menemukan pesanan dengan ID yang diminta. Pastikan URL atau ID sudah benar.</p>
                <button onClick={() => navigate(breadcrumbUrl)} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-3 text-md font-semibold text-white hover:bg-navy-light transition-all active:scale-95">
                    <ArrowLeft size={16} /> Kembali ke Daftar
                </button>
            </div>
        );
    }

    const totalPaid = getTotalPaid(booking);

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <ToastContainer toasts={toasts} onDismiss={dismiss} />

            {/* --- Modals Assembly --- */}
            <ApproveBookingModal
                isOpen={showApproveModal}
                onClose={() => setShowApproveModal(false)}
                onConfirm={async (d) => { await onApprove(d); setShowApproveModal(false); push('Status Terverifikasi.', 'success'); }}
                isLoading={isActionLoading}
                bookingCode={booking.booking_code} bookerEmail={booking.booker.email}
            />
            <RejectBookingModal
                isOpen={showRejectOrderModal}
                onClose={() => setShowRejectOrderModal(false)}
                onConfirm={async (r) => { await onRejectOrder(r); setShowRejectOrderModal(false); push('Pesanan Ditolak.', 'info'); }}
                isLoading={isActionLoading}
                title="Tolak Pesanan"
                description="Alasan penolakan akan dikirimkan ke email peminjam. Pastikan alasan jelas agar peminjam dapat mengajukan ulang dengan benar."
            />
            <VerifyPaymentChoiceModal
                isOpen={showConfirmPaymentModal}
                onClose={() => setShowConfirmPaymentModal(false)}
                onConfirm={async (l) => { await onConfirmPayment(l); setShowConfirmPaymentModal(false); push('Pembayaran Dikonfirmasi.', 'success');}}
                totalPaid={totalPaid} totalPrice={booking.total_price} isLoading={isActionLoading}
            />
            <NegotiatePriceModal
                isOpen={showNegotiateModal}
                onClose={() => setShowNegotiateModal(false)}
                onConfirm={async (p, n) => { await onNegotiatePrice(p, n); setShowNegotiateModal(false); push('Harga Diupdate.', 'success'); }}
                currentPrice={booking.total_price} isLoading={isActionLoading}
            />
            <RejectBookingModal
                isOpen={showRejectPaymentModal}
                onClose={() => setShowRejectPaymentModal(false)}
                onConfirm={async (r) => { await onRejectPayment(r); setShowRejectPaymentModal(false); push('Bukti Bayar Ditolak.', 'info'); }}
                isLoading={isActionLoading}
                title="Tolak Bukti Pembayaran"
                description="Pastikan bukti pembayaran memang tidak sesuai atau tidak valid sebelum menolak. Alasan penolakan akan dikirimkan ke peminjam."
            />
            <AddNoteModal
                isOpen={showNoteModal} onClose={() => { setShowNoteModal(false); setEditingNoteId(null); }}
                onConfirm={async (c) => { await onSaveNote(c, editingNoteId); setShowNoteModal(false); setEditingNoteId(null); push('Catatan Disimpan.', 'success'); }}
                isLoading={isActionLoading}
                initialContent={editingNoteId ? booking.internal_notes.find(n => n.id === editingNoteId)?.content : ''}
                title={editingNoteId ? 'Ubah Catatan' : 'Tambah Catatan'}
            />
            <ImageZoomModal imageUrl={zoomImageUrl || ''} isOpen={!!zoomImageUrl} onClose={() => setZoomImageUrl(null)} />

            {/* --- Layout Assembly --- */}
            <BookingHeader 
                booking={booking}
                breadcrumbTitle={breadcrumbTitle}
                breadcrumbUrl={breadcrumbUrl}
                onNegotiate={() => setShowNegotiateModal(true)}
                onAddNote={() => setShowNoteModal(true)}
                onSendEmail={() => push('Fitur email akan tersedia segera.', 'info')}
            />

            <BookingStatusBanner booking={booking} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Kolom Kiri: Detil Content */}
                <div className="lg:col-span-2 space-y-6">
                    <BookerInfoCard booking={booking} />
                    <BookingInfoCard booking={booking} />
                    <PaymentTrackingCard booking={booking} onZoomImage={setZoomImageUrl} />
                    <ConflictingBookingsCard booking={booking} />
                    <InternalNotesCard 
                        booking={booking} 
                        onAddNote={() => setShowNoteModal(true)}
                        onEditNote={(id) => { setEditingNoteId(id); setShowNoteModal(true); }}
                        onDeleteNote={async (id) => { if (confirm('Hapus catatan?')) { await onDeleteNote(id); push('Catatan Dihapus.', 'info'); } }}
                    />
                </div>

                {/* Kolom Kanan: Aksi Sidebar */}
                <div className="relative">
                    <BookingActionsPanel 
                        booking={booking}
                        actionLoading={isActionLoading}
                        assetLabel={assetLabel}
                        assetName={assetName}
                        onApprove={() => setShowApproveModal(true)}
                        onRejectOrder={() => setShowRejectOrderModal(true)}
                        onConfirmPayment={() => setShowConfirmPaymentModal(true)}
                        onRejectPayment={() => setShowRejectPaymentModal(true)}
                        onUnverify={async () => { await onUnverify(); push('Verifikasi Dibatalkan.', 'info'); }}
                    />
                </div>
            </div>
        </div>
    );
}

import { Skeleton, CardSkeleton } from '../ui/Skeleton';

/** HELPER: Skeleton Loading State */
function DetailSkeleton() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
            {/* Header Skeleton */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between py-2">
                <div className="space-y-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-64" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-24 rounded-lg" />
                    <Skeleton className="h-10 w-24 rounded-lg" />
                </div>
            </div>

            {/* Banner Skeleton */}
            <Skeleton className="h-28 w-full rounded-2xl" />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Content Side */}
                <div className="lg:col-span-2 space-y-6">
                    <CardSkeleton />
                    <CardSkeleton />
                    <div className="rounded-xl border border-slate-border/50 bg-white p-6 space-y-6">
                        <Skeleton className="h-6 w-1/4" />
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-32 rounded-lg" />
                            <Skeleton className="h-32 rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* Sidebar Side */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-slate-border/50 bg-white p-6 space-y-6 h-[400px]">
                        <Skeleton className="h-6 w-1/2" />
                        <div className="space-y-4">
                            <Skeleton className="h-12 w-full rounded-xl" />
                            <Skeleton className="h-24 w-full rounded-xl" />
                            <Skeleton className="h-12 w-full rounded-xl" />
                        </div>
                        <div className="pt-10 space-y-3">
                             <Skeleton className="h-10 w-full rounded-lg" />
                             <Skeleton className="h-10 w-full rounded-lg opacity-50" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
