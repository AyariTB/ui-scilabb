import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react'; 

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
    loading?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Ya, Lanjutkan',
    cancelLabel = 'Batal',
    variant = 'warning',
    loading = false
}: ConfirmModalProps) {
    const variantClasses = {
        danger: 'text-red-600 bg-red-50',
        warning: 'text-amber-600 bg-amber-50',
        info: 'text-blue-600 bg-blue-50',
    };

    const Icon = variant === 'info' ? Info : variant === 'danger' ? AlertCircle : AlertTriangle;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="flex flex-col items-center text-center space-y-6 py-2">
                {/* Icon Container - Tengah Atas */}
                <div className={`p-4 rounded-full ${variantClasses[variant]}`}>
                    <Icon className="w-8 h-8" />
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                    <p className="text-slate-600 leading-relaxed max-w-sm">
                        {message}
                    </p>
                </div>

                {/* Actions - Tengah */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full pt-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        disabled={loading}
                        className="w-full sm:w-auto min-w-[120px] p-4 bg-red-500"
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        type="button"
                        variant={variant === 'danger' ? 'danger' : 'primary'}
                        onClick={onConfirm}
                        disabled={loading}
                        className="w-full sm:w-auto min-w-[120px] p-4"
                    >
                        {loading ? 'Memproses...' : confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}