
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface UserTrendsChartProps {
  data: { name: string; users: number; newUsers: number }[];
}

export const UserTrendsChart: React.FC<UserTrendsChartProps> = ({ data }) => {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="users" name="Total Users" stroke="#3b82f6" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="newUsers" name="New Users" stroke="#22c55e" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
