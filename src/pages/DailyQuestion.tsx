
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useDailyQuestion } from '@/hooks/useDailyQuestion';
import { useAuth } from '@/contexts/AuthContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import ConfidenceIndicator from '@/components/ai/ConfidenceIndicator';
import { useGamificationContext } from '@/contexts/GamificationContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, CheckCircle2, Clock, Flame, LockIcon, Star, Trophy, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuestionContent = ({ 
  question, 
  selectedAnswer, 
  setSelectedAnswer, 
  isCompleted, 
  isCorrect 
}: {
  question: any;
  selectedAnswer: string | null;
  setSelectedAnswer: (value: string | null) => void;
  isCompleted: boolean;
  isCorrect: boolean | null;
}) => {
  if (!question) return null;

  switch (question.question_type || 'multiple_choice') {
    case 'multiple_choice':
      return (
        <RadioGroup 
          value={selectedAnswer || ''} 
          onValueChange={setSelectedAnswer}
          className="space-y-3"
          disabled={isCompleted}
        >
          {question.options?.map((option: string, index: number) => (
            <div 
              key={index}
              className={`flex items-center space-x-2 border rounded-md p-3 hover:bg-accent ${
                isCompleted && option === question.correct_answer ? 'border-green-500 bg-green-50' :
                isCompleted && option === selectedAnswer ? 'border-red-500 bg-red-50' : ''
              }`}
            >
              <RadioGroupItem value={option} id={`option-${index}`} disabled={isCompleted} />
              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                {option}
              </Label>
              {isCompleted && option === question.correct_answer && (
                <CheckCircle2 className="h-4 w-4 text-green-500 ml-2" />
              )}
            </div>
          ))}
        </RadioGroup>
      );
      
    case 'fill_blank':
      return (
        <div className="space-y-4">
          <div dangerouslySetInnerHTML={{ __html: question.question_text.replace('___', '<span class="px-2 pb-1 mx-2 border-b-2 border-dashed">_______</span>') }} />
          {!isCompleted ? (
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={selectedAnswer || ''}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              placeholder="Type your answer here..."
            />
          ) : (
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="font-medium">Your answer:</div>
              <div className={`mt-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {selectedAnswer}
              </div>
              {!isCorrect && (
                <div className="mt-3">
                  <div className="font-medium">Correct answer:</div>
                  <div className="mt-1 text-green-600">
                    {question.correct_answer}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      );
    
    case 'reorder':
      // In a real implementation, this would use a drag-and-drop library
      return (
        <div className="space-y-4">
          <p>{question.question_text}</p>
          <div className="space-y-2">
            {isCompleted ? (
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="font-medium">The correct order is:</div>
                <ol className="mt-2 list-decimal list-inside">
                  {question.correct_answer.split('|').map((item: string, index: number) => (
                    <li key={index} className="text-green-600">{item}</li>
                  ))}
                </ol>
              </div>
            ) : (
              question.options?.map((option: string, index: number) => (
                <div 
                  key={index}
                  className="p-3 border rounded-md cursor-move bg-white flex justify-between items-center"
                >
                  <span>{option}</span>
                  <span className="text-gray-400">{index + 1}</span>
                </div>
              ))
            )}
          </div>
        </div>
      );
      
    case 'listening':
      return (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md flex justify-center items-center h-24">
            <Button disabled={isCompleted} className="flex items-center gap-2">
              <span className="i-lucide-play h-5 w-5" />
              Play Audio
            </Button>
          </div>
          <p>{question.question_text}</p>
          <RadioGroup 
            value={selectedAnswer || ''} 
            onValueChange={setSelectedAnswer}
            className="space-y-3"
            disabled={isCompleted}
          >
            {question.options?.map((option: string, index: number) => (
              <div 
                key={index}
                className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent"
              >
                <RadioGroupItem value={option} id={`option-${index}`} disabled={isCompleted} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );
      
    default:
      return (
        <div className="space-y-4">
          <p>{question.question_text}</p>
          <RadioGroup 
            value={selectedAnswer || ''} 
            onValueChange={setSelectedAnswer}
            className="space-y-3"
            disabled={isCompleted}
          >
            {question.options?.map((option: string, index: number) => (
              <div 
                key={index}
                className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent"
              >
                <RadioGroupItem value={option} id={`option-${index}`} disabled={isCompleted} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );
  }
};

const DailyQuestion: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { addXP, showAchievementUnlock } = useGamificationContext();
  const [showExplanation, setShowExplanation] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  
  const {
    todaysQuestion,
    isLoading,
    hasCompletedToday,
    submitAnswer,
    streak,
    resetQuestion,
    isCorrect,
    selectedAnswer,
    setSelectedAnswer,
    questionsRemaining,
    dailyLimit,
    isLimitReached
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

    // Add XP through the gamification context
    addXP(correct ? 10 : 5, 'daily_question');
    
    // Simulate achievement unlocking for streak milestones
    if (streak > 0) {
      if (streak === 7) {
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
      } else if (streak === 30) {
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
    
    return scores[category.toLowerCase()] || 0.75;
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
  
  if (isLimitReached) {
    return (
      <div className="container py-8 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Daily Limit Reached</CardTitle>
            <CardDescription>You've reached your daily question limit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 rounded-lg bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <LockIcon className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Free User Limit</h3>
                  <p className="text-sm text-muted-foreground">
                    You've answered {dailyLimit} questions today, which is the daily limit for free users.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Daily Question Progress</div>
                  <Progress value={100} className="h-2" />
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>0</span>
                    <span className="font-medium">{dailyLimit}/{dailyLimit}</span>
                  </div>
                </div>
                
                <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full">Upgrade to Premium</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Unlock Premium Features</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <p>With our premium subscription, you get:</p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Unlimited daily questions</li>
                        <li>Streak protection for up to 3 days</li>
                        <li>Advanced progress analytics</li>
                        <li>Access to all content categories</li>
                        <li>Ad-free experience</li>
                      </ul>
                      <div className="flex justify-between items-center pt-4">
                        <span className="text-2xl font-bold">€9.99/month</span>
                        <Button>Subscribe Now</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
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
                Come back tomorrow for more questions or upgrade to premium for unlimited access!
              </p>
              <div className="flex flex-col md:flex-row gap-3 justify-center">
                <Button variant="outline" asChild>
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/progress">View Progress</Link>
                </Button>
              </div>
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
                <CardDescription>You've answered this question</CardDescription>
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
                  
                  <QuestionContent 
                    question={todaysQuestion} 
                    selectedAnswer={selectedAnswer} 
                    setSelectedAnswer={setSelectedAnswer}
                    isCompleted={true}
                    isCorrect={isCorrect}
                  />
                  
                  {todaysQuestion.explanation && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
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
            
            <div>
              <div className="text-sm text-muted-foreground mb-2">Daily Questions ({questionsRemaining} remaining)</div>
              <Progress 
                value={((dailyLimit - questionsRemaining) / dailyLimit) * 100} 
                className="h-2" 
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>0</span>
                <span className="font-medium">{dailyLimit - questionsRemaining}/{dailyLimit}</span>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                {questionsRemaining > 0 ? (
                  "You still have more questions available today!"
                ) : (
                  "Come back tomorrow for a new question to maintain your streak!"
                )}
              </p>
              
              <div className="flex flex-col md:flex-row gap-3 justify-center">
                {questionsRemaining > 0 ? (
                  <Button asChild>
                    <Link to="/daily-questions/next">Next Question</Link>
                  </Button>
                ) : (
                  user?.isPremiumUser ? (
                    <Button onClick={resetQuestion} variant="outline">
                      Reset Question (Premium Feature)
                    </Button>
                  ) : (
                    <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
                      <DialogTrigger asChild>
                        <Button>Get More Questions</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Unlock Premium Features</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <p>With our premium subscription, you get:</p>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Unlimited daily questions</li>
                            <li>Streak protection for up to 3 days</li>
                            <li>Advanced progress analytics</li>
                            <li>Access to all content categories</li>
                            <li>Ad-free experience</li>
                          </ul>
                          <div className="flex justify-between items-center pt-4">
                            <span className="text-2xl font-bold">€9.99/month</span>
                            <Button>Subscribe Now</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )
                )}
                <Button variant="outline" asChild>
                  <Link to="/dashboard">Back to Dashboard</Link>
                </Button>
              </div>
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
                  
                  <QuestionContent 
                    question={todaysQuestion} 
                    selectedAnswer={selectedAnswer} 
                    setSelectedAnswer={setSelectedAnswer}
                    isCompleted={false}
                    isCorrect={null}
                  />
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
                
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Daily Questions ({questionsRemaining} remaining)</div>
                  <Progress 
                    value={((dailyLimit - questionsRemaining) / dailyLimit) * 100} 
                    className="h-2" 
                  />
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>0</span>
                    <span className="font-medium">{dailyLimit - questionsRemaining}/{dailyLimit}</span>
                  </div>
                </div>
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
