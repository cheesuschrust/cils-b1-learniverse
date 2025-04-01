
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} CILS Question of the Day. All rights reserved.
          </p>
        </div>
        
        <div className="flex gap-6">
          <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">About</Link>
          <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy</Link>
          <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms</Link>
          <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
