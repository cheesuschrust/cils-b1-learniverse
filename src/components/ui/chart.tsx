
import React, { ReactNode } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
  LineChart as RechartsLineChart,
  Line,
  AreaChart as RechartsAreaChart,
  Area,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Sector,
} from 'recharts';

// Colors for charts
const chartColors = {
  blue: '#3b82f6',
  green: '#10b981',
  yellow: '#f59e0b',
  red: '#ef4444',
  purple: '#8b5cf6',
  pink: '#ec4899',
  indigo: '#6366f1',
  teal: '#14b8a6',
  orange: '#f97316',
  cyan: '#06b6d4',
  slate: '#64748b',
  gray: '#6b7280',
  zinc: '#71717a',
  neutral: '#737373',
  stone: '#78716c',
  amber: '#f59e0b',
  lime: '#84cc16',
  emerald: '#10b981',
  sky: '#0ea5e9',
  violet: '#8b5cf6',
  fuchsia: '#d946ef',
  rose: '#f43f5e',
};

type ChartColor = keyof typeof chartColors;

// Bar Chart
interface BarChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: ChartColor[];
  className?: string;
  valueFormatter?: (value: number) => string;
  yAxisWidth?: number;
  noLegend?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  index,
  categories,
  colors = ['blue', 'green', 'yellow', 'purple', 'pink', 'red'],
  className = '',
  valueFormatter = (value) => `${value}`,
  yAxisWidth = 40,
  noLegend = false,
}) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey={index} 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            width={yAxisWidth} 
            tickFormatter={valueFormatter} 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip 
            formatter={(value: number) => [valueFormatter(value), '']}
            contentStyle={{ 
              backgroundColor: 'white', 
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
          />
          {!noLegend && <Legend />}
          {categories.map((category, index) => (
            <Bar
              key={category}
              dataKey={category}
              fill={chartColors[colors[index % colors.length]]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Line Chart
interface LineChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: ChartColor[];
  className?: string;
  valueFormatter?: (value: number, category?: string) => string;
  noLegend?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  index,
  categories,
  colors = ['blue', 'green', 'yellow', 'purple', 'pink', 'red'],
  className = '',
  valueFormatter = (value) => `${value}`,
  noLegend = false,
}) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey={index} 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            tickFormatter={(value) => valueFormatter(value)} 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip 
            formatter={(value: number, name: string) => [valueFormatter(value, name), name]}
            contentStyle={{ 
              backgroundColor: 'white', 
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
          />
          {!noLegend && <Legend />}
          {categories.map((category, index) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={chartColors[colors[index % colors.length]]}
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Area Chart
interface AreaChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: ChartColor[];
  className?: string;
  valueFormatter?: (value: number) => string;
  noLegend?: boolean;
  stacked?: boolean;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  index,
  categories,
  colors = ['blue', 'green', 'yellow', 'purple', 'pink', 'red'],
  className = '',
  valueFormatter = (value) => `${value}`,
  noLegend = false,
  stacked = false,
}) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey={index} 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            tickFormatter={valueFormatter} 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip 
            formatter={(value: number) => [valueFormatter(value), '']}
            contentStyle={{ 
              backgroundColor: 'white', 
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
          />
          {!noLegend && <Legend />}
          {categories.map((category, index) => (
            <Area
              key={category}
              type="monotone"
              dataKey={category}
              stroke={chartColors[colors[index % colors.length]]}
              fill={chartColors[colors[index % colors.length]]}
              fillOpacity={0.3}
              stackId={stacked ? "1" : undefined}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Pie Chart
interface PieChartProps {
  data: any[];
  index: string;
  category: string;
  colors?: ChartColor[];
  className?: string;
  valueFormatter?: (value: number) => string;
  innerRadius?: number;
  outerRadius?: number;
  noLegend?: boolean;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  index,
  category,
  colors = ['blue', 'green', 'yellow', 'purple', 'pink', 'red'],
  className = '',
  valueFormatter = (value) => `${value}`,
  innerRadius = 0,
  outerRadius = 80,
  noLegend = false,
}) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey={category}
            nameKey={index}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={chartColors[colors[index % colors.length]]} 
              />
            ))}
          </Pie>
          {!noLegend && <Legend />}
          <Tooltip 
            formatter={(value: number) => [valueFormatter(value), '']}
            contentStyle={{ 
              backgroundColor: 'white', 
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};
