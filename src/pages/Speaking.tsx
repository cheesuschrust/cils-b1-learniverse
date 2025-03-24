
import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Play, Volume2, VolumeX, SkipForward } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { recognizeSpeech, evaluateSpeech, generateSpeechExercises } from '@/services/AIService';
import { speak } from '@/utils/textToSpeech';
import SpeakableWord from '@/components/learning/SpeakableWord';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

const Speaking = () => {
  const [activeTab, setActiveTab] = useState('practice');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [userResponse, setUserResponse] = useState('');
  const [evaluation, setEvaluation] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const { voicePreference } = useUserPreferences();
  
  // Load exercises when component mounts or difficulty changes
  useEffect(() => {
    const loadExercises = async () => {
      try {
        const generatedExercises = await generateSpeechExercises(difficulty, 5);
        setExercises(generatedExercises);
        setCurrentExerciseIndex(0);
        setUserResponse('');
        setEvaluation(null);
      } catch (error) {
        console.error('Error loading exercises:', error);
        toast({
          title: 'Error loading exercises',
          description: 'There was a problem loading the speaking exercises.',
          variant: 'destructive',
        });
      }
    };
    
    loadExercises();
  }, [difficulty, toast]);
  
  // Set up and clean up recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);
  
  const startRecording = async () => {
    try {
      // Reset previous recording state
      setRecordingTime(0);
      setUserResponse('');
      setEvaluation(null);
      audioChunksRef.current = [];
      
      // Request user media
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        
        // Process the recording
        await processRecording(audioBlob);
        
        // Stop all tracks on the stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      
      toast({
        title: 'Recording started',
        description: 'Speak clearly into your microphone.',
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Recording error',
        description: 'Could not access microphone. Please check permissions.',
        variant: 'destructive',
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      
      toast({
        title: 'Recording stopped',
        description: 'Processing your speech...',
      });
    }
  };
  
  const processRecording = async (blob: Blob) => {
    setIsProcessing(true);
    try {
      // Recognize speech in the recording
      const recognitionResult = await recognizeSpeech(blob, 'it');
      setUserResponse(recognitionResult.text);
      
      // Evaluate the speech against the current exercise
      if (currentExerciseIndex < exercises.length) {
        const currentExercise = exercises[currentExerciseIndex];
        const evaluationResult = await evaluateSpeech(
          recognitionResult.text,
          currentExercise.text,
          'it'
        );
        
        setEvaluation(evaluationResult);
      }
    } catch (error) {
      console.error('Error processing recording:', error);
      toast({
        title: 'Processing error',
        description: 'There was a problem analyzing your speech.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const playCurrentExercise = async () => {
    if (currentExerciseIndex < exercises.length) {
      const currentExercise = exercises[currentExerciseIndex];
      try {
        await speak(currentExercise.text, 'it', voicePreference);
      } catch (error) {
        console.error('Error playing exercise:', error);
        toast({
          title: 'Playback error',
          description: 'Could not play the exercise audio.',
          variant: 'destructive',
        });
      }
    }
  };
  
  const nextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setUserResponse('');
      setEvaluation(null);
      setAudioBlob(null);
      setShowTranslation(false);
    }
  };
  
  const toggleTranslation = () => {
    setShowTranslation(!showTranslation);
  };
  
  const changeDifficulty = (newDifficulty: 'beginner' | 'intermediate' | 'advanced') => {
    if (difficulty !== newDifficulty) {
      setDifficulty(newDifficulty);
      setUserResponse('');
      setEvaluation(null);
      setAudioBlob(null);
      setShowTranslation(false);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const getCurrentExercise = () => {
    return exercises[currentExerciseIndex] || {
      text: 'Loading exercise...',
      translation: 'Loading translation...',
      difficulty: 'beginner'
    };
  };
  
  const renderPracticeTab = () => {
    const currentExercise = getCurrentExercise();
    
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Speaking Practice</CardTitle>
                <CardDescription>
                  Listen to the phrase and practice your pronunciation
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={difficulty === 'beginner' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => changeDifficulty('beginner')}
                  disabled={isRecording || isProcessing}
                >
                  Beginner
                </Button>
                <Button
                  variant={difficulty === 'intermediate' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => changeDifficulty('intermediate')}
                  disabled={isRecording || isProcessing}
                >
                  Intermediate
                </Button>
                <Button
                  variant={difficulty === 'advanced' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => changeDifficulty('advanced')}
                  disabled={isRecording || isProcessing}
                >
                  Advanced
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <Badge variant="outline" className="capitalize">
                Exercise {currentExerciseIndex + 1} of {exercises.length}
              </Badge>
              <Badge variant="secondary" className="capitalize">
                {difficulty}
              </Badge>
            </div>
            
            <div className="bg-secondary/30 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Listen and repeat:</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={playCurrentExercise}
                  disabled={isRecording}
                >
                  <Volume2 className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-lg font-medium">{currentExercise.text}</p>
              
              {showTranslation && (
                <p className="text-sm text-muted-foreground mt-2">
                  {currentExercise.translation}
                </p>
              )}
              
              <Button
                variant="link"
                size="sm"
                onClick={toggleTranslation}
                className="mt-2 px-0"
              >
                {showTranslation ? 'Hide translation' : 'Show translation'}
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 items-center justify-center py-4">
              {isRecording ? (
                <Button
                  variant="destructive"
                  size="lg"
                  className="w-full md:w-auto"
                  onClick={stopRecording}
                >
                  <MicOff className="h-5 w-5 mr-2" />
                  Stop Recording ({formatTime(recordingTime)})
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="lg"
                  className="w-full md:w-auto"
                  onClick={startRecording}
                  disabled={isProcessing}
                >
                  <Mic className="h-5 w-5 mr-2" />
                  Start Speaking
                </Button>
              )}
              
              <Button
                variant="outline"
                size="lg"
                className="w-full md:w-auto"
                onClick={nextExercise}
                disabled={isRecording || isProcessing || currentExerciseIndex >= exercises.length - 1}
              >
                <SkipForward className="h-5 w-5 mr-2" />
                Next Exercise
              </Button>
            </div>
            
            {isProcessing && (
              <div className="text-center py-4">
                <Progress value={undefined} className="w-full h-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  Processing your speech...
                </p>
              </div>
            )}
            
            {userResponse && (
              <div className="space-y-4 mt-4">
                <Separator />
                <div>
                  <h3 className="font-medium mb-2">Your speech:</h3>
                  <p className="text-lg">{userResponse}</p>
                </div>
                
                {evaluation && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Score:</h3>
                      <div className="flex items-center gap-4">
                        <Progress
                          value={evaluation.score}
                          className="w-full h-3"
                        />
                        <span className="font-medium">{Math.round(evaluation.score)}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Feedback:</h3>
                      <p>{evaluation.feedback}</p>
                    </div>
                    
                    {evaluation.errors.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2">Corrections:</h3>
                        <ul className="space-y-2">
                          {evaluation.errors.map((error: any, index: number) => (
                            <li key={index} className="bg-secondary/30 p-2 rounded">
                              <span className="line-through">{error.word}</span>{' → '}
                              <span className="font-medium text-primary">{error.suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={playCurrentExercise}>
              <Play className="h-4 w-4 mr-2" />
              Listen Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  const renderConversationTab = () => {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-muted-foreground">
          Conversation practice will be available soon!
        </p>
      </div>
    );
  };
  
  const renderPronunciationTab = () => {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-muted-foreground">
          Pronunciation drills will be available soon!
        </p>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-6 py-8">
      <Helmet>
        <title>Speaking Practice | Italian Learning</title>
      </Helmet>
      
      <h1 className="text-3xl font-bold tracking-tight mb-2">Speaking Practice</h1>
      <p className="text-muted-foreground mb-8">
        Improve your Italian pronunciation and speaking skills
      </p>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="practice">Phrase Practice</TabsTrigger>
          <TabsTrigger value="conversation">Conversation</TabsTrigger>
          <TabsTrigger value="pronunciation">Pronunciation Drills</TabsTrigger>
        </TabsList>
        
        <TabsContent value="practice" className="mt-0">
          {renderPracticeTab()}
        </TabsContent>
        
        <TabsContent value="conversation" className="mt-0">
          {renderConversationTab()}
        </TabsContent>
        
        <TabsContent value="pronunciation" className="mt-0">
          {renderPronunciationTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Speaking;
