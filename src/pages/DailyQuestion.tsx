
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useDailyQuestion } from '@/hooks/useDailyQuestion';
import { useAuth } from '@/contexts/AuthContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import ConfidenceIndicator from '@/components/ai/ConfidenceIndicator';
import { useGamificationContext } from '@/contexts/GamificationContext';
import { Calendar, CheckCircle2, Clock, Flame, Star, Trophy, X } from 'lucide-react';

const DailyQuestion = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { showAchievementUnlock, showLevelUp } = useGamificationContext();
  const [showExplanation, setShowExplanation] = useState(false);
  const {
    todaysQuestion,
    isLoading,
    hasCompletedToday,
    submitAnswer,
    streak,
    resetQuestion,
    isCorrect,
    selectedAnswer,
    setSelectedAnswer
  } = useDailyQuestion();

  const handleAnswerSubmit = async () => {
    if (!selectedAnswer) {
      toast({
        title: "Please select an answer",
        variant: "destructive"
      });
      return;
    }

    const correct = await submitAnswer(selectedAnswer);

    // Simulate achievement unlocking for a good user experience
    if (streak > 0 && streak % 7 === 0) {
      setTimeout(() => {
        showAchievementUnlock({
          id: "weekly_streak",
          title: "Weekly Warrior",
          description: "Complete daily questions for 7 consecutive days",
          icon: "flame",
          category: "streak",
          points: 50,
          requiredValue: 7,
          unlockedAt: new Date()
        });
      }, 1000);
    }
    
    if (streak === 30) {
      setTimeout(() => {
        showAchievementUnlock({
          id: "monthly_streak",
          title: "Monthly Dedication",
          description: "Complete daily questions for 30 consecutive days",
          icon: "calendar",
          category: "streak",
          points: 200,
          requiredValue: 30,
          unlockedAt: new Date()
        });
      }, 1500);
    }
  };

  // Calculate confidence score for the question category
  const getConfidenceScore = (category: string) => {
    const scores: Record<string, number> = {
      'grammar': 0.85,
      'vocabulary': 0.78,
      'reading': 0.82,
      'writing': 0.70,
      'speaking': 0.65,
      'listening': 0.75,
      'citizenship': 0.90,
      'culture': 0.80
    };
    
    return scores[category] || 0.75;
  };

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (isLoading) {
    return (
      <div className="container py-8 max-w-3xl mx-auto">
        <Card className="w-full">
          <CardContent className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <p className="text-muted-foreground">Loading today's question...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (hasCompletedToday && isCorrect !== null) {
    return (
      <div className="container py-8 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold">Daily Question Complete</CardTitle>
                <CardDescription>You've already completed today's question</CardDescription>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {today}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={`p-6 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center gap-3 mb-4">
                {isCorrect ? (
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <X className="h-6 w-6 text-red-600" />
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-lg">
                    {isCorrect ? "Correct Answer!" : "Incorrect Answer"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isCorrect 
                      ? "Great job! You got it right." 
                      : "Keep practicing! You'll improve over time."}
                  </p>
                </div>
              </div>
              
              {todaysQuestion && (
                <div className="space-y-4 mt-4">
                  <div>
                    <h4 className="font-medium mb-1">Question:</h4>
                    <p>{todaysQuestion.question_text}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Your answer:</h4>
                    <p className={isCorrect ? "text-green-700" : "text-red-700"}>
                      {selectedAnswer}
                    </p>
                  </div>
                  
                  {!isCorrect && (
                    <div>
                      <h4 className="font-medium mb-1">Correct answer:</h4>
                      <p className="text-green-700">{todaysQuestion.correct_answer}</p>
                    </div>
                  )}
                  
                  {todaysQuestion.explanation && (
                    <div>
                      <h4 className="font-medium mb-1">Explanation:</h4>
                      <p className="text-sm text-muted-foreground">{todaysQuestion.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <Flame className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium">Current Streak</p>
                  <p className="text-sm text-muted-foreground">Keep practicing daily</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{streak} {streak === 1 ? 'day' : 'days'}</p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Come back tomorrow for a new question to maintain your streak!
              </p>
              
              {user?.isPremiumUser ? (
                <Button onClick={resetQuestion} variant="outline">
                  Reset Question (Premium Feature)
                </Button>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm">
                    <span className="font-medium">Want more questions per day?</span> Upgrade to premium for unlimited daily practice.
                  </p>
                  <Button className="mt-2 w-full" variant="secondary">
                    Upgrade to Premium
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">Question of the Day</CardTitle>
              <CardDescription>Test your Italian knowledge with today's challenge</CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {today}
            </Badge>
          </div>
        </CardHeader>
        
        {todaysQuestion ? (
          <>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <Badge className="capitalize" variant="outline">
                  {todaysQuestion.category}
                </Badge>
                <ConfidenceIndicator score={getConfidenceScore(todaysQuestion.category)} />
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">{todaysQuestion.question_text}</h3>
                  
                  <RadioGroup 
                    value={selectedAnswer || ''} 
                    onValueChange={setSelectedAnswer}
                    className="space-y-3"
                  >
                    {todaysQuestion.options?.map((option, index) => (
                      <div 
                        key={index}
                        className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent"
                      >
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                {streak > 0 && (
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                        <Flame className="h-4 w-4 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium">Current Streak</p>
                        <p className="text-sm text-muted-foreground">
                          Answer correctly to maintain your streak
                        </p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{streak} {streak === 1 ? 'day' : 'days'}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between pt-2">
              <Button 
                variant="ghost" 
                onClick={() => window.history.back()}
              >
                Back
              </Button>
              
              <Button 
                onClick={handleAnswerSubmit} 
                disabled={!selectedAnswer}
              >
                Submit Answer
              </Button>
            </CardFooter>
          </>
        ) : (
          <CardContent>
            <div className="text-center py-6">
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">No question available today</h3>
                  <p className="text-sm text-muted-foreground">
                    Please check back later. We're preparing a challenging question for you.
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                  className="mt-4"
                >
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default DailyQuestion;
