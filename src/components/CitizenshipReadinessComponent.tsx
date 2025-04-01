
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Languages, 
  Mic, 
  PenTool 
} from 'lucide-react';
import { ItalianLevel } from '@/types/italian-types';

interface CitizenshipReadinessComponentProps {
  readinessScore: number;
  level: ItalianLevel;
  assessmentAvailable: boolean;
  lastAssessmentDate?: Date;
  onStartAssessment: () => void;
}

const CitizenshipReadinessComponent: React.FC<CitizenshipReadinessComponentProps> = ({
  readinessScore,
  level,
  assessmentAvailable,
  lastAssessmentDate,
  onStartAssessment
}) => {
  // Format the last assessment date
  const formattedDate = lastAssessmentDate 
    ? new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(lastAssessmentDate)
    : 'Never';

  // Determine the readiness status and message
  const getReadinessStatus = (score: number) => {
    if (score >= 80) {
      return {
        label: 'Ready',
        message: "You're well-prepared for the citizenship test!",
        color: "text-green-600"
      };
    } else if (score >= 60) {
      return {
        label: 'Almost Ready',
        message: "You're making good progress, but need more practice in some areas.",
        color: "text-amber-600"
      };
    } else {
      return {
        label: 'Needs Practice',
        message: "More preparation is needed before taking the citizenship test.",
        color: "text-red-600"
      };
    }
  };

  const readinessStatus = getReadinessStatus(readinessScore);

  // Mock skill breakdown data
  const skillBreakdown = [
    { name: 'Language Comprehension', score: Math.min(100, readinessScore + 10), icon: <Languages className="h-4 w-4" /> },
    { name: 'Cultural Knowledge', score: Math.max(0, readinessScore - 5), icon: <FileText className="h-4 w-4" /> },
    { name: 'Speaking Ability', score: readinessScore, icon: <Mic className="h-4 w-4" /> },
    { name: 'Writing Skills', score: Math.min(100, readinessScore + 5), icon: <PenTool className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className={readinessStatus.color}>{readinessStatus.label}</span>
            <Badge variant="outline" className="text-xs font-normal">
              {level.toUpperCase()}
            </Badge>
          </h2>
          <p className="text-muted-foreground">{readinessStatus.message}</p>
        </div>
        
        <Button 
          onClick={onStartAssessment}
          disabled={!assessmentAvailable}
        >
          Take Readiness Assessment
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Overall Readiness</h3>
            <span className="font-bold text-lg">{Math.round(readinessScore)}%</span>
          </div>
          
          <Progress value={readinessScore} className="h-2 mb-6" />
          
          <div className="space-y-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Last assessment</span>
              </div>
              <span>{formattedDate}</span>
            </div>
            
            {!assessmentAvailable && (
              <div className="flex items-center gap-2 p-3 bg-amber-100 text-amber-800 rounded-md text-sm">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span>Complete at least 50% of practice exercises to unlock the readiness assessment</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h3 className="font-medium">Skill Breakdown</h3>
        
        <div className="space-y-4">
          {skillBreakdown.map((skill) => (
            <div key={skill.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {skill.icon}
                  <span className="text-sm">{skill.name}</span>
                </div>
                <span className="text-sm font-medium">{skill.score}%</span>
              </div>
              <Progress value={skill.score} className="h-1.5" />
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium">Preparation Tips</h3>
        
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
            <span>Practice Italian listening comprehension daily with authentic materials</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
            <span>Review Italian history and cultural knowledge related to citizenship</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
            <span>Complete all sections of the practice exercises for best results</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
            <span>Take the readiness assessment at least once a month to track progress</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CitizenshipReadinessComponent;
