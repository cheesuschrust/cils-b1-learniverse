
// Re-export Recharts components with proper typings
import * as RechartsModule from 'recharts';

// Create safe exports for commonly used components
export const {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  Legend,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter,
  ComposedChart,
  Brush
} = RechartsModule;

// Add fallback export
export default RechartsModule;
