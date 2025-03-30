
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PremiumUpgradeProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PremiumUpgrade: React.FC<PremiumUpgradeProps> = ({ onSuccess, onCancel }) => {
  const navigate = useNavigate();
  
  const handleUpgrade = () => {
    // This would initiate the payment process in a real app
    navigate('/pricing');
    onSuccess?.();
  };
  
  const features = [
    "Unlimited practice questions across all sections",
    "All CILS B1 practice exams (5+ full exams)",
    "Personalized AI study assistant",
    "Advanced analytics and progress tracking",
    "Downloadable study materials and guides",
    "Priority feedback on writing and speaking exercises",
    "Ad-free learning experience"
  ];

  return (
    <div className="text-center p-4">
      <Zap className="w-12 h-12 mx-auto text-primary" />
      <h3 className="text-2xl font-bold mt-4">Upgrade to Premium</h3>
      <p className="text-muted-foreground mt-2 mb-6">
        Unlock the full potential of your CILS B1 preparation
      </p>
      
      <div className="bg-muted p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 gap-2 text-left">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="text-3xl font-bold">€9.99<span className="text-muted-foreground text-base font-normal">/month</span></div>
          <div className="text-xs text-muted-foreground">Cancel anytime</div>
        </div>
        
        <Button 
          className="w-full"
          onClick={handleUpgrade}
        >
          <Zap className="mr-2 h-4 w-4" />
          Upgrade Now
        </Button>
        
        <Button 
          variant="ghost"
          className="w-full text-muted-foreground"
          onClick={onCancel}
        >
          Maybe Later
        </Button>
      </div>
      
      <div className="mt-4 text-xs text-muted-foreground">
        By upgrading, you agree to our Terms of Service and Privacy Policy
      </div>
    </div>
  );
};

export default PremiumUpgrade;
