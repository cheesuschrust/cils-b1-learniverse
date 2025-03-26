
import React from 'react';
import { LineChart } from '@/components/admin/charts';

interface UserTrendsChartProps {
  data: { name: string; users: number; newUsers: number }[];
}

export const UserTrendsChart: React.FC<UserTrendsChartProps> = ({ data }) => {
  return (
    <LineChart
      data={data}
      xKey="name"
      lines={[
        { key: 'users', label: 'Total Users', color: '#3b82f6' },
        { key: 'newUsers', label: 'New Users', color: '#22c55e' }
      ]}
    />
  );
};
