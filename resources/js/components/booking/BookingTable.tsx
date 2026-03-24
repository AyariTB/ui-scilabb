/**
 * BOOKING TABLE 
 * - Kolom standar (kode, peminjam, kegiatan, tanggal, harga, status, aksi)
 * - Extra columns opsional (untuk admin dan lab: tipe internal/eksternal, nama layanan)
 * - Sorting per kolom
 * - Navigasi ke detail via prop `detailBaseUrl`
 * - Quick actions (approve, reject, edit harga)
 */

import { Eye, CheckCircle2, XCircle, Edit3, AlertTriangle, ArrowUp, ArrowDown, ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Booking } from '@/types/booking.types';
import { formatIDR, formatDateRange, formatShortDate, hasApprovedConflict } from './utils';
import { BOOKING_STATUS_CONFIG, PAYMENT_STATUS_CONFIG, BOOKING_TYPE_CONFIG } from './constants';

export type SortField = 'booking_code' | 'created_at' | 'start_date' | 'total_price';
export type SortDir = 'asc' | 'desc';

/** Definisi kolom tambahan yang bisa ditambahkan consumer */
export interface ExtraColumn {
    /** Key unik kolom */
    key: string;
    /** Label header kolom */
    header: string;
    /** Render function untuk isi kolom per-row */
    render: (booking: Booking) => React.ReactNode;
    /** Class tambahan untuk header th */
    headerClassName?: string;
    /** Class tambahan untuk body td */
    cellClassName?: string;
}

interface BookingTableProps {
    bookings: Booking[];
    sortField: SortField;
    sortDir: SortDir;
    onSort: (field: SortField) => void;
    onEditPrice: (e: React.MouseEvent, booking: Booking) => void;
    onApprove: (e: React.MouseEvent, booking: Booking) => void;
    onReject: (e: React.MouseEvent, booking: Booking) => void;
    currentPage: number;
    rowsPerPage: number;
    /** Base URL untuk navigasi ke detail, misal: '/manager/orders' atau '/admin/orders' */
    detailBaseUrl: string;
    /** Kolom tambahan yang disisipkan sebelum kolom "Status" */
    extraColumns?: ExtraColumn[];
    /** Sembunyikan kolom aksi quick-action (approve/reject) — berguna untuk admin read-only */
    hideQuickActions?: boolean;
}

export function BookingTable({
    bookings,
    sortField,
    sortDir,
    onSort,
    onEditPrice,
    onApprove,
    onReject,
    currentPage,
    rowsPerPage,
    detailBaseUrl,
    extraColumns = [],
    hideQuickActions = false,
}: BookingTableProps) {
    const navigate = useNavigate();
    const [activeRowId, setActiveRowId] = useState<string | null>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveRowId(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[1000px] text-sm">
                {/* ---TABLE HEAD ---*/}
                <thead className="border-b border-slate-border bg-slate-50/50">
                    <tr>
                        <th className="px-5 py-3.5 text-left text-[12px] font-semibold text-slate-500">No</th>
                        <th className="px-5 py-3.5 text-left text-[12px] font-semibold text-slate-500">
                            <SortableHeader
                                field="booking_code"
                                currentField={sortField}
                                currentDir={sortDir}
                                onClick={onSort}
                            >
                                Kode Pesanan
                            </SortableHeader>
                        </th>
                        <th className="px-5 py-3.5 text-left text-[12px] font-semibold text-slate-500">Peminjam</th>
                        <th className="px-5 py-3.5 text-left text-[12px] font-semibold text-slate-500">Kegiatan</th>

                        {/* Extra Columns Headers */}
                        {extraColumns.map((col) => (
                            <th
                                key={col.key}
                                className={`px-5 py-3.5 text-left text-[12px] font-semibold text-slate-500 ${col.headerClassName || ''}`}
                            >
                                {col.header}
                            </th>
                        ))}

                        <th className="px-5 py-3.5 text-left text-[12px] font-semibold text-slate-500">
                            <SortableHeader
                                field="start_date"
                                currentField={sortField}
                                currentDir={sortDir}
                                onClick={onSort}
                            >
                                Tanggal
                            </SortableHeader>
                        </th>
                        <th className="px-5 py-3.5 text-left text-[12px] font-semibold text-slate-500">
                            <SortableHeader
                                field="total_price"
                                currentField={sortField}
                                currentDir={sortDir}
                                onClick={onSort}
                            >
                                Total Tagihan
                            </SortableHeader>
                        </th>
                        <th className="px-5 py-3.5 text-left text-[12px] font-semibold text-slate-500">Status</th>
                        <th className="px-5 py-3.5 text-center text-[12px] font-semibold text-slate-500">Aksi</th>
                    </tr>
                </thead>

                {/* ---TABLE BODY ---*/}
                <tbody className="divide-y divide-slate-border">
                    {bookings.map((booking, index) => {
                        const conflict = hasApprovedConflict(booking);
                        const statusCfg = BOOKING_STATUS_CONFIG[booking.booking_status];
                        const payCfg = PAYMENT_STATUS_CONFIG[booking.payment_status];

                        return (
                            <tr
                                key={booking.id}
                                className="group transition-colors hover:bg-slate-50/50 cursor-pointer"
                                onClick={() => navigate(`${detailBaseUrl}/${booking.id}`)}
                            >
                                <td className="px-5 py-4 text-[12px] text-slate-400 font-medium">
                                    {(currentPage - 1) * rowsPerPage + index + 1}
                                </td>

                                {/* Kode & Tgl Dibuat */}
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-navy">
                                            {booking.booking_code}
                                        </span>
                                        {conflict && (
                                            <span title="Ada konflik tanggal" className="text-red-500">
                                                <AlertTriangle size={13} />
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[11px] text-slate-400">
                                        {formatShortDate(booking.created_at)}
                                    </span>
                                </td>

                                {/* Peminjam */}
                                <td className="px-5 py-4">
                                    <p className="text-sm font-medium text-navy line-clamp-1">
                                        {booking.booker.name}
                                    </p>
                                    <p className="text-xs text-slate-400 truncate max-w-[150px] mt-0.5">
                                        {booking.booker.institution}
                                    </p>
                                </td>

                                {/* Kegiatan */}
                                <td className="px-5 py-4 max-w-[200px]">
                                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                                        {booking.activity_name}
                                    </p>
                                </td>

                                {/* Extra Columns Cells */}
                                {extraColumns.map((col) => (
                                    <td
                                        key={col.key}
                                        className={`px-5 py-4 ${col.cellClassName || ''}`}
                                    >
                                        {col.render(booking)}
                                    </td>
                                ))}

                                {/* Tanggal */}
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <p className="text-sm font-medium text-navy">
                                        {formatDateRange(booking.start_date, booking.end_date)}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {booking.duration_days} hari
                                    </p>
                                </td>

                                {/* Total Tagihan */}
                                <td className="px-5 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2 group/price">
                                        <p className="text-sm font-semibold text-navy">
                                            {formatIDR(booking.total_price)}
                                        </p>
                                        <button
                                            onClick={(e) => onEditPrice(e, booking)}
                                            className="opacity-0 group-hover/price:opacity-100 p-1 text-slate-300 hover:text-navy hover:bg-white rounded transition-all"
                                            title="Edit Harga"
                                        >
                                            <Edit3 size={12} />
                                        </button>
                                    </div>
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-normal mt-1 ${payCfg.badgeClass}`}>
                                        {payCfg.label}
                                    </span>
                                </td>

                                {/* Status Pesanan */}
                                <td className="px-5 py-4">
                                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-normal leading-tight min-w-[120px] ${statusCfg.badgeClass}`}>
                                        {statusCfg.label}
                                    </span>
                                </td>

                                {/* Aksi */}
                                <td className="px-5 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                                    <div className="relative group/actions inline-flex items-center justify-center">
                                        {/* TRIGGER BUTTON */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveRowId(activeRowId === booking.id ? null : booking.id);
                                            }}
                                            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                                                activeRowId === booking.id 
                                                ? 'bg-navy text-white shadow-md' 
                                                : 'text-slate-400 hover:bg-slate-100 hover:text-navy'
                                            }`}
                                        >
                                            <MoreHorizontal size={18} />
                                        </button>

                                        {/* VERTICAL DROPDOWN MENU */}
                                        <div 
                                            className={`
                                                absolute right-0 top-full z-30 pt-1.5 transition-all duration-200 origin-top-right
                                                ${activeRowId === booking.id ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none group-hover/actions:opacity-100 group-hover/actions:scale-100 group-hover/actions:pointer-events-auto'}
                                            `}
                                        >
                                            {/* Invisible Bridge to prevent hover loss */}
                                            <div className="absolute -top-2 left-0 right-0 h-4 bg-transparent" />

                                            <div className="min-w-[150px] flex flex-col rounded-xl border border-slate-border bg-white p-1.5 shadow-xl">
                                                <button
                                                    onClick={() => navigate(`${detailBaseUrl}/${booking.id}`)}
                                                    className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-left text-[13px] font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                >
                                                    <Eye size={16} className="text-blue-500" /> Lihat Detail
                                                </button>

                                            {!hideQuickActions && booking.booking_status === 'MENUNGGU_VERIFIKASI_PESANAN' && (
                                                <>
                                                    <div className="my-1 border-t border-slate-50" />
                                                    <button
                                                        onClick={(e) => onApprove(e, booking)}
                                                        className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-left text-[13px] font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                                                    >
                                                        <CheckCircle2 size={16} className="text-emerald-500" /> Setujui
                                                    </button>
                                                    <button
                                                        onClick={(e) => onReject(e, booking)}
                                                        className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-left text-[13px] font-medium text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                    >
                                                        <XCircle size={16} className="text-red-500" /> Tolak
                                                    </button>
                                                </>
                                            )}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

function SortableHeader({ field, currentField, currentDir, onClick, children }: {
    field: SortField; currentField: SortField; currentDir: SortDir; onClick: (field: SortField) => void; children: React.ReactNode;
}) {
    const isActive = field === currentField;
    return (
        <button
            onClick={() => onClick(field)}
            className={`flex items-center gap-1.5 text-left text-[12px] font-semibold transition-colors ${isActive ? 'text-navy' : 'text-slate-500 hover:text-navy'}`}
        >
            {children}
            {isActive ? (
                currentDir === 'asc' ? <ArrowUp size={13} className="text-navy" /> : <ArrowDown size={13} className="text-navy" />
            ) : (
                <ArrowUpDown size={13} className="opacity-30" />
            )}
        </button>
    );
}
