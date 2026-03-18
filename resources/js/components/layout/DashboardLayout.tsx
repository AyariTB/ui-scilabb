import { useState, useCallback, type ReactNode } from "react";
import {
    PanelLeftClose,
    PanelLeftOpen,
    LogOut,
    Bell,
    Search,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { MenuSection, MenuItem } from "@/constants/menuConfig";
import { useNavigate, useLocation } from "react-router-dom";

// --- Konstanta Layout ---
const SIDEBAR_WIDTH_EXPANDED = 256;
const SIDEBAR_WIDTH_COLLAPSED = 72;
const TRANSITION_DURATION = 0.25;

// --- Mock User ---
/**
 * Backend belum terhubung, data user ditampilkan untuk
 * keperluan pengembangan frontend. Akan diganti usePage() saat integrasi.
 */
const MOCK_USER = {
    name: "Dr. Andi Pratama",
    email: "andi.pratama@unhas.ac.id",
    role: "kapal",
} as const;

// --- Sub-komponen: SidebarItem ---

import { createPortal } from "react-dom";
import { useRef, useEffect } from "react";

interface SidebarItemProps {
    item: MenuItem;
    isActive: boolean;
    isCollapsed: boolean;
    onNavigate: (href: string) => void;
}

/**
 * tooltip hover hanya re-render item individual,
 * bukan seluruh sidebar, saat user mengarahkan kursor.
 */
function SidebarItem({ item, isActive, isCollapsed, onNavigate }: SidebarItemProps) {
    const [isHovered, setIsHovered] = useState(false);
    const itemRef = useRef<HTMLDivElement>(null);
    const Icon = item.icon;

    // Menghitung posisi Y secara real-time saat hover
    const [tooltipTop, setTooltipTop] = useState(0);

    useEffect(() => {
        if (isHovered && itemRef.current) {
            const rect = itemRef.current.getBoundingClientRect();
            setTooltipTop(rect.top + rect.height / 2);
        }
    }, [isHovered, isCollapsed]);

    return (
        <div
            ref={itemRef}
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <button
                onClick={() => onNavigate(item.href)}
                className={`
                    group flex w-full items-center gap-3 rounded-lg px-3 py-2.5
                    transition-all duration-200 ease-out
                    ${isCollapsed ? "justify-center" : ""}
                    ${
                        isActive
                            ? "bg-active-bg text-navy font-semibold"
                            : "text-slate-muted hover:bg-hover-bg hover:text-navy"
                    }
                `}
            >
                <Icon
                    size={20}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={`shrink-0 transition-colors duration-200 ${
                        isActive
                            ? "text-navy"
                            : "text-slate-muted group-hover:text-navy"
                    }`}
                />
                {!isCollapsed && (
                    <span className="truncate text-sm tracking-wide">
                        {item.label}
                    </span>
                )}
            </button>

            {/* Floating tooltip saat sidebar collapsed (Portal supaya tidak terclip) */}
            {typeof document !== "undefined" && createPortal(
                <AnimatePresence>
                    {isCollapsed && isHovered && (
                        <motion.div
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -4 }}
                            transition={{ duration: 0.15 }}
                            style={{
                                top: tooltipTop,
                                left: SIDEBAR_WIDTH_COLLAPSED + 8, // Sedikit geser ke kanan dari sidebar
                                transform: "translateY(-50%)",
                            }}
                            className="
                                fixed z-[9999] whitespace-nowrap rounded bg-navy px-2.5 py-1.5
                                text-xs font-medium text-white shadow-sm
                            "
                        >
                            {item.label}
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}

// --- Sub-komponen: SidebarSection ---

interface SidebarSectionProps {
    section: MenuSection;
    activePath: string;
    isCollapsed: boolean;
    onNavigate: (href: string) => void;
}

function SidebarSection({
    section,
    activePath,
    isCollapsed,
    onNavigate,
}: SidebarSectionProps) {
    return (
        <div className="space-y-1">
            {!isCollapsed && (
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-label-muted">
                    {section.title}
                </p>
            )}
            {isCollapsed && <div className="mx-auto my-1 h-px w-6 bg-slate-border" />}
            {section.items.map((item) => (
                <SidebarItem
                    key={item.key}
                    item={item}
                    isActive={activePath.startsWith(item.href)}
                    isCollapsed={isCollapsed}
                    onNavigate={onNavigate}
                />
            ))}
        </div>
    );
}

// --- Komponen Utama: DashboardLayout ---

interface DashboardLayoutProps {
    children: ReactNode;
    menuSections: MenuSection[];
    /** Judul platform di sidebar header */
    platformTitle?: string;
    /** Path aktif saat ini — digunakan untuk highlight menu item yang aktif */
    currentPath?: string;
}

/**
 * Tidak usePage(): Frontend-only development, belum terhubung ke backend.
 * Saat integrasi, ganti currentPath dengan usePage().url dan MOCK_USER dengan auth.user.
 */
export default function DashboardLayout({
    children,
    menuSections,
    platformTitle = "Platform Riset",
}: DashboardLayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    // Gunakan actual URL string dari react-router-dom
    const activePath = location.pathname;

    const toggleSidebar = useCallback(() => {
        setIsCollapsed((prev) => !prev);
    }, []);

    const handleNavigate = useCallback((href: string) => {
        navigate(href);
    }, [navigate]);

    const currentWidth = isCollapsed
        ? SIDEBAR_WIDTH_COLLAPSED
        : SIDEBAR_WIDTH_EXPANDED;

    // User display dari mock data
    const displayName = MOCK_USER.name;
    const displayEmail = MOCK_USER.email;
    const displayInitials = displayName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="flex h-screen overflow-hidden bg-soft-white">
            {/* --- Sidebar --- */}
            <motion.aside
                animate={{ width: currentWidth }}
                transition={{ duration: TRANSITION_DURATION, ease: "easeInOut" }}
                className="
                    relative flex h-full shrink-0 flex-col
                    border-r border-slate-border bg-white
                "
            >
                {/* Header: Logo + Toggle */}
                <div
                    className={`flex items-center border-b border-slate-border p-4 ${
                        isCollapsed ? "justify-center" : "justify-between"
                    }`}
                >
                    {!isCollapsed && (
                        <div className="flex items-center gap-2.5">
                            {/* Logo mark */}
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy">
                                <span className="text-xs font-bold text-white">
                                    PR
                                </span>
                            </div>
                            <div className="leading-none">
                                <h1 className="text-sm font-bold tracking-tight text-navy">
                                    {platformTitle}
                                </h1>
                                <p className="text-[10px] text-slate-muted">
                                    UKK UNHAS
                                </p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={toggleSidebar}
                        className="
                            flex h-8 w-8 items-center justify-center rounded-lg
                            text-slate-muted transition-colors duration-200
                            hover:bg-hover-bg hover:text-navy
                        "
                        aria-label={
                            isCollapsed ? "Perluas sidebar" : "Kecilkan sidebar"
                        }
                    >
                        {isCollapsed ? (
                            <PanelLeftOpen size={18} />
                        ) : (
                            <PanelLeftClose size={18} />
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-5 overflow-y-auto overflow-x-hidden p-4">
                    {menuSections.map((section) => (
                        <SidebarSection
                            key={section.title}
                            section={section}
                            activePath={activePath}
                            isCollapsed={isCollapsed}
                            onNavigate={handleNavigate}
                        />
                    ))}
                </nav>

                {/* Footer: User info */}
                <div className="border-t border-slate-border p-4">
                    <div
                        className={`flex items-center gap-3 ${
                            isCollapsed ? "justify-center" : ""
                        }`}
                    >
                        {/* Avatar */}
                        <div
                            className="
                                flex h-9 w-9 shrink-0 items-center justify-center
                                rounded-full bg-navy text-xs font-semibold text-white
                            "
                        >
                            {displayInitials}
                        </div>

                        {!isCollapsed && (
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-navy">
                                    {displayName}
                                </p>
                                <p className="truncate text-[11px] text-slate-muted">
                                    {displayEmail}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.aside>

            {/* --- Main Content Area --- */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-border bg-white px-6">
                    {/* Search */}
                    <div className="flex items-center gap-2 rounded-lg bg-soft-white px-3 py-2">
                        <Search size={16} className="text-slate-muted" />
                        <input
                            type="text"
                            placeholder="Cari fitur, halaman..."
                            className="
                                w-64 border-none bg-transparent text-sm text-navy
                                placeholder:text-label-muted focus:outline-none
                            "
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            className="
                                relative flex h-9 w-9 items-center justify-center
                                rounded-lg text-slate-muted transition-colors
                                hover:bg-hover-bg hover:text-navy
                            "
                            aria-label="Notifikasi"
                        >
                            <Bell size={18} />
                            {/* Notification dot */}
                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />
                        </button>

                        <div className="h-6 w-px bg-slate-border" />

                        <button
                            onClick={() => {
                                // Placeholder: akan diganti dengan logika logout saat integrasi
                                console.info("[Mock] Logout diklik");
                            }}
                            className="
                                flex h-9 w-9 items-center justify-center rounded-lg
                                text-slate-muted transition-colors
                                hover:bg-red-50 hover:text-danger
                            "
                            aria-label="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
