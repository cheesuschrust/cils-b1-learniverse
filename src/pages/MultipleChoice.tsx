
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, ArrowRight, Volume2, Languages } from "lucide-react";
import SpeakableWord from "@/components/learning/SpeakableWord";

interface Question {
  id: string;
  question: string;
  translation?: string;
  options: string[];
  translations?: string[];
  correctAnswer: string;
  explanation: string;
  explanationTranslation?: string;
}

const questions: Question[] = [
  {
    id: "q1",
    question: "Qual è la capitale d'Italia?",
    translation: "What is the capital of Italy?",
    options: ["Milano", "Roma", "Napoli", "Firenze"],
    translations: ["Milan", "Rome", "Naples", "Florence"],
    correctAnswer: "Roma",
    explanation: "Roma è la capitale d'Italia dal 1871.",
    explanationTranslation: "Rome has been the capital of Italy since 1871."
  },
  {
    id: "q2",
    question: "Come si dice 'goodbye' in italiano?",
    translation: "How do you say 'goodbye' in Italian?",
    options: ["Buongiorno", "Ciao", "Arrivederci", "Grazie"],
    translations: ["Good morning", "Hello/Bye (informal)", "Goodbye (formal)", "Thank you"],
    correctAnswer: "Arrivederci",
    explanation: "'Arrivederci' è il modo formale per dire goodbye. 'Ciao' può essere usato informalmente.",
    explanationTranslation: "'Arrivederci' is the formal way to say goodbye. 'Ciao' can be used informally."
  },
  {
    id: "q3",
    question: "Quale di questi è un verbo irregolare?",
    translation: "Which of these is an irregular verb?",
    options: ["Parlare", "Andare", "Mangiare", "Studiare"],
    translations: ["To speak", "To go", "To eat", "To study"],
    correctAnswer: "Andare",
    explanation: "'Andare' è un verbo irregolare che non segue il modello di coniugazione standard.",
    explanationTranslation: "'Andare' is an irregular verb that doesn't follow the standard conjugation pattern."
  },
  {
    id: "q4",
    question: "Quale colore NON è presente nella bandiera italiana?",
    translation: "Which color is NOT present in the Italian flag?",
    options: ["Verde", "Bianco", "Rosso", "Blu"],
    translations: ["Green", "White", "Red", "Blue"],
    correctAnswer: "Blu",
    explanation: "La bandiera italiana ha tre colori: verde, bianco e rosso.",
    explanationTranslation: "The Italian flag has three colors: green, white, and red."
  },
  {
    id: "q5",
    question: "Come si dice '20' in italiano?",
    translation: "How do you say '20' in Italian?",
    options: ["Dieci", "Venti", "Trenta", "Quindici"],
    translations: ["Ten", "Twenty", "Thirty", "Fifteen"],
    correctAnswer: "Venti",
    explanation: "'Venti' è il numero 20 in italiano.",
    explanationTranslation: "'Venti' is the number 20 in Italian."
  }
];

const MultipleChoice = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showTranslations, setShowTranslations] = useState(false);
  
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
  
  const toggleTranslations = () => {
    setShowTranslations(!showTranslations);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Multiple Choice</h1>
        <p className="text-gray-700 font-medium">Test your knowledge with multiple choice questions</p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <Card className="w-full border-2 border-gray-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#009246]/10 to-[#ce2b37]/10">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-gray-800">Quiz di Italiano</CardTitle>
                <CardDescription className="text-gray-700">Basic Italian language quiz</CardDescription>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
                <p className="text-sm text-gray-700">
                  Score: {score}/{currentQuestion + (isAnswered ? 1 : 0)}
                </p>
              </div>
            </div>
            <Progress value={progress} className="h-2 mt-4 bg-gray-200" />
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            <div className="flex justify-between items-center">
              <div className="text-xl font-medium text-gray-800">
                <SpeakableWord 
                  word={questions[currentQuestion].question}
                  language="it"
                  className="block"
                />
                {showTranslations && questions[currentQuestion].translation && (
                  <div className="mt-2 text-sm italic text-gray-700">
                    {questions[currentQuestion].translation}
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTranslations}
                className="flex items-center gap-1 border-[#33A5EF] text-[#33A5EF]"
              >
                <Languages className="h-4 w-4" />
                {showTranslations ? "Hide" : "Show"} Translation
              </Button>
            </div>
            
            <RadioGroup 
              value={selectedAnswer || ""} 
              onValueChange={setSelectedAnswer}
              className="space-y-3"
              disabled={isAnswered}
            >
              {questions[currentQuestion].options.map((option, index) => (
                <div 
                  key={option} 
                  className={`flex items-center space-x-2 p-3 rounded-lg border ${
                    isAnswered
                      ? option === questions[currentQuestion].correctAnswer
                        ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                        : option === selectedAnswer
                        ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                        : "border-gray-300 dark:border-gray-800"
                      : "border-gray-300 dark:border-gray-800"
                  }`}
                >
                  <RadioGroupItem value={option} id={option} />
                  <Label 
                    htmlFor={option} 
                    className="flex-1 cursor-pointer font-medium text-gray-800"
                  >
                    <div className="flex items-center justify-between">
                      <SpeakableWord word={option} language="it" />
                      {showTranslations && questions[currentQuestion].translations && (
                        <span className="text-sm italic text-gray-600 ml-2">
                          ({questions[currentQuestion].translations[index]})
                        </span>
                      )}
                    </div>
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
              <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                <p className="font-medium mb-1 text-gray-800">Explanation:</p>
                <div className="text-gray-700">
                  <SpeakableWord word={questions[currentQuestion].explanation} language="it" className="block" />
                  {showTranslations && questions[currentQuestion].explanationTranslation && (
                    <div className="mt-2 text-sm italic">
                      {questions[currentQuestion].explanationTranslation}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            {!isAnswered ? (
              <Button
                onClick={handleAnswer}
                disabled={selectedAnswer === null}
                className="w-full bg-[#009246] hover:bg-[#017f3c]"
              >
                Check Answer
              </Button>
            ) : currentQuestion < questions.length - 1 ? (
              <Button
                onClick={handleNext}
                className="w-full bg-[#ce2b37] hover:bg-[#b32530]"
              >
                Next Question
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={resetQuiz}
                className="w-full bg-[#33A5EF] hover:bg-[#2895df]"
              >
                Restart Quiz
              </Button>
            )}
          </CardFooter>
        </Card>
        
        {isAnswered && currentQuestion === questions.length - 1 && (
          <Card className="mt-6 border-2 border-gray-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-[#009246]/10 to-[#ce2b37]/10">
              <CardTitle className="text-gray-800">Quiz Complete!</CardTitle>
              <CardDescription className="text-gray-700">Your final results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-4xl font-bold mb-2 text-gray-800">
                  {score}/{questions.length}
                </p>
                <p className="text-xl font-medium mb-4 text-gray-700">
                  {score === questions.length
                    ? "Perfect score! Excellent job! 🎉"
                    : score >= questions.length * 0.7
                    ? "Great job! Very good! 👏"
                    : score >= questions.length * 0.5
                    ? "Good effort! Keep practicing! 👍"
                    : "Keep practicing! You'll improve! 💪"}
                </p>
                <Progress 
                  value={(score / questions.length) * 100} 
                  className="h-3 bg-gray-200"
                  // Color based on score
                  style={{
                    "--progress-foreground": score === questions.length 
                      ? "#009246" 
                      : score >= questions.length * 0.7
                      ? "#33A5EF"
                      : score >= questions.length * 0.5
                      ? "#FFB800"
                      : "#ce2b37"
                  } as React.CSSProperties}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MultipleChoice;
