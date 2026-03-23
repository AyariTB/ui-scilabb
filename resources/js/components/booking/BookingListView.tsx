/**
 * BOOKING LIST VIEW — Komponen reusable untuk menampilkan daftar pesanan.
 * 
 * Komponen ini TIDAK memiliki layout wrapper (ManagerLayout/AdminLayout).
 * Consumer (page) bertanggung jawab untuk membungkusnya dengan layout yang sesuai.
 * 
 * Mendukung:
 * - Konfigurasi judul dan subtitle
 * - Extra columns di tabel (untuk admin: tipe internal/eksternal, layanan)
 * - Konfigurasi export title (untuk PDF/CSV)
 * - Base URL untuk navigasi ke detail
 * - Custom data hook
 */

import { useState, useMemo, useCallback } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    Search,
    Download,
    ChevronLeft,
    ChevronRight,
    Ship,
    FileText,
    FileSpreadsheet,
    ChevronDown,
    X,
} from 'lucide-react';

// Shared booking components
import { NegotiatePriceModal, ApproveBookingModal, RejectBookingModal } from './modals';
import { BookingTable, type ExtraColumn, type SortField, type SortDir } from './BookingTable';
import { BOOKING_STATUS_CONFIG, STATUS_FILTER_OPTIONS, ROWS_PER_PAGE_OPTIONS } from './constants';
import { formatIDR, formatShortDate, matchesStatusFilter } from './utils';

import type { Booking, BookingStatusFilter, BookingFilters } from '@/types/booking.types';

// ---TOAST ---
type ToastType = 'success' | 'error' | 'info';
interface ToastItem { id: string; type: ToastType; message: string }

function ToastContainer({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: string) => void }) {
    const colors: Record<ToastType, string> = { success: 'bg-emerald-600', error: 'bg-red-600', info: 'bg-navy' };
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
            {toasts.map((t) => (
                <div key={t.id} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white shadow-lg ${colors[t.type]} animate-in slide-in-from-right-5 duration-300`}>
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
export interface BookingListViewProps {
    /** Judul halaman, misal: 'Daftar Pesanan' */
    title: string;
    /** Subtitle halaman, misal: 'Manajemen peminjaman KR Unhas Explorer-1' */
    subtitle: string;
    /** Judul export PDF, misal: 'Daftar Pesanan Kapal KR Unhas Explorer-1' */
    exportTitle: string;
    /** Nama file export, misal: 'pesanan_kapal' */
    exportFileName: string;
    /** Base URL untuk navigasi ke detail, misal: '/manager/orders' */
    detailBaseUrl: string;
    /** Data booking (dari hook React Query) */
    bookings: Booking[];
    /** Loading state dari data fetching */
    isLoading: boolean;
    /** Kolom tambahan di tabel */
    extraColumns?: ExtraColumn[];
    /** Sembunyikan quick actions (approve/reject) di tabel */
    hideQuickActions?: boolean;
    /** Kolom tambahan di CSV/PDF export */
    extraExportColumns?: {
        header: string;
        getValue: (booking: Booking) => string;
    }[];
    /** Komponen untuk aksi tambahan di header (e.g., tombol Tambah Pesanan) */
    headerActions?: React.ReactNode;
    /** Komponen KPI Cards yang dirender di bawah header */
    kpiCards?: React.ReactNode;
    /** Komponen ekstra untuk filter tambahan (e.g., Filter Tipe Pesanan) */
    extraFilters?: React.ReactNode;
}

/**
 * BOOKING LIST VIEW
 * Komponen view untuk halaman daftar pesanan — tanpa layout wrapper.
 */
export function BookingListView({
    title,
    subtitle,
    exportTitle,
    exportFileName,
    detailBaseUrl,
    bookings: bookingsData,
    isLoading,
    extraColumns = [],
    hideQuickActions = false,
    extraExportColumns = [],
    headerActions,
    kpiCards,
    extraFilters,
}: BookingListViewProps) {
    const { toasts, push, dismiss } = useToast();

    // --- Local state untuk quick-actions dari tabel ---
    const [localBookings, setLocalBookings] = useState<Booking[]>([]);
    const bookings = localBookings.length > 0 ? localBookings : bookingsData;

    // Sync localBookings saat data dari server berubah
    useMemo(() => {
        if (bookingsData.length > 0 && localBookings.length === 0) {
            setLocalBookings(bookingsData);
        }
    }, [bookingsData]);

    // --- Filter & Sort State ---
    const [filters, setFilters] = useState<BookingFilters>({
        search: '',
        status: 'SEMUA',
        date_from: '',
        date_to: '',
    });
    const [sortField, setSortField] = useState<SortField>('created_at');
    const [sortDir, setSortDir] = useState<SortDir>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // --- Modal State ---
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [showExportDropdown, setShowExportDropdown] = useState(false);

    // --- Derived: filtered + sorted data ---
    const processedBookings = useMemo(() => {
        let result = [...bookings];

        // Search Filter
        if (filters.search.trim()) {
            const q = filters.search.toLowerCase();
            result = result.filter(
                (b) =>
                    b.booking_code.toLowerCase().includes(q) ||
                    b.booker.name.toLowerCase().includes(q) ||
                    b.activity_name.toLowerCase().includes(q) ||
                    b.booker.institution.toLowerCase().includes(q) ||
                    (b.service_name?.toLowerCase().includes(q) ?? false)
            );
        }

        // Status Filter
        if (filters.status !== 'SEMUA') {
            result = result.filter((b) => matchesStatusFilter(b, filters.status));
        }

        // Date Range Filter
        if (filters.date_from) result = result.filter((b) => b.start_date >= filters.date_from);
        if (filters.date_to) result = result.filter((b) => b.end_date <= filters.date_to);

        // Sorting Logic
        result.sort((a, b) => {
            let cmp = 0;
            switch (sortField) {
                case 'booking_code': cmp = a.booking_code.localeCompare(b.booking_code); break;
                case 'start_date': cmp = a.start_date.localeCompare(b.start_date); break;
                case 'total_price': cmp = a.total_price - b.total_price; break;
                default: cmp = a.created_at.localeCompare(b.created_at); break;
            }
            return sortDir === 'asc' ? cmp : -cmp;
        });

        return result;
    }, [filters, sortField, sortDir, bookings]);

    // --- Pagination Logic ---
    const totalPages = Math.max(1, Math.ceil(processedBookings.length / rowsPerPage));
    const paginatedBookings = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return processedBookings.slice(start, start + rowsPerPage);
    }, [processedBookings, currentPage, rowsPerPage]);

    // --- Handlers ---
    const handleFilterChange = useCallback(<K extends keyof BookingFilters>(key: K, value: BookingFilters[K]) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    }, []);

    const handleSort = useCallback((field: SortField) => {
        if (field === sortField) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDir('desc');
        }
    }, [sortField]);

    const handleNegotiatePrice = useCallback(async (newPrice: number, note: string) => {
        if (!selectedBooking) return;
        setActionLoading(true);
        await new Promise((r) => setTimeout(r, 1000));

        const priceNote = {
            id: crypto.randomUUID(),
            author: 'System (Negosiasi)',
            content: `Total harga diubah ke ${formatIDR(newPrice)}. Catatan: ${note}`,
            created_at: new Date().toISOString()
        };

        setLocalBookings(prev => prev.map(b =>
            b.id === selectedBooking.id
                ? { ...b, total_price: newPrice, internal_notes: [...b.internal_notes, priceNote], updated_at: new Date().toISOString() }
                : b
        ));

        setActionLoading(false);
        setIsPriceModalOpen(false);
        setSelectedBooking(null);
        push('Harga berhasil diupdate dan catatan disimpan.', 'success');
    }, [selectedBooking, push]);

    const handleApproveBooking = useCallback(async (deadline: string) => {
        if (!selectedBooking) return;
        setActionLoading(true);
        await new Promise((r) => setTimeout(r, 1200));

        setLocalBookings(prev => prev.map(b =>
            b.id === selectedBooking.id
                ? { ...b, booking_status: 'PESANAN_TERVERIFIKASI', payment_deadline: deadline, updated_at: new Date().toISOString() }
                : b
        ));

        setActionLoading(false);
        setIsApproveModalOpen(false);
        setSelectedBooking(null);
        push('Pesanan berhasil disetujui. Deadline pembayaran telah dikirim ke peminjam.', 'success');
    }, [selectedBooking, push]);

    const handleRejectBooking = useCallback(async (reason: string) => {
        if (!selectedBooking) return;
        setActionLoading(true);
        await new Promise((r) => setTimeout(r, 1000));

        setLocalBookings(prev => prev.map(b =>
            b.id === selectedBooking.id
                ? { ...b, booking_status: 'PESANAN_DITOLAK', rejection_reason: reason, updated_at: new Date().toISOString() }
                : b
        ));

        setActionLoading(false);
        setIsRejectModalOpen(false);
        setSelectedBooking(null);
        push('Pesanan telah ditolak. Email penolakan dikirim ke peminjam.', 'info');
    }, [selectedBooking, push]);

    // --- Export Handlers ---
    const handleExportCSV = useCallback(() => {
        const baseHeaders = ['Kode Pesanan', 'Peminjam', 'Instansi', 'Kegiatan', 'Mulai', 'Selesai', 'Durasi (hari)', 'Total', 'Status'];
        const extraHeaders = extraExportColumns.map(c => c.header);
        const header = [...baseHeaders, ...extraHeaders];

        const rows = processedBookings.map((b) => {
            const baseRow = [
                b.booking_code, b.booker.name, b.booker.institution, b.activity_name,
                formatShortDate(b.start_date), formatShortDate(b.end_date),
                `${b.duration_days} hari`, formatIDR(b.total_price),
                BOOKING_STATUS_CONFIG[b.booking_status].label,
            ];
            const extraRow = extraExportColumns.map(c => c.getValue(b));
            return [...baseRow, ...extraRow];
        });

        const csv = [header, ...rows].map((r) => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${exportFileName}_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }, [processedBookings, exportFileName, extraExportColumns]);

    const handleExportPDF = useCallback(() => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(exportTitle, 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 30);

        const baseColumns = ["Kode", "Peminjam", "Kegiatan", "Mulai", "Selesai", "Durasi", "Total Harga", "Status"];
        const extraHeaders = extraExportColumns.map(c => c.header);
        const tableColumn = [...baseColumns, ...extraHeaders];

        const tableRows = processedBookings.map(b => {
            const baseRow = [
                b.booking_code, b.booker.name, b.activity_name,
                formatShortDate(b.start_date), formatShortDate(b.end_date),
                `${b.duration_days} hari`, formatIDR(b.total_price),
                BOOKING_STATUS_CONFIG[b.booking_status].label
            ];
            const extraRow = extraExportColumns.map(c => c.getValue(b));
            return [...baseRow, ...extraRow];
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            theme: 'striped',
            headStyles: { fillColor: [15, 23, 42] },
            styles: { fontSize: 8 },
        });

        doc.save(`${exportFileName}_${new Date().toISOString().slice(0, 10)}.pdf`);
    }, [processedBookings, exportTitle, exportFileName, extraExportColumns]);

    const hasActiveFilters = filters.search !== '' || filters.status !== 'SEMUA' || filters.date_from !== '' || filters.date_to !== '';
    const pendingCount = bookings.filter((b) => b.booking_status === 'MENUNGGU_VERIFIKASI_PESANAN').length;

    return (
        <>
            <ToastContainer toasts={toasts} onDismiss={dismiss} />
            <div className="space-y-5 animate-in fade-in duration-500">
                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold tracking-tight text-navy">{title}</h1>
                            {pendingCount > 0 && (
                                <span className="inline-flex items-center justify-center rounded-full bg-amber-50 px-2.5 py-1 text-[12px] font-semibold text-amber-600 border border-amber-200 leading-none">
                                    {pendingCount} menunggu
                                </span>
                            )}
                        </div>
                        <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {headerActions}
                        <div className="relative">
                            <button
                                onClick={() => setShowExportDropdown(!showExportDropdown)}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-border bg-white px-4 py-2 text-sm font-semibold text-navy transition-all hover:bg-soft-white"
                            >
                            <Download size={15} /> Export Data <ChevronDown size={14} className={`transition-transform duration-200 ${showExportDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showExportDropdown && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowExportDropdown(false)} />
                                <div className="absolute right-0 mt-2 z-20 w-48 origin-top-right rounded-xl border border-slate-border bg-white p-1 shadow-xl animate-in zoom-in-95 duration-100">
                                    <button onClick={() => { handleExportCSV(); setShowExportDropdown(false); }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-navy hover:bg-soft-white transition-colors">
                                        <FileSpreadsheet size={16} className="text-emerald-600" /> Export as CSV
                                    </button>
                                    <button onClick={() => { handleExportPDF(); setShowExportDropdown(false); }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-navy hover:bg-soft-white transition-colors">
                                        <FileText size={16} className="text-red-600" /> Export as PDF
                                    </button>
                                </div>
                            </>
                        )}
                        </div>
                    </div>
                </div>

                {kpiCards && (
                    <div className="mb-2">
                        {kpiCards}
                    </div>
                )}

                {/* --- FILTER BAR --- */}
                <div className="flex flex-col gap-3 rounded-xl border border-slate-border bg-white p-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text" placeholder="Cari kode pesanan, peminjam, atau kegiatan..."
                            value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full rounded-lg border border-slate-border bg-soft-white py-2 pl-9 pr-4 text-sm font-normal text-navy placeholder:text-slate-400 placeholder:font-normal focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy transition-all"
                        />
                    </div>

                    <select
                        value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value as BookingStatusFilter)}
                        className="rounded-lg border border-slate-border bg-white py-2 pl-3 pr-8 text-sm text-navy font-normal focus:outline-none focus:ring-1 focus:ring-navy transition-all w-full sm:w-auto"
                    >
                        {STATUS_FILTER_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>

                    {extraFilters}

                    <div className="flex items-center gap-2">
                        <input type="date" value={filters.date_from} onChange={(e) => handleFilterChange('date_from', e.target.value)} className="rounded-lg border border-slate-border bg-white py-2 px-3 text-sm text-navy focus:outline-none focus:ring-1 focus:ring-navy" />
                        <span className="text-xs text-slate-muted font-medium">s/d</span>
                        <input type="date" value={filters.date_to} onChange={(e) => handleFilterChange('date_to', e.target.value)} className="rounded-lg border border-slate-border bg-white py-2 px-3 text-sm text-navy focus:outline-none focus:ring-1 focus:ring-navy" />
                    </div>

                    {hasActiveFilters && (
                        <button onClick={() => { setFilters({ search: '', status: 'SEMUA', date_from: '', date_to: '' }); setCurrentPage(1); }} className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-tight px-2">Reset</button>
                    )}
                </div>

                {/* --- TABLE CONTAINER --- */}
                <div className="rounded-xl border border-slate-border bg-white overflow-hidden">
                    {isLoading ? <TableSkeleton /> : (
                        paginatedBookings.length === 0 ? <EmptyState hasFilters={hasActiveFilters} /> : (
                            <BookingTable
                                bookings={paginatedBookings}
                                sortField={sortField} sortDir={sortDir} onSort={handleSort}
                                onEditPrice={(e, b) => { e.stopPropagation(); setSelectedBooking(b); setIsPriceModalOpen(true); }}
                                onApprove={(e, b) => { e.stopPropagation(); setSelectedBooking(b); setIsApproveModalOpen(true); }}
                                onReject={(e, b) => { e.stopPropagation(); setSelectedBooking(b); setIsRejectModalOpen(true); }}
                                currentPage={currentPage} rowsPerPage={rowsPerPage}
                                detailBaseUrl={detailBaseUrl}
                                extraColumns={extraColumns}
                                hideQuickActions={hideQuickActions}
                            />
                        )
                    )}
                </div>

                {/* --- PAGINATION --- */}
                {processedBookings.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 pt-2 pb-6">
                        <div className="flex items-center gap-3">
                            <div className="text-xs text-slate-400">
                                Menampilkan <span className="font-semibold text-navy">{paginatedBookings.length}</span> dari <span className="font-semibold text-navy">{processedBookings.length}</span> pesanan
                            </div>
                            <select
                                value={rowsPerPage}
                                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                className="text-[11px] text-navy bg-slate-50 border border-slate-border rounded-md px-1.5 py-1 focus:outline-none"
                            >
                                {ROWS_PER_PAGE_OPTIONS.map(n => <option key={n} value={n}>{n} / Hal</option>)}
                            </select>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-border bg-white text-navy hover:bg-soft-white disabled:opacity-20 transition-all"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            <div className="flex items-center gap-1 mx-2">
                                <span className="h-8 w-8 flex items-center justify-center rounded-lg bg-navy text-white text-xs font-bold">{currentPage}</span>
                                <span className="text-xs font-bold text-slate-300">/</span>
                                <span className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-border bg-white text-navy text-xs font-bold">{totalPages}</span>
                            </div>

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => p + 1)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-border bg-white text-navy hover:bg-soft-white disabled:opacity-20 transition-all"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <NegotiatePriceModal
                isOpen={isPriceModalOpen} onClose={() => setIsPriceModalOpen(false)}
                onConfirm={handleNegotiatePrice} currentPrice={selectedBooking?.total_price || 0} isLoading={actionLoading}
            />

            <ApproveBookingModal
                isOpen={isApproveModalOpen}
                onClose={() => setIsApproveModalOpen(false)}
                onConfirm={handleApproveBooking}
                isLoading={actionLoading}
                bookingCode={selectedBooking?.booking_code || ''}
                bookerEmail={selectedBooking?.booker.email || ''}
            />

            <RejectBookingModal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                onConfirm={handleRejectBooking}
                isLoading={actionLoading}
                title="Tolak Pesanan"
                description="Alasan penolakan akan dikirimkan ke email peminjam. Pastikan alasan jelas agar peminjam dapat mengajukan ulang dengan benar."
            />
        </>
    );
}

/** HELPER: Skeleton Loading State */
function TableSkeleton() {
    return (
        <div className="animate-pulse p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-slate-50 border border-slate-border/50 rounded-xl" />)}
        </div>
    );
}

/** HELPER: Empty State Illustration */
function EmptyState({ hasFilters }: { hasFilters: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-in fade-in duration-700">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 border border-slate-100">
                <Ship size={42} className="text-slate-200" />
            </div>
            <h3 className="text-lg font-bold text-navy">{hasFilters ? 'Pencarian Tidak Ditemukan' : 'Belum Ada Pesanan'}</h3>
            <p className="mt-2 max-w-xs text-sm text-slate-400 leading-relaxed font-medium">
                {hasFilters ? 'Coba sesuaikan kata kunci atau bersihkan filter yang aktif untuk mencari pesanan lain.' : 'Sistem belum mencatat adanya pesanan untuk saat ini.'}
            </p>
        </div>
    );
}
