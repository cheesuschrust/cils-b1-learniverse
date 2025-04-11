
import React from 'react';
import {
  BarChart as RBarChart,
  LineChart as RLineChart,
  PieChart as RPieChart,
  RadarChart as RRadarChart,
  AreaChart as RAreaChart,
  XAxis as RXAxis,
  YAxis as RYAxis,
  CartesianGrid as RCartesianGrid,
  Tooltip as RTooltip,
  Legend as RLegend,
  Bar as RBar,
  Line as RLine,
  Pie as RPie,
  Area as RArea,
  PolarAngleAxis as RPolarAngleAxis,
  PolarRadiusAxis as RPolarRadiusAxis,
  Radar as RRadar,
  ResponsiveContainer
} from 'recharts';

// Properly wrapped components with React functional component patterns
export const BarChart: React.FC<React.ComponentProps<typeof RBarChart>> = (props) => 
  <RBarChart {...props} />;

export const LineChart: React.FC<React.ComponentProps<typeof RLineChart>> = (props) => 
  <RLineChart {...props} />;

export const PieChart: React.FC<React.ComponentProps<typeof RPieChart>> = (props) => 
  <RPieChart {...props} />;

export const RadarChart: React.FC<React.ComponentProps<typeof RRadarChart>> = (props) => 
  <RRadarChart {...props} />;

export const AreaChart: React.FC<React.ComponentProps<typeof RAreaChart>> = (props) => 
  <RAreaChart {...props} />;

export const XAxis: React.FC<React.ComponentProps<typeof RXAxis>> = (props) => 
  <RXAxis {...props} />;

export const YAxis: React.FC<React.ComponentProps<typeof RYAxis>> = (props) => 
  <RYAxis {...props} />;

export const CartesianGrid: React.FC<React.ComponentProps<typeof RCartesianGrid>> = (props) => 
  <RCartesianGrid {...props} />;

export const Tooltip: React.FC<React.ComponentProps<typeof RTooltip>> = (props) => 
  <RTooltip {...props} />;

export const Legend: React.FC<React.ComponentProps<typeof RLegend>> = (props) => 
  <RLegend {...props} />;

export const Bar: React.FC<React.ComponentProps<typeof RBar>> = (props) => 
  <RBar {...props} />;

export const Line: React.FC<React.ComponentProps<typeof RLine>> = (props) => 
  <RLine {...props} />;

export const Pie: React.FC<React.ComponentProps<typeof RPie>> = (props) => 
  <RPie {...props} />;

export const Area: React.FC<React.ComponentProps<typeof RArea>> = (props) => 
  <RArea {...props} />;

export const PolarAngleAxis: React.FC<React.ComponentProps<typeof RPolarAngleAxis>> = (props) => 
  <RPolarAngleAxis {...props} />;

export const PolarRadiusAxis: React.FC<React.ComponentProps<typeof RPolarRadiusAxis>> = (props) => 
  <RPolarRadiusAxis {...props} />;

export const Radar: React.FC<React.ComponentProps<typeof RRadar>> = (props) => 
  <RRadar {...props} />;

// Re-export ResponsiveContainer as it doesn't need wrapping
export { ResponsiveContainer };
