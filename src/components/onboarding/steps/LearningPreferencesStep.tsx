
import React, { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { HeartHandshake, BookOpen, Calendar, Clock } from 'lucide-react';

const LearningPreferencesStep: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState<string>("morning");
  const [selectedFrequency, setSelectedFrequency] = useState<string>("daily");
  const [preferences, setPreferences] = useState({
    grammar: true,
    vocabulary: true,
    reading: true,
    writing: false,
    listening: false,
    speaking: false,
    culture: true
  });

  const handlePreferenceChange = (preference: keyof typeof preferences) => {
    setPreferences({
      ...preferences,
      [preference]: !preferences[preference]
    });
  };

  return (
    <CardContent className="pt-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Learning Focus</h3>
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
              <Label htmlFor="grammar" className="font-medium">Grammar</Label>
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
              <Label htmlFor="vocabulary" className="font-medium">Vocabulary</Label>
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
              <Label htmlFor="reading" className="font-medium">Reading</Label>
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
              <Label htmlFor="writing" className="font-medium">Writing</Label>
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
              <Label htmlFor="listening" className="font-medium">Listening</Label>
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
              <Label htmlFor="speaking" className="font-medium">Speaking</Label>
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
              <Label htmlFor="culture" className="font-medium">Culture</Label>
              <p className="text-sm text-muted-foreground">
                Learn about Italian culture and citizenship topics
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Best Learning Time</h3>
        <p className="text-sm text-muted-foreground mb-4">
          When do you prefer to study?
        </p>
        <RadioGroup value={selectedTime} onValueChange={setSelectedTime} className="flex flex-col space-y-3">
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
        <h3 className="text-lg font-medium mb-4">Study Frequency</h3>
        <p className="text-sm text-muted-foreground mb-4">
          How often would you like to practice?
        </p>
        <RadioGroup value={selectedFrequency} onValueChange={setSelectedFrequency} className="flex flex-col space-y-3">
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
