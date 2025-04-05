
import React from 'react';
import { Card } from '@/components/ui/card';
import LoginForm from '@/pages/Login';

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <LoginForm />
      </Card>
    </div>
  );
};

export default LoginPage;
