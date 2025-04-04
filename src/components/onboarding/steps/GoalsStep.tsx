
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Target, Check, Flag } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ConfidenceIndicator } from '@/components/ai/ConfidenceIndicator';

interface GoalsStepProps {
  citizenshipGoal: boolean;
  targetDate: string | null;
  onChangeCitizenshipGoal: (value: boolean) => void;
  onChangeTargetDate: (date: string | null) => void;
}

const GoalsStep: React.FC<GoalsStepProps> = ({
  citizenshipGoal,
  targetDate,
  onChangeCitizenshipGoal,
  onChangeTargetDate,
}) => {
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      onChangeTargetDate(date.toISOString());
    } else {
      onChangeTargetDate(null);
    }
  };

  // Calculate days until exam based on target date
  const getDaysUntilExam = () => {
    if (!targetDate) return null;
    
    const today = new Date();
    const examDate = new Date(targetDate);
    const diffTime = Math.abs(examDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const daysUntilExam = getDaysUntilExam();

  // Calculate confidence based on days until exam
  const getConfidenceValue = () => {
    if (!daysUntilExam) return 50;
    
    if (daysUntilExam > 180) return 90; // More than 6 months - very confident
    if (daysUntilExam > 90) return 80; // 3-6 months - confident
    if (daysUntilExam > 60) return 70; // 2-3 months - somewhat confident
    if (daysUntilExam > 30) return 50; // 1-2 months - neutral
    if (daysUntilExam > 14) return 30; // 2-4 weeks - challenging
    
    return 20; // Less than 2 weeks - very challenging
  };

  return (
    <CardContent className="pt-6">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">What's your primary goal?</h3>
            {citizenshipGoal && (
              <Badge variant="citizenship" className="bg-green-50 text-green-700 border-green-200">
                <Check className="h-3.5 w-3.5 mr-1" />
                CILS B1 Required
              </Badge>
            )}
          </div>
          <RadioGroup 
            value={citizenshipGoal ? "citizenship" : "general"}
            onValueChange={(value) => onChangeCitizenshipGoal(value === "citizenship")}
            className="space-y-3"
          >
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="citizenship" id="goal-citizenship" className="mt-1" />
              <div className="grid gap-1.5">
                <Label htmlFor="goal-citizenship" className="text-base font-medium flex items-center gap-2">
                  Prepare for Italian Citizenship Test
                  <ConfidenceIndicator value={90} variant="citizenship" />
                </Label>
                <p className="text-sm text-muted-foreground">
                  Focus on CILS B1 exam preparation for Italian citizenship requirements
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="general" id="goal-general" className="mt-1" />
              <div className="grid gap-1.5">
                <Label htmlFor="goal-general" className="text-base font-medium">
                  General Italian Learning
                </Label>
                <p className="text-sm text-muted-foreground">
                  Learn Italian for travel, personal interest, or general improvement
                </p>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        {citizenshipGoal && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Target className="h-5 w-5 text-muted-foreground" />
                Do you have a target date for taking the exam?
              </h3>
              
              {targetDate && daysUntilExam && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                  <ConfidenceIndicator value={getConfidenceValue()} />
                  <span className="ml-1">{daysUntilExam} days until exam</span>
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              This helps us pace your learning to ensure you're ready by your target date.
              Don't worry, you can always adjust this later.
            </p>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !targetDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {targetDate ? format(new Date(targetDate), "PPP") : "Select a target date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={targetDate ? new Date(targetDate) : undefined}
                  onSelect={handleDateChange}
                  initialFocus
                  disabled={(date) => date < new Date() || date > new Date(new Date().setFullYear(new Date().getFullYear() + 2))}
                />
              </PopoverContent>
            </Popover>
            
            {targetDate && daysUntilExam && daysUntilExam < 60 && (
              <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                <h4 className="text-sm font-medium text-amber-700 mb-2 flex items-center gap-2">
                  <Flag className="h-4 w-4" />
                  Accelerated Learning Path
                </h4>
                <p className="text-sm text-amber-700">
                  With {daysUntilExam} days until your exam, we'll customize an intensive study plan to help you prepare in time. 
                  We recommend studying at least 1 hour daily for the best results.
                </p>
              </div>
            )}
            
            <div className="bg-blue-50 p-4 rounded-md mt-4 border border-blue-100">
              <h4 className="text-sm font-medium text-blue-700 mb-2">About the CILS B1 Exam</h4>
              <p className="text-sm text-blue-700">
                The CILS B1 (Certificazione di Italiano come Lingua Straniera) is the Italian language 
                certification required for citizenship. It tests reading, writing, listening, and speaking 
                skills at an intermediate level.
              </p>
            </div>
          </div>
        )}
      </div>
    </CardContent>
  );
};

export default GoalsStep;
