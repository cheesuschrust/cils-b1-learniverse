
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, Clock, Trophy } from 'lucide-react';

type ReadinessLevel = 'beginner' | 'intermediate' | 'advanced';

interface CitizenshipReadinessComponentProps {
  level: ReadinessLevel;
  readinessScore: number;
  assessmentAvailable: boolean;
  onStartAssessment: () => void;
  lastAssessmentDate?: Date;
}

const CitizenshipReadinessComponent: React.FC<CitizenshipReadinessComponentProps> = ({
  level,
  readinessScore,
  assessmentAvailable,
  onStartAssessment,
  lastAssessmentDate
}) => {
  const getReadinessStatus = () => {
    if (readinessScore >= 80) return { label: 'Ready', color: 'text-green-500', icon: <CheckCircle className="h-5 w-5 text-green-500" /> };
    if (readinessScore >= 50) return { label: 'Almost Ready', color: 'text-amber-500', icon: <Clock className="h-5 w-5 text-amber-500" /> };
    return { label: 'Not Ready', color: 'text-red-500', icon: <AlertCircle className="h-5 w-5 text-red-500" /> };
  };
  
  const readinessStatus = getReadinessStatus();
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold">CILS B1 Citizenship Exam</h3>
              <p className="text-muted-foreground">Level: <span className="capitalize">{level}</span></p>
            </div>
            <Badge 
              className={`px-2 py-1 ${
                readinessScore >= 80
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : readinessScore >= 50
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
              }`}
            >
              {readinessStatus.label}
            </Badge>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overall Readiness</span>
                <span className="text-sm font-medium">{Math.round(readinessScore)}%</span>
              </div>
              <Progress value={readinessScore} className="h-2" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-md">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Trophy className="h-4 w-4 mr-2 text-primary" />
                  Required Modules
                </h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    Listening Comprehension
                  </li>
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    Reading Comprehension
                  </li>
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                    Written Production
                  </li>
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                    Oral Production
                  </li>
                </ul>
              </div>
              
              <div className="p-4 bg-muted rounded-md">
                <h4 className="text-sm font-medium mb-2">Citizenship Knowledge Areas</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex justify-between">
                    <span>Italian Culture</span>
                    <span>85%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Government Structure</span>
                    <span>62%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Rights & Duties</span>
                    <span>78%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>History & Geography</span>
                    <span>93%</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {lastAssessmentDate && (
              <p className="text-xs text-muted-foreground">
                Last assessment taken on: {lastAssessmentDate.toLocaleDateString()}
              </p>
            )}
          </div>
          
          <div className="mt-6">
            <Button 
              className="w-full" 
              disabled={!assessmentAvailable}
              onClick={onStartAssessment}
            >
              Start Readiness Assessment
            </Button>
            
            {!assessmentAvailable && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                Complete at least 50% of the required modules to unlock the assessment
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CitizenshipReadinessComponent;
