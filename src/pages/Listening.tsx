
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { ConfidenceIndicator } from '@/components/ai/ConfidenceIndicator';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  CheckCircle2, XCircle, Loader2, ChevronLeft, ChevronRight,
  RefreshCcw, Music, ListMusic, Headphones, LucideHeadphones
} from 'lucide-react';
import { listeningExercises } from '@/data/listeningExercises';

interface ListeningExercise {
  id: string;
  title: string;
  audioUrl: string;
  transcript: string;
  translation?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questions: {
    id: string;
    question: string;
    options?: string[];
    correctAnswer: string;
  }[];
  type: 'comprehension' | 'dictation' | 'fill-in-the-blank';
  language: 'italian' | 'english';
  duration: number; // in seconds
}

const ListeningPage: React.FC = () => {
  const { toast } = useToast();
  const { isAIEnabled, translateText, isTranslating } = useAIUtils();
  
  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [playbackRate, setPlaybackRate] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  
  // Exercise state
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [exerciseType, setExerciseType] = useState<'comprehension' | 'dictation' | 'fill-in-the-blank'>('comprehension');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [userDictation, setUserDictation] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [feedbackMode, setFeedbackMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [repeatCount, setRepeatCount] = useState(0);
  
  // Audio element reference
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Filter exercises based on difficulty and type
  const filteredExercises = listeningExercises.filter(
    ex => ex.difficulty === difficulty && ex.type === exerciseType
  );
  
  // Get current exercise
  const currentExercise = filteredExercises[currentExerciseIndex] || null;
  
  // Reset state when difficulty or exercise type changes
  useEffect(() => {
    setCurrentExerciseIndex(0);
    setShowTranscript(false);
    setShowTranslation(false);
    setUserAnswers({});
    setUserDictation('');
    setShowResults(false);
    setFeedbackMode(false);
    setRepeatCount(0);
    setCurrentTime(0);
    setIsPlaying(false);
  }, [difficulty, exerciseType]);
  
  // Update audio element when exercise changes
  useEffect(() => {
    if (currentExercise && audioRef.current) {
      audioRef.current.src = currentExercise.audioUrl;
      audioRef.current.load();
      setCurrentTime(0);
      setDuration(currentExercise.duration);
      setIsPlaying(false);
      setRepeatCount(0);
    }
  }, [currentExercise]);
  
  // Update audio properties when related states change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.playbackRate = playbackRate;
    }
  }, [volume, playbackRate, isMuted]);
  
  // Update translation when transcript changes or translation is toggled
  useEffect(() => {
    if (showTranslation && currentExercise && isAIEnabled && !translatedText) {
      handleTranslate();
    }
  }, [showTranslation, currentExercise, isAIEnabled]);
  
  // Check if all questions are answered
  const allQuestionsAnswered = () => {
    if (!currentExercise) return false;
    
    if (exerciseType === 'comprehension') {
      return currentExercise.questions.every(q => userAnswers[q.id]);
    } else if (exerciseType === 'dictation') {
      return userDictation.trim().length > 0;
    }
    
    return false;
  };
  
  // Handle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Handle seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };
  
  // Handle volume change
  const handleVolumeChange = (values: number[]) => {
    if (!audioRef.current) return;
    
    const vol = values[0];
    audioRef.current.volume = vol;
    setVolume(vol);
    
    if (vol === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };
  
  // Handle playback rate change
  const handlePlaybackRateChange = (values: number[]) => {
    if (!audioRef.current) return;
    
    const rate = values[0];
    audioRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };
  
  // Mute/unmute
  const toggleMute = () => {
    if (!audioRef.current) return;
    
    if (isMuted) {
      audioRef.current.volume = volume;
    } else {
      audioRef.current.volume = 0;
    }
    
    setIsMuted(!isMuted);
  };
  
  // Restart audio
  const restartAudio = () => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setCurrentTime(0);
    setIsPlaying(true);
    setRepeatCount(repeatCount + 1);
  };
  
  // Format time (seconds to MM:SS)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Handle selection of an answer for comprehension questions
  const handleSelectAnswer = (questionId: string, answer: string) => {
    if (showResults) return; // Don't allow changes after submission
    
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  // Handle dictation input
  const handleDictationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (showResults) return; // Don't allow changes after submission
    
    setUserDictation(e.target.value);
  };
  
  // Submit answers
  const handleSubmit = () => {
    if (!currentExercise) return;
    
    setSubmitting(true);
    
    // Simulate processing
    setTimeout(() => {
      setShowResults(true);
      setSubmitting(false);
      setFeedbackMode(true);
      
      // Show toast with score
      const score = calculateScore();
      const percentage = Math.round((score.correct / score.total) * 100);
      
      toast({
        title: `Score: ${percentage}%`,
        description: `You got ${score.correct} out of ${score.total} correct!`,
        variant: percentage >= 80 ? 'default' : (percentage >= 60 ? 'default' : 'destructive'),
      });
    }, 1000);
  };
  
  // Calculate score
  const calculateScore = () => {
    if (!currentExercise) return { correct: 0, total: 0 };
    
    if (exerciseType === 'comprehension') {
      const questionsCount = currentExercise.questions.length;
      const correctAnswers = currentExercise.questions.filter(
        q => userAnswers[q.id] === q.correctAnswer
      ).length;
      
      return { correct: correctAnswers, total: questionsCount };
    } else if (exerciseType === 'dictation') {
      // For dictation, use a similarity score
      const similarity = calculateSimilarity(
        currentExercise.transcript.toLowerCase(),
        userDictation.toLowerCase()
      );
      
      const correctWords = Math.round(similarity * 100);
      return { correct: correctWords, total: 100 };
    }
    
    return { correct: 0, total: 0 };
  };
  
  // Calculate text similarity (0-1)
  const calculateSimilarity = (str1: string, str2: string): number => {
    // Function to clean strings (remove punctuation, extra spaces)
    const cleanString = (s: string) => s.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').replace(/\s+/g, ' ').trim();
    
    const clean1 = cleanString(str1);
    const clean2 = cleanString(str2);
    
    const words1 = clean1.split(' ');
    const words2 = clean2.split(' ');
    
    // Count matching words
    const matches = words1.filter(word => words2.includes(word)).length;
    
    // Calculate Dice coefficient
    return (2 * matches) / (words1.length + words2.length);
  };
  
  // Next exercise
  const handleNextExercise = () => {
    if (currentExerciseIndex < filteredExercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setShowTranscript(false);
      setShowTranslation(false);
      setUserAnswers({});
      setUserDictation('');
      setShowResults(false);
      setFeedbackMode(false);
      setRepeatCount(0);
      setCurrentTime(0);
      setTranslatedText('');
    } else {
      // End of exercises, loop back to first
      toast({
        title: "All Exercises Complete",
        description: "You've completed all exercises in this category!",
      });
      
      setCurrentExerciseIndex(0);
      setShowTranscript(false);
      setShowTranslation(false);
      setUserAnswers({});
      setUserDictation('');
      setShowResults(false);
      setFeedbackMode(false);
      setRepeatCount(0);
      setCurrentTime(0);
      setTranslatedText('');
    }
  };
  
  // Previous exercise
  const handlePrevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      setShowTranscript(false);
      setShowTranslation(false);
      setUserAnswers({});
      setUserDictation('');
      setShowResults(false);
      setFeedbackMode(false);
      setRepeatCount(0);
      setCurrentTime(0);
      setTranslatedText('');
    }
  };
  
  // Translate transcript
  const handleTranslate = async () => {
    if (!currentExercise || !isAIEnabled) return;
    
    try {
      const translated = await translateText(
        currentExercise.transcript, 
        'it', 
        'en'
      );
      
      setTranslatedText(translated);
    } catch (error) {
      console.error('Translation error:', error);
      toast({
        title: 'Translation Error',
        description: 'Failed to translate the transcript. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Restart exercise
  const handleRestartExercise = () => {
    setShowResults(false);
    setFeedbackMode(false);
    setUserAnswers({});
    setUserDictation('');
    setRepeatCount(0);
    restartAudio();
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <header className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Listening Practice</h1>
          <p className="text-muted-foreground">Improve your listening comprehension skills</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <ConfidenceIndicator contentType="listening" />
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exercise Settings</CardTitle>
              <CardDescription>
                Customize your listening practice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exercise-type">Exercise Type</Label>
                <Select 
                  value={exerciseType} 
                  onValueChange={(value) => setExerciseType(value as any)}
                >
                  <SelectTrigger id="exercise-type">
                    <SelectValue placeholder="Select an exercise type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comprehension">Comprehension Questions</SelectItem>
                    <SelectItem value="dictation">Dictation Practice</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select 
                  value={difficulty} 
                  onValueChange={(value) => setDifficulty(value as any)}
                >
                  <SelectTrigger id="difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-transcript">Show Transcript</Label>
                  <Switch 
                    id="show-transcript" 
                    checked={showTranscript}
                    onCheckedChange={setShowTranscript}
                  />
                </div>
              </div>
              
              {showTranscript && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-translation">Show Translation</Label>
                    <Switch 
                      id="show-translation" 
                      checked={showTranslation}
                      onCheckedChange={setShowTranslation}
                      disabled={!isAIEnabled}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Audio Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <audio 
                ref={audioRef}
                onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
                onEnded={() => setIsPlaying(false)}
                onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
              />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max={duration}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full"
                />
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={restartAudio}
                  disabled={!currentExercise}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="default"
                  size="icon"
                  onClick={togglePlay}
                  disabled={!currentExercise}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleMute}
                  disabled={!currentExercise}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="volume" className="flex justify-between">
                  <span>Volume</span>
                  <span>{Math.round(volume * 100)}%</span>
                </Label>
                <Slider
                  id="volume"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="playback-rate" className="flex justify-between">
                  <span>Playback Speed</span>
                  <span>{playbackRate.toFixed(1)}x</span>
                </Label>
                <Slider
                  id="playback-rate"
                  min={0.5}
                  max={1.5}
                  step={0.1}
                  value={[playbackRate]}
                  onValueChange={handlePlaybackRateChange}
                />
              </div>
              
              {repeatCount > 0 && (
                <div className="text-center text-sm text-muted-foreground">
                  Listened {repeatCount} {repeatCount === 1 ? 'time' : 'times'}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="col-span-1 md:col-span-3 space-y-4">
          {currentExercise ? (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <LucideHeadphones className="mr-2 h-5 w-5 text-primary" />
                    {currentExercise.title}
                  </CardTitle>
                  <Badge variant="outline" className="capitalize">
                    {currentExercise.difficulty}
                  </Badge>
                </div>
                <CardDescription>
                  {exerciseType === 'comprehension' 
                    ? 'Answer questions about the audio clip' 
                    : 'Listen and write down what you hear'}
                </CardDescription>
              </CardHeader>
              
              {/* Progress indicator */}
              <div className="px-6">
                <Progress
                  value={((currentExerciseIndex + 1) / filteredExercises.length) * 100}
                  className="h-1"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Exercise {currentExerciseIndex + 1} of {filteredExercises.length}</span>
                </div>
              </div>
              
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Play instructions */}
                  {!feedbackMode && (
                    <Alert variant="outline" className="bg-muted/30">
                      <AlertDescription className="flex items-center">
                        <Play className="h-4 w-4 mr-2 text-primary" />
                        {exerciseType === 'comprehension' 
                          ? 'Listen to the audio and answer the questions below.' 
                          : 'Listen to the audio and type what you hear.'}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Transcript (if enabled) */}
                  {showTranscript && (
                    <div className="space-y-2 border-t pt-4">
                      <h3 className="font-medium">Transcript:</h3>
                      <p className="text-sm">{currentExercise.transcript}</p>
                      
                      {showTranslation && (
                        <div className="mt-2">
                          <h3 className="font-medium">Translation:</h3>
                          {isTranslating ? (
                            <div className="flex items-center mt-1">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              <span className="text-sm">Translating...</span>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">{translatedText}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Exercise content based on type */}
                  <div className="space-y-4">
                    {exerciseType === 'comprehension' ? (
                      /* Comprehension Questions */
                      <div className="space-y-4">
                        {currentExercise.questions.map((question, index) => (
                          <div key={question.id} className="space-y-2">
                            <h3 className="font-medium">
                              {index + 1}. {question.question}
                            </h3>
                            
                            <RadioGroup
                              value={userAnswers[question.id] || ''}
                              onValueChange={(value) => handleSelectAnswer(question.id, value)}
                              disabled={showResults}
                            >
                              {question.options?.map((option) => (
                                <div key={option} className="flex items-center space-x-2 py-1">
                                  <RadioGroupItem
                                    value={option}
                                    id={`${question.id}-${option}`}
                                    className="peer"
                                  />
                                  <Label
                                    htmlFor={`${question.id}-${option}`}
                                    className={`flex-1 peer-disabled:opacity-100 ${
                                      showResults && option === question.correctAnswer
                                        ? 'text-green-600 font-medium'
                                        : showResults && option === userAnswers[question.id] && option !== question.correctAnswer
                                        ? 'text-red-600 line-through'
                                        : ''
                                    }`}
                                  >
                                    {option}
                                    
                                    {showResults && option === question.correctAnswer && (
                                      <CheckCircle2 className="h-4 w-4 inline ml-2 text-green-500" />
                                    )}
                                    
                                    {showResults && option === userAnswers[question.id] && option !== question.correctAnswer && (
                                      <XCircle className="h-4 w-4 inline ml-2 text-red-500" />
                                    )}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Dictation Exercise */
                      <div className="space-y-2">
                        <Label htmlFor="dictation">Type what you hear:</Label>
                        <Textarea
                          id="dictation"
                          placeholder="Write the text here..."
                          className="min-h-[150px]"
                          value={userDictation}
                          onChange={handleDictationChange}
                          disabled={showResults}
                        />
                        
                        {showResults && (
                          <div className="space-y-4 mt-4">
                            <div>
                              <h3 className="font-medium text-green-600">Correct Text:</h3>
                              <p className="text-sm border-l-2 border-green-500 pl-2 mt-1">{currentExercise.transcript}</p>
                            </div>
                            
                            <div>
                              <h3 className="font-medium text-blue-600">Your Text:</h3>
                              <p className="text-sm border-l-2 border-blue-500 pl-2 mt-1">{userDictation}</p>
                            </div>
                            
                            <div className="flex items-center">
                              <span className="font-medium mr-2">Accuracy:</span>
                              <Badge className={`px-2 py-1 ${
                                calculateScore().correct >= 80 
                                  ? 'bg-green-500 text-white' 
                                  : calculateScore().correct >= 60 
                                    ? 'bg-yellow-500 text-white' 
                                    : 'bg-red-500 text-white'
                              }`}>
                                {calculateScore().correct}%
                              </Badge>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevExercise}
                  disabled={currentExerciseIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                {showResults ? (
                  <Button 
                    variant="default" 
                    onClick={handleRestartExercise}
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!allQuestionsAnswered() || submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      'Submit'
                    )}
                  </Button>
                )}
                
                <Button
                  onClick={handleNextExercise}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="flex items-center justify-center p-12">
              <div className="text-center">
                <ListMusic className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-medium mb-2">No Exercises Available</h2>
                <p className="text-muted-foreground">
                  No listening exercises found for the selected difficulty and type.
                  Try selecting a different difficulty level or exercise type.
                </p>
              </div>
            </Card>
          )}
          
          {/* Tips Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Listening Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="tips">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="tips">General Tips</TabsTrigger>
                  <TabsTrigger value="comprehension">Comprehension</TabsTrigger>
                  <TabsTrigger value="dictation">Dictation</TabsTrigger>
                </TabsList>
                
                <TabsContent value="tips" className="pt-4">
                  <ul className="space-y-2 list-disc ml-5">
                    <li>Listen for main ideas before focusing on details</li>
                    <li>Pay attention to context clues and tone of voice</li>
                    <li>Use the playback speed control if needed</li>
                    <li>Practice with different accents and speakers</li>
                    <li>Don't get discouraged if you don't understand everything</li>
                  </ul>
                </TabsContent>
                
                <TabsContent value="comprehension" className="pt-4">
                  <ul className="space-y-2 list-disc ml-5">
                    <li>Read the questions before listening</li>
                    <li>Listen for key words that relate to the questions</li>
                    <li>Take notes while listening if it helps</li>
                    <li>Use the process of elimination for multiple choice</li>
                    <li>Listen multiple times if necessary</li>
                  </ul>
                </TabsContent>
                
                <TabsContent value="dictation" className="pt-4">
                  <ul className="space-y-2 list-disc ml-5">
                    <li>Write down what you can, even if you miss words</li>
                    <li>Focus on function words (articles, prepositions)</li>
                    <li>Notice sentence patterns and word order</li>
                    <li>Pay attention to singular/plural forms</li>
                    <li>Listen for word endings and verb tenses</li>
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ListeningPage;
