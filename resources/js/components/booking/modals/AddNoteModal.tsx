import { useState, useEffect } from 'react';
import { StickyNote, Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface AddNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (note: string) => void;
    isLoading: boolean;
    initialContent?: string;
    title?: string;
}

/**
 * ADD/EDIT NOTE MODAL
 * Digunakan untuk menambahkan atau mengubah catatan internal oleh manager/admin.
 * Komponen shared yang bisa digunakan oleh role manager maupun admin.
 */
export function AddNoteModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    initialContent = '',
    title = 'Tambah Catatan Internal',
}: AddNoteModalProps) {
    const [note, setNote] = useState(initialContent);
    const [error, setError] = useState('');

    // Update state saat modal dibuka atau initialContent berubah
    useEffect(() => {
        if (isOpen) {
            setNote(initialContent);
            setError('');
        }
    }, [isOpen, initialContent]);

    const handleSubmit = () => {
        const trimmedNote = note.trim();
        if (!trimmedNote) {
            setError('Catatan tidak boleh kosong.');
            return;
        }
        onConfirm(trimmedNote);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-6">
                {/* Header/Description Section */}
                <div className="flex items-start gap-4 rounded-lg bg-slate-50 p-4 border border-slate-border">
                    <div className="p-2 rounded-full bg-navy/5 text-navy">
                        <StickyNote size={18} />
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-navy leading-tight">Privasi Catatan</p>
                        <p className="text-[12px] text-slate-500 leading-relaxed max-w-sm">
                            Catatan ini <span className="font-semibold text-navy underline decoration-navy/20">hanya terlihat</span> oleh admin dan manager.
                        </p>
                    </div>
                </div>

                {/* Content Section */}
                <div className="space-y-2">
                    <textarea 
                        rows={5} 
                        value={note} 
                        onChange={(e) => { 
                            setNote(e.target.value); 
                            setError(''); 
                        }}
                        id="internal-note-content"
                        placeholder="Tulis catatan internal yang relevan untuk pesanan ini..." 
                        className={`
                            w-full rounded-lg border px-4 py-3 text-sm text-navy placeholder:text-slate-400 transition-all 
                            focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy resize-none
                            ${error ? 'border-red-300 bg-red-50' : 'border-slate-border bg-white'}
                        `} 
                    />
                    {error && (
                        <p className="text-[12px] text-red-500 font-bold ml-1">
                            {error}
                        </p>
                    )}
                </div>

                {/* Action Buttons Section */}
                <div className="flex flex-col sm:flex-row justify-end gap-2.5 w-full pt-2">
                    <Button 
                        variant="ghost" 
                        onClick={onClose} 
                        disabled={isLoading} 
                        className="flex-1 sm:flex-initial px-6 py-2.5 text-sm font-medium"
                    >
                        Batal
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleSubmit} 
                        disabled={isLoading} 
                        className="flex-1 sm:flex-initial bg-navy px-8 py-2.5 rounded-lg font-semibold transition-all hover:bg-navy/90"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin mr-2" />
                                Menyimpan...
                            </>
                        ) : (
                            'Simpan Catatan'
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
