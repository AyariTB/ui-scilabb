import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
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

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        full: 'max-w-[95vw] h-[95vh]',
    };

    const hasHeader = Boolean(title);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/40 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className={`
                relative bg-white rounded-2xl shadow-xl w-full ${sizeClasses[size]}
                flex flex-col max-h-[90vh] overflow-hidden
                animate-in zoom-in-95 duration-200 ease-out
            `}>
                {/* Header - hanya tampil jika ada title */}
                {hasHeader && (
                    <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 flex-shrink-0">
                        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Close button tanpa header */}
                {!hasHeader && (
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 z-10 p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}

                {/* Body */}
                <div className="p-5 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
}