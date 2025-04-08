
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface ListeningExercise {
  id: string;
  title: string;
  audioUrl: string;
  transcript: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questions: Question[];
  category: string;
}

// Sample data - in a real app, this would come from Supabase
const sampleExercise: ListeningExercise = {
  id: "1",
  title: "At the Italian Market",
  audioUrl: "https://example.com/audio/italian-market.mp3", // This would be a real URL in production
  transcript: "Buongiorno, vorrei due etti di parmigiano. Quanto costa al chilo? Venti euro al chilo. Va bene, prendo anche mezzo chilo di prosciutto crudo e un po' di olive nere.",
  difficulty: "intermediate",
  category: "Shopping",
  questions: [
    {
      id: "q1",
      text: "Cosa vuole comprare la persona?",
      options: [
        "Due etti di mozzarella",
        "Due etti di parmigiano",
        "Due chili di parmigiano",
        "Due pacchi di pasta"
      ],
      correctAnswer: "Due etti di parmigiano"
    },
    {
      id: "q2",
      text: "Quanto costa il parmigiano al chilo?",
      options: [
        "Dieci euro",
        "Quindici euro",
        "Venti euro",
        "Venticinque euro"
      ],
      correctAnswer: "Venti euro"
    },
    {
      id: "q3",
      text: "Cosa compra in più la persona?",
      options: [
        "Prosciutto cotto e olive verdi",
        "Prosciutto crudo e olive nere",
        "Prosciutto crudo e pomodori",
        "Pane e olive nere"
      ],
      correctAnswer: "Prosciutto crudo e olive nere"
    }
  ]
};

const ListeningModule: React.FC = () => {
  const [currentExercise, setCurrentExercise] = useState<ListeningExercise>(sampleExercise);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize audio element
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('durationchange', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('durationchange', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    // Update audio element when isPlaying changes
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(error => {
        console.error("Error playing audio:", error);
        toast({
          title: "Playback Error",
          description: "Could not play the audio. Please try again.",
          variant: "destructive"
        });
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, toast]);

  useEffect(() => {
    // Update volume
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
    }
  };

  const handleForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 5);
    }
  };

  const handleVolumeToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    
    if (audioRef.current) {
      audioRef.current.currentTime = pos * duration;
    }
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    if (isSubmitted) return;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    if (isSubmitted) return;
    
    let correctCount = 0;
    currentExercise.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    const newScore = Math.round((correctCount / currentExercise.questions.length) * 100);
    setScore(newScore);
    setIsSubmitted(true);
    
    toast({
      title: "Exercise Completed!",
      description: `Your score: ${newScore}%`,
      variant: newScore >= 70 ? "default" : "destructive"
    });
  };

  const handleNext = () => {
    // In a real app, this would load the next exercise
    toast({
      title: "Coming Soon",
      description: "More listening exercises will be available soon!",
    });
  };

  const currentQuestion = currentExercise.questions[currentQuestionIndex];

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{currentExercise.title}</CardTitle>
              <CardDescription>
                {currentExercise.category} - {currentExercise.difficulty.charAt(0).toUpperCase() + currentExercise.difficulty.slice(1)} Level
              </CardDescription>
            </div>
            <Badge variant="outline" className="capitalize">
              {currentExercise.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Audio Player */}
          <div className="bg-muted p-4 rounded-md">
            <audio ref={audioRef} src={currentExercise.audioUrl} preload="metadata" />
            
            <div 
              className="h-2 bg-secondary rounded-full overflow-hidden cursor-pointer mb-4"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-primary transition-all"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={handleRewind}>
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Button variant="default" size="icon" onClick={handlePlayPause}>
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                
                <Button variant="outline" size="icon" onClick={handleForward}>
                  <SkipForward className="h-4 w-4" />
                </Button>
                
                <Button variant="ghost" size="icon" onClick={handleVolumeToggle}>
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-20"
                />
              </div>
            </div>
          </div>
          
          {/* Transcript Toggle */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setShowTranscript(!showTranscript)}>
              {showTranscript ? "Hide Transcript" : "Show Transcript"}
            </Button>
          </div>
          
          {/* Transcript */}
          {showTranscript && (
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">Transcript:</h3>
              <p className="italic text-muted-foreground">{currentExercise.transcript}</p>
            </div>
          )}
          
          {/* Questions */}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Comprehension Questions</h3>
              <div className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {currentExercise.questions.length}
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">{currentQuestion.text}</h4>
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-md border cursor-pointer transition-colors ${
                        selectedAnswers[currentQuestion.id] === option 
                          ? 'bg-primary/10 border-primary' 
                          : 'hover:bg-muted'
                      } ${
                        isSubmitted && option === currentQuestion.correctAnswer
                          ? 'bg-green-100 border-green-500'
                          : isSubmitted && selectedAnswers[currentQuestion.id] === option && option !== currentQuestion.correctAnswer
                            ? 'bg-red-100 border-red-500'
                            : ''
                      }`}
                      onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous Question
                </Button>
                
                {currentQuestionIndex < currentExercise.questions.length - 1 ? (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(currentExercise.questions.length - 1, prev + 1))}
                  >
                    Next Question
                  </Button>
                ) : (
                  !isSubmitted ? (
                    <Button 
                      variant="default" 
                      onClick={handleSubmit}
                      disabled={Object.keys(selectedAnswers).length !== currentExercise.questions.length}
                    >
                      Submit Answers
                    </Button>
                  ) : (
                    <Button variant="default" onClick={handleNext}>
                      Next Exercise
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        </CardContent>
        {isSubmitted && (
          <CardFooter className="border-t pt-4">
            <div className="w-full space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Your Score:</span>
                <span className={`font-bold ${score >= 70 ? 'text-green-600' : 'text-red-600'}`}>{score}%</span>
              </div>
              <Progress value={score} className="h-2" />
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ListeningModule;
