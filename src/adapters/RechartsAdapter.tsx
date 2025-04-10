
// Recharts adapter for improved TypeScript compatibility
import * as React from 'react';
import * as RechartsModule from 'recharts';

// Re-export components separately to make TypeScript happy
export const {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  Cell
} = RechartsModule;

// Helper wrapper components with simplified types
export const ChartWrapper: React.FC<{
  children: React.ReactNode;
  height?: number | string;
  width?: number | string;
}> = ({ children, height = 300, width = '100%' }) => (
  <ResponsiveContainer width={width} height={height}>
    {children}
  </ResponsiveContainer>
);

// Re-export all Recharts
export default RechartsModule;
