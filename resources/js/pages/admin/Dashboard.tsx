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
} from "lucide-react";

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

const MOCK_RECENT_ORDERS = [
    {
        id: "ORD-2024-001",
        customer: "Dr. Andi Pratama",
        service: "Pengujian XRF",
        status: "completed" as const,
        amount: "Rp 2.500.000",
        time: "2 jam lalu",
    },
    {
        id: "ORD-2024-002",
        customer: "Prof. Sari Wulandari",
        service: "Analisis SEM",
        status: "processing" as const,
        amount: "Rp 4.200.000",
        time: "5 jam lalu",
    },
    {
        id: "ORD-2024-003",
        customer: "Mahasiswa - Kelompok B",
        service: "Uji Viskositas",
        status: "pending" as const,
        amount: "Rp 850.000",
        time: "1 hari lalu",
    },
    {
        id: "ORD-2024-004",
        customer: "PT. Mineral Nusantara",
        service: "Pengujian AAS",
        status: "completed" as const,
        amount: "Rp 6.100.000",
        time: "1 hari lalu",
    },
    {
        id: "ORD-2024-005",
        customer: "Dr. Budi Santoso",
        service: "Analisis FTIR",
        status: "processing" as const,
        amount: "Rp 3.750.000",
        time: "2 hari lalu",
    },
] as const;

// --- Helper: Status Badge ---

const STATUS_CONFIG = {
    completed: {
        label: "Selesai",
        className: "bg-emerald-50 text-emerald-700",
    },
    processing: {
        label: "Diproses",
        className: "bg-blue-50 text-blue-700",
    },
    pending: {
        label: "Menunggu",
        className: "bg-amber-50 text-amber-700",
    },
} as const;

type OrderStatus = keyof typeof STATUS_CONFIG;

function StatusBadge({ status }: { status: OrderStatus }) {
    const config = STATUS_CONFIG[status];
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${config.className}`}
        >
            {config.label}
        </span>
    );
}

// --- Komponen Utama ---

export default function Dashboard() {
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
                    {MOCK_STATS.map((stat) => {
                        const Icon = stat.icon;
                        const isUp = stat.trend === "up";

                        return (
                            <div
                                key={stat.key}
                                className="
                                    group relative overflow-hidden rounded-xl
                                    border border-slate-border bg-white p-6
                                    transition-all duration-200
                                    hover:border-label-muted hover:shadow-sm
                                "
                            >
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <p className="text-xs font-medium uppercase tracking-wider text-slate-muted">
                                            {stat.label}
                                        </p>
                                        <p className="text-2xl font-bold text-navy">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-soft-white">
                                        <Icon
                                            size={20}
                                            className="text-slate-muted"
                                        />
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center gap-1.5">
                                    {isUp ? (
                                        <ArrowUpRight
                                            size={14}
                                            className="text-emerald-500"
                                        />
                                    ) : (
                                        <ArrowDownRight
                                            size={14}
                                            className="text-red-500"
                                        />
                                    )}
                                    <span
                                        className={`text-xs font-semibold ${
                                            isUp
                                                ? "text-emerald-600"
                                                : "text-red-500"
                                        }`}
                                    >
                                        {stat.change}
                                    </span>
                                    <span className="text-xs text-slate-muted">
                                        {stat.description}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
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
                                className="
                                    flex h-8 w-8 items-center justify-center rounded-lg
                                    text-slate-muted transition-colors
                                    hover:bg-hover-bg hover:text-navy
                                "
                                aria-label="Opsi lainnya"
                            >
                                <MoreHorizontal size={16} />
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
                                            Pelanggan
                                        </th>
                                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-muted">
                                            Layanan
                                        </th>
                                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-muted">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-muted">
                                            Jumlah
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
                                                {order.customer}
                                            </td>
                                            <td className="px-6 py-3.5 text-sm text-text-secondary">
                                                {order.service}
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <StatusBadge
                                                    status={order.status}
                                                />
                                            </td>
                                            <td className="px-6 py-3.5 text-right text-sm font-semibold text-navy">
                                                {order.amount}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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
