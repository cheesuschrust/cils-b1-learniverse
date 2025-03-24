
import React from 'react';
import { Link } from 'react-router-dom';
import { Languages, Mail, Github, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <Languages className="h-6 w-6" />
              <span className="font-bold text-xl">LinguaLearn</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your interactive Italian language learning platform with AI-powered exercises and comprehensive resources.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Learn</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/activities/flashcards" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Flashcards
              </Link>
              <Link to="/activities/multiple-choice" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Multiple Choice
              </Link>
              <Link to="/activities/reading" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Reading Comprehension
              </Link>
              <Link to="/activities/writing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Writing Practice
              </Link>
              <Link to="/activities/speaking" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Speaking Exercises
              </Link>
              <Link to="/activities/listening" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Listening Practice
              </Link>
            </nav>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Company</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </Link>
              <Link to="/team" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Our Team
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
              <Link to="/careers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Careers
              </Link>
            </nav>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Legal</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
              <div className="mt-4 flex items-center gap-4">
                <a href="mailto:contact@example.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </nav>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LinguaLearn. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/sitemap" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sitemap
            </Link>
            <Link to="/accessibility" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
