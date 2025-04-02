
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import {
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Loader2,
  Volume2,
  RefreshCw
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

interface SpeakingPrompt {
  id: string;
  title: string;
  prompt: string;
  imageUrl?: string;
  audioUrl?: string;
  modelResponse?: string;
  tips?: string[];
  transcription?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface PronunciationFeedback {
  score: number;
  details: {
    accuracy: number;
    fluency: number;
    rhythm: number;
    intonation: number;
  };
  wordByWord: {
    word: string;
    score: number;
    timestamp: [number, number];
  }[];
  feedback: string;
  suggestions: string[];
}

const SpeakingModule = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isPremium = user?.isPremiumUser || false;
  
  const [selectedPrompt, setSelectedPrompt] = useState<SpeakingPrompt | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<PronunciationFeedback | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Mock prompts data
  React.useEffect(() => {
    const mockPrompts: SpeakingPrompt[] = [
      {
        id: '1',
        title: 'Mi Presento',
        prompt: 'Presentati in italiano. Di' il tuo nome, da dove vieni, cosa fai e quali sono i tuoi hobby.',
        tips: [
          'Inizia con "Mi chiamo..."',
          'Parla lentamente e chiaramente',
          'Usa frasi semplici',
          'Includi informazioni sul tuo lavoro o studio'
        ],
        modelResponse: 'Buongiorno! Mi chiamo Marco e vengo da Roma. Sono uno studente all\'università e studio informatica. Nel tempo libero, mi piace giocare a calcio e leggere libri. Ho anche un cane che si chiama Luna e mi piace passeggiare con lei nel parco.',
        difficulty: 'beginner'
      }
    ];
    
    setSelectedPrompt(mockPrompts[0]);
  }, []);
  
  const startRecording = async () => {
    // For free users, check if they've already used their daily exercise
    if (!isPremium) {
      const hasUsedDaily = localStorage.getItem('speakingExerciseUsed') === 'true';
      if (hasUsedDaily) {
        setShowPremiumDialog(true);
        return;
      }
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioBlob);
        setAudioUrl(url);
        setIsRecording(false);
        
        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setFeedback(null);
      setTranscription(null);
      
      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to record audio.",
        variant: "destructive",
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  const handlePlayRecording = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };
  
  const handleSubmitRecording = () => {
    if (!recordedAudio) return;
    
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      // Mock transcription
      const mockTranscription = "Mi chiamo Marco e vengo da Roma. Sono uno studente e studio informatica. Mi piace giocare a calcio e leggere libri.";
      setTranscription(mockTranscription);
      
      // Mock feedback
      const mockFeedback: PronunciationFeedback = {
        score: 76,
        details: {
          accuracy: 78,
          fluency: 72,
          rhythm: 75,
          intonation: 79
        },
        wordByWord: [
          { word: "Mi", score: 95, timestamp: [0.5, 0.7] },
          { word: "chiamo", score: 85, timestamp: [0.8, 1.2] },
          { word: "Marco", score: 90, timestamp: [1.3, 1.7] },
          { word: "e", score: 98, timestamp: [1.8, 1.9] },
          { word: "vengo", score: 75, timestamp: [2.0, 2.4] },
          { word: "da", score: 92, timestamp: [2.5, 2.7] },
          { word: "Roma", score: 88, timestamp: [2.8, 3.2] }
        ],
        feedback: "La tua pronuncia è generalmente buona, ma potresti migliorare la fluidità. Alcune parole come 'vengo' hanno bisogno di più attenzione all'accentuazione.",
        suggestions: [
          "Pratica la pronuncia delle vocali aperte e chiuse",
          "Fai attenzione alla doppia consonante nelle parole come 'sono'",
          "Cerca di parlare con un ritmo più naturale"
        ]
      };
      
      setFeedback(mockFeedback);
      setIsProcessing(false);
      
      // For free users, mark as used
      if (!isPremium) {
        localStorage.setItem('speakingExerciseUsed', 'true');
      }
    }, 2000);
  };
  
  const handleNewPrompt = () => {
    if (!isPremium) {
      setShowPremiumDialog(true);
      return;
    }
    
    // Reset states
    setRecordedAudio(null);
    setAudioUrl(null);
    setTranscription(null);
    setFeedback(null);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const getSpeakingLevelColor = (score: number) => {
    if (score >= 85) return "text-green-500";
    if (score >= 70) return "text-amber-500";
    return "text-red-500";
  };
  
  if (!selectedPrompt) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Speaking Practice</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{selectedPrompt.title}</CardTitle>
              <CardDescription>
                <span className="capitalize">{selectedPrompt.difficulty}</span> level speaking exercise
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Your Task:</h3>
                <p className="text-base">{selectedPrompt.prompt}</p>
                
                {selectedPrompt.imageUrl && (
                  <img 
                    src={selectedPrompt.imageUrl} 
                    alt="Speaking prompt" 
                    className="rounded-md max-h-64 mx-auto object-cover" 
                  />
                )}
                
                {selectedPrompt.tips && (
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium mb-2">Speaking Tips:</h3>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      {selectedPrompt.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedPrompt.audioUrl && (
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium mb-2">Listen to Example:</h3>
                    <Button variant="outline" size="sm">
                      <Volume2 className="h-4 w-4 mr-2" />
                      Play Example Audio
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-center items-center flex-col space-y-4">
                  {recordedAudio ? (
                    <>
                      <audio 
                        ref={audioRef} 
                        src={audioUrl || undefined} 
                        onEnded={handleAudioEnded} 
                        className="hidden" 
                      />
                      
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="h-16 w-16 rounded-full"
                        onClick={handlePlayRecording}
                      >
                        {isPlaying ? (
                          <Pause className="h-8 w-8" />
                        ) : (
                          <Play className="h-8 w-8" />
                        )}
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        {isPlaying ? "Pause Recording" : "Play Recording"}
                      </p>
                      
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" onClick={handleNewPrompt}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Record Again
                        </Button>
                        <Button 
                          onClick={handleSubmitRecording} 
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            'Submit for Feedback'
                          )}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant={isRecording ? "destructive" : "outline"} 
                        size="lg" 
                        className="h-16 w-16 rounded-full"
                        onClick={isRecording ? stopRecording : startRecording}
                      >
                        {isRecording ? (
                          <MicOff className="h-8 w-8" />
                        ) : (
                          <Mic className="h-8 w-8" />
                        )}
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        {isRecording ? `Recording... ${formatTime(recordingTime)}` : "Click to Start Recording"}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {feedback && transcription && (
            <Card>
              <CardHeader>
                <CardTitle>Pronunciation Feedback</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Your Transcription:</h3>
                  <div className="p-4 border rounded-md bg-muted/30">
                    <p className="text-base italic">{transcription}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Overall Score:</h3>
                    <span className={`text-xl font-bold ${getSpeakingLevelColor(feedback.score)}`}>
                      {feedback.score}/100
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Accuracy</span>
                        <span className={`text-sm font-medium ${getSpeakingLevelColor(feedback.details.accuracy)}`}>
                          {feedback.details.accuracy}
                        </span>
                      </div>
                      <Progress value={feedback.details.accuracy} className="h-1" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Fluency</span>
                        <span className={`text-sm font-medium ${getSpeakingLevelColor(feedback.details.fluency)}`}>
                          {feedback.details.fluency}
                        </span>
                      </div>
                      <Progress value={feedback.details.fluency} className="h-1" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Rhythm</span>
                        <span className={`text-sm font-medium ${getSpeakingLevelColor(feedback.details.rhythm)}`}>
                          {feedback.details.rhythm}
                        </span>
                      </div>
                      <Progress value={feedback.details.rhythm} className="h-1" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Intonation</span>
                        <span className={`text-sm font-medium ${getSpeakingLevelColor(feedback.details.intonation)}`}>
                          {feedback.details.intonation}
                        </span>
                      </div>
                      <Progress value={feedback.details.intonation} className="h-1" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Feedback:</h3>
                  <p className="text-sm text-muted-foreground">{feedback.feedback}</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Suggestions for Improvement:</h3>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    {feedback.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleNewPrompt}>
                    Try Another Exercise
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Speaking Resources</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Practice your Italian speaking skills with guided prompts and receive pronunciation feedback.
              </p>
              
              <h3 className="font-medium text-sm">Speaking Tips:</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Speak clearly and at a moderate pace</li>
                <li>Focus on stress and intonation</li>
                <li>Practice double consonants (rr, tt, ll)</li>
                <li>Listen to native speakers regularly</li>
                <li>Record yourself to identify areas for improvement</li>
              </ul>
              
              <h3 className="font-medium text-sm mt-4">Common Phrases:</h3>
              <div className="space-y-2">
                <div className="p-2 border rounded-md">
                  <p className="text-sm font-medium">Mi chiamo...</p>
                  <p className="text-xs text-muted-foreground">My name is...</p>
                </div>
                <div className="p-2 border rounded-md">
                  <p className="text-sm font-medium">Vengo da...</p>
                  <p className="text-xs text-muted-foreground">I come from...</p>
                </div>
                <div className="p-2 border rounded-md">
                  <p className="text-sm font-medium">Mi piace...</p>
                  <p className="text-xs text-muted-foreground">I like...</p>
                </div>
                <div className="p-2 border rounded-md">
                  <p className="text-sm font-medium">Secondo me...</p>
                  <p className="text-xs text-muted-foreground">In my opinion...</p>
                </div>
              </div>
              
              {!isPremium && (
                <div className="p-4 mt-4 border rounded-md bg-primary/5">
                  <h4 className="text-sm font-medium">Free User Limit</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Free users can access one speaking exercise per day.
                    Upgrade to Premium for unlimited speaking practice with AI feedback.
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
              Free users can access one speaking exercise per day.
              Upgrade to Premium for unlimited exercises and more features.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <h4 className="font-medium">Premium Benefits:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Unlimited speaking exercises</li>
              <li>Advanced pronunciation analysis</li>
              <li>Word-by-word feedback</li>
              <li>Native speaker model responses</li>
              <li>Personalized improvement plan</li>
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

export default SpeakingModule;
