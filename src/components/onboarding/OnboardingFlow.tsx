
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sparkles, Brain, Zap, BookOpen, Award, Search, MessageSquare, LanguagesIcon } from 'lucide-react';

interface OnboardingFlowProps {
  isOpen: boolean;
  onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ isOpen, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [preferredLanguage, setPreferredLanguage] = useState<'english' | 'italian' | 'both'>('both');
  const [learningGoals, setLearningGoals] = useState<string[]>([]);
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const { updateSettings } = useAIUtils();
  
  const totalSteps = 5;
  
  // Set AI settings on mount
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  // Handle next step
  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  // Handle back
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Handle skip
  const handleSkip = () => {
    handleComplete();
  };
  
  // Handle completion
  const handleComplete = async () => {
    // Save user preferences
    if (user) {
      try {
        // Update user profile with preferences
        await updateProfile({
          preferredLanguage,
          hasCompletedOnboarding: true
        });
        
        // Update AI settings
        updateSettings({
          enabled: aiEnabled
        });
        
        // Mark onboarding as complete
        onComplete();
        
        // Navigate to dashboard
        navigate('/');
      } catch (error) {
        console.error('Error saving onboarding preferences:', error);
        onComplete(); // Complete anyway to avoid blocking the user
      }
    } else {
      onComplete();
    }
  };
  
  // Toggle a learning goal
  const toggleLearningGoal = (goal: string) => {
    if (learningGoals.includes(goal)) {
      setLearningGoals(learningGoals.filter(g => g !== goal));
    } else {
      setLearningGoals([...learningGoals, goal]);
    }
  };
  
  // If not open, don't render
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={`onboarding-step-${currentStep}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                {currentStep === 0 && <Sparkles className="h-5 w-5 text-blue-500" />}
                {currentStep === 1 && <Brain className="h-5 w-5 text-purple-500" />}
                {currentStep === 2 && <LanguagesIcon className="h-5 w-5 text-green-500" />}
                {currentStep === 3 && <BookOpen className="h-5 w-5 text-amber-500" />}
                {currentStep === 4 && <Award className="h-5 w-5 text-red-500" />}
                Welcome to LinguaLearn
              </CardTitle>
              <Progress value={((currentStep + 1) / totalSteps) * 100} className="h-1" />
            </CardHeader>
            
            <CardContent className="space-y-4">
              {currentStep === 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Welcome to your language learning journey!</h3>
                  <p>We're excited to help you learn Italian effectively and enjoyably. Let's set up your learning environment.</p>
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      This brief onboarding will help customize your learning experience.
                    </p>
                  </div>
                </div>
              )}
              
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">AI-Powered Learning</h3>
                  <p>Our AI assistant can help you learn more effectively by providing personalized suggestions, generating practice content, and analyzing your progress.</p>
                  
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="ai-enabled">Enable AI Features</Label>
                      <p className="text-sm text-muted-foreground">
                        Get personalized recommendations and assistance
                      </p>
                    </div>
                    <Switch
                      id="ai-enabled"
                      checked={aiEnabled}
                      onCheckedChange={setAiEnabled}
                    />
                  </div>
                </div>
              )}
              
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Language Preferences</h3>
                  <p>Let us know your preferred language for instructions and UI elements.</p>
                  
                  <div className="space-y-3">
                    <div
                      className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer ${
                        preferredLanguage === 'english' ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setPreferredLanguage('english')}
                    >
                      <div>
                        <p className="font-medium">English</p>
                        <p className="text-sm text-muted-foreground">
                          Show all instructions in English
                        </p>
                      </div>
                      <div className={`h-4 w-4 rounded-full ${
                        preferredLanguage === 'english' ? 'bg-primary' : 'border'
                      }`} />
                    </div>
                    
                    <div
                      className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer ${
                        preferredLanguage === 'italian' ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setPreferredLanguage('italian')}
                    >
                      <div>
                        <p className="font-medium">Italian</p>
                        <p className="text-sm text-muted-foreground">
                          Show all instructions in Italian
                        </p>
                      </div>
                      <div className={`h-4 w-4 rounded-full ${
                        preferredLanguage === 'italian' ? 'bg-primary' : 'border'
                      }`} />
                    </div>
                    
                    <div
                      className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer ${
                        preferredLanguage === 'both' ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setPreferredLanguage('both')}
                    >
                      <div>
                        <p className="font-medium">Bilingual</p>
                        <p className="text-sm text-muted-foreground">
                          Show instructions in both languages
                        </p>
                      </div>
                      <div className={`h-4 w-4 rounded-full ${
                        preferredLanguage === 'both' ? 'bg-primary' : 'border'
                      }`} />
                    </div>
                  </div>
                </div>
              )}
              
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Learning Goals</h3>
                  <p>Select what you'd like to focus on during your learning journey.</p>
                  
                  <div className="space-y-3">
                    {['Vocabulary Building', 'Grammar Mastery', 'Conversation Skills', 'Reading Comprehension', 'Writing Practice'].map((goal) => (
                      <div
                        key={goal}
                        className={`flex items-center justify-between rounded-lg border p-4 cursor-pointer ${
                          learningGoals.includes(goal) ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => toggleLearningGoal(goal)}
                      >
                        <p className="font-medium">{goal}</p>
                        <div className={`h-4 w-4 rounded-full ${
                          learningGoals.includes(goal) ? 'bg-primary' : 'border'
                        }`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {currentStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Ready to Start Learning!</h3>
                  <p>Your personalized learning experience is ready. Here's what you can do:</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full">
                        <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">Interactive Lessons</p>
                        <p className="text-sm text-muted-foreground">
                          Learn through engaging, interactive content
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-full">
                        <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium">AI Assistant</p>
                        <p className="text-sm text-muted-foreground">
                          Get help and guidance whenever you need it
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                        <Search className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">Progress Tracking</p>
                        <p className="text-sm text-muted-foreground">
                          Monitor your learning progress and achievements
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              {currentStep > 0 ? (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              ) : (
                <Button variant="outline" onClick={handleSkip}>
                  Skip
                </Button>
              )}
              
              <Button onClick={handleNext}>
                {currentStep < totalSteps - 1 ? 'Next' : 'Get Started'}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OnboardingFlow;
