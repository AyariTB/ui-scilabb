import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
    variant = 'primary', 
    size = 'md', 
    className = '', 
    children, 
    ...props 
}: ButtonProps) {
    const variants = {
        primary: 'bg-navy hover:bg-navy-light text-white shadow-sm',
        secondary: 'bg-white border border-slate-border text-slate-700 hover:bg-slate-50',
        danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
        ghost: 'bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium hover:text-navy transition-colors',
    };

    const sizes = {
        sm: 'px-3 py-2 text-xs',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all focus:ring-2 focus:ring-offset-2 focus:ring-navy disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
