
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
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  HelpCircle,
  BookOpen,
  Clock,
  Award,
  BarChart,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { useMultipleChoice } from "@/hooks/useMultipleChoice";
import { QuestionSet } from "@/types/question";

// Component
const MultipleChoice = () => {
  // Get quiz functionality from hook
  const {
    availableSets,
    currentSet,
    currentQuestion,
    currentQuestionIndex,
    selectedOption,
    isSubmitted,
    correctAnswers,
    incorrectAnswers,
    isLoading,
    quizFinished,
    showExplanation,
    startQuiz,
    handleOptionSelect,
    handleSubmit,
    handleNext,
    restartQuiz,
    toggleExplanation
  } = useMultipleChoice();
  
  // If we're not in a quiz yet, show the question set selection
  if (!currentSet) {
    return <QuestionSetSelection 
      isLoading={isLoading} 
      questionSets={availableSets} 
      onSelectSet={startQuiz} 
    />;
  }
  
  // If we're in a quiz, show either the active quiz or the results
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-2" 
          onClick={() => startQuiz('')}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Sets
        </Button>
        <h1 className="text-3xl font-bold tracking-tight animate-fade-in">
          {currentSet.title}
        </h1>
      </div>
      <p className="text-muted-foreground mb-8 animate-fade-in">
        {currentSet.description}
      </p>
      
      {quizFinished 
        ? <QuizResults 
            questionSet={currentSet} 
            correctAnswers={correctAnswers} 
            incorrectAnswers={incorrectAnswers}
            onRestart={restartQuiz}
            onBackToSets={() => startQuiz('')}
          />
        : <QuestionCard 
            question={currentQuestion!}
            questionIndex={currentQuestionIndex}
            totalQuestions={currentSet.questions.length}
            selectedOption={selectedOption}
            isSubmitted={isSubmitted}
            showExplanation={showExplanation}
            correctAnswers={correctAnswers}
            incorrectAnswers={incorrectAnswers}
            onSelectOption={handleOptionSelect}
            onSubmit={handleSubmit}
            onToggleExplanation={toggleExplanation}
            onNext={handleNext}
          />
      }
    </div>
  );
};

// Component to display the question sets
const QuestionSetSelection = ({ 
  isLoading, 
  questionSets, 
  onSelectSet 
}: { 
  isLoading: boolean, 
  questionSets: QuestionSet[], 
  onSelectSet: (id: string) => void 
}) => {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-2 animate-fade-in">
        Multiple Choice Questions
      </h1>
      <p className="text-muted-foreground mb-8 animate-fade-in">
        Test your knowledge of Italian with these interactive quizzes
      </p>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-lg">Loading question sets...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questionSets.map(set => (
            <Card key={set.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{set.title}</CardTitle>
                  <Badge className="capitalize">{set.difficulty}</Badge>
                </div>
                <CardDescription>{set.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  <span className="flex items-center mb-1">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {set.questions.length} questions
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Estimated time: {set.questions.length * 2} minutes
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => onSelectSet(set.id)}
                >
                  Start Quiz
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Component to display a question
const QuestionCard = ({ 
  question,
  questionIndex,
  totalQuestions,
  selectedOption,
  isSubmitted,
  showExplanation,
  correctAnswers,
  incorrectAnswers,
  onSelectOption,
  onSubmit,
  onToggleExplanation,
  onNext
}) => {
  return (
    <Card className="w-full max-w-3xl mx-auto backdrop-blur-sm border-accent/20 animate-fade-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Multiple Choice Question</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            Question {questionIndex + 1} of {totalQuestions}
          </div>
        </div>
        <CardDescription>
          Category: {question.category}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-secondary/30 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">{question.question}</h3>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedOption === option
                    ? isSubmitted
                      ? option === question.correctAnswer
                        ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                        : "border-red-500 bg-red-50 dark:bg-red-950/30"
                      : "border-primary bg-primary/5"
                    : isSubmitted && option === question.correctAnswer
                    ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                    : "border-border hover:border-primary hover:bg-accent/10"
                }`}
                onClick={() => onSelectOption(option)}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isSubmitted && option === question.correctAnswer && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                  {isSubmitted &&
                    selectedOption === option &&
                    option !== question.correctAnswer && (
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
              selectedOption === question.correctAnswer
                ? "border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-900"
                : "border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900"
            }`}
          >
            <div className="flex items-start">
              {selectedOption === question.correctAnswer ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              )}
              <div>
                <p className="font-medium">
                  {selectedOption === question.correctAnswer
                    ? "Correct!"
                    : "Incorrect!"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedOption === question.correctAnswer
                    ? "Well done! You selected the right answer."
                    : `The correct answer is "${question.correctAnswer}".`}
                </p>
                
                {showExplanation ? (
                  <div className="mt-2 p-3 bg-secondary/50 rounded-md text-sm">
                    <p>{question.explanation}</p>
                  </div>
                ) : (
                  <Button
                    variant="link"
                    size="sm"
                    className="px-0 text-primary mt-1"
                    onClick={onToggleExplanation}
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
            <Button onClick={onSubmit} disabled={!selectedOption}>
              Submit Answer
            </Button>
          ) : (
            <Button onClick={onNext}>
              {questionIndex < totalQuestions - 1
                ? "Next Question"
                : "Finish Quiz"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

// Component to display quiz results
const QuizResults = ({ 
  questionSet, 
  correctAnswers, 
  incorrectAnswers,
  onRestart,
  onBackToSets
}) => {
  const totalQuestions = questionSet.questions.length;
  
  return (
    <Card className="w-full max-w-3xl mx-auto backdrop-blur-sm border-accent/20 animate-fade-up">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Award className="h-5 w-5 mr-2 text-primary" />
          Quiz Results
        </CardTitle>
        <CardDescription>
          You've completed the {questionSet.title} quiz
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-around p-6 bg-secondary/30 rounded-lg">
          <div className="text-center mb-4 md:mb-0">
            <div className="text-3xl font-bold text-primary">
              {correctAnswers}/{totalQuestions}
            </div>
            <p className="text-sm text-muted-foreground">Correct Answers</p>
          </div>
          
          <div className="text-center mb-4 md:mb-0">
            <div className="text-3xl font-bold">
              {Math.round((correctAnswers / totalQuestions) * 100)}%
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
                    2 * Math.PI * 40 * (1 - correctAnswers / totalQuestions)
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
          {questionSet.questions.map((question, index) => (
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
                {correctAnswers === totalQuestions
                  ? "Excellent work! You've demonstrated a strong understanding of this topic. Keep it up!"
                  : correctAnswers >= totalQuestions / 2
                  ? "Good effort! You're making progress, but there's still room for improvement. Focus on reviewing the questions you missed."
                  : "You need more practice with this topic. Consider reviewing the basic concepts before trying again."}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBackToSets}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Sets
        </Button>
        <Button onClick={onRestart}>
          Try Again
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MultipleChoice;
