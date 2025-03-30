
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Zap } from "lucide-react";

interface PremiumUpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgrade: () => void;
}

const PremiumUpgradeModal: React.FC<PremiumUpgradeModalProps> = ({
  open,
  onOpenChange,
  onUpgrade,
}) => {
  const features = [
    "Unlimited practice questions across all CILS B1 exam sections",
    "Access to 5+ complete CILS B1 practice exams",
    "Personalized AI Italian tutor for conversation practice",
    "Detailed performance analytics and progress tracking",
    "Downloadable study materials and exam guides",
    "Priority feedback on writing and speaking exercises",
    "Ad-free learning experience"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription>
            Unlock the full potential of your CILS B1 preparation
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-muted p-4 rounded-lg my-4">
          <div className="grid grid-cols-1 gap-2 text-left">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center my-4">
          <div className="text-3xl font-bold">€9.99<span className="text-muted-foreground text-base font-normal">/month</span></div>
          <div className="text-xs text-muted-foreground">Cancel anytime</div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            Maybe Later
          </Button>
          <Button 
            className="w-full sm:w-auto"
            onClick={onUpgrade}
          >
            <Zap className="mr-2 h-4 w-4" />
            Upgrade Now
          </Button>
        </DialogFooter>
        
        <div className="mt-4 text-xs text-center text-muted-foreground">
          By upgrading, you agree to our Terms of Service and Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumUpgradeModal;
