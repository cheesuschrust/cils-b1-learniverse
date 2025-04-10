
import React from 'react';
import {
  LineChart as RLineChart,
  Line as RLine,
  BarChart as RBarChart,
  Bar as RBar,
  PieChart as RPieChart,
  Pie as RPie,
  AreaChart as RAreaChart,
  Area as RArea,
  XAxis as RXAxis,
  YAxis as RYAxis,
  CartesianGrid as RCartesianGrid,
  Tooltip as RTooltip,
  Legend as RLegend,
  ResponsiveContainer as RResponsiveContainer,
  RadarChart as RRadarChart,
  Radar as RRadar,
  PolarGrid as RPolarGrid,
  PolarAngleAxis as RPolarAngleAxis,
  PolarRadiusAxis as RPolarRadiusAxis,
  ScatterChart as RScatterChart,
  Scatter as RScatter,
  Cell as RCell
} from 'recharts';

// Create component wrappers for Recharts to support JSX properly
export const LineChart: React.FC<any> = (props) => <RLineChart {...props} />;
export const Line: React.FC<any> = (props) => <RLine {...props} />;
export const BarChart: React.FC<any> = (props) => <RBarChart {...props} />;
export const Bar: React.FC<any> = (props) => <RBar {...props} />;
export const PieChart: React.FC<any> = (props) => <RPieChart {...props} />;
export const Pie: React.FC<any> = (props) => <RPie {...props} />;
export const AreaChart: React.FC<any> = (props) => <RAreaChart {...props} />;
export const Area: React.FC<any> = (props) => <RArea {...props} />;
export const XAxis: React.FC<any> = (props) => <RXAxis {...props} />;
export const YAxis: React.FC<any> = (props) => <RYAxis {...props} />;
export const CartesianGrid: React.FC<any> = (props) => <RCartesianGrid {...props} />;
export const Tooltip: React.FC<any> = (props) => <RTooltip {...props} />;
export const Legend: React.FC<any> = (props) => <RLegend {...props} />;
export const ResponsiveContainer: React.FC<any> = (props) => <RResponsiveContainer {...props} />;
export const RadarChart: React.FC<any> = (props) => <RRadarChart {...props} />;
export const Radar: React.FC<any> = (props) => <RRadar {...props} />;
export const PolarGrid: React.FC<any> = (props) => <RPolarGrid {...props} />;
export const PolarAngleAxis: React.FC<any> = (props) => <RPolarAngleAxis {...props} />;
export const PolarRadiusAxis: React.FC<any> = (props) => <RPolarRadiusAxis {...props} />;
export const ScatterChart: React.FC<any> = (props) => <RScatterChart {...props} />;
export const Scatter: React.FC<any> = (props) => <RScatter {...props} />;
export const Cell: React.FC<any> = (props) => <RCell {...props} />;

// Helper wrapper component with simplified types
export const ChartWrapper: React.FC<{
  children: React.ReactNode;
  height?: number | string;
  width?: number | string;
}> = ({ children, height = 300, width = '100%' }) => (
  <RResponsiveContainer width={width} height={height}>
    {children}
  </RResponsiveContainer>
);
