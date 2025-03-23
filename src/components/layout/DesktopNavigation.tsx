
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const DesktopNavigation = () => {
  return (
    <nav className="hidden md:flex items-center space-x-6">
      <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
        Home
      </Link>
      <Link to="#features" className="text-sm font-medium transition-colors hover:text-primary">
        Features
      </Link>
      <Link to="#how-it-works" className="text-sm font-medium transition-colors hover:text-primary">
        How It Works
      </Link>
      <Link to="#testimonials" className="text-sm font-medium transition-colors hover:text-primary">
        Testimonials
      </Link>
      
      <div className="flex items-center space-x-4">
        <Link to="/login">
          <Button variant="ghost" size="sm">
            Login
          </Button>
        </Link>
        <Link to="/signup">
          <Button>Sign up</Button>
        </Link>
      </div>
    </nav>
  );
};

export default DesktopNavigation;
