
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface GeographicalDistributionCardProps {
  data: { name: string; value: number }[];
  totalUsers: number;
}

export const GeographicalDistributionCard: React.FC<GeographicalDistributionCardProps> = ({ data, totalUsers }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Geographical Distribution</CardTitle>
        <CardDescription>
          Users by country
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-4">
              {data.map((country, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">{country.name}</span>
                    <span className="text-sm">{Math.round(country.value / totalUsers * 100)}%</span>
                  </div>
                  <Progress 
                    value={Math.round(country.value / totalUsers * 100)} 
                    className="h-2" 
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center items-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Top Countries</p>
              <div className="space-y-4">
                {data.slice(0, 3).map((country, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mr-4">
                      <span className="text-2xl">{index + 1}</span>
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{country.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {country.value.toLocaleString()} users
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
