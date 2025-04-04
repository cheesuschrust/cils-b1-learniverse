
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getRandomQuestion } from '@/services/questionService';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function ItalianCitizenshipTest() {
  const [question, setQuestion] = useState(() => getRandomQuestion());
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    
    setSelectedAnswer(answer);
    const correct = answer === question.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 1);
    }
    
    setQuestionsAnswered(prev => prev + 1);
    setProgress(prev => prev + 20); // Assuming 5 questions total
  };

  const handleNextQuestion = () => {
    setQuestion(getRandomQuestion());
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const resetQuiz = () => {
    setQuestion(getRandomQuestion());
    setSelectedAnswer(null);
    setIsCorrect(null);
    setProgress(0);
    setQuestionsAnswered(0);
    setScore(0);
  };
  
  return (
    <>
      <Helmet>
        <title>Test di Cittadinanza Italiana | ItalianMaster</title>
      </Helmet>
      
      <div className="container max-w-3xl py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Test di Cittadinanza</h1>
              <p className="text-muted-foreground">
                Preparati per l'esame ufficiale con queste domande di pratica
              </p>
            </div>
            
            <Badge variant="outline" className="mt-2 sm:mt-0 self-start sm:self-auto">
              Livello B1 Richiesto
            </Badge>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <div className="flex justify-between text-sm mt-2">
            <span>Domanda {questionsAnswered} di 5</span>
            <span>Punteggio: {score}/{questionsAnswered}</span>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">Domanda</CardTitle>
                <CardDescription>Categoria: {question.category}</CardDescription>
              </div>
              <Badge variant={question.difficulty === 'Facile' ? 'success' : 'secondary'}>
                {question.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-6">{question.text}</p>
            
            <div className="space-y-3">
              {question.options.map((option) => (
                <Button
                  key={option}
                  variant={
                    selectedAnswer === option
                      ? option === question.correctAnswer
                        ? "success"
                        : "destructive"
                      : selectedAnswer && option === question.correctAnswer
                      ? "success"
                      : "outline"
                  }
                  className="w-full justify-start h-auto py-4 px-6 text-left"
                  onClick={() => handleAnswerSelect(option)}
                  disabled={selectedAnswer !== null}
                >
                  {option}
                </Button>
              ))}
            </div>
          </CardContent>
          
          {selectedAnswer && (
            <CardFooter className="flex flex-col items-start pt-0">
              <div className={`p-4 rounded-md w-full mb-4 ${
                isCorrect ? 'bg-green-50 text-green-800 border border-green-200' : 
                'bg-red-50 text-red-800 border border-red-200'
              }`}>
                <div className="flex items-start">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">
                      {isCorrect ? 'Corretto!' : 'Non corretto'}
                    </p>
                    {!isCorrect && (
                      <p className="text-sm mt-1">
                        La risposta corretta è: <span className="font-medium">{question.correctAnswer}</span>
                      </p>
                    )}
                    {question.explanation && (
                      <p className="text-sm mt-2">{question.explanation}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <Button onClick={handleNextQuestion} className="w-full">
                Prossima Domanda
              </Button>
            </CardFooter>
          )}
        </Card>
        
        <div className="flex justify-center">
          <Button variant="outline" onClick={resetQuiz} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Ricomincia Quiz
          </Button>
        </div>
      </div>
    </>
  );
}
