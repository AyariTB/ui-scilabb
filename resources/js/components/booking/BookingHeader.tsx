import { ArrowLeft, Edit3, Send, Printer, StickyNote, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Booking } from '@/types/booking.types';
import { formatDateTime } from './utils';
import { BOOKING_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from './constants';

interface BookingHeaderProps {
    booking: Booking;
    onNegotiate: () => void;
    onAddNote: () => void;
    onSendEmail: () => void;
    /** Judul Breadcrumb (misal: "Daftar Pesanan") */
    breadcrumbTitle: string;
    /** URL untuk Breadcrumb (misal: "/manager/orders") */
    breadcrumbUrl: string;
}

/**
 * BOOKING HEADER
 * Menampilkan breadcrumb, judul pesanan (kode), status, dan aksi utama di bagian atas.
 */
export function BookingHeader({ 
    booking, 
    onNegotiate, 
    onAddNote, 
    onSendEmail,
    breadcrumbTitle,
    breadcrumbUrl
}: BookingHeaderProps) {
    const navigate = useNavigate();
    const bookingStatusCfg = BOOKING_STATUS_CONFIG[booking.booking_status];
    const paymentStatusCfg = PAYMENT_STATUS_CONFIG[booking.payment_status];

    return (
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between bg-soft-white py-4 border-b border-transparent transition-all group-scroll:border-slate-border">
            {/* Left Section: Breadcrumb + Title */}
            <div className="space-y-4">
                {/* Breadcrumb Hierarchy */}
                <div className="flex items-center gap-2.5 text-sm font-semibold uppercase text-slate-600">
                    <button 
                        onClick={() => navigate(breadcrumbUrl)} 
                        className="hover:text-navy transition-colors flex items-center gap-2 group/home"
                    >
                        <ArrowLeft size={18} className="group-hover/home:-translate-x-0.5 transition-transform" /> 
                        {breadcrumbTitle}
                    </button>
                    <ChevronRight size={14} className="text-slate-300" />
                    <span className="text-navy/40 font-medium">Detail #{booking.booking_code}</span>
                </div>

                {/* Main Heading */}
                <div className="space-y-1.5 group/header">
                    <div className="flex flex-col gap-2 relative">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-semibold text-navy">
                                {booking.booking_code}
                            </h1>
                        </div>

                        {/* Timestamp Info */}
                        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 uppercase ml-1">
                            <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-lg border border-slate-border/50">
                                Dibuat <span className="text-navy font-bold">{formatDateTime(booking.created_at)}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-lg border border-slate-border/50">
                                Update <span className="text-navy font-bold">{formatDateTime(booking.updated_at)}</span>
                            </div>
                        </div>

                        {/* Status Badges Row */}
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <div className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 ring-inset ring-slate-border/50 ${bookingStatusCfg.badgeClass}`}>
                                {bookingStatusCfg.label}
                            </div>
                            <div className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 ring-inset ring-slate-border/50 ${paymentStatusCfg.badgeClass}`}>
                                {paymentStatusCfg.label}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section: Action Palette */}
            <div className="flex shrink-0 flex-wrap items-center gap-3 mt-4 sm:mt-10">
                {/* Secondary Actions */}
                <div className="flex items-center gap-2 bg-white/60 rounded-2xl border border-slate-border p-1.5">
                    <HeaderActionBtn 
                        onClick={onNegotiate}
                        icon={<Edit3 size={15} />}
                        label="Ubah Harga"
                        variant="secondary"
                    />
                    <HeaderActionBtn 
                        onClick={onAddNote}
                        icon={<StickyNote size={15} />}
                        label="Catatan"
                        variant="secondary"
                    />
                    <div className="w-px h-6 bg-slate-border/50 mx-1" />
                    <HeaderActionBtn 
                        onClick={onSendEmail}
                        icon={<Send size={15} />}
                        label="Email"
                        variant="secondary"
                    />
                    <HeaderActionBtn 
                        onClick={() => window.print()}
                        icon={<Printer size={15} />}
                        label="Print"
                        variant="secondary"
                    />
                </div>
            </div>
        </div>
    );
}

/** Internal Component for Cleaner Header Buttons */
function HeaderActionBtn({ onClick, icon, label, variant }: { onClick: () => void; icon: React.ReactNode; label: string; variant: 'primary' | 'secondary' }) {
    return (
        <button 
            onClick={onClick}
            className={`
                inline-flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold uppercase transition-all active:scale-95 h-11
                ${variant === 'primary' 
                    ? 'bg-navy text-white hover:bg-navy-light' 
                    : 'bg-transparent text-navy hover:bg-white border border-transparent hover:border-slate-border'}
            `}
        >
            <span className="shrink-0">{icon}</span>
            <span className="hidden lg:inline-block">{label}</span>
        </button>
    );
}
