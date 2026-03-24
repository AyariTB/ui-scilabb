import { COLORS } from "@/constants/colors";
import { ExportActions } from "@/components/ui/ExportActions";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
} from "recharts";

export interface TrendData {
    name: string;
    pesanan: number;
}

interface TrendChartWidgetProps {
    title: string;
    subtitle: string;
    data: TrendData[];
    dateRange: { start: string; end: string };
    onDateChange: (start: string, end: string) => void;
    onExportCSV: () => void;
    onExportPDF: () => void;
}

export function TrendChartWidget({
    title,
    subtitle,
    data,
    dateRange,
    onDateChange,
    onExportCSV,
    onExportPDF,
}: TrendChartWidgetProps) {
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
                    <LineChart data={data}>
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
                            dx={-10}
                        />
                        <RechartsTooltip
                            contentStyle={{
                                borderRadius: "8px",
                                border: `1px solid ${COLORS.chart.grid}`,
                                boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                            }}
                            formatter={(value: any) => [
                                `${value} Pesanan`,
                                "Jumlah Pesanan",
                            ]}
                        />
                        <Line
                            type="monotone"
                            dataKey="pesanan"
                            name="Jumlah Pesanan"
                            stroke={COLORS.chart.primary}
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: COLORS.chart.primary }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
