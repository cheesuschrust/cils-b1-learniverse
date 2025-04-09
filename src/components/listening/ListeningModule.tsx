
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const SAMPLE_AUDIOS = [
  {
    id: 1,
    title: "Introducing Yourself",
    level: "A2-B1",
    duration: "1:30",
    url: "https://example.com/sample1.mp3",
    transcript: "Ciao! Mi chiamo Marco e sono di Milano. Ho trent'anni e lavoro come ingegnere. Nel tempo libero mi piace leggere e andare in bicicletta. E tu, come ti chiami? Di dove sei?"
  },
  {
    id: 2,
    title: "At the Restaurant",
    level: "B1",
    duration: "2:15",
    url: "https://example.com/sample2.mp3",
    transcript: "Buonasera, vorrei prenotare un tavolo per due persone per domani sera alle otto, è possibile? Preferirei un tavolo vicino alla finestra, se disponibile. Grazie mille."
  },
  {
    id: 3,
    title: "Daily Routine",
    level: "B1",
    duration: "1:45",
    url: "https://example.com/sample3.mp3",
    transcript: "Di solito mi sveglio alle sette del mattino. Faccio colazione, mi vesto e vado al lavoro in autobus. Lavoro fino alle cinque del pomeriggio, poi torno a casa. La sera guardo la TV o leggo un libro."
  }
];

type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
};

const SAMPLE_QUESTIONS: Record<number, Question[]> = {
  1: [
    {
      id: 1,
      text: "Come si chiama la persona che parla?",
      options: ["Paolo", "Marco", "Luca", "Gianni"],
      correctAnswer: "Marco"
    },
    {
      id: 2,
      text: "Quanti anni ha?",
      options: ["Venti", "Venticinque", "Trenta", "Quaranta"],
      correctAnswer: "Trenta"
    },
    {
      id: 3,
      text: "Che lavoro fa?",
      options: ["Medico", "Insegnante", "Ingegnere", "Avvocato"],
      correctAnswer: "Ingegnere"
    }
  ],
  2: [
    {
      id: 1,
      text: "Per quante persone si vuole prenotare un tavolo?",
      options: ["Una", "Due", "Tre", "Quattro"],
      correctAnswer: "Due"
    },
    {
      id: 2,
      text: "Per quando si vuole prenotare?",
      options: ["Oggi a pranzo", "Oggi a cena", "Domani a pranzo", "Domani a cena"],
      correctAnswer: "Domani a cena"
    },
    {
      id: 3,
      text: "Dove vorrebbe sedersi la persona?",
      options: ["Vicino alla porta", "Vicino alla finestra", "In terrazza", "In centro"],
      correctAnswer: "Vicino alla finestra"
    }
  ],
  3: [
    {
      id: 1,
      text: "A che ora si sveglia la persona?",
      options: ["Alle sei", "Alle sette", "Alle otto", "Alle nove"],
      correctAnswer: "Alle sette"
    },
    {
      id: 2,
      text: "Come va al lavoro?",
      options: ["In macchina", "In treno", "In autobus", "A piedi"],
      correctAnswer: "In autobus"
    },
    {
      id: 3,
      text: "Cosa fa la sera?",
      options: ["Esce con gli amici", "Guarda la TV o legge", "Studia", "Va in palestra"],
      correctAnswer: "Guarda la TV o legge"
    }
  ]
};

const ListeningModule: React.FC = () => {
  const [selectedAudio, setSelectedAudio] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { toast } = useToast();

  const handleAudioSelect = (audioId: number) => {
    setSelectedAudio(audioId);
    setShowTranscript(false);
    setUserAnswers({});
    setHasSubmitted(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control the audio playback
  };

  const handleAnswerSelect = (questionId: number, answer: string) => {
    if (hasSubmitted) return;
    
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    if (!selectedAudio) return;
    
    const questions = SAMPLE_QUESTIONS[selectedAudio];
    if (!questions) return;
    
    // Check if all questions are answered
    const allAnswered = questions.every(q => userAnswers[q.id] !== undefined);
    
    if (!allAnswered) {
      toast({
        title: "Please answer all questions",
        description: "You need to answer all questions before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    setHasSubmitted(true);
    
    // Calculate score
    const correctAnswers = questions.filter(q => userAnswers[q.id] === q.correctAnswer);
    const score = (correctAnswers.length / questions.length) * 100;
    
    toast({
      title: "Quiz Submitted",
      description: `Your score: ${score.toFixed(0)}% (${correctAnswers.length}/${questions.length})`,
      variant: score >= 70 ? "default" : "destructive"
    });
  };

  const resetExercise = () => {
    setUserAnswers({});
    setHasSubmitted(false);
    setShowTranscript(false);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="exercises" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
          <TabsTrigger value="library">Audio Library</TabsTrigger>
        </TabsList>
        
        <TabsContent value="exercises" className="space-y-4 mt-4">
          {!selectedAudio ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Select an audio from the Library tab to start a listening exercise.</p>
              <Button onClick={() => document.querySelector('[value="library"]')?.dispatchEvent(new Event('click'))}>
                Browse Audio Library
              </Button>
            </div>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>{SAMPLE_AUDIOS.find(a => a.id === selectedAudio)?.title}</CardTitle>
                  <CardDescription>
                    Level: {SAMPLE_AUDIOS.find(a => a.id === selectedAudio)?.level} | 
                    Duration: {SAMPLE_AUDIOS.find(a => a.id === selectedAudio)?.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 flex justify-center items-center space-x-4">
                    <Button onClick={togglePlayPause} variant="outline">
                      {isPlaying ? "Pause" : "Play"}
                    </Button>
                    <Button onClick={() => setShowTranscript(!showTranscript)} variant="outline">
                      {showTranscript ? "Hide Transcript" : "Show Transcript"}
                    </Button>
                  </div>
                  
                  {showTranscript && (
                    <div className="bg-muted p-4 rounded-md mb-6">
                      <p className="italic text-muted-foreground">
                        {SAMPLE_AUDIOS.find(a => a.id === selectedAudio)?.transcript}
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-6">
                    {SAMPLE_QUESTIONS[selectedAudio]?.map((question) => (
                      <div key={question.id} className="space-y-2">
                        <h3 className="font-medium">{question.text}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {question.options.map((option) => (
                            <Button 
                              key={option} 
                              variant={userAnswers[question.id] === option 
                                ? (hasSubmitted 
                                  ? (option === question.correctAnswer ? "default" : "destructive")
                                  : "default") 
                                : (hasSubmitted && option === question.correctAnswer
                                  ? "outline"
                                  : "outline")}
                              className={hasSubmitted && option === question.correctAnswer ? "border-green-500" : ""}
                              onClick={() => handleAnswerSelect(question.id, option)}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                        {hasSubmitted && userAnswers[question.id] !== question.correctAnswer && (
                          <p className="text-sm text-red-500">
                            Correct answer: {question.correctAnswer}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-2">
                    <Button onClick={resetExercise} variant="outline">
                      Reset
                    </Button>
                    <Button onClick={handleSubmit} disabled={hasSubmitted}>
                      Submit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="library" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SAMPLE_AUDIOS.map((audio) => (
              <Card 
                key={audio.id} 
                className={`cursor-pointer hover:shadow-md transition-shadow ${selectedAudio === audio.id ? 'border-primary' : ''}`}
                onClick={() => handleAudioSelect(audio.id)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{audio.title}</CardTitle>
                  <CardDescription>
                    Level: {audio.level} | Duration: {audio.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {audio.transcript.substring(0, 80)}...
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAudioSelect(audio.id);
                      setTimeout(() => {
                        document.querySelector('[value="exercises"]')?.dispatchEvent(new Event('click'));
                      }, 100);
                    }}
                  >
                    Start Exercise
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ListeningModule;
