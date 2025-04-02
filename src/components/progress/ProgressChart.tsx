
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Badge } from "@/components/ui/badge";

interface ProgressChartProps {
  data: Array<{
    date: string;
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
    overall: number;
  }>;
  showProjection?: boolean;
  targetScore?: number;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ 
  data, 
  showProjection = false,
  targetScore = 70
}) => {
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  // Calculate trendlines and projections if needed
  const calculateProjection = () => {
    if (!showProjection || data.length < 2) return null;
    
    // Simple linear projection based on last two points
    const lastTwo = data.slice(-2);
    const rate = (lastTwo[1].overall - lastTwo[0].overall);
    
    // Project forward 30 days
    const lastDate = new Date(data[data.length - 1].date);
    const projectedData = [];
    
    for (let i = 1; i <= 3; i++) {
      const projectedDate = new Date(lastDate);
      projectedDate.setDate(lastDate.getDate() + (i * 10)); // Project every 10 days
      
      const projectedScore = Math.min(100, Math.max(0, 
        data[data.length - 1].overall + (rate * i)
      ));
      
      projectedData.push({
        date: projectedDate.toISOString().split('T')[0],
        overall: projectedScore,
        projected: true
      });
    }
    
    return projectedData;
  };
  
  // Combine actual data with projections
  const chartData = showProjection ? 
    [...data.map(item => ({...item, projected: false})), 
    ...(calculateProjection() || [])] 
    : data;
  
  // Get exam readiness status
  const lastScore = data.length > 0 ? data[data.length - 1].overall : 0;
  const readiness = lastScore >= targetScore ? "ready" : 
                    lastScore >= targetScore * 0.8 ? "approaching" : "needs-work";
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Progress Over Time</h3>
        <div className="flex items-center gap-2">
          <Badge variant={readiness === "ready" ? "default" : 
                      readiness === "approaching" ? "secondary" : "outline"}
                className={readiness === "ready" ? "bg-green-500" : 
                        readiness === "approaching" ? "bg-amber-500" : ""}
          >
            {readiness === "ready" ? "Ready for Test" : 
             readiness === "approaching" ? "Approaching Readiness" : "More Practice Needed"}
          </Badge>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={chartData.map(item => ({ ...item, date: formatDate(item.date) }))}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'overall') return [`${value}% (Overall)`, ''];
              return [`${value}%`, name.charAt(0).toUpperCase() + name.slice(1)];
            }}
            labelFormatter={(label) => `Date: ${label}`} 
          />
          <Legend />
          <ReferenceLine y={targetScore} stroke="#ff4500" strokeDasharray="3 3" label={{ 
            value: `Passing Score (${targetScore}%)`, 
            position: 'top',
            fill: '#ff4500',
            fontSize: 12 
          }} />
          
          {!showProjection && (
            <>
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
            </>
          )}
          
          <Line 
            type="monotone" 
            dataKey="overall" 
            name="Overall" 
            stroke="#ef4444" 
            strokeWidth={3} 
            dot={{ r: 4 }} 
            activeDot={{ r: 6 }} 
          />
          
          {showProjection && chartData.some(item => item.projected) && (
            <Line 
              type="monotone" 
              dataKey="overall" 
              name="Projected" 
              stroke="#ef4444" 
              strokeWidth={2} 
              strokeDasharray="5 5"
              data={chartData.filter(item => item.projected)}
              dot={{ r: 3, fill: "#ef4444", stroke: "#ef4444" }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
