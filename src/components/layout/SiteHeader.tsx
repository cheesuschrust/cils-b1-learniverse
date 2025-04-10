
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/EnhancedAuthContext';

export const SiteHeader: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 w-full border-b bg-background z-40">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block text-xl">CILS B1 Prep</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link to="/" className="flex items-center text-sm font-medium">
              Home
            </Link>
            <Link to="/about" className="flex items-center text-sm font-medium">
              About
            </Link>
            <Link to="/pricing" className="flex items-center text-sm font-medium">
              Pricing
            </Link>
            <Link to="/contact" className="flex items-center text-sm font-medium">
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" size="sm">Profile</Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/auth/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/auth/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
