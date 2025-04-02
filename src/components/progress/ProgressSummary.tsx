
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BadgeCheck, AlertTriangle, Headphones, Book, Pen, Mic } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProgressSummaryProps {
  overall: number;
  targetScore: number;
  sections: {
    name: string;
    score: number;
    icon: React.ReactNode;
    trend?: "up" | "down" | "stable";
    recentActivity?: number;
  }[];
  daysToExam?: number;
  estimatedReadiness?: number;
  userRank?: { percentile: number; totalUsers: number };
}

const ProgressSummary: React.FC<ProgressSummaryProps> = ({ 
  overall, 
  targetScore,
  sections,
  daysToExam,
  estimatedReadiness,
  userRank
}) => {
  const isPassing = overall >= targetScore;
  const remainingToTarget = isPassing ? 0 : targetScore - overall;
  
  // Generate section icons based on section name
  const getSectionIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'listening':
        return <Headphones className="h-5 w-5 text-blue-500" />;
      case 'reading':
        return <Book className="h-5 w-5 text-green-500" />;
      case 'writing':
        return <Pen className="h-5 w-5 text-amber-500" />;
      case 'speaking':
        return <Mic className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };
  
  // Calculate trend indicators
  const getTrendIndicator = (trend?: "up" | "down" | "stable") => {
    if (!trend) return null;
    
    return (
      <span className={`text-xs flex items-center ml-1 ${
        trend === 'up' ? 'text-green-500' : 
        trend === 'down' ? 'text-red-500' : 'text-yellow-500'
      }`}>
        {trend === 'up' && '↑'}
        {trend === 'down' && '↓'}
        {trend === 'stable' && '→'}
      </span>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <span className="text-3xl font-bold">{overall}%</span>
          <span className="text-muted-foreground ml-2">Overall Score</span>
          {isPassing ? (
            <BadgeCheck className="ml-2 h-6 w-6 text-green-500" />
          ) : (
            <AlertTriangle className="ml-2 h-6 w-6 text-amber-500" />
          )}
        </div>
        
        <Progress
          value={overall}
          max={100}
          className="h-3 w-full"
          indicatorClassName={isPassing ? "bg-green-500" : "bg-amber-500"}
        />
        
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-muted-foreground">0%</span>
          <div className="flex items-center gap-1">
            <span className={isPassing ? "text-green-500" : "text-amber-500"}>{targetScore}%</span>
            <span className="text-muted-foreground text-xs">Target</span>
          </div>
          <span className="text-muted-foreground">100%</span>
        </div>
      </div>
      
      {/* Additional stats */}
      {(daysToExam || estimatedReadiness || userRank) && (
        <div className="grid grid-cols-3 gap-3 text-center">
          {daysToExam !== undefined && (
            <Card className="p-3">
              <CardContent className="p-0">
                <p className="text-2xl font-bold">{daysToExam}</p>
                <p className="text-xs text-muted-foreground">Days to Exam</p>
              </CardContent>
            </Card>
          )}
          
          {estimatedReadiness !== undefined && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="p-3">
                    <CardContent className="p-0">
                      <p className="text-2xl font-bold">{estimatedReadiness}%</p>
                      <p className="text-xs text-muted-foreground">Est. Readiness</p>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Based on your current progress and practice rate</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {userRank && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="p-3">
                    <CardContent className="p-0">
                      <p className="text-2xl font-bold">Top {userRank.percentile}%</p>
                      <p className="text-xs text-muted-foreground">Rank</p>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Among {userRank.totalUsers} active students</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-3">
        {sections.map((section, index) => {
          const sectionPassing = section.score >= targetScore;
          const sectionIcon = section.icon || getSectionIcon(section.name);
          
          return (
            <Card key={index} className={`p-3 border ${sectionPassing ? 'border-green-200' : 'border-amber-200'}`}>
              <CardContent className="p-0 flex items-center">
                <div className="mr-3">{sectionIcon}</div>
                <div className="flex-grow">
                  <h4 className="text-sm font-medium flex items-center">
                    {section.name}
                    {getTrendIndicator(section.trend)}
                  </h4>
                  <Progress
                    value={section.score}
                    max={100}
                    className="h-1.5 mt-1"
                    indicatorClassName={sectionPassing ? "bg-green-500" : "bg-amber-500"}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">{section.score}%</span>
                    {sectionPassing ? (
                      <span className="text-xs text-green-500">Passing</span>
                    ) : (
                      <span className="text-xs text-amber-500">Needs Work</span>
                    )}
                  </div>
                  
                  {section.recentActivity !== undefined && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {section.recentActivity} exercises this week
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="text-center text-sm">
        <p className={`font-medium ${isPassing ? 'text-green-600' : 'text-amber-600'}`}>
          {isPassing 
            ? "You're on track to pass the CILS B1 exam!" 
            : `You need ${remainingToTarget}% more to reach the passing threshold.`}
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          Continue practicing consistently to maintain and improve your skills.
        </p>
      </div>
    </div>
  );
};

export default ProgressSummary;
