
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useFeatureLimits } from '@/hooks/useFeatureLimits';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import useOfflineCapability from '@/hooks/useOfflineCapability';
import { Loader2, Play, Pause, VolumeUp, VolumeX, SkipForward, RotateCcw, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { textToSpeech, stopSpeaking, pauseSpeaking, resumeSpeaking } from '@/utils/textToSpeech';

// Mock exercises until we connect to the database
const mockExercises = [
  {
    id: '1',
    title: 'Basic Conversations',
    description: 'Practice understanding common Italian conversations',
    level: 'beginner',
    audio: {
      transcriptItalian: 'Ciao! Come stai? Mi chiamo Marco. Sono di Roma. E tu, come ti chiami e di dove sei?',
      transcriptEnglish: 'Hello! How are you? My name is Marco. I\'m from Rome. And you, what\'s your name and where are you from?',
    },
    questions: [
      {
        id: 'q1',
        question: 'What is the man\'s name?',
        options: ['Marco', 'Mario', 'Matteo', 'Michele'],
        correctAnswer: 'Marco'
      },
      {
        id: 'q2',
        question: 'Where is he from?',
        options: ['Milan', 'Naples', 'Rome', 'Florence'],
        correctAnswer: 'Rome'
      },
      {
        id: 'q3',
        question: 'What is he asking about?',
        options: ['Your job', 'Your name and origin', 'Your family', 'Your age'],
        correctAnswer: 'Your name and origin'
      }
    ]
  },
  {
    id: '2',
    title: 'Ordering at a Restaurant',
    description: 'Learn how to understand restaurant conversations',
    level: 'intermediate',
    audio: {
      transcriptItalian: 'Buonasera, vorrei prenotare un tavolo per due persone per domani sera alle otto, è possibile? E vorrei sapere se avete piatti vegetariani nel menu.',
      transcriptEnglish: 'Good evening, I would like to reserve a table for two people for tomorrow evening at eight, is that possible? And I would like to know if you have vegetarian dishes on the menu.',
    },
    questions: [
      {
        id: 'q1',
        question: 'What is the person trying to do?',
        options: ['Order takeout', 'Reserve a table', 'Pay the bill', 'Complain about food'],
        correctAnswer: 'Reserve a table'
      },
      {
        id: 'q2',
        question: 'How many people is the reservation for?',
        options: ['One', 'Two', 'Three', 'Four'],
        correctAnswer: 'Two'
      },
      {
        id: 'q3',
        question: 'What time is the reservation for?',
        options: ['7:00', '7:30', '8:00', '8:30'],
        correctAnswer: '8:00'
      },
      {
        id: 'q4',
        question: 'What special request does the person make?',
        options: ['A quiet table', 'A table near the window', 'Information about vegetarian options', 'A birthday cake'],
        correctAnswer: 'Information about vegetarian options'
      }
    ]
  }
];

const ListeningModule: React.FC = () => {
  const [exercises, setExercises] = useState<any[]>(mockExercises);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const { hasReachedLimit, getLimit, getUsage, incrementUsage } = useFeatureLimits();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const { isOnline, isOfflineReady, enableOfflineAccess } = useOfflineCapability('/listening');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isLimitReached = hasReachedLimit('listeningExercises');
  const maxExercises = getLimit('listeningExercises');
  const currentUsage = getUsage('listeningExercises');

  useEffect(() => {
    // In a real app, fetch exercises from the database
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // We'd normally fetch from API here
    }, 1000);
  }, []);

  const handleStartExercise = async (index: number) => {
    if (isLimitReached && !user?.isPremium) {
      toast({
        title: "Daily Limit Reached",
        description: `You've reached your daily limit of ${maxExercises} listening exercises. Upgrade to Premium for unlimited access.`,
        variant: "destructive"
      });
      return;
    }
    
    setCurrentExerciseIndex(index);
    setSelectedAnswers({});
    setShowResults(false);
    
    // Reset score
    setScore({ correct: 0, total: 0 });
    
    try {
      await incrementUsage('listeningExercises');
    } catch (err) {
      console.error("Failed to increment usage:", err);
    }
  };

  const handlePlayAudio = async () => {
    if (!currentExerciseIndex && currentExerciseIndex !== 0) return;
    
    const exercise = exercises[currentExerciseIndex];
    
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
      return;
    }
    
    setIsPlaying(true);
    
    try {
      await textToSpeech(exercise.audio.transcriptItalian, {
        language: 'it',
        rate: playbackSpeed
      });
      setIsPlaying(false);
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
      toast({
        title: "Audio Error",
        description: "Failed to play the audio. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answer
    });
  };

  const handleSubmit = () => {
    if (!currentExerciseIndex && currentExerciseIndex !== 0) return;
    
    const exercise = exercises[currentExerciseIndex];
    const questions = exercise.questions;
    
    // Calculate score
    let correctCount = 0;
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    setScore({
      correct: correctCount,
      total: questions.length
    });
    
    setShowResults(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const handleBackToExercises = () => {
    setCurrentExerciseIndex(null);
    stopSpeaking();
    setIsPlaying(false);
  };

  if (!isAuthenticated) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Italian Listening Exercises</CardTitle>
          <CardDescription>
            Please log in to access listening exercises
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>You need to be logged in to use the listening exercises.</p>
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

  if (currentExerciseIndex !== null) {
    const exercise = exercises[currentExerciseIndex];
    
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
          <CardHeader>
            <CardTitle>{exercise.title}</CardTitle>
            <CardDescription>{exercise.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Listen to the conversation</h3>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handlePlayAudio}
                    className="flex gap-2 items-center"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <VolumeUp className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <Slider
                    defaultValue={[1]}
                    max={2}
                    min={0.5}
                    step={0.1}
                    value={[playbackSpeed]}
                    onValueChange={(value) => setPlaybackSpeed(value[0])}
                  />
                </div>
                <span className="text-sm w-12 text-muted-foreground">
                  {playbackSpeed}x
                </span>
              </div>
              
              {showResults && (
                <div className="mt-4 p-3 bg-background rounded-md">
                  <p className="font-medium mb-1">Transcript:</p>
                  <p className="italic text-muted-foreground">{exercise.audio.transcriptItalian}</p>
                  <p className="text-sm mt-2">{exercise.audio.transcriptEnglish}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              {exercise.questions.map((question, index) => (
                <div key={question.id} className="space-y-3">
                  <h3 className="font-medium">{index + 1}. {question.question}</h3>
                  <RadioGroup 
                    value={selectedAnswers[question.id] || ''}
                    onValueChange={(value) => handleAnswerSelect(question.id, value)}
                    className="space-y-2"
                  >
                    {question.options.map((option) => {
                      const isCorrect = option === question.correctAnswer;
                      const isSelected = selectedAnswers[question.id] === option;
                      const showCorrect = showResults && isCorrect;
                      const showIncorrect = showResults && isSelected && !isCorrect;
                      
                      return (
                        <div 
                          key={option} 
                          className={`
                            flex items-center rounded-md border p-3
                            ${showCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : ''}
                            ${showIncorrect ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : ''}
                          `}
                        >
                          <RadioGroupItem 
                            value={option} 
                            id={`${question.id}-${option}`}
                            disabled={showResults}
                          />
                          <Label 
                            htmlFor={`${question.id}-${option}`}
                            className="w-full ml-2 flex justify-between"
                          >
                            {option}
                            {showCorrect && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                            {showIncorrect && <AlertCircle className="h-4 w-4 text-red-500" />}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {showResults ? (
              <>
                <p className="font-medium">
                  Score: {score.correct}/{score.total} ({Math.round((score.correct / score.total) * 100)}%)
                </p>
                <div className="space-x-2">
                  <Button variant="outline" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4 mr-2" /> Try Again
                  </Button>
                  <Button onClick={handleBackToExercises}>
                    Back to Exercises
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
                <Button onClick={handleSubmit} disabled={Object.keys(selectedAnswers).length < exercise.questions.length}>
                  Submit Answers
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Italian Listening Exercises</h1>
          <p className="text-muted-foreground">
            Improve your comprehension by listening to native speakers
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
            You've reached your daily limit of {maxExercises} listening exercises. 
            <Button variant="link" className="p-0 h-auto font-normal">
              Upgrade to Premium
            </Button> for unlimited access.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exercises.map((exercise, index) => (
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
                {exercise.questions.length} comprehension questions
              </p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button 
                className="w-full" 
                onClick={() => handleStartExercise(index)}
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

export default ListeningModule;
