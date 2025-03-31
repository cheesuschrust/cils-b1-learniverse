
import React, { useState, useEffect } from 'react';  
import { useAIUtils } from '../hooks/useAIUtils';  
import { useAuth } from '../contexts/AuthContext';  
import {   
  ItalianPracticeProps,   
  AIGeneratedQuestion,
  QuestionGenerationParams  
} from '../types/app-types';  

const ItalianPracticeComponent: React.FC<ItalianPracticeProps> = ({  
  testSection,  
  level,  
  isCitizenshipMode,  
  onComplete  
}) => {  
  const { generateQuestions, isGenerating } = useAIUtils();  
  const { user } = useAuth();  
  const [questions, setQuestions] = useState<AIGeneratedQuestion[]>([]);  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);  
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);  
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);  
  const [score, setScore] = useState(0);  
  const [startTime, setStartTime] = useState<number>(0);  
  const [elapsedTime, setElapsedTime] = useState(0);  
  const [error, setError] = useState<string | null>(null);  
  const [isComplete, setIsComplete] = useState(false);  

  useEffect(() => {  
    // Load questions when component mounts  
    loadQuestions();  
    // Start the timer  
    setStartTime(Date.now());  
    
    // Timer interval  
    const intervalId = setInterval(() => {  
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));  
    }, 1000);  
    
    return () => clearInterval(intervalId);  
  }, [testSection, level, isCitizenshipMode]);  

  const loadQuestions = async () => {  
    if (!user) {  
      setError('Please log in to practice');  
      return;  
    }  
    
    const params: QuestionGenerationParams = {  
      language: 'italian',
      difficulty: level,  
      contentTypes: [testSection],  
      focusAreas: [],
      count: 10, // 10 questions for a practice session
      userId: user.id
    };  
    
    const result = await generateQuestions(params);  
    
    if (result.error) {  
      setError(result.error);  
    } else {  
      setQuestions(result.questions);  
    }  
  };  

  const handleAnswerSelect = (answer: string) => {  
    if (!isAnswerSubmitted) {  
      setSelectedAnswer(answer);  
    }  
  };  

  const handleSubmitAnswer = () => {  
    if (!selectedAnswer || isAnswerSubmitted) return;  
    
    const currentQuestion = questions[currentQuestionIndex];  
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;  
    
    if (isCorrect) {  
      setScore(prevScore => prevScore + 1);  
    }  
    
    setIsAnswerSubmitted(true);  
  };  

  const handleNextQuestion = () => {  
    if (currentQuestionIndex < questions.length - 1) {  
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);  
      setSelectedAnswer(null);  
      setIsAnswerSubmitted(false);  
    } else {  
      // Practice session complete  
      completeSession();  
    }  
  };  

  const completeSession = async () => {  
    setIsComplete(true);  
    const totalTime = Math.floor((Date.now() - startTime) / 1000);  
    const finalScore = (score / questions.length) * 100;  
    
    // Save practice results to database  
    try {  
      if (user) {  
        await fetch('/api/save-practice-session', {  
          method: 'POST',  
          headers: {  
            'Content-Type': 'application/json',  
          },  
          body: JSON.stringify({  
            userId: user.id,  
            sessionType: testSection,  
            score: finalScore,  
            questionsAnswered: questions.length,  
            questionsCorrect: score,  
            duration: totalTime,  
            isCitizenshipFocused: isCitizenshipMode  
          }),  
        });  
      }  
    } catch (error) {  
      console.error('Error saving practice session:', error);  
    }  
    
    // Call the completion callback  
    if (onComplete) {  
      onComplete({  
        score: finalScore,  
        time: totalTime  
      });  
    }  
  };  

  const formatTime = (seconds: number): string => {  
    const mins = Math.floor(seconds / 60);  
    const secs = seconds % 60;  
    return `${mins}:${secs.toString().padStart(2, '0')}`;  
  };  

  if (error) {  
    return <div className="error-message">{error}</div>;  
  }  

  if (isGenerating || questions.length === 0) {  
    return <div className="loading">Caricamento domande...</div>;  
  }  

  if (isComplete) {  
    return (  
      <div className="practice-complete">  
        <h2>Pratica Completata!</h2>  
        <div className="results-summary">  
          <p>Punteggio: {Math.round((score / questions.length) * 100)}%</p>  
          <p>Domande corrette: {score} di {questions.length}</p>  
          <p>Tempo: {formatTime(elapsedTime)}</p>  
        </div>  
        <button   
          onClick={loadQuestions}  
          className="restart-button"  
        >  
          Nuova Sessione  
        </button>  
      </div>  
    );  
  }  

  const currentQuestion = questions[currentQuestionIndex];  

  return (  
    <div className="italian-practice-component">  
      <div className="practice-header">  
        <div className="practice-info">  
          <span className="practice-section">{testSection.toUpperCase()}</span>  
          <span className="practice-level">Livello: {level}</span>  
          {isCitizenshipMode && (  
            <span className="citizenship-badge">Modalità Cittadinanza</span>  
          )}  
        </div>  
        <div className="practice-progress">  
          <span>Domanda {currentQuestionIndex + 1} di {questions.length}</span>  
          <span className="practice-timer">Tempo: {formatTime(elapsedTime)}</span>  
        </div>  
      </div>  
      
      <div className="question-container">  
        <p className="question-text">{currentQuestion.text}</p>  
        
        {currentQuestion.options && (  
          <ul className="answer-options">  
            {currentQuestion.options.map((option, index) => (  
              <li   
                key={index}  
                className={`option-item ${selectedAnswer === option ? 'selected' : ''} ${  
                  isAnswerSubmitted && option === currentQuestion.correctAnswer ? 'correct' : ''  
                } ${  
                  isAnswerSubmitted && selectedAnswer === option &&   
                  option !== currentQuestion.correctAnswer ? 'incorrect' : ''  
                }`}  
                onClick={() => handleAnswerSelect(option)}  
              >  
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>  
                <span className="option-text">{option}</span>  
              </li>  
            ))}  
          </ul>  
        )}  
        
        {isAnswerSubmitted && (  
          <div className="feedback-container">  
            <p className={`feedback ${selectedAnswer === currentQuestion.correctAnswer ? 'correct' : 'incorrect'}`}>  
              {selectedAnswer === currentQuestion.correctAnswer ? 'Corretto!' : 'Non corretto!'}  
            </p>  
            {currentQuestion.explanation && (  
              <p className="explanation">{currentQuestion.explanation}</p>  
            )}  
          </div>  
        )}  
      </div>  
      
      <div className="practice-controls">  
        {!isAnswerSubmitted ? (  
          <button   
            onClick={handleSubmitAnswer}  
            disabled={!selectedAnswer}  
            className="submit-answer-button"  
          >  
            Controlla Risposta  
          </button>  
        ) : (  
          <button   
            onClick={handleNextQuestion}  
            className="next-question-button"  
          >  
            {currentQuestionIndex < questions.length - 1 ? 'Prossima Domanda' : 'Termina Pratica'}  
          </button>  
        )}  
      </div>  
    </div>  
  );  
}  

export default ItalianPracticeComponent;
