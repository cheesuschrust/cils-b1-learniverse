
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ContentCategoriesCardProps {
  categories: { name: string; value: number }[];
  className?: string;
}

export const ContentCategoriesCard: React.FC<ContentCategoriesCardProps> = ({ 
  categories,
  className
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Popular Categories</CardTitle>
        <CardDescription>
          Most accessed content categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm">{category.name}</span>
                <span className="text-sm">{category.value}%</span>
              </div>
              <Progress value={category.value} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
