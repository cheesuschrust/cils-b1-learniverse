
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Check, HelpCircle, AlertTriangle, ChevronRight } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Question } from "@/types/cils-types";
import SpeakableWord from "@/components/learning/SpeakableWord";

interface QuestionDisplayProps {
  question: Question;
  onAnswer: (answer: any, isCorrect: boolean) => void;
  onNext?: () => void;
  showFeedback?: boolean;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  onAnswer,
  onNext,
  showFeedback = true,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[] | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [textInput, setTextInput] = useState("");
  
  const handleSubmit = () => {
    let correct = false;
    
    switch (question.type) {
      case "multiple-choice":
        correct = Number(selectedAnswer) === question.correctOption;
        break;
      case "fill-blank":
        // For simplicity, check if any acceptable answer matches
        correct = question.blanks.every((blank, index) => {
          const inputValue = Array.isArray(selectedAnswer) ? selectedAnswer[index] : "";
          return blank.acceptableAnswers.some(
            (answer) => inputValue.toLowerCase() === answer.toLowerCase()
          );
        });
        break;
      case "matching":
      case "ordering":
        // This would need more complex validation
        correct = false;
        break;
      case "speaking":
      case "writing":
        // These typically require manual review
        correct = null as any;
        break;
    }
    
    setIsCorrect(correct);
    setIsSubmitted(true);
    onAnswer(selectedAnswer || textInput, correct as boolean);
  };
  
  const handleNext = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setIsSubmitted(false);
    setTextInput("");
    onNext?.();
  };
  
  const renderQuestionContent = () => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <RadioGroup
            value={selectedAnswer as string}
            onValueChange={setSelectedAnswer}
            disabled={isSubmitted}
          >
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 rounded-lg border p-3 ${
                    isSubmitted
                      ? index === question.correctOption
                        ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                        : Number(selectedAnswer) === index && isSubmitted
                        ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                        : ""
                      : "hover:bg-accent"
                  }`}
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                    disabled={isSubmitted}
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer"
                  >
                    {option}
                  </Label>
                  {isSubmitted && index === question.correctOption && (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                  {isSubmitted &&
                    Number(selectedAnswer) === index &&
                    index !== question.correctOption && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                </div>
              ))}
            </div>
          </RadioGroup>
        );
        
      case "fill-blank":
        // Create an array of selectedAnswers if not already
        const answers = Array.isArray(selectedAnswer) ? selectedAnswer : Array(question.blanks.length).fill("");
        
        // Split the text into parts based on blank positions
        const textWithBlanks = question.text;
        const parts = [];
        let lastIndex = 0;
        
        question.blanks.forEach((blank, index) => {
          // Add text before the blank
          parts.push(textWithBlanks.substring(lastIndex, blank.position));
          
          // Add the blank input
          parts.push(
            <Input
              key={`blank-${index}`}
              className="inline-block w-32 mx-1"
              value={answers[index] || ""}
              onChange={(e) => {
                const newAnswers = [...answers];
                newAnswers[index] = e.target.value;
                setSelectedAnswer(newAnswers);
              }}
              disabled={isSubmitted}
            />
          );
          
          lastIndex = blank.position;
        });
        
        // Add remaining text
        parts.push(textWithBlanks.substring(lastIndex));
        
        return <div className="space-y-2">{parts}</div>;
        
      case "writing":
        return (
          <>
            <p className="mb-2">
              {question.wordLimit 
                ? `Write a response (${question.wordLimit} words maximum):`
                : "Write your response:"}
            </p>
            <Textarea
              placeholder="Type your answer here..."
              className="min-h-[150px]"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              disabled={isSubmitted}
            />
          </>
        );
        
      case "speaking":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p>Listen to the prompt and record your response:</p>
                {question.audioPrompt && (
                  <audio
                    controls
                    src={question.audioPrompt}
                    className="mt-2 w-full"
                  />
                )}
              </div>
            </div>
            {question.imagePrompt && (
              <div className="mt-2">
                <img
                  src={question.imagePrompt}
                  alt="Speaking prompt"
                  className="max-w-full h-auto rounded-md"
                />
              </div>
            )}
            <div className="mt-4">
              <Button
                type="button"
                className="w-full"
                variant={isSubmitted ? "outline" : "default"}
                disabled={isSubmitted}
              >
                {isSubmitted ? "Recording submitted" : "Record Response"}
              </Button>
            </div>
          </div>
        );
        
      default:
        return <p>Unsupported question type</p>;
    }
  };
  
  const renderFeedback = () => {
    if (!isSubmitted || !showFeedback) return null;
    
    return (
      <div
        className={`mt-4 p-4 rounded-lg ${
          isCorrect
            ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400"
            : isCorrect === false
            ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"
            : "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400"
        }`}
      >
        <div className="flex items-start">
          {isCorrect ? (
            <Check className="h-5 w-5 mr-2 flex-shrink-0" />
          ) : isCorrect === false ? (
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          )}
          <div>
            <p className="font-medium">
              {isCorrect
                ? "Correct!"
                : isCorrect === false
                ? "Incorrect"
                : "Submitted for review"}
            </p>
            {question.explanation && <p className="mt-1 text-sm">{question.explanation}</p>}
            {question.type === "speaking" || question.type === "writing" ? (
              <p className="mt-1 text-sm">
                Your response will be reviewed based on the following criteria:
              </p>
            ) : null}
            {(question.type === "speaking" || question.type === "writing") && (
              <ul className="mt-1 text-sm list-disc list-inside">
                {question.evaluationCriteria.map((criteria, index) => (
                  <li key={index}>{criteria}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">
            <span className="mr-2">Question</span>
            {question.difficulty === "easy" && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded dark:bg-green-900 dark:text-green-100">
                Easy
              </span>
            )}
            {question.difficulty === "medium" && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded dark:bg-yellow-900 dark:text-yellow-100">
                Medium
              </span>
            )}
            {question.difficulty === "hard" && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded dark:bg-red-900 dark:text-red-100">
                Hard
              </span>
            )}
          </CardTitle>
          {question.sectionType === "listening" && (
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <HelpCircle className="h-4 w-4" />
              <span className="sr-only">Help</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="mb-4 flex items-center gap-2">
            <p className="text-lg">{question.text}</p>
            {question.sectionType === "listening" && (
              <SpeakableWord word={question.text} language="it" iconOnly />
            )}
          </div>
          
          {renderQuestionContent()}
          {renderFeedback()}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {!isSubmitted ? (
          <Button onClick={handleSubmit} disabled={!selectedAnswer && !textInput}>
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNext} className="flex items-center">
            Next Question
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default QuestionDisplay;
