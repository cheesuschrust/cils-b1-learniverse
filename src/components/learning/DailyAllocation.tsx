
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle2, AlertCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ItalianTestSection } from "@/types/italian-types";

interface DailyAllocationProps {
  userType: "free" | "premium";
  allocatedToday: {
    section: ItalianTestSection;
    completed: boolean;
    available: boolean;
    confidence: number;
  }[];
  onStartExercise: (section: ItalianTestSection) => void;
  resetTime?: Date;
}

const DailyAllocation: React.FC<DailyAllocationProps> = ({
  userType,
  allocatedToday,
  onStartExercise,
  resetTime
}) => {
  // Calculate time remaining until reset
  const getTimeRemaining = (): string => {
    if (!resetTime) return "";
    
    const now = new Date();
    const timeDiff = resetTime.getTime() - now.getTime();
    
    if (timeDiff <= 0) return "Available now";
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m until reset`;
  };
  
  // Calculate completion percentage
  const completionPercentage = Math.round(
    (allocatedToday.filter(item => item.completed).length / allocatedToday.length) * 100
  );
  
  const isPremium = userType === "premium";
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Daily Questions</CardTitle>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>{getTimeRemaining()}</span>
          </div>
        </div>
        <Progress
          value={completionPercentage}
          max={100}
          className="h-1 my-2"
        />
        <p className="text-xs text-muted-foreground">
          {allocatedToday.filter(item => item.completed).length} of {allocatedToday.length} completed today
          {!isPremium && " (Free plan limit: 1 per day)"}
        </p>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {allocatedToday.map((item, index) => (
            <div 
              key={index}
              className={`flex items-center justify-between p-2 rounded-md border ${
                item.completed ? "bg-muted/30" : 
                !item.available && !isPremium ? "bg-muted/10" : ""
              }`}
            >
              <div className="flex items-center">
                {item.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                ) : !item.available && !isPremium ? (
                  <Lock className="h-4 w-4 text-muted-foreground mr-2" />
                ) : (
                  <div className="h-4 w-4 border border-muted-foreground rounded-full mr-2" />
                )}
                <div>
                  <p className="text-sm font-medium capitalize">{item.section}</p>
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-muted-foreground">
                      Confidence: {item.confidence}%
                    </p>
                    {item.confidence < 70 && (
                      <AlertCircle className="h-3 w-3 text-amber-500" />
                    )}
                  </div>
                </div>
              </div>
              
              <Button
                variant={item.completed ? "outline" : "default"}
                size="sm"
                onClick={() => onStartExercise(item.section)}
                disabled={!item.available && !isPremium}
              >
                {item.completed ? "Review" : "Start"}
              </Button>
            </div>
          ))}
        </div>
        
        {!isPremium && (
          <div className="mt-4 bg-primary/5 p-3 rounded-md border border-primary/20">
            <h4 className="text-sm font-medium flex items-center">
              <Lock className="h-3 w-3 mr-1" /> 
              Premium Access
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              Upgrade to unlock unlimited daily questions across all categories
            </p>
            <Button variant="default" size="sm" className="w-full mt-2">
              Upgrade to Premium
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyAllocation;
