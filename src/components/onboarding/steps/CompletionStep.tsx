
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { OnboardingData } from '../OnboardingFlow';

interface CompletionStepProps {
  onboardingData: OnboardingData;
}

const CompletionStep: React.FC<CompletionStepProps> = ({ onboardingData }) => {
  return (
    <CardContent className="pt-6 text-center">
      <div className="flex justify-center mb-6">
        <div className="p-3 rounded-full bg-green-100 text-green-600">
          <CheckCircle className="h-12 w-12" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold mb-3">Your Learning Path is Ready!</h3>
      <p className="mb-8 text-gray-600">
        We've created a personalized learning experience based on your preferences.
        Your journey to Italian citizenship starts now!
      </p>
      
      <div className="bg-gray-50 rounded-lg p-6 text-left mb-6">
        <h4 className="font-medium mb-3">Your Learning Profile</h4>
        <ul className="space-y-2">
          <li className="text-sm"><span className="font-medium">Current Level:</span> {formatLevel(onboardingData.language_level)}</li>
          <li className="text-sm"><span className="font-medium">Primary Goal:</span> {onboardingData.citizenship_goal ? 'Italian Citizenship Test' : 'General Italian Learning'}</li>
          {onboardingData.target_date && (
            <li className="text-sm"><span className="font-medium">Target Timeline:</span> {formatDate(onboardingData.target_date)}</li>
          )}
          <li className="text-sm"><span className="font-medium">Focus Areas:</span> {onboardingData.areas_to_improve.map(formatLabel).join(', ')}</li>
          <li className="text-sm"><span className="font-medium">Daily Study Time:</span> {formatStudyTime(onboardingData.study_time)}</li>
          <li className="text-sm"><span className="font-medium">Preferred Difficulty:</span> {formatDifficulty(onboardingData.difficulty_preference)}</li>
        </ul>
      </div>
      
      <p className="text-sm text-muted-foreground">
        You can adjust these preferences anytime in your account settings.
      </p>
    </CardContent>
  );
};

// Helper functions to format values for display
function formatLevel(level: string): string {
  const levels: Record<string, string> = {
    'beginner': 'Beginner',
    'elementary': 'Elementary (A1)',
    'pre-intermediate': 'Pre-Intermediate (A2)',
    'intermediate': 'Intermediate (B1)',
    'upper-intermediate': 'Upper-Intermediate (B2)',
    'advanced': 'Advanced (C1/C2)'
  };
  
  return levels[level] || level;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
}

function formatLabel(label: string): string {
  return label
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatStudyTime(time: string): string {
  switch (time) {
    case '5-15min': return '5-15 minutes per day';
    case '15-30min': return '15-30 minutes per day';
    case '30-60min': return '30-60 minutes per day';
    case '60min+': return 'Over 60 minutes per day';
    default: return time;
  }
}

function formatDifficulty(difficulty: string): string {
  switch (difficulty) {
    case 'easy': return 'Gentle Progression';
    case 'balanced': return 'Balanced Difficulty';
    case 'challenging': return 'Challenging Practice';
    default: return difficulty;
  }
}

export default CompletionStep;
