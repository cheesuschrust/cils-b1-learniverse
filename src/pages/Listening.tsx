
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Volume2, PlayCircle, PauseCircle, RotateCcw, ChevronRight, AlertCircle, CheckCircle } from "lucide-react";
import { useAIUtils } from '@/hooks/useAIUtils';
import SpeakableWord from '@/components/learning/SpeakableWord';
import { textToSpeech } from '@/utils/textToSpeech';

interface ListeningExercise {
  id: string;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  audio: {
    url?: string;
    transcript: string;
    duration: number;
  };
  questions: Array<{
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
  }>;
}

// Mock listening exercises data
const mockExercises: ListeningExercise[] = [
  {
    id: "listening-1",
    title: "At the Restaurant",
    level: "beginner",
    audio: {
      transcript: "Buongiorno! Vorrei prenotare un tavolo per due persone per stasera alle otto, per favore.",
      duration: 5
    },
    questions: [
      {
        id: "q1",
        text: "What is the person trying to do?",
        options: [
          "Order food",
          "Reserve a table",
          "Pay the bill",
          "Ask for directions"
        ],
        correctAnswer: "Reserve a table"
      },
      {
        id: "q2",
        text: "For how many people is the reservation?",
        options: ["One", "Two", "Three", "Four"],
        correctAnswer: "Two"
      }
    ]
  },
  {
    id: "listening-2",
    title: "Weather Forecast",
    level: "intermediate",
    audio: {
      transcript: "Oggi ci sarà bel tempo con temperature intorno ai 25 gradi. Nel pomeriggio sono previste nuvole sparse, ma senza pioggia.",
      duration: 8
    },
    questions: [
      {
        id: "q1",
        text: "What will the weather be like today?",
        options: [
          "Rainy",
          "Nice weather",
          "Snowy",
          "Stormy"
        ],
        correctAnswer: "Nice weather"
      },
      {
        id: "q2",
        text: "What is the approximate temperature?",
        options: ["15 degrees", "20 degrees", "25 degrees", "30 degrees"],
        correctAnswer: "25 degrees"
      }
    ]
  }
];

const Listening: React.FC = () => {
  const { toast } = useToast();
  const { speakText } = useAIUtils();
  
  const [exercises, setExercises] = useState<ListeningExercise[]>(mockExercises);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  
  const currentExercise = exercises[currentExerciseIndex];
  
  // Handle audio playback
  const handlePlayAudio = useCallback(async () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setPlayCount(prev => prev + 1);
    
    try {
      await textToSpeech(currentExercise.audio.transcript, { language: 'it' });
    } catch (error) {
      console.error("Error playing audio:", error);
      toast({
        variant: "destructive",
        title: "Playback Error",
        description: "Failed to play the audio. Please try again."
      });
    } finally {
      setIsPlaying(false);
    }
  }, [currentExercise, isPlaying, toast]);
  
  // Reset progress timer when audio plays
  useEffect(() => {
    if (isPlaying) {
      setProgress(0);
      const duration = currentExercise.audio.duration * 1000;
      const interval = 100;
      const steps = duration / interval;
      let currentStep = 0;
      
      const timer = setInterval(() => {
        currentStep++;
        setProgress(Math.min((currentStep / steps) * 100, 100));
        
        if (currentStep >= steps) {
          clearInterval(timer);
          setIsPlaying(false);
        }
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [isPlaying, currentExercise]);
  
  // Handle answer selection
  const handleSelectAnswer = (questionId: string, answer: string) => {
    if (isSubmitted) return;
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  // Submit answers
  const handleSubmit = () => {
    // Check if all questions have been answered
    const allAnswered = currentExercise.questions.every(q => answers[q.id]);
    
    if (!allAnswered) {
      toast({
        variant: "warning",
        title: "Incomplete Answers",
        description: "Please answer all questions before submitting."
      });
      return;
    }
    
    // Calculate score
    let correct = 0;
    currentExercise.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    
    setCorrectCount(correct);
    setIsSubmitted(true);
    
    toast({
      variant: correct === currentExercise.questions.length ? "default" : "warning",
      title: "Exercise Completed",
      description: `You got ${correct} out of ${currentExercise.questions.length} correct!`
    });
  };
  
  // Move to next exercise
  const handleNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setAnswers({});
      setIsSubmitted(false);
      setPlayCount(0);
      setProgress(0);
    }
  };
  
  // Reset current exercise
  const handleReset = () => {
    setAnswers({});
    setIsSubmitted(false);
    setPlayCount(0);
    setProgress(0);
  };
  
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Listening Practice</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Volume2 className="mr-2 h-5 w-5 text-primary" />
            {currentExercise.title}
            <span className="ml-auto text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
              {currentExercise.level}
            </span>
          </CardTitle>
          <CardDescription>
            Listen to the audio and answer the questions. You can play the audio up to 3 times.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex flex-col space-y-4 items-center p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handlePlayAudio}
                disabled={isPlaying || playCount >= 3}
              >
                {isPlaying ? (
                  <PauseCircle className="h-6 w-6" />
                ) : (
                  <PlayCircle className="h-6 w-6" />
                )}
              </Button>
              
              <div className="flex-1 space-y-1">
                <Progress value={progress} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {playCount}/3 plays
                  </span>
                  <span>
                    {currentExercise.audio.duration}s
                  </span>
                </div>
              </div>
            </div>
            
            {isSubmitted && (
              <div className="text-sm italic mt-2 text-muted-foreground">
                <SpeakableWord 
                  word={currentExercise.audio.transcript}
                  language="it"
                  showTooltip={false}
                />
              </div>
            )}
          </div>
          
          <Separator />
          
          <div className="space-y-6">
            {currentExercise.questions.map((question, index) => (
              <div key={question.id} className="space-y-3">
                <h3 className="font-medium">
                  {index + 1}. {question.text}
                </h3>
                
                <div className="grid grid-cols-1 gap-2">
                  {question.options.map(option => (
                    <Button
                      key={option}
                      variant={answers[question.id] === option 
                        ? "default" 
                        : "outline"}
                      className={`justify-start h-auto py-3 px-4 ${
                        isSubmitted && option === question.correctAnswer
                          ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                          : isSubmitted && answers[question.id] === option && option !== question.correctAnswer
                          ? "border-red-500 bg-red-50 dark:bg-red-950/30"
                          : ""
                      }`}
                      onClick={() => handleSelectAnswer(question.id, option)}
                      disabled={isSubmitted}
                    >
                      <div className="flex items-center w-full">
                        <span>{option}</span>
                        {isSubmitted && option === question.correctAnswer && (
                          <CheckCircle className="ml-auto h-5 w-5 text-green-500" />
                        )}
                        {isSubmitted && answers[question.id] === option && option !== question.correctAnswer && (
                          <AlertCircle className="ml-auto h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {isSubmitted && (
            <Alert variant={correctCount === currentExercise.questions.length ? "default" : "warning"}>
              <AlertDescription>
                You scored {correctCount} out of {currentExercise.questions.length}!
                {correctCount === currentExercise.questions.length 
                  ? " Great job!" 
                  : " Keep practicing to improve your listening skills."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isPlaying}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          
          {!isSubmitted ? (
            <Button 
              onClick={handleSubmit} 
              disabled={Object.keys(answers).length !== currentExercise.questions.length || isPlaying}
            >
              Submit Answers
            </Button>
          ) : (
            <Button 
              onClick={handleNextExercise}
              disabled={currentExerciseIndex >= exercises.length - 1}
            >
              Next Exercise
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Listening;
