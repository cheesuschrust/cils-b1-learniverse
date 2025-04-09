
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, AlertCircle, ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';

// Mock data for a reading exercise
const mockExercise = {
  id: '4',
  title: 'Italian Newspaper Article',
  description: 'Read the following newspaper article and answer the questions below.',
  text: `
    <h3>LA CRESCITA DEL TURISMO SOSTENIBILE IN ITALIA</h3>
    
    <p>Il turismo sostenibile sta diventando sempre più popolare in Italia. Secondo un recente studio, oltre il 65% dei viaggiatori italiani considera l'impatto ambientale quando pianifica le vacanze.</p>
    
    <p>Negli ultimi anni, molte regioni italiane hanno sviluppato programmi per promuovere forme di turismo che rispettano l'ambiente e le comunità locali. La Toscana, per esempio, ha lanciato l'iniziativa "Toscana Green" che certifica le strutture ricettive che adottano pratiche ecologiche.</p>
    
    <p>Il Ministero del Turismo ha anche annunciato nuovi investimenti per migliorare la sostenibilità del settore turistico italiano. Questi fondi saranno utilizzati per sviluppare infrastrutture più efficienti dal punto di vista energetico e promuovere il trasporto pubblico nelle zone turistiche.</p>
    
    <p>Anche i turisti stranieri apprezzano questa nuova direzione. Un sondaggio recente ha rivelato che il 58% dei visitatori internazionali sarebbe disposto a pagare di più per un'esperienza di viaggio più sostenibile in Italia.</p>
    
    <p>Le piccole comunità rurali stanno beneficiando di questa tendenza, con un aumento del turismo in aree meno conosciute ma ricche di tradizioni culturali e bellezze naturali. Questo aiuta a ridurre il sovraffollamento nelle principali destinazioni turistiche come Roma, Firenze e Venezia.</p>
  `,
  questions: [
    {
      id: 1,
      question: 'Quale percentuale dei viaggiatori italiani considera l\'impatto ambientale quando pianifica le vacanze?',
      options: [
        { id: 'a', text: '45%' },
        { id: 'b', text: '65%' },
        { id: 'c', text: '75%' },
        { id: 'd', text: '85%' }
      ],
      correctAnswer: 'b',
      explanation: 'Secondo il testo, oltre il 65% dei viaggiatori italiani considera l\'impatto ambientale quando pianifica le vacanze.'
    },
    {
      id: 2,
      question: 'Quale regione italiana ha lanciato l\'iniziativa "Toscana Green"?',
      options: [
        { id: 'a', text: 'Lombardia' },
        { id: 'b', text: 'Sicilia' },
        { id: 'c', text: 'Toscana' },
        { id: 'd', text: 'Veneto' }
      ],
      correctAnswer: 'c',
      explanation: 'Il testo menziona che la Toscana ha lanciato l\'iniziativa "Toscana Green" che certifica le strutture ricettive che adottano pratiche ecologiche.'
    },
    {
      id: 3,
      question: 'A cosa saranno destinati i nuovi investimenti del Ministero del Turismo?',
      options: [
        { id: 'a', text: 'Costruzione di nuovi hotel' },
        { id: 'b', text: 'Pubblicità internazionale' },
        { id: 'c', text: 'Infrastrutture energeticamente efficienti e trasporto pubblico' },
        { id: 'd', text: 'Formazione di nuove guide turistiche' }
      ],
      correctAnswer: 'c',
      explanation: 'Secondo il testo, i fondi saranno utilizzati per sviluppare infrastrutture più efficienti dal punto di vista energetico e promuovere il trasporto pubblico nelle zone turistiche.'
    },
    {
      id: 4,
      question: 'Quale percentuale di visitatori internazionali sarebbe disposta a pagare di più per un\'esperienza di viaggio sostenibile in Italia?',
      options: [
        { id: 'a', text: '38%' },
        { id: 'b', text: '48%' },
        { id: 'c', text: '58%' },
        { id: 'd', text: '68%' }
      ],
      correctAnswer: 'c',
      explanation: 'Il testo indica che il 58% dei visitatori internazionali sarebbe disposto a pagare di più per un\'esperienza di viaggio più sostenibile in Italia.'
    },
    {
      id: 5,
      question: 'Qual è uno dei benefici del turismo sostenibile menzionato nell\'articolo?',
      options: [
        { id: 'a', text: 'Aumento dei prezzi degli hotel' },
        { id: 'b', text: 'Riduzione del sovraffollamento nelle principali destinazioni turistiche' },
        { id: 'c', text: 'Costruzione di nuovi aeroporti' },
        { id: 'd', text: 'Promozione di ristoranti internazionali' }
      ],
      correctAnswer: 'b',
      explanation: 'Il testo menziona che il turismo sostenibile aiuta a ridurre il sovraffollamento nelle principali destinazioni turistiche come Roma, Firenze e Venezia, portando i turisti verso aree meno conosciute.'
    }
  ]
};

const ReadingExercise = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [showHint, setShowHint] = useState<number | null>(null);
  
  // In a real app, we'd fetch the exercise data based on the exerciseId
  const exercise = mockExercise;
  
  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const calculateScore = () => {
    let correctCount = 0;
    exercise.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });
    return {
      score: correctCount,
      total: exercise.questions.length,
      percentage: Math.round((correctCount / exercise.questions.length) * 100)
    };
  };
  
  const handleSubmit = () => {
    setShowResults(true);
  };
  
  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
    setShowHint(null);
  };
  
  const handleNext = () => {
    // In a real app, navigate to the next exercise
    navigate('/reading');
  };
  
  const toggleHint = (questionId: number) => {
    setShowHint(showHint === questionId ? null : questionId);
  };
  
  const scoreInfo = calculateScore();
  const allQuestionsAnswered = exercise.questions.every(q => answers[q.id]);
  
  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" className="mb-4" onClick={() => navigate('/reading')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Reading Exercises
      </Button>
      
      <h1 className="text-3xl font-bold mb-2">{exercise.title}</h1>
      <p className="text-muted-foreground mb-6">{exercise.description}</p>
      
      <Tabs defaultValue="reading">
        <TabsList>
          <TabsTrigger value="reading">Reading Text</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          {showResults && <TabsTrigger value="results">Results</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="reading" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Reading Passage</CardTitle>
              <CardDescription>Read the text carefully before answering the questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm sm:prose max-w-none" dangerouslySetInnerHTML={{ __html: exercise.text }} />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                {exercise.questions.length} questions to answer
              </div>
              <Button onClick={() => document.querySelector('[data-value="questions"]')?.click()}>
                Go to Questions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="questions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Questions</CardTitle>
              <CardDescription>Choose the best answer for each question based on the reading passage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {exercise.questions.map((question) => (
                <div key={question.id} className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">
                      {question.id}. {question.question}
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => toggleHint(question.id)}
                      className="flex-shrink-0"
                    >
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {showHint === question.id && (
                    <Alert variant="warning" className="bg-muted">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Hint</AlertTitle>
                      <AlertDescription>
                        Look for information about percentages and numbers in the text to find your answer.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <RadioGroup 
                    value={answers[question.id]} 
                    onValueChange={(value) => handleAnswerChange(question.id, value)}
                    className="space-y-2"
                  >
                    {question.options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value={option.id} 
                          id={`q${question.id}-${option.id}`}
                          disabled={showResults}
                        />
                        <Label 
                          htmlFor={`q${question.id}-${option.id}`}
                          className={
                            showResults
                              ? option.id === question.correctAnswer
                                ? "text-green-600 font-medium"
                                : answers[question.id] === option.id
                                ? "text-red-600 line-through"
                                : ""
                              : ""
                          }
                        >
                          {option.text}
                          {showResults && option.id === question.correctAnswer && (
                            <CheckCircle2 className="inline-block ml-2 h-4 w-4 text-green-600" />
                          )}
                          {showResults && answers[question.id] === option.id && option.id !== question.correctAnswer && (
                            <XCircle className="inline-block ml-2 h-4 w-4 text-red-600" />
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  
                  {showResults && (
                    <div className="text-sm mt-2 p-2 bg-muted rounded-md">
                      <span className="font-medium">Explanation: </span>
                      {question.explanation}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => document.querySelector('[data-value="reading"]')?.click()}>
                Back to Text
              </Button>
              
              {showResults ? (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleReset}>
                    Try Again
                  </Button>
                  <Button onClick={handleNext}>
                    Next Exercise
                  </Button>
                </div>
              ) : (
                <Button onClick={handleSubmit} disabled={!allQuestionsAnswered}>
                  Submit Answers
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        {showResults && (
          <TabsContent value="results" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Results</CardTitle>
                <CardDescription>
                  You scored {scoreInfo.score} out of {scoreInfo.total} ({scoreInfo.percentage}%)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Score: {scoreInfo.percentage}%</span>
                    <span className={scoreInfo.percentage >= 70 ? "text-green-600" : "text-red-600"}>
                      {scoreInfo.percentage >= 70 ? "Passed" : "Try again"}
                    </span>
                  </div>
                  <Progress value={scoreInfo.percentage} className={scoreInfo.percentage >= 70 ? "bg-green-100" : "bg-red-100"} />
                </div>
                
                {scoreInfo.percentage >= 70 ? (
                  <Alert className="bg-green-50 border-green-100">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Great job!</AlertTitle>
                    <AlertDescription className="text-green-700">
                      You've demonstrated a good understanding of the text. Continue to the next exercise to keep improving your reading skills.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="bg-amber-50 border-amber-100">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">Keep practicing!</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      Try reading the passage again and pay closer attention to the details. You can also use the explanations to understand where you made mistakes.
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleReset}>
                    Try Again
                  </Button>
                  <Button onClick={handleNext}>
                    Next Exercise
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ReadingExercise;
