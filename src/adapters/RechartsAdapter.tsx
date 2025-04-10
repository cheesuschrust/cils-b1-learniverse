
import React from 'react';
import {
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  RadarChart as RechartsRadarChart,
  AreaChart as RechartsAreaChart,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  Bar as RechartsBar,
  Line as RechartsLine,
  Pie as RechartsPie,
  Area as RechartsArea,
  PolarAngleAxis as RechartsPolarAngleAxis,
  PolarRadiusAxis as RechartsPolarRadiusAxis,
  Radar as RechartsRadar,
  ResponsiveContainer,
  Cell,
  ComposedChart,
  Scatter,
  ScatterChart,
  RadialBarChart,
  RadialBar,
  Brush,
  ReferenceLine,
  ReferenceArea
} from 'recharts';

// Create proper React components with correct typings
export const BarChart: React.FC<React.ComponentProps<typeof RechartsBarChart>> = (props) => 
  <RechartsBarChart {...props} />;

export const LineChart: React.FC<React.ComponentProps<typeof RechartsLineChart>> = (props) => 
  <RechartsLineChart {...props} />;

export const PieChart: React.FC<React.ComponentProps<typeof RechartsPieChart>> = (props) => 
  <RechartsPieChart {...props} />;

export const RadarChart: React.FC<React.ComponentProps<typeof RechartsRadarChart>> = (props) => 
  <RechartsRadarChart {...props} />;

export const AreaChart: React.FC<React.ComponentProps<typeof RechartsAreaChart>> = (props) => 
  <RechartsAreaChart {...props} />;

export const XAxis: React.FC<React.ComponentProps<typeof RechartsXAxis>> = (props) => 
  <RechartsXAxis {...props} />;

export const YAxis: React.FC<React.ComponentProps<typeof RechartsYAxis>> = (props) => 
  <RechartsYAxis {...props} />;

export const CartesianGrid: React.FC<React.ComponentProps<typeof RechartsCartesianGrid>> = (props) => 
  <RechartsCartesianGrid {...props} />;

export const Tooltip: React.FC<React.ComponentProps<typeof RechartsTooltip>> = (props) => 
  <RechartsTooltip {...props} />;

export const Legend: React.FC<React.ComponentProps<typeof RechartsLegend>> = (props) => 
  <RechartsLegend {...props} />;

export const Bar: React.FC<React.ComponentProps<typeof RechartsBar>> = (props) => 
  <RechartsBar {...props} />;

export const Line: React.FC<React.ComponentProps<typeof RechartsLine>> = (props) => 
  <RechartsLine {...props} />;

export const Pie: React.FC<React.ComponentProps<typeof RechartsPie>> = (props) => 
  <RechartsPie {...props} />;

export const Area: React.FC<React.ComponentProps<typeof RechartsArea>> = (props) => 
  <RechartsArea {...props} />;

export const PolarAngleAxis: React.FC<React.ComponentProps<typeof RechartsPolarAngleAxis>> = (props) => 
  <RechartsPolarAngleAxis {...props} />;

export const PolarRadiusAxis: React.FC<React.ComponentProps<typeof RechartsPolarRadiusAxis>> = (props) => 
  <RechartsPolarRadiusAxis {...props} />;

export const Radar: React.FC<React.ComponentProps<typeof RechartsRadar>> = (props) => 
  <RechartsRadar {...props} />;

export { 
  ResponsiveContainer,
  Cell,
  ComposedChart,
  Scatter,
  ScatterChart,
  RadialBarChart,
  RadialBar,
  Brush,
  ReferenceLine,
  ReferenceArea
};

export default {
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  Line,
  Pie,
  Area,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Cell,
  ComposedChart,
  Scatter,
  ScatterChart,
  RadialBarChart,
  RadialBar,
  Brush
};
