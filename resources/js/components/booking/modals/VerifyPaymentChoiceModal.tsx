import { CheckCircle2, Clock, Paperclip, Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { formatIDR } from '../utils';

interface VerifyPaymentChoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (isLunas: boolean) => void;
    totalPaid: number;
    totalPrice: number;
    isLoading: boolean;
}

/**
 * VERIFY PAYMENT CHOICE MODAL
 * Digunakan untuk memilih apakah pembayaran yang diverifikasi sudah LUNAS atau BELUM LUNAS.
 * Komponen shared yang bisa digunakan oleh role manager maupun admin.
 */
export function VerifyPaymentChoiceModal({
    isOpen,
    onClose,
    onConfirm,
    totalPaid,
    totalPrice,
    isLoading,
}: VerifyPaymentChoiceModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col items-center text-center space-y-6 pt-2">
                {/* Icon Section */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 border border-slate-100 text-navy">
                    <Paperclip size={32} />
                </div>

                {/* Header Section */}
                <div className="space-y-2">
                    <h3 className="font-semibold text-navy text-lg leading-tight">Verifikasi Pembayaran</h3>
                    <div className="text-[14px] text-slate-600 leading-relaxed max-w-sm px-2">
                        Pilih status verifikasi untuk total dana terhitung sebesar:
                        <div className="mt-1 font-bold text-navy text-[14px] block">
                            {formatIDR(totalPaid)} 
                            <span className="text-[14px] font-medium text-grey ml-1">dari {formatIDR(totalPrice)}</span>
                        </div>
                    </div>
                </div>

                {/* Option Buttons Section */}
                <div className="grid grid-cols-1 gap-3 w-full pt-2">
                    {/* Opsi Lunas */}
                    <button 
                        onClick={() => onConfirm(true)} 
                        disabled={isLoading}
                        className="group relative flex flex-col items-start gap-1.5 rounded-xl border border-slate-border bg-white p-5 text-left hover:bg-slate-50 hover:border-slate-300 transition-all focus:outline-none"
                    >
                        <span className="flex items-center gap-2 font-semibold text-navy">
                            <CheckCircle2 size={18} className="text-emerald-500" /> Pembayaran Telah Lunas
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium leading-relaxed">
                            Tandai pembayaran selesai sepenuhnya. User tidak akan bisa mengunggah bukti lagi.
                        </span>
                    </button>

                    {/* Opsi Cicilan / Belum Lunas */}
                    <button 
                        onClick={() => onConfirm(false)} 
                        disabled={isLoading}
                        className="group relative flex flex-col items-start gap-1.5 rounded-2xl border border-slate-border bg-white p-5 text-left hover:bg-slate-50 hover:border-slate-300 transition-all focus:outline-none"
                    >
                        <span className="flex items-center gap-2 font-semibold text-navy">
                            <Clock size={18} className="text-amber-500" /> Pembayaran Belum Lunas
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium leading-relaxed">
                            Setujui bukti ini namun status tetap Belum Lunas. User masih bisa mengunggah bukti berikutnya.
                        </span>
                    </button>

                    {/* Button Batal */}
                    <Button variant="ghost" onClick={onClose} disabled={isLoading} className="mt-2 h-12">
                        Batal
                    </Button>
                </div>

                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-2xl backdrop-blur-sm z-20">
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 size={32} className="animate-spin text-navy" />
                            <p className="text-sm font-bold text-navy">Memproses...</p>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}
