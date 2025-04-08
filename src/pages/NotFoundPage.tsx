
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <h1 className="text-6xl font-bold mb-6">404</h1>
      <h2 className="text-2xl font-medium mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link to="/">Return Home</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
