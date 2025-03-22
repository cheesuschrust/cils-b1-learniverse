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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  Mic,
  Square,
  Play,
  RefreshCw,
  CheckCircle2,
  Languages,
  HelpCircle,
  Sparkles,
  Volume2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const speakingPrompts = [
  {
    id: 1,
    title: "Presentazione personale",
    prompt: "Presentati brevemente. Parla del tuo nome, della tua età, di dove vieni e dei tuoi hobby.",
    translation: "Introduce yourself briefly. Talk about your name, age, where you're from, and your hobbies.",
    difficulty: "Beginner",
    tips: [
      "Usa frasi semplici e brevi",
      "Inizia con 'Mi chiamo...'",
      "Includi informazioni di base",
    ],
    tipsTranslation: [
      "Use simple, short sentences",
      "Start with 'My name is...'",
      "Include basic information",
    ],
    exampleAnswer: "Mi chiamo Marco e ho 30 anni. Sono di Milano, ma adesso vivo a Roma. Nel tempo libero mi piace leggere, guardare film e andare in bicicletta. Mi piace anche cucinare, specialmente la pasta.",
  },
  {
    id: 2,
    title: "Descrivi la tua giornata tipo",
    prompt: "Descrivi la tua giornata tipica, dalle attività mattutine fino alla sera.",
    translation: "Describe your typical day, from morning activities until evening.",
    difficulty: "Intermediate",
    tips: [
      "Usa avverbi di tempo come 'prima', 'dopo', 'poi'",
      "Utilizza il presente indicativo",
      "Descrivi 4-5 attività principali",
    ],
    tipsTranslation: [
      "Use time adverbs like 'first', 'after', 'then'",
      "Use the present indicative tense",
      "Describe 4-5 main activities",
    ],
    exampleAnswer: "Di solito mi sveglio alle 7 del mattino. Prima faccio colazione, poi mi vesto e vado al lavoro. Lavoro fino alle 5 del pomeriggio. Dopo il lavoro, a volte vado in palestra o incontro amici. La sera ceno a casa e guardo un po' di televisione prima di andare a dormire verso le 11.",
  },
  {
    id: 3,
    title: "Il tuo ultimo viaggio",
    prompt: "Parla del tuo ultimo viaggio. Dove sei andato/a? Cosa hai fatto? Cosa ti è piaciuto di più?",
    translation: "Talk about your last trip. Where did you go? What did you do? What did you like the most?",
    difficulty: "Advanced",
    tips: [
      "Usa il passato prossimo",
      "Includi dettagli sulle attività e i luoghi visitati",
      "Esprimi opinioni personali con frasi come 'Mi è piaciuto...'",
    ],
    tipsTranslation: [
      "Use the 'passato prossimo' tense",
      "Include details about activities and places visited",
      "Express personal opinions with phrases like 'I liked...'",
    ],
    exampleAnswer: "L'anno scorso sono andato in Sicilia per una settimana. Ho visitato Palermo, Catania e Taormina. Ho mangiato cibo delizioso, specialmente i cannoli e il pesce fresco. Ho anche visitato l'Etna, che è stato molto impressionante. La cosa che mi è piaciuta di più è stata la bellezza del mare e la gentilezza delle persone locali. Vorrei tornare presto per esplorare altre parti dell'isola.",
  },
];

const voiceOptions = [
  { id: "it-IT-female", name: "Italian (Female)", lang: "it-IT" },
  { id: "it-IT-male", name: "Italian (Male)", lang: "it-IT" },
  { id: "en-US-female", name: "English (Female)", lang: "en-US" },
  { id: "en-US-male", name: "English (Male)", lang: "en-US" },
  { id: "it-IT-ElsaNeural", name: "Elsa (Italian)", lang: "it-IT" },
  { id: "it-IT-DiegoNeural", name: "Diego (Italian)", lang: "it-IT" },
  { id: "en-US-AriaNeural", name: "Aria (English)", lang: "en-US" },
  { id: "en-US-GuyNeural", name: "Guy (English)", lang: "en-US" }
];

const Speaking = () => {
  const [selectedPrompt, setSelectedPrompt] = useState(speakingPrompts[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<{
    accuracy: number;
    fluency: number;
    pronunciation: number;
    grammar: number;
    overallScore: number;
    strengths: string[];
    strengthsTranslation: string[];
    improvements: string[];
    improvementsTranslation: string[];
    transcription: string;
  } | null>(null);
  const [showTips, setShowTips] = useState(false);
  const [selectedTab, setSelectedTab] = useState("practice");
  const [selectedVoice, setSelectedVoice] = useState("it-IT-female");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isReadingPrompt, setIsReadingPrompt] = useState(false);
  const [feedbackLanguage, setFeedbackLanguage] = useState<"english" | "italian" | "both">("both");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
      }
    };
    
    loadVoices();
    
    if (window.speechSynthesis !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    return () => {
      if (window.speechSynthesis !== undefined) {
        speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);
  
  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [audioBlob]);
  
  const handlePromptChange = (promptId: number) => {
    if (isRecording) {
      toast({
        title: "Cannot change prompt while recording",
        description: "Please stop recording first",
        variant: "destructive",
      });
      return;
    }
    
    const newPrompt = speakingPrompts.find(p => p.id === promptId);
    if (newPrompt) {
      setSelectedPrompt(newPrompt);
      resetExercise();
    }
  };
  
  const startRecording = async () => {
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
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use this feature",
        variant: "destructive",
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      toast({
        title: "Recording stopped",
        description: "You can now listen to your recording or submit for analysis",
      });
    }
  };
  
  const speakText = (text: string, language: string) => {
    if (!window.speechSynthesis) {
      toast({
        title: "Speech synthesis not supported",
        description: "Your browser doesn't support text-to-speech",
        variant: "destructive",
      });
      return;
    }
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => 
      v.lang.startsWith(language) && 
      ((selectedVoice.includes('female') && v.name.toLowerCase().includes('female')) ||
       (selectedVoice.includes('male') && v.name.toLowerCase().includes('male')) ||
       v.name.includes(selectedVoice.split('-').pop() || ''))
    );
    
    if (voice) {
      utterance.voice = voice;
    } else {
      const fallbackVoice = voices.find(v => v.lang.startsWith(language));
      if (fallbackVoice) {
        utterance.voice = fallbackVoice;
      }
    }
    
    utterance.lang = language;
    utterance.rate = 0.9;
    
    utterance.onstart = () => setIsReadingPrompt(true);
    utterance.onend = () => setIsReadingPrompt(false);
    
    window.speechSynthesis.speak(utterance);
  };
  
  const readPrompt = () => {
    speakText(selectedPrompt.prompt, 'it-IT');
  };
  
  const readTranslation = () => {
    speakText(selectedPrompt.translation, 'en-US');
  };
  
  const analyzeRecording = () => {
    if (!audioBlob) {
      toast({
        title: "No recording found",
        description: "Please record your answer first",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const mockFeedback = {
        accuracy: Math.floor(Math.random() * 30) + 70,
        fluency: Math.floor(Math.random() * 30) + 70,
        pronunciation: Math.floor(Math.random() * 30) + 70,
        grammar: Math.floor(Math.random() * 30) + 70,
        overallScore: Math.floor(Math.random() * 30) + 70,
        strengths: [
          "Buon uso dei verbi al presente",
          "Vocabolario appropriato",
          "Pronuncia chiara delle vocali",
        ],
        strengthsTranslation: [
          "Good use of present tense verbs",
          "Appropriate vocabulary",
          "Clear pronunciation of vowels",
        ],
        improvements: [
          "Migliorare la conjugazione dei verbi irregolari",
          "Prestare attenzione agli articoli",
          "Lavorare sulla fluidità delle frasi",
        ],
        improvementsTranslation: [
          "Improve conjugation of irregular verbs",
          "Pay attention to articles",
          "Work on sentence fluency",
        ],
        transcription: "Mi chiamo... sono di... mi piace...",
      };
      
      setFeedback(mockFeedback);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis complete",
        description: "Your speaking exercise has been evaluated",
      });
    }, 2000);
  };
  
  const resetExercise = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    
    setAudioBlob(null);
    setAudioUrl(null);
    setFeedback(null);
    setIsAnalyzing(false);
  };
  
  const toggleTips = () => {
    setShowTips(!showTips);
  };
  
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2 animate-fade-in">
        Speaking Practice
      </h1>
      <p className="text-muted-foreground mb-8 animate-fade-in">
        Improve your Italian speaking skills with guided practice exercises
      </p>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="practice" className="text-sm">
            Practice Speaking
          </TabsTrigger>
          <TabsTrigger value="history" className="text-sm">
            Your Progress
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="practice" className="space-y-6">
          <Card className="w-full backdrop-blur-sm border-accent/20 animate-fade-up">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">{selectedPrompt.title}</CardTitle>
                  <CardDescription>Speaking Exercise</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <select
                    className="px-3 py-1 rounded-md border text-sm"
                    value={selectedPrompt.id}
                    onChange={(e) => handlePromptChange(Number(e.target.value))}
                    disabled={isRecording}
                  >
                    {speakingPrompts.map((prompt) => (
                      <option key={prompt.id} value={prompt.id}>
                        {prompt.title} ({prompt.difficulty})
                      </option>
                    ))}
                  </select>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleTips}
                    className="flex items-center"
                  >
                    <HelpCircle className="h-4 w-4 mr-1" />
                    {showTips ? "Hide Tips" : "Show Tips"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-secondary/30 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h3 className="font-medium mb-2 flex justify-between items-center">
                      <span>Prompt (Italian):</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={readPrompt}
                        disabled={isReadingPrompt}
                        className="h-7 px-2"
                      >
                        <Volume2 className="h-4 w-4 mr-1" />
                        <span className="text-xs">Listen</span>
                      </Button>
                    </h3>
                    <p>{selectedPrompt.prompt}</p>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-2 flex justify-between items-center">
                      <span className="flex items-center">
                        <Languages className="h-4 w-4 mr-1" />
                        English:
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={readTranslation}
                        disabled={isReadingPrompt}
                        className="h-7 px-2"
                      >
                        <Volume2 className="h-4 w-4 mr-1" />
                        <span className="text-xs">Listen</span>
                      </Button>
                    </h3>
                    <p className="text-muted-foreground">
                      {selectedPrompt.translation}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="voice-select" className="text-sm font-medium">
                    Voice Selection
                  </label>
                  <Select 
                    value={selectedVoice} 
                    onValueChange={setSelectedVoice}
                  >
                    <SelectTrigger id="voice-select">
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {voiceOptions.map(voice => (
                        <SelectItem key={voice.id} value={voice.id}>
                          {voice.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="feedback-language" className="text-sm font-medium">
                    Feedback Language
                  </label>
                  <Select 
                    value={feedbackLanguage} 
                    onValueChange={(value: any) => setFeedbackLanguage(value)}
                  >
                    <SelectTrigger id="feedback-language">
                      <SelectValue placeholder="Select feedback language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English Only</SelectItem>
                      <SelectItem value="italian">Italian Only</SelectItem>
                      <SelectItem value="both">Both Languages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {showTips && (
                <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Sparkles className="h-4 w-4 mr-1 text-primary" />
                    Speaking Tips:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm space-y-1">
                      {selectedPrompt.tips.map((tip, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      {selectedPrompt.tipsTranslation.map((tip, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col items-center justify-center py-6 gap-4">
                {isRecording ? (
                  <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                    <div className="w-16 h-16 rounded-full bg-red-500/40 flex items-center justify-center">
                      <Mic className="h-8 w-8 text-red-500" />
                    </div>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                    <Mic className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                
                <div className="flex gap-3">
                  {!isRecording ? (
                    <Button 
                      onClick={startRecording}
                      className="flex items-center gap-2"
                    >
                      <Mic className="h-4 w-4" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button 
                      onClick={stopRecording}
                      variant="destructive"
                      className="flex items-center gap-2"
                    >
                      <Square className="h-4 w-4" />
                      Stop Recording
                    </Button>
                  )}
                  
                  {audioUrl && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        const audio = new Audio(audioUrl);
                        audio.play();
                      }}
                      className="flex items-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      Play Recording
                    </Button>
                  )}
                </div>
              </div>
              
              {audioBlob && !feedback && (
                <div className="flex justify-center mt-4">
                  <Button 
                    onClick={analyzeRecording}
                    disabled={isAnalyzing}
                    className="flex items-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Submit for Feedback
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={resetExercise}
                className="flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Reset
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  speakText(selectedPrompt.exampleAnswer, 'it-IT');
                }}
              >
                Listen to Example
              </Button>
            </CardFooter>
          </Card>
          
          {feedback && (
            <Card className="w-full backdrop-blur-sm border-accent/20 animate-fade-up">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-primary" />
                  Speaking Evaluation
                </CardTitle>
                <CardDescription>
                  AI-powered feedback on your speaking exercise
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-secondary/30 p-4 rounded-lg flex flex-col items-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {feedback.accuracy}%
                    </div>
                    <div className="text-xs text-center">Accuracy</div>
                  </div>
                  
                  <div className="bg-secondary/30 p-4 rounded-lg flex flex-col items-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {feedback.fluency}%
                    </div>
                    <div className="text-xs text-center">Fluency</div>
                  </div>
                  
                  <div className="bg-secondary/30 p-4 rounded-lg flex flex-col items-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {feedback.pronunciation}%
                    </div>
                    <div className="text-xs text-center">Pronunciation</div>
                  </div>
                  
                  <div className="bg-secondary/30 p-4 rounded-lg flex flex-col items-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {feedback.grammar}%
                    </div>
                    <div className="text-xs text-center">Grammar</div>
                  </div>
                </div>
                
                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                  <h3 className="font-medium mb-3 flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                    Overall Score:
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="w-full h-3 bg-secondary rounded-full">
                      <div 
                        className="h-3 bg-primary rounded-full" 
                        style={{ width: `${feedback.overallScore}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-lg">{feedback.overallScore}%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-medium">
                      Strengths / Punti di forza:
                    </h3>
                    <ul className="space-y-2">
                      {feedback.strengths.map((strength, i) => (
                        <li key={i} className="bg-secondary/30 p-3 rounded-lg text-sm">
                          <div className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                            <div className="space-y-1">
                              <p>{strength}</p>
                              <p className="text-xs text-muted-foreground">
                                {feedback.strengthsTranslation[i]}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium">
                      Areas to Improve / Aree da migliorare:
                    </h3>
                    <ul className="space-y-2">
                      {feedback.improvements.map((improvement, i) => (
                        <li key={i} className="bg-secondary/30 p-3 rounded-lg text-sm">
                          <div className="flex items-start">
                            <HelpCircle className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                            <div className="space-y-1">
                              <p>{improvement}</p>
                              <p className="text-xs text-muted-foreground">
                                {feedback.improvementsTranslation[i]}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">
                    Transcription / Trascrizione:
                  </h3>
                  <div className="p-4 bg-accent/10 rounded-lg text-sm">
                    <p className="italic">{feedback.transcription}</p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={resetExercise}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button>Download Feedback</Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Your Speaking Progress</CardTitle>
              <CardDescription>
                Track your improvement over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">
                Your progress history will appear here as you complete more speaking exercises.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 p-6 bg-accent/30 rounded-lg">
        <h3 className="text-lg font-bold mb-2">
          Voice Synthesis Technology
        </h3>
        <p className="text-muted-foreground">
          This application uses the Web Speech API, a built-in browser technology that provides high-quality voice synthesis without requiring external services.
        </p>
        <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
          <li>No external API keys required</li>
          <li>Works offline after initial page load</li>
          <li>Supports multiple languages and voices</li>
          <li>Speech recognition capabilities for pronunciation analysis</li>
        </ul>
        <p className="mt-4 text-sm">
          For optimal performance, use Chrome or Edge browsers which offer the widest range of voices.
        </p>
      </div>
    </div>
  );
};

export default Speaking;
