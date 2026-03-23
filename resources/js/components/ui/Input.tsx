import { useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export function Input({
    label,
    error,
    helperText,
    className = '',
    id,
    type,
    ...props
}: InputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
    
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
        <div className="space-y-1.5 w-full">
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    id={inputId}
                    type={inputType}
                    className={`
                        w-full px-4 py-2 bg-white border rounded-lg text-sm outline-none transition-all
                        ${error 
                            ? 'border-red-500 focus:ring-1 focus:ring-red-500 text-red-900 placeholder-red-300' 
                            : 'border-slate-border focus:border-navy focus:ring-1 focus:ring-navy text-navy'
                        }
                        ${isPassword ? 'pr-11' : ''}
                        ${className}
                    `}
                    {...props}
                />
                
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-navy transition-colors"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                        ) : (
                            <Eye className="w-4 h-4" />
                        )}
                    </button>
                )}
            </div>
            {error ? (
                <p className="text-xs text-red-500 font-medium">{error}</p>
            ) : helperText ? (
                <p className="text-xs text-slate-muted">{helperText}</p>
            ) : null}
        </div>
    );
}
