
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} CILS B2 Cittadinanza Question of the Day. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              La domanda del giorno
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
              Privacy Policy
            </Link>
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
              Dashboard
            </Link>
            <Link to="/flashcards" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
              Flashcards
            </Link>
            <Link to="/writing" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
              Writing
            </Link>
            <Link to="/listening" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
              Listening
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
