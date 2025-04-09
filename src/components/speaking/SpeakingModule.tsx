
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mic, StopCircle } from 'lucide-react';

const SPEAKING_PROMPTS = [
  {
    id: 1,
    title: "Mi presento",
    description: "Presentati e parla della tua famiglia, dei tuoi interessi e dei tuoi studi o del tuo lavoro.",
    duration: 90, // seconds
    level: "B1",
    hints: [
      "Come ti chiami e quanti anni hai?",
      "Da dove vieni?",
      "Come è composta la tua famiglia?",
      "Quali sono i tuoi interessi?",
      "Studi o lavori? Cosa ti piace del tuo studio/lavoro?"
    ]
  },
  {
    id: 2,
    title: "La mia città",
    description: "Descrivi la città o il paese dove vivi. Parla dei luoghi interessanti, dei trasporti e delle cose che ti piacciono o non ti piacciono.",
    duration: 120, // seconds
    level: "B1",
    hints: [
      "In quale città o paese vivi?",
      "Come è il clima?",
      "Quali sono i luoghi più interessanti da visitare?",
      "Come sono i trasporti pubblici?",
      "Cosa ti piace e cosa non ti piace della tua città?"
    ]
  },
  {
    id: 3,
    title: "Una festa importante",
    description: "Descrivi una festa o celebrazione importante nel tuo paese. Quando si celebra? Come si festeggia? Perché è importante?",
    duration: 100, // seconds
    level: "B1",
    hints: [
      "Quale festa hai scelto di descrivere?",
      "Quando si celebra questa festa?",
      "Come si festeggia tradizionalmente?",
      "Ci sono cibi o piatti speciali per questa occasione?",
      "Perché questa festa è importante nella tua cultura?"
    ]
  }
];

// Simulated feedback for demo purposes
const generateSimulatedFeedback = () => {
  const pronunciationScore = Math.floor(Math.random() * 30) + 60; // 60-90
  const fluencyScore = Math.floor(Math.random() * 30) + 60; // 60-90
  const vocabularyScore = Math.floor(Math.random() * 30) + 60; // 60-90
  const grammarScore = Math.floor(Math.random() * 30) + 60; // 60-90
  
  const overallScore = Math.floor(
    (pronunciationScore * 0.3) + 
    (fluencyScore * 0.3) + 
    (vocabularyScore * 0.2) + 
    (grammarScore * 0.2)
  );
  
  // Simulate detected words (10-20 words)
  const detectedWords = [
    "ciao", "mi", "chiamo", "sono", "italiano", "anni", "famiglia", 
    "lavoro", "studio", "casa", "città", "tempo", "libero", "piace", 
    "hobby", "amici", "università", "leggere", "ascoltare", "musica"
  ];
  
  const wordCount = Math.floor(Math.random() * 10) + 10;
  const selectedWords = [...detectedWords]
    .sort(() => 0.5 - Math.random())
    .slice(0, wordCount);
  
  // Generate feedback suggestions
  const feedbackSuggestions = [
    "Fai attenzione alla pronuncia delle doppie consonanti.",
    "Cerca di parlare un po' più lentamente per migliorare la chiarezza.",
    "Buon uso dei tempi verbali.",
    "Potresti ampliare il tuo vocabolario con sinonimi.",
    "Prova a usare più connettivi per rendere il tuo discorso più fluido.",
    "Fai attenzione all'accordo tra aggettivi e sostantivi."
  ];
  
  const selectedFeedback = [...feedbackSuggestions]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
  
  return {
    scores: {
      pronunciation: pronunciationScore,
      fluency: fluencyScore,
      vocabulary: vocabularyScore,
      grammar: grammarScore,
      overall: overallScore
    },
    detectedWords: selectedWords,
    feedback: selectedFeedback
  };
};

const SpeakingModule: React.FC = () => {
  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const { toast } = useToast();

  const handlePromptSelect = (promptId: number) => {
    // Stop any ongoing recording
    if (isRecording && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    
    setSelectedPrompt(promptId);
    setIsRecording(false);
    setRecordingTime(0);
    setRecordingComplete(false);
    setAnalysisResults(null);
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setRecordingComplete(false);
    
    // Start timer
    const id = window.setInterval(() => {
      setRecordingTime(prev => {
        const prompt = SPEAKING_PROMPTS.find(p => p.id === selectedPrompt);
        const duration = prompt?.duration || 90;
        
        if (prev >= duration) {
          stopRecording();
          return duration;
        }
        return prev + 1;
      });
    }, 1000);
    
    setIntervalId(id);
    
    toast({
      title: "Recording Started",
      description: "Speak clearly into your microphone.",
    });
  };

  const stopRecording = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    
    setIsRecording(false);
    setRecordingComplete(true);
    
    toast({
      title: "Recording Stopped",
      description: "Processing your speech...",
    });
    
    // Simulate processing delay
    setTimeout(() => {
      const feedback = generateSimulatedFeedback();
      setAnalysisResults(feedback);
      
      toast({
        title: "Analysis Complete",
        description: `Overall score: ${feedback.scores.overall}%`,
      });
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const chartData = analysisResults ? [
    { name: 'Pronunciation', score: analysisResults.scores.pronunciation },
    { name: 'Fluency', score: analysisResults.scores.fluency },
    { name: 'Vocabulary', score: analysisResults.scores.vocabulary },
    { name: 'Grammar', score: analysisResults.scores.grammar },
  ] : [];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="practice" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="practice">Practice</TabsTrigger>
          <TabsTrigger value="prompts">Prompts</TabsTrigger>
          <TabsTrigger value="results" disabled={!analysisResults}>Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="practice" className="space-y-4 mt-4">
          {!selectedPrompt ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Select a speaking prompt to start your practice.</p>
              <Button onClick={() => document.querySelector('[value="prompts"]')?.dispatchEvent(new Event('click'))}>
                Browse Speaking Prompts
              </Button>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{SPEAKING_PROMPTS.find(p => p.id === selectedPrompt)?.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {SPEAKING_PROMPTS.find(p => p.id === selectedPrompt)?.description}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">
                    Level: {SPEAKING_PROMPTS.find(p => p.id === selectedPrompt)?.level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Helpful Hints:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {SPEAKING_PROMPTS.find(p => p.id === selectedPrompt)?.hints.map((hint, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          {hint}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        Time: {formatTime(recordingTime)} / {formatTime(SPEAKING_PROMPTS.find(p => p.id === selectedPrompt)?.duration || 0)}
                      </span>
                      
                      {isRecording && (
                        <span className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
                          Recording...
                        </span>
                      )}
                    </div>
                    
                    <Progress 
                      value={(recordingTime / (SPEAKING_PROMPTS.find(p => p.id === selectedPrompt)?.duration || 1)) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center space-x-4">
                {!isRecording ? (
                  <Button 
                    onClick={startRecording} 
                    disabled={recordingComplete && !analysisResults}
                    className="flex items-center"
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    Start Recording
                  </Button>
                ) : (
                  <Button 
                    onClick={stopRecording}
                    variant="destructive"
                    className="flex items-center"
                  >
                    <StopCircle className="mr-2 h-4 w-4" />
                    Stop Recording
                  </Button>
                )}
                
                {analysisResults && (
                  <Button 
                    variant="outline"
                    onClick={() => document.querySelector('[value="results"]')?.dispatchEvent(new Event('click'))}
                  >
                    View Results
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="prompts" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SPEAKING_PROMPTS.map((prompt) => (
              <Card 
                key={prompt.id} 
                className={`cursor-pointer hover:shadow-md transition-shadow ${selectedPrompt === prompt.id ? 'border-primary' : ''}`}
                onClick={() => handlePromptSelect(prompt.id)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{prompt.title}</CardTitle>
                  <CardDescription>
                    Level: {prompt.level} | Duration: {formatTime(prompt.duration)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {prompt.description}
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePromptSelect(prompt.id);
                      setTimeout(() => {
                        document.querySelector('[value="practice"]')?.dispatchEvent(new Event('click'));
                      }, 100);
                    }}
                  >
                    Start Practice
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="results" className="mt-4">
          {analysisResults && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Speaking Assessment</CardTitle>
                  <CardDescription>
                    AI analysis of your speaking performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Overall Score</h3>
                      <div className="flex items-center space-x-4">
                        <Progress value={analysisResults.scores.overall} className="flex-1" />
                        <Badge variant={analysisResults.scores.overall >= 70 ? "default" : "outline"}>
                          {analysisResults.scores.overall}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Skills Breakdown</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Bar dataKey="score" fill="#3b82f6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Words Detected</h3>
                      <div className="flex flex-wrap gap-2">
                        {analysisResults.detectedWords.map((word: string) => (
                          <Badge key={word} variant="outline">
                            {word}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">AI Feedback</h3>
                      <ul className="space-y-2">
                        {analysisResults.feedback.map((item: string, index: number) => (
                          <li key={index} className="text-sm">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={() => document.querySelector('[value="practice"]')?.dispatchEvent(new Event('click'))}>
                    Back to Practice
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SpeakingModule;
