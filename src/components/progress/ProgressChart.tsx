
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ProgressChartProps {
  data: Array<{
    date: string;
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
    overall: number;
  }>;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data.map(item => ({ ...item, date: formatDate(item.date) }))}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
        <Tooltip 
          formatter={(value) => [`${value}%`, '']}
          labelFormatter={(label) => `Date: ${label}`} 
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="listening" 
          name="Listening" 
          stroke="#3b82f6" 
          strokeWidth={2} 
          dot={{ r: 3 }} 
          activeDot={{ r: 5 }} 
        />
        <Line 
          type="monotone" 
          dataKey="reading" 
          name="Reading" 
          stroke="#10b981" 
          strokeWidth={2} 
          dot={{ r: 3 }} 
          activeDot={{ r: 5 }} 
        />
        <Line 
          type="monotone" 
          dataKey="writing" 
          name="Writing" 
          stroke="#f59e0b" 
          strokeWidth={2} 
          dot={{ r: 3 }} 
          activeDot={{ r: 5 }} 
        />
        <Line 
          type="monotone" 
          dataKey="speaking" 
          name="Speaking" 
          stroke="#8b5cf6" 
          strokeWidth={2} 
          dot={{ r: 3 }} 
          activeDot={{ r: 5 }} 
        />
        <Line 
          type="monotone" 
          dataKey="overall" 
          name="Overall" 
          stroke="#ef4444" 
          strokeWidth={3} 
          dot={{ r: 4 }} 
          activeDot={{ r: 6 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProgressChart;
