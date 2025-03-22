
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Info, X } from "lucide-react";

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem("cookieConsent");
    if (!hasConsent) {
      setShowConsent(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cookieConsent", "all");
    setShowConsent(false);
  };

  const acceptEssential = () => {
    localStorage.setItem("cookieConsent", "essential");
    setShowConsent(false);
  };

  const openSettings = () => {
    // In a real app, this would open detailed cookie settings
    console.log("Open cookie settings");
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-2">
            <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-sm font-medium">We value your privacy</h3>
              <p className="text-xs text-muted-foreground mt-1">
                This website uses cookies to enhance your experience, analyze site traffic, 
                and for our marketing purposes. You can choose to accept all cookies or only essential ones.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 ml-7 md:ml-0">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs" 
              onClick={openSettings}
            >
              <Info className="mr-1 h-3 w-3" />
              Cookie Policy
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs" 
              onClick={acceptEssential}
            >
              Accept Essential
            </Button>
            <Button 
              size="sm" 
              className="text-xs" 
              onClick={acceptAll}
            >
              Accept All
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute top-2 right-2 h-6 w-6 p-0" 
            onClick={acceptEssential}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
