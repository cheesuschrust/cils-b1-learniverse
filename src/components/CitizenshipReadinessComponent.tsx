
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, Trophy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface CitizenshipReadinessProps {
  level: string;
  readinessScore: number;
  assessmentAvailable: boolean;
  onStartAssessment: () => void;
  lastAssessmentDate?: Date;
}

const CitizenshipReadinessComponent: React.FC<CitizenshipReadinessProps> = ({
  level,
  readinessScore,
  assessmentAvailable,
  onStartAssessment,
  lastAssessmentDate
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Format date if available
  const formattedLastDate = lastAssessmentDate 
    ? new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(lastAssessmentDate)
    : 'Never';

  // Determine the status color
  const getStatusColor = () => {
    if (readinessScore >= 80) return 'text-green-500';
    if (readinessScore >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  // Get readiness message
  const getReadinessMessage = () => {
    if (readinessScore >= 80) return 'Ready for the citizenship test!';
    if (readinessScore >= 60) return 'Almost ready - more practice needed.';
    return 'Not ready yet - focused preparation required.';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Italian Citizenship Test Readiness</CardTitle>
            <CardDescription>Your current preparation level for the citizenship exam</CardDescription>
          </div>
          <Badge variant={readinessScore >= 80 ? 'success' : readinessScore >= 60 ? 'warning' : 'destructive'}>
            {level}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Readiness Score */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Readiness Score</span>
            <span className={`font-bold ${getStatusColor()}`}>{readinessScore}%</span>
          </div>
          <Progress value={readinessScore} className="h-2" />
          
          <div className={`text-sm mt-1 ${getStatusColor()}`}>
            {getReadinessMessage()}
          </div>
        </div>
        
        {/* Last Assessment Date */}
        <div>
          <span className="text-sm text-muted-foreground">Last assessment: {formattedLastDate}</span>
        </div>
        
        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>About the Citizenship Test</AlertTitle>
              <AlertDescription>
                The Italian citizenship test evaluates your knowledge of Italian culture, language, and civics.
                A score of 80% or higher indicates you're ready to take the official test.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border rounded-lg p-3">
                <h4 className="font-medium mb-2">Key Areas Tested</h4>
                <ul className="text-sm space-y-1">
                  <li>• Italian Constitution</li>
                  <li>• Rights and Duties of Citizens</li>
                  <li>• Italian History</li>
                  <li>• Italian Geography</li>
                  <li>• Italian Culture</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-3">
                <h4 className="font-medium mb-2">Test Format</h4>
                <ul className="text-sm space-y-1">
                  <li>• 20 multiple-choice questions</li>
                  <li>• 30-minute time limit</li>
                  <li>• Pass mark: 60% (12 correct answers)</li>
                  <li>• Language: Italian</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
        <Button 
          variant="outline" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full sm:w-auto"
        >
          {isExpanded ? 'Show Less' : 'Learn More'}
        </Button>
        
        <Button 
          onClick={onStartAssessment}
          disabled={!assessmentAvailable}
          className="w-full sm:w-auto"
        >
          {assessmentAvailable ? (
            'Start Assessment'
          ) : (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Assessment unavailable
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CitizenshipReadinessComponent;
