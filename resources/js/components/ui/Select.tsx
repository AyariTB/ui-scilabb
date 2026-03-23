import type { SelectHTMLAttributes } from 'react';

interface SelectOption {
    label: string;
    value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: (SelectOption | string)[];
    error?: string;
}

export function Select({
    label,
    options,
    error,
    className = '',
    id,
    children,
    ...props
}: SelectProps) {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
        <div className="space-y-1.5">
            {label && (
                <label htmlFor={selectId} className="block text-sm font-medium text-slate-700">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    id={selectId}
                    className={`
                        w-full px-4 py-2 bg-white border rounded-lg text-sm outline-none transition-all appearance-none cursor-pointer
                        ${error 
                            ? 'border-red-500 focus:ring-1 focus:ring-red-500 text-red-900' 
                            : 'border-slate-border focus:border-navy focus:ring-1 focus:ring-navy text-navy'
                        }
                        ${className}
                    `}
                    {...props}
                >
                    {options.map((option, index) => {
                        const value = typeof option === 'string' ? option : option.value;
                        const label = typeof option === 'string' ? option : option.label;
                        return (
                            <option key={index} value={value}>
                                {label}
                            </option>
                        );
                    })}
                    {children}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 8l4 4 4-4" />
                    </svg>
                </div>
            </div>
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </div>
    );
}
