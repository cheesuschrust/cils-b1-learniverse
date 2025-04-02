
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldX } from 'lucide-react';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <ShieldX className="h-12 w-12 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You don't have permission to access this page
        </p>
        
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button asChild>
            <Link to="/">Go to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
