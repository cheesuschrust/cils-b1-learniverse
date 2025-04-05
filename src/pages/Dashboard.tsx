
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">CILS B1 Italian Citizenship Dashboard</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Citizenship Test Preparation</CardTitle>
            <CardDescription>Practice for your citizenship test</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Prepare for your CILS B1 Citizenship test with targeted practice questions.</p>
            <Button onClick={() => navigate('/citizenship-test')}>Start Practice</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Flashcards</CardTitle>
            <CardDescription>Learn Italian vocabulary</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Study Italian words and phrases using our spaced repetition system.</p>
            <Button variant="outline">Coming Soon</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progress Tracking</CardTitle>
            <CardDescription>Monitor your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Track your progress and see how you're improving over time.</p>
            <Button variant="outline">Coming Soon</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
