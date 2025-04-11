
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
export const BarChart = (props: React.ComponentProps<typeof RBarChart>) => 
  <RBarChart {...props} />;

export const LineChart = (props: React.ComponentProps<typeof RLineChart>) => 
  <RLineChart {...props} />;

export const PieChart = (props: React.ComponentProps<typeof RPieChart>) => 
  <RPieChart {...props} />;

export const RadarChart = (props: React.ComponentProps<typeof RRadarChart>) => 
  <RRadarChart {...props} />;

export const AreaChart = (props: React.ComponentProps<typeof RAreaChart>) => 
  <RAreaChart {...props} />;

export const XAxis = (props: React.ComponentProps<typeof RXAxis>) => 
  <RXAxis {...props} />;

export const YAxis = (props: React.ComponentProps<typeof RYAxis>) => 
  <RYAxis {...props} />;

export const CartesianGrid = (props: React.ComponentProps<typeof RCartesianGrid>) => 
  <RCartesianGrid {...props} />;

export const Tooltip = (props: React.ComponentProps<typeof RTooltip>) => 
  <RTooltip {...props} />;

export const Legend = (props: React.ComponentProps<typeof RLegend>) => 
  <RLegend {...props} />;

export const Bar = (props: React.ComponentProps<typeof RBar>) => 
  <RBar {...props} />;

export const Line = (props: React.ComponentProps<typeof RLine>) => 
  <RLine {...props} />;

export const Pie = (props: React.ComponentProps<typeof RPie>) => 
  <RPie {...props} />;

export const Area = (props: React.ComponentProps<typeof RArea>) => 
  <RArea {...props} />;

export const PolarAngleAxis = (props: React.ComponentProps<typeof RPolarAngleAxis>) => 
  <RPolarAngleAxis {...props} />;

export const PolarRadiusAxis = (props: React.ComponentProps<typeof RPolarRadiusAxis>) => 
  <RPolarRadiusAxis {...props} />;

export const Radar = (props: React.ComponentProps<typeof RRadar>) => 
  <RRadar {...props} />;

// Re-export ResponsiveContainer as it doesn't need wrapping
export { ResponsiveContainer };
