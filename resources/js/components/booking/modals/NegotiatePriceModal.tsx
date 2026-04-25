import { useState } from 'react';
import { Loader2, CreditCard } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface NegotiatePriceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (newPrice: number, note: string) => void;
    currentPrice: number;
    isLoading: boolean;
}

/**
 * NEGOTIATE PRICE MODAL
 * Digunakan untuk melakukan perubahan harga atau negosiasi total tagihan.
 * Komponen shared yang bisa digunakan oleh role manager maupun admin.
 */
export function NegotiatePriceModal({
    isOpen,
    onClose,
    onConfirm,
    currentPrice,
    isLoading,
}: NegotiatePriceModalProps) {
    const [price, setPrice] = useState(currentPrice);
    const [note, setNote] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        const trimmedNote = note.trim();
        if (!trimmedNote) {
            setError('Catatan negosiasi wajib diisi.');
            return;
        }
        if (price <= 0) {
            setError('Harga harus lebih dari 0.');
            return;
        }
        onConfirm(price, trimmedNote);
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Negosiasi / Ubah Harga"
            size="md"
        >
            <div className="space-y-6 pt-2">
                <div className="flex items-start gap-4 rounded-lg bg-slate-50 p-4 border border-slate-border">
                    <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                        <CreditCard size={18} />
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-navy leading-tight">Detail Perubahan</p>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                            Ubah total tagihan sesuai kesepakatan negosiasi. Catatan ini akan disimpan secara internal dan tidak dikirimkan ke peminjam.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5">
                    {/* Input Field: Harga Baru */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-navy flex items-center gap-1.5 ml-1">
                            Harga Baru (Total Tagihan)
                        </label>
                        <div className="relative group/input">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-grey font-medium group-focus-within/input:text-navy transition-colors">
                                Rp
                            </span>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => {
                                    setPrice(Number(e.target.value));
                                }}
                                className="w-full rounded-lg border border-slate-border pl-12 pr-6 py-3 text-base font-semibold text-navy focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy transition-all placeholder:text-slate-300"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Input Field: Alasan/Catatan */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-navy ml-1">
                            Catatan / Alasan Perubahan <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={3}
                            value={note}
                            onChange={(e) => { 
                                setNote(e.target.value); 
                                setError(''); 
                            }}
                            placeholder="Contoh: Diskon khusus instansi, penyesuaian durasi, kesepakatan manager..."
                            className={`
                                w-full rounded-lg border px-4 py-3 text-sm text-navy transition-all 
                                focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy resize-none
                                ${error ? 'border-red-300 bg-red-50' : 'border-slate-border bg-white'}
                            `}
                        />
                        {error && (
                            <p className="text-[11px] text-red-500 font-semibold ml-1">
                                {error}
                            </p>
                        )}
                    </div>
                </div>

                {/* Confirm Action Button */}
                <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                    <Button 
                        variant="ghost" 
                        onClick={onClose} 
                        disabled={isLoading} 
                        className="flex-1 order-2 sm:order-1 py-2.5 text-sm font-medium"
                    >
                        Batal
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleSubmit} 
                        disabled={isLoading} 
                        className="flex-1 order-1 sm:order-2 bg-navy px-8 py-2.5 rounded-lg font-semibold transition-all hover:bg-navy/90"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin mr-2" />
                                Menyimpan...
                            </>
                        ) : (
                            'Ya, Simpan Perubahan'
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
