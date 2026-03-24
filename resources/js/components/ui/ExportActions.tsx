import { useState, useRef, useEffect } from "react";
import { 
    FileDown, 
    ChevronDown, 
    ChevronUp, 
    FileSpreadsheet, 
    FileText 
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface ExportActionsProps {
    /** Tanggal mulai (YYYY-MM-DD) */
    startDate: string;
    /** Tanggal akhir (YYYY-MM-DD) */
    endDate: string;
    /** Callback saat tanggal berubah */
    onDateChange: (start: string, end: string) => void;
    /** Callback saat tombol Export CSV diklik */
    onExportCSV: () => void;
    /** Callback saat tombol Export PDF diklik */
    onExportPDF: () => void;
    /** Label tombol export (default: "Export") */
    exportLabel?: string;
    /** Judul untuk input tanggal (opsional) */
    dateLabel?: string;
    /** Class tambahan untuk container utama */
    className?: string;
}

export function ExportActions({
    startDate,
    endDate,
    onDateChange,
    onExportCSV,
    onExportPDF,
    exportLabel = "Export",
    className = "",
}: ExportActionsProps) {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Menangani penutupan dropdown saat klik di luar komponen
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* Capsule Input Tanggal */}
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-border bg-slate-50/50 px-2 py-1">
                <input 
                    type="date" 
                    aria-label="Mulai" 
                    className="w-28 bg-transparent text-[11px] font-medium text-navy focus:outline-none cursor-pointer" 
                    value={startDate}
                    onChange={(e) => onDateChange(e.target.value, endDate)}
                />
                <span className="text-slate-300 text-xs font-light">/</span>
                <input 
                    type="date" 
                    aria-label="Sampai" 
                    className="w-28 bg-transparent text-[11px] font-medium text-navy focus:outline-none cursor-pointer" 
                    value={endDate}
                    onChange={(e) => onDateChange(startDate, e.target.value)}
                />
            </div>

            {/* Tombol Export & Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className={`
                        flex h-7 items-center gap-2 rounded-xl border border-slate-border px-3 text-[11px] font-bold transition-all whitespace-nowrap
                        ${showDropdown ? 'bg-navy text-white' : 'bg-white text-navy hover:bg-soft-white'}
                    `}
                >
                    <FileDown size={14} />
                    {exportLabel}
                    {showDropdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                
                <AnimatePresence>
                    {showDropdown && (
                        <motion.div 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 4 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-slate-border bg-white shadow-sm"
                        >
                            <button 
                                onClick={() => { onExportCSV(); setShowDropdown(false); }} 
                                className="group flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
                            >
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
                                    <FileSpreadsheet size={14} />
                                </div>
                                <span className="text-[12px] font-semibold text-navy">Export CSV</span>
                            </button>
                            <button 
                                onClick={() => { onExportPDF(); setShowDropdown(false); }} 
                                className="group flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
                            >
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 transition-colors group-hover:bg-rose-100">
                                    <FileText size={14} />
                                </div>
                                <span className="text-[12px] font-semibold text-navy">Export PDF</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
