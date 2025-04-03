
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DonutChart } from '@/components/admin/charts';

const userDistributionData = [
  { name: 'Free', value: 68 },
  { name: 'Premium', value: 24 },
  { name: 'Instructor', value: 8 }
];

const UserDistributionCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Distribution</CardTitle>
        <CardDescription>Breakdown by subscription tier</CardDescription>
      </CardHeader>
      <CardContent>
        <DonutChart data={userDistributionData} height={300} />
      </CardContent>
    </Card>
  );
};

export default UserDistributionCard;
