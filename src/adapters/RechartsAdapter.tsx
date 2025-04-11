import React from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

// Type-safe wrappers for Recharts components
export const ChartContainer: React.FC<{
  children: React.ReactNode;
  width?: string | number;
  height?: string | number;
}> = ({ children, width = "100%", height = "100%" }) => (
  <ResponsiveContainer width={width} height={height}>
    {children}
  </ResponsiveContainer>
);

// Line Chart Components
export const LineChartWrapper: React.FC<React.ComponentProps<typeof LineChart>> = (props) => (
  <LineChart {...props} />
);

export const LineComponent: React.FC<React.ComponentProps<typeof Line>> = (props) => (
  <Line {...props} />
);

// Bar Chart Components
export const BarChartWrapper: React.FC<React.ComponentProps<typeof BarChart>> = (props) => (
  <BarChart {...props} />
);

export const BarComponent: React.FC<React.ComponentProps<typeof Bar>> = (props) => (
  <Bar {...props} />
);

// Area Chart Components
export const AreaChartWrapper: React.FC<React.ComponentProps<typeof AreaChart>> = (props) => (
  <AreaChart {...props} />
);

export const AreaComponent: React.FC<React.ComponentProps<typeof Area>> = (props) => (
  <Area {...props} />
);

// Pie Chart Components
export const PieChartWrapper: React.FC<React.ComponentProps<typeof PieChart>> = (props) => (
  <PieChart {...props} />
);

export const PieComponent: React.FC<React.ComponentProps<typeof Pie>> = (props) => (
  <Pie {...props} />
);

// Radar Chart Components
export const RadarChartWrapper: React.FC<React.ComponentProps<typeof RadarChart>> = (props) => (
  <RadarChart {...props} />
);

export const RadarComponent: React.FC<React.ComponentProps<typeof Radar>> = (props) => (
  <Radar {...props} />
);

// Axis Components
export const XAxisComponent: React.FC<React.ComponentProps<typeof XAxis>> = (props) => (
  <XAxis {...props} />
);

export const YAxisComponent: React.FC<React.ComponentProps<typeof YAxis>> = (props) => (
  <YAxis {...props} />
);

export const PolarAngleAxisComponent: React.FC<React.ComponentProps<typeof PolarAngleAxis>> = (props) => (
  <PolarAngleAxis {...props} />
);

export const PolarRadiusAxisComponent: React.FC<React.ComponentProps<typeof PolarRadiusAxis>> = (props) => (
  <PolarRadiusAxis {...props} />
);

// Other Chart Components
export const CartesianGridComponent: React.FC<React.ComponentProps<typeof CartesianGrid>> = (props) => (
  <CartesianGrid {...props} />
);

export const TooltipComponent: React.FC<React.ComponentProps<typeof Tooltip>> = (props) => (
  <Tooltip {...props} />
);

export const LegendComponent: React.FC<React.ComponentProps<typeof Legend>> = (props) => (
  <Legend {...props} />
);

export const PolarGridComponent: React.FC<React.ComponentProps<typeof PolarGrid>> = (props) => (
  <PolarGrid {...props} />
);
