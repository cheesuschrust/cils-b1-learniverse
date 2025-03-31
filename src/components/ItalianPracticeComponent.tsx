import React, { useState, useEffect } from 'react';
import { useAIUtils } from '@/hooks/useAIUtils';
import {
  ItalianLevel,
  ItalianTestSection,
  AIGeneratedQuestion,
  QuestionGenerationParams
} from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export interface ItalianPracticeProps {
  testSection: ItalianTestSection;
  level: ItalianLevel;
  isCitizenshipMode: boolean;
  onComplete?: (results: {score: number; time: number}) => void;
}

// Named export function
export function ItalianPracticeComponent({
  testSection,
  level,
  isCitizenshipMode,
  onComplete
}: ItalianPracticeProps) {
  const { generateQuestions } = useAIUtils();
  const [questions, setQuestions] = useState<AIGeneratedQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [timer, setTimer] = useState<number | null>(null);
  
  // Load questions on component mount
  useEffect(() => {
    loadQuestions();
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [testSection, level]);
  
  // Start timer when questions are loaded
  useEffect(() => {
    if (questions.length > 0 && !timer) {
      const intervalId = window.setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
      setTimer(intervalId);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [questions]);
  
  const loadQuestions = async () => {
    setLoading(true);
    try {
      const params: QuestionGenerationParams = {
        italianLevel: level,
        testSection: testSection,
        isCitizenshipFocused: isCitizenshipMode,
        count: 5
      };
      
      const result = await generateQuestions(params);
      
      if (!result.error && result.questions.length > 0) {
        setQuestions(result.questions);
        setCurrentIndex(0);
        setAnswers({});
        setShowFeedback(false);
        setTimeSpent(0);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelect = (option: string) => {
    setSelectedOption(option);
  };
  
  const handleNextQuestion = () => {
    const currentQuestion = questions[currentIndex];
    
    // Save answer
    if (selectedOption) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: selectedOption
      }));
    }
    
    // Move to next question or complete
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      completeExercise();
    }
  };
  
  const handleCheckAnswer = () => {
    setShowFeedback(true);
  };
  
  const completeExercise = () => {
    // Stop the timer
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    
    // Calculate score
    const totalQuestions = questions.length;
    const correctAnswers = questions.filter(q => 
      answers[q.id] === q.correctAnswer
    ).length;
    
    const score = (correctAnswers / totalQuestions) * 100;
    
    // Notify parent component
    if (onComplete) {
      onComplete({
        score,
        time: timeSpent
      });
    }
  };
  
  // Current question
  const currentQuestion = questions[currentIndex];
  
  // If there's no current question, show loading or empty state
  if (!currentQuestion) {
    return (
      <Card className="italian-practice">
        {loading ? (
          <CardContent className="p-6 flex justify-center items-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading questions...</span>
          </CardContent>
        ) : (
          <CardContent className="p-6">
            <div className="text-center">
              <p className="mb-4">No questions available. Please try again.</p>
              <Button onClick={loadQuestions}>Load Questions</Button>
            </div>
          </CardContent>
        )}
      </Card>
    );
  }
  
  const isCorrect = selectedOption === currentQuestion.correctAnswer;
  
  return (
    <Card className="italian-practice">
      <CardHeader>
        <CardTitle>Italian Practice Exercise</CardTitle>
        <div className="flex justify-between items-center">
          <div className="flex-1 bg-gray-200 h-2 rounded-full mt-2">
            <div 
              className="bg-blue-500 h-2 rounded-full"
              style={{width: `${((currentIndex + 1) / questions.length) * 100}%`}}
            ></div>
          </div>
          <span className="ml-3 text-sm font-medium">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="question-container">
          <h3 className="text-xl font-semibold mb-4">{currentQuestion.text}</h3>
          
          <div className="options-list space-y-2">
            {currentQuestion.options?.map((option, index) => (
              <div 
                key={index} 
                className={`option p-3 border rounded cursor-pointer ${
                  selectedOption === option
                    ? showFeedback
                      ? isCorrect
                        ? 'bg-green-100 border-green-500'
                        : 'bg-red-100 border-red-500'
                      : 'bg-blue-100 border-blue-500'
                    : ''
                } ${
                  showFeedback && option === currentQuestion.correctAnswer
                    ? 'bg-green-100 border-green-500'
                    : ''
                }`}
                onClick={() => !showFeedback && handleSelect(option)}
              >
                {option}
              </div>
            ))}
          </div>
          
          {showFeedback && (
            <div className="feedback mt-4 p-3 rounded">
              <p className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                {isCorrect ? 'Correct!' : 'Incorrect. The correct answer is:'} 
                {' '}<strong>{currentQuestion.correctAnswer}</strong>
              </p>
              {currentQuestion.explanation && (
                <p className="explanation mt-2">{currentQuestion.explanation}</p>
              )}
            </div>
          )}
          
          <div className="actions mt-6 flex justify-between">
            {!showFeedback ? (
              <Button 
                onClick={handleCheckAnswer} 
                disabled={!selectedOption}
                variant={!selectedOption ? "outline" : "default"}
              >
                Check Answer
              </Button>
            ) : (
              <Button 
                onClick={handleNextQuestion}
                variant="default"
              >
                {currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Exercise'}
              </Button>
            )}
            
            <div className="timer text-sm font-medium flex items-center">
              Time: {Math.floor(timeSpent / 60)}:{String(timeSpent % 60).padStart(2, '0')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ItalianPracticeComponent;
