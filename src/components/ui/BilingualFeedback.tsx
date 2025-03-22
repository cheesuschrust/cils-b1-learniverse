
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Globe, Languages } from "lucide-react";

interface BilingualFeedbackProps {
  english: string;
  italian: string;
  detailed?: boolean;
}

export const BilingualFeedback: React.FC<BilingualFeedbackProps> = ({
  english,
  italian,
  detailed = false,
}) => {
  const { user, updateProfile } = useAuth();
  const preferredLanguage = user?.preferredLanguage || "both";
  
  const toggleLanguage = () => {
    if (!user) return;
    
    const newPreference = 
      preferredLanguage === "english" ? "italian" : 
      preferredLanguage === "italian" ? "both" : "english";
      
    updateProfile({ preferredLanguage: newPreference });
  };
  
  const getButtonText = () => {
    switch (preferredLanguage) {
      case "english": return "Show Italian";
      case "italian": return "Show Both";
      case "both": return "Show English";
      default: return "Language";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-medium flex items-center">
          <Languages className="h-4 w-4 mr-2 text-primary" />
          Feedback
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleLanguage}
          className="flex items-center gap-1 text-xs"
        >
          <Globe className="h-3 w-3" />
          {getButtonText()}
        </Button>
      </div>
      
      <div className="space-y-2">
        {(preferredLanguage === "english" || preferredLanguage === "both") && (
          <div className="p-3 bg-secondary/30 rounded-lg">
            <p className="text-sm">{english}</p>
          </div>
        )}
        
        {(preferredLanguage === "italian" || preferredLanguage === "both") && (
          <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
            <p className="text-sm italic">{italian}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BilingualFeedback;
