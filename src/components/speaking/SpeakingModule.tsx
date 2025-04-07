
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
import { Mic, MicOff, Play, Pause, RefreshCw } from 'lucide-react';

interface SpeakingExercise {
  id: string;
  title: string;
  prompt: string;
  example_audio?: string;
  model_text?: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeEstimate: number; // in minutes
  points: number;
  keywords?: string[];
  pronunciation_focus?: string[];
}

const SpeakingModule: React.FC = () => {
  const [exercises, setExercises] = useState<SpeakingExercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<SpeakingExercise | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('exercises');
  const [speakingProgress, setSpeakingProgress] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { hasReachedLimit, getLimit, incrementUsage } = useFeatureLimits();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [exampleAudioUrl, setExampleAudioUrl] = useState<string | null>(null);
  const [isExamplePlaying, setIsExamplePlaying] = useState(false);
  const exampleAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setIsLoading(true);
        
        // Using Supabase client to fetch speaking exercises
        const { data, error } = await supabase
          .from('learning_content')
          .select('*')
          .eq('content_type', 'speaking')
          .order('difficulty', { ascending: true });
          
        if (error) throw error;
        
        // Transform data to match our SpeakingExercise interface
        const transformedData: SpeakingExercise[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          prompt: item.content.prompt,
          example_audio: item.content.example_audio,
          model_text: item.content.model_text,
          level: item.content.level || 'B1',
          difficulty: item.difficulty || 'intermediate',
          timeEstimate: item.content.timeEstimate || 5,
          points: item.content.points || 10,
          keywords: item.content.keywords || [],
          pronunciation_focus: item.content.pronunciation_focus || []
        }));
        
        setExercises(transformedData);
        
        // Fetch user progress for the speaking module
        if (user) {
          const { data: progressData, error: progressError } = await supabase
            .from('user_progress')
            .select('progress_percentage')
            .eq('user_id', user.id)
            .eq('content_type', 'speaking')
            .single();
            
          if (!progressError && progressData) {
            setSpeakingProgress(progressData.progress_percentage);
          }
        }
      } catch (error) {
        console.error('Error fetching speaking exercises:', error);
        toast({
          title: "Error loading exercises",
          description: "Failed to load speaking exercises. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [user, toast]);

  const handleSelectExercise = async (exercise: SpeakingExercise) => {
    if (hasReachedLimit('speakingExercises')) {
      toast({
        title: "Daily limit reached",
        description: `You've reached your daily limit of ${getLimit('speakingExercises')} speaking exercises. Upgrade to premium for unlimited access.`,
        variant: "destructive",
      });
      return;
    }
    
    setSelectedExercise(exercise);
    setAudioUrl(null);
    setAudioBlob(null);
    setSubmitted(false);
    setFeedback(null);
    setActiveTab('exercise');
    incrementUsage('speakingExercises');
    
    // Load example audio if available
    if (exercise.example_audio) {
      try {
        // In a real app, this would download from storage
        // Here we'll just set it directly
        setExampleAudioUrl(exercise.example_audio);
      } catch (err) {
        console.error('Error loading example audio:', err);
        setExampleAudioUrl(null);
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setAudioBlob(audioBlob);
        
        // Release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone.",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      toast({
        title: "Recording stopped",
        description: "Your recording has been saved.",
      });
    }
  };

  const handlePlayRecording = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePlayExampleAudio = () => {
    if (exampleAudioRef.current && exampleAudioUrl) {
      if (isExamplePlaying) {
        exampleAudioRef.current.pause();
      } else {
        exampleAudioRef.current.play();
      }
      setIsExamplePlaying(!isExamplePlaying);
    }
  };

  const handleSubmit = async () => {
    if (!selectedExercise || !audioBlob) return;
    
    setSubmitted(true);
    
    try {
      // In a real implementation, this would upload the audio to a server for analysis
      // and use a speech recognition API to analyze pronunciation, etc.
      
      // Simulate AI feedback with a timeout
      setTimeout(() => {
        const simulatedFeedback = `
          Your pronunciation is good overall. 
          
          Strengths:
          - Clear pronunciation of most words
          - Good intonation for questions
          - Natural speaking pace
          
          Areas to improve:
          - Pay attention to the "r" sound in Italian words
          - Try to use more connecting phrases between ideas
          - Some vowel sounds could be more precise
          
          Overall score: B1 level demonstrated
        `;
        
        setFeedback(simulatedFeedback);
      }, 2000);
      
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
            content_type: 'speaking',
            score: 80, // Simulated score
            completed: true,
            answers: [],
            progress_percentage: 80
          };
          
          if (fetchError || !existingProgress) {
            // Create new progress entry
            await supabase
              .from('user_progress')
              .insert([progressData]);
          } else {
            // Update existing progress if the new score is better
            if (80 > existingProgress.score) {
              await supabase
                .from('user_progress')
                .update(progressData)
                .eq('id', existingProgress.id);
            }
          }
          
          // Update overall speaking progress
          const { data: allProgress, error: allProgressError } = await supabase
            .from('user_progress')
            .select('score')
            .eq('user_id', user.id)
            .eq('content_type', 'speaking');
            
          if (!allProgressError && allProgress && allProgress.length > 0) {
            const averageScore = allProgress.reduce((sum, item) => sum + item.score, 0) / allProgress.length;
            setSpeakingProgress(averageScore);
            
            await supabase
              .from('user_stats')
              .update({ speaking_score: averageScore })
              .eq('user_id', user.id);
          }
        } catch (error) {
          console.error('Error updating progress:', error);
        }
      }
    } catch (error) {
      console.error('Error submitting speaking response:', error);
      toast({
        title: "Error",
        description: "Failed to analyze your speaking. Please try again.",
        variant: "destructive",
      });
      setSubmitted(false);
    }
  };

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setIsPlaying(false);
  };

  // Clean up audio URLs when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Handle audio playback ended events
  useEffect(() => {
    const handleAudioEnded = () => {
      setIsPlaying(false);
    };
    
    const handleExampleAudioEnded = () => {
      setIsExamplePlaying(false);
    };
    
    const currentAudioRef = audioRef.current;
    const currentExampleAudioRef = exampleAudioRef.current;
    
    if (currentAudioRef) {
      currentAudioRef.addEventListener('ended', handleAudioEnded);
    }
    
    if (currentExampleAudioRef) {
      currentExampleAudioRef.addEventListener('ended', handleExampleAudioEnded);
    }
    
    return () => {
      if (currentAudioRef) {
        currentAudioRef.removeEventListener('ended', handleAudioEnded);
      }
      
      if (currentExampleAudioRef) {
        currentExampleAudioRef.removeEventListener('ended', handleExampleAudioEnded);
      }
    };
  }, []);

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
          <h1 className="text-3xl font-bold">Speaking Practice</h1>
          <p className="text-muted-foreground">Improve your Italian speaking skills</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Overall progress:</span>
            <span className="text-sm font-bold">{Math.round(speakingProgress)}%</span>
          </div>
          <Progress value={speakingProgress} className="w-40 h-2" />
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
                    <p className="line-clamp-2 text-sm mb-4">{exercise.prompt.substring(0, 100)}...</p>
                    <Button onClick={() => handleSelectExercise(exercise)}>Start Exercise</Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No speaking exercises available.</p>
              </div>
            )}
          </div>
          
          <div className="border-t border-border pt-4 mt-8">
            <h2 className="text-xl font-bold mb-4">Speaking Progress</h2>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span>Overall Speaking Skill</span>
                <div className="flex items-center gap-2">
                  <Progress value={speakingProgress} className="w-40 h-2" />
                  <span className="min-w-[40px] text-right">{Math.round(speakingProgress)}%</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Complete more exercises to improve your speaking skills and track your progress toward CILS B1 proficiency.
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
                    <p className="whitespace-pre-line">{selectedExercise.prompt}</p>
                  </div>
                  
                  {selectedExercise.model_text && (
                    <div className="space-y-2">
                      <h3 className="text-md font-medium">Model Text:</h3>
                      <p className="text-sm p-3 bg-accent/30 rounded-md italic">
                        {selectedExercise.model_text}
                      </p>
                    </div>
                  )}
                  
                  {exampleAudioUrl && (
                    <div className="space-y-2">
                      <h3 className="text-md font-medium">Example Audio:</h3>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handlePlayExampleAudio}
                        >
                          {isExamplePlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                          {isExamplePlaying ? 'Pause' : 'Play Example'}
                        </Button>
                        <audio ref={exampleAudioRef} src={exampleAudioUrl} className="hidden" />
                      </div>
                    </div>
                  )}
                  
                  {selectedExercise.pronunciation_focus && selectedExercise.pronunciation_focus.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-md font-medium">Focus on these sounds:</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedExercise.pronunciation_focus.map((sound, index) => (
                          <span key={index} className="px-2 py-1 bg-primary/10 rounded-md text-sm">
                            {sound}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <h3 className="text-md font-medium">Your Response:</h3>
                    
                    {!audioUrl ? (
                      <div className="flex justify-center gap-4">
                        <Button
                          onClick={isRecording ? stopRecording : startRecording}
                          variant={isRecording ? "destructive" : "default"}
                          disabled={submitted}
                        >
                          {isRecording ? (
                            <>
                              <MicOff className="mr-2 h-4 w-4" />
                              Stop Recording
                            </>
                          ) : (
                            <>
                              <Mic className="mr-2 h-4 w-4" />
                              Start Recording
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-center gap-4">
                          <Button
                            onClick={handlePlayRecording}
                            variant="outline"
                            disabled={submitted}
                          >
                            {isPlaying ? (
                              <>
                                <Pause className="mr-2 h-4 w-4" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 h-4 w-4" />
                                Play Recording
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={resetRecording}
                            variant="outline"
                            disabled={submitted}
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Record Again
                          </Button>
                          <audio ref={audioRef} src={audioUrl} className="hidden" />
                        </div>
                        
                        {!submitted && (
                          <Button onClick={handleSubmit}>
                            Submit Recording
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {submitted && !feedback && (
                    <div className="flex justify-center p-4">
                      <Spinner />
                      <span className="ml-2">Analyzing your pronunciation...</span>
                    </div>
                  )}
                  
                  {feedback && (
                    <div className="p-4 bg-accent rounded-md">
                      <h3 className="text-lg font-medium mb-2">Feedback</h3>
                      <div className="whitespace-pre-line text-sm mb-4">{feedback}</div>
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

export default SpeakingModule;
