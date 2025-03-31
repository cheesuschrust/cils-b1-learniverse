
import React, { useState, useEffect } from 'react';
import { useAIUtils } from '../hooks/useAIUtils';
import {
  ItalianLevel,
  ItalianTestSection,
  AIGeneratedQuestion,
  QuestionGenerationParams
} from '../types/italian-types';

export interface ItalianPracticeProps {
  testSection: ItalianTestSection;
  level: ItalianLevel;
  isCitizenshipMode: boolean;
  onComplete?: (results: {score: number; time: number}) => void;
}

// CRITICAL: Named export function
export function ItalianPracticeComponent({
  testSection,
  level,
  isCitizenshipMode,
  onComplete
}: ItalianPracticeProps) {
  const { generateQuestions, isGenerating } = useAIUtils();
  const [questions, setQuestions] = useState<AIGeneratedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Start timer and load questions
    setStartTime(Date.now());
    loadQuestions();
    
    // Set up timer
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [testSection, level, isCitizenshipMode]);
  
  const loadQuestions = async () => {
    try {
      const params: QuestionGenerationParams = {
        italianLevel: level,
        testSection: testSection,
        isCitizenshipFocused: isCitizenshipMode,
        count: 5
      };
      
      const result = await generateQuestions(params);
      
      if (result.error) {
        setError(result.error);
      } else {
        setQuestions(result.questions);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error loading questions');
    }
  };
  
  const completeSession = () => {
    setIsComplete(true);
    const finalTime = Math.floor((Date.now() - startTime) / 1000);
    
    if (onComplete) {
      onComplete({
        score: (score / questions.length) * 100,
        time: finalTime
      });
    }
  };
  
  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      completeSession();
    }
  };
  
  if (isGenerating || questions.length === 0) {
    return <div className="loading">Caricamento domande...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  if (isComplete) {
    return (
      <div className="practice-complete">
        <h2>Pratica Completata!</h2>
        <div className="results">
          <p>Punteggio: {Math.round((score / questions.length) * 100)}%</p>
          <p>Tempo: {elapsedTime} secondi</p>
        </div>
        <button onClick={() => loadQuestions()} className="retry-button">
          Nuova sessione
        </button>
      </div>
    );
  }
  
  const currentQuestion = questions[currentIndex];
  
  return (
    <div className="italian-practice">
      <div className="practice-header">
        <h2>Pratica di {testSection}</h2>
        <div className="practice-info">
          <p>Livello: {level}</p>
          <p>Domanda {currentIndex + 1} di {questions.length}</p>
          <p>Tempo: {elapsedTime} secondi</p>
        </div>
      </div>
      
      <div className="question-container">
        <p className="question-text">{currentQuestion.text}</p>
        
        {currentQuestion.options ? (
          <div className="options">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className="option-button"
                onClick={() => handleAnswer(option === currentQuestion.correctAnswer)}
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <div className="free-response">
            <textarea placeholder="Inserisci la tua risposta..."></textarea>
            <button onClick={() => handleAnswer(true)}>Verifica</button>
          </div>
        )}
      </div>
    </div>
  );
}
