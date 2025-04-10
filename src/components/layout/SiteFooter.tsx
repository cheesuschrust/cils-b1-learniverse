
import React from 'react';
import { Link } from 'react-router-dom';

export const SiteFooter: React.FC = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} CILS B1 Prep. All rights reserved.
          </p>
        </div>
        <div className="flex gap-4">
          <Link to="/terms" className="text-sm text-muted-foreground">
            Terms
          </Link>
          <Link to="/privacy" className="text-sm text-muted-foreground">
            Privacy
          </Link>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById('newsletter-subscription');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-sm text-muted-foreground"
          >
            Newsletter
          </a>
        </div>
      </div>
    </footer>
  );
};
