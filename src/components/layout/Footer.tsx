
import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-slate-900 border-t py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <Logo />
            <p className="text-sm text-muted-foreground mt-2">
              Helping you achieve your Italian citizenship dream.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-medium mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link to="/app/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Dashboard</Link></li>
                <li><Link to="/app/flashcards" className="text-sm text-muted-foreground hover:text-foreground">Flashcards</Link></li>
                <li><Link to="/app/writing" className="text-sm text-muted-foreground hover:text-foreground">Writing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/app/guides" className="text-sm text-muted-foreground hover:text-foreground">Study Guides</Link></li>
                <li><Link to="/app/listening" className="text-sm text-muted-foreground hover:text-foreground">Listening</Link></li>
                <li><Link to="/app/multiple-choice" className="text-sm text-muted-foreground hover:text-foreground">Practice Tests</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
                <li><Link to="/support" className="text-sm text-muted-foreground hover:text-foreground">Support</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {currentYear} CILS B2 Cittadinanza. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
