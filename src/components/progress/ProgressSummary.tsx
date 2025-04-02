
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

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
  // Determine progress status
  const getProgressStatus = (score: number) => {
    if (score >= targetScore) return "success";
    if (score >= targetScore * 0.75) return "warning";
    return "danger";
  };
  
  const getProgressColor = (status: string) => {
    switch (status) {
      case "success": return "bg-green-500";
      case "warning": return "bg-amber-500";
      case "danger": return "bg-red-500";
      default: return "bg-primary";
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "warning": return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "danger": return <XCircle className="h-5 w-5 text-red-500" />;
      default: return null;
    }
  };
  
  const overallStatus = getProgressStatus(overall);
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Overall Progress</h3>
          <div className="flex items-center space-x-2">
            {getStatusIcon(overallStatus)}
            <span className={`text-lg font-bold ${
              overallStatus === "success" ? "text-green-600" : 
              overallStatus === "warning" ? "text-amber-600" : "text-red-600"
            }`}>
              {overall}%
            </span>
          </div>
        </div>
        
        <Progress 
          value={overall} 
          className={`h-2.5 ${getProgressColor(overallStatus)}`} 
        />
        
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>0%</span>
          <span className="font-medium">Target: {targetScore}%</span>
          <span>100%</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((section) => {
          const status = getProgressStatus(section.score);
          
          return (
            <div key={section.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {section.icon}
                  <span className="text-sm font-medium">{section.name}</span>
                </div>
                <span className={`text-sm font-bold ${
                  status === "success" ? "text-green-600" : 
                  status === "warning" ? "text-amber-600" : "text-red-600"
                }`}>
                  {section.score}%
                </span>
              </div>
              
              <Progress 
                value={section.score} 
                className={`h-2 ${getProgressColor(status)}`} 
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSummary;
