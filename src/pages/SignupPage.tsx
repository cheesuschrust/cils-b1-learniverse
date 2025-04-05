
import React from 'react';
import { Card } from '@/components/ui/card';
import Signup from '@/pages/Signup';

const SignupPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <Signup />
      </Card>
    </div>
  );
};

export default SignupPage;
