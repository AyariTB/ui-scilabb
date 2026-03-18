import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const badgeVariants = cva(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors",
    {
        variants: {
            variant: {
                default: "bg-soft-white text-navy font-medium border border-slate-border",
                success: "bg-emerald-50 text-emerald-700",
                warning: "bg-amber-50 text-amber-700",
                danger: "bg-red-50 text-red-700",
                info: "bg-blue-50 text-blue-700",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
        VariantProps<typeof badgeVariants> {
    children: ReactNode;
}

export function Badge({ children, variant, className, ...props }: BadgeProps) {
    return (
        <span className={twMerge(badgeVariants({ variant }), className)} {...props}>
            {children}
        </span>
    );
}
