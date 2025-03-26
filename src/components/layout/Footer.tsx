
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Learning App</h3>
            <p className="text-muted-foreground">
              Your personalized language learning companion for mastering Italian through AI-powered exercises.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Learning</h4>
            <ul className="space-y-2">
              <li><Link to="/flashcards" className="text-muted-foreground hover:text-foreground">Flashcards</Link></li>
              <li><Link to="/multiple-choice" className="text-muted-foreground hover:text-foreground">Multiple Choice</Link></li>
              <li><Link to="/listening" className="text-muted-foreground hover:text-foreground">Listening Practice</Link></li>
              <li><Link to="/speaking" className="text-muted-foreground hover:text-foreground">Speaking Practice</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Account</h4>
            <ul className="space-y-2">
              <li><Link to="/profile" className="text-muted-foreground hover:text-foreground">Profile</Link></li>
              <li><Link to="/settings" className="text-muted-foreground hover:text-foreground">Settings</Link></li>
              <li><Link to="/subscription" className="text-muted-foreground hover:text-foreground">Subscription</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-muted-foreground hover:text-foreground">Help Center</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact Us</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Learning App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
