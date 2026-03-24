import { useState, useMemo, useRef, useEffect } from 'react';
import {
    ClipboardList, User, Calendar, Loader2,
    ChevronRight, ChevronLeft, CheckCircle2,
    Building2, Mail, Phone, Tag, FileText,
    Search, X, Plus, Minus, Package,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { MOCK_PROVIDERS, type Provider, type ProviderCategory } from '@/mocks/provider.mock';
import type { Booking, BookingStatus, PaymentStatus, UserType, BookingItem } from '@/types/booking.types';


type ServiceCategory = 'KAPAL' | 'LAB' | 'SAS';

/** Item yang sudah dipilih beserta kuantitasnya */
interface SelectedServiceItem {
    service_id: string;
    service_name: string;
    price_per_unit: number;
    unit: string;
    quantity: number;
}

interface Step1Data {
    booker_name: string;
    booker_institution: string;
    booker_email: string;
    booker_phone: string;
    user_type: UserType;
}

interface Step2Data {
    activity_name: string;
    service_category: ServiceCategory;
    /** Provider yang dipilih dari dropdown */
    selected_provider: Provider | null;
    /** Layanan yang dipilih beserta qty-nya */
    selected_items: SelectedServiceItem[];
    start_date: string;
    end_date: string;
    special_request: string;
}

interface FormErrors {
    booker_name?: string;
    booker_institution?: string;
    booker_email?: string;
    booker_phone?: string;
    activity_name?: string;
    provider?: string;
    items?: string;
    start_date?: string;
    end_date?: string;
}

const INITIAL_STEP1: Step1Data = {
    booker_name: '',
    booker_institution: '',
    booker_email: '',
    booker_phone: '',
    user_type: 'internal',
};

const INITIAL_STEP2: Step2Data = {
    activity_name: '',
    service_category: 'LAB',
    selected_provider: null,
    selected_items: [],
    start_date: '',
    end_date: '',
    special_request: '',
};

// HELPERS

function hitungDurasiHari(startDate: string, endDate: string): number {
    if (!startDate || !endDate) return 0;
    const ms = new Date(endDate).getTime() - new Date(startDate).getTime();
    return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)) + 1);
}

function generateBookingCode(category: ServiceCategory): string {
    const prefix = category === 'KAPAL' ? 'PES' : category === 'LAB' ? 'LAB' : 'SAS';
    const tahun = new Date().getFullYear();
    const acak = String(Math.floor(Math.random() * 9000) + 1000);
    return `${prefix}-${tahun}-${acak}`;
}

function formatIDR(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
    }).format(value);
}

// PROPS

export interface CreateOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newBooking: Booking) => void;
    isLoading?: boolean;
}

// SUB-KOMPONEN KECIL
function FieldLabel({ htmlFor, icon: Icon, label, required }: {
    htmlFor: string; icon: React.ElementType; label: string; required?: boolean;
}) {
    return (
        <label htmlFor={htmlFor} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1.5">
            <Icon size={13} className="text-slate-400" />
            {label}
            {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
    );
}

function FormInput({ id, type = 'text', placeholder, value, onChange, error }: {
    id: string; type?: string; placeholder?: string; value: string;
    onChange: (v: string) => void; error?: string;
}) {
    return (
        <div>
            <input
                id={id} type={type} placeholder={placeholder} value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm text-navy placeholder:text-slate-400 transition-all focus:outline-none focus:ring-1 focus:ring-navy ${
                    error ? 'border-red-300 bg-red-50' : 'border-slate-border bg-white focus:border-navy'
                }`}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

function StepIndicator({ currentStep }: { currentStep: number }) {
    const labels = ['Info Pemesan', 'Detail Pesanan', 'Konfirmasi'];
    return (
        <div className="flex items-center justify-center gap-1 mb-6">
            {labels.map((label, idx) => {
                const step = idx + 1;
                const isActive = step === currentStep;
                const isDone = step < currentStep;
                return (
                    <div key={step} className="flex items-center">
                        <div className="flex items-center gap-1.5">
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                                isDone ? 'bg-emerald-500 text-white' : isActive ? 'bg-navy text-white' : 'bg-slate-100 text-slate-400'
                            }`}>
                                {isDone ? <CheckCircle2 size={13} /> : step}
                            </div>
                            <span className={`text-xs font-medium ${isActive ? 'text-navy' : isDone ? 'text-emerald-600' : 'text-slate-400'}`}>
                                {label}
                            </span>
                        </div>
                        {step < labels.length && (
                            <div className={`mx-2 h-px w-8 ${isDone ? 'bg-emerald-300' : 'bg-slate-200'}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// SEARCHABLE PROVIDER DROPDOWN
function ProviderSearchDropdown({
    category,
    selected,
    onSelect,
    error,
}: {
    category: ServiceCategory;
    selected: Provider | null;
    onSelect: (p: Provider | null) => void;
    error?: string;
}) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter penyedia berdasarkan kategori dan query pencarian
    const providerOptions = useMemo(() => {
        const lowerQuery = query.toLowerCase();
        return MOCK_PROVIDERS.filter(
            (p) => p.category === (category as ProviderCategory) &&
            (lowerQuery === '' || p.name.toLowerCase().includes(lowerQuery))
        );
    }, [category, query]);

    // Tutup dropdown ketika klik di luar
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Reset saat kategori berubah
    useEffect(() => {
        onSelect(null);
        setQuery('');
    }, [category]);

    return (
        <div ref={containerRef} className="relative">
            <div
                className={`flex items-center gap-2 w-full rounded-lg border px-3 py-2.5 cursor-pointer transition-all ${
                    error ? 'border-red-300 bg-red-50' : isOpen ? 'border-navy ring-1 ring-navy bg-white' : 'border-slate-border bg-white hover:border-slate-400'
                }`}
                onClick={() => setIsOpen(true)}
            >
                <Search size={14} className="text-slate-400 flex-shrink-0" />
                {selected && !isOpen ? (
                    <span className="flex-1 text-sm text-navy font-medium truncate">{selected.name}</span>
                ) : (
                    <input
                        autoFocus={isOpen}
                        type="text"
                        placeholder="Cari nama penyedia..."
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
                        onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
                        className="flex-1 text-sm text-navy placeholder:text-slate-400 bg-transparent outline-none"
                    />
                )}
                {selected && (
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onSelect(null); setQuery(''); setIsOpen(false); }}
                        className="p-0.5 rounded text-slate-400 hover:text-red-500 transition-colors"
                    >
                        <X size={13} />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-xl border border-slate-border shadow-lg max-h-52 overflow-y-auto">
                    {providerOptions.length === 0 ? (
                        <div className="px-4 py-6 text-center text-sm text-slate-400">
                            Tidak ada penyedia yang cocok
                        </div>
                    ) : (
                        providerOptions.map((p) => (
                            <button
                                key={p.id}
                                type="button"
                                className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                                onClick={() => { onSelect(p); setIsOpen(false); setQuery(''); }}
                            >
                                <p className="text-sm font-medium text-navy">{p.name}</p>
                                {p.description && (
                                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{p.description}</p>
                                )}
                            </button>
                        ))
                    )}
                </div>
            )}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

// SERVICE ITEM SELECTOR — daftar layanan dengan quantity input
function ServiceItemSelector({
    provider,
    selectedItems,
    onItemsChange,
    error,
}: {
    provider: Provider;
    selectedItems: SelectedServiceItem[];
    onItemsChange: (items: SelectedServiceItem[]) => void;
    error?: string;
}) {
    const getSelected = (serviceId: string) =>
        selectedItems.find((i) => i.service_id === serviceId);

    const toggleItem = (svc: Provider['services'][0]) => {
        const exists = getSelected(svc.id);
        if (exists) {
            onItemsChange(selectedItems.filter((i) => i.service_id !== svc.id));
        } else {
            onItemsChange([...selectedItems, {
                service_id: svc.id,
                service_name: svc.name,
                price_per_unit: svc.price_per_unit,
                unit: svc.unit,
                quantity: 1,
            }]);
        }
    };

    const setQty = (serviceId: string, qty: number) => {
        if (qty < 1) return;
        onItemsChange(selectedItems.map((i) =>
            i.service_id === serviceId ? { ...i, quantity: qty } : i
        ));
    };

    return (
        <div>
            <div className="space-y-2">
                {provider.services.map((svc) => {
                    const sel = getSelected(svc.id);
                    const isSelected = Boolean(sel);
                    return (
                        <div
                            key={svc.id}
                            className={`rounded-xl border transition-all ${
                                isSelected
                                    ? 'border-navy/30 bg-navy/5'
                                    : 'border-slate-border bg-white hover:border-slate-300'
                            }`}
                        >
                            <div className="flex items-center gap-3 px-4 py-3">
                                {/* Checkbox-style toggle */}
                                <button
                                    type="button"
                                    onClick={() => toggleItem(svc)}
                                    className={`h-5 w-5 rounded flex-shrink-0 flex items-center justify-center border-2 transition-all ${
                                        isSelected
                                            ? 'bg-navy border-navy text-white'
                                            : 'border-slate-300 bg-white hover:border-navy'
                                    }`}
                                >
                                    {isSelected && <CheckCircle2 size={12} />}
                                </button>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-navy truncate">{svc.name}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {formatIDR(svc.price_per_unit)} / {svc.unit}
                                    </p>
                                </div>

                                {/* Quantity stepper - hanya tampil ketika item dipilih */}
                                {isSelected && sel && (
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => setQty(svc.id, sel.quantity - 1)}
                                            disabled={sel.quantity <= 1}
                                            className="h-7 w-7 rounded-lg border border-slate-border flex items-center justify-center text-navy hover:bg-slate-100 disabled:opacity-30 transition-all"
                                        >
                                            <Minus size={12} />
                                        </button>
                                        <input
                                            type="number"
                                            min={1}
                                            value={sel.quantity}
                                            onChange={(e) => setQty(svc.id, parseInt(e.target.value) || 1)}
                                            className="w-12 text-center text-sm font-semibold text-navy border border-slate-border rounded-lg py-1 focus:outline-none focus:ring-1 focus:ring-navy"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setQty(svc.id, sel.quantity + 1)}
                                            className="h-7 w-7 rounded-lg border border-slate-border flex items-center justify-center text-navy hover:bg-slate-100 transition-all"
                                        >
                                            <Plus size={12} />
                                        </button>
                                        <span className="text-xs text-slate-500 w-8">{svc.unit}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
        </div>
    );
}

// KOMPONEN UTAMA
export function CreateOrderModal({ isOpen, onClose, onSubmit, isLoading = false }: CreateOrderModalProps) {
    const [step, setStep] = useState(1);
    const [step1, setStep1] = useState<Step1Data>(INITIAL_STEP1);
    const [step2, setStep2] = useState<Step2Data>(INITIAL_STEP2);
    const [errors, setErrors] = useState<FormErrors>({});

    // Hitung durasi dan total harga dari items yang dipilih
    const durasiHari = useMemo(
        () => hitungDurasiHari(step2.start_date, step2.end_date),
        [step2.start_date, step2.end_date]
    );

    // Total harga: jumlah dari (harga_satuan × qty) seluruh item yang dipilih
    const totalHarga = useMemo(
        () => step2.selected_items.reduce((acc, item) => acc + (item.price_per_unit * item.quantity), 0),
        [step2.selected_items]
    );

    const setS1 = <K extends keyof Step1Data>(key: K, val: Step1Data[K]) => {
        setStep1((p) => ({ ...p, [key]: val }));
        setErrors((p) => ({ ...p, [key]: undefined }));
    };

    const setS2 = <K extends keyof Step2Data>(key: K, val: Step2Data[K]) => {
        setStep2((p) => ({ ...p, [key]: val }));
        setErrors((p) => ({ ...p, [key]: undefined }));
    };

    const validateStep1 = (): boolean => {
        const errs: FormErrors = {};
        if (!step1.booker_name.trim()) errs.booker_name = 'Nama pemesan wajib diisi.';
        if (!step1.booker_institution.trim()) errs.booker_institution = 'Institusi wajib diisi.';
        if (!step1.booker_email.trim()) errs.booker_email = 'Email wajib diisi.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(step1.booker_email)) errs.booker_email = 'Format email tidak valid.';
        if (!step1.booker_phone.trim()) errs.booker_phone = 'Nomor telepon wajib diisi.';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const validateStep2 = (): boolean => {
        const errs: FormErrors = {};
        if (!step2.activity_name.trim()) errs.activity_name = 'Nama kegiatan wajib diisi.';
        if (!step2.selected_provider) errs.provider = 'Pilih penyedia layanan terlebih dahulu.';
        if (step2.selected_items.length === 0) errs.items = 'Pilih minimal satu layanan.';
        if (!step2.start_date) errs.start_date = 'Tanggal mulai wajib dipilih.';
        if (!step2.end_date) errs.end_date = 'Tanggal selesai wajib dipilih.';
        else if (step2.start_date && step2.end_date < step2.start_date) errs.end_date = 'Tanggal selesai tidak boleh sebelum tanggal mulai.';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleNext = () => {
        if (step === 1 && validateStep1()) setStep(2);
        else if (step === 2 && validateStep2()) setStep(3);
    };

    const handleClose = () => {
        setStep(1);
        setStep1(INITIAL_STEP1);
        setStep2(INITIAL_STEP2);
        setErrors({});
        onClose();
    };

    const handleSubmit = () => {
        const kodeBooking = generateBookingCode(step2.service_category);
        const sekarang = new Date().toISOString();

        // Konversi selected items ke format BookingItem yang sesuai tipe Booking
        const bookingItems: BookingItem[] = step2.selected_items.map((item) => ({
            id: crypto.randomUUID(),
            service_name: item.service_name,
            quantity: item.quantity,
            price: item.price_per_unit,
        }));

        // price_per_day: rata-rata per hari dari total, berguna untuk tampilan di tabel
        const pricePerDay = durasiHari > 0 ? Math.round(totalHarga / durasiHari) : totalHarga;

        const bookingBaru: Booking = {
            id: `manual-${crypto.randomUUID()}`,
            booking_code: kodeBooking,
            booker: {
                name: step1.booker_name.trim(),
                institution: step1.booker_institution.trim(),
                email: step1.booker_email.trim(),
                phone: step1.booker_phone.trim(),
            },
            activity_name: step2.activity_name.trim(),
            start_date: step2.start_date,
            end_date: step2.end_date,
            duration_days: durasiHari,
            price_per_day: pricePerDay,
            total_price: totalHarga,
            booking_status: 'MENUNGGU_VERIFIKASI_PESANAN' as BookingStatus,
            payment_status: 'BELUM_BAYAR' as PaymentStatus,
            user_type: step1.user_type,
            provider_name: step2.selected_provider?.name,
            service_name: step2.selected_items.length === 1 ? step2.selected_items[0].service_name : undefined,
            items: bookingItems,
            special_request: step2.special_request.trim() || undefined,
            payment_proofs: [],
            conflicting_bookings: [],
            internal_notes: [],
            created_at: sekarang,
            updated_at: sekarang,
        };

        onSubmit(bookingBaru);
        handleClose();
    };

    // JSX
    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Tambah Pesanan Manual" size="xl">
            <StepIndicator currentStep={step} />

            {/* ---- STEP 1: INFO PEMESAN ---- */}
            {step === 1 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                        <User size={18} className="text-navy flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-navy">Informasi Pemesan</p>
                            <p className="text-xs text-slate-400">Data peminjam yang mengajukan pesanan secara manual.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <FieldLabel htmlFor="booker_name" icon={User} label="Nama Lengkap" required />
                            <FormInput id="booker_name" placeholder="cth: Dr. Budi Santoso" value={step1.booker_name} onChange={(v) => setS1('booker_name', v)} error={errors.booker_name} />
                        </div>
                        <div>
                            <FieldLabel htmlFor="booker_institution" icon={Building2} label="Institusi / Instansi" required />
                            <FormInput id="booker_institution" placeholder="cth: FMIPA Unhas" value={step1.booker_institution} onChange={(v) => setS1('booker_institution', v)} error={errors.booker_institution} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <FieldLabel htmlFor="booker_email" icon={Mail} label="Alamat Email" required />
                            <FormInput id="booker_email" type="email" placeholder="cth: budi@unhas.ac.id" value={step1.booker_email} onChange={(v) => setS1('booker_email', v)} error={errors.booker_email} />
                        </div>
                        <div>
                            <FieldLabel htmlFor="booker_phone" icon={Phone} label="Nomor Telepon" required />
                            <FormInput id="booker_phone" type="tel" placeholder="cth: 081234567890" value={step1.booker_phone} onChange={(v) => setS1('booker_phone', v)} error={errors.booker_phone} />
                        </div>
                    </div>

                    <div>
                        <FieldLabel htmlFor="user_type" icon={Tag} label="Tipe Pemesan" required />
                        <div className="flex gap-3">
                            {([
                                { value: 'internal', label: 'Internal (Civitas Unhas)' },
                                { value: 'external', label: 'Eksternal (Luar Kampus)' },
                            ] as const).map((opt) => (
                                <button
                                    key={opt.value} type="button"
                                    onClick={() => setS1('user_type', opt.value)}
                                    className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-all ${
                                        step1.user_type === opt.value
                                            ? 'border-navy bg-navy/5 text-navy'
                                            : 'border-slate-border bg-white text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ---- STEP 2: DETAIL PESANAN ---- */}
            {step === 2 && (
                <div className="space-y-5">
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                        <ClipboardList size={18} className="text-navy flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-navy">Detail Pesanan</p>
                            <p className="text-xs text-slate-400">Pilih penyedia, layanan, dan jadwal.</p>
                        </div>
                    </div>

                    {/* Nama kegiatan */}
                    <div>
                        <FieldLabel htmlFor="activity_name" icon={FileText} label="Nama Kegiatan / Penelitian" required />
                        <FormInput id="activity_name" placeholder="cth: Ekspedisi Oseanografi Teluk Bone" value={step2.activity_name} onChange={(v) => setS2('activity_name', v)} error={errors.activity_name} />
                    </div>

                    {/* Kategori layanan */}
                    <div>
                        <FieldLabel htmlFor="service_category" icon={Tag} label="Kategori Layanan" required />
                        <div className="flex gap-2">
                            {([
                                { value: 'LAB', label: 'Laboratorium' },
                                { value: 'KAPAL', label: 'Kapal Riset' },
                                { value: 'SAS', label: 'Layanan Mandiri' },
                            ] as const).map((opt) => (
                                <button
                                    key={opt.value} type="button"
                                    onClick={() => {
                                        setS2('service_category', opt.value);
                                        // Reset penyedia dan item karena kategori berubah
                                        setS2('selected_provider', null);
                                        setS2('selected_items', []);
                                    }}
                                    className={`flex-1 rounded-lg border py-2 text-xs font-medium transition-all ${
                                        step2.service_category === opt.value
                                            ? 'border-navy bg-navy text-white'
                                            : 'border-slate-border bg-white text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Pilih penyedia (searchable dropdown) */}
                    <div>
                        <FieldLabel htmlFor="provider_search" icon={Building2} label="Penyedia Layanan" required />
                        <ProviderSearchDropdown
                            category={step2.service_category}
                            selected={step2.selected_provider}
                            onSelect={(p) => {
                                setS2('selected_provider', p);
                                // Reset items karena penyedia berubah
                                setS2('selected_items', []);
                                setErrors((prev) => ({ ...prev, provider: undefined, items: undefined }));
                            }}
                            error={errors.provider}
                        />
                    </div>

                    {/* Daftar layanan dari penyedia yang dipilih */}
                    {step2.selected_provider && (
                        <div>
                            <div className="flex items-center gap-1.5 mb-2">
                                <Package size={13} className="text-slate-400" />
                                <span className="text-xs font-semibold text-slate-600">
                                    Pilih Layanan
                                    <span className="text-red-400 ml-0.5">*</span>
                                </span>
                                {step2.selected_items.length > 0 && (
                                    <span className="ml-auto text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                        {step2.selected_items.length} dipilih
                                    </span>
                                )}
                            </div>
                            <ServiceItemSelector
                                provider={step2.selected_provider}
                                selectedItems={step2.selected_items}
                                onItemsChange={(items) => {
                                    setS2('selected_items', items);
                                    if (items.length > 0) setErrors((prev) => ({ ...prev, items: undefined }));
                                }}
                                error={errors.items}
                            />
                        </div>
                    )}

                    {/* Ringkasan harga item — tampil ketika ada item dipilih */}
                    {step2.selected_items.length > 0 && (
                        <div className="rounded-xl bg-navy/5 border border-navy/10 p-4 space-y-2">
                            {step2.selected_items.map((item) => (
                                <div key={item.service_id} className="flex justify-between items-center">
                                    <span className="text-xs text-slate-500 truncate max-w-[60%]">
                                        {item.service_name} × {item.quantity} {item.unit}
                                    </span>
                                    <span className="text-xs font-medium text-slate-700">
                                        {formatIDR(item.price_per_unit * item.quantity)}
                                    </span>
                                </div>
                            ))}
                            <div className="border-t border-navy/10 pt-2 flex justify-between items-center">
                                <span className="text-sm font-semibold text-navy">Total Tagihan</span>
                                <span className="text-sm font-bold text-navy">{formatIDR(totalHarga)}</span>
                            </div>
                        </div>
                    )}

                    {/* Tanggal */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <FieldLabel htmlFor="start_date" icon={Calendar} label="Tanggal Mulai" required />
                            <FormInput id="start_date" type="date" value={step2.start_date} onChange={(v) => setS2('start_date', v)} error={errors.start_date} />
                        </div>
                        <div>
                            <FieldLabel htmlFor="end_date" icon={Calendar} label="Tanggal Selesai" required />
                            <FormInput id="end_date" type="date" value={step2.end_date} onChange={(v) => setS2('end_date', v)} error={errors.end_date} />
                        </div>
                    </div>

                    {/* Catatan */}
                    <div>
                        <FieldLabel htmlFor="special_request" icon={FileText} label="Catatan Khusus (opsional)" />
                        <textarea
                            id="special_request" rows={2}
                            placeholder="Tuliskan kebutuhan khusus atau catatan tambahan..."
                            value={step2.special_request}
                            onChange={(e) => setS2('special_request', e.target.value)}
                            className="w-full rounded-lg border border-slate-border bg-white px-3 py-2.5 text-sm text-navy placeholder:text-slate-400 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy resize-none"
                        />
                    </div>
                </div>
            )}

            {/* ---- STEP 3: KONFIRMASI ---- */}
            {step === 3 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                        <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-emerald-800">Konfirmasi Data Pesanan</p>
                            <p className="text-xs text-emerald-600">Periksa kembali sebelum menyimpan.</p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-border divide-y divide-slate-border overflow-hidden text-sm">
                        {/* Pemesan */}
                        <ConfirmSection title="Pemesan">
                            <ConfirmRow label="Nama" value={step1.booker_name} />
                            <ConfirmRow label="Institusi" value={step1.booker_institution} />
                            <ConfirmRow label="Email" value={step1.booker_email} />
                            <ConfirmRow label="Telepon" value={step1.booker_phone} />
                            <ConfirmRow label="Tipe" value={step1.user_type === 'internal' ? 'Internal' : 'Eksternal'} />
                        </ConfirmSection>

                        {/* Pesanan */}
                        <ConfirmSection title="Detail Pesanan">
                            <ConfirmRow label="Kegiatan" value={step2.activity_name} />
                            <ConfirmRow label="Penyedia" value={step2.selected_provider?.name ?? '-'} />
                            <ConfirmRow
                                label="Tanggal"
                                value={`${step2.start_date} s.d. ${step2.end_date} (${durasiHari} hari)`}
                            />
                        </ConfirmSection>

                        {/* Layanan & harga */}
                        <ConfirmSection title="Layanan yang Dipesan">
                            {step2.selected_items.map((item) => (
                                <div key={item.service_id} className="flex items-center justify-between px-4 py-2">
                                    <div>
                                        <p className="text-xs font-medium text-slate-700">{item.service_name}</p>
                                        <p className="text-[11px] text-slate-400">{item.quantity} {item.unit} × {formatIDR(item.price_per_unit)}</p>
                                    </div>
                                    <span className="text-xs font-semibold text-navy">
                                        {formatIDR(item.price_per_unit * item.quantity)}
                                    </span>
                                </div>
                            ))}
                            <div className="flex justify-between items-center px-4 py-3 bg-navy/5 border-t border-slate-border">
                                <span className="text-sm font-bold text-navy">Total Tagihan</span>
                                <span className="text-sm font-bold text-navy">{formatIDR(totalHarga)}</span>
                            </div>
                        </ConfirmSection>
                    </div>

                    <p className="text-[11px] text-slate-400 text-center">
                        Pesanan akan dibuat dengan status{' '}
                        <strong className="text-amber-600">Menunggu Verifikasi Pesanan</strong>.
                    </p>
                </div>
            )}

            {/* ---- NAVIGASI ---- */}
            <div className="mt-6 flex gap-3">
                {step > 1 && (
                    <Button variant="ghost" onClick={() => setStep(s => s - 1)} disabled={isLoading} className="flex-1">
                        <ChevronLeft size={16} /> Kembali
                    </Button>
                )}
                {step < 3 ? (
                    <Button variant="primary" onClick={handleNext} className="flex-1">
                        Lanjut <ChevronRight size={16} />
                    </Button>
                ) : (
                    <Button
                        variant="primary" onClick={handleSubmit} disabled={isLoading}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    >
                        {isLoading ? (
                            <><Loader2 size={16} className="animate-spin" /> Menyimpan...</>
                        ) : (
                            <><CheckCircle2 size={16} /> Simpan Pesanan</>
                        )}
                    </Button>
                )}
            </div>
        </Modal>
    );
}

// ============================================================
// HELPER: Komponen ringkasan konfirmasi
// ============================================================

function ConfirmSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <div className="px-4 py-2 bg-slate-50">
                <p className="text-[11px] font-semibold text-slate-500 uppercase">{title}</p>
            </div>
            <div className="divide-y divide-slate-50">{children}</div>
        </div>
    );
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between px-4 py-2.5">
            <span className="text-xs text-slate-400 flex-shrink-0 w-24">{label}</span>
            <span className="text-xs font-medium text-slate-700 text-right">{value}</span>
        </div>
    );
}
