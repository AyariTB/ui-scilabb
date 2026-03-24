import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

export function Skeleton({ className, shimmer = true, ...props }: SkeletonProps & { shimmer?: boolean }) {
    return (
        <div
            className={cn(
                "rounded-md bg-slate-100 overflow-hidden relative",
                shimmer ? "after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_2s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/50 after:to-transparent" : "animate-pulse",
                className
            )}
            {...props}
        />
    );
}

export function CardSkeleton() {
    return (
        <div className="rounded-xl border border-slate-border/50 bg-white p-6 space-y-4">
            <Skeleton className="h-5 w-1/3" />
            <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
            </div>
        </div>
    );
}

export function TableRowSkeleton() {
    return (
        <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-border/50 last:border-0">
            <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-4 w-20 hidden md:block" />
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
    );
}

export function StatCardSkeleton() {
    return (
        <div className="rounded-xl border border-slate-border bg-white p-6 space-y-4">
            <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-8 w-32" />
                </div>
                <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-24" />
        </div>
    );
}
