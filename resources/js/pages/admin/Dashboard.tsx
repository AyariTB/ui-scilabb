import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import {
    Users,
    FlaskConical,
    ShoppingCart,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    Clock,
    ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StatCard } from "@/components/ui/StatCard";
import { RecentOrdersTable } from "@/components/booking/RecentOrdersTable";
import { MOCK_BOOKINGS } from "@/mocks/booking.mock";
import { IncomeChartWidget } from "@/components/ui/IncomeChartWidget";
import { TrendChartWidget } from "@/components/ui/TrendChartWidget";
import { RevenueTrendWidget } from "@/components/ui/RevenueTrendWidget";
import { PopularServicesWidget } from "@/components/ui/PopularServicesWidget";
import { exportToCSV, exportToPDF } from "@/lib/export";

// --- Mock Data ---
// Data statistik ini nantinya akan diganti dengan data real dari API.
// Dipisahkan agar mudah diidentifikasi dan direfaktor saat integrasi backend.

const MOCK_STATS = [
    {
        key: "total-users",
        label: "Total Pengguna",
        value: "2,847",
        change: "+12.5%",
        trend: "up" as const,
        icon: Users,
        description: "vs bulan lalu",
    },
    {
        key: "active-labs",
        label: "Lab Aktif",
        value: "32",
        change: "+3",
        trend: "up" as const,
        icon: FlaskConical,
        description: "lab beroperasi",
    },
    {
        key: "orders",
        label: "Pesanan Bulan Ini",
        value: "486",
        change: "-2.4%",
        trend: "down" as const,
        icon: ShoppingCart,
        description: "vs bulan lalu",
    },
    {
        key: "revenue",
        label: "Pendapatan",
        value: "Rp 124.5 Jt",
        change: "+18.2%",
        trend: "up" as const,
        icon: TrendingUp,
        description: "vs bulan lalu",
    },
] as const;

const MOCK_PROVIDER_INCOME = [
    { name: "Lab Kimia", pendapatan: 45000000, pesanan: 12 },
    { name: "Lab Biologi", pendapatan: 32000000, pesanan: 8 },
    { name: "Lab Geologi", pendapatan: 58000000, pesanan: 15 },
    { name: "Kapal Riset", pendapatan: 120000000, pesanan: 4 },
];

const MOCK_TREND_DATA = [
    { name: "Jan", pesanan: 14 },
    { name: "Feb", pesanan: 28 },
    { name: "Mar", pesanan: 45 },
    { name: "Apr", pesanan: 32 },
    { name: "Mei", pesanan: 18 },
    { name: "Jun", pesanan: 26 },
];

const MOCK_OVERALL_REVENUE = [
    { name: "Jan", pendapatan: 154000000 },
    { name: "Feb", pendapatan: 210000000 },
    { name: "Mar", pendapatan: 185000000 },
    { name: "Apr", pendapatan: 320000000 },
    { name: "Mei", pendapatan: 280000000 },
    { name: "Jun", pendapatan: 160000000 },
];

const MOCK_POPULAR_SERVICES = [
    { name: "Uji SEM", total: 45, diterima: 40, ditolak: 5, penyedia: "Lab Geologi" },
    { name: "Uji XRD", total: 38, diterima: 35, ditolak: 3, penyedia: "Lab Kimia" },
    { name: "Sewa Kapal", total: 24, diterima: 20, ditolak: 4, penyedia: "Kapal Utama" },
    { name: "Uji Tarik", total: 18, diterima: 18, ditolak: 0, penyedia: "Lab Fisika" },
    { name: "Sewa Lab", total: 12, diterima: 10, ditolak: 2, penyedia: "Lab Biologi" },
];

// --- Komponen Utama ---

export default function Dashboard() {
    const navigate = useNavigate();
    const [revDate, setRevDate] = useState({
        start: "2025-01-01",
        end: "2025-12-31",
    });
    const [reqDate, setReqDate] = useState({
        start: "2025-01-01",
        end: "2025-12-31",
    });
    const [overallRevDate, setOverallRevDate] = useState({
        start: "2025-01-01",
        end: "2025-12-31",
    });
    const [popularSvcDate, setPopularSvcDate] = useState({
        start: "2025-01-01",
        end: "2025-12-31",
    });

    const filteredProviderIncome = MOCK_PROVIDER_INCOME;
    const filteredTrendData = MOCK_TREND_DATA;
    const filteredOverallRevenue = MOCK_OVERALL_REVENUE;
    const filteredPopularServices = MOCK_POPULAR_SERVICES;

    const handleExportRev = (type: "csv" | "pdf") => {
        const headers = [
            { label: "Penyedia Layanan", key: "name" },
            { label: "Pendapatan (IDR)", key: "pendapatan" },
            { label: "Jumlah Pesanan", key: "pesanan" },
        ];
        const filename = `Laporan_Pendapatan_Penyedia_${revDate.start}_${revDate.end}`;
        
        if (type === "csv") {
            exportToCSV(filteredProviderIncome, filename, headers);
        } else {
            exportToPDF(
                filteredProviderIncome, 
                filename, 
                "Laporan Pendapatan per Penyedia Layanan", 
                headers,
                (key, val) => key === "pendapatan" ? `Rp ${Number(val).toLocaleString("id-ID")}` : val
            );
        }
    };

    const handleExportReq = (type: "csv" | "pdf") => {
        const headers = [
            { label: "Bulan", key: "name" },
            { label: "Jumlah Pesanan", key: "pesanan" },
        ];
        const filename = `Laporan_Tren_Pesanan_${reqDate.start}_${reqDate.end}`;
        
        if (type === "csv") {
            exportToCSV(filteredTrendData, filename, headers);
        } else {
            exportToPDF(
                filteredTrendData, 
                filename, 
                "Laporan Tren Pesanan", 
                headers
            );
        }
    };

    const handleExportOverallRev = (type: "csv" | "pdf") => {
        const headers = [
            { label: "Bulan", key: "name" },
            { label: "Pendapatan Keseluruhan (IDR)", key: "pendapatan" },
        ];
        const filename = `Laporan_Pendapatan_Keseluruhan_${overallRevDate.start}_${overallRevDate.end}`;
        
        if (type === "csv") {
            exportToCSV(filteredOverallRevenue, filename, headers);
        } else {
            exportToPDF(
                filteredOverallRevenue, 
                filename, 
                "Laporan Tren Pendapatan Keseluruhan", 
                headers,
                (key, val) => key === "pendapatan" ? `Rp ${Number(val).toLocaleString("id-ID")}` : val
            );
        }
    };

    const handleExportPopularSvc = (type: "csv" | "pdf") => {
        const headers = [
            { label: "Layanan", key: "name" },
            { label: "Penyedia", key: "penyedia" },
            { label: "Total Dipesan", key: "total" },
            { label: "Diterima", key: "diterima" },
            { label: "Ditolak", key: "ditolak" },
        ];
        const filename = `Laporan_Layanan_Terpopuler_${popularSvcDate.start}_${popularSvcDate.end}`;
        
        if (type === "csv") {
            exportToCSV(filteredPopularServices, filename, headers);
        } else {
            exportToPDF(
                filteredPopularServices, 
                filename, 
                "Laporan Layanan Paling Banyak Dipesan", 
                headers
            );
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-navy">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-slate-muted">
                        Ringkasan aktivitas platform layanan riset
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {MOCK_STATS.map((stat) => (
                        <StatCard
                            key={stat.key}
                            label={stat.label}
                            value={stat.value}
                            icon={stat.icon}
                            change={stat.change}
                            trend={stat.trend}
                            description={stat.description}
                        />
                    ))}
                </div>

                {/* Charts Grid 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <RevenueTrendWidget
                        title="Tren Pendapatan Keseluruhan"
                        subtitle="Akumulasi pendapatan per bulan di platform"
                        data={filteredOverallRevenue}
                        dateRange={overallRevDate}
                        onDateChange={(start, end) => setOverallRevDate({ start, end })}
                        onExportCSV={() => handleExportOverallRev("csv")}
                        onExportPDF={() => handleExportOverallRev("pdf")}
                    />
                    <TrendChartWidget
                        title="Grafik Analisis Tren Pesanan"
                        subtitle={`Total frekuensi pesanan seluruh fasilitas`}
                        data={filteredTrendData}
                        dateRange={reqDate}
                        onDateChange={(start, end) => setReqDate({ start, end })}
                        onExportCSV={() => handleExportReq("csv")}
                        onExportPDF={() => handleExportReq("pdf")}
                    />
                </div>

                {/* Charts Grid 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <IncomeChartWidget
                        title="Grafik Pendapatan per Penyedia Layanan"
                        subtitle={`Total pendapatan dari berbagai jenis layanan`}
                        data={filteredProviderIncome}
                        dateRange={revDate}
                        onDateChange={(start, end) => setRevDate({ start, end })}
                        onExportCSV={() => handleExportRev("csv")}
                        onExportPDF={() => handleExportRev("pdf")}
                    />
                    
                    <PopularServicesWidget
                        title="Layanan Paling Banyak Dipesan"
                        subtitle="Peringkat 5 layanan dengan pesanan terbanyak"
                        data={filteredPopularServices}
                        dateRange={popularSvcDate}
                        onDateChange={(start, end) => setPopularSvcDate({ start, end })}
                        onExportCSV={() => handleExportPopularSvc("csv")}
                        onExportPDF={() => handleExportPopularSvc("pdf")}
                    />
                </div>

                {/* Content Grid: Table + Activity */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    {/* Recent Orders Table */}
                    <div className="col-span-1 overflow-hidden rounded-xl border border-slate-border bg-white xl:col-span-2">
                        <div className="flex items-center justify-between border-b border-slate-border px-6 py-4">
                            <div>
                                <h2 className="text-sm font-bold text-navy">
                                    Pesanan Terbaru
                                </h2>
                                <p className="text-xs text-slate-muted">
                                    5 pesanan terakhir di platform
                                </p>
                            </div>
                            <button
                                onClick={() => navigate("/admin/orders")}
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
                            detailBaseUrl="/admin/orders" 
                        />
                    </div>

                    {/* Activity Feed */}
                    <div className="col-span-1 rounded-xl border border-slate-border bg-white">
                        <div className="border-b border-slate-border px-6 py-4">
                            <h2 className="text-sm font-bold text-navy">
                                Aktivitas Terkini
                            </h2>
                            <p className="text-xs text-slate-muted">
                                Log aktivitas platform
                            </p>
                        </div>

                        <div className="divide-y divide-slate-border">
                            {[
                                {
                                    key: "act-1",
                                    text: "Pesanan baru dari Dr. Andi Pratama",
                                    time: "2 jam lalu",
                                },
                                {
                                    key: "act-2",
                                    text: "Lab Kimia menyelesaikan pengujian #XRF-204",
                                    time: "3 jam lalu",
                                },
                                {
                                    key: "act-3",
                                    text: "Pembayaran dikonfirmasi — ORD-2024-001",
                                    time: "5 jam lalu",
                                },
                                {
                                    key: "act-4",
                                    text: "Pengguna baru mendaftar: mahasiswa@unhas.ac.id",
                                    time: "8 jam lalu",
                                },
                                {
                                    key: "act-5",
                                    text: "Kapal MV Ombak dijadwalkan 15 Mar 2026",
                                    time: "1 hari lalu",
                                },
                                {
                                    key: "act-6",
                                    text: "Alat SEM dipindahkan ke Lab Geologi",
                                    time: "1 hari lalu",
                                },
                            ].map((activity) => (
                                <div
                                    key={activity.key}
                                    className="flex items-start gap-3 px-6 py-3.5"
                                >
                                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-active-bg">
                                        <Clock
                                            size={13}
                                            className="text-navy"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm text-navy">
                                            {activity.text}
                                        </p>
                                        <p className="text-[11px] text-slate-muted">
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
