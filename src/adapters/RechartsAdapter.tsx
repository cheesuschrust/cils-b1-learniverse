
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
  Scatter,
  Cell
} from 'recharts';

// Create wrapper components for Recharts components
export const XAxisWrapper: React.FC<any> = (props) => <XAxis {...props} />;
export const YAxisWrapper: React.FC<any> = (props) => <YAxis {...props} />;
export const LineWrapper: React.FC<any> = (props) => <Line {...props} />;
export const BarWrapper: React.FC<any> = (props) => <Bar {...props} />;
export const PieWrapper: React.FC<any> = (props) => <Pie {...props} />;
export const AreaWrapper: React.FC<any> = (props) => <Area {...props} />;
export const TooltipWrapper: React.FC<any> = (props) => <Tooltip {...props} />;
export const LegendWrapper: React.FC<any> = (props) => <Legend {...props} />;
export const CartesianGridWrapper: React.FC<any> = (props) => <CartesianGrid {...props} />;
export const CellWrapper: React.FC<any> = (props) => <Cell {...props} />;
export const RadarWrapper: React.FC<any> = (props) => <Radar {...props} />;
export const PolarGridWrapper: React.FC<any> = (props) => <PolarGrid {...props} />;
export const PolarAngleAxisWrapper: React.FC<any> = (props) => <PolarAngleAxis {...props} />;
export const PolarRadiusAxisWrapper: React.FC<any> = (props) => <PolarRadiusAxis {...props} />;
export const ScatterWrapper: React.FC<any> = (props) => <Scatter {...props} />;

// Continue to re-export the original components for non-JSX usage
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
  Scatter,
  Cell
};

// Helper wrapper component with simplified types
export const ChartWrapper: React.FC<{
  children: React.ReactNode;
  height?: number | string;
  width?: number | string;
}> = ({ children, height = 300, width = '100%' }) => (
  <ResponsiveContainer width={width} height={height}>
    {children}
  </ResponsiveContainer>
);
