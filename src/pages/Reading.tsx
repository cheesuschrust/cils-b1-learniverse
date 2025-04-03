
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';

interface ReadingPassage {
  id: string;
  title: string;
  content: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  questions: ReadingQuestion[];
}

interface ReadingQuestion {
  id: string;
  text: string;
  options: string[];
  correct: number;
  explanation?: string;
}

const examplePassages: ReadingPassage[] = [
  {
    id: "1",
    title: "La Vita in Italia",
    content: `L'Italia è conosciuta per il suo ricco patrimonio culturale, il cibo delizioso e i magnifici paesaggi. Molte persone sognano di visitare città famose come Roma, Firenze e Venezia.
    
La vita quotidiana in Italia è caratterizzata da un ritmo rilassato, specialmente nelle piccole città e nei villaggi. Gli italiani valorizzano il tempo trascorso con la famiglia e gli amici, spesso riunendosi per lunghi pranzi o cene.

Il cibo è una parte importante della cultura italiana. Ogni regione ha le proprie specialità culinarie. La pasta, la pizza, il gelato e il caffè sono alcuni dei cibi più famosi che l'Italia ha regalato al mondo.

L'Italia ha anche un sistema sanitario pubblico che fornisce assistenza a tutti i cittadini e ai residenti legali. L'istruzione pubblica è gratuita e obbligatoria dai 6 ai 16 anni.`,
    level: "intermediate",
    category: "culture",
    questions: [
      {
        id: "1-1",
        text: "Quali città italiane vengono menzionate nel testo?",
        options: [
          "Roma, Milano e Napoli",
          "Roma, Firenze e Venezia",
          "Firenze, Venezia e Torino",
          "Roma, Venezia e Palermo"
        ],
        correct: 1,
        explanation: "Nel primo paragrafo, il testo menziona esplicitamente 'Roma, Firenze e Venezia' come città famose che le persone sognano di visitare."
      },
      {
        id: "1-2",
        text: "Secondo il testo, cosa caratterizza la vita quotidiana in Italia?",
        options: [
          "Un ritmo di vita frenetico",
          "L'isolamento sociale",
          "Un ritmo rilassato",
          "Lo stress lavorativo"
        ],
        correct: 2,
        explanation: "Il secondo paragrafo afferma che 'La vita quotidiana in Italia è caratterizzata da un ritmo rilassato, specialmente nelle piccole città e nei villaggi.'"
      },
      {
        id: "1-3",
        text: "Quale affermazione sul sistema educativo italiano è corretta?",
        options: [
          "L'istruzione è obbligatoria dai 5 ai 18 anni",
          "L'istruzione pubblica è a pagamento",
          "L'istruzione è facoltativa per tutti",
          "L'istruzione pubblica è gratuita e obbligatoria dai 6 ai 16 anni"
        ],
        correct: 3,
        explanation: "L'ultimo paragrafo afferma che 'L'istruzione pubblica è gratuita e obbligatoria dai 6 ai 16 anni.'"
      }
    ]
  },
  {
    id: "2",
    title: "La Cittadinanza Italiana",
    content: `La cittadinanza italiana può essere acquisita in diversi modi. La principale forma di acquisizione è per nascita (ius sanguinis): una persona è cittadina italiana se nasce da padre o madre italiani.

È possibile ottenere la cittadinanza italiana anche per matrimonio con un cittadino italiano. Dopo il matrimonio, il coniuge straniero può richiedere la cittadinanza italiana se risiede legalmente in Italia per almeno due anni, o dopo tre anni di matrimonio se risiede all'estero.

La naturalizzazione è un'altra via per diventare cittadino italiano. In generale, un cittadino straniero può richiedere la cittadinanza italiana dopo dieci anni di residenza legale in Italia. Questo periodo è ridotto a quattro anni per i cittadini dell'UE.

I discendenti di cittadini italiani che hanno perso la cittadinanza possono richiedere il riconoscimento della cittadinanza italiana se possono dimostrare la discendenza da un antenato italiano.`,
    level: "advanced",
    category: "citizenship",
    questions: [
      {
        id: "2-1",
        text: "Quale principio regola l'acquisizione della cittadinanza italiana per nascita?",
        options: [
          "Ius soli",
          "Ius sanguinis",
          "Ius matrimonii",
          "Ius laboris"
        ],
        correct: 1,
        explanation: "Il primo paragrafo afferma che 'La principale forma di acquisizione è per nascita (ius sanguinis)'."
      },
      {
        id: "2-2",
        text: "Dopo quanto tempo di residenza legale in Italia può un cittadino straniero richiedere la cittadinanza per naturalizzazione?",
        options: [
          "Cinque anni",
          "Otto anni",
          "Dieci anni",
          "Dodici anni"
        ],
        correct: 2,
        explanation: "Il terzo paragrafo afferma che 'un cittadino straniero può richiedere la cittadinanza italiana dopo dieci anni di residenza legale in Italia'."
      },
      {
        id: "2-3",
        text: "Quale condizione deve soddisfare il coniuge straniero di un cittadino italiano per richiedere la cittadinanza se risiede in Italia?",
        options: [
          "Risiedere legalmente in Italia per almeno un anno",
          "Risiedere legalmente in Italia per almeno due anni",
          "Risiedere legalmente in Italia per almeno tre anni",
          "Risiedere legalmente in Italia per almeno quattro anni"
        ],
        correct: 1,
        explanation: "Il secondo paragrafo afferma che 'il coniuge straniero può richiedere la cittadinanza italiana se risiede legalmente in Italia per almeno due anni'."
      }
    ]
  }
];

const ReadingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [passages, setPassages] = useState<ReadingPassage[]>(examplePassages);
  const [selectedPassage, setSelectedPassage] = useState<ReadingPassage | null>(null);
  const [activeTab, setActiveTab] = useState<string>("passages");
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  
  const handlePassageSelect = (passage: ReadingPassage) => {
    setSelectedPassage(passage);
    setActiveTab("reading");
    setUserAnswers({});
    setShowResults(false);
  };
  
  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };
  
  const handleSubmit = () => {
    setShowResults(true);
    
    // Calculate score
    if (selectedPassage) {
      const totalQuestions = selectedPassage.questions.length;
      const correctAnswers = selectedPassage.questions.filter(
        q => userAnswers[q.id] === q.correct
      ).length;
      
      toast({
        title: "Quiz Submitted",
        description: `You scored ${correctAnswers} out of ${totalQuestions} (${Math.round((correctAnswers/totalQuestions) * 100)}%)`,
      });
    }
  };
  
  const handleFilterChange = (level: string) => {
    setSelectedLevel(level);
    setSelectedPassage(null);
    setActiveTab("passages");
  };
  
  const filteredPassages = selectedLevel === "all" 
    ? passages 
    : passages.filter(p => p.level === selectedLevel);
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Italian Reading Practice</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="passages">Passages</TabsTrigger>
            {selectedPassage && (
              <TabsTrigger value="reading">Reading</TabsTrigger>
            )}
          </TabsList>
          
          {activeTab === "passages" && (
            <div className="flex gap-2">
              <Button 
                variant={selectedLevel === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("all")}
              >
                All Levels
              </Button>
              <Button 
                variant={selectedLevel === "beginner" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("beginner")}
              >
                Beginner
              </Button>
              <Button 
                variant={selectedLevel === "intermediate" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("intermediate")}
              >
                Intermediate
              </Button>
              <Button 
                variant={selectedLevel === "advanced" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("advanced")}
              >
                Advanced
              </Button>
            </div>
          )}
        </div>
        
        <TabsContent value="passages" className="space-y-4">
          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredPassages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPassages.map(passage => (
                <Card key={passage.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{passage.title}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {passage.level}
                      </span>
                    </CardTitle>
                    <CardDescription>{passage.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-3">
                      {passage.content.substring(0, 150)}...
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => handlePassageSelect(passage)}>Read & Practice</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No reading passages found for the selected level.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="reading">
          {selectedPassage && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{selectedPassage.title}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {selectedPassage.level}
                    </span>
                  </CardTitle>
                  <CardDescription>{selectedPassage.category}</CardDescription>
                </CardHeader>
                <CardContent className="prose max-w-none dark:prose-invert">
                  {selectedPassage.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Comprehension Questions</CardTitle>
                    <CardDescription>Test your understanding</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {selectedPassage.questions.map((question, qIndex) => (
                      <div key={question.id} className="space-y-2">
                        <h3 className="font-medium">
                          Question {qIndex + 1}: {question.text}
                        </h3>
                        <RadioGroup 
                          value={userAnswers[question.id]?.toString()} 
                          onValueChange={(value) => handleAnswerSelect(question.id, parseInt(value))}
                          disabled={showResults}
                        >
                          {question.options.map((option, oIndex) => (
                            <div key={oIndex} className="flex items-center space-x-2">
                              <RadioGroupItem 
                                value={oIndex.toString()} 
                                id={`q${question.id}-o${oIndex}`} 
                              />
                              <Label 
                                htmlFor={`q${question.id}-o${oIndex}`}
                                className={showResults 
                                  ? oIndex === question.correct 
                                    ? "font-medium text-green-600" 
                                    : userAnswers[question.id] === oIndex 
                                      ? "font-medium text-red-600"
                                      : ""
                                  : ""
                                }
                              >
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        
                        {showResults && question.explanation && (
                          <div className="mt-2 text-sm bg-muted p-2 rounded">
                            <strong>Explanation:</strong> {question.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleSubmit}
                      disabled={showResults || Object.keys(userAnswers).length !== selectedPassage.questions.length}
                    >
                      Submit Answers
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReadingPage;
