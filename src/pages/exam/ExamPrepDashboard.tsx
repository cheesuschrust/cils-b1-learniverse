
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ExamPrepDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>CILS B1 Exam Preparation Dashboard</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">CILS B1 Exam Preparation</h1>
          <Button onClick={() => navigate('/study-plan')}>View Study Plan</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle>Listening</CardTitle>
              <CardDescription>Audio comprehension exercises</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">Practice understanding spoken Italian in various contexts</p>
              <Button variant="outline" className="w-full" onClick={() => navigate('/practice/listening')}>
                Start Practice
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle>Reading</CardTitle>
              <CardDescription>Text comprehension exercises</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">Improve your Italian reading skills with varied texts</p>
              <Button variant="outline" className="w-full" onClick={() => navigate('/practice/reading')}>
                Start Practice
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle>Writing</CardTitle>
              <CardDescription>Written expression exercises</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">Develop your Italian writing skills with guided exercises</p>
              <Button variant="outline" className="w-full" onClick={() => navigate('/practice/writing')}>
                Start Practice
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle>Speaking</CardTitle>
              <CardDescription>Oral expression exercises</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">Practice speaking Italian with interactive exercises</p>
              <Button variant="outline" className="w-full" onClick={() => navigate('/practice/speaking')}>
                Start Practice
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Mock Exams</CardTitle>
            <CardDescription>Practice with full-length CILS B1 exam simulations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6">Test your readiness with complete CILS B1 exam simulations that mirror the actual test format and timing.</p>
            <Button onClick={() => navigate('/mock-exam')}>Take Mock Exam</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExamPrepDashboard;
