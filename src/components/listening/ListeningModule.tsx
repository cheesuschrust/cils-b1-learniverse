
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import Spinner from '@/components/ui/spinner';
import { useFeatureLimits } from '@/hooks/useFeatureLimits';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabase-client';
import { Play, Pause, Volume2, Volume, VolumeX } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ListeningQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
}

interface ListeningExercise {
  id: string;
  title: string;
  description: string;
  audio_url: string;
  transcript?: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeEstimate: number; // in minutes
  points: number;
  questions: ListeningQuestion[];
}

const ListeningModule: React.FC = () => {
  const [exercises, setExercises] = useState<ListeningExercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<ListeningExercise | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('exercises');
  const [listeningProgress, setListeningProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { hasReachedLimit, getLimit, incrementUsage } = useFeatureLimits();

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setIsLoading(true);
        
        // Using Supabase client to fetch listening exercises
        const { data, error } = await supabase
          .from('learning_content')
          .select('*')
          .eq('content_type', 'listening')
          .order('difficulty', { ascending: true });
          
        if (error) throw error;
        
        // Transform data to match our ListeningExercise interface
        const transformedData: ListeningExercise[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.content.description,
          audio_url: item.content.audio_url,
          transcript: item.content.transcript,
          level: item.content.level || 'B1',
          difficulty: item.difficulty || 'intermediate',
          timeEstimate: item.content.timeEstimate || 10,
          points: item.content.points || 10,
          questions: item.content.questions || []
        }));
        
        setExercises(transformedData);
        
        // Fetch user progress for the listening module
        if (user) {
          const { data: progressData, error: progressError } = await supabase
            .from('user_progress')
            .select('progress_percentage')
            .eq('user_id', user.id)
            .eq('content_type', 'listening')
            .single();
            
          if (!progressError && progressData) {
            setListeningProgress(progressData.progress_percentage);
          }
        }
      } catch (error) {
        console.error('Error fetching listening exercises:', error);
        toast({
          title: "Error loading exercises",
          description: "Failed to load listening exercises. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [user, toast]);

  const handleSelectExercise = (exercise: ListeningExercise) => {
    if (hasReachedLimit('listeningExercises')) {
      toast({
        title: "Daily limit reached",
        description: `You've reached your daily limit of ${getLimit('listeningExercises')} listening exercises. Upgrade to premium for unlimited access.`,
        variant: "destructive",
      });
      return;
    }
    
    setSelectedExercise(exercise);
    setUserAnswers({});
    setSubmitted(false);
    setScore(null);
    setActiveTab('exercise');
    setShowTranscript(false);
    incrementUsage('listeningExercises');
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const togglePlayAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleSubmit = async () => {
    if (!selectedExercise) return;
    
    // Check if all questions have been answered
    const unansweredQuestions = selectedExercise.questions.filter(
      q => !userAnswers[q.id]
    );
    
    if (unansweredQuestions.length > 0) {
      toast({
        title: "Incomplete",
        description: "Please answer all questions before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    setSubmitted(true);
    
    // Calculate score
    let correctCount = 0;
    selectedExercise.questions.forEach(question => {
      if (userAnswers[question.id] === question.correct_answer) {
        correctCount++;
      }
    });
    
    const calculatedScore = Math.round((correctCount / selectedExercise.questions.length) * 100);
    setScore(calculatedScore);
    
    // Update user progress
    if (user) {
      try {
        const { data: existingProgress, error: fetchError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('content_id', selectedExercise.id)
          .single();
          
        const progressData = {
          user_id: user.id,
          content_id: selectedExercise.id,
          content_type: 'listening',
          score: calculatedScore,
          completed: true,
          answers: userAnswers,
          progress_percentage: calculatedScore
        };
        
        if (fetchError || !existingProgress) {
          // Create new progress entry
          await supabase
            .from('user_progress')
            .insert([progressData]);
        } else {
          // Update existing progress if the new score is better
          if (calculatedScore > existingProgress.score) {
            await supabase
              .from('user_progress')
              .update(progressData)
              .eq('id', existingProgress.id);
          }
        }
        
        // Update overall listening progress
        const { data: allProgress, error: allProgressError } = await supabase
          .from('user_progress')
          .select('score')
          .eq('user_id', user.id)
          .eq('content_type', 'listening');
          
        if (!allProgressError && allProgress && allProgress.length > 0) {
          const averageScore = allProgress.reduce((sum, item) => sum + item.score, 0) / allProgress.length;
          setListeningProgress(averageScore);
          
          await supabase
            .from('user_stats')
            .update({ listening_score: averageScore })
            .eq('user_id', user.id);
        }
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);
      
      audioElement.addEventListener('play', handlePlay);
      audioElement.addEventListener('pause', handlePause);
      audioElement.addEventListener('ended', handleEnded);
      
      // Set initial volume
      audioElement.volume = volume;
      
      return () => {
        audioElement.removeEventListener('play', handlePlay);
        audioElement.removeEventListener('pause', handlePause);
        audioElement.removeEventListener('ended', handleEnded);
      };
    }
  }, [selectedExercise, volume]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Listening Practice</h1>
          <p className="text-muted-foreground">Improve your Italian listening comprehension</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Overall progress:</span>
            <span className="text-sm font-bold">{Math.round(listeningProgress)}%</span>
          </div>
          <Progress value={listeningProgress} className="w-40 h-2" />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
          <TabsTrigger value="exercise" disabled={!selectedExercise}>Current Exercise</TabsTrigger>
        </TabsList>
        
        <TabsContent value="exercises" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercises.length > 0 ? (
              exercises.map((exercise) => (
                <Card key={exercise.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{exercise.title}</CardTitle>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Level: {exercise.level}</span>
                      <span>{exercise.timeEstimate} min</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm mb-4">{exercise.description.substring(0, 100)}...</p>
                    <Button onClick={() => handleSelectExercise(exercise)}>Start Exercise</Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No listening exercises available.</p>
              </div>
            )}
          </div>
          
          <div className="border-t border-border pt-4 mt-8">
            <h2 className="text-xl font-bold mb-4">Listening Progress</h2>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span>Overall Listening Skill</span>
                <div className="flex items-center gap-2">
                  <Progress value={listeningProgress} className="w-40 h-2" />
                  <span className="min-w-[40px] text-right">{Math.round(listeningProgress)}%</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Complete more exercises to improve your listening skills and track your progress toward CILS B1 proficiency.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="exercise">
          {selectedExercise && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedExercise.title}</CardTitle>
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    <span>Level: {selectedExercise.level}</span>
                    <span>•</span>
                    <span>{selectedExercise.timeEstimate} minutes</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-muted/50 rounded-md">
                    <p className="whitespace-pre-line">{selectedExercise.description}</p>
                  </div>
                  
                  <div className="bg-primary/5 rounded-md p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Button
                        onClick={togglePlayAudio}
                        variant="outline"
                        className="flex-shrink-0"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="mr-2 h-4 w-4" />
                            Pause Audio
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Play Audio
                          </>
                        )}
                      </Button>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleVolumeChange(0)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          <VolumeX className="h-4 w-4" />
                        </button>
                        <div className="w-20 h-1 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${volume * 100}%` }}
                          />
                        </div>
                        <button
                          onClick={() => handleVolumeChange(1)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <audio 
                      ref={audioRef} 
                      src={selectedExercise.audio_url}
                      className="w-full"
                      controls={false}
                    />
                  </div>
                  
                  <div className="space-y-6">
                    {selectedExercise.questions.map((question, idx) => (
                      <div key={question.id} className="space-y-4">
                        <h3 className="font-medium">
                          Question {idx + 1}: {question.question}
                        </h3>
                        <RadioGroup
                          value={userAnswers[question.id] || ""}
                          onValueChange={(value) => handleAnswerChange(question.id, value)}
                          disabled={submitted}
                        >
                          {question.options.map((option, optionIdx) => (
                            <div key={optionIdx} className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={option}
                                id={`q${idx}-option${optionIdx}`}
                              />
                              <Label 
                                htmlFor={`q${idx}-option${optionIdx}`}
                                className={
                                  submitted && option === question.correct_answer
                                    ? "text-green-600 dark:text-green-400 font-medium"
                                    : submitted && userAnswers[question.id] === option && option !== question.correct_answer
                                    ? "text-red-600 dark:text-red-400 line-through"
                                    : ""
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
                  
                  {!submitted ? (
                    <Button onClick={handleSubmit} className="mt-4">
                      Submit Answers
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-accent rounded-md">
                        <h3 className="text-lg font-medium mb-2">Your Results</h3>
                        <p className="mb-2">
                          Your score: <span className="font-bold">{score}%</span>
                        </p>
                        {score && score >= 70 ? (
                          <p className="text-green-600 dark:text-green-400">
                            Great job! You've demonstrated good listening comprehension.
                          </p>
                        ) : (
                          <p className="text-amber-600 dark:text-amber-400">
                            Keep practicing! Try listening to the audio again and check where you made mistakes.
                          </p>
                        )}
                      </div>
                      
                      {selectedExercise.transcript && (
                        <div>
                          <Button 
                            variant="outline" 
                            onClick={() => setShowTranscript(!showTranscript)}
                          >
                            {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
                          </Button>
                          
                          {showTranscript && (
                            <div className="mt-4 p-4 bg-muted/50 rounded-md">
                              <h3 className="font-medium mb-2">Transcript:</h3>
                              <p className="whitespace-pre-line">{selectedExercise.transcript}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <Button 
                        onClick={() => {
                          setActiveTab('exercises');
                          setSelectedExercise(null);
                        }}
                      >
                        Back to Exercises
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ListeningModule;
