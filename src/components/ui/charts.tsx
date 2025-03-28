
import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { ValueType } from 'recharts/types/component/DefaultTooltipContent';

export interface LineChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors: string[];
  valueFormatter: (value: number) => string;
  yAxisWidth?: number;
  className?: string;
}

// LineChart component definition with yAxisWidth
export function LineChart({
  data,
  index,
  categories,
  colors,
  valueFormatter,
  yAxisWidth = 56,
  className,
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350} className={className}>
      <RechartsLineChart
        data={data}
        margin={{
          top: 16,
          right: 16,
          bottom: 16,
          left: 16,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={index}
          tickLine={false}
          axisLine={false}
          padding={{ left: 16, right: 16 }}
          stroke="#888888"
          fontSize={12}
        />
        <YAxis
          width={yAxisWidth}
          tickFormatter={(value: number) => valueFormatter(value)}
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          fontSize={12}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-md">
                  <div className="grid grid-cols-2 gap-2">
                    {payload.map((entry, index) => (
                      <div key={`item-${index}`} className="flex flex-col">
                        <span
                          className="text-xs font-medium"
                          style={{ color: entry.color }}
                        >
                          {entry.name}
                        </span>
                        <span className="text-sm font-bold tabular-nums">
                          {valueFormatter(entry.value as number)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            return null;
          }}
        />
        {categories.map((category, index) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 6,
              style: { fill: "var(--theme-primary)", opacity: 0.8 },
            }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

// Add BarChart and PieChart components since they're also referenced in errors
export interface BarChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors: string[];
  valueFormatter: (value: number) => string;
  className?: string;
}

export function BarChart({
  data,
  index,
  categories,
  colors,
  valueFormatter,
  className,
}: BarChartProps) {
  // Placeholder implementation
  return (
    <div className={className}>
      <div>BarChart implementation needed</div>
    </div>
  );
}

export interface PieChartProps {
  data: any[];
  index: string;
  category: string;
  valueFormatter: (value: number) => string;
  colors: string[];
  className?: string;
}

export function PieChart({
  data,
  index,
  category,
  valueFormatter,
  colors,
  className,
}: PieChartProps) {
  // Placeholder implementation
  return (
    <div className={className}>
      <div>PieChart implementation needed</div>
    </div>
  );
}

export function AreaChart(props: BarChartProps) {
  // Placeholder implementation - reusing BarChartProps since they're similar
  return <BarChart {...props} />;
}
