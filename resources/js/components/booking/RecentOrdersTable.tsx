import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import type { Booking } from '@/types/booking.types';
import { formatIDR } from './utils';
import { BOOKING_STATUS_CONFIG } from './constants';

interface RecentOrdersTableProps {
    bookings: Booking[];
    /** Base URL untuk navigasi ke detail, misal: '/manager/orders' atau '/admin/orders' */
    detailBaseUrl: string;
}

export function RecentOrdersTable({ bookings, detailBaseUrl }: RecentOrdersTableProps) {
    const navigate = useNavigate();

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
                <thead>
                    <tr className="border-b border-slate-border bg-soft-white">
                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase text-slate-muted">
                            ID Pesanan
                        </th>
                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase text-slate-muted">
                            Pemesan
                        </th>
                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase text-slate-muted">
                            Layanan / Kegiatan
                        </th>
                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase text-slate-muted">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase text-slate-muted">
                            Total Tagihan
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((order) => {
                        const statusCfg = BOOKING_STATUS_CONFIG[order.booking_status];

                        return (
                            <tr
                                key={order.id}
                                className="
                                    border-b border-slate-border last:border-none
                                    transition-colors hover:bg-slate-50/50
                                "
                            >
                                <td className="px-6 py-3.5 text-sm font-semibold text-navy">
                                    {order.booking_code}
                                </td>
                                <td className="px-6 py-3.5">
                                    <p className="text-sm font-medium text-navy line-clamp-1">
                                        {order.booker.name}
                                    </p>
                                    <p className="text-xs text-slate-400 truncate max-w-[150px] mt-0.5">
                                        {order.booker.institution}
                                    </p>
                                </td>
                                <td className="px-6 py-3.5">
                                    <p className="text-sm text-slate-600 line-clamp-2">
                                        {order.activity_name}
                                    </p>
                                </td>
                                <td className="px-6 py-3.5">
                                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-normal leading-tight min-w-[120px] ${statusCfg.badgeClass}`}>
                                        {statusCfg.label}
                                    </span>
                                </td>
                                <td className="px-6 py-3.5 text-sm font-medium text-navy">
                                    {formatIDR(order.total_price)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

