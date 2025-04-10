
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet-async';
import { FileQuestion } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found | CILS B1 Italian Prep</title>
      </Helmet>
      <div className="container max-w-md mx-auto py-16 px-4 text-center">
        <FileQuestion className="h-20 w-20 mx-auto text-muted-foreground mb-6" />
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/support-center">Contact Support</Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default NotFound;
