
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Facebook, Instagram, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <span className="text-xl font-bold">CILS<span className="text-primary">B1</span></span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Your comprehensive platform for preparing for the CILS B1 Italian language exam required for citizenship.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-base mb-3">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary">Blog</Link>
              </li>
              <li>
                <Link to="/resources/cils-exam-guide" className="text-muted-foreground hover:text-primary">CILS Exam Guide</Link>
              </li>
              <li>
                <Link to="/resources/italian-grammar" className="text-muted-foreground hover:text-primary">Italian Grammar</Link>
              </li>
              <li>
                <Link to="/resources/vocabulary-lists" className="text-muted-foreground hover:text-primary">Vocabulary Lists</Link>
              </li>
              <li>
                <Link to="/resources/practice-tests" className="text-muted-foreground hover:text-primary">Practice Tests</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-base mb-3">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary">About Us</Link>
              </li>
              <li>
                <Link to="/careers" className="text-muted-foreground hover:text-primary">Careers</Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary">Contact Us</Link>
              </li>
              <li>
                <Link to="/support-center" className="text-muted-foreground hover:text-primary">Support Center</Link>
              </li>
              <li>
                <Link to="/affiliates" className="text-muted-foreground hover:text-primary">Affiliate Program</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-base mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-muted-foreground hover:text-primary">Cookie Policy</Link>
              </li>
              <li>
                <Link to="/gdpr" className="text-muted-foreground hover:text-primary">GDPR Compliance</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} CILS B1 Learniverse. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <a href="mailto:support@cilsb1.com" className="text-sm text-muted-foreground hover:text-primary flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              support@cilsb1.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
