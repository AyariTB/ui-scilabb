import { useState } from "react";
import ManagerLayout from "@/components/layout/ManagerLayout";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { COLORS } from "@/constants/colors";
import {
    CreditCard,
    TrendingUp,
    Anchor
} from "lucide-react";
import { ExportActions } from "@/components/ui/ExportActions";
import { exportToCSV, exportToPDF } from "@/lib/export";
import {
    BarChart,
    LineChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
} from "recharts";

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

const MOCK_RECENT_ORDERS = [
    {
        id: "PES-0045",
        booker: "Andi Pratama",
        dates: "20–25 Mar 2025",
        statusLabel: "Menunggu Verifikasi Pesanan",
        statusVariant: "warning" as const,
    },
    {
        id: "PES-0044",
        booker: "Siti Rahayu",
        dates: "15–18 Mar 2025",
        statusLabel: "Menunggu Verifikasi Pembayaran",
        statusVariant: "warning" as const,
    },
    {
        id: "PES-0043",
        booker: "Dr. Budi Santoso",
        dates: "10–16 Feb 2025",
        statusLabel: "Terverifikasi (Lunas)",
        statusVariant: "success" as const,
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
                        <div className="flex flex-col rounded-xl border border-slate-border bg-white">
                            <div className="flex items-center justify-between border-b border-slate-border px-6 py-4">
                                <div>
                                    <h2 className="text-sm font-bold text-navy">
                                        Grafik Pendapatan
                                    </h2>
                                    <p className="text-xs text-slate-muted">
                                        Total nominal penyewaan tahun 2025
                                    </p>
                                </div>
                                <ExportActions 
                                    startDate={revDate.start}
                                    endDate={revDate.end}
                                    onDateChange={(start, end) => setRevDate({ start, end })}
                                    onExportCSV={() => handleExportRev("csv")}
                                    onExportPDF={() => handleExportRev("pdf")}
                                />
                            </div>
                            <div className="p-6">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={filteredRevData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            stroke={COLORS.chart.grid}
                                        />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: COLORS.chart.text }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: COLORS.chart.text }}
                                            tickFormatter={(value) =>
                                                `Rp ${value / 1000000}Jt`
                                            }
                                            dx={-10}
                                        />
                                        <RechartsTooltip
                                            cursor={{ fill: COLORS.chart.tooltipBg }}
                                            contentStyle={{
                                                borderRadius: "8px",
                                                border: `1px solid ${COLORS.chart.grid}`,
                                                boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                                            }}
                                            formatter={(value: any) => [
                                                `Rp ${Number(value).toLocaleString("id-ID")}`,
                                                "Pendapatan",
                                            ]}
                                        />
                                        <Bar
                                            dataKey="pendapatan"
                                            name="Pendapatan"
                                            fill={COLORS.chart.primary}
                                            radius={[4, 4, 0, 0]}
                                            maxBarSize={48}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Grafik Jumlah Pengajuan */}
                        <div className="flex flex-col rounded-xl border border-slate-border bg-white">
                            <div className="flex items-center justify-between border-b border-slate-border px-6 py-4">
                                <div>
                                    <h2 className="text-sm font-bold text-navy">
                                        Grafik Pengajuan Sewa
                                    </h2>
                                    <p className="text-xs text-slate-muted">
                                        Total frekuensi pengajuan tahun 2025
                                    </p>
                                </div>
                                <ExportActions 
                                    startDate={reqDate.start}
                                    endDate={reqDate.end}
                                    onDateChange={(start, end) => setReqDate({ start, end })}
                                    onExportCSV={() => handleExportReq("csv")}
                                    onExportPDF={() => handleExportReq("pdf")}
                                />
                            </div>
                            <div className="p-6">
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={filteredReqData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                            stroke={COLORS.chart.grid}
                                        />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: COLORS.chart.text }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: COLORS.chart.text }}
                                            dx={-10}
                                        />
                                        <RechartsTooltip
                                            contentStyle={{
                                                borderRadius: "8px",
                                                border: `1px solid ${COLORS.chart.grid}`,
                                                boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                                            }}
                                            formatter={(value: any) => [
                                                `${value} Pengajuan`,
                                                "Jumlah Sewaan",
                                            ]}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="pesanan"
                                            name="Jumlah Sewaan"
                                            stroke={COLORS.chart.primary}
                                            strokeWidth={3}
                                            dot={{ r: 4, strokeWidth: 2, fill: COLORS.chart.primary }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
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
                                className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                            >
                                Lihat Semua
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px]">
                                <thead>
                                    <tr className="border-b border-slate-border bg-soft-white">
                                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-muted">
                                            ID Pesanan
                                        </th>
                                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-muted">
                                            Pemesan
                                        </th>
                                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-muted">
                                            Waktu Sewa
                                        </th>
                                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-muted">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-muted">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {MOCK_RECENT_ORDERS.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="
                                                border-b border-slate-border last:border-none
                                                transition-colors hover:bg-soft-white
                                            "
                                        >
                                            <td className="px-6 py-3.5 text-sm font-medium text-navy">
                                                {order.id}
                                            </td>
                                            <td className="px-6 py-3.5 text-sm text-text-secondary">
                                                {order.booker}
                                            </td>
                                            <td className="px-6 py-3.5 text-sm text-text-secondary flex items-center gap-1.5">
                                                <span className="h-1.5 w-1.5 rounded-full bg-slate-border" />
                                                {order.dates}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <Badge variant={order.statusVariant}>{order.statusLabel}</Badge>
                                            </td>
                                            <td className="px-6 py-3.5 text-right">
                                                <button className="rounded-lg border border-slate-border px-3 py-1.5 text-xs font-semibold text-navy transition-colors hover:bg-soft-white">
                                                    Lihat Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </ManagerLayout>
    );
}
