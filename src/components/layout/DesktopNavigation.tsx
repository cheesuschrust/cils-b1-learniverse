
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const DesktopNavigation = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Determine if we're on the landing page
  const isLandingPage = location.pathname === "/";
  
  return (
    <nav className="hidden md:flex items-center space-x-6">
      <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
        Home
      </Link>
      
      {isLandingPage && (
        <>
          <a href="#features" className="text-sm font-medium transition-colors hover:text-primary">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium transition-colors hover:text-primary">
            How It Works
          </a>
          <a href="#testimonials" className="text-sm font-medium transition-colors hover:text-primary">
            Testimonials
          </a>
        </>
      )}
      
      {!isLandingPage && (
        <>
          <Link to="/app/flashcards" className="text-sm font-medium transition-colors hover:text-primary">
            Flashcards
          </Link>
          <Link to="/app/multiple-choice" className="text-sm font-medium transition-colors hover:text-primary">
            Multiple Choice
          </Link>
          <Link to="/app/writing" className="text-sm font-medium transition-colors hover:text-primary">
            Writing
          </Link>
        </>
      )}
      
      <div className="flex items-center space-x-4">
        {user ? (
          <Link to="/app/profile">
            <Button variant="ghost" size="sm">
              My Profile
            </Button>
          </Link>
        ) : (
          <>
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button>Sign up</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default DesktopNavigation;
