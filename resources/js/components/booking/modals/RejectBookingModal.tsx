import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface RejectBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    isLoading: boolean;
    title: string;
    description: string;
}

/**
 * REJECT BOOKING MODAL
 * Digunakan untuk menolak pesanan atau menolak bukti pembayaran dengan alasan.
 * Komponen shared yang bisa digunakan oleh role manager maupun admin.
 */
export function RejectBookingModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    title,
    description,
}: RejectBookingModalProps) {
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        const trimmedReason = reason.trim();
        if (!trimmedReason) {
            setError('Alasan penolakan wajib diisi.');
            return;
        }
        if (trimmedReason.length < 10) {
            setError('Alasan minimal 10 karakter.');
            return;
        }
        onConfirm(trimmedReason);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-5">
                <p className="text-sm text-slate-600 leading-relaxed">
                    {description}
                </p>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-800">
                        Alasan Penolakan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        rows={4}
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value);
                            setError('');
                        }}
                        placeholder="Tuliskan alasan penolakan yang jelas untuk dikirimkan ke peminjam..."
                        className={`
                            w-full rounded-xl border px-4 py-3 text-sm text-slate-800 transition-all
                            focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy resize-none
                            ${error ? 'border-red-300 bg-red-50' : 'border-slate-border bg-white'}
                        `}
                    />
                    {error && (
                        <p className="text-xs text-red-500 font-medium">
                            {error}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                    <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                        Batal
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="min-w-[140px]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin mr-2" />
                                Mengirim...
                            </>
                        ) : (
                            'Kirim Penolakan'
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
