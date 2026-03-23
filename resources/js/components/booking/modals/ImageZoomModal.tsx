import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ImageZoomModalProps {
    imageUrl: string;
    isOpen: boolean;
    onClose: () => void;
}

/**
 * IMAGE ZOOM MODAL
 * Modal fullscreen untuk memperbesar gambar (bukti pembayaran, dokumen, dll).
 * Komponen shared yang bisa digunakan oleh role manager maupun admin.
 */
export function ImageZoomModal({ imageUrl, isOpen, onClose }: ImageZoomModalProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-12 animate-in fade-in duration-300">
            {/* Dark Backdrop */}
            <div
                className="fixed inset-0 bg-black/80 cursor-zoom-out" 
                onClick={onClose}
            />
            <div className="relative z-10 max-w-fit max-h-fit flex flex-col items-center animate-in zoom-in-95 duration-300">
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute -top-10 -right-12 z-20 p-2 text-white/70 hover:text-white transition-colors bg-black/30 rounded-full hover:bg-black/50 active:scale-95 shadow-xl"
                    title="Close"
                >
                    <X size={24} />
                </button>
                
                {/* Gambar */}
                <img 
                    src={imageUrl} 
                    alt="Bukti pembayaran diperbesar" 
                    className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl select-none" 
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    );
}
