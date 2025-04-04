
import React, { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { HeartHandshake, BookOpen, Calendar, Clock, Brain, FileBadge } from 'lucide-react';
import { ConfidenceIndicator } from '@/components/ai/ConfidenceIndicator';

interface LearningPreferencesStepProps {
  data?: {
    selectedTime?: string;
    selectedFrequency?: string;
    preferences?: Record<string, boolean>;
  };
  onChange?: (data: any) => void;
}

const LearningPreferencesStep: React.FC<LearningPreferencesStepProps> = ({ 
  data = {}, 
  onChange 
}) => {
  const [selectedTime, setSelectedTime] = useState<string>(data.selectedTime || "morning");
  const [selectedFrequency, setSelectedFrequency] = useState<string>(data.selectedFrequency || "daily");
  const [preferences, setPreferences] = useState({
    grammar: true,
    vocabulary: true,
    reading: true,
    writing: false,
    listening: false,
    speaking: false,
    culture: true,
    ...(data.preferences || {})
  });

  const handlePreferenceChange = (preference: keyof typeof preferences) => {
    const updatedPreferences = {
      ...preferences,
      [preference]: !preferences[preference]
    };
    
    setPreferences(updatedPreferences);
    
    if (onChange) {
      onChange({
        selectedTime,
        selectedFrequency,
        preferences: updatedPreferences
      });
    }
  };

  const handleTimeChange = (value: string) => {
    setSelectedTime(value);
    
    if (onChange) {
      onChange({
        selectedTime: value,
        selectedFrequency,
        preferences
      });
    }
  };

  const handleFrequencyChange = (value: string) => {
    setSelectedFrequency(value);
    
    if (onChange) {
      onChange({
        selectedTime,
        selectedFrequency: value,
        preferences
      });
    }
  };

  // Calculate CILS B1 alignment based on learning preferences
  const calculateCILSAlignment = () => {
    // Weightage of each skill for CILS B1 exam
    const skillWeights = {
      grammar: 0.2,
      vocabulary: 0.15,
      reading: 0.15,
      writing: 0.15,
      listening: 0.15,
      speaking: 0.15,
      culture: 0.05
    };
    
    let alignment = 0;
    let potentialScore = 0;
    
    Object.entries(skillWeights).forEach(([skill, weight]) => {
      potentialScore += weight * 100;
      if (preferences[skill as keyof typeof preferences]) {
        alignment += weight * 100;
      }
    });
    
    return Math.round((alignment / potentialScore) * 100);
  };

  const cilsAlignment = calculateCILSAlignment();

  return (
    <CardContent className="pt-6 space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Learning Focus</h3>
          <Badge variant="outline" className="px-3">
            <ConfidenceIndicator value={cilsAlignment} showLabel={true} />
            <span className="ml-1">CILS B1 Alignment</span>
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Select the areas you want to focus on in your learning journey
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="grammar" 
              checked={preferences.grammar}
              onCheckedChange={() => handlePreferenceChange('grammar')}
            />
            <div className="grid gap-1.5">
              <Label htmlFor="grammar" className="font-medium flex items-center gap-1">
                Grammar
                <ConfidenceIndicator value={95} />
              </Label>
              <p className="text-sm text-muted-foreground">
                Master Italian grammar rules and structures
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="vocabulary" 
              checked={preferences.vocabulary}
              onCheckedChange={() => handlePreferenceChange('vocabulary')}
            />
            <div className="grid gap-1.5">
              <Label htmlFor="vocabulary" className="font-medium flex items-center gap-1">
                Vocabulary
                <ConfidenceIndicator value={90} />
              </Label>
              <p className="text-sm text-muted-foreground">
                Build your Italian vocabulary
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="reading" 
              checked={preferences.reading}
              onCheckedChange={() => handlePreferenceChange('reading')}
            />
            <div className="grid gap-1.5">
              <Label htmlFor="reading" className="font-medium flex items-center gap-1">
                Reading
                <ConfidenceIndicator value={85} />
              </Label>
              <p className="text-sm text-muted-foreground">
                Practice reading Italian texts
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="writing" 
              checked={preferences.writing}
              onCheckedChange={() => handlePreferenceChange('writing')}
            />
            <div className="grid gap-1.5">
              <Label htmlFor="writing" className="font-medium flex items-center gap-1">
                Writing
                <ConfidenceIndicator value={85} />
              </Label>
              <p className="text-sm text-muted-foreground">
                Improve your written Italian skills
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="listening" 
              checked={preferences.listening}
              onCheckedChange={() => handlePreferenceChange('listening')}
            />
            <div className="grid gap-1.5">
              <Label htmlFor="listening" className="font-medium flex items-center gap-1">
                Listening
                <ConfidenceIndicator value={80} />
              </Label>
              <p className="text-sm text-muted-foreground">
                Enhance your Italian listening comprehension
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="speaking" 
              checked={preferences.speaking}
              onCheckedChange={() => handlePreferenceChange('speaking')}
            />
            <div className="grid gap-1.5">
              <Label htmlFor="speaking" className="font-medium flex items-center gap-1">
                Speaking
                <ConfidenceIndicator value={80} />
              </Label>
              <p className="text-sm text-muted-foreground">
                Practice speaking Italian
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="culture" 
              checked={preferences.culture}
              onCheckedChange={() => handlePreferenceChange('culture')}
            />
            <div className="grid gap-1.5">
              <Label htmlFor="culture" className="font-medium flex items-center gap-1">
                Culture
                <ConfidenceIndicator value={75} />
              </Label>
              <p className="text-sm text-muted-foreground">
                Learn about Italian culture and citizenship topics
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Best Learning Time
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          When do you prefer to study?
        </p>
        <RadioGroup value={selectedTime} onValueChange={handleTimeChange} className="flex flex-col space-y-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="morning" id="morning" />
            <Label htmlFor="morning" className="font-medium">Morning</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="afternoon" id="afternoon" />
            <Label htmlFor="afternoon" className="font-medium">Afternoon</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="evening" id="evening" />
            <Label htmlFor="evening" className="font-medium">Evening</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="night" id="night" />
            <Label htmlFor="night" className="font-medium">Night</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          Study Frequency
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          How often would you like to practice?
        </p>
        <RadioGroup value={selectedFrequency} onValueChange={handleFrequencyChange} className="flex flex-col space-y-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="daily" id="daily" />
            <Label htmlFor="daily" className="font-medium">Daily (recommended)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weekdays" id="weekdays" />
            <Label htmlFor="weekdays" className="font-medium">Weekdays only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weekends" id="weekends" />
            <Label htmlFor="weekends" className="font-medium">Weekends only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="few-times" id="few-times" />
            <Label htmlFor="few-times" className="font-medium">A few times a week</Label>
          </div>
        </RadioGroup>
      </div>
    </CardContent>
  );
};

export default LearningPreferencesStep;
