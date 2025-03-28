
// This is a stub file to fix the errors, with proper props for PieChart
import React from 'react';
import { PieChart } from '@/components/ui/charts';

const EnhancedAnalyticsDashboard: React.FC = () => {
  const userData = [
    { name: 'Free', value: 58 },
    { name: 'Premium', value: 35 },
    { name: 'Educational', value: 7 }
  ];

  const locationData = [
    { name: 'United States', value: 32 },
    { name: 'Italy', value: 18 },
    { name: 'United Kingdom', value: 12 },
    { name: 'Germany', value: 10 },
    { name: 'France', value: 7 },
    { name: 'Other', value: 21 }
  ];

  return (
    <div>
      {/* Fix for line 327 */}
      <PieChart
        data={userData}
        index="name"
        category="value"
        colors={["slate", "blue", "amber"]}
        valueFormatter={(value) => `${value}%`}
        className="h-40"
      />
      
      {/* Fix for line 365 */}
      <PieChart
        data={locationData}
        index="name"
        category="value"
        colors={["blue", "green", "amber", "red", "purple", "slate"]}
        valueFormatter={(value) => `${value}%`}
        className="h-40"
      />
    </div>
  );
};

export default EnhancedAnalyticsDashboard;
