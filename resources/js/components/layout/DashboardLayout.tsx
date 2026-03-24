import { useState, useCallback, type ReactNode } from "react";
import {
    PanelLeftClose,
    PanelLeftOpen,
    LogOut,
    Bell,
    Search,
    ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
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
    activePath: string;
    expandedKey?: string | null;
    onToggleExpand?: (key: string) => void;
}

/**
 * tooltip hover hanya re-render item individual,
 * bukan seluruh sidebar, saat user mengarahkan kursor.
 */
function SidebarItem({ item, isActive, isCollapsed, onNavigate, activePath, expandedKey, onToggleExpand }: SidebarItemProps) {
    const [isHovered, setIsHovered] = useState(false);
    const itemRef = useRef<HTMLDivElement>(null);
    const Icon = item.icon;
    const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);
    const isExpanded = expandedKey === item.key;

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
                onClick={() => {
                    if (hasSubItems && onToggleExpand) {
                        onToggleExpand(item.key);
                    } else if (item.href) {
                        onNavigate(item.href);
                    }
                }}
                className={`
                    group flex w-full items-center gap-3 rounded-lg px-3 py-2.5
                    transition-all duration-300 ease-out relative
                    ${isCollapsed ? "justify-center" : ""}
                    ${
                        isActive && !hasSubItems
                            ? "bg-active-bg text-navy font-semibold"
                            : "text-slate-muted hover:bg-slate-50 hover:text-navy"
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
                    <div className="flex flex-1 items-center justify-between overflow-hidden">
                        <span className="truncate text-sm tracking-wide text-left flex-1">
                            {item.label}
                        </span>
                        {hasSubItems && (
                            <ChevronDown 
                                size={16} 
                                className={`shrink-0 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                            />
                        )}
                    </div>
                )}
            </button>

            {/* Render SubItems ketika di-expand dan sidebar tidak di-collapse */}
            {hasSubItems && isExpanded && !isCollapsed && (
                <div className="overflow-hidden">
                    <div className="ml-11 mt-1 flex flex-col gap-1 pb-1 relative before:absolute before:inset-y-0 before:-left-[18px] before:w-px before:bg-slate-200">
                        {item.subItems!.map((sub) => {
                            const isSubActive = sub.href ? activePath.startsWith(sub.href) : false;
                            return (
                                <button
                                    key={sub.key}
                                    onClick={() => sub.href && onNavigate(sub.href)}
                                    className={`
                                        flex w-full items-center rounded-md px-3 py-[7px] text-[14px] transition-all duration-300 relative group-hover:bg-slate-50
                                        ${
                                            isSubActive 
                                                ? "text-navy font-medium bg-active-bg/50 before:absolute before:left-[-18px] before:top-1/2 before:-translate-y-1/2 before:w-[19px] before:h-px before:bg-navy" 
                                                : "text-slate-500 hover:text-navy hover:bg-slate-50 hover:translate-x-1 before:absolute before:left-[-18px] before:top-1/2 before:-translate-y-1/2 before:w-[19px] before:h-px before:bg-transparent hover:before:bg-slate-300"
                                        }
                                    `}
                                >
                                    <div className="truncate text-left w-full">{sub.label}</div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Floating tooltip saat sidebar collapsed (Portal supaya tidak terclip) */}
            {typeof document !== "undefined" && createPortal(
                (isCollapsed && isHovered) ? (
                    <div
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
                    </div>
                ) : null,
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
    expandedKey: string | null;
    onToggleExpand: (key: string) => void;
}

function SidebarSection({
    section,
    activePath,
    isCollapsed,
    onNavigate,
    expandedKey,
    onToggleExpand,
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
                    isActive={
                        item.href
                            ? activePath.startsWith(item.href)
                            : item.subItems?.some(s => s.href && activePath.startsWith(s.href)) || false
                    }
                    isCollapsed={isCollapsed}
                    onNavigate={onNavigate}
                    activePath={activePath}
                    expandedKey={expandedKey}
                    onToggleExpand={onToggleExpand}
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

    // Mengambil state awal dari localStorage agar tetap konsisten saat refresh/navigasi
    const [isCollapsed, setIsCollapsed] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("sidebar_collapsed") === "true";
        }
        return false;
    });
    
    const activePath = location.pathname;
    const navRef = useRef<HTMLElement>(null);
    const [expandedKey, setExpandedKey] = useState<string | null>(null);

    // Initial expand based on activePath
    useEffect(() => {
        let found = false;
        outer: for (const sec of menuSections) {
            for (const item of sec.items) {
                if (item.subItems?.some(s => s.href && activePath.startsWith(s.href))) {
                    setExpandedKey(item.key);
                    found = true;
                    break outer;
                }
            }
        }
    }, [activePath, menuSections]);

    useEffect(() => {
        const savedScroll = sessionStorage.getItem("sidebar_scroll_pos");
        if (savedScroll && navRef.current) {
            requestAnimationFrame(() => {
                if (navRef.current) {
                    navRef.current.scrollTop = parseInt(savedScroll, 10);
                }
            });
        }
    }, [activePath]);

    const toggleSidebar = useCallback(() => {
        setIsCollapsed((prev) => {
            const newState = !prev;
            localStorage.setItem("sidebar_collapsed", String(newState));
            return newState;
        });
    }, []);

    // Shortcut Ctrl + B untuk toggle sidebar
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
                e.preventDefault();
                toggleSidebar();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);

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
                initial={false}
                animate={{ width: currentWidth }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    restDelta: 0.001
                }}
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
                        <div className="flex items-center gap-2.5 overflow-hidden">
                            {/* Logo mark */}
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                                <img src="https://ukk.unhas.ac.id/assets/img/logo.png" alt="" />
                            </div>
                            <div className="leading-none whitespace-nowrap">
                                <h1 className="text-sm font-bold tracking-tight text-navy">
                                    {platformTitle}
                                </h1>
                                <p className="mt-1 text-[12px] text-navy">
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
                        title={isCollapsed ? "Expand sidebar (Ctrl + B)" : "Collapse sidebar (Ctrl + B)"}
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
                <nav 
                    ref={navRef}
                    onScroll={(e) => sessionStorage.setItem("sidebar_scroll_pos", String(e.currentTarget.scrollTop))}
                    className="flex-1 space-y-5 overflow-y-auto overflow-x-hidden p-4"
                >
                    {menuSections.map((section) => (
                        <SidebarSection
                            key={section.title}
                            section={section}
                            activePath={activePath}
                            isCollapsed={isCollapsed}
                            onNavigate={handleNavigate}
                            expandedKey={expandedKey}
                            onToggleExpand={(key) => setExpandedKey(prev => prev === key ? null : key)}
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
                            <div className="min-w-0 flex-1 overflow-hidden">
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
