
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsOfService = () => {
  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Terms of Service</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p>This page contains the Terms of Service for the application.</p>
            {/* Terms content would go here */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsOfService;
