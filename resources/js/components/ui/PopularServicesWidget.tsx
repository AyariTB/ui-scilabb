import { COLORS } from "@/constants/colors";
import { ExportActions } from "@/components/ui/ExportActions";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

export interface PopularServiceData {
    name: string;
    total: number;
    diterima: number;
    ditolak: number;
    penyedia: string;
}

interface PopularServicesWidgetProps {
    title: string;
    subtitle: string;
    data: PopularServiceData[];
    dateRange: { start: string; end: string };
    onDateChange: (start: string, end: string) => void;
    onExportCSV: () => void;
    onExportPDF: () => void;
}

export function PopularServicesWidget({
    title,
    subtitle,
    data,
    dateRange,
    onDateChange,
    onExportCSV,
    onExportPDF,
}: PopularServicesWidgetProps) {
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const dataItem = payload[0].payload;
            return (
                <div
                    className="rounded-lg border border-slate-border bg-white p-3 shadow-sm"
                    style={{ boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }}
                >
                    <p className="mb-2 text-sm font-bold text-navy">{label}</p>
                    <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center justify-between gap-4 mb-1">
                            <span className="text-slate-muted">Penyedia:</span>
                            <span className="font-semibold text-navy">
                                {dataItem.penyedia}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-muted">Total Dipesan:</span>
                            <span className="font-semibold text-navy">
                                {dataItem.total}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 text-slate-muted">
                                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                Diterima:
                            </span>
                            <span className="font-semibold text-emerald-600">
                                {dataItem.diterima}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-1.5 text-slate-muted">
                                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                Ditolak:
                            </span>
                            <span className="font-semibold text-red-600">
                                {dataItem.ditolak}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex flex-col rounded-xl border border-slate-border bg-white">
            <div className="flex items-center justify-between border-b border-slate-border px-6 py-4">
                <div>
                    <h2 className="text-sm font-bold text-navy">{title}</h2>
                    <p className="text-xs text-slate-muted">{subtitle}</p>
                </div>
                <ExportActions
                    startDate={dateRange.start}
                    endDate={dateRange.end}
                    onDateChange={onDateChange}
                    onExportCSV={onExportCSV}
                    onExportPDF={onExportPDF}
                />
            </div>
            <div className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={true}
                            vertical={false}
                            stroke={COLORS.chart.grid}
                        />
                        <XAxis 
                            type="number"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: COLORS.chart.text }}
                            dx={0} 
                        />
                        <YAxis 
                            type="category" 
                            dataKey="name" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: COLORS.chart.text }}
                            width={100}
                        />
                        <RechartsTooltip
                            cursor={{ fill: COLORS.chart.tooltipBg }}
                            content={<CustomTooltip />}
                        />
                        <Bar
                            dataKey="total"
                            radius={[0, 4, 4, 0]}
                            maxBarSize={32}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS.chart.primary} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
