
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CILSExamSection } from '@/types/cils-types';
import { Clock, CheckCircle, BookOpen, Pencil, Headphones, Mic, BookText } from 'lucide-react';

interface ExamSectionCardProps {
  section: CILSExamSection;
  progress?: number;
  isCompleted?: boolean;
  onStart: (sectionId: string) => void;
  onContinue: (sectionId: string) => void;
}

const ExamSectionCard: React.FC<ExamSectionCardProps> = ({
  section,
  progress = 0,
  isCompleted = false,
  onStart,
  onContinue,
}) => {
  const getSectionIcon = () => {
    switch (section.type) {
      case 'reading':
        return <BookOpen className="h-5 w-5" />;
      case 'writing':
        return <Pencil className="h-5 w-5" />;
      case 'listening':
        return <Headphones className="h-5 w-5" />;
      case 'speaking':
        return <Mic className="h-5 w-5" />;
      case 'grammar':
      case 'vocabulary':
        return <BookText className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="capitalize">
            {section.type}
          </Badge>
          {isCompleted && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg flex items-center gap-2">
          {getSectionIcon()}
          {section.title}
        </CardTitle>
        <CardDescription>{section.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>{section.timeAllowed} minutes</span>
            </div>
            <div>
              {section.questionCount} questions
            </div>
          </div>
          
          {progress > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        {progress > 0 && !isCompleted ? (
          <Button 
            className="w-full"
            onClick={() => onContinue(section.id)}
          >
            Continue
          </Button>
        ) : (
          <Button
            className="w-full"
            variant={isCompleted ? "outline" : "default"}
            onClick={() => onStart(section.id)}
          >
            {isCompleted ? "Review" : "Start"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ExamSectionCard;
