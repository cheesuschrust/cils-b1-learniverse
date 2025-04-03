
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFeatureLimits } from '@/hooks/useFeatureLimits';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import useOfflineCapability from '@/hooks/useOfflineCapability';
import { Loader2, Mic, MicOff, Play, Stop, VolumeUp, Download, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import speak from '@/utils/textToSpeech';

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

// Mock feedback function (would be replaced with real speech recognition in production)
const analyzeMockSpeech = (audioBlob: Blob, referenceText: string) => {
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      // In a real app, this would connect to a speech recognition service
      
      // Generate mock results
      const accuracy = Math.floor(Math.random() * 30) + 70; // 70-99
      const fluency = Math.floor(Math.random() * 30) + 70; // 70-99
      const pronunciation = Math.floor(Math.random() * 30) + 70; // 70-99
      const overall = Math.round((accuracy + fluency + pronunciation) / 3);
      
      const wordFeedback = referenceText.split(' ').map(word => ({
        word,
        score: Math.floor(Math.random() * 40) + 60, // 60-99
        feedback: Math.random() > 0.7 ? 'Accent could be improved' : null
      }));
      
      resolve({
        transcription: referenceText, // In a real app, this would be the actual transcription
        metrics: {
          accuracy,
          fluency,
          pronunciation,
          overall
        },
        wordFeedback
      });
    }, 2000);
  });
};

const SpeakingModule: React.FC = () => {
  const [exercises, setExercises] = useState<any[]>(mockExercises);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [feedback, setFeedback] = useState<any | null>(null);
  const [exerciseResults, setExerciseResults] = useState<any[]>([]);
  const [showTranslation, setShowTranslation] = useState(false);
  const { hasReachedLimit, getLimit, getUsage, incrementUsage } = useFeatureLimits();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const { isOnline, isOfflineReady, enableOfflineAccess } = useOfflineCapability('/speaking');
  
  const audioChunksRef = useRef<BlobPart[]>([]);
  
  const isLimitReached = hasReachedLimit('speakingExercises');
  const maxExercises = getLimit('speakingExercises');
  const currentUsage = getUsage('speakingExercises');

  useEffect(() => {
    // In a real app, fetch exercises from the database
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

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
    stopRecording();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      const recorder = new MediaRecorder(stream);
      
      recorder.addEventListener('dataavailable', (e) => {
        audioChunksRef.current.push(e.data);
      });
      
      recorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        setIsRecording(false);
        
        // Stop all tracks from the stream to release microphone
        stream.getTracks().forEach(track => track.stop());
      });
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Speak clearly into your microphone."
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Failed",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handlePlayReference = () => {
    if (!selectedExerciseId) return;
    
    const exercise = exercises.find(ex => ex.id === selectedExerciseId);
    if (!exercise) return;
    
    const phrase = exercise.phrases[currentPhraseIndex];
    speak(phrase.text, 'it');
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
    if (!audioBlob || !selectedExerciseId) return;
    
    setIsAnalyzing(true);
    
    try {
      const exercise = exercises.find(ex => ex.id === selectedExerciseId);
      if (!exercise) return;
      
      const phrase = exercise.phrases[currentPhraseIndex];
      
      // In a real app, send the audio to a speech recognition service
      const result = await analyzeMockSpeech(audioBlob, phrase.text);
      
      setFeedback(result);
      
      toast({
        title: "Analysis Complete",
        description: `Overall pronunciation score: ${result.metrics.overall}/100`
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
    } else {
      // Exercise complete
      toast({
        title: "Exercise Complete",
        description: "You've completed all phrases in this exercise!"
      });
    }
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
                  >
                    <VolumeUp className="mr-2 h-4 w-4" /> Listen
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Overall</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pb-3">
                      <div className="text-3xl font-bold">{feedback.metrics.overall}%</div>
                      <Progress value={feedback.metrics.overall} className="mt-2" />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Accuracy</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pb-3">
                      <div className="text-3xl font-bold">{feedback.metrics.accuracy}%</div>
                      <Progress value={feedback.metrics.accuracy} className="mt-2" />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">Fluency</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pb-3">
                      <div className="text-3xl font-bold">{feedback.metrics.fluency}%</div>
                      <Progress value={feedback.metrics.fluency} className="mt-2" />
                    </CardContent>
                  </Card>
                </div>
                
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
                      {feedback.wordFeedback.map((word: any, index: number) => (
                        <div 
                          key={index}
                          className={`
                            p-2 rounded-md flex justify-between 
                            ${word.score < 70 ? 'bg-red-50 dark:bg-red-900/20' : 
                              word.score < 85 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 
                              'bg-green-50 dark:bg-green-900/20'}
                          `}
                        >
                          <span>{word.word}</span>
                          <div className="flex items-center gap-2">
                            {word.feedback && <span className="text-xs italic">{word.feedback}</span>}
                            <Badge variant={
                              word.score < 70 ? 'destructive' : 
                              word.score < 85 ? 'secondary' : 
                              'outline'
                            }>
                              {word.score}%
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
    </div>
  );
};

export default SpeakingModule;
