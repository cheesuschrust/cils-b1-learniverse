
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Card } from '@/components/ui/card';

const AuthLayout: React.FC = () => {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <Outlet />
      </Card>
    </div>
  );
};

export default AuthLayout;
