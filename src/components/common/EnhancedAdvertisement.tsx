
import React, { useState, useEffect } from "react";
import { X, Info, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Advertisement, AdPosition, AdSize } from "@/types/advertisement";
import AdService from "@/services/AdService";
import { Badge } from "@/components/ui/badge";

interface EnhancedAdvertisementProps {
  position?: AdPosition;
  size?: AdSize;
  className?: string;
  showCloseButton?: boolean;
}

const EnhancedAdvertisement: React.FC<EnhancedAdvertisementProps> = ({ 
  position = "inline", 
  size = "medium",
  className = "",
  showCloseButton = true
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load ad on component mount
  useEffect(() => {
    const loadAd = () => {
      if (isDismissed) return;
      
      setIsLoading(true);
      try {
        const advertisement = AdService.getAdvertisement(position, size, user || undefined);
        setAd(advertisement);
      } catch (error) {
        console.error("Error loading advertisement:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAd();
    
    // Refresh ad every minute (in a real implementation, this would be more sophisticated)
    const intervalId = setInterval(loadAd, 60000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [position, size, user, isDismissed]);
  
  // Don't show ads for premium users (unless configured otherwise in the admin panel)
  if (isDismissed || isLoading || !ad) {
    return null;
  }
  
  const handleClick = () => {
    // Track the click
    AdService.trackClick(ad.id);
    
    // In a real implementation, we would navigate to the ad destination
    // For now, we'll just show a toast and open the link in a new tab
    toast({
      title: "Ad Clicked",
      description: `You clicked on: ${ad.content.title || ad.name}`,
      variant: "default",
    });
    
    // Open the link in a new tab
    window.open(ad.content.linkUrl, "_blank");
  };
  
  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
    
    toast({
      title: "Ad Dismissed",
      description: "You won't see this ad again for a while.",
      variant: "default",
    });
  };
  
  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "fixed top-0 left-0 right-0 z-50 border-b";
      case "bottom":
        return "fixed bottom-0 left-0 right-0 z-50 border-t";
      case "sidebar":
        return "relative rounded-lg border my-4";
      case "inline":
      default:
        return "relative rounded-lg border my-4";
    }
  };
  
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "min-h-20";
      case "large":
        return "min-h-48";
      case "medium":
      default:
        return "min-h-32";
    }
  };
  
  return (
    <Card 
      className={`overflow-hidden bg-background shadow-md hover:shadow-lg transition-shadow ${getPositionClasses()} ${getSizeClasses()} ${className}`}
      onClick={handleClick}
    >
      <CardContent className="p-0 h-full cursor-pointer">
        {showCloseButton && position === "inline" && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-1 right-1 h-6 w-6 z-10 bg-background/80 backdrop-blur-sm" 
            onClick={handleDismiss}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        
        <div className="h-full flex flex-col relative">
          {/* Ad Content */}
          {ad.format === "banner" && (
            <div className={`flex flex-col h-full ${ad.content.imageUrl ? 'bg-gradient-to-r from-primary/10 to-primary/5' : 'bg-muted'}`}>
              {ad.content.imageUrl && (
                <div 
                  className="absolute inset-0 bg-center bg-cover opacity-20"
                  style={{ backgroundImage: `url(${ad.content.imageUrl})` }}
                />
              )}
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 z-10 h-full">
                <div className="text-center sm:text-left mb-2 sm:mb-0">
                  <h3 className="font-bold text-lg">{ad.content.title}</h3>
                  <p className="text-sm opacity-90">{ad.content.description}</p>
                </div>
                
                <Button 
                  size="sm" 
                  className="whitespace-nowrap" 
                  onClick={(e) => { 
                    e.stopPropagation();
                    handleClick();
                  }}
                >
                  {ad.content.buttonText || "Learn More"}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
          
          {ad.format === "native" && (
            <div className="flex flex-col sm:flex-row h-full">
              {ad.content.imageUrl && (
                <div 
                  className="w-full sm:w-1/3 h-24 sm:h-full bg-center bg-cover"
                  style={{ backgroundImage: `url(${ad.content.imageUrl})` }}
                />
              )}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <Badge variant="outline" className="mb-2">Sponsored</Badge>
                  <h3 className="font-bold">{ad.content.title}</h3>
                  <p className="text-sm text-muted-foreground">{ad.content.description}</p>
                </div>
                <div className="mt-2 text-right">
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="p-0 h-auto" 
                    onClick={(e) => { 
                      e.stopPropagation();
                      handleClick();
                    }}
                  >
                    {ad.content.buttonText || "Learn More"}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Ad Label */}
          <div className="absolute bottom-0 right-0 bg-background/80 text-xs px-1 py-0.5 rounded-tl">
            <span className="flex items-center">
              <Info className="h-3 w-3 mr-1 opacity-70" />
              Advertisement
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedAdvertisement;
