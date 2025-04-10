
// Recharts adapter for improved TypeScript compatibility
import React from 'react';
import {
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
  Scatter
} from 'recharts';

// Re-export all Recharts components with fixed props
export {
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
  Scatter
};

// Helper wrapper components with proper types
export const ChartWrapper: React.FC<{
  children: React.ReactNode;
  height?: number | string;
  width?: number | string;
}> = ({ children, height = 300, width = '100%' }) => (
  <ResponsiveContainer width={width} height={height}>
    {children}
  </ResponsiveContainer>
);
