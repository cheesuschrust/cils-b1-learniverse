
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFeatureLimits } from '@/hooks/useFeatureLimits';
import { useAuth } from '@/contexts/AuthContext';
import useOfflineCapability from '@/hooks/useOfflineCapability';
import { Loader2, Mic, MicOff, Play, Stop, VolumeUp, Download, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SpeechRecognitionService, { WordAnalysis } from '@/services/SpeechRecognitionService';
import SpeakingConfidenceIndicator from '@/components/speaking/SpeakingConfidenceIndicator';
import SpeakingPromptGenerator from '@/components/speaking/SpeakingPromptGenerator';
import { useTTS } from '@/hooks/useTTS';
import { supabase } from '@/lib/supabase-client';

// Mock speaking exercises
const mockExercises = [
  {
    id: '1',
    title: 'Basic Pronunciation Practice',
    description: 'Practice pronouncing basic Italian sounds and words',
    level: 'beginner',
    phrases: [
      {
        text: 'Buongiorno, come stai?',
        translation: 'Good morning, how are you?',
        audioUrl: null
      },
      {
        text: 'Mi chiamo Marco. E tu, come ti chiami?',
        translation: 'My name is Marco. And you, what\'s your name?',
        audioUrl: null
      },
      {
        text: 'Piacere di conoscerti.',
        translation: 'Nice to meet you.',
        audioUrl: null
      }
    ]
  },
  {
    id: '2',
    title: 'Restaurant Dialogue',
    description: 'Practice ordering food in an Italian restaurant',
    level: 'intermediate',
    phrases: [
      {
        text: 'Buonasera, vorrei prenotare un tavolo per due persone.',
        translation: 'Good evening, I would like to reserve a table for two people.',
        audioUrl: null
      },
      {
        text: 'Che cosa mi consiglia come primo piatto?',
        translation: 'What do you recommend for the first course?',
        audioUrl: null
      },
      {
        text: 'Vorrei un bicchiere di vino rosso, per favore.',
        translation: 'I would like a glass of red wine, please.',
        audioUrl: null
      },
      {
        text: 'Il conto, per favore. È stato tutto delizioso.',
        translation: 'The bill, please. Everything was delicious.',
        audioUrl: null
      }
    ]
  },
  {
    id: '3',
    title: 'Citizenship Interview Practice',
    description: 'Practice answering common CILS citizenship interview questions',
    level: 'advanced',
    phrases: [
      {
        text: 'Perché vuole diventare cittadino italiano?',
        translation: 'Why do you want to become an Italian citizen?',
        audioUrl: null
      },
      {
        text: 'Da quanto tempo vive in Italia e dove?',
        translation: 'How long have you been living in Italy and where?',
        audioUrl: null
      },
      {
        text: 'Può parlarmi della sua famiglia e del suo lavoro?',
        translation: 'Can you tell me about your family and your job?',
        audioUrl: null
      },
      {
        text: 'Cosa sa della Costituzione italiana?',
        translation: 'What do you know about the Italian Constitution?',
        audioUrl: null
      },
      {
        text: 'Quali sono le principali festività italiane?',
        translation: 'What are the main Italian holidays?',
        audioUrl: null
      }
    ]
  }
];

const SpeakingModule: React.FC = () => {
  const [exercises, setExercises] = useState<any[]>(mockExercises);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<any | null>(null);
  const [exerciseResults, setExerciseResults] = useState<any[]>([]);
  const [showTranslation, setShowTranslation] = useState(true);
  const [activeTab, setActiveTab] = useState('exercises');
  const { hasReachedLimit, getLimit, getUsage, incrementUsage } = useFeatureLimits();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const { isOnline, isOfflineReady, enableOfflineAccess } = useOfflineCapability('/speaking');
  const { speakText, isSpeaking } = useTTS();
  
  const isLimitReached = hasReachedLimit('speakingExercises');
  const maxExercises = getLimit('speakingExercises');
  const currentUsage = getUsage('speakingExercises');
  const [customPrompt, setCustomPrompt] = useState<{text: string; translation: string} | null>(null);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [rhythmAnalysis, setRhythmAnalysis] = useState<{
    fluencyScore: number;
    rhythmScore: number;
    feedback: string;
  } | null>(null);
  const [stopRecordingFunc, setStopRecordingFunc] = useState<(() => void) | null>(null);

  useEffect(() => {
    // Initialize with real exercises from database
    const fetchExercises = async () => {
      setIsLoading(true);
      
      try {
        if (user) {
          // Try to fetch exercises from Supabase
          const { data, error } = await supabase
            .from('speaking_exercises')
            .select('*')
            .order('level');
            
          if (error) {
            throw error;
          }
          
          if (data && data.length > 0) {
            setExercises(data);
          } else {
            // Fall back to mock data if no data found
            setExercises(mockExercises);
          }
        } else {
          // Fall back to mock data if not authenticated
          setExercises(mockExercises);
        }
      } catch (error) {
        console.error('Error fetching exercises:', error);
        // Fall back to mock data on error
        setExercises(mockExercises);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExercises();
  }, [user]);

  const handleStartExercise = async (exerciseId: string) => {
    if (isLimitReached && !user?.isPremium) {
      toast({
        title: "Daily Limit Reached",
        description: `You've reached your daily limit of ${maxExercises} speaking exercises. Upgrade to Premium for unlimited access.`,
        variant: "destructive"
      });
      return;
    }
    
    setSelectedExerciseId(exerciseId);
    setCurrentPhraseIndex(0);
    setAudioBlob(null);
    setAudioUrl(null);
    setFeedback(null);
    setExerciseResults([]);
    
    try {
      await incrementUsage('speakingExercises');
    } catch (err) {
      console.error("Failed to increment usage:", err);
    }
  };

  const handleBackToExercises = () => {
    setSelectedExerciseId(null);
    setCurrentPhraseIndex(0);
    setAudioBlob(null);
    setAudioUrl(null);
    if (stopRecordingFunc) {
      stopRecordingFunc();
      setStopRecordingFunc(null);
    }
    setIsRecording(false);
  };

  const startRecording = async () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setFeedback(null);
    setConfidenceScore(0);
    setRhythmAnalysis(null);
    
    try {
      const stopRecording = await SpeechRecognitionService.startRecording();
      setStopRecordingFunc(() => stopRecording);
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Speak clearly into your microphone."
      });
      
      // Auto-stop after 15 seconds
      setTimeout(() => {
        if (isRecording) {
          stopRecording();
          setIsRecording(false);
        }
      }, 15000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Failed",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = async () => {
    if (!isRecording) return;
    
    try {
      setIsRecording(false);
      
      if (stopRecordingFunc) {
        const blob = await stopRecordingFunc();
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setStopRecordingFunc(null);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      setStopRecordingFunc(null);
    }
  };

  const handlePlayReference = async () => {
    if (!selectedExerciseId && !customPrompt) return;
    
    let textToSpeak = '';
    
    if (selectedExerciseId) {
      const exercise = exercises.find(ex => ex.id === selectedExerciseId);
      if (!exercise) return;
      
      const phrase = exercise.phrases[currentPhraseIndex];
      textToSpeak = phrase.text;
    } else if (customPrompt) {
      textToSpeak = customPrompt.text;
    }
    
    if (textToSpeak) {
      try {
        await speakText(textToSpeak, 'it');
      } catch (error) {
        console.error('Error playing reference:', error);
        toast({
          title: "Playback Failed",
          description: "Could not play the reference audio.",
          variant: "destructive"
        });
      }
    }
  };

  const handlePlayRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const handleDownloadRecording = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = 'pronunciation-practice.webm';
      a.click();
    }
  };

  const handleAnalyzePronunciation = async () => {
    if (!audioBlob) return;
    
    setIsAnalyzing(true);
    
    try {
      let targetText = '';
      
      if (selectedExerciseId) {
        const exercise = exercises.find(ex => ex.id === selectedExerciseId);
        if (!exercise) return;
        
        const phrase = exercise.phrases[currentPhraseIndex];
        targetText = phrase.text;
      } else if (customPrompt) {
        targetText = customPrompt.text;
      } else {
        throw new Error('No reference text found');
      }
      
      // Analyze with real speech recognition
      const result = await SpeechRecognitionService.recognizeSpeech(audioBlob, {
        language: 'it',
        targetText,
        compareWithTarget: true
      });
      
      // Calculate rhythm and fluency scores
      const rhythmResults = result.wordLevelAnalysis
        ? SpeechRecognitionService.analyzeSpeechRhythm(result.wordLevelAnalysis)
        : {
            fluencyScore: result.confidence * 0.9,
            rhythmScore: result.confidence * 0.8,
            feedback: "Focus on speaking clearly and at a steady pace."
          };
      
      setRhythmAnalysis(rhythmResults);
      setConfidenceScore(result.confidence);
      
      setFeedback({
        transcription: result.text,
        metrics: {
          accuracy: result.confidence,
          fluency: rhythmResults.fluencyScore,
          pronunciation: result.confidence,
          overall: (result.confidence + rhythmResults.fluencyScore + rhythmResults.rhythmScore) / 3
        },
        wordFeedback: result.wordLevelAnalysis || []
      });
      
      // If user is authenticated, track the error
      if (user && result.confidence < 70) {
        await SpeechRecognitionService.trackSpeakingError(
          user.id,
          selectedExerciseId || 'custom-prompt',
          'pronunciation',
          {
            confidence: result.confidence,
            expected: targetText,
            actual: result.text
          }
        );
      }
      
      toast({
        title: "Analysis Complete",
        description: `Overall pronunciation score: ${Math.round((result.confidence + rhythmResults.fluencyScore + rhythmResults.rhythmScore) / 3)}/100`
      });
    } catch (error) {
      console.error('Error analyzing pronunciation:', error);
      toast({
        title: "Analysis Failed",
        description: "We couldn't analyze your pronunciation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNextPhrase = () => {
    if (!selectedExerciseId) return;
    
    const exercise = exercises.find(ex => ex.id === selectedExerciseId);
    if (!exercise) return;
    
    // Save results for the current phrase
    if (feedback) {
      setExerciseResults([
        ...exerciseResults,
        {
          phraseIndex: currentPhraseIndex,
          feedback
        }
      ]);
    }
    
    if (currentPhraseIndex < exercise.phrases.length - 1) {
      setCurrentPhraseIndex(currentPhraseIndex + 1);
      setAudioBlob(null);
      setAudioUrl(null);
      setFeedback(null);
      setConfidenceScore(0);
      setRhythmAnalysis(null);
    } else {
      // Exercise complete
      toast({
        title: "Exercise Complete",
        description: "You've completed all phrases in this exercise!"
      });
    }
  };

  const handleCustomPromptSelected = (prompt: { text: string; translation: string }) => {
    setCustomPrompt(prompt);
    setSelectedExerciseId(null);
    setAudioBlob(null);
    setAudioUrl(null);
    setFeedback(null);
    setActiveTab('record');
  };

  if (!isAuthenticated) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Italian Speaking Practice</CardTitle>
          <CardDescription>
            Please log in to access speaking exercises
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>You need to be logged in to use the speaking exercises.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading exercises...</p>
      </div>
    );
  }

  if (selectedExerciseId) {
    const exercise = exercises.find(ex => ex.id === selectedExerciseId);
    if (!exercise) return null;
    
    const phrase = exercise.phrases[currentPhraseIndex];
    const progress = ((currentPhraseIndex + 1) / exercise.phrases.length) * 100;
    
    return (
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={handleBackToExercises}>
            ← Back to Exercises
          </Button>
          <Badge variant={exercise.level === 'beginner' ? 'outline' : (exercise.level === 'intermediate' ? 'secondary' : 'destructive')}>
            {exercise.level.charAt(0).toUpperCase() + exercise.level.slice(1)}
          </Badge>
        </div>
        
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle>{exercise.title}</CardTitle>
            <CardDescription>{exercise.description}</CardDescription>
            <Progress value={progress} className="mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">Phrase {currentPhraseIndex + 1} of {exercise.phrases.length}</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handlePlayReference}
                    disabled={isSpeaking}
                  >
                    {isSpeaking ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <VolumeUp className="mr-2 h-4 w-4" />
                    )}
                    Listen
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowTranslation(!showTranslation)}
                  >
                    {showTranslation ? 'Hide Translation' : 'Show Translation'}
                  </Button>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <p className="text-xl mb-2">{phrase.text}</p>
                {showTranslation && (
                  <p className="text-sm text-muted-foreground">{phrase.translation}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Your Recording</h3>
              
              <div className="flex justify-center gap-4">
                {!isRecording && !audioUrl && (
                  <Button onClick={startRecording}>
                    <Mic className="mr-2 h-4 w-4" /> Start Recording
                  </Button>
                )}
                
                {isRecording && (
                  <Button variant="destructive" onClick={stopRecording}>
                    <MicOff className="mr-2 h-4 w-4" /> Stop Recording
                  </Button>
                )}
                
                {audioUrl && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Button variant="outline" onClick={handlePlayRecording}>
                      <Play className="mr-2 h-4 w-4" /> Play
                    </Button>
                    <Button variant="outline" onClick={handleDownloadRecording}>
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setAudioBlob(null);
                      setAudioUrl(null);
                      setFeedback(null);
                      setConfidenceScore(0);
                      setRhythmAnalysis(null);
                    }}>
                      <RefreshCw className="mr-2 h-4 w-4" /> Record Again
                    </Button>
                    <Button 
                      onClick={handleAnalyzePronunciation} 
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : 'Analyze Pronunciation'}
                    </Button>
                  </div>
                )}
              </div>
              
              {isRecording && (
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-16 h-16 mb-2">
                    <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping"></div>
                    <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white">
                      <Mic className="h-8 w-8" />
                    </div>
                  </div>
                  <p>Recording... Speak clearly into your microphone</p>
                </div>
              )}
            </div>
            
            {feedback && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Pronunciation Feedback</h3>
                
                <SpeakingConfidenceIndicator 
                  confidenceScore={feedback.metrics.overall} 
                  cils_level="B1"
                  size="md"
                  showLabel={true}
                  className="mb-4"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Overall</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pb-3">
                      <div className="text-3xl font-bold">{Math.round(feedback.metrics.overall)}%</div>
                      <Progress value={feedback.metrics.overall} className="mt-2" />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Accuracy</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pb-3">
                      <div className="text-3xl font-bold">{Math.round(feedback.metrics.accuracy)}%</div>
                      <Progress value={feedback.metrics.accuracy} className="mt-2" />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Fluency</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pb-3">
                      <div className="text-3xl font-bold">{Math.round(feedback.metrics.fluency)}%</div>
                      <Progress value={feedback.metrics.fluency} className="mt-2" />
                    </CardContent>
                  </Card>
                </div>
                
                {rhythmAnalysis && (
                  <div className="bg-muted p-4 rounded-md mt-4">
                    <h4 className="font-medium mb-2">Speech Rhythm Analysis</h4>
                    <p className="mb-3">{rhythmAnalysis.feedback}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Rhythm Score</p>
                        <Progress value={rhythmAnalysis.rhythmScore} className="h-2 mt-1" />
                        <p className="text-xs text-right mt-1">{Math.round(rhythmAnalysis.rhythmScore)}%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Fluency Score</p>
                        <Progress value={rhythmAnalysis.fluencyScore} className="h-2 mt-1" />
                        <p className="text-xs text-right mt-1">{Math.round(rhythmAnalysis.fluencyScore)}%</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <Collapsible className="w-full">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Word-by-Word Analysis</h4>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  
                  <CollapsibleContent>
                    <div className="mt-2 space-y-2">
                      {feedback.wordFeedback.map((word: WordAnalysis, index: number) => (
                        <div 
                          key={index}
                          className={`
                            p-2 rounded-md flex justify-between 
                            ${word.confidence < 70 ? 'bg-red-50 dark:bg-red-900/20' : 
                              word.confidence < 85 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 
                              'bg-green-50 dark:bg-green-900/20'}
                          `}
                        >
                          <span>{word.word}</span>
                          <div className="flex items-center gap-2">
                            {word.feedback && <span className="text-xs italic">{word.feedback}</span>}
                            <Badge variant={
                              word.confidence < 70 ? 'destructive' : 
                              word.confidence < 85 ? 'secondary' : 
                              'outline'
                            }>
                              {Math.round(word.confidence)}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex-1 max-w-[100px]">
              {currentPhraseIndex > 0 && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setCurrentPhraseIndex(currentPhraseIndex - 1)}
                >
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex-1 text-center">
              <p className="text-sm text-muted-foreground">
                {currentPhraseIndex + 1} of {exercise.phrases.length}
              </p>
            </div>
            
            <div className="flex-1 max-w-[100px] ml-auto">
              <Button 
                className="w-full"
                onClick={handleNextPhrase}
                disabled={currentPhraseIndex >= exercise.phrases.length - 1 && !feedback}
              >
                {currentPhraseIndex >= exercise.phrases.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Italian Speaking Practice</h1>
          <p className="text-muted-foreground">
            Improve your pronunciation with guided exercises
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            {currentUsage} / {maxExercises} Exercises
          </Badge>
          {!isOnline && !isOfflineReady && (
            <Button onClick={enableOfflineAccess} disabled={!isOnline} variant="outline" size="sm">
              Enable Offline
            </Button>
          )}
        </div>
      </div>
      
      {isLimitReached && !user?.isPremium && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Daily Limit Reached</AlertTitle>
          <AlertDescription>
            You've reached your daily limit of {maxExercises} speaking exercises. 
            <Button variant="link" className="p-0 h-auto font-normal">
              Upgrade to Premium
            </Button> for unlimited access.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
          <TabsTrigger value="custom">Custom Prompts</TabsTrigger>
          <TabsTrigger value="record" disabled={!customPrompt}>Record</TabsTrigger>
        </TabsList>
        
        <TabsContent value="exercises" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exercises.map((exercise) => (
              <Card key={exercise.id} className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle>{exercise.title}</CardTitle>
                    <Badge variant={exercise.level === 'beginner' ? 'outline' : (exercise.level === 'intermediate' ? 'secondary' : 'destructive')}>
                      {exercise.level.charAt(0).toUpperCase() + exercise.level.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription>{exercise.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {exercise.phrases.length} phrases to practice
                  </p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button 
                    className="w-full" 
                    onClick={() => handleStartExercise(exercise.id)}
                    disabled={isLimitReached && !user?.isPremium}
                  >
                    Start Exercise
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SpeakingPromptGenerator 
              onPromptSelected={handleCustomPromptSelected}
              isPremium={user?.isPremium}
            />
            
            <Card>
              <CardHeader>
                <CardTitle>Speaking Practice Tips</CardTitle>
                <CardDescription>
                  Improve your Italian pronunciation with these tips
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Italian Vowels</h3>
                  <ul className="space-y-1 list-disc pl-5">
                    <li><strong>A</strong> - Like the 'a' in "father"</li>
                    <li><strong>E</strong> - Either like 'e' in "let" or 'a' in "day"</li>
                    <li><strong>I</strong> - Like 'ee' in "see"</li>
                    <li><strong>O</strong> - Either like 'o' in "dog" or 'o' in "go"</li>
                    <li><strong>U</strong> - Like 'oo' in "boot"</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Consonant Combinations</h3>
                  <ul className="space-y-1 list-disc pl-5">
                    <li><strong>CH</strong> - Like 'k' in "key"</li>
                    <li><strong>GH</strong> - Like 'g' in "go"</li>
                    <li><strong>GLI</strong> - Similar to 'lli' in "million"</li>
                    <li><strong>GN</strong> - Like 'ny' in "canyon"</li>
                    <li><strong>SC</strong> - Before e/i, like 'sh' in "ship"</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Double Consonants</h3>
                  <p className="text-sm">
                    Double consonants in Italian are pronounced more forcefully and held longer
                    than single consonants. Practice words like "anno" (year) vs "ano" (anus)
                    to hear the difference.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="record">
          {customPrompt && (
            <Card>
              <CardHeader>
                <CardTitle>Practice Custom Prompt</CardTitle>
                <CardDescription>Record yourself speaking the custom prompt</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium">Custom Prompt</h3>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handlePlayReference}
                        disabled={isSpeaking}
                      >
                        {isSpeaking ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <VolumeUp className="mr-2 h-4 w-4" />
                        )}
                        Listen
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowTranslation(!showTranslation)}
                      >
                        {showTranslation ? 'Hide Translation' : 'Show Translation'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-xl mb-2">{customPrompt.text}</p>
                    {showTranslation && (
                      <p className="text-sm text-muted-foreground">{customPrompt.translation}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Your Recording</h3>
                  
                  <div className="flex justify-center gap-4">
                    {!isRecording && !audioUrl && (
                      <Button onClick={startRecording}>
                        <Mic className="mr-2 h-4 w-4" /> Start Recording
                      </Button>
                    )}
                    
                    {isRecording && (
                      <Button variant="destructive" onClick={stopRecording}>
                        <MicOff className="mr-2 h-4 w-4" /> Stop Recording
                      </Button>
                    )}
                    
                    {audioUrl && (
                      <div className="flex flex-wrap gap-2 justify-center">
                        <Button variant="outline" onClick={handlePlayRecording}>
                          <Play className="mr-2 h-4 w-4" /> Play
                        </Button>
                        <Button variant="outline" onClick={handleDownloadRecording}>
                          <Download className="mr-2 h-4 w-4" /> Download
                        </Button>
                        <Button variant="outline" onClick={() => {
                          setAudioBlob(null);
                          setAudioUrl(null);
                          setFeedback(null);
                          setConfidenceScore(0);
                          setRhythmAnalysis(null);
                        }}>
                          <RefreshCw className="mr-2 h-4 w-4" /> Record Again
                        </Button>
                        <Button 
                          onClick={handleAnalyzePronunciation} 
                          disabled={isAnalyzing}
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Analyzing...
                            </>
                          ) : 'Analyze Pronunciation'}
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {isRecording && (
                    <div className="flex flex-col items-center text-center">
                      <div className="relative w-16 h-16 mb-2">
                        <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping"></div>
                        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white">
                          <Mic className="h-8 w-8" />
                        </div>
                      </div>
                      <p>Recording... Speak clearly into your microphone</p>
                    </div>
                  )}
                </div>
                
                {feedback && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Pronunciation Feedback</h3>
                    
                    <SpeakingConfidenceIndicator 
                      confidenceScore={feedback.metrics.overall} 
                      cils_level="B1"
                      size="md"
                      showLabel={true}
                      className="mb-4"
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-base">Overall</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center pb-3">
                          <div className="text-3xl font-bold">{Math.round(feedback.metrics.overall)}%</div>
                          <Progress value={feedback.metrics.overall} className="mt-2" />
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-base">Accuracy</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center pb-3">
                          <div className="text-3xl font-bold">{Math.round(feedback.metrics.accuracy)}%</div>
                          <Progress value={feedback.metrics.accuracy} className="mt-2" />
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-base">Fluency</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center pb-3">
                          <div className="text-3xl font-bold">{Math.round(feedback.metrics.fluency)}%</div>
                          <Progress value={feedback.metrics.fluency} className="mt-2" />
                        </CardContent>
                      </Card>
                    </div>
                    
                    {rhythmAnalysis && (
                      <div className="bg-muted p-4 rounded-md mt-4">
                        <h4 className="font-medium mb-2">Speech Rhythm Analysis</h4>
                        <p className="mb-3">{rhythmAnalysis.feedback}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium">Rhythm Score</p>
                            <Progress value={rhythmAnalysis.rhythmScore} className="h-2 mt-1" />
                            <p className="text-xs text-right mt-1">{Math.round(rhythmAnalysis.rhythmScore)}%</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Fluency Score</p>
                            <Progress value={rhythmAnalysis.fluencyScore} className="h-2 mt-1" />
                            <p className="text-xs text-right mt-1">{Math.round(rhythmAnalysis.fluencyScore)}%</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <Collapsible className="w-full">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">Word-by-Word Analysis</h4>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      
                      <CollapsibleContent>
                        <div className="mt-2 space-y-2">
                          {feedback.wordFeedback.map((word: WordAnalysis, index: number) => (
                            <div 
                              key={index}
                              className={`
                                p-2 rounded-md flex justify-between 
                                ${word.confidence < 70 ? 'bg-red-50 dark:bg-red-900/20' : 
                                  word.confidence < 85 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 
                                  'bg-green-50 dark:bg-green-900/20'}
                              `}
                            >
                              <span>{word.word}</span>
                              <div className="flex items-center gap-2">
                                {word.feedback && <span className="text-xs italic">{word.feedback}</span>}
                                <Badge variant={
                                  word.confidence < 70 ? 'destructive' : 
                                  word.confidence < 85 ? 'secondary' : 
                                  'outline'
                                }>
                                  {Math.round(word.confidence)}%
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="flex justify-between w-full">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setActiveTab('custom');
                      setAudioBlob(null);
                      setAudioUrl(null);
                      setFeedback(null);
                    }}
                  >
                    Back to Prompts
                  </Button>
                  
                  <Button 
                    variant="default" 
                    onClick={() => {
                      setCustomPrompt(null);
                      setAudioBlob(null);
                      setAudioUrl(null);
                      setFeedback(null);
                      setActiveTab('custom');
                    }}
                  >
                    Generate New Prompt
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SpeakingModule;
