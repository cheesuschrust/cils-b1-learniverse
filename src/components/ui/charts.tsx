
import React from 'react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = {
  blue: '#2563eb',
  green: '#16a34a',
  red: '#dc2626',
  yellow: '#eab308',
  purple: '#9333ea',
  pink: '#db2777',
  indigo: '#4f46e5',
  cyan: '#0891b2',
};

export interface BarChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
}

export function BarChart({ 
  data, 
  index, 
  categories, 
  colors = ['blue'], 
  valueFormatter = (value) => `${value}`,
  className = ''
}: BarChartProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey={index} 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis 
            tickFormatter={valueFormatter} 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
            width={80}
          />
          <Tooltip 
            formatter={valueFormatter} 
            labelStyle={{ fontWeight: 'bold' }}
            contentStyle={{ 
              borderRadius: '0.375rem', 
              padding: '0.5rem',
              border: '1px solid rgba(0, 0, 0, 0.1)' 
            }} 
          />
          <Legend 
            wrapperStyle={{ paddingTop: 10 }} 
            formatter={(value) => <span style={{ fontSize: 12 }}>{value}</span>}
          />
          {categories.map((category, index) => (
            <Bar 
              key={category} 
              dataKey={category} 
              fill={COLORS[colors[index % colors.length]]} 
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export interface LineChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
}

export function LineChart({ 
  data, 
  index, 
  categories, 
  colors = ['blue'], 
  valueFormatter = (value) => `${value}`,
  className = ''
}: LineChartProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey={index} 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis 
            tickFormatter={valueFormatter} 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
            width={80}
          />
          <Tooltip 
            formatter={valueFormatter} 
            labelStyle={{ fontWeight: 'bold' }}
            contentStyle={{ 
              borderRadius: '0.375rem', 
              padding: '0.5rem',
              border: '1px solid rgba(0, 0, 0, 0.1)' 
            }} 
          />
          <Legend 
            wrapperStyle={{ paddingTop: 10 }} 
            formatter={(value) => <span style={{ fontSize: 12 }}>{value}</span>}
          />
          {categories.map((category, index) => (
            <Line 
              key={category} 
              type="monotone" 
              dataKey={category} 
              stroke={COLORS[colors[index % colors.length]]}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

export interface PieChartProps {
  data: any[];
  index: string;
  valueFormatter?: (value: number) => string;
  className?: string;
}

export function PieChart({ 
  data, 
  index, 
  valueFormatter = (value) => `${value}`,
  className = ''
}: PieChartProps) {
  const colorKeys = Object.keys(COLORS);
  
  return (
    <div className={`w-full h-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey={index}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[colorKeys[index % colorKeys.length]]} 
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [valueFormatter(value), "Value"]} 
            labelStyle={{ fontWeight: 'bold' }}
            contentStyle={{ 
              borderRadius: '0.375rem', 
              padding: '0.5rem',
              border: '1px solid rgba(0, 0, 0, 0.1)' 
            }} 
          />
          <Legend 
            layout="vertical" 
            verticalAlign="middle" 
            align="right"
            formatter={(value) => <span style={{ fontSize: 12 }}>{value}</span>}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
