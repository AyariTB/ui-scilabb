import { useState, useMemo } from 'react';
import { Plus, LayoutGrid, Beaker, Ship, FileText } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { BookingListView } from '@/components/booking';
import { useBookings } from '@/hooks/useBooking';
import type { Booking } from '@/types/booking.types';

export default function OrderList() {
    const { data: bookings = [], isLoading } = useBookings();
    
    // Filter State Tipe Pesanan
    const [orderType, setOrderType] = useState<string>('SEMUA');

    // Karena mock data belum memiliki order_type definitif, 
    // kita gunakan pendekatan sederhana untuk memilah lab, kapal, sas
    const categorizeBooking = (b: Booking) => {
        const name = (b.activity_name || b.service_name || '').toLowerCase();
        if (name.includes('kapal') || name.includes('pelayaran') || name.includes('explorer')) return 'KAPAL';
        if (name.includes('stand') || name.includes('mandiri') || name.includes('sas')) return 'SAS';
        return 'LAB'; // Default sebagian besar
    };

    const filteredBookings = useMemo(() => {
        if (orderType === 'SEMUA') return bookings;
        return bookings.filter(b => categorizeBooking(b) === orderType);
    }, [bookings, orderType]);

    // KPI Summary
    const stats = useMemo(() => {
        const result = { total: 0, lab: 0, kapal: 0, sas: 0 };
        bookings.forEach(b => {
            result.total++;
            const type = categorizeBooking(b);
            if (type === 'LAB') result.lab++;
            else if (type === 'KAPAL') result.kapal++;
            else if (type === 'SAS') result.sas++;
        });
        return result;
    }, [bookings]);

    const headerActions = (
        <button
            onClick={() => alert('Fitur Tambah Pesanan (Manual) akan membuka Modal/Halaman Create Order')}
            className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-navy-light"
        >
            <Plus size={16} /> Tambah Pesanan
        </button>
    );

    const kpiCards = (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="rounded-xl border border-slate-border bg-white p-4 flex items-center gap-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-slate-500">
                    <LayoutGrid size={20} />
                </div>
                <div>
                    <p className="text-xs font-medium text-slate-400">Total Pesanan</p>
                    <p className="text-lg font-bold text-navy">{stats.total}</p>
                </div>
            </div>
            <div className="rounded-xl border border-slate-border bg-white p-4 flex items-center gap-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600">
                    <Beaker size={20} />
                </div>
                <div>
                    <p className="text-xs font-medium text-slate-400">Laboratorium</p>
                    <p className="text-lg font-bold text-navy">{stats.lab}</p>
                </div>
            </div>
            <div className="rounded-xl border border-slate-border bg-white p-4 flex items-center gap-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
                    <Ship size={20} />
                </div>
                <div>
                    <p className="text-xs font-medium text-slate-400">Kapal Riset</p>
                    <p className="text-lg font-bold text-navy">{stats.kapal}</p>
                </div>
            </div>
            <div className="rounded-xl border border-slate-border bg-white p-4 flex items-center gap-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-amber-50 border border-amber-100 text-amber-600">
                    <FileText size={20} />
                </div>
                <div>
                    <p className="text-xs font-medium text-slate-400">Layanan Mandiri</p>
                    <p className="text-lg font-bold text-navy">{stats.sas}</p>
                </div>
            </div>
        </div>
    );

    const extraFilters = (
        <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="rounded-lg border border-slate-border bg-white py-2 pl-3 pr-8 text-sm text-navy font-normal focus:outline-none focus:ring-1 focus:ring-navy transition-all w-full sm:w-auto"
        >
            <option value="SEMUA">Semua Kategori</option>
            <option value="LAB">Laboratorium</option>
            <option value="KAPAL">Kapal Riset</option>
            <option value="SAS">Layanan Mandiri (SAS)</option>
        </select>
    );

    // Extra export columns to reflect the role categorization
    const exportColumns = [
        {
            header: "Kategori Layanan",
            getValue: (b: Booking) => {
                const type = categorizeBooking(b);
                return type === 'LAB' ? 'Laboratorium' : (type === 'KAPAL' ? 'Kapal Riset' : 'Layanan Mandiri');
            }
        },
        {
            header: "Tipe Pemesan",
            getValue: (b: Booking) => {
                if (!b.user_type) return '-';
                return b.user_type === 'internal' ? 'Internal' : 'Eksternal';
            }
        }
    ];

    // Extra columns for table view
    const tableColumns = [
        {
            key: 'kategori',
            header: 'Kategori',
            render: (b: Booking) => {
                const type = categorizeBooking(b);
                const label = type === 'LAB' ? 'Laboratorium' : (type === 'KAPAL' ? 'Kapal Riset' : 'Layanan Mandiri');
                return <span className="text-[11px] font-semibold px-2 py-1 rounded bg-slate-100 text-slate-600">{label}</span>;
            }
        },
        {
            key: 'tipe',
            header: 'Tipe',
            render: (b: Booking) => {
                if (!b.user_type) return <span className="text-[11px] text-slate-400">-</span>;
                return b.user_type === 'internal' 
                    ? <span className="text-[11px] font-medium px-2 py-1 rounded bg-blue-50 text-blue-600 border border-blue-100">Internal</span>
                    : <span className="text-[11px] font-medium px-2 py-1 rounded bg-amber-50 text-amber-600 border border-amber-100">Eksternal</span>;
            }
        }
    ];

    return (
        <AdminLayout>
            <BookingListView
                title="Semua Pesanan"
                subtitle="Pantau dan kelola seluruh transaksi layanan Laboratorium, Kapal Riset, dan SAS."
                exportTitle="Data Transaksi Seluruh Layanan"
                exportFileName="transaksi_global"
                detailBaseUrl="/admin/orders"
                bookings={filteredBookings}
                isLoading={isLoading}
                headerActions={headerActions}
                kpiCards={kpiCards}
                extraFilters={extraFilters}
                extraExportColumns={exportColumns}
                extraColumns={tableColumns}
            />
        </AdminLayout>
    );
}
