
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface ProgressCardProps {
  title: string;
  value: number;
  maxValue: number;
  icon: React.ReactNode;
  color?: string;
  className?: string;
  onClick?: () => void;
  description?: string;
  targetScore?: number;
  trend?: "up" | "down" | "stable";
  remainingExercises?: number;
}

const ProgressCard = ({
  title,
  value,
  maxValue,
  icon,
  color = "bg-primary",
  className,
  onClick,
  description,
  targetScore = 70, // CILS B1 passing threshold
  trend,
  remainingExercises,
}: ProgressCardProps) => {
  const percentage = Math.min(Math.round((value / maxValue) * 100), 100);
  const isPassing = percentage >= targetScore;
  
  const getTrendIcon = () => {
    if (!trend) return null;
    
    return trend === "up" ? (
      <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
      </svg>
    ) : trend === "down" ? (
      <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
      </svg>
    ) : (
      <svg className="w-3 h-3 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14"></path>
      </svg>
    );
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md",
        onClick ? "cursor-pointer" : "",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>{title}</span>
            {isPassing ? (
              <Badge className="bg-green-500 text-xs">Passing</Badge>
            ) : (
              <Badge className="bg-amber-500 text-xs">In Progress</Badge>
            )}
          </CardTitle>
          <span className="text-sm text-muted-foreground font-normal">
            {value}/{maxValue}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="p-2 rounded-full bg-accent/50">{icon}</div>
          <div className="w-full space-y-1">
            <div className="h-2 rounded-full bg-muted w-full">
              <div
                className={cn("h-full rounded-full transition-all duration-500", 
                  isPassing ? "bg-green-500" : "bg-amber-500")}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-xs">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                {percentage}% Complete
                {getTrendIcon()}
              </p>
              
              {targetScore && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        Target: {targetScore}% <Info className="h-3 w-3" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>CILS B1 requires {targetScore}% to pass this section</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            
            {description && (
              <p className="text-xs text-muted-foreground mt-2">{description}</p>
            )}
            
            {remainingExercises !== undefined && (
              <p className="text-xs text-muted-foreground mt-1">
                {remainingExercises > 0 
                  ? `${remainingExercises} exercises remaining today` 
                  : "All exercises completed for today"}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
