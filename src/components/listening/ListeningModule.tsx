
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useFeatureLimits } from '@/hooks/useFeatureLimits';
import { PlayCircle, PauseCircle, SkipForward, RotateCcw, Volume2, CheckCircle2, XCircle, HelpCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';

interface ListeningExercise {
  id: string;
  title: string;
  audioUrl: string;
  transcript: string;
  questions: Array<{
    id: string;
    question: string;
    options: Array<{
      id: string;
      text: string;
    }>;
    correctAnswer: string;
  }>;
  difficulty: string;
  isPremium: boolean;
}

const ListeningModule: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);
  const { hasReachedLimit, getLimit, getUsage, incrementUsage } = useFeatureLimits();
  
  const [exercises, setExercises] = useState<ListeningExercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  
  // Load exercises from database
  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('learning_content')
          .select('*')
          .eq('content_type', 'listening')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Transform the data to match our interface
          const transformedExercises: ListeningExercise[] = data.map(item => ({
            id: item.id,
            title: item.title,
            audioUrl: item.content.audioUrl || '',
            transcript: item.content.transcript || '',
            questions: item.content.questions || [],
            difficulty: item.difficulty || 'intermediate',
            isPremium: item.premium || false
          }));
          
          setExercises(transformedExercises);
        } else {
          // Load fallback exercise if no data available
          const fallbackExercise: ListeningExercise = {
            id: 'fallback',
            title: 'At the Restaurant',
            audioUrl: 'https://storage.googleapis.com/cils-learning/audio/restaurant_conversation.mp3',
            transcript: 'Buongiorno, posso avere un tavolo per due persone? Certamente, seguitemi per favore. Grazie. Ecco il menu. Cosa desidera ordinare?',
            questions: [
              {
                id: 'q1',
                question: 'Where is the conversation taking place?',
                options: [
                  { id: 'a', text: 'At a hotel' },
                  { id: 'b', text: 'At a restaurant' },
                  { id: 'c', text: 'At a shop' },
                  { id: 'd', text: 'At a train station' }
                ],
                correctAnswer: 'b'
              },
              {
                id: 'q2',
                question: 'How many people need a table?',
                options: [
                  { id: 'a', text: 'One person' },
                  { id: 'b', text: 'Two people' },
                  { id: 'c', text: 'Three people' },
                  { id: 'd', text: 'Four people' }
                ],
                correctAnswer: 'b'
              }
            ],
            difficulty: 'beginner',
            isPremium: false
          };
          
          setExercises([fallbackExercise]);
        }
      } catch (error) {
        console.error('Error fetching listening exercises:', error);
        toast({
          title: 'Error',
          description: 'Failed to load listening exercises. Please try again later.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExercises();
  }, [toast]);
  
  // Update audio playing state
  useEffect(() => {
    const audio = audioRef.current;
    
    if (!audio) return;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(100);
    };
    const handleTimeUpdate = () => {
      const currentProgress = (audio.currentTime / audio.duration) * 100;
      setProgress(currentProgress);
    };
    
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [currentExerciseIndex]);
  
  // Reset state when changing exercises
  useEffect(() => {
    setShowTranscript(false);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
    setProgress(0);
    setScore({ correct: 0, total: 0 });
    
    // Attempt to load audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
    }
  }, [currentExerciseIndex]);
  
  const currentExercise = exercises[currentExerciseIndex];
  const currentQuestion = currentExercise?.questions[currentQuestionIndex];
  
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };
  
  const restartAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = 0;
    audio.play();
  };
  
  const forward10Seconds = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
  };
  
  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentExercise.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate score
      let correctAnswers = 0;
      currentExercise.questions.forEach(question => {
        if (selectedAnswers[question.id] === question.correctAnswer) {
          correctAnswers++;
        }
      });
      
      setScore({
        correct: correctAnswers,
        total: currentExercise.questions.length
      });
      
      setIsSubmitted(true);
      
      // Track usage
      incrementUsage('listeningExercises');
      
      // Update user stats in database
      updateUserStats(correctAnswers, currentExercise.questions.length);
    }
  };
  
  const updateUserStats = async (correct: number, total: number) => {
    if (!user) return;
    
    try {
      // Update user stats
      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (statsError && statsError.code !== 'PGRST116') {
        console.error('Error fetching user stats:', statsError);
        return;
      }
      
      if (stats) {
        // Update existing stats
        await supabase
          .from('user_stats')
          .update({
            questions_answered: stats.questions_answered + total,
            correct_answers: stats.correct_answers + correct,
            listening_score: stats.listening_score 
              ? Math.round((stats.listening_score + (correct / total * 100)) / 2) 
              : Math.round(correct / total * 100),
            last_activity_date: new Date().toISOString().split('T')[0]
          })
          .eq('user_id', user.id);
      } else {
        // Create new stats record
        await supabase
          .from('user_stats')
          .insert({
            user_id: user.id,
            questions_answered: total,
            correct_answers: correct,
            listening_score: Math.round(correct / total * 100),
            last_activity_date: new Date().toISOString().split('T')[0]
          });
      }
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  };
  
  const nextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      // Cycle back to first exercise
      setCurrentExerciseIndex(0);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading listening exercises...</p>
      </div>
    );
  }
  
  if (!currentExercise) {
    return (
      <div className="text-center py-8">
        <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No exercises found</h3>
        <p className="mt-2 text-muted-foreground">
          We couldn't find any listening exercises. Please try again later.
        </p>
      </div>
    );
  }
  
  if (hasReachedLimit('listeningExercises')) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Daily Limit Reached</CardTitle>
          <CardDescription>
            You've reached your daily limit of {getLimit('listeningExercises')} listening exercises.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="bg-muted p-4 rounded-lg mb-6">
            <p className="text-muted-foreground">
              You've completed {getUsage('listeningExercises')}/{getLimit('listeningExercises')} exercises today.
            </p>
            <p className="text-muted-foreground mt-2">
              Come back tomorrow for more exercises, or upgrade to Premium for unlimited access.
            </p>
          </div>
          <Button>Upgrade to Premium</Button>
        </CardContent>
      </Card>
    );
  }
  
  if (isSubmitted) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Results: {currentExercise.title}</CardTitle>
          <CardDescription>
            You scored {score.correct} out of {score.total}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span>Score</span>
              <span>{Math.round((score.correct / score.total) * 100)}%</span>
            </div>
            <Progress value={(score.correct / score.total) * 100} />
          </div>
          
          <div className="space-y-4">
            {currentExercise.questions.map((question, index) => {
              const isCorrect = selectedAnswers[question.id] === question.correctAnswer;
              
              return (
                <div 
                  key={question.id} 
                  className={`p-4 rounded-lg border ${
                    isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' : 
                    'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium mb-2">Question {index + 1}: {question.question}</p>
                      <p className="text-sm mb-1">Your answer: {
                        question.options.find(o => o.id === selectedAnswers[question.id])?.text || 'Not answered'
                      }</p>
                      {!isCorrect && (
                        <p className="text-sm text-green-600 dark:text-green-400">
                          Correct answer: {
                            question.options.find(o => o.id === question.correctAnswer)?.text
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {showTranscript ? (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Transcript</h3>
              <p className="text-sm">{currentExercise.transcript}</p>
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="mt-6 w-full" 
              onClick={() => setShowTranscript(true)}
            >
              Show Transcript
            </Button>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={nextExercise}>
            Next Exercise
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Listening Practice</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{currentExercise.title}</CardTitle>
          <CardDescription>
            Listen to the audio and answer the questions. {currentExercise.isPremium && '(Premium Content)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Audio player */}
          <div className="mb-6">
            <audio ref={audioRef} preload="metadata" className="hidden">
              <source src={currentExercise.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            
            <div className="mb-2">
              <Progress value={progress} />
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={restartAudio}
                title="Restart"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              
              <Button
                variant="default"
                size="icon"
                onClick={togglePlayPause}
                className="h-12 w-12 rounded-full"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <PauseCircle className="h-8 w-8" />
                ) : (
                  <PlayCircle className="h-8 w-8" />
                )}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={forward10Seconds}
                title="Forward 10 seconds"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Question */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">
              Question {currentQuestionIndex + 1} of {currentExercise.questions.length}: {currentQuestion.question}
            </h3>
            
            <RadioGroup
              value={selectedAnswers[currentQuestion.id] || ''}
              onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
              className="space-y-4"
            >
              {currentQuestion.options.map(option => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                  <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer py-2">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <Button
            variant="outline"
            onClick={() => setShowTranscript(!showTranscript)}
            disabled={isSubmitted}
          >
            <Volume2 className="h-4 w-4 mr-2" />
            {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
          </Button>
          
          <Button
            onClick={handleNextQuestion}
            disabled={!selectedAnswers[currentQuestion.id]}
          >
            {currentQuestionIndex < currentExercise.questions.length - 1 ? 'Next Question' : 'Submit Answers'}
          </Button>
        </CardFooter>
      </Card>
      
      {showTranscript && (
        <Card>
          <CardHeader>
            <CardTitle>Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{currentExercise.transcript}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ListeningModule;
