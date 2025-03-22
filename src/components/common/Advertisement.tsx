
import React, { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface AdvertisementProps {
  position?: "top" | "bottom" | "inline";
  size?: "small" | "medium" | "large";
}

const Advertisement: React.FC<AdvertisementProps> = ({ 
  position = "inline", 
  size = "medium" 
}) => {
  const { user } = useAuth();
  const [isDismissed, setIsDismissed] = useState(false);
  
  // Don't show ads for premium users
  if (!user || user.subscription === "premium" || isDismissed) {
    return null;
  }
  
  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "fixed top-0 left-0 right-0 z-50 border-b";
      case "bottom":
        return "fixed bottom-0 left-0 right-0 z-50 border-t";
      case "inline":
      default:
        return "relative my-4 rounded-lg border";
    }
  };
  
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "h-20";
      case "large":
        return "h-48";
      case "medium":
      default:
        return "h-32";
    }
  };
  
  const getAdContent = () => {
    // Simplified ad content - in a real app, this would be dynamic content from an ad provider
    const adTypes = [
      {
        title: "Upgrade to Premium",
        description: "Get unlimited questions and remove ads",
        cta: "Learn More",
        bgColor: "bg-gradient-to-r from-purple-500 to-indigo-500",
      },
      {
        title: "Practice Daily",
        description: "Consistent learning brings faster results",
        cta: "Upgrade Now",
        bgColor: "bg-gradient-to-r from-amber-500 to-orange-500",
      },
      {
        title: "Master Italian",
        description: "Unlock full course material with Premium",
        cta: "Go Premium",
        bgColor: "bg-gradient-to-r from-emerald-500 to-teal-500",
      },
    ];
    
    // Pick a random ad
    const randomAd = adTypes[Math.floor(Math.random() * adTypes.length)];
    
    return (
      <div className={`flex flex-col sm:flex-row items-center justify-between p-4 ${randomAd.bgColor} text-white`}>
        <div>
          <h3 className="font-bold">{randomAd.title}</h3>
          <p className="text-sm opacity-90">{randomAd.description}</p>
        </div>
        <div className="mt-3 sm:mt-0">
          <Button size="sm" variant="outline" className="bg-white/20 hover:bg-white/30 text-white border-white/40">
            {randomAd.cta}
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <div className={`${getPositionClasses()} ${getSizeClasses()} overflow-hidden bg-background shadow-md`}>
      {position === "inline" && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-1 right-1 h-6 w-6 z-10" 
          onClick={() => setIsDismissed(true)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <div className="h-full flex items-center justify-center">
        {getAdContent()}
      </div>
      <div className="absolute bottom-0 right-0 bg-background/80 text-xs px-1 rounded-tl">
        Advertisement
      </div>
    </div>
  );
};

export default Advertisement;
