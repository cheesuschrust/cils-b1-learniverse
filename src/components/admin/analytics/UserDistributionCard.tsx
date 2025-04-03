
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const UserDistributionCard: React.FC = () => {
  // Mock data for user distribution
  const subscriptionData = [
    { name: 'Free', value: 65, color: '#94a3b8' },
    { name: 'Basic', value: 20, color: '#60a5fa' },
    { name: 'Premium', value: 15, color: '#6366f1' },
  ];
  
  const userStatusData = [
    { name: 'Active', value: 78, color: '#22c55e' },
    { name: 'Inactive', value: 12, color: '#f87171' },
    { name: 'New', value: 10, color: '#facc15' },
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>User Distribution</CardTitle>
        <CardDescription>User distribution by subscription type and status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-[200px]">
            <h4 className="text-sm font-medium text-center mb-2">By Subscription</h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subscriptionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {subscriptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="h-[200px]">
            <h4 className="text-sm font-medium text-center mb-2">By Status</h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
            <div className="text-sm text-muted-foreground">Total Users</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              6,428
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              +12.5% from last month
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-950 p-3 rounded-md">
            <div className="text-sm text-muted-foreground">Conversion Rate</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              15.4%
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">
              +2.3% from last month
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDistributionCard;
