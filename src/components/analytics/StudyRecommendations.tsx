
import React from 'react';
import { AlertTriangle, BookOpen, Clock, Check, ArrowRight } from 'lucide-react';

interface StudyRecommendationsProps {
  recommendations: Array<{
    type: string;
    focus: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
    difficulty?: string;
    totalQuestions?: number;
    suggestion?: string;
  }>;
}

const StudyRecommendations: React.FC<StudyRecommendationsProps> = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] bg-muted/20 rounded-md">
        <p className="text-muted-foreground">No recommendations available yet</p>
      </div>
    );
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'low':
        return <Check className="h-5 w-5 text-green-500" />;
      default:
        return <BookOpen className="h-5 w-5 text-blue-500" />;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'High Priority';
      case 'medium':
        return 'Medium Priority';
      case 'low':
        return 'Low Priority';
      default:
        return 'Recommended';
    }
  };

  return (
    <div className="space-y-4">
      {recommendations.map((rec, index) => (
        <div key={index} className="border rounded-lg p-3 bg-muted/10">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              {getPriorityIcon(rec.priority)}
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{rec.focus}</h4>
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                  {getPriorityLabel(rec.priority)}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground">{rec.reason}</p>
              
              {rec.suggestion && (
                <p className="text-sm italic mt-1">{rec.suggestion}</p>
              )}
              
              <div className="flex justify-end mt-2">
                <button className="flex items-center text-xs text-primary hover:underline">
                  Practice now <ArrowRight className="ml-1 h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudyRecommendations;
