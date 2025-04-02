
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BadgeCheck, AlertTriangle } from "lucide-react";

interface ProgressSummaryProps {
  overall: number;
  targetScore: number;
  sections: {
    name: string;
    score: number;
    icon: React.ReactNode;
  }[];
}

const ProgressSummary: React.FC<ProgressSummaryProps> = ({ 
  overall, 
  targetScore,
  sections 
}) => {
  const isPassing = overall >= targetScore;
  
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
      
      <div className="grid grid-cols-2 gap-3">
        {sections.map((section, index) => {
          const sectionPassing = section.score >= targetScore;
          return (
            <Card key={index} className={`p-3 border ${sectionPassing ? 'border-green-200' : 'border-amber-200'}`}>
              <CardContent className="p-0 flex items-center">
                <div className="mr-3">{section.icon}</div>
                <div className="flex-grow">
                  <h4 className="text-sm font-medium">{section.name}</h4>
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
            : `You need ${targetScore - overall}% more to reach the passing threshold.`}
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          Continue practicing consistently to maintain and improve your skills.
        </p>
      </div>
    </div>
  );
};

export default ProgressSummary;
