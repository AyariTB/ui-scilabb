import {
    LayoutDashboard,
    Users,
    FlaskConical,
    FileText,
    ShoppingCart,
    Wrench,
    CreditCard,
    Ship,
    CalendarDays,
    ClipboardList,
    BarChart3,
    Package,
    type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/types/user.types";


// --- Types ---

export interface MenuItem {
    /** Unique key untuk tracking active state */
    key: string;
    label: string;
    icon: LucideIcon;
    /** URL tujuan (Inertia route) */
    href: string;
}

export interface MenuSection {
    title: string;
    items: MenuItem[];
}

// --- Konfigurasi Per Role ---

const ADMIN_MENU: MenuSection[] = [
    {
        title: "Utama",
        items: [
            {
                key: "dashboard",
                label: "Dashboard",
                icon: LayoutDashboard,
                href: "/admin/dashboard",
            },
            {
                key: "users",
                label: "Manajemen Pengguna",
                icon: Users,
                href: "/admin/users",
            },
        ],
    },
    {
        title: "Layanan",
        items: [
            {
                key: "labs",
                label: "Laboratorium",
                icon: FlaskConical,
                href: "/admin/labs",
            },
            {
                key: "services",
                label: "Layanan Pengujian",
                icon: Wrench,
                href: "/admin/services",
            },
            {
                key: "tools",
                label: "Alat & Instrumen",
                icon: Package,
                href: "/admin/tools",
            },
        ],
    },
    {
        title: "Transaksi",
        items: [
            {
                key: "orders",
                label: "Pesanan",
                icon: ShoppingCart,
                href: "/admin/orders",
            },
            {
                key: "transactions",
                label: "Transaksi",
                icon: CreditCard,
                href: "/admin/transactions",
            },
        ],
    },
    {
        title: "Konten",
        items: [
            {
                key: "articles",
                label: "Artikel",
                icon: FileText,
                href: "/admin/articles",
            },
        ],
    },
];

const HEAD_OF_LAB_MENU: MenuSection[] = [
    {
        title: "Utama",
        items: [
            {
                key: "dashboard",
                label: "Dashboard",
                icon: LayoutDashboard,
                href: "/head-of-lab/dashboard",
            },
        ],
    },
    {
        title: "Laboratorium",
        items: [
            {
                key: "orders",
                label: "Pesanan Masuk",
                icon: ClipboardList,
                href: "/head-of-lab/orders",
            },
            {
                key: "tools",
                label: "Alat & Instrumen",
                icon: Wrench,
                href: "/head-of-lab/tools",
            },
        ],
    },
    {
        title: "Laporan",
        items: [
            {
                key: "reports",
                label: "Laporan",
                icon: BarChart3,
                href: "/head-of-lab/reports",
            },
        ],
    },
];

const MANAGER_MENU: MenuSection[] = [
    {
        title: "Utama",
        items: [
            {
                key: "dashboard",
                label: "Dashboard",
                icon: LayoutDashboard,
                href: "/manager/dashboard",
            },
            {
                key: "calendar",
                label: "Kalender",
                icon: CalendarDays,
                href: "/manager/calendar",
            },
        ],
    },
    {
        title: "Kapal",
        items: [
            {
                key: "vessels",
                label: "Daftar Kapal",
                icon: Ship,
                href: "/manager/vessel",
            },
            {
                key: "bookings",
                label: "Booking",
                icon: ClipboardList,
                href: "/manager/bookings",
            },
        ],
    },
    {
        title: "Keuangan",
        items: [
            {
                key: "payments",
                label: "Pembayaran",
                icon: CreditCard,
                href: "/manager/payments",
            },
            {
                key: "reports",
                label: "Laporan",
                icon: BarChart3,
                href: "/manager/reports",
            },
        ],
    },
];

/**
 * Lookup map: role → menu sections.
 * Record<string, ...>: agar fallback ke empty array untuk role tidak dikenal
 */
export const MENU_CONFIG: Record<UserRole, MenuSection[]> = {
    superadmin: ADMIN_MENU,
    admin: ADMIN_MENU,
    head_of_lab: HEAD_OF_LAB_MENU,
    manager: MANAGER_MENU,
} as const;
