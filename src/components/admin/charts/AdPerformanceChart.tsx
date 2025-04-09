
import React, { useState, useEffect } from 'react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  AreaChart as RechartsAreaChart,
  Area
} from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdPerformanceChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('30d');
  const [chartType, setChartType] = useState<string>('line');
  const [data, setData] = useState<any[]>([]);
  
  // Generate mock time-series data
  useEffect(() => {
    const generateData = () => {
      const now = new Date();
      const data: any[] = [];
      
      const points = timeRange === '7d' ? 7 
                   : timeRange === '30d' ? 30 
                   : timeRange === '90d' ? 90 
                   : 12; // 12 months for '1y'
      
      for (let i = points; i >= 0; i--) {
        const date = new Date();
        
        if (timeRange === '1y') {
          date.setMonth(now.getMonth() - i);
        } else {
          date.setDate(now.getDate() - i);
        }
        
        // Base values with some randomization
        const impressionsBase = Math.floor(Math.random() * 300) + 700; // 700-1000
        const clicks = Math.floor(impressionsBase * (0.03 + Math.random() * 0.03)); // 3-6% CTR
        const conversions = Math.floor(clicks * (0.08 + Math.random() * 0.07)); // 8-15% conversion rate
        const revenue = parseFloat((conversions * (5 + Math.random() * 5)).toFixed(2)); // $5-10 per conversion
        
        data.push({
          date: timeRange === '1y' 
            ? date.toLocaleString('default', { month: 'short', year: 'numeric' })
            : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          impressions: impressionsBase,
          clicks: clicks,
          conversions: conversions,
          revenue: revenue,
          ctr: parseFloat(((clicks / impressionsBase) * 100).toFixed(2))
        });
      }
      
      return data;
    };
    
    setData(generateData());
  }, [timeRange]);
  
  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="impressions" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="clicks" stroke="#82ca9d" strokeWidth={2} />
              <Line type="monotone" dataKey="conversions" stroke="#ff7300" strokeWidth={2} />
            </RechartsLineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="impressions" fill="#8884d8" />
              <Bar dataKey="clicks" fill="#82ca9d" />
              <Bar dataKey="conversions" fill="#ff7300" />
            </RechartsBarChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsAreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="ctr" fill="#8884d8" stroke="#8884d8" fillOpacity={0.3} />
              <Area type="monotone" dataKey="revenue" fill="#82ca9d" stroke="#82ca9d" fillOpacity={0.3} />
            </RechartsAreaChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4">
        <Tabs value={chartType} onValueChange={setChartType}>
          <TabsList>
            <TabsTrigger value="line">Line</TabsTrigger>
            <TabsTrigger value="bar">Bar</TabsTrigger>
            <TabsTrigger value="area">Area</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
            <SelectItem value="1y">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="h-[calc(100%-48px)]">
        {renderChart()}
      </div>
    </div>
  );
};

export default AdPerformanceChart;
