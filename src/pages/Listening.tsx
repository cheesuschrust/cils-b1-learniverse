
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Award,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Info,
  Clock,
  BarChart,
} from "lucide-react";

// Sample audio exercise
const listeningExercise = {
  id: 1,
  title: "Notizie del Giorno",
  audioUrl: "https://static.openaudio.ai/2023/06/sample-audio-in-italian.mp3", // Replace with actual audio URL
  transcript:
    "Benvenuti alle notizie del giorno. Oggi a Roma, il Presidente della Repubblica ha incontrato i rappresentanti delle regioni per discutere delle nuove misure economiche. Il governo ha annunciato un nuovo piano per il sostegno alle piccole imprese. Secondo il Ministro dell'Economia, questo piano aiuterà migliaia di aziende in difficoltà. In altre notizie, la squadra nazionale di calcio si prepara per la prossima partita di qualificazione al campionato europeo.",
  difficulty: "Intermediate",
  type: "multiple-choice", // or "transcript"
  questions: [
    {
      id: 1,
      question: "Dove si è svolto l'incontro menzionato nel notiziario?",
      options: ["Milano", "Roma", "Napoli", "Firenze"],
      correctAnswer: "Roma",
    },
    {
      id: 2,
      question: "Chi ha incontrato i rappresentanti delle regioni?",
      options: [
        "Il Primo Ministro",
        "Il Ministro dell'Economia",
        "Il Presidente della Repubblica",
        "Il Ministro degli Esteri",
      ],
      correctAnswer: "Il Presidente della Repubblica",
    },
    {
      id: 3,
      question: "Qual è lo scopo del nuovo piano annunciato dal governo?",
      options: [
        "Sostegno alle piccole imprese",
        "Miglioramento delle infrastrutture",
        "Riforma del sistema educativo",
        "Aumento delle pensioni",
      ],
      correctAnswer: "Sostegno alle piccole imprese",
    },
  ],
};

const Listening = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([
    null,
    null,
    null,
  ]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [playCount, setPlayCount] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Create audio element
    const audio = new Audio(listeningExercise.audioUrl);
    audioRef.current = audio;
    
    // Event listeners
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });
    audio.addEventListener("ended", handleAudioEnd);
    
    // Cleanup
    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", () => {});
      audio.removeEventListener("ended", handleAudioEnd);
    };
  }, []);
  
  // Update progress bar
  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  // Handle audio end
  const handleAudioEnd = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    setCurrentTime(0);
    setPlayCount(playCount + 1);
  };
  
  // Toggle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        if (playCount === 0) {
          setPlayCount(1);
        }
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  // Reset audio
  const resetAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };
  
  // Seek to position
  const seek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (progressBarRef.current && audioRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = pos * duration;
      setCurrentTime(pos * duration);
    }
  };
  
  // Format time (seconds to mm:ss)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  
  // Handle option selection
  const handleOptionSelect = (questionIndex: number, option: string) => {
    if (isSubmitted) return;
    
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = option;
    setSelectedAnswers(newAnswers);
  };
  
  // Submit answers
  const handleSubmit = () => {
    if (selectedAnswers.some((answer) => answer === null)) {
      toast({
        title: "Please answer all questions",
        description: "You need to select an option for each question",
        variant: "destructive",
      });
      return;
    }
    
    let correct = 0;
    listeningExercise.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    
    setCorrectAnswers(correct);
    setIsSubmitted(true);
    
    toast({
      title: `You got ${correct} out of ${listeningExercise.questions.length} correct!`,
      description: showTranscript
        ? "Great job using the transcript to help you."
        : "Well done on completing the listening exercise.",
    });
  };
  
  // Finish quiz
  const handleFinish = () => {
    setQuizFinished(true);
  };
  
  // Try again
  const handleTryAgain = () => {
    setSelectedAnswers([null, null, null]);
    setIsSubmitted(false);
    setQuizFinished(false);
    setCurrentQuestion(0);
    setShowTranscript(false);
    setPlayCount(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };
  
  // Render audio player
  const renderAudioPlayer = () => (
    <div className="bg-secondary/30 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={togglePlay}
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
            className="h-8 w-8"
            onClick={resetAudio}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={toggleMute}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
      
      {/* Progress bar */}
      <div
        ref={progressBarRef}
        className="h-2 bg-secondary rounded-full overflow-hidden cursor-pointer"
        onClick={seek}
      >
        <div
          className="h-full bg-primary"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        ></div>
      </div>
      
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-muted-foreground">
          {playCount === 0
            ? "Play to start"
            : `Played ${playCount} ${playCount === 1 ? "time" : "times"}`}
        </div>
        <Button
          variant="link"
          size="sm"
          className="text-xs"
          onClick={() => setShowTranscript(!showTranscript)}
        >
          {showTranscript ? "Hide transcript" : "Show transcript"}
        </Button>
      </div>
      
      {showTranscript && (
        <div className="mt-4 p-4 bg-background rounded-md border text-sm">
          <p className="italic">{listeningExercise.transcript}</p>
        </div>
      )}
    </div>
  );
  
  // Render questions
  const renderQuestions = () => (
    <div className="space-y-6 mt-6">
      {listeningExercise.questions.map((question, index) => (
        <div
          key={question.id}
          className={`border rounded-lg p-4 ${
            isSubmitted
              ? selectedAnswers[index] === question.correctAnswer
                ? "border-green-300 bg-green-50"
                : "border-red-300 bg-red-50"
              : "border-border"
          }`}
        >
          <h3 className="font-medium mb-3 flex items-start">
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-sm mr-2">
              {index + 1}
            </span>
            {question.question}
          </h3>
          
          <RadioGroup
            value={selectedAnswers[index] || ""}
            className="space-y-2"
          >
            {question.options.map((option) => (
              <div
                key={option}
                className={`flex items-center space-x-2 rounded-md border p-3 ${
                  isSubmitted
                    ? option === question.correctAnswer
                      ? "border-green-500 bg-green-50"
                      : selectedAnswers[index] === option
                      ? "border-red-500 bg-red-50"
                      : "border-border bg-background"
                    : "border-border hover:border-primary hover:bg-accent/10"
                }`}
              >
                <RadioGroupItem
                  value={option}
                  id={`q${question.id}-${option}`}
                  checked={selectedAnswers[index] === option}
                  onClick={() => handleOptionSelect(index, option)}
                  disabled={isSubmitted}
                />
                <Label
                  htmlFor={`q${question.id}-${option}`}
                  className="flex-grow cursor-pointer"
                >
                  {option}
                </Label>
                
                {isSubmitted && option === question.correctAnswer && (
                  <div className="text-green-500">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                )}
                
                {isSubmitted &&
                  selectedAnswers[index] === option &&
                  option !== question.correctAnswer && (
                    <div className="text-red-500">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                  )}
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
    </div>
  );
  
  // Render quiz results
  const renderResults = () => (
    <Card className="w-full max-w-3xl mx-auto backdrop-blur-sm border-accent/20 animate-fade-up">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Award className="h-5 w-5 mr-2 text-primary" />
          Listening Exercise Results
        </CardTitle>
        <CardDescription>
          You've completed the listening comprehension exercise
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-around p-6 bg-secondary/30 rounded-lg">
          <div className="text-center mb-4 md:mb-0">
            <div className="text-3xl font-bold text-primary">
              {correctAnswers}/{listeningExercise.questions.length}
            </div>
            <p className="text-sm text-muted-foreground">Correct Answers</p>
          </div>
          
          <div className="text-center mb-4 md:mb-0">
            <div className="text-3xl font-bold">
              {Math.round(
                (correctAnswers / listeningExercise.questions.length) * 100
              )}
              %
            </div>
            <p className="text-sm text-muted-foreground">Accuracy</p>
          </div>
          
          <div className="text-center">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-secondary/80 stroke-current"
                  strokeWidth="10"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                ></circle>
                <circle
                  className="text-primary stroke-current"
                  strokeWidth="10"
                  strokeLinecap="round"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${
                    2 *
                    Math.PI *
                    40 *
                    (1 - correctAnswers / listeningExercise.questions.length)
                  }`}
                  style={{
                    transformOrigin: "center",
                    transform: "rotate(-90deg)",
                  }}
                ></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Volume2 className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-start p-4 bg-accent/20 rounded-lg">
          <Info className="h-5 w-5 text-primary mt-0.5 mr-2" />
          <div>
            <h3 className="font-medium">Your Performance</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You listened to the audio{" "}
              <span className="font-medium">{playCount} times</span>
              {showTranscript
                ? " and used the transcript for assistance."
                : " without using the transcript."}
            </p>
            
            <div className="mt-3 text-sm">
              <p className="font-medium">AI Feedback:</p>
              <p className="mt-1">
                {correctAnswers === listeningExercise.questions.length
                  ? "Excellent work! Your Italian listening comprehension is strong. You correctly understood key details about the news report."
                  : correctAnswers >=
                    Math.floor(listeningExercise.questions.length / 2)
                  ? "Good effort! You understood some key information from the audio. With more practice, you'll improve your ability to catch specific details."
                  : "You need more practice with Italian listening comprehension. Try listening to Italian news, podcasts, or radio shows regularly to improve your skills."}
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="font-medium">Audio Transcript</h3>
          <div className="p-4 bg-secondary/30 rounded-lg text-sm italic">
            {listeningExercise.transcript}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleTryAgain}>
          Try Again
        </Button>
        <Button>Next Exercise</Button>
      </CardFooter>
    </Card>
  );
  
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2 animate-fade-in">
        Listening Practice
      </h1>
      <p className="text-muted-foreground mb-8 animate-fade-in">
        Improve your Italian listening comprehension skills
      </p>
      
      {quizFinished ? (
        renderResults()
      ) : (
        <Card className="w-full max-w-3xl mx-auto backdrop-blur-sm border-accent/20 animate-fade-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                {listeningExercise.title}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                  {listeningExercise.difficulty}
                </span>
                <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                  {listeningExercise.type === "multiple-choice"
                    ? "Multiple Choice"
                    : "Transcription"}
                </span>
              </div>
            </div>
            <CardDescription>
              Listen to the audio and answer the questions below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderAudioPlayer()}
            {renderQuestions()}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center">
              {playCount === 0 && (
                <div className="flex items-center text-sm text-amber-500">
                  <HelpCircle className="h-4 w-4 mr-1" />
                  Play the audio at least once before submitting
                </div>
              )}
            </div>
            <div className="space-x-2">
              {!isSubmitted ? (
                <Button
                  onClick={handleSubmit}
                  disabled={
                    playCount === 0 ||
                    selectedAnswers.some((answer) => answer === null)
                  }
                >
                  Submit Answers
                </Button>
              ) : (
                <Button onClick={handleFinish}>
                  Finish Exercise
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Listening;
