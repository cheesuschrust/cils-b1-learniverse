
import React from 'react';
import { PieChart, BarChart } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CategoryPerformanceProps {
  data: Array<{
    category: string;
    total: number;
    correct: number;
    masteryPercentage: number;
    attempts: number;
    averageScore: number;
    reviewEfficiency?: number; // Added for review performance
  }>;
}

const CategoryPerformance: React.FC<CategoryPerformanceProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-muted/20 rounded-md">
        <p className="text-muted-foreground">No category data available</p>
      </div>
    );
  }

  // Format data for pie chart
  const pieData = data.map(item => ({
    name: item.category,
    value: item.total
  }));
  
  // Format data for bar chart
  const barData = [...data].sort((a, b) => a.masteryPercentage - b.masteryPercentage);

  // Format data for review efficiency
  const reviewData = data
    .filter(item => item.reviewEfficiency !== undefined)
    .sort((a, b) => (a.reviewEfficiency || 0) - (b.reviewEfficiency || 0));
  
  return (
    <Tabs defaultValue="pie">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="pie">Distribution</TabsTrigger>
        <TabsTrigger value="mastery">Mastery</TabsTrigger>
        <TabsTrigger value="review">Reviews</TabsTrigger>
      </TabsList>
      
      <TabsContent value="pie" className="h-[300px]">
        <PieChart 
          data={pieData}
          index="name"
          category="value"
          valueFormatter={(value) => `${value} questions`}
          colors={['blue', 'green', 'yellow', 'purple', 'pink', 'indigo']}
        />
      </TabsContent>
      
      <TabsContent value="mastery" className="h-[300px]">
        <BarChart 
          data={barData}
          index="category"
          categories={["masteryPercentage"]}
          colors={['green']}
          valueFormatter={(value) => `${value}%`}
        />
      </TabsContent>
      
      <TabsContent value="review" className="h-[300px]">
        {reviewData.length > 0 ? (
          <BarChart 
            data={reviewData}
            index="category"
            categories={["reviewEfficiency"]}
            colors={['blue']}
            valueFormatter={(value) => `${value}%`}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-muted/20 rounded-md">
            <p className="text-muted-foreground">No review data available yet</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default CategoryPerformance;
