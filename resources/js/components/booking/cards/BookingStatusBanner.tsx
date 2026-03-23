import { AlertTriangle, XCircle } from 'lucide-react';
import { Booking } from '@/types/booking.types';
import { hasApprovedConflict } from '../utils';

interface BookingStatusBannerProps {
    booking: Booking;
}

/**
 * BOOKING STATUS BANNER
 */
export function BookingStatusBanner({ booking }: BookingStatusBannerProps) {
    const conflictExists = hasApprovedConflict(booking);
    const isOrderRejected = booking.booking_status === 'PESANAN_DITOLAK';
    const isPaymentRejected = booking.payment_status === 'BUKTI_DITOLAK';

    if (!conflictExists && !isOrderRejected && !isPaymentRejected) return null;

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
            {/* KETERANGAN PENOLAKAN PESANAN */}
            {isOrderRejected && (
                <div className="flex items-start gap-4 rounded-xl border border-red-200 bg-red-50/50 p-5 overflow-hidden relative">
                    <div className="mt-0.5 shrink-0 p-2 rounded-lg text-red-600">
                        <XCircle size={20} />
                    </div>
                    <div className="space-y-1 relative z-10">
                        <p className="text-sm font-semibold text-red-800 flex items-center gap-2 uppercase">
                            Pesanan Ditolak
                        </p>
                        <p className="text-[14px] text-red-700 font-normal leading-relaxed max-w-2xl">
                            {booking.rejection_reason || 'Pesanan ini tidak disetujui oleh petugas. Hubungi admin info@kp.ac.id jika ada kendala atau pertanyaan lebih lanjut.'}
                        </p>
                    </div>
                </div>
            )}

            {/* KETERANGAN PENOLAKAN PEMBAYARAN */}
            {isPaymentRejected && (
                <div className="flex items-start gap-4 rounded-xl border border-red-200 bg-red-50/50 p-5 overflow-hidden relative">
                    <div className="mt-0.5 shrink-0 p-2 rounded-lg text-red-600">
                        <AlertTriangle size={20} />
                    </div>
                    <div className="space-y-1 relative z-10">
                        <p className="text-sm font-semibold text-red-800 flex items-center gap-2 uppercase">
                            Bukti Pembayaran Ditolak
                        </p>
                        <p className="text-[14px] text-red-700 font-normal leading-relaxed max-w-2xl">
                            {booking.rejection_reason || 'Bukti bayar tidak sesuai atau tidak valid. Harap periksa rincian transfer Anda.'}
                        </p>
                    </div>
                </div>
            )}

            {/* PERINGATAN KONFLIK JADWAL */}
            {conflictExists && (
                <div className="flex items-start gap-4 rounded-xl border border-red-200 bg-red-50/50 p-5 overflow-hidden relative">
                    <div className="mt-0.5 shrink-0 p-2 rounded-lg text-red-600">
                        <AlertTriangle size={20} />
                    </div>
                    <div className="space-y-1 relative z-10">
                        <p className="text-sm font-semibold text-red-800 flex items-center gap-2 uppercase">
                            Konflik Tanggal Terdeteksi!
                        </p>
                        <p className="text-[14px] text-red-700 font-normal leading-relaxed max-w-2xl">
                            Pesanan ini memiliki periode yang bersamaan (overlap) dengan pesanan lain yang <span className="underline decoration-red-200 decoration-2 font-semibold text-red-800">sudah terverifikasi</span>. 
                            Pastikan jadwal aset tersedia sebelum melanjutkan verifikasi pesanan ini.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
