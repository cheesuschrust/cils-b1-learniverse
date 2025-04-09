
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const MockExamPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>CILS B1 Mock Exam | Italian Language Practice</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">CILS B1 Mock Exam</h1>
          <p className="text-muted-foreground">
            Complete test simulation
          </p>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Mock Exam Information</CardTitle>
            <CardDescription>
              Prepare for your CILS B1 certification with our comprehensive mock exam
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">This mock exam simulates the official CILS B1 certification test with accurate timing and question formats for all sections:</p>
            
            <ul className="list-disc list-inside space-y-2 mb-6">
              <li>Listening Comprehension (30 minutes)</li>
              <li>Reading Comprehension (50 minutes)</li>
              <li>Writing Exercises (60 minutes)</li>
              <li>Speaking Assessment (10 minutes)</li>
            </ul>
            
            <p className="font-medium mb-6">Total duration: approximately 2.5 hours</p>
            
            <div className="flex items-center justify-between bg-muted p-4 rounded-md mb-6">
              <div>
                <p className="font-medium">Ready to start your mock exam?</p>
                <p className="text-sm text-muted-foreground">Make sure you have a quiet environment and enough time</p>
              </div>
              <Button>Begin Mock Exam</Button>
            </div>
            
            <p className="text-sm text-muted-foreground">Note: You can also practice each section separately through the Exam Preparation Dashboard.</p>
          </CardContent>
        </Card>
        
        <div className="bg-muted p-8 rounded-lg text-center">
          <p className="text-lg mb-4">Full mock exam functionality is currently being developed.</p>
          <p>Check back soon for complete CILS B1 exam simulations!</p>
        </div>
      </div>
    </div>
  );
};

export default MockExamPage;
