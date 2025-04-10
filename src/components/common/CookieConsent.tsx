
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem('cookie-consent');
    if (!hasAccepted) {
      setVisible(true);
    }
  }, []);
  
  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  };
  
  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setVisible(false);
  };
  
  if (!visible) {
    return null;
  }
  
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 bg-background border-t shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="mb-4 md:mb-0 md:mr-4 pr-8">
          <h2 className="text-lg font-semibold mb-1">We value your privacy</h2>
          <p className="text-sm text-muted-foreground">
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. 
            By clicking "Accept All", you consent to our use of cookies. Read our{' '}
            <Link to="/privacy-policy" className="underline hover:text-primary">
              Privacy Policy
            </Link>{' '}
            to learn more.
          </p>
        </div>
        <div className="flex flex-shrink-0 gap-2">
          <Button variant="outline" onClick={declineCookies}>
            Decline
          </Button>
          <Button onClick={acceptCookies}>
            Accept All
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={declineCookies} 
            className="absolute top-2 right-2 md:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
