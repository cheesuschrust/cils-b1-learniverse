
import React from 'react';
import { PieChart } from '@/components/ui/charts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Users, Activity, DollarSign, BarChart2, PieChart as PieChartIcon } from 'lucide-react';

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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-muted-foreground mr-2" />
              <div>
                <div className="text-2xl font-bold">12,345</div>
                <p className="text-xs text-muted-foreground">+12.5% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-muted-foreground mr-2" />
              <div>
                <div className="text-2xl font-bold">8,763</div>
                <p className="text-xs text-muted-foreground">+5.2% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Content Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-muted-foreground mr-2" />
              <div>
                <div className="text-2xl font-bold">5,246</div>
                <p className="text-xs text-muted-foreground">+18.4% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-muted-foreground mr-2" />
              <div>
                <div className="text-2xl font-bold">$24,568</div>
                <p className="text-xs text-muted-foreground">+8.7% from last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="ai">AI Usage</TabsTrigger>
        </TabsList>
      
        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Breakdown by subscription type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <PieChart
                    data={userData}
                    index="name"
                    category="value"
                    colors={["slate", "blue", "amber"]}
                    valueFormatter={(value) => `${value}%`}
                    className="h-80"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Geographical Distribution</CardTitle>
                <CardDescription>User location by country</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <PieChart
                    data={locationData}
                    index="name"
                    category="value"
                    colors={["blue", "green", "amber", "red", "purple", "slate"]}
                    valueFormatter={(value) => `${value}%`}
                    className="h-80"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAnalyticsDashboard;
