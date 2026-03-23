import { useState } from 'react';
import { ShieldCheck, Loader2, Calendar } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface ApproveBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (deadline: string) => void;
    isLoading: boolean;
    bookingCode: string;
    bookerEmail: string;
}

/**
 * APPROVE BOOKING MODAL
 * Digunakan untuk menyetujui pesanan dan menentukan batas waktu pembayaran.
 * Komponen shared yang bisa digunakan oleh role manager maupun admin.
 */
export function ApproveBookingModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    bookingCode,
    bookerEmail,
}: ApproveBookingModalProps) {
    const [deadline, setDeadline] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!deadline) {
            setError('Wajib menentukan batas waktu pembayaran.');
            return;
        }
        onConfirm(deadline);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col items-center text-center space-y-6 pt-2">
                {/* Icon Section */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <ShieldCheck size={32} />
                </div>

                {/* Header Section */}
                <div className="space-y-2">
                    <h3 className="font-bold text-navy text-xl">Setujui Pesanan?</h3>
                    <p className="text-sm text-slate-600 leading-relaxed max-w-sm px-2">
                        Pesanan <span className="font-bold text-navy">{bookingCode}</span> akan disetujui. 
                        Email instruksi pembayaran akan dikirimkan secara otomatis ke <span className="font-medium text-navy">{bookerEmail}</span>.
                    </p>
                </div>

                {/* Deadline Selector Section */}
                <div className="w-full space-y-4 rounded-2xl bg-slate-50 p-6 border border-slate-border">
                    <div className="space-y-2 text-left">
                        <label className="flex items-center gap-2 text-xs font-bold text-navy uppercase tracking-wider">
                            <Calendar size={14} className="text-grey" />
                            Tentukan Batas Waktu Pembayaran
                        </label>
                        <input
                            type="datetime-local"
                            id="payment-deadline"
                            value={deadline}
                            onChange={(e) => {
                                setDeadline(e.target.value);
                                setError('');
                            }}
                            className={`
                                w-full rounded-xl border px-4 py-3 text-sm font-semibold text-navy transition-all
                                focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy
                                ${error ? 'border-red-300 bg-red-50' : 'border-slate-border bg-white'}
                            `}
                        />
                        {error && (
                            <p className="text-xs text-red-500 font-medium ml-1">
                                {error}
                            </p>
                        )}
                    </div>
                    <p className="text-[11px] text-grey leading-relaxed italic text-center px-4">
                        Peminjam akan menerima email notifikasi berisi instruksi pembayaran dan batas waktu yang Anda tentukan di atas.
                    </p>
                </div>

                {/* Action Buttons Section */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Button variant="ghost" onClick={onClose} disabled={isLoading} className="flex-1 order-2 sm:order-1">
                        Batal
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex-1 order-1 sm:order-2 bg-emerald-600 hover:bg-emerald-700 font-bold"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin mr-2" />
                                Memproses...
                            </>
                        ) : (
                            'Ya, Setujui Pesanan'
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
