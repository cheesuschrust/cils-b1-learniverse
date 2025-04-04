
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ItalianCitizenshipTest = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Italian Citizenship Test Preparation</h1>
      
      <div className="flex items-center mb-6">
        <Badge variant="success" className="mr-2">CILS B1 Level</Badge>
        <span className="text-sm text-muted-foreground">Required for Italian citizenship</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Practice Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Take practice tests to prepare for your citizenship exam.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Study Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Access study materials to help you prepare for the test.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ItalianCitizenshipTest;
