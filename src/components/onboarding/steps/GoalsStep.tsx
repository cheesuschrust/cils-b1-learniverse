
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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

  return (
    <CardContent className="pt-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">What's your primary goal?</h3>
          <RadioGroup 
            value={citizenshipGoal ? "citizenship" : "general"}
            onValueChange={(value) => onChangeCitizenshipGoal(value === "citizenship")}
            className="space-y-3"
          >
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="citizenship" id="goal-citizenship" className="mt-1" />
              <div className="grid gap-1.5">
                <Label htmlFor="goal-citizenship" className="text-base font-medium">
                  Prepare for Italian Citizenship Test
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
            <h3 className="text-lg font-medium mb-3">Do you have a target date for taking the exam?</h3>
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
            
            <div className="bg-blue-50 p-4 rounded-md mt-6">
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
