import {
    LayoutDashboard,
    Users,
    FlaskConical,
    FileText,
    ShoppingCart,
    Wrench,
    Ship,
    CalendarDays,
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
    /** URL tujuan (Inertia route), opsional jika memiliki submenu */
    href?: string;
    /** Optional submenu item untuk kapabilitas dropdown */
    subItems?: Omit<MenuItem, "icon" | "subItems">[];
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
            {
                key: "orders",
                label: "Pesanan",
                icon: ShoppingCart,
                href: "/admin/orders",
            },
        ],
    },
    {
        title: "Alat dan Layanan",
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
                        icon: FileText,
                        href: "/admin/services",
                    },
                    {
                        key: "tools",
                        label: "Alat & Instrumen",
                        icon: Wrench,
                        href: "/admin/tools",
                    },
                ],
    },
    {
        title: "Manajemen Kapal",
        items: [
            {
                key: "admin-exp1",
                label: "KR Explorer 1",
                icon: Ship,
                subItems: [
                    {
                        key: "admin-exp1-general",
                        label: "Informasi Kapal",
                        href: "/admin/explorer-1/general",
                    },
                    {
                        key: "admin-exp1-tools",
                        label: "Alat Kapal",
                        href: "/admin/explorer-1/tools",
                    },
                    {
                        key: "admin-exp1-facilities",
                        label: "Fasilitas",
                        href: "/admin/explorer-1/facilities",
                    },
                    {
                        key: "admin-exp1-guides",
                        label: "Panduan/SOP",
                        href: "/admin/explorer-1/guides",
                    },
                ],
            },
            {
                key: "admin-exp2",
                label: "KR Explorer 2",
                icon: Ship,
                subItems: [
                    {
                        key: "admin-exp2-general",
                        label: "Informasi Kapal",
                        href: "/admin/explorer-2/general",
                    },
                    {
                        key: "admin-exp2-tools",
                        label: "Alat Kapal",
                        href: "/admin/explorer-2/tools",
                    },
                    {
                        key: "admin-exp2-facilities",
                        label: "Fasilitas",
                        href: "/admin/explorer-2/facilities",
                    },
                    {
                        key: "admin-exp2-guides",
                        label: "Panduan/SOP",
                        href: "/admin/explorer-2/guides",
                    },
                ],
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
                icon: ShoppingCart,
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
                key: "orders",
                label: "Pesanan",
                icon: ShoppingCart,
                href: "/manager/orders",
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
        title: "Explorer 1",
        items: [
            {
                key: "exp1-general",
                label: "Umum",
                icon: Ship,
                href: "/manager/explorer-1/general",
            },
            {
                key: "exp1-tools",
                label: "Alat Kapal",
                icon: Wrench,
                href: "/manager/explorer-1/tools",
            },
            {
                key: "exp1-facilities",
                label: "Fasilitas",
                icon: Package,
                href: "/manager/explorer-1/facilities",
            },
            {
                key: "exp1-guides",
                label: "Panduan/SOP",
                icon: FileText,
                href: "/manager/explorer-1/guides",
            },
        ],
    },
    {
        title: "Explorer 2",
        items: [
            {
                key: "exp2-general",
                label: "Umum",
                icon: Ship,
                href: "/manager/explorer-2/general",
            },
            {
                key: "exp2-tools",
                label: "Alat Kapal",
                icon: Wrench,
                href: "/manager/explorer-2/tools",
            },
            {
                key: "exp2-facilities",
                label: "Fasilitas",
                icon: Package,
                href: "/manager/explorer-2/facilities",
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
