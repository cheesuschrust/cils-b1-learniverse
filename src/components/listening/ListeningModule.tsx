
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Volume1, 
  VolumeX,
  Loader2
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

interface ListeningExercise {
  id: string;
  title: string;
  audioUrl: string;
  transcript: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const ListeningModule = () => {
  const { user } = useAuth();
  const isPremium = user?.isPremiumUser || false;
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [currentExercise, setCurrentExercise] = useState<ListeningExercise | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const [responses, setResponses] = useState<{ [key: string]: number }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  
  // Mock exercises data
  const exercises: ListeningExercise[] = [
    {
      id: '1',
      title: 'At the Restaurant',
      audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2448/2448.wav', // placeholder audio
      transcript: 'Buongiorno! Vorrei prenotare un tavolo per stasera, per due persone. A che ora avete disponibilità?',
      questions: [
        {
          id: 'q1',
          question: 'What is the person asking about?',
          options: [
            'Ordering food', 
            'Reserving a table', 
            'Paying the bill', 
            'Finding the bathroom'
          ],
          correctAnswer: 1
        },
        {
          id: 'q2',
          question: 'How many people is the reservation for?',
          options: ['One', 'Two', 'Three', 'Four'],
          correctAnswer: 1
        },
        {
          id: 'q3',
          question: 'What does "stasera" mean in this context?',
          options: ['This morning', 'This afternoon', 'Tonight', 'Tomorrow'],
          correctAnswer: 2
        }
      ],
      difficulty: 'beginner'
    }
  ];
  
  // Load the first exercise on component mount
  React.useEffect(() => {
    if (exercises.length > 0) {
      setCurrentExercise(exercises[0]);
    }
  }, []);
  
  // Audio event handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };
  
  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      handlePlay();
    }
  };
  
  const handleForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 5);
    }
  };
  
  const handleBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
    }
  };
  
  const handlePlaybackRateChange = (rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };
  
  const handleVolumeChange = (values: number[]) => {
    if (audioRef.current) {
      const newVolume = values[0];
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };
  
  const handleSeek = (values: number[]) => {
    if (audioRef.current) {
      const seekTime = values[0];
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };
  
  const handleResponseChange = (questionId: string, optionIndex: number) => {
    setResponses(prev => ({ ...prev, [questionId]: optionIndex }));
  };
  
  const handleSubmit = () => {
    if (!currentExercise) return;
    
    let correctCount = 0;
    currentExercise.questions.forEach(question => {
      if (responses[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    const calculatedScore = Math.round((correctCount / currentExercise.questions.length) * 100);
    setScore(calculatedScore);
    setSubmitted(true);
  };
  
  const handleNewExercise = () => {
    if (!isPremium) {
      setShowPremiumDialog(true);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate loading a new exercise
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo purposes, just reset with the same exercise
      setCurrentTime(0);
      setIsPlaying(false);
      setSubmitted(false);
      setResponses({});
      setShowTranscript(false);
      
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.pause();
      }
    }, 1500);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  if (!currentExercise) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Listening Practice</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{currentExercise.title}</CardTitle>
              <CardDescription>
                Difficulty: <span className="capitalize">{currentExercise.difficulty}</span>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Audio player */}
              <div className="space-y-4">
                <audio 
                  ref={audioRef} 
                  src={currentExercise.audioUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">{formatTime(currentTime)}</span>
                  <div className="flex-1 mx-4">
                    <Slider
                      value={[currentTime]}
                      min={0}
                      max={duration || 100}
                      step={0.1}
                      onValueChange={handleSeek}
                      className="cursor-pointer"
                    />
                  </div>
                  <span className="text-sm">{formatTime(duration)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleBackward()}>
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    
                    {isPlaying ? (
                      <Button variant="outline" size="icon" onClick={handlePause}>
                        <Pause className="h-5 w-5" />
                      </Button>
                    ) : (
                      <Button variant="outline" size="icon" onClick={handlePlay}>
                        <Play className="h-5 w-5" />
                      </Button>
                    )}
                    
                    <Button variant="ghost" size="icon" onClick={() => handleForward()}>
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleVolumeChange([volume === 0 ? 0.7 : 0])}
                      >
                        {volume > 0.5 ? (
                          <Volume2 className="h-4 w-4" />
                        ) : volume > 0 ? (
                          <Volume1 className="h-4 w-4" />
                        ) : (
                          <VolumeX className="h-4 w-4" />
                        )}
                      </Button>
                      
                      <Slider
                        value={[volume]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={handleVolumeChange}
                        className="w-20"
                      />
                    </div>
                    
                    <select
                      value={playbackRate}
                      onChange={(e) => handlePlaybackRateChange(Number(e.target.value))}
                      className="text-sm bg-transparent border rounded px-1"
                    >
                      <option value={0.5}>0.5x</option>
                      <option value={0.75}>0.75x</option>
                      <option value={1}>1x</option>
                      <option value={1.25}>1.25x</option>
                      <option value={1.5}>1.5x</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Transcript Toggle */}
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowTranscript(!showTranscript)}
                >
                  {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
                </Button>
              </div>
              
              {/* Transcript */}
              {showTranscript && (
                <div className="p-4 border rounded-md bg-muted/30">
                  <p className="text-sm italic">{currentExercise.transcript}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Questions */}
          <Card>
            <CardHeader>
              <CardTitle>Comprehension Questions</CardTitle>
              <CardDescription>
                Listen to the audio and answer the following questions
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {currentExercise.questions.map((question, index) => (
                <div key={question.id} className="space-y-2">
                  <h3 className="font-medium">
                    {index + 1}. {question.question}
                  </h3>
                  
                  <RadioGroup
                    value={responses[question.id]?.toString()}
                    onValueChange={(value) => handleResponseChange(question.id, parseInt(value))}
                    disabled={submitted}
                  >
                    {question.options.map((option, optIndex) => (
                      <div 
                        key={optIndex} 
                        className={`flex items-center space-x-2 p-2 rounded-md ${
                          submitted && question.correctAnswer === optIndex
                            ? 'bg-green-100 dark:bg-green-900/20'
                            : submitted && responses[question.id] === optIndex && 
                              question.correctAnswer !== optIndex
                              ? 'bg-red-100 dark:bg-red-900/20'
                              : ''
                        }`}
                      >
                        <RadioGroupItem 
                          value={optIndex.toString()} 
                          id={`${question.id}-${optIndex}`} 
                        />
                        <Label htmlFor={`${question.id}-${optIndex}`} className="flex-grow cursor-pointer">
                          {option}
                        </Label>
                        
                        {submitted && question.correctAnswer === optIndex && (
                          <span className="text-green-600">✓</span>
                        )}
                        
                        {submitted && responses[question.id] === optIndex && 
                         question.correctAnswer !== optIndex && (
                          <span className="text-red-600">✗</span>
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
              
              <div className="flex justify-between items-center pt-4">
                {submitted ? (
                  <>
                    <div className="space-y-1">
                      <p className="font-medium">Your Score</p>
                      <div>
                        <span className="text-2xl font-bold">
                          {score}%
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({Object.values(responses).filter(
                            (response, index) => response === currentExercise.questions[index]?.correctAnswer
                          ).length}/{currentExercise.questions.length} correct)
                        </span>
                      </div>
                    </div>
                    
                    <Button onClick={handleNewExercise}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        'Try Another Exercise'
                      )}
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={handleSubmit}
                    disabled={currentExercise.questions.length !== Object.keys(responses).length}
                  >
                    Submit Answers
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Listen to the audio carefully and answer the comprehension questions.
                You can play the audio as many times as needed.
              </p>
              
              <h3 className="font-medium text-sm">Tips:</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Use the playback speed controls if the speech is too fast</li>
                <li>You can skip forward or backward 5 seconds using the arrow buttons</li>
                <li>Focus on understanding the general context first</li>
                <li>Listen for key words related to the questions</li>
                <li>The transcript is available if you need help (but try without it first)</li>
              </ul>
              
              {!isPremium && (
                <div className="p-4 mt-4 border rounded-md bg-primary/5">
                  <h4 className="text-sm font-medium">Free User Limit</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Free users can access one listening exercise per day.
                    Upgrade to Premium for unlimited exercises.
                  </p>
                  <Button className="w-full mt-2" size="sm">
                    Upgrade to Premium
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Premium Feature</DialogTitle>
            <DialogDescription>
              Free users can access one listening exercise per day.
              Upgrade to Premium for unlimited exercises and more features.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <h4 className="font-medium">Premium Benefits:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Unlimited listening exercises</li>
              <li>Access to all difficulty levels</li>
              <li>Downloadable transcripts</li>
              <li>Personalized listening recommendations</li>
              <li>Detailed performance analytics</li>
            </ul>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPremiumDialog(false)}>
              Not Now
            </Button>
            <Button>Upgrade to Premium</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListeningModule;
