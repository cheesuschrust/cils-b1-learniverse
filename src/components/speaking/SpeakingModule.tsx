
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useFeatureLimits } from '@/hooks/useFeatureLimits';
import { Mic, MicOff, Play, Square, ArrowRight, HelpCircle, Loader2, CheckCircle, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';

interface SpeakingExercise {
  id: string;
  title: string;
  prompt: string;
  exampleAudioUrl?: string;
  hints: string[];
  difficulty: string;
  isPremium: boolean;
}

const SpeakingModule: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { hasReachedLimit, getLimit, getUsage, incrementUsage } = useFeatureLimits();
  
  const [exercises, setExercises] = useState<SpeakingExercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Load exercises from database
  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('learning_content')
          .select('*')
          .eq('content_type', 'speaking')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Transform the data to match our interface
          const transformedExercises: SpeakingExercise[] = data.map(item => ({
            id: item.id,
            title: item.title,
            prompt: item.content.prompt || '',
            exampleAudioUrl: item.content.exampleAudioUrl,
            hints: item.content.hints || [],
            difficulty: item.difficulty || 'intermediate',
            isPremium: item.premium || false
          }));
          
          setExercises(transformedExercises);
        } else {
          // Load fallback exercise if no data available
          const fallbackExercise: SpeakingExercise = {
            id: 'fallback',
            title: 'Introducing Yourself',
            prompt: 'Introduce yourself in Italian. Tell us your name, where you are from, what you do, and one of your hobbies.',
            hints: [
              'Start with "Mi chiamo..." (My name is...)',
              'For where you are from: "Sono di..." (I am from...)',
              'For your job: "Lavoro come..." (I work as...)',
              'For hobbies: "Nel tempo libero mi piace..." (In my free time I like to...)'
            ],
            difficulty: 'beginner',
            isPremium: false
          };
          
          setExercises([fallbackExercise]);
        }
      } catch (error) {
        console.error('Error fetching speaking exercises:', error);
        toast({
          title: 'Error',
          description: 'Failed to load speaking exercises. Please try again later.',
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
    setIsRecording(false);
    setIsPlaying(false);
    setRecordedAudio(null);
    setRecordingTime(0);
    setConfidence(null);
    setIsSubmitted(false);
    setFeedback('');
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [currentExerciseIndex]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);
  
  const currentExercise = exercises[currentExerciseIndex];
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.addEventListener('dataavailable', event => {
        audioChunksRef.current.push(event.data);
      });
      
      mediaRecorderRef.current.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        setRecordedAudio(audioBlob);
        setIsRecording(false);
        
        // Stop all tracks in the stream to release the microphone
        stream.getTracks().forEach(track => track.stop());
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      });
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Microphone Access Denied',
        description: 'Please allow access to your microphone to use the speaking practice feature.',
        variant: 'destructive'
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };
  
  const playRecording = () => {
    if (!recordedAudio || !audioRef.current) return;
    
    const audioUrl = URL.createObjectURL(recordedAudio);
    audioRef.current.src = audioUrl;
    audioRef.current.play();
    setIsPlaying(true);
    
    audioRef.current.onended = () => {
      setIsPlaying(false);
      URL.revokeObjectURL(audioUrl);
    };
  };
  
  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };
  
  const submitRecording = async () => {
    if (!recordedAudio) return;
    
    try {
      // Simulate AI analysis with random confidence score
      // In a real app, you would send the audio to a server for analysis
      const randomConfidence = Math.floor(Math.random() * 41) + 60; // 60-100
      setConfidence(randomConfidence);
      
      // Generate feedback based on confidence
      let feedbackText = '';
      if (randomConfidence >= 90) {
        feedbackText = 'Excellent pronunciation! Your Italian sounds very natural.';
      } else if (randomConfidence >= 80) {
        feedbackText = 'Very good pronunciation. Just a few minor accent issues.';
      } else if (randomConfidence >= 70) {
        feedbackText = 'Good effort! Work on the rhythm and stress patterns of Italian.';
      } else {
        feedbackText = 'Keep practicing! Focus on vowel sounds and intonation.';
      }
      
      setFeedback(feedbackText);
      setIsSubmitted(true);
      
      // Track usage
      incrementUsage('speakingExercises');
      
      // Update user stats in database
      updateUserStats(randomConfidence);
      
    } catch (error) {
      console.error('Error submitting recording:', error);
      toast({
        title: 'Submission Failed',
        description: 'Failed to analyze your recording. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  const updateUserStats = async (confidenceScore: number) => {
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
            questions_answered: stats.questions_answered + 1,
            correct_answers: stats.correct_answers + (confidenceScore >= 70 ? 1 : 0),
            speaking_score: stats.speaking_score 
              ? Math.round((stats.speaking_score + confidenceScore) / 2) 
              : confidenceScore,
            last_activity_date: new Date().toISOString().split('T')[0]
          })
          .eq('user_id', user.id);
      } else {
        // Create new stats record
        await supabase
          .from('user_stats')
          .insert({
            user_id: user.id,
            questions_answered: 1,
            correct_answers: confidenceScore >= 70 ? 1 : 0,
            speaking_score: confidenceScore,
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
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading speaking exercises...</p>
      </div>
    );
  }
  
  if (!currentExercise) {
    return (
      <div className="text-center py-8">
        <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No exercises found</h3>
        <p className="mt-2 text-muted-foreground">
          We couldn't find any speaking exercises. Please try again later.
        </p>
      </div>
    );
  }
  
  if (hasReachedLimit('speakingExercises')) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Daily Limit Reached</CardTitle>
          <CardDescription>
            You've reached your daily limit of {getLimit('speakingExercises')} speaking exercises.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="bg-muted p-4 rounded-lg mb-6">
            <p className="text-muted-foreground">
              You've completed {getUsage('speakingExercises')}/{getLimit('speakingExercises')} exercises today.
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
          <CardTitle>Feedback: {currentExercise.title}</CardTitle>
          <CardDescription>
            Your speaking confidence score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span>Confidence</span>
              <span>{confidence}%</span>
            </div>
            <Progress value={confidence || 0} className="h-2 mb-4" />
            
            <div className="p-4 rounded-lg border bg-muted">
              <p className="mb-2 font-medium">AI Feedback:</p>
              <p>{feedback}</p>
            </div>
            
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Your Recording:</p>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={isPlaying ? stopPlayback : playRecording}
                  disabled={!recordedAudio}
                >
                  {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <div className="flex-1 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-primary rounded-full"
                    style={{ width: isPlaying ? '100%' : '0%', transition: 'width 0.3s ease' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setIsSubmitted(false)}>
            Try Again
          </Button>
          <Button onClick={nextExercise}>
            Next Exercise
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Speaking Practice</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{currentExercise.title}</CardTitle>
          <CardDescription>
            Practice your Italian pronunciation. {currentExercise.isPremium && '(Premium Content)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Your Task:</h3>
            <p className="text-lg mb-6">{currentExercise.prompt}</p>
            
            {currentExercise.hints.length > 0 && (
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Helpful Phrases:</h4>
                <ul className="space-y-1 list-disc pl-4">
                  {currentExercise.hints.map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-center justify-center py-6">
            <audio ref={audioRef} className="hidden" />
            
            {!recordedAudio ? (
              <>
                <Button
                  variant={isRecording ? 'destructive' : 'default'}
                  size="lg"
                  className={`h-16 w-16 rounded-full ${isRecording ? 'animate-pulse' : ''}`}
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </Button>
                <p className="mt-4 text-center">
                  {isRecording ? (
                    <span className="text-lg font-bold">{formatTime(recordingTime)}</span>
                  ) : (
                    'Click to start recording'
                  )}
                </p>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-4 mb-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={isPlaying ? stopPlayback : playRecording}
                  >
                    {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <span>Listen to your recording</span>
                </div>
                
                <Button
                  variant="default"
                  onClick={submitRecording}
                  className="mt-2"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit for Feedback
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={() => setRecordedAudio(null)}
                  className="mt-4"
                  size="sm"
                >
                  Record Again
                </Button>
              </div>
            )}
          </div>
        </CardContent>
        {!recordedAudio && (
          <CardFooter className="justify-end">
            <Button variant="outline" onClick={nextExercise} className="ml-auto">
              Skip Exercise
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardFooter>
        )}
      </Card>
      
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex items-start">
          <Sparkles className="h-5 w-5 text-yellow-500 mr-3 mt-1" />
          <div>
            <h3 className="font-medium mb-1">Speaking Practice Tips</h3>
            <p className="text-sm text-muted-foreground">
              Speak clearly and at a natural pace. Don't worry about making mistakes - focus on communicating your ideas. 
              Practice makes perfect, so try to speak Italian regularly, even if just to yourself.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakingModule;
