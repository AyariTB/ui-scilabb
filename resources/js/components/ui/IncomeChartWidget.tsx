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
} from "recharts";

export interface IncomeData {
    name: string;
    pendapatan: number;
    pesanan: number;
}

interface IncomeChartWidgetProps {
    title: string;
    subtitle: string;
    data: IncomeData[];
    dateRange: { start: string; end: string };
    onDateChange: (start: string, end: string) => void;
    onExportCSV: () => void;
    onExportPDF: () => void;
}

export function IncomeChartWidget({
    title,
    subtitle,
    data,
    dateRange,
    onDateChange,
    onExportCSV,
    onExportPDF,
}: IncomeChartWidgetProps) {
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const dataItem = payload[0].payload;
            return (
                <div className="rounded-lg border border-slate-border bg-white p-3 shadow-sm" style={{ boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }}>
                    <p className="mb-2 text-sm font-bold text-navy">{label}</p>
                    <div className="flex flex-col gap-1 text-xs">
                        <div className="flex justify-between gap-4">
                            <span className="text-slate-muted">Pendapatan:</span>
                            <span className="font-semibold text-navy">
                                Rp {Number(dataItem.pendapatan).toLocaleString("id-ID")}
                            </span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-slate-muted">Jumlah Pesanan:</span>
                            <span className="font-semibold text-navy">
                                {dataItem.pesanan}
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
                    <BarChart data={data}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke={COLORS.chart.grid}
                        />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: COLORS.chart.text }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: COLORS.chart.text }}
                            tickFormatter={(value) => `Rp ${value / 1000000}Jt`}
                            dx={-10}
                        />
                        <RechartsTooltip
                            cursor={{ fill: COLORS.chart.tooltipBg }}
                            content={<CustomTooltip />}
                        />
                        <Bar
                            dataKey="pendapatan"
                            name="Pendapatan"
                            fill={COLORS.chart.primary}
                            radius={[4, 4, 0, 0]}
                            maxBarSize={48}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
