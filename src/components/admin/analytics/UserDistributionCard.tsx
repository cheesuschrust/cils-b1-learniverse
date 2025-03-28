
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface UserDistributionCardProps {
  data: { name: string; value: number }[];
  totalUsers: number;
  showFooter?: boolean;
  className?: string;
}

export const UserDistributionCard: React.FC<UserDistributionCardProps> = ({ 
  data, 
  totalUsers,
  showFooter = false,
  className
}) => {
  const colors = ["#3b82f6", "#22c55e", "#6366f1"];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>User Distribution</CardTitle>
        <CardDescription>
          Users by subscription plan
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      
      {showFooter && (
        <CardFooter className="pt-0">
          <div className="w-full space-y-1">
            {data.map((plan, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{plan.name}</span>
                <span>{Math.round(plan.value / totalUsers * 100)}%</span>
              </div>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
