
import React, { useState, useEffect, useRef } from 'react';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Play, Pause, SkipForward, Volume2, VolumeX } from 'lucide-react';

interface ListeningExercise {
  id: string;
  title: string;
  audioUrl: string;
  transcript: string;
  questions: ListeningQuestion[];
}

interface ListeningQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

const mockExercises: ListeningExercise[] = [
  {
    id: 'ex1',
    title: 'At the Restaurant',
    audioUrl: 'https://example.com/restaurant.mp3', // This would be a real URL in production
    transcript: 'Buongiorno! Vorrei prenotare un tavolo per due persone per stasera alle otto, per favore.',
    questions: [
      {
        id: 'q1',
        text: 'What is the person asking for?',
        options: [
          'To order food',
          'To book a table',
          'To pay the bill',
          'To speak to the manager'
        ],
        correctAnswer: 1
      },
      {
        id: 'q2',
        text: 'For how many people is the reservation?',
        options: ['One', 'Two', 'Three', 'Four'],
        correctAnswer: 1
      },
      {
        id: 'q3',
        text: 'What time is the reservation for?',
        options: ['7:00', '8:00', '9:00', '10:00'],
        correctAnswer: 1
      }
    ]
  }
];

const ListeningPage: React.FC = () => {
  const { speak } = useAIUtils();
  const [currentExercise, setCurrentExercise] = useState<ListeningExercise | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // In a real implementation, we would fetch exercises from an API
    setCurrentExercise(mockExercises[0]);
  }, []);
  
  useEffect(() => {
    if (!audioRef.current) return;
    
    audioRef.current.volume = isMuted ? 0 : volume / 100;
    
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        const percent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(percent);
      }
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };
    
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('ended', handleEnded);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [volume, isMuted]);
  
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const skipForward = () => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = Math.min(
      audioRef.current.duration,
      audioRef.current.currentTime + 5
    );
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };
  
  const handleSubmit = () => {
    if (!currentExercise) return;
    
    let correctCount = 0;
    currentExercise.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    
    const calculatedScore = Math.round((correctCount / currentExercise.questions.length) * 100);
    setScore(calculatedScore);
    setShowResults(true);
    
    toast({
      title: `Score: ${calculatedScore}%`,
      description: `You got ${correctCount} out of ${currentExercise.questions.length} questions correct.`,
    });
  };
  
  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
    setScore(0);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };
  
  const speakText = (text: string) => {
    speak(text, 'it');
  };
  
  if (!currentExercise) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  
  return (
    <>
      <Helmet>
        <title>Listening Exercise | CILS B1 Learniverse</title>
      </Helmet>
      
      <div className="container max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Listening Exercise</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{currentExercise.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <audio ref={audioRef} src={currentExercise.audioUrl} style={{ display: 'none' }} />
              
              <div className="flex items-center gap-4 mb-3">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={togglePlayPause}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={skipForward}
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
                
                <Progress value={progress} className="flex-1" />
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm">Volume:</span>
                <Slider
                  defaultValue={[volume]}
                  max={100}
                  step={1}
                  className="w-24"
                  onValueChange={(val) => setVolume(val[0])}
                  disabled={isMuted}
                />
              </div>
            </div>
            
            <div className="space-y-6">
              {currentExercise.questions.map((question, qIndex) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">
                    {qIndex + 1}. {question.text}
                  </h3>
                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => (
                      <div 
                        key={oIndex}
                        className={`p-3 border rounded-md cursor-pointer ${
                          answers[question.id] === oIndex 
                            ? 'bg-primary/10 border-primary/50' 
                            : 'hover:bg-muted'
                        } ${
                          showResults && oIndex === question.correctAnswer
                            ? 'bg-green-100 dark:bg-green-900/20 border-green-500'
                            : ''
                        } ${
                          showResults && answers[question.id] === oIndex && oIndex !== question.correctAnswer
                            ? 'bg-red-100 dark:bg-red-900/20 border-red-500'
                            : ''
                        }`}
                        onClick={() => !showResults && handleAnswerSelect(question.id, oIndex)}
                      >
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 
                            ${answers[question.id] === oIndex 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted-foreground/20 text-muted-foreground'
                            }`}
                          >
                            {String.fromCharCode(65 + oIndex)}
                          </div>
                          <span>{option}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={showResults || Object.keys(answers).length < currentExercise.questions.length}
            >
              Submit Answers
            </Button>
          </CardFooter>
        </Card>
        
        {showResults && (
          <Card>
            <CardHeader>
              <CardTitle>Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-4">{currentExercise.transcript}</p>
              <Button onClick={() => speakText(currentExercise.transcript)}>
                Listen to Transcript
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default ListeningPage;
