
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SpeakingPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Italian Speaking Practice</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Speaking Exercise</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Practice your Italian speaking skills. Content will be available soon.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpeakingPage;
