
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useFeatureLimits } from '@/hooks/useFeatureLimits';
import { Volume2, VolumeX, Play, Pause, SkipForward, SkipBack, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';

interface ListeningExercise {
  id: string;
  title: string;
  audioUrl: string;
  transcript: string;
  questions: {
    id: string;
    text: string;
    options: string[];
    correctAnswer: number;
  }[];
  difficulty: string;
  isPremium: boolean;
}

const ListeningModule: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { hasReachedLimit, getLimit, getUsage, incrementUsage } = useFeatureLimits();
  
  const [exercises, setExercises] = useState<ListeningExercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState<number | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
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
            audioUrl: 'https://example.com/sample-audio.mp3',
            transcript: 'Buongiorno! Vorrei prenotare un tavolo per due persone per stasera alle otto, per favore.',
            questions: [
              {
                id: '1',
                text: 'What is the person trying to do?',
                options: [
                  'Order food',
                  'Reserve a table',
                  'Pay the bill',
                  'Ask for directions'
                ],
                correctAnswer: 1
              },
              {
                id: '2',
                text: 'For how many people is the reservation?',
                options: [
                  'One',
                  'Two',
                  'Three',
                  'Four'
                ],
                correctAnswer: 1
              },
              {
                id: '3',
                text: 'What time is the reservation for?',
                options: [
                  '7:00',
                  '7:30',
                  '8:00',
                  '8:30'
                ],
                correctAnswer: 2
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
  
  // Reset state when changing exercises
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setSelectedAnswers([]);
    setIsSubmitted(false);
    setScore(null);
    setShowTranscript(false);
  }, [currentExerciseIndex]);
  
  // Audio time update handler
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  // Audio loaded metadata handler
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  // Play/pause audio
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Fast forward 10 seconds
  const fastForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 10;
    }
  };
  
  // Rewind 10 seconds
  const rewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 10;
    }
  };
  
  // Handle seeking on progress bar
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  // Handle answer selection
  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    if (isSubmitted) return;
    
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };
  
  // Submit answers
  const submitAnswers = async () => {
    const currentExercise = exercises[currentExerciseIndex];
    
    // Check if all questions are answered
    if (selectedAnswers.length !== currentExercise.questions.length || 
        selectedAnswers.some(answer => answer === undefined)) {
      toast({
        title: 'Please answer all questions',
        description: 'You need to answer all questions before submitting.',
        variant: 'destructive'
      });
      return;
    }
    
    // Calculate score
    let correctCount = 0;
    currentExercise.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    const scorePercentage = Math.round((correctCount / currentExercise.questions.length) * 100);
    setScore(scorePercentage);
    setIsSubmitted(true);
    
    // Track usage
    incrementUsage('listeningExercises');
    
    // Update user stats in database
    if (user) {
      try {
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
              questions_answered: stats.questions_answered + currentExercise.questions.length,
              correct_answers: stats.correct_answers + correctCount,
              listening_score: stats.listening_score 
                ? Math.round((stats.listening_score + scorePercentage) / 2) 
                : scorePercentage,
              last_activity_date: new Date().toISOString().split('T')[0]
            })
            .eq('user_id', user.id);
        } else {
          // Create new stats record
          await supabase
            .from('user_stats')
            .insert({
              user_id: user.id,
              questions_answered: currentExercise.questions.length,
              correct_answers: correctCount,
              listening_score: scorePercentage,
              last_activity_date: new Date().toISOString().split('T')[0]
            });
        }
        
        // Add progress record
        await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            content_id: currentExercise.id,
            score: scorePercentage,
            completed: true,
            progress_percentage: 100,
            answers: selectedAnswers
          });
          
      } catch (error) {
        console.error('Error updating user stats:', error);
      }
    }
  };
  
  // Next exercise
  const nextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      // Cycle back to first exercise
      setCurrentExerciseIndex(0);
    }
  };
  
  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading listening exercises...</p>
      </div>
    );
  }
  
  if (exercises.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">No exercises found</h3>
        <p className="mt-2 text-muted-foreground">
          We couldn't find any listening exercises. Please try again later.
        </p>
      </div>
    );
  }
  
  const currentExercise = exercises[currentExerciseIndex];
  
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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Listening Practice</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{currentExercise.title}</CardTitle>
          <CardDescription>
            Listen carefully and answer the questions. {currentExercise.isPremium && '(Premium Content)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <audio 
              ref={audioRef}
              src={currentExercise.audioUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            
            <div className="flex items-center justify-center space-x-4 mb-4">
              <Button 
                variant="outline"
                size="icon"
                onClick={rewind}
                disabled={currentTime < 10}
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="default"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={togglePlayPause}
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
              </Button>
              
              <Button 
                variant="outline"
                size="icon"
                onClick={fastForward}
                disabled={currentTime > duration - 10}
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="px-2"
                onClick={() => audioRef.current && (audioRef.current.volume = Math.max(0, audioRef.current.volume - 0.1))}
              >
                <VolumeX className="h-4 w-4" />
              </Button>
              
              <div className="flex-1">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="px-2"
                onClick={() => audioRef.current && (audioRef.current.volume = Math.min(1, audioRef.current.volume + 0.1))}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
              
              <span className="text-sm font-mono w-16 text-right">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>
          
          {isSubmitted && (
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => setShowTranscript(!showTranscript)}
                className="mb-4"
              >
                {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
              </Button>
              
              {showTranscript && (
                <div className="p-4 border rounded-md bg-muted">
                  <h3 className="font-medium mb-2">Transcript:</h3>
                  <p>{currentExercise.transcript}</p>
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-6">
            <h3 className="text-lg font-medium mb-4">Questions</h3>
            
            {currentExercise.questions.map((question, questionIndex) => (
              <div key={question.id} className="space-y-3">
                <h4 className="font-medium">
                  {questionIndex + 1}. {question.text}
                </h4>
                
                <RadioGroup 
                  value={selectedAnswers[questionIndex]?.toString()}
                  onValueChange={(value) => handleAnswerSelect(questionIndex, parseInt(value))}
                  disabled={isSubmitted}
                >
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={optionIndex.toString()}
                        id={`q${questionIndex}-o${optionIndex}`}
                        className={
                          isSubmitted
                            ? optionIndex === question.correctAnswer
                              ? 'border-green-500 text-green-500'
                              : selectedAnswers[questionIndex] === optionIndex
                              ? 'border-red-500 text-red-500'
                              : ''
                            : ''
                        }
                      />
                      <Label
                        htmlFor={`q${questionIndex}-o${optionIndex}`}
                        className={
                          isSubmitted
                            ? optionIndex === question.correctAnswer
                              ? 'text-green-600 font-medium'
                              : selectedAnswers[questionIndex] === optionIndex
                              ? 'text-red-600'
                              : ''
                            : ''
                        }
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-4">
          {isSubmitted ? (
            <>
              <div>
                <p className="font-medium">
                  Your score: {score}%
                </p>
                {score !== null && (
                  <div className="w-full mt-2">
                    <Progress value={score} className="h-2" />
                  </div>
                )}
              </div>
              <Button onClick={nextExercise}>
                Next Exercise
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Listen to the audio and answer all questions before submitting.
              </p>
              <Button 
                onClick={submitAnswers}
                disabled={selectedAnswers.length !== currentExercise.questions.length || 
                          selectedAnswers.some(answer => answer === undefined)}
              >
                Submit Answers
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ListeningModule;
