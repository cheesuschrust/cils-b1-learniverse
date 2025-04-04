
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">ItalianMaster</h3>
            <p className="text-sm text-muted-foreground">
              Learn Italian for citizenship and everyday use with our comprehensive platform.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/speaking" className="text-sm text-muted-foreground hover:text-primary">
                  Speaking Practice
                </Link>
              </li>
              <li>
                <Link to="/italian-citizenship-test" className="text-sm text-muted-foreground hover:text-primary">
                  Citizenship Test
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-sm text-muted-foreground hover:text-primary">
                  Support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Contact</h4>
            <p className="text-sm text-muted-foreground">
              Email: info@italianmaster.com<br />
              Phone: +1 (555) 123-4567
            </p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ItalianMaster. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
