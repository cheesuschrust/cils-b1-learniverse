
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Italian Learning Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Track your daily learning progress here.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Practice Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Choose from various practice areas to improve your Italian.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Citizenship Test</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Prepare for your Italian citizenship test.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
