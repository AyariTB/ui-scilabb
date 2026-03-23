import { Paperclip, ZoomIn, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Booking } from '@/types/booking.types';
import { formatIDR, formatShortDate, getTotalPaid } from '../utils';

interface PaymentTrackingCardProps {
    booking: Booking;
    onZoomImage: (url: string) => void;
}

export function PaymentTrackingCard({ booking, onZoomImage }: PaymentTrackingCardProps) {
    const totalPaid = getTotalPaid(booking);
    const isUnderpaid = totalPaid < booking.total_price && booking.payment_proofs.length > 0;
    const isOverpaid = totalPaid > booking.total_price;
    const isFullyPaid = totalPaid >= booking.total_price && booking.payment_proofs.length > 0;

    if (booking.payment_proofs.length === 0) return null;

    return (
        <div className="rounded-xl border border-slate-border bg-white overflow-hidden">
            <div className="flex items-center gap-2.5 border-b border-slate-border px-5 py-3.5 bg-slate-50/50">
                <span className="p-1.5 rounded-lg bg-white border border-slate-border text-navy">
                    <Paperclip size={15} />
                </span>
                <h2 className="text-sm font-semibold text-navy uppercase tracking-wide">Pembayaran ({booking.payment_proofs.length})</h2>
            </div>
            
            <div className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between rounded-xl bg-slate-50 p-6 border border-slate-border/50 relative overflow-hidden">
                    <div className="relative z-10 text-center sm:text-left space-y-1">
                        <p className="text-xs uppercase text-slate-600 font-bold tracking-wide leading-none">Total Masuk</p>
                        <p className={`text-xl font-bold ${isUnderpaid ? 'text-amber-600' : isOverpaid ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {formatIDR(totalPaid)}
                        </p>
                    </div>
                    
                    <div className="hidden sm:block h-12 w-px bg-slate-border/50" />
                    
                    <div className="relative z-10 text-center sm:text-right space-y-1 mt-4 sm:mt-0">
                        <p className="text-xs uppercase text-slate-600 font-bold tracking-wide leading-none">Status Nominal</p>
                        {isFullyPaid && !isOverpaid ? (
                             <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-sm bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                <CheckCircle2 size={14} /> Tagihan Terlunasi
                             </div>
                        ) : isUnderpaid ? (
                             <div className="flex items-center gap-1.5 text-amber-600 font-semibold text-sm bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                                <AlertTriangle size={14} /> Sisa {formatIDR(booking.total_price - totalPaid)}
                             </div>
                        ) : isOverpaid ? (
                             <div className="flex items-center gap-1.5 text-rose-600 font-semibold text-sm bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                                <AlertTriangle size={14} /> Kelebihan {formatIDR(totalPaid - booking.total_price)}
                             </div>
                        ) : (
                             <p className="text-sm font-semibold text-navy">Belum ada bayaran</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {booking.payment_proofs.map((proof, idx) => (
                        <div key={idx} className="group flex flex-col rounded-xl border border-slate-border overflow-hidden bg-white hover:border-navy/30 transition-all hover:shadow-md animate-in zoom-in-95 duration-300">
                            <div
                                className="group/img relative h-40 cursor-zoom-in overflow-hidden border-b border-slate-border/50 bg-slate-100"
                                onClick={() => onZoomImage(proof.image_url)}
                            >
                                <img
                                    src={proof.image_url}
                                    alt={`Bukti Pembayaran ${idx + 1}`}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover/img:bg-black/40">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 transition-all group-hover/img:opacity-100 group-hover/img:scale-110">
                                        <ZoomIn size={20} />
                                    </div>
                                </div>
                                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/50 backdrop-blur-md text-xs font-semibold text-white tracking-wide uppercase">
                                    #{idx + 1}
                                </div>
                            </div>
                            <div className="p-4 space-y-2">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs text-slate-600 font-bold uppercase tracking-wide">{formatShortDate(proof.uploaded_at)}</span>
                                    <p className="text-lg font-bold text-navy">{formatIDR(proof.amount_on_receipt)}</p>
                                </div>
                                {proof.note && (
                                    <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-100/50">
                                        <p className="text-xs font-medium text-slate-600 leading-relaxed italic line-clamp-2">
                                            "{proof.note}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {isUnderpaid && booking.payment_status === 'MENUNGGU_VERIFIKASI_PEMBAYARAN' && (
                    <div className="flex items-start gap-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4 ring-1 ring-amber-100 animate-in fade-in duration-500">
                        <div className="mt-0.5 p-1.5 rounded-lg bg-white text-amber-500 border border-amber-100">
                            <AlertTriangle size={15} />
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[13px] font-semibold text-amber-800">Pembayaran Belum Mencapai Tagihan</p>
                            <p className="text-xs text-amber-700/80 font-medium leading-relaxed">
                                Total pembayaran yang diunggah baru <span className="font-semibold">{formatIDR(totalPaid)}</span> dari total tagihan <span className="font-semibold">{formatIDR(booking.total_price)}</span>.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
