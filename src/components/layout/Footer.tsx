
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/50 py-10 mt-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">CILS B1 Cittadinanza</h3>
            <p className="text-sm text-muted-foreground">
              Daily practice to prepare for your Italian citizenship test
            </p>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-italian-green"></div>
              <div className="w-4 h-4 bg-italian-white border border-gray-200"></div>
              <div className="w-4 h-4 bg-italian-red"></div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4">Study</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/flashcards" className="text-muted-foreground hover:text-primary transition-colors">
                  Flashcards
                </Link>
              </li>
              <li>
                <Link to="/multiple-choice" className="text-muted-foreground hover:text-primary transition-colors">
                  Multiple Choice
                </Link>
              </li>
              <li>
                <Link to="/listening" className="text-muted-foreground hover:text-primary transition-colors">
                  Listening Practice
                </Link>
              </li>
              <li>
                <Link to="/writing" className="text-muted-foreground hover:text-primary transition-colors">
                  Writing Practice
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-muted-foreground hover:text-primary transition-colors">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.interno.gov.it/it/temi/cittadinanza-e-altri-diritti-civili/cittadinanza"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Official Citizenship Info
                </a>
              </li>
              <li>
                <a
                  href="https://www.unistrasi.it/1/558/3889/CILS_-_Certificazione_di_Italiano_come_Lingua_Straniera.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  CILS Certification
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} CILS B1 Cittadinanza. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
