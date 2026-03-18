import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export interface StatCardProps {
    label: string;
    value: string;
    icon: LucideIcon;
    change?: string;
    trend?: "up" | "down" | "neutral";
    description?: string;
}

export function StatCard({
    label,
    value,
    icon: Icon,
    change,
    trend = "neutral",
    description,
}: StatCardProps) {
    const isUp = trend === "up";
    const isDown = trend === "down";

    return (
        <div
            className="
                group relative overflow-hidden rounded-xl
                border border-slate-border bg-white p-6
                transition-all duration-200
                hover:border-label-muted hover:shadow-sm
            "
        >
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-muted">
                        {label}
                    </p>
                    <p className="text-2xl font-bold text-navy">{value}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-soft-white">
                    <Icon size={20} className="text-slate-muted" />
                </div>
            </div>

            {(change || description) && (
                <div className="mt-3 flex items-center gap-1.5">
                    {isUp && (
                        <ArrowUpRight size={14} className="text-emerald-500" />
                    )}
                    {isDown && (
                        <ArrowDownRight size={14} className="text-red-500" />
                    )}
                    {change && (
                        <span
                            className={`text-xs font-semibold ${
                                isUp
                                    ? "text-emerald-600"
                                    : isDown
                                    ? "text-red-500"
                                    : "text-slate-muted"
                            }`}
                        >
                            {change}
                        </span>
                    )}
                    {description && (
                        <span className="text-xs text-slate-muted">
                            {description}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
