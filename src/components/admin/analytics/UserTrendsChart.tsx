
import React from 'react';
import { LineChart as TremorLineChart } from '@/components/admin/charts';

interface UserTrendsChartProps {
  data: { name: string; users: number; newUsers: number }[];
}

export const UserTrendsChart: React.FC<UserTrendsChartProps> = ({ data }) => {
  return (
    <TremorLineChart
      data={data}
      xKey="name"
      lines={[
        { key: 'users', label: 'Total Users', color: '#3b82f6' },
        { key: 'newUsers', label: 'New Users', color: '#22c55e' }
      ]}
    />
  );
};
