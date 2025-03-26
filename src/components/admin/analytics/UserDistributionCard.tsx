
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DonutChart } from '@/components/admin/charts';

interface UserDistributionCardProps {
  data: { name: string; value: number }[];
  totalUsers: number;
  showFooter?: boolean;
}

export const UserDistributionCard: React.FC<UserDistributionCardProps> = ({ 
  data, 
  totalUsers,
  showFooter = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Distribution</CardTitle>
        <CardDescription>
          Users by subscription plan
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <DonutChart
          data={data}
          valueKey="value"
          labelKey="name"
          colors={["#3b82f6", "#06b6d4", "#4f46e5"]}
          className={showFooter ? "h-60" : "h-52"}
        />
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
