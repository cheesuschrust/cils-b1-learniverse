
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, CornerDownRight, Check, X } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface ReadingExercise {
  id: string;
  title: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  questions: Question[];
  vocabulary?: {
    word: string;
    definition: string;
    example?: string;
  }[];
}

// Sample data - in a real app, this would come from Supabase
const sampleExercise: ReadingExercise = {
  id: "1",
  title: "La Vita in Italia",
  content: `L'Italia è un paese con una ricca storia e cultura. Situata nel cuore del Mediterraneo, l'Italia ha influenzato profondamente la civiltà occidentale. La sua capitale, Roma, è stata il centro dell'Impero Romano, uno dei più grandi imperi del mondo antico.

Gli italiani sono noti per il loro amore per il buon cibo, l'arte, la famiglia e la socialità. La cucina italiana è famosa in tutto il mondo, con piatti come la pasta, la pizza e il gelato che sono diventati popolari a livello internazionale.

L'Italia è anche conosciuta per i suoi numerosi siti storici e artistici. Il Colosseo a Roma, la Torre di Pisa e il Duomo di Milano sono solo alcuni dei monumenti più famosi. Inoltre, l'Italia è la patria di artisti leggendari come Leonardo da Vinci, Michelangelo e Raffaello.

Oggi, l'Italia è una repubblica democratica e membro dell'Unione Europea. Nonostante le sfide economiche, il paese mantiene un alto standard di vita e continua ad essere una meta turistica molto popolare.`,
  difficulty: "intermediate",
  category: "Culture",
  questions: [
    {
      id: "q1",
      text: "Qual è la capitale dell'Italia?",
      options: ["Milano", "Firenze", "Roma", "Venezia"],
      correctAnswer: "Roma"
    },
    {
      id: "q2",
      text: "Per cosa sono conosciuti gli italiani secondo il testo?",
      options: [
        "Solo per la loro cucina",
        "Per il loro amore per il buon cibo, l'arte, la famiglia e la socialità",
        "Per la loro influenza politica nel Mediterraneo",
        "Per i loro monumenti"
      ],
      correctAnswer: "Per il loro amore per il buon cibo, l'arte, la famiglia e la socialità"
    },
    {
      id: "q3",
      text: "Quale dei seguenti NON è menzionato come un famoso artista italiano?",
      options: ["Leonardo da Vinci", "Michelangelo", "Raffaello", "Donatello"],
      correctAnswer: "Donatello"
    },
    {
      id: "q4",
      text: "Cosa è l'Italia oggi secondo il testo?",
      options: [
        "Una monarchia costituzionale",
        "Un impero",
        "Una repubblica democratica e membro dell'UE",
        "Un paese sottosviluppato"
      ],
      correctAnswer: "Una repubblica democratica e membro dell'UE"
    }
  ],
  vocabulary: [
    {
      word: "ricca",
      definition: "wealthy, rich",
      example: "Una famiglia ricca = A wealthy family"
    },
    {
      word: "situata",
      definition: "located, situated",
      example: "La casa è situata vicino al mare = The house is located near the sea"
    },
    {
      word: "influenzato",
      definition: "influenced",
      example: "Il suo stile è influenzato dall'arte classica = His style is influenced by classical art"
    },
    {
      word: "sfide",
      definition: "challenges",
      example: "Affronta molte sfide nel suo lavoro = He faces many challenges in his job"
    }
  ]
};

const ReadingModule: React.FC = () => {
  const [currentExercise, setCurrentExercise] = useState<ReadingExercise>(sampleExercise);
  const [showQuestions, setShowQuestions] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);
  
  const { toast } = useToast();

  const handleStartQuiz = () => {
    setShowQuestions(true);
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    if (isSubmitted) return;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    if (isSubmitted) return;
    
    let correctCount = 0;
    currentExercise.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    const newScore = Math.round((correctCount / currentExercise.questions.length) * 100);
    setScore(newScore);
    setIsSubmitted(true);
    
    toast({
      title: "Reading Comprehension Completed!",
      description: `Your score: ${newScore}%`,
      variant: newScore >= 70 ? "default" : "destructive"
    });
  };

  const handleWordClick = (word: string) => {
    // Strip punctuation from the clicked word
    const cleanWord = word.replace(/[.,;!?()"']/g, '').toLowerCase();
    
    // Find the vocabulary item for this word if it exists
    const vocabularyItem = currentExercise.vocabulary?.find(
      item => item.word.toLowerCase() === cleanWord
    );
    
    if (vocabularyItem) {
      setHighlightedWord(vocabularyItem.word);
    } else {
      setHighlightedWord(null);
    }
  };

  const handleNext = () => {
    // In a real app, this would load the next exercise
    toast({
      title: "Coming Soon",
      description: "More reading exercises will be available soon!",
    });
  };

  // Process the text to make words clickable
  const processText = () => {
    const paragraphs = currentExercise.content.split('\n\n');
    
    return paragraphs.map((paragraph, pIndex) => {
      const words = paragraph.split(' ');
      
      const processedWords = words.map((word, wIndex) => {
        // Check if this word (without punctuation) is in our vocabulary list
        const cleanWord = word.replace(/[.,;!?()"']/g, '').toLowerCase();
        const isVocabWord = currentExercise.vocabulary?.some(
          item => item.word.toLowerCase() === cleanWord
        );
        
        return (
          <span 
            key={`${pIndex}-${wIndex}`}
            className={`${isVocabWord ? 'cursor-pointer hover:text-primary underline decoration-dotted underline-offset-4' : ''}`}
            onClick={() => isVocabWord && handleWordClick(cleanWord)}
          >
            {word}{' '}
          </span>
        );
      });
      
      return (
        <p key={pIndex} className="mb-4">
          {processedWords}
        </p>
      );
    });
  };

  const VocabularyDefinition = () => {
    if (!highlightedWord) return null;
    
    const vocab = currentExercise.vocabulary?.find(
      item => item.word.toLowerCase() === highlightedWord.toLowerCase()
    );
    
    if (!vocab) return null;
    
    return (
      <div className="bg-primary/10 p-4 rounded-md border border-primary/20 mt-4">
        <div className="flex items-start space-x-2">
          <CornerDownRight className="h-5 w-5 text-primary mt-1" />
          <div>
            <h4 className="font-medium text-primary">{vocab.word}</h4>
            <p className="text-sm">{vocab.definition}</p>
            {vocab.example && (
              <p className="text-xs text-muted-foreground mt-1 italic">{vocab.example}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{currentExercise.title}</CardTitle>
              <CardDescription>
                {currentExercise.category} - {currentExercise.difficulty.charAt(0).toUpperCase() + currentExercise.difficulty.slice(1)} Level
              </CardDescription>
            </div>
            <Badge variant="outline" className="capitalize">
              {currentExercise.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!showQuestions ? (
            <div className="space-y-4">
              <div className="bg-muted p-6 rounded-md">
                <div className="prose prose-sm max-w-none">
                  {processText()}
                </div>
                
                {VocabularyDefinition()}
                
                <div className="flex justify-center mt-6">
                  <Button onClick={handleStartQuiz} className="mt-4">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Start Comprehension Questions
                  </Button>
                </div>
              </div>
              
              {currentExercise.vocabulary && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Vocabulary Help</h3>
                  <p className="text-sm text-muted-foreground">
                    Click on the underlined words in the text to see their definitions.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Comprehension Questions</h3>
              
              {currentExercise.questions.map((question, index) => (
                <div key={question.id} className="space-y-3">
                  <h4 className="font-medium">
                    {index + 1}. {question.text}
                  </h4>
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <div 
                        key={option}
                        className={`p-3 rounded-md border cursor-pointer transition-colors ${
                          selectedAnswers[question.id] === option 
                            ? 'bg-primary/10 border-primary' 
                            : 'hover:bg-muted'
                        } ${
                          isSubmitted && option === question.correctAnswer
                            ? 'bg-green-100 border-green-500'
                            : isSubmitted && selectedAnswers[question.id] === option && option !== question.correctAnswer
                              ? 'bg-red-100 border-red-500'
                              : ''
                        }`}
                        onClick={() => handleAnswerSelect(question.id, option)}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {isSubmitted && option === question.correctAnswer && (
                            <Check className="h-5 w-5 text-green-600" />
                          )}
                          {isSubmitted && selectedAnswers[question.id] === option && option !== question.correctAnswer && (
                            <X className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowQuestions(false)}
                >
                  Back to Reading
                </Button>
                
                {!isSubmitted ? (
                  <Button 
                    variant="default" 
                    onClick={handleSubmit}
                    disabled={Object.keys(selectedAnswers).length !== currentExercise.questions.length}
                  >
                    Submit Answers
                  </Button>
                ) : (
                  <Button variant="default" onClick={handleNext}>
                    Next Exercise
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
        {isSubmitted && (
          <CardFooter className="border-t pt-4">
            <div className="w-full space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Your Score:</span>
                <span className={`font-bold ${score >= 70 ? 'text-green-600' : 'text-red-600'}`}>{score}%</span>
              </div>
              <Progress value={score} className="h-2" />
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ReadingModule;
