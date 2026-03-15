/**
 * Semantic Color Constants
 *
 * CATATAN: Warna utama dashboard sudah didefinisikan sebagai Tailwind theme tokens
 * di app.css (@theme). File ini berfungsi sebagai:
 * 1. Dokumentasi palet warna
 * 2. Referensi untuk komponen non-Tailwind (inline styles, canvas, chart, dll)
 * 3. Single source of truth untuk logika JS yang butuh hex langsung
 */
export const COLORS = {
    /** Navy Blue — warna identitas utama untuk teks, ikon aktif, dan aksen */
    primary: {
        navy: "#1B263B",       // Tailwind: text-navy, bg-navy
        navyLight: "#2d3a50",  // Tailwind: bg-navy-light
        navyMuted: "#415A77",
    },
    sidebar: {
        background: "#FFFFFF",
        hover: "#F1F5F9",      // Tailwind: bg-hover-bg
        active: "#F0F4FF",     // Tailwind: bg-active-bg
        border: "#E2E8F0",     // Tailwind: border-slate-border
        text: {
            active: "#1B263B",  // Tailwind: text-navy
            inactive: "#94A3B8", // Tailwind: text-slate-muted
        },
    },
    status: {
        success: "#10B981",
        error: "#EF4444",       // Tailwind: text-danger, bg-danger
        warning: "#F59E0B",
        info: "#3B82F6",
    },
    background: {
        main: "#F8FAFC",        // Tailwind: bg-soft-white
        card: "#FFFFFF",
    },
} as const;
