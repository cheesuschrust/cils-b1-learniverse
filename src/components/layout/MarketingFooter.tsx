
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Instagram, Linkedin, Mail, ArrowRight } from 'lucide-react';
import NewsletterSubscription from '@/components/marketing/NewsletterSubscription';

const MarketingFooter: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Information */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center">
              <span className="font-bold text-2xl">CILS<span className="text-primary">Prep</span></span>
            </Link>
            <p className="mt-4 text-gray-600">
              The leading platform for CILS B1 Italian citizenship test preparation. 
              Personalized learning for citizenship success.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-base font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/features" className="text-gray-600 hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/support-center" className="text-gray-600 hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/auth/register" className="text-gray-600 hover:text-primary transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="lg:col-span-1">
            <h3 className="text-base font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/support-center" className="text-gray-600 hover:text-primary transition-colors">
                  CILS Exam Guide
                </Link>
              </li>
              <li>
                <Link to="/support-center" className="text-gray-600 hover:text-primary transition-colors">
                  Citizenship Requirements
                </Link>
              </li>
              <li>
                <Link to="/support-center" className="text-gray-600 hover:text-primary transition-colors">
                  Italian Study Tips
                </Link>
              </li>
              <li>
                <Link to="/support-center" className="text-gray-600 hover:text-primary transition-colors">
                  Practice Tests
                </Link>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-600 hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Blog <ArrowRight className="h-3 w-3 inline ml-1" />
                </a>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="text-base font-semibold mb-4">Get Italian Tips</h3>
            <NewsletterSubscription compact />
            <p className="text-xs text-gray-500 mt-2">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} CILSPrep. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy-policy" className="text-gray-500 text-sm hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-gray-500 text-sm hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookie-policy" className="text-gray-500 text-sm hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MarketingFooter;
