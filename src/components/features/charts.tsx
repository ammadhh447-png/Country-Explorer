"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";
import type { WorldBankDataPoint } from "@/types/country";
import { formatNumber, formatCurrency } from "@/lib/format";
import {
  CHART_CATEGORICAL,
  CHART_GDP,
  CHART_LIFE,
  CHART_POPULATION,
  CHART_PRIMARY,
  getChartColor,
  getContinentChartColor,
} from "@/lib/chart-colors";

function useChartTheme() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  return useMemo(
    () => ({
      isDark,
      grid: isDark ? "rgba(148,163,184,0.12)" : "rgba(100,116,139,0.18)",
      tick: isDark ? "#94a3b8" : "#475569",
      tooltip: {
        background: isDark ? "rgba(15,23,42,0.96)" : "rgba(255,255,255,0.98)",
        border: isDark ? "1px solid rgba(148,163,184,0.2)" : "1px solid rgba(226,232,240,0.95)",
        borderRadius: "12px",
        color: isDark ? "#f1f5f9" : "#0f172a",
        boxShadow: isDark ? "0 12px 32px rgba(0,0,0,0.35)" : "0 8px 24px rgba(15,23,42,0.08)",
      },
      legend: isDark ? "#cbd5e1" : "#475569",
    }),
    [isDark]
  );
}

interface TrendChartProps {
  data: WorldBankDataPoint[];
  title: string;
  color?: string;
  formatValue?: (v: number) => string;
}

export function TrendChart({ data, title, color = CHART_PRIMARY, formatValue }: TrendChartProps) {
  const theme = useChartTheme();

  if (!data.length) {
    return (
      <Card>
        <h3 className="font-semibold mb-4">{title}</h3>
        <p className="text-sm text-muted-foreground text-center py-12">No data available</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke={theme.grid} vertical={false} />
          <XAxis dataKey="date" tick={{ fill: theme.tick, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: theme.tick, fontSize: 11 }}
            tickFormatter={(v) => formatNumber(v, true)}
            axisLine={false}
            tickLine={false}
            width={48}
          />
          <Tooltip
            contentStyle={theme.tooltip}
            itemStyle={{ color: theme.tooltip.color }}
            formatter={(value) => [
              formatValue ? formatValue(Number(value)) : formatNumber(Number(value)),
              title,
            ]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: color, stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

interface CompareLineChartProps {
  datasets: { name: string; data: WorldBankDataPoint[]; color: string }[];
  title: string;
  formatValue?: (value: number) => string;
}

export function CompareLineChart({ datasets, title, formatValue }: CompareLineChartProps) {
  const theme = useChartTheme();
  const years = new Set<string>();
  datasets.forEach((d) => d.data.forEach((p) => years.add(p.date)));
  const merged = Array.from(years)
    .sort()
    .map((year) => {
      const point: Record<string, string | number> = { date: year };
      datasets.forEach((d) => {
        const found = d.data.find((p) => p.date === year);
        if (found) point[d.name] = found.value;
      });
      return point;
    });

  return (
    <Card>
      <h3 className="font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={merged} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke={theme.grid} vertical={false} />
          <XAxis dataKey="date" tick={{ fill: theme.tick, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: theme.tick, fontSize: 11 }}
            tickFormatter={(v) => (formatValue ? formatValue(Number(v)) : formatNumber(v, true))}
            axisLine={false}
            tickLine={false}
            width={56}
          />
          <Tooltip
            contentStyle={theme.tooltip}
            itemStyle={{ color: theme.tooltip.color }}
            formatter={(value) => [
              formatValue ? formatValue(Number(value)) : formatNumber(Number(value)),
              "",
            ]}
          />
          <Legend wrapperStyle={{ color: theme.legend, fontSize: 12, paddingTop: 12 }} />
          {datasets.map((d) => (
            <Line key={d.name} type="monotone" dataKey={d.name} stroke={d.color} strokeWidth={2.5} dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

interface BarChartCardProps {
  data: { name: string; value: number }[];
  title: string;
  formatValue?: (v: number) => string;
}

export function BarChartCard({ data, title, formatValue }: BarChartCardProps) {
  const theme = useChartTheme();

  return (
    <Card>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground mb-4">Top 10 ranking from live dataset</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, left: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="4 4" stroke={theme.grid} horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: theme.tick, fontSize: 11 }}
            tickFormatter={(v) => formatNumber(v, true)}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: theme.tick, fontSize: 11 }}
            width={108}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={theme.tooltip}
            itemStyle={{ color: theme.tooltip.color }}
            formatter={(value) => [formatValue ? formatValue(Number(value)) : formatNumber(Number(value)), ""]}
            cursor={{ fill: theme.grid }}
          />
          <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={18}>
            {data.map((_, i) => (
              <Cell key={i} fill={getChartColor(i, CHART_CATEGORICAL)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

interface PieChartCardProps {
  data: { name: string; value: number }[];
  title: string;
}

export function PieChartCard({ data, title }: PieChartCardProps) {
  const theme = useChartTheme();
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const sliceStroke = theme.isDark ? "rgba(15,23,42,0.9)" : "#ffffff";

  return (
    <Card>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground mb-4">Share of global population by continent</p>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="46%"
            innerRadius={62}
            outerRadius={98}
            paddingAngle={4}
            dataKey="value"
            stroke={sliceStroke}
            strokeWidth={2}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={getContinentChartColor(entry.name)} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={theme.tooltip}
            itemStyle={{ color: theme.tooltip.color }}
            labelStyle={{ color: theme.tooltip.color, fontWeight: 600 }}
            formatter={(value, name) => {
              const pct = total ? ((Number(value) / total) * 100).toFixed(1) : "0";
              return [`${formatNumber(Number(value), true)} (${pct}%)`, name];
            }}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            formatter={(value) => <span style={{ color: theme.legend }}>{value}</span>}
            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function GdpBarChart({ data, title }: { data: WorldBankDataPoint[]; title: string }) {
  return (
    <TrendChart
      data={data}
      title={title}
      color={CHART_GDP}
      formatValue={formatCurrency}
    />
  );
}

export { CHART_POPULATION, CHART_LIFE };
