
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, HelpCircle, Book, Award } from 'lucide-react';

export default function ItalianCitizenshipTest() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  
  const totalQuestions = 5;
  
  const questions = [
    {
      question: "L'Italia è una Repubblica democratica, fondata sul...",
      options: ["Capitale", "Lavoro", "Governo", "Parlamento"],
      correct: "Lavoro"
    },
    {
      question: "Qual è la capitale d'Italia?",
      options: ["Milano", "Roma", "Firenze", "Venezia"],
      correct: "Roma"
    },
    {
      question: "Quante regioni ha l'Italia?",
      options: ["15", "18", "20", "25"],
      correct: "20"
    },
    {
      question: "Chi è l'attuale Presidente della Repubblica Italiana?",
      options: ["Mario Draghi", "Giorgia Meloni", "Sergio Mattarella", "Giuseppe Conte"],
      correct: "Sergio Mattarella"
    },
    {
      question: "Di che colore è la bandiera italiana?",
      options: ["Rosso, Bianco e Verde", "Verde, Bianco e Rosso", "Blu, Bianco e Rosso", "Verde, Giallo e Rosso"],
      correct: "Verde, Bianco e Rosso"
    }
  ];
  
  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[step] = answer;
    setAnswers(newAnswers);
    
    if (answer === questions[step].correct) {
      setScore(prev => prev + 1);
    }
    
    if (step < totalQuestions - 1) {
      setStep(prev => prev + 1);
    }
  };
  
  const resetQuiz = () => {
    setStep(0);
    setScore(0);
    setAnswers([]);
  };
  
  const renderQuestion = () => {
    const question = questions[step];
    
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-medium">{question.question}</h3>
        
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option) => (
            <Button
              key={option}
              variant="outline"
              className="justify-start h-auto py-3 px-4 text-left"
              onClick={() => handleAnswer(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
    );
  };
  
  const renderResults = () => {
    const percentage = (score / totalQuestions) * 100;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          {percentage >= 60 ? (
            <div className="inline-flex flex-col items-center">
              <Award className="h-12 w-12 text-green-500 mb-2" />
              <h3 className="text-2xl font-bold text-green-600">Congratulazioni!</h3>
              <p className="text-muted-foreground">Hai superato il test!</p>
            </div>
          ) : (
            <div className="inline-flex flex-col items-center">
              <HelpCircle className="h-12 w-12 text-amber-500 mb-2" />
              <h3 className="text-2xl font-bold text-amber-600">Riprova!</h3>
              <p className="text-muted-foreground">Continua a studiare!</p>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Punteggio:</span>
            <Badge variant={percentage >= 60 ? "default" : "destructive"}>{score} di {totalQuestions} ({percentage}%)</Badge>
          </div>
          
          <Progress value={percentage} className="h-2" />
        </div>
        
        <div className="space-y-4 mt-6">
          <h4 className="text-lg font-medium">Risposte:</h4>
          
          <div className="space-y-3">
            {questions.map((q, i) => (
              <div key={i} className="flex items-start space-x-2 border rounded-md p-3">
                <div className="flex-shrink-0 mt-0.5">
                  {answers[i] === q.correct ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                
                <div className="flex-1">
                  <p className="font-medium">{q.question}</p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">La tua risposta: </span>
                    <span className={answers[i] === q.correct ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                      {answers[i] || "Non risposto"}
                    </span>
                  </p>
                  
                  {answers[i] !== q.correct && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Risposta corretta: </span>
                      <span className="text-green-600 font-medium">{q.correct}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <Button className="w-full" onClick={resetQuiz}>
          Prova di nuovo
        </Button>
      </div>
    );
  };
  
  return (
    <>
      <Helmet>
        <title>Test di Cittadinanza Italiana | ItalianMaster</title>
      </Helmet>
      
      <div className="container max-w-3xl py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Test di Cittadinanza Italiana</h1>
          <p className="text-muted-foreground">
            Testa le tue conoscenze sulla cittadinanza italiana
          </p>
        </div>
        
        <Card>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">
                {step < totalQuestions ? "Domanda " + (step + 1) + " di " + totalQuestions : "Risultati"}
              </CardTitle>
              
              <Badge variant="outline" className="flex items-center gap-1">
                <Book className="h-3 w-3" /> CILS B1
              </Badge>
            </div>
            <CardDescription>
              {step < totalQuestions ? 
                "Scegli la risposta corretta per continuare" : 
                "Ecco il tuo punteggio e le risposte corrette"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {step < totalQuestions ? renderQuestion() : renderResults()}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
