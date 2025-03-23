
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import SpeakableWord from "@/components/learning/SpeakableWord";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const questions: Question[] = [
  {
    id: "q1",
    question: "Qual è la capitale d'Italia?",
    options: ["Milano", "Roma", "Napoli", "Firenze"],
    correctAnswer: "Roma",
    explanation: "Roma è la capitale d'Italia dal 1871."
  },
  {
    id: "q2",
    question: "Come si dice 'goodbye' in italiano?",
    options: ["Buongiorno", "Ciao", "Arrivederci", "Grazie"],
    correctAnswer: "Arrivederci",
    explanation: "'Arrivederci' è il modo formale per dire goodbye. 'Ciao' può essere usato informalmente."
  },
  {
    id: "q3",
    question: "Quale di questi è un verbo irregolare?",
    options: ["Parlare", "Andare", "Mangiare", "Studiare"],
    correctAnswer: "Andare",
    explanation: "'Andare' è un verbo irregolare che non segue il modello di coniugazione standard."
  },
  {
    id: "q4",
    question: "Quale colore NON è presente nella bandiera italiana?",
    options: ["Verde", "Bianco", "Rosso", "Blu"],
    correctAnswer: "Blu",
    explanation: "La bandiera italiana ha tre colori: verde, bianco e rosso."
  },
  {
    id: "q5",
    question: "Come si dice '20' in italiano?",
    options: ["Dieci", "Venti", "Trenta", "Quindici"],
    correctAnswer: "Venti",
    explanation: "'Venti' è il numero 20 in italiano."
  }
];

const MultipleChoice = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const handleAnswer = () => {
    if (selectedAnswer === null) return;
    
    setIsAnswered(true);
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setProgress(((currentQuestion + 1) / questions.length) * 100);
  };
  
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };
  
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setProgress(0);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Multiple Choice</h1>
        <p className="text-muted-foreground">Test your knowledge with multiple choice questions</p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <Card className="w-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Quiz di Italiano</CardTitle>
                <CardDescription>Basic Italian language quiz</CardDescription>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  Score: {score}/{currentQuestion + (isAnswered ? 1 : 0)}
                </p>
              </div>
            </div>
            <Progress value={progress} className="h-2 mt-4" />
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-xl font-medium">
              <SpeakableWord 
                word={questions[currentQuestion].question}
                language="it"
                className="block mb-6"
              />
            </div>
            
            <RadioGroup 
              value={selectedAnswer || ""} 
              onValueChange={setSelectedAnswer}
              className="space-y-3"
              disabled={isAnswered}
            >
              {questions[currentQuestion].options.map((option) => (
                <div 
                  key={option} 
                  className={`flex items-center space-x-2 p-3 rounded-lg border ${
                    isAnswered
                      ? option === questions[currentQuestion].correctAnswer
                        ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                        : option === selectedAnswer
                        ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                        : "border-gray-200 dark:border-gray-800"
                      : "border-gray-200 dark:border-gray-800"
                  }`}
                >
                  <RadioGroupItem value={option} id={option} />
                  <Label 
                    htmlFor={option} 
                    className="flex-1 cursor-pointer font-medium"
                  >
                    {option}
                  </Label>
                  {isAnswered && option === questions[currentQuestion].correctAnswer && (
                    <CheckCircle2 className="text-green-500 h-5 w-5" />
                  )}
                  {isAnswered && option === selectedAnswer && option !== questions[currentQuestion].correctAnswer && (
                    <XCircle className="text-red-500 h-5 w-5" />
                  )}
                </div>
              ))}
            </RadioGroup>
            
            {isAnswered && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="font-medium mb-1">Explanation:</p>
                <p className="text-sm">{questions[currentQuestion].explanation}</p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            {!isAnswered ? (
              <Button
                onClick={handleAnswer}
                disabled={selectedAnswer === null}
                className="w-full"
              >
                Check Answer
              </Button>
            ) : currentQuestion < questions.length - 1 ? (
              <Button
                onClick={handleNext}
                className="w-full"
              >
                Next Question
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={resetQuiz}
                className="w-full"
              >
                Restart Quiz
              </Button>
            )}
          </CardFooter>
        </Card>
        
        {isAnswered && currentQuestion === questions.length - 1 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quiz Complete!</CardTitle>
              <CardDescription>Your final results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-4xl font-bold mb-2">
                  {score}/{questions.length}
                </p>
                <p className="text-xl font-medium mb-4">
                  {score === questions.length
                    ? "Perfect score! Excellent job! 🎉"
                    : score >= questions.length * 0.7
                    ? "Great job! Very good! 👏"
                    : score >= questions.length * 0.5
                    ? "Good effort! Keep practicing! 👍"
                    : "Keep practicing! You'll improve! 💪"}
                </p>
                <Progress value={(score / questions.length) * 100} className="h-3" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MultipleChoice;
