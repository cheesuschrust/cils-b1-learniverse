
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>Dashboard | CILS B1 Italian Citizenship Test</title>
      </Helmet>
      
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2"><strong>Email:</strong> {user?.email}</p>
              <p className="mb-4"><strong>User ID:</strong> {user?.id.substring(0, 8)}...</p>
              <Button variant="outline" onClick={handleLogout}>Sign Out</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Study Progress</CardTitle>
              <CardDescription>Your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <p>You haven't started any courses yet.</p>
              <Button className="mt-4" onClick={() => navigate('/courses')}>
                Browse Courses
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Daily Challenge</CardTitle>
              <CardDescription>Test your knowledge daily</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Complete today's challenge to maintain your streak!</p>
              <Button className="mt-4">
                Start Today's Challenge
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
