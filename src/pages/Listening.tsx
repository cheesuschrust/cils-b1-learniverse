
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PlayIcon, PauseIcon, SkipForward, Volume2 } from 'lucide-react';
import { useAIUtils } from '@/hooks/useAIUtils';
import { Skeleton } from '@/components/ui/skeleton';
import ConfidenceIndicator from '@/components/ai/ConfidenceIndicator';

interface ListeningPageProps {
  // Props for the Listening page
}

const ListeningPage: React.FC<ListeningPageProps> = () => {
  const { toast } = useToast();
  const { speakText, isAIEnabled } = useAIUtils();
  const [isLoading, setIsLoading] = useState(true);
  const [currentExercise, setCurrentExercise] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [progress, setProgress] = useState(0);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);

  // Fetch exercises when component mounts
  useEffect(() => {
    const loadExercises = async () => {
      try {
        // Mock data for now
        setTimeout(() => {
          setCurrentExercise({
            id: '1',
            title: 'Basic Italian Conversation',
            difficulty: 'beginner',
            audio: {
              url: '/audio/conversation1.mp3',
              transcript: 'Buongiorno, come stai oggi?'
            },
            questions: [
              {
                id: 'q1',
                text: 'What is the person saying?',
                options: [
                  { id: 'a', text: 'Good morning, how are you today?' },
                  { id: 'b', text: 'Good evening, how was your day?' },
                  { id: 'c', text: 'Hello, what is your name?' },
                  { id: 'd', text: 'Good afternoon, where are you going?' }
                ],
                correctOption: 'a'
              }
            ]
          });
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Failed to load listening exercises:', error);
        toast({
          variant: 'destructive',
          title: 'Error Loading Exercises',
          description: 'Failed to load listening exercises. Please try again.'
        });
      }
    };

    loadExercises();
  }, [toast]);

  const handlePlayAudio = async () => {
    if (!currentExercise) return;
    
    try {
      setIsPlaying(true);
      // Here we would normally play an audio file
      // For now, we'll use the text-to-speech to simulate it
      await speakText(currentExercise.audio.transcript, 'it');
      setIsPlaying(false);
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
      toast({
        variant: 'destructive',
        title: 'Playback Error',
        description: 'Failed to play audio. Please try again.'
      });
    }
  };

  const handleAnswerSelection = (optionId: string) => {
    if (exerciseCompleted) return;
    
    const isCorrect = currentExercise?.questions[0].correctOption === optionId;
    setUserAnswer(optionId);
    setExerciseCompleted(true);
    
    toast({
      variant: isCorrect ? 'default' : 'destructive',
      title: isCorrect ? 'Correct!' : 'Incorrect',
      description: isCorrect 
        ? 'Great job! Your answer is correct.' 
        : `The correct answer was: "${currentExercise?.questions[0].options.find(
            (opt: any) => opt.id === currentExercise?.questions[0].correctOption
          )?.text}"`
    });
    
    // Update progress
    setProgress((prev) => Math.min(prev + 20, 100));
  };

  const handleNextExercise = () => {
    // In a real app, would load the next exercise
    setUserAnswer('');
    setExerciseCompleted(false);
    toast({
      title: 'Next Exercise',
      description: 'Loading the next listening exercise...'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Listening Practice</h1>
        <Card>
          <CardHeader>
            <CardTitle><Skeleton className="h-8 w-3/4" /></CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Listening Practice</h1>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{currentExercise?.title}</CardTitle>
            <Badge variant="outline">{currentExercise?.difficulty}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Audio Player */}
          <div className="bg-muted/50 p-6 rounded-lg flex flex-col items-center justify-center">
            <Volume2 className="h-16 w-16 text-primary mb-4" />
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePlayAudio}
                disabled={isPlaying || !isAIEnabled}
              >
                {isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayAudio}
                disabled={isPlaying || !isAIEnabled}
                className="flex items-center gap-2"
              >
                <Volume2 className="h-4 w-4" /> 
                Play Audio
              </Button>
            </div>
            {!isAIEnabled && (
              <p className="text-destructive text-sm mt-2">
                AI features are disabled. Enable them in settings to use text-to-speech.
              </p>
            )}
          </div>
          
          {/* Questions */}
          <div>
            <h3 className="text-lg font-medium mb-4">{currentExercise?.questions[0].text}</h3>
            <div className="space-y-2">
              {currentExercise?.questions[0].options.map((option: any) => (
                <Button
                  key={option.id}
                  variant={
                    userAnswer === option.id
                      ? option.id === currentExercise?.questions[0].correctOption
                        ? "default"
                        : "destructive"
                      : exerciseCompleted && option.id === currentExercise?.questions[0].correctOption
                      ? "outline"
                      : "outline"
                  }
                  className={`w-full justify-start text-left ${
                    exerciseCompleted && option.id === currentExercise?.questions[0].correctOption
                      ? "border-green-500 text-green-700"
                      : ""
                  }`}
                  onClick={() => handleAnswerSelection(option.id)}
                  disabled={exerciseCompleted}
                >
                  {option.text}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Confidence Indicator */}
          <div className="mt-4">
            <ConfidenceIndicator contentType="listening" score={75} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={() => window.history.back()}>
            Back
          </Button>
          <Button onClick={handleNextExercise} disabled={!exerciseCompleted}>
            {exerciseCompleted ? (
              <>
                <span>Next Exercise</span>
                <SkipForward className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Answer to Continue"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ListeningPage;
