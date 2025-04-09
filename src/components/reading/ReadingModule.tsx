
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const SAMPLE_TEXTS = [
  {
    id: 1,
    title: "La vita in città",
    level: "B1",
    content: `Vivere in una grande città italiana offre molti vantaggi. Innanzitutto, ci sono numerosi mezzi di trasporto pubblico: autobus, tram e metropolitana rendono facile spostarsi senza automobile. Inoltre, le città italiane sono ricche di storia e cultura, con musei, monumenti e eventi culturali disponibili tutto l'anno.

Naturalmente, la vita urbana presenta anche alcuni svantaggi. Il costo della vita è generalmente più alto, specialmente per quanto riguarda gli affitti. Il traffico può essere intenso nelle ore di punta e l'inquinamento è un problema in molte grandi città.

Nonostante questi aspetti negativi, molti italiani preferiscono vivere in città per le opportunità lavorative e la vita sociale più vivace. I giovani, in particolare, sono attratti dalla varietà di attività e dalla possibilità di incontrare persone con interessi simili.`
  },
  {
    id: 2,
    title: "Le tradizioni gastronomiche italiane",
    level: "B1",
    content: `La cucina italiana è famosa in tutto il mondo per la sua varietà e qualità. Ogni regione d'Italia ha le proprie specialità e tradizioni culinarie uniche.

Al nord, in Lombardia e Piemonte, sono popolari piatti ricchi come il risotto e la polenta. In Emilia-Romagna troviamo la pasta fresca, come le tagliatelle e i tortellini, spesso servita con ragù.

Nel centro Italia, la Toscana è conosciuta per piatti semplici ma saporiti, come la ribollita e la bistecca alla fiorentina. A Roma sono famosi i piatti come la carbonara e l'amatriciana.

Al sud, la Campania ha dato al mondo la pizza e la mozzarella di bufala. In Sicilia, i dolci come il cannolo e la cassata sono irresistibili.

Queste diverse tradizioni riflettono la storia e la geografia di ogni regione, creando una ricchezza gastronomica unica nel suo genere.`
  },
  {
    id: 3,
    title: "Il sistema scolastico italiano",
    level: "B1",
    content: `Il sistema scolastico italiano è organizzato in diversi livelli. I bambini iniziano con la scuola dell'infanzia (asilo) dai 3 ai 6 anni, che non è obbligatoria ma frequentata dalla maggior parte dei bambini.

L'istruzione obbligatoria inizia con la scuola primaria (elementare) a 6 anni e dura cinque anni. Segue la scuola secondaria di primo grado (media), che dura tre anni.

Dopo le medie, gli studenti scelgono tra diversi tipi di scuola secondaria di secondo grado: licei (classico, scientifico, linguistico, artistico), istituti tecnici o professionali. Questi percorsi durano cinque anni e terminano con l'esame di maturità.

L'anno scolastico inizia a settembre e finisce a giugno, con pause per le vacanze di Natale, Pasqua e altre festività nazionali. Le lezioni si svolgono generalmente dal lunedì al sabato mattina.

Dopo la maturità, gli studenti possono accedere all'università, che offre corsi di laurea (3 anni), laurea magistrale (2 anni aggiuntivi) e dottorati di ricerca.`
  }
];

type Question = {
  id: number;
  text: string;
  options?: string[];
  correctAnswer: string;
  type: 'multiple' | 'text';
};

const SAMPLE_QUESTIONS: Record<number, Question[]> = {
  1: [
    {
      id: 1,
      text: "Quali mezzi di trasporto sono menzionati nel testo?",
      options: ["Treno, taxi e metropolitana", "Autobus, tram e metropolitana", "Autobus, bicicletta e taxi", "Tram, taxi e treno"],
      correctAnswer: "Autobus, tram e metropolitana",
      type: 'multiple'
    },
    {
      id: 2,
      text: "Qual è uno svantaggio della vita in città menzionato nel testo?",
      options: ["La mancanza di eventi culturali", "Il costo della vita più alto", "La scarsità di mezzi di trasporto", "La mancanza di opportunità lavorative"],
      correctAnswer: "Il costo della vita più alto",
      type: 'multiple'
    },
    {
      id: 3,
      text: "Secondo il testo, perché i giovani sono attratti dalla vita in città?",
      type: 'text',
      correctAnswer: "Per le opportunità lavorative e la vita sociale più vivace"
    }
  ],
  2: [
    {
      id: 1,
      text: "Quali piatti sono tipici del nord Italia secondo il testo?",
      options: ["Pizza e pasta", "Risotto e polenta", "Carbonara e amatriciana", "Cannolo e cassata"],
      correctAnswer: "Risotto e polenta",
      type: 'multiple'
    },
    {
      id: 2,
      text: "Da quale regione proviene la pizza secondo il testo?",
      options: ["Toscana", "Sicilia", "Campania", "Emilia-Romagna"],
      correctAnswer: "Campania",
      type: 'multiple'
    },
    {
      id: 3,
      text: "Completa la frase: 'Queste diverse tradizioni riflettono la _____ e la _____ di ogni regione.'",
      type: 'text',
      correctAnswer: "storia e la geografia"
    }
  ],
  3: [
    {
      id: 1,
      text: "Qual è l'età in cui i bambini iniziano la scuola primaria in Italia?",
      options: ["3 anni", "5 anni", "6 anni", "7 anni"],
      correctAnswer: "6 anni",
      type: 'multiple'
    },
    {
      id: 2,
      text: "Qual è la durata della scuola secondaria di primo grado (media)?",
      options: ["3 anni", "5 anni", "8 anni", "13 anni"],
      correctAnswer: "3 anni",
      type: 'multiple'
    },
    {
      id: 3,
      text: "Quando finisce l'anno scolastico in Italia?",
      type: 'text',
      correctAnswer: "giugno"
    }
  ]
};

const ReadingModule: React.FC = () => {
  const [selectedText, setSelectedText] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const handleTextSelect = (textId: number) => {
    setSelectedText(textId);
    setUserAnswers({});
    setHasSubmitted(false);
  };

  const handleAnswerSelect = (questionId: number, answer: string) => {
    if (hasSubmitted) return;
    
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    if (!selectedText) return;
    
    const questions = SAMPLE_QUESTIONS[selectedText];
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
    const correctAnswers = questions.filter(q => {
      const userAnswer = userAnswers[q.id]?.trim().toLowerCase();
      const correctAnswer = q.correctAnswer.toLowerCase();
      
      // For text inputs, check if answer contains key words
      if (q.type === 'text') {
        return correctAnswer.split(' ').some(word => 
          word.length > 3 && userAnswer.includes(word.toLowerCase())
        );
      }
      
      return userAnswer === correctAnswer;
    });
    
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
  };

  const filteredTexts = SAMPLE_TEXTS.filter(text => 
    searchQuery === '' || 
    text.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    text.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="exercises" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
          <TabsTrigger value="library">Reading Library</TabsTrigger>
        </TabsList>
        
        <TabsContent value="exercises" className="space-y-4 mt-4">
          {!selectedText ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Select a text from the Library tab to start a reading exercise.</p>
              <Button onClick={() => document.querySelector('[value="library"]')?.dispatchEvent(new Event('click'))}>
                Browse Reading Library
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{SAMPLE_TEXTS.find(t => t.id === selectedText)?.title}</CardTitle>
                  <CardDescription>
                    Level: {SAMPLE_TEXTS.find(t => t.id === selectedText)?.level}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none mb-8">
                    {SAMPLE_TEXTS.find(t => t.id === selectedText)?.content.split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Comprehension Questions</CardTitle>
                  <CardDescription>
                    Read the text carefully and answer the following questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {SAMPLE_QUESTIONS[selectedText]?.map((question) => (
                      <div key={question.id} className="space-y-2">
                        <h3 className="font-medium">{question.text}</h3>
                        
                        {question.type === 'multiple' && question.options && (
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
                        )}
                        
                        {question.type === 'text' && (
                          <div>
                            <Input
                              value={userAnswers[question.id] || ''}
                              onChange={(e) => handleAnswerSelect(question.id, e.target.value)}
                              disabled={hasSubmitted}
                              placeholder="Your answer..."
                              className={hasSubmitted ? (
                                userAnswers[question.id]?.toLowerCase().includes(question.correctAnswer.toLowerCase()) 
                                  ? "border-green-500" 
                                  : "border-red-500"
                              ) : ""}
                            />
                            {hasSubmitted && !userAnswers[question.id]?.toLowerCase().includes(question.correctAnswer.toLowerCase()) && (
                              <p className="text-sm text-red-500 mt-1">
                                Suggested answer includes: {question.correctAnswer}
                              </p>
                            )}
                          </div>
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
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="library" className="mt-4">
          <div className="mb-4">
            <Input
              placeholder="Search texts by title or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTexts.map((text) => (
              <Card 
                key={text.id} 
                className={`cursor-pointer hover:shadow-md transition-shadow ${selectedText === text.id ? 'border-primary' : ''}`}
                onClick={() => handleTextSelect(text.id)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{text.title}</CardTitle>
                  <CardDescription>
                    Level: {text.level}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {text.content.substring(0, 150)}...
                  </p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTextSelect(text.id);
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

export default ReadingModule;
