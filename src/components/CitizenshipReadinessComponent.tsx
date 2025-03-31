
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CitizenshipReadinessProps } from '@/types/app-types';
import { CalendarClock, Award } from 'lucide-react';
import { format } from 'date-fns';

const CitizenshipReadinessComponent: React.FC<CitizenshipReadinessProps> = ({
  level,
  readinessScore,
  assessmentAvailable,
  onStartAssessment,
  lastAssessmentDate
}) => {
  // Determine score label
  const getScoreLabel = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-green-600' };
    if (score >= 60) return { label: 'Good', color: 'text-blue-600' };
    if (score >= 40) return { label: 'Fair', color: 'text-yellow-600' };
    return { label: 'Needs Work', color: 'text-red-600' };
  };
  
  const { label, color } = getScoreLabel(readinessScore);
  
  // Determine progress color
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="border rounded-lg p-6 shadow-sm bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Citizenship Test Readiness</h3>
        <div className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
          Level: {level}
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Readiness Score</span>
            <span className={`text-sm font-bold ${color}`}>
              {readinessScore}% - {label}
            </span>
          </div>
          <Progress 
            value={readinessScore} 
            className="h-2"
            className={getProgressColor(readinessScore)}
          />
        </div>
        
        {lastAssessmentDate && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <CalendarClock className="w-4 h-4 mr-1" />
            Last assessment: {format(new Date(lastAssessmentDate), 'PPP')}
          </div>
        )}
        
        <div className="pt-2">
          <Button 
            onClick={onStartAssessment}
            disabled={!assessmentAvailable}
            className="w-full"
          >
            <Award className="w-4 h-4 mr-2" />
            {assessmentAvailable ? 'Start Readiness Assessment' : 'Assessment Unavailable'}
          </Button>
          
          {!assessmentAvailable && (
            <p className="text-xs text-center mt-2 text-gray-500">
              You can take the assessment again in 24 hours
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitizenshipReadinessComponent;
