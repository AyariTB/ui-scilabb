import { CalendarDays, Clock, CheckCircle2, Info, Layout } from 'lucide-react';
import { Booking } from '@/types/booking.types';
import { formatIDR, formatShortDate } from '../utils';

interface BookingInfoCardProps {
    booking: Booking;
}

/**
 * BOOKING INFO CARD
 * Menampilkan detail peminjaman: nama kegiatan, durasi, dan rincian harga.
 */
export function BookingInfoCard({ booking }: BookingInfoCardProps) {
    const getCategoryName = (b: Booking) => {
        const name = (b.activity_name || b.service_name || '').toLowerCase();
        if (name.includes('kapal') || name.includes('pelayaran') || name.includes('explorer')) return 'Kapal Riset';
        if (name.includes('stand') || name.includes('mandiri') || name.includes('sas')) return 'Layanan Mandiri (SAS)';
        return 'Laboratorium';
    };

    return (
        <div className="rounded-xl border border-slate-border bg-white overflow-hidden">
            <div className="flex items-center gap-2.5 border-b border-slate-border px-5 py-3.5 bg-slate-50/50">
                <span className="p-1.5 rounded-lg bg-white border border-slate-border text-navy">
                    <CalendarDays size={16} />
                </span>
                <h2 className="text-sm font-semibold text-navy uppercase">Detail Peminjaman</h2>
            </div>

            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="sm:col-span-2">
                        <p className="text-xs uppercase text-slate-600 font-semibold mb-1.5 leading-none">Nama Kegiatan / Agenda</p>
                        <p className="text-lg font-semibold text-navy leading-tight">{booking.activity_name}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase text-slate-600 font-semibold mb-1.5 leading-none">Kategori Pesanan</p>
                        <p className="text-sm font-semibold text-navy flex items-center gap-1.5">
                            {getCategoryName(booking)}
                        </p>
                    </div>
                    {booking.service_name && (
                        <div>
                           <p className="text-xs uppercase text-slate-600 font-semibold mb-1.5 leading-none">Layanan</p>
                           <p className="text-sm font-semibold text-navy flex items-center gap-1.5">
                              <Layout size={14} className="text-slate-600" /> {booking.service_name}
                           </p>
                        </div>
                    )}
                    {booking.user_type && (
                        <div>
                           <p className="text-xs uppercase text-slate-600 font-semibold mb-1.5 leading-none">Tipe Akun</p>
                           <p className="text-sm font-semibold text-navy">
                              {booking.user_type === 'internal' ? (
                                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100 uppercase">Internal</span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 border border-amber-100 uppercase">Eksternal</span>
                              )}
                           </p>
                        </div>
                    )}
                    {booking.provider_name && (
                        <div>
                           <p className="text-xs uppercase text-slate-600 font-semibold mb-1.5 leading-none">Penyedia</p>
                           <p className="text-sm font-semibold text-navy">
                              {booking.provider_name}
                           </p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl bg-soft-white p-4 border border-slate-border">
                        <p className="text-xs uppercase text-slate-600 font-semibold mb-1 leading-none">Mulai</p>
                        <p className="text-base font-semibold text-navy">{formatShortDate(booking.start_date)}</p>
                    </div>
                    <div className="rounded-xl bg-soft-white p-4 border border-slate-border">
                        <p className="text-xs uppercase text-slate-600 font-semibold mb-1 leading-none">Selesai</p>
                        <p className="text-base font-semibold text-navy">{formatShortDate(booking.end_date)}</p>
                    </div>
                    <div className="rounded-xl bg-soft-white p-4 border border-slate-border flex flex-col justify-center">
                        <p className="text-xs uppercase text-slate-600 font-semibold mb-1 leading-none">Durasi</p>
                        <div className="flex items-center gap-2">
                           <Clock size={16} className="text-slate-600 shrink-0" />
                           <p className="text-base font-semibold text-slate-700">{booking.duration_days} hari</p>
                        </div>
                    </div>
                </div>

                {/* TAMPILAN MULTI-ITEM JIKA ADA */}
                {booking.items && booking.items.length > 0 && (
                    <div className="rounded-xl border border-slate-border bg-slate-50/50 p-4 pb-1">
                        <p className="text-xs uppercase text-slate-600 font-semibold mb-3 leading-none">Daftar Layanan Dipesan</p>
                        <div className="space-y-3">
                            {booking.items.map(item => (
                                <div key={item.id} className="flex items-center justify-between pb-3 border-b border-slate-border/80 last:border-0 last:pb-3">
                                    <div>
                                        <p className="text-sm font-semibold text-navy mb-0.5">{item.service_name}</p>
                                        <p className="text-xs font-medium text-slate-500">
                                            {item.quantity} &times; {formatIDR(item.price)}
                                        </p>
                                    </div>
                                    <p className="text-sm font-bold text-navy">
                                        {formatIDR(item.quantity * item.price)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="relative rounded-xl border border-slate-border bg-slate-50/50 p-6 overflow-hidden">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 text-center sm:text-left">
                        <div>
                            <p className="text-xs uppercase text-slate-600 font-semibold mb-1.5">Harga / Hari</p>
                            <p className="text-lg font-semibold text-navy">{formatIDR(booking.price_per_day)}</p>
                        </div>

                        <div className="hidden sm:block h-10 w-px bg-slate-border/50" />

                        <div>
                            <p className="text-xs uppercase text-slate-600 font-semibold mb-1.5">Periode</p>
                            <p className="text-lg font-semibold text-navy">{booking.duration_days} hari</p>
                        </div>

                        <div className="hidden sm:block h-10 w-px bg-slate-border/50" />

                        <div className="px-5 py-3 rounded-xl min-w-[160px] text-center sm:text-right">
                            <p className="text-[12px] uppercase text-navy font-semibold mb-0.5 flex items-center justify-center sm:justify-end gap-1.5">
                                <CheckCircle2 size={11} className="text-emerald-500" /> Total Tagihan
                            </p>
                            <p className="text-xl font-semibold text-navy">{formatIDR(booking.total_price)}</p>
                        </div>
                    </div>
                </div>

                {booking.special_request && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 relative group">
                        <div className="flex items-center gap-2 text-amber-700 mb-2">
                           <Info size={15} className="shrink-0" />
                           <h4 className="text-[11px] uppercase font-semibold leading-none">Catatan Khusus dari Peminjam</h4>
                        </div>
                        <p className="text-[14px] font-medium text-amber-900 leading-relaxed italic">
                           "{booking.special_request}"
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
