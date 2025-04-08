
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const CookieConsentBanner: React.FC = () => {
  const [cookieConsent, setCookieConsent] = useLocalStorage<'accepted' | 'rejected' | null>('cookie-consent', null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Show banner after a short delay if consent hasn't been given
    if (cookieConsent === null) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [cookieConsent]);
  
  const handleAccept = () => {
    setCookieConsent('accepted');
    setIsVisible(false);
  };
  
  const handleReject = () => {
    setCookieConsent('rejected');
    setIsVisible(false);
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <Card className="mx-auto max-w-4xl shadow-lg">
        <CardContent className="p-4 md:p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold mb-2">🍪 We use cookies</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Our website uses cookies to improve your experience. By continuing to use our site, you consent to our use of cookies in accordance with our
                <Link to="/cookies" className="text-primary hover:underline mx-1">Cookie Policy</Link>
                and
                <Link to="/privacy" className="text-primary hover:underline mx-1">Privacy Policy</Link>.
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-full" 
              onClick={handleReject}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 px-4 pb-4 md:px-6 md:pb-6">
          <Button variant="outline" onClick={handleReject}>
            Reject All
          </Button>
          <Button variant="default" onClick={handleAccept}>
            Accept All
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CookieConsentBanner;
