
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const AuthLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  // If user is already logged in, show a message
  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="w-full max-w-md rounded-lg border bg-card shadow-sm p-8 space-y-6">
          <h1 className="text-2xl font-semibold text-center">You're Already Logged In</h1>
          <p className="text-center text-muted-foreground">
            You are currently logged in as {user.email}.
          </p>
          <div className="flex justify-center space-x-4">
            <Button asChild variant="default">
              <Link to="/">Go to Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">Italian Learning</Link>
          <nav>
            {isLoginPage ? (
              <Link to="/signup">
                <Button variant="outline">Sign Up</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="outline">Log In</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <Outlet />
      </main>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Italian Learning App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
