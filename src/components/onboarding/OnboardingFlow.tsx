
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import WelcomeStep from './steps/WelcomeStep';
import LanguageLevelStep from './steps/LanguageLevelStep';
import GoalsStep from './steps/GoalsStep';
import LearningPreferencesStep from './steps/LearningPreferencesStep';
import PersonalizationStep from './steps/PersonalizationStep';
import CompletionStep from './steps/CompletionStep';

interface OnboardingFlowProps {
  onComplete?: () => void;
}

export type OnboardingData = {
  language_level: string;
  citizenship_goal: boolean;
  target_date: string | null;
  study_preferences: string[];
  study_time: string;
  areas_to_improve: string[];
  interested_topics: string[];
  difficulty_preference: 'easy' | 'balanced' | 'challenging';
  voice_enabled: boolean;
  theme_preference: 'light' | 'dark' | 'system';
};

const STEPS = ['welcome', 'language-level', 'goals', 'preferences', 'personalization', 'completion'];

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    language_level: 'beginner',
    citizenship_goal: true,
    target_date: null,
    study_preferences: ['daily-practice'],
    study_time: '15-30min',
    areas_to_improve: ['speaking'],
    interested_topics: ['culture'],
    difficulty_preference: 'balanced',
    voice_enabled: true,
    theme_preference: 'system',
  });
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  
  const goToNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };
  
  const handleComplete = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to complete onboarding',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save onboarding data to user preferences
      const { error: preferencesError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          voice_enabled: onboardingData.voice_enabled,
          theme: onboardingData.theme_preference,
          difficulty_level: onboardingData.difficulty_preference,
        });
      
      if (preferencesError) throw preferencesError;
      
      // Save onboarding progress to user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          onboarding_completed: true,
        })
        .eq('id', user.id);
      
      if (profileError) throw profileError;
      
      // Save learning preferences to a user-specific table
      const { error: learningPrefsError } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          content_id: null, // This represents general preferences rather than content progress
          answers: {
            onboarding: {
              language_level: onboardingData.language_level,
              citizenship_goal: onboardingData.citizenship_goal,
              target_date: onboardingData.target_date,
              study_preferences: onboardingData.study_preferences,
              study_time: onboardingData.study_time,
              areas_to_improve: onboardingData.areas_to_improve,
              interested_topics: onboardingData.interested_topics,
            }
          }
        });
      
      if (learningPrefsError) throw learningPrefsError;
      
      toast({
        title: 'Onboarding completed!',
        description: 'Your preferences have been saved.',
      });
      
      // Call the onComplete callback if provided
      if (onComplete) {
        onComplete();
      } else {
        // Navigate to dashboard by default
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      toast({
        title: 'Error saving preferences',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl text-center">
            {currentStep === 0 && "Welcome to CILS Italian Citizenship Prep"}
            {currentStep === 1 && "Your Italian Language Level"}
            {currentStep === 2 && "Your Citizenship Goals"}
            {currentStep === 3 && "Learning Preferences"}
            {currentStep === 4 && "Personalize Your Experience"}
            {currentStep === 5 && "Ready to Start Learning!"}
          </CardTitle>
          <CardDescription className="text-center">
            {currentStep === 0 && "Let's set up your personalized learning experience"}
            {currentStep === 1 && "Help us understand your current Italian proficiency"}
            {currentStep === 2 && "Tell us about your citizenship plans and timeline"}
            {currentStep === 3 && "How do you prefer to learn?"}
            {currentStep === 4 && "Make the app work best for you"}
            {currentStep === 5 && "Your personalized learning path is ready"}
          </CardDescription>
          <div className="mt-4">
            <Progress value={progress} className="h-2 w-full" />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-muted-foreground">
                Step {currentStep + 1} of {STEPS.length}
              </span>
              <span className="text-xs text-muted-foreground">
                {Math.round(progress)}% Complete
              </span>
            </div>
          </div>
        </CardHeader>
        
        <Tabs value={STEPS[currentStep]} className="w-full">
          <TabsContent value="welcome" className="mt-0">
            <WelcomeStep />
          </TabsContent>
          
          <TabsContent value="language-level" className="mt-0">
            <LanguageLevelStep 
              value={onboardingData.language_level}
              onChange={(level) => updateOnboardingData({ language_level: level })}
            />
          </TabsContent>
          
          <TabsContent value="goals" className="mt-0">
            <GoalsStep 
              citizenshipGoal={onboardingData.citizenship_goal}
              targetDate={onboardingData.target_date}
              onChangeCitizenshipGoal={(value) => updateOnboardingData({ citizenship_goal: value })}
              onChangeTargetDate={(date) => updateOnboardingData({ target_date: date })}
            />
          </TabsContent>
          
          <TabsContent value="preferences" className="mt-0">
            <LearningPreferencesStep 
              studyPreferences={onboardingData.study_preferences}
              studyTime={onboardingData.study_time}
              areasToImprove={onboardingData.areas_to_improve}
              interestedTopics={onboardingData.interested_topics}
              onChangeStudyPreferences={(prefs) => updateOnboardingData({ study_preferences: prefs })}
              onChangeStudyTime={(time) => updateOnboardingData({ study_time: time })}
              onChangeAreasToImprove={(areas) => updateOnboardingData({ areas_to_improve: areas })}
              onChangeInterestedTopics={(topics) => updateOnboardingData({ interested_topics: topics })}
            />
          </TabsContent>
          
          <TabsContent value="personalization" className="mt-0">
            <PersonalizationStep 
              difficultyPreference={onboardingData.difficulty_preference}
              voiceEnabled={onboardingData.voice_enabled}
              themePreference={onboardingData.theme_preference}
              onChangeDifficultyPreference={(pref) => updateOnboardingData({ difficulty_preference: pref })}
              onChangeVoiceEnabled={(enabled) => updateOnboardingData({ voice_enabled: enabled })}
              onChangeThemePreference={(theme) => updateOnboardingData({ theme_preference: theme })}
            />
          </TabsContent>
          
          <TabsContent value="completion" className="mt-0">
            <CompletionStep onboardingData={onboardingData} />
          </TabsContent>
        </Tabs>
        
        <CardFooter className="pt-6 flex flex-col sm:flex-row gap-3">
          {currentStep > 0 && currentStep < STEPS.length - 1 && (
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              className="w-full sm:w-1/2"
            >
              Back
            </Button>
          )}
          
          {currentStep < STEPS.length - 1 && (
            <Button 
              onClick={goToNextStep}
              className="w-full sm:w-1/2"
            >
              {currentStep === 0 ? "Get Started" : "Continue"}
            </Button>
          )}
          
          {currentStep === STEPS.length - 1 && (
            <Button 
              onClick={handleComplete}
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Setting up your account..." : "Complete & Start Learning"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
