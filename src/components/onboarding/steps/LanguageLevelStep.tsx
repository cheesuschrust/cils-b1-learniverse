
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface LanguageLevelStepProps {
  value: string;
  onChange: (level: string) => void;
}

const LanguageLevelStep: React.FC<LanguageLevelStepProps> = ({ value, onChange }) => {
  const levels = [
    {
      id: 'beginner',
      title: 'Beginner',
      description: 'I know a few words or phrases but cannot form complete sentences.',
      fit: 'You\'ll start with the basics and build a strong foundation.'
    },
    {
      id: 'elementary',
      title: 'Elementary (A1)',
      description: 'I can use simple phrases and express immediate needs.',
      fit: 'You\'ll quickly review basics and focus on expanding vocabulary and simple conversations.'
    },
    {
      id: 'pre-intermediate',
      title: 'Pre-Intermediate (A2)',
      description: 'I can communicate in simple tasks and describe aspects of my background.',
      fit: 'You\'ll bridge the gap to B1 with focused practice on grammar and conversation.'
    },
    {
      id: 'intermediate',
      title: 'Intermediate (B1)',
      description: 'I can handle most situations while traveling and describe experiences and events.',
      fit: 'You\'re at the required CILS level! We\'ll focus on improving and ensuring exam success.'
    },
    {
      id: 'upper-intermediate',
      title: 'Upper-Intermediate (B2)',
      description: 'I can interact with native speakers fluently and express myself on a wide range of topics.',
      fit: 'You\'re above the required level. We\'ll focus on maintaining and perfecting your skills.'
    },
    {
      id: 'advanced',
      title: 'Advanced (C1/C2)',
      description: 'I can express myself fluently and precisely, even in complex situations.',
      fit: 'You\'re well above the required level. We\'ll focus on maintaining fluency and cultural nuances.'
    }
  ];

  return (
    <CardContent className="pt-6">
      <p className="mb-6">
        The CILS Italian citizenship test requires a B1 level. This helps us customize your learning path based on how far you are from this goal.
      </p>
      
      <div className="space-y-4">
        <RadioGroup value={value} onValueChange={onChange} className="space-y-4">
          {levels.map((level) => (
            <div key={level.id} className="flex">
              <RadioGroupItem 
                value={level.id} 
                id={`level-${level.id}`} 
                className="mt-1"
              />
              <div className="ml-3">
                <Label 
                  htmlFor={`level-${level.id}`} 
                  className="text-base font-medium cursor-pointer"
                >
                  {level.title}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">{level.description}</p>
                <p className="text-sm mt-1">
                  <span className="font-medium">How we'll help:</span> {level.fit}
                </p>
              </div>
            </div>
          ))}
        </RadioGroup>

        <div className="bg-primary/5 p-4 rounded-lg mt-6">
          <h4 className="font-medium text-primary">About the CILS B1 Requirement</h4>
          <p className="text-sm mt-2">
            Italian citizenship applications typically require a CILS certification at the B1 level. At this level, 
            you should be able to understand the main points of clear standard input on familiar matters, deal with 
            most situations while traveling, produce simple connected text on familiar topics, and describe 
            experiences, events, dreams, hopes and ambitions.
          </p>
        </div>
      </div>
    </CardContent>
  );
};

export default LanguageLevelStep;
