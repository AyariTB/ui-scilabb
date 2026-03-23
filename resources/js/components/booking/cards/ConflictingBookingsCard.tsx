import { AlertTriangle } from 'lucide-react';
import { Booking, BookingStatus } from '@/types/booking.types';
import { formatShortDate } from '../utils';
import { BOOKING_STATUS_CONFIG } from '../constants';

interface ConflictingBookingsCardProps {
    booking: Booking;
}

export function ConflictingBookingsCard({ booking }: ConflictingBookingsCardProps) {
    if (booking.conflicting_bookings.length === 0) return null;

    return (
        <div className="rounded-xl border border-rose-border bg-white overflow-hidden">
            <div className="flex items-center gap-2.5 border-b border-rose-100 px-5 py-3.5 bg-rose-50/50">
                <span className="p-1.5 rounded-lg bg-white border border-rose-100 text-rose-500">
                    <AlertTriangle size={15} />
                </span>
                <h2 className="text-sm font-semibold text-rose-900 uppercase tracking-wide">Konflik Jadwal ({booking.conflicting_bookings.length})</h2>
            </div>
            
            <div className="p-6 space-y-4">
                <div className="rounded-xl bg-rose-50 border border-rose-100 p-4 space-y-1 animate-in fade-in duration-500 relative overflow-hidden">
                    <p className="text-[13px] font-semibold text-rose-900 flex items-center gap-2">
                        <AlertTriangle size={14} className="animate-pulse" /> Peringatan Overlap Jadwal
                    </p>
                    <p className="text-xs text-rose-800/70 font-medium leading-relaxed max-w-lg">
                        Daftar di bawah ini menunjukkan pesanan lain yang menggunakan periode tanggal yang sama atau bersinggungan dengan pesanan ini.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {booking.conflicting_bookings.map((conflict) => {
                        const cfg = BOOKING_STATUS_CONFIG[conflict.booking_status as BookingStatus];
                        const isVerified = conflict.booking_status === 'PESANAN_TERVERIFIKASI';
                        
                        return (
                            <div key={conflict.booking_code} className={`group flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl border p-4 transition-all hover:bg-slate-50 ${isVerified ? 'border-rose-200 bg-rose-50/20' : 'border-slate-border bg-soft-white'}`}>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className={`text-[15px] font-semibold tracking-tight ${isVerified ? 'text-rose-900' : 'text-navy'}`}>{conflict.booking_code}</p>
                                        <div className={`h-1 w-1 rounded-full ${isVerified ? 'bg-rose-300' : 'bg-slate-300'}`} />
                                        <span className="text-xs font-semibold text-slate-500 capitalize">{conflict.booker_name}</span>
                                    </div>
                                    <p className={`text-[12px] font-semibold ${isVerified ? 'text-rose-700/80' : 'text-slate-600/80'} uppercase tracking-wide`}>
                                        {formatShortDate(conflict.start_date)} – {formatShortDate(conflict.end_date)}
                                    </p>
                                </div>
                                
                                <div className="mt-3 sm:mt-0 flex items-center">
                                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide border ${cfg.badgeClass}`}>
                                        <div className="h-1.5 w-1.5 rounded-full" />
                                        {cfg.label}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
