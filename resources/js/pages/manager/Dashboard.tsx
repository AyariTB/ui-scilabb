import { useState } from "react";
import ManagerLayout from "@/components/layout/ManagerLayout";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { COLORS } from "@/constants/colors";
import {
    CreditCard,
    TrendingUp,
    Anchor,
    ArrowUpRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ExportActions } from "@/components/ui/ExportActions";
import { exportToCSV, exportToPDF } from "@/lib/export";
import { RecentOrdersTable } from "@/components/booking/RecentOrdersTable";
import { MOCK_BOOKINGS } from "@/mocks/booking.mock";
import { IncomeChartWidget } from "@/components/ui/IncomeChartWidget";
import { TrendChartWidget } from "@/components/ui/TrendChartWidget";

// --- Mock Data ---
const MOCK_STATS = [
    {
        key: "revenue",
        label: "Total Pemasukan",
        value: "Rp 75.000.000",
        change: "+15.2%",
        trend: "up" as const,
        icon: TrendingUp,
        description: "Bulan ini",
    },
    {
        key: "bookings",
        label: "Pengajuan Sewa",
        value: "14 Kali",
        change: "+16.5%",
        trend: "up" as const,
        icon: Anchor,
        description: "vs bulan lalu",
    },
    {
        key: "unpaid",
        label: "Belum Lunas",
        value: "3 Pesanan",
        trend: "down" as const,
        icon: CreditCard,
        description: "Butuh tindak lanjut",
    },
] as const;

const MOCK_CHART_DATA = [
    { name: "Jan", pendapatan: 20000000, pesanan: 4 },
    { name: "Feb", pendapatan: 45000000, pesanan: 8 },
    { name: "Mar", pendapatan: 75000000, pesanan: 12 },
    { name: "Apr", pendapatan: 30000000, pesanan: 6 },
    { name: "Mei", pendapatan: 15000000, pesanan: 3 },
    { name: "Jun", pendapatan: 0, pesanan: 0 },
];

const MONTHS_MAP: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, Mei: 4, Jun: 5, Jul: 6, Agu: 7, Sep: 8, Okt: 9, Nov: 10, Des: 11
};

export default function Dashboard() {
    const navigate = useNavigate();
    // State untuk rentang tanggal grafik pendapatan
    const [revDate, setRevDate] = useState({
        start: "2025-01-01",
        end: "2025-06-30",
    });

    // State untuk rentang tanggal grafik pengajuan
    const [reqDate, setReqDate] = useState({
        start: "2025-01-01",
        end: "2025-06-30",
    });

    // Filter data berdasarkan rentang tanggal (Logika yang lebih robust)
    const getFilteredData = (range: { start: string, end: string }) => {
        if (!range.start || !range.end) return MOCK_CHART_DATA;

        // Parsing manual untuk menghindari isu timezone UTC vs Local
        const parseDate = (dateStr: string) => {
            const [y, m, d] = dateStr.split('-').map(Number);
            return new Date(y, m - 1, d);
        };

        const startDate = parseDate(range.start);
        const endDate = parseDate(range.end);
        
        return MOCK_CHART_DATA.filter((item) => {
            const monthIdx = MONTHS_MAP[item.name] ?? 0;
            // Mock data diasumsikan tahun 2025
            const itemDate = new Date(2025, monthIdx, 1);
            
            // Cek apakah bulan item berada dalam rentang
            // Kita bandingkan waktu (timestamp) untuk akurasi
            return itemDate >= startDate && itemDate <= endDate;
        });
    };

    const filteredRevData = getFilteredData(revDate);
    const filteredReqData = getFilteredData(reqDate);

    // Fungsi Export Pendapatan
    const handleExportRev = (type: "csv" | "pdf") => {
        const headers = [
            { label: "Bulan", key: "name" },
            { label: "Pendapatan (IDR)", key: "pendapatan" },
        ];
        const filename = `Laporan_Pendapatan_${revDate.start}_${revDate.end}`;
        
        if (type === "csv") {
            exportToCSV(filteredRevData, filename, headers);
        } else {
            exportToPDF(
                filteredRevData, 
                filename, 
                "Laporan Pendapatan Kapal Riset", 
                headers,
                (key, val) => key === "pendapatan" ? `Rp ${Number(val).toLocaleString("id-ID")}` : val
            );
        }
    };

    // Fungsi Export Pengajuan
    const handleExportReq = (type: "csv" | "pdf") => {
        const headers = [
            { label: "Bulan", key: "name" },
            { label: "Jumlah Pengajuan", key: "pesanan" },
        ];
        const filename = `Laporan_Pengajuan_${reqDate.start}_${reqDate.end}`;
        
        if (type === "csv") {
            exportToCSV(filteredReqData, filename, headers);
        } else {
            exportToPDF(
                filteredReqData, 
                filename, 
                "Laporan Frekuensi Pengajuan Sewa", 
                headers
            );
        }
    };

    return (
        <ManagerLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-navy">
                        Dashboard Manager
                    </h1>
                    <p className="mt-1 text-sm text-slate-muted">
                        Ringkasan operasional dan penyewaan kapal riset
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {MOCK_STATS.map((stat) => (
                        <StatCard 
                            key={stat.key} 
                            label={stat.label}
                            value={stat.value}
                            icon={stat.icon}
                            change={"change" in stat ? stat.change : undefined}
                            trend={"trend" in stat ? stat.trend : undefined}
                            description={stat.description}
                        />
                    ))}
                </div>

                {/* Content Grid: Chart & Tables */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Grafik Pendapatan */}
                        <IncomeChartWidget
                            title="Grafik Pendapatan"
                            subtitle="Total nominal penyewaan"
                            data={filteredRevData}
                            dateRange={revDate}
                            onDateChange={(start, end) => setRevDate({ start, end })}
                            onExportCSV={() => handleExportRev("csv")}
                            onExportPDF={() => handleExportRev("pdf")}
                        />

                        {/* Grafik Jumlah Pengajuan */}
                        <TrendChartWidget
                            title="Grafik Pengajuan Sewa"
                            subtitle="Total frekuensi pengajuan"
                            data={filteredReqData}
                            dateRange={reqDate}
                            onDateChange={(start, end) => setReqDate({ start, end })}
                            onExportCSV={() => handleExportReq("csv")}
                            onExportPDF={() => handleExportReq("pdf")}
                        />
                    </div>

                    {/* Pesanan Terbaru (Table) */}
                    <div className="rounded-xl border border-slate-border bg-white overflow-hidden">
                        <div className="flex items-center justify-between border-b border-slate-border px-6 py-4">
                            <div>
                                <h2 className="text-sm font-bold text-navy">
                                    Pesanan Terbaru
                                </h2>
                                <p className="text-xs text-slate-muted">
                                    Daftar pengajuan sewa kapal terbaru
                                </p>
                            </div>
                            <button
                                onClick={() => navigate("/manager/orders")}
                                className="
                                    flex items-center gap-1.5 rounded-lg px-3 py-1.5
                                    text-[11px] font-semibold text-label-muted transition-all
                                    hover:bg-hover-bg hover:text-navy
                                "
                            >
                                <span>Lihat Semua</span>
                                <ArrowUpRight size={14} />
                            </button>
                        </div>
                        <RecentOrdersTable 
                            bookings={MOCK_BOOKINGS.slice(0, 5)} 
                            detailBaseUrl="/manager/orders" 
                        />
                    </div>
                </div>
            </div>
        </ManagerLayout>
    );
}
