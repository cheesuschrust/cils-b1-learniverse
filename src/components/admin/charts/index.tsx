
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Bar Chart
interface BarChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  color?: string;
  className?: string;
}

export const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  xKey, 
  yKey, 
  color = '#3b82f6',
  className = 'h-72' 
}) => {
  const chartData = {
    labels: data.map(item => item[xKey]),
    datasets: [
      {
        label: yKey.charAt(0).toUpperCase() + yKey.slice(1),
        data: data.map(item => item[yKey]),
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className={className}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

// Line Chart
interface LineChartProps {
  data: any[];
  lines: { key: string; label: string; color: string }[];
  xKey: string;
  className?: string;
}

export const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  lines, 
  xKey,
  className = 'h-72' 
}) => {
  const chartData = {
    labels: data.map(item => item[xKey]),
    datasets: lines.map(line => ({
      label: line.label,
      data: data.map(item => item[line.key]),
      borderColor: line.color,
      backgroundColor: `${line.color}33`,
      tension: 0.2,
      fill: true,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className={className}>
      <Line data={chartData} options={options} />
    </div>
  );
};

// Donut Chart
interface DonutChartProps {
  data: any[];
  valueKey: string;
  labelKey: string;
  colors?: string[];
  className?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({ 
  data, 
  valueKey, 
  labelKey,
  colors = ['#3b82f6', '#06b6d4', '#4f46e5', '#8b5cf6'],
  className = 'h-72' 
}) => {
  const chartData = {
    labels: data.map(item => item[labelKey]),
    datasets: [
      {
        data: data.map(item => item[valueKey]),
        backgroundColor: colors.slice(0, data.length),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className={className}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};
