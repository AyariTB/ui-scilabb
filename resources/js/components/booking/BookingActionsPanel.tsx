/**
 * BOOKING ACTIONS PANEL — Panel aksi utama (sidebar) untuk memproses pesanan.
 * 
 * Komponen shared yang menampilkan tombol-tombol aksi berdasarkan status pesanan.
 * Bisa digunakan oleh role manager maupun admin.
 */

import { CheckCircle2, XCircle, AlertTriangle, Clock, Loader2, Info } from 'lucide-react';
import type { Booking } from '@/types/booking.types';
import { formatIDR, formatShortDate, formatDateTime, getPaymentCountdown, getTotalPaid, hasApprovedConflict } from './utils';

interface BookingActionsPanelProps {
    booking: Booking;
    actionLoading: boolean;
    onApprove: () => void;
    onRejectOrder: () => void;
    onConfirmPayment: () => void;
    onRejectPayment: () => void;
    onUnverify: () => void;
    /** Label untuk "Nama Kapal" atau "Nama Lab" di ringkasan */
    assetLabel?: string;
    /** Nama aset yang ditampilkan di ringkasan. Default: 'KR Explorer-1' */
    assetName?: string;
}

export function BookingActionsPanel({
    booking,
    actionLoading,
    onApprove,
    onRejectOrder,
    onConfirmPayment,
    onRejectPayment,
    onUnverify,
    assetLabel = 'Nama Kapal',
    assetName = 'KR Explorer-1',
}: BookingActionsPanelProps) {
    const conflictExists = hasApprovedConflict(booking);
    const totalPaid = getTotalPaid(booking);

    // Filter Logic untuk tampilan panel
    const isWaitingVerification = booking.booking_status === 'MENUNGGU_VERIFIKASI_PESANAN';
    const isWaitingPaymentVerification = booking.payment_status === 'MENUNGGU_VERIFIKASI_PEMBAYARAN';
    const isApprovedNoPayment = (booking.booking_status === 'PESANAN_TERVERIFIKASI' || booking.booking_status === 'SELESAI') && booking.payment_status === 'BELUM_BAYAR';

    // Status fleksibilitas: Hanya bisa reset/tolak jika pembayaran belum diverifikasi
    const canReverify = booking.booking_status !== 'MENUNGGU_VERIFIKASI_PESANAN' &&
                        booking.payment_status !== 'LUNAS' &&
                        booking.payment_status !== 'DIBAYAR_SEBAGIAN' &&
                        booking.payment_status !== 'BUKTI_DITOLAK';

    const isUnderpaid = totalPaid < booking.total_price && booking.payment_proofs.length > 0;
    const paymentCountdown = booking.payment_deadline ? getPaymentCountdown(booking.payment_deadline) : null;

    return (
        <div className="space-y-4 sticky top-10">
            {/* 1. SECTION AKSI UTAMA BERDASARKAN STATUS */}

            {/* A. Verifikasi Pesanan Baru */}
            {isWaitingVerification && (
                <div className="rounded-xl border border-slate-border bg-white p-5 space-y-4 animate-in slide-in-from-right-5 duration-500">
                    <div className="space-y-1">
                       <h3 className="text-sm font-semibold text-navy flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-blue-500" /> Verifikasi Pesanan
                       </h3>
                       <p className="text-[14px] text-slate-500 font-medium leading-relaxed">
                          Tinjau detail logistik & durasi sebelum menyetujui pesanan ini.
                       </p>
                    </div>

                    {conflictExists && (
                        <div className="flex items-start gap-2.5 rounded-lg bg-red-50 border border-red-100 p-3">
                            <AlertTriangle size={15} className="mt-0.5 shrink-0 text-red-500" />
                            <p className="text-[11px] text-red-800 font-semibold leading-relaxed">
                                OVERLAP: Ada pesanan lain di tanggal yang sama.
                            </p>
                        </div>
                    )}

                    <div className="space-y-2 pt-1">
                        <button
                            onClick={onApprove}
                            disabled={actionLoading}
                            className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 text-[14px] font-semibold text-white hover:bg-emerald-700 transition-all active:scale-95"
                        >
                            <CheckCircle2 size={16} /> Setujui Pesanan
                        </button>
                        <button
                            onClick={onRejectOrder}
                            disabled={actionLoading}
                            className="w-full flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white py-3 text-[14px] font-semibold text-red-600 hover:bg-red-50 transition-all active:scale-95"
                        >
                            <XCircle size={16} /> Tolak Pesanan
                        </button>
                    </div>
                </div>
            )}

            {/* B. Verifikasi Bukti Pembayaran */}
            {isWaitingPaymentVerification && (
                <div className="rounded-xl border border-slate-border bg-white p-5 space-y-4 animate-in slide-in-from-right-5 duration-500">
                    <div className="space-y-1">
                       <h3 className="text-sm font-semibold text-emerald-700 flex items-center gap-2">
                          <Clock size={16} /> Verifikasi Pembayaran
                       </h3>
                       <p className="text-[14px] text-slate-500 font-medium leading-relaxed">
                          Validasi bukti transfer yang diunggah oleh peminjam.
                       </p>
                    </div>

                    {isUnderpaid && (
                        <div className="flex items-center gap-2.5 rounded-lg bg-amber-50 border border-amber-100 p-3">
                            <AlertTriangle size={15} className="shrink-0 text-amber-500" />
                            <p className="text-[12px] text-amber-800 font-medium">
                                PEMBAYARAN KURANG: Total nominal belum mencapai tagihan.
                            </p>
                        </div>
                    )}

                    <div className="space-y-2 pt-1">
                        <button
                            onClick={onConfirmPayment}
                            disabled={actionLoading}
                            className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-all active:scale-95"
                        >
                            <CheckCircle2 size={16} /> Konfirmasi Bayar
                        </button>
                        <button
                            onClick={onRejectPayment}
                            disabled={actionLoading}
                            className="w-full flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-all active:scale-95"
                        >
                            <XCircle size={16} /> Tolak Bukti
                        </button>
                    </div>
                </div>
            )}

            {/* C. Countdown Deadline (Post Verification) */}
            {isApprovedNoPayment && paymentCountdown && (
                <div className={`rounded-xl border p-5 space-y-4 animate-in fade-in duration-500 ${paymentCountdown.isUrgent ? 'border-red-200 bg-red-50/50' : 'border-amber-200 bg-amber-50/50'}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className={paymentCountdown.isUrgent ? 'text-red-500 animate-pulse' : 'text-amber-500'} />
                            <h4 className={`text-[11px] font-semibold uppercase tracking-wide ${paymentCountdown.isUrgent ? 'text-red-800' : 'text-amber-800'}`}>
                                Batas Waktu Bayar
                            </h4>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <p className={`text-xl font-semibold tracking-tight ${paymentCountdown.isUrgent ? 'text-red-600' : 'text-amber-600'}`}>
                             {paymentCountdown.label}
                        </p>
                        <p className={`text-[12px] font-medium ${paymentCountdown.isUrgent ? 'text-red-700/70' : 'text-amber-700/70'}`}>
                           Deadline: <span className="font-semibold">{formatDateTime(booking.payment_deadline || '')}</span>
                        </p>
                    </div>

                    <div className={`rounded-lg p-2 border ${paymentCountdown.isUrgent ? 'bg-red-100/50 border-red-200/50 text-red-800' : 'bg-amber-100/50 border-amber-200/50 text-amber-800'}`}>
                       <p className="text-[11px] font-medium leading-relaxed flex items-start gap-2">
                          <Info size={14} className="shrink-0 mt-0.5" />
                          Sistem akan membatalkan otomatis jika melewati batas waktu.
                       </p>
                    </div>
                </div>
            )}

            {/* D. Status Lunas Success State */}
            {booking.payment_status === 'LUNAS' && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-6 text-center space-y-3 animate-in zoom-in-95 duration-500">
                    <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-1">
                        <CheckCircle2 size={24} />
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-base font-semibold text-emerald-900">Pembayaran Lunas</p>
                        <p className="text-sm font-medium text-emerald-700">{formatIDR(booking.total_price)} Terverifikasi</p>
                    </div>
                    <div className="pt-1">
                       <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-[14px] font-semibold text-emerald-700 border border-emerald-200">
                          Selesai Diproses
                       </span>
                    </div>
                </div>
            )}

            {/* 2. RE-VERIFICATION & QUICK ACTIONS (Conditional) */}
            {canReverify && (
                <div className="rounded-xl border border-slate-border bg-white p-5 space-y-3">
                    <h3 className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                        <Info size={14} /> Kelola Status
                    </h3>
                    <button
                        onClick={onUnverify}
                        disabled={actionLoading}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-slate-border bg-soft-white py-2.5 text-[12px] font-medium text-navy hover:bg-slate-100 transition-all active:scale-95"
                    >
                        {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <Clock size={14} />}
                        Batal Verifikasi
                    </button>
                    <p className="text-[11px] text-slate-600 text-center">
                        Batal verifikasi mengembalikan status ke antrian baru.
                    </p>
                </div>
            )}

            {/* ORDER SUMMARY CARD */}
            <div className="rounded-xl border border-slate-border bg-white p-5 space-y-4">
                <h3 className="text-[16px] font-semibold text-navy border-b border-slate-border pb-3">Ringkasan Pesanan</h3>
                <div className="space-y-3">
                    <SummaryRow label="Kode Pesanan" value={booking.booking_code} emphasize />
                    <SummaryRow label={assetLabel} value={assetName} />
                    {booking.service_name && (
                        <SummaryRow label="Layanan" value={booking.service_name} />
                    )}
                    {booking.user_type && (
                        <SummaryRow label="Tipe" value={booking.user_type === 'internal' ? 'Internal' : 'Eksternal'} />
                    )}
                    <SummaryRow label="Mulai" value={formatShortDate(booking.start_date)} />
                    <SummaryRow label="Selesai" value={formatShortDate(booking.end_date)} />
                    <SummaryRow label="Periode" value={`${booking.duration_days} Hari`} emphasize />
                    <div className="pt-2 border-t border-slate-border">
                        <div className="flex justify-between items-center">
                            <span className="text-md font-medium text-navy">Total Akhir</span>
                            <span className="text-md font-semibold text-navy">{formatIDR(booking.total_price)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/** HELPER */
function SummaryRow({ label, value, emphasize = false }: { label: string; value: string; emphasize?: boolean }) {
    return (
        <div className="flex justify-between items-center group/row">
            <span className="text-[14px] text-slate-600 font-medium">{label}</span>
            <span className={`text-[14px] font-medium ${emphasize ? 'text-navy underline decoration-navy/10 underline-offset-4' : 'text-navy/80'}`}>{value}</span>
        </div>
    );
}
