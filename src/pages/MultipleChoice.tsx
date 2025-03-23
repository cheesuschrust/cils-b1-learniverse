
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  HelpCircle,
  BookOpen,
  Clock,
  Award,
  BarChart,
} from "lucide-react";

// Sample question data
const sampleQuestions = [
  {
    id: 1,
    question: "Quale di queste città è la capitale d'Italia?",
    options: ["Milano", "Firenze", "Roma", "Venezia"],
    correctAnswer: "Roma",
    explanation:
      "Roma è la capitale d'Italia dal 1871. Prima di Roma, la capitale è stata Torino e poi Firenze.",
  },
  {
    id: 2,
    question: "Cosa rappresentano i tre colori della bandiera italiana?",
    options: [
      "Libertà, Uguaglianza, Fraternità",
      "Passato, Presente, Futuro",
      "Mare, Pianura, Montagne",
      "Speranza, Fede, Carità",
    ],
    correctAnswer: "Speranza, Fede, Carità",
    explanation:
      "I tre colori della bandiera italiana simboleggiano la Speranza (verde), la Fede (bianco) e la Carità (rosso).",
  },
  {
    id: 3,
    question: "Chi è stato il primo presidente della Repubblica Italiana?",
    options: [
      "Alcide De Gasperi",
      "Enrico De Nicola",
      "Luigi Einaudi",
      "Giuseppe Saragat",
    ],
    correctAnswer: "Enrico De Nicola",
    explanation:
      "Enrico De Nicola è stato il primo presidente della Repubblica Italiana dal 1946 al 1948, sebbene inizialmente con il titolo di Capo Provvisorio dello Stato.",
  },
];

// Component
const MultipleChoice = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  
  const { toast } = useToast();
  
  const currentQuestion = sampleQuestions[currentQuestionIndex];
  
  const handleOptionSelect = (option: string) => {
    if (isSubmitted) return;
    setSelectedOption(option);
  };
  
  const handleSubmit = () => {
    if (!selectedOption) {
      toast({
        title: "Please select an answer",
        description: "You need to choose an option before submitting",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitted(true);
    
    if (selectedOption === currentQuestion.correctAnswer) {
      setCorrectAnswers(correctAnswers + 1);
      // Play success sound in a real app
    } else {
      setIncorrectAnswers(incorrectAnswers + 1);
      // Play error sound in a real app
    }
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };
  
  const handleStartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setShowExplanation(false);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setQuizFinished(false);
    // setTimeLeft(60); // Start a 60-second timer for timed quizzes
  };
  
  const toggleExplanation = () => {
    setShowExplanation(!showExplanation);
  };
  
  // Function to render the question card
  const renderQuestionCard = () => (
    <Card className="w-full max-w-3xl mx-auto backdrop-blur-sm border-accent/20 animate-fade-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Multiple Choice Question</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            Question {currentQuestionIndex + 1} of {sampleQuestions.length}
          </div>
        </div>
        <CardDescription>
          Test your knowledge of Italian citizenship
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-secondary/30 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">{currentQuestion.question}</h3>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedOption === option
                    ? isSubmitted
                      ? option === currentQuestion.correctAnswer
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : "border-primary bg-primary/5"
                    : isSubmitted && option === currentQuestion.correctAnswer
                    ? "border-green-500 bg-green-50"
                    : "border-border hover:border-primary hover:bg-accent/10"
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isSubmitted && option === currentQuestion.correctAnswer && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                  {isSubmitted &&
                    selectedOption === option &&
                    option !== currentQuestion.correctAnswer && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {isSubmitted && (
          <div
            className={`p-4 rounded-lg border ${
              selectedOption === currentQuestion.correctAnswer
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <div className="flex items-start">
              {selectedOption === currentQuestion.correctAnswer ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              )}
              <div>
                <p className="font-medium">
                  {selectedOption === currentQuestion.correctAnswer
                    ? "Correct!"
                    : "Incorrect!"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedOption === currentQuestion.correctAnswer
                    ? "Well done! You selected the right answer."
                    : `The correct answer is "${currentQuestion.correctAnswer}".`}
                </p>
                
                {showExplanation ? (
                  <div className="mt-2 p-3 bg-secondary/50 rounded-md text-sm">
                    <p>{currentQuestion.explanation}</p>
                  </div>
                ) : (
                  <Button
                    variant="link"
                    size="sm"
                    className="px-0 text-primary mt-1"
                    onClick={toggleExplanation}
                  >
                    <HelpCircle className="h-4 w-4 mr-1" />
                    Show explanation
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          {isSubmitted && (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
              <span className="mr-3">{correctAnswers} correct</span>
              <XCircle className="h-4 w-4 text-red-500 mr-1" />
              <span>{incorrectAnswers} incorrect</span>
            </>
          )}
        </div>
        <div className="space-x-2">
          {!isSubmitted ? (
            <Button onClick={handleSubmit} disabled={!selectedOption}>
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {currentQuestionIndex < sampleQuestions.length - 1
                ? "Next Question"
                : "Finish Quiz"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
  
  // Function to render the results card
  const renderResultsCard = () => (
    <Card className="w-full max-w-3xl mx-auto backdrop-blur-sm border-accent/20 animate-fade-up">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Award className="h-5 w-5 mr-2 text-primary" />
          Quiz Results
        </CardTitle>
        <CardDescription>
          You've completed the multiple choice questions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-around p-6 bg-secondary/30 rounded-lg">
          <div className="text-center mb-4 md:mb-0">
            <div className="text-3xl font-bold text-primary">
              {correctAnswers}/{sampleQuestions.length}
            </div>
            <p className="text-sm text-muted-foreground">Correct Answers</p>
          </div>
          
          <div className="text-center mb-4 md:mb-0">
            <div className="text-3xl font-bold">
              {Math.round((correctAnswers / sampleQuestions.length) * 100)}%
            </div>
            <p className="text-sm text-muted-foreground">Accuracy</p>
          </div>
          
          <div className="text-center">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-secondary/80 stroke-current"
                  strokeWidth="10"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                ></circle>
                <circle
                  className="text-primary stroke-current"
                  strokeWidth="10"
                  strokeLinecap="round"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${
                    2 *
                    Math.PI *
                    40 *
                    (1 - correctAnswers / sampleQuestions.length)
                  }`}
                  style={{
                    transformOrigin: "center",
                    transform: "rotate(-90deg)",
                  }}
                ></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <BarChart className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Question Summary</h3>
          {sampleQuestions.map((question, index) => (
            <div
              key={question.id}
              className="p-3 border border-border rounded-lg"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  {index < correctAnswers ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="font-medium">{question.question}</p>
                  <p className="text-sm text-primary">
                    Correct answer: {question.correctAnswer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-accent/20 p-4 rounded-lg">
          <div className="flex items-start">
            <BookOpen className="h-5 w-5 text-primary mt-0.5 mr-2" />
            <div>
              <h3 className="font-medium">AI Feedback</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {correctAnswers === sampleQuestions.length
                  ? "Excellent work! You've demonstrated a strong understanding of Italian citizenship knowledge. Keep it up!"
                  : correctAnswers >= sampleQuestions.length / 2
                  ? "Good effort! You're making progress, but there's still room for improvement. Focus on reviewing the questions you missed."
                  : "You need more practice with Italian citizenship topics. Consider reviewing the basic information about Italy's government, history, and culture."}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleStartQuiz}>
          Try Again
        </Button>
        <Button>Continue Learning</Button>
      </CardFooter>
    </Card>
  );
  
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2 animate-fade-in">
        Multiple Choice Questions
      </h1>
      <p className="text-muted-foreground mb-8 animate-fade-in">
        Test your knowledge of Italian citizenship with daily questions
      </p>
      
      {quizFinished ? renderResultsCard() : renderQuestionCard()}
    </div>
  );
};

export default MultipleChoice;
