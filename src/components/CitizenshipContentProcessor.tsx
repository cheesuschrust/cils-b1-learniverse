
import React, { useState } from 'react';
import { useAIUtils } from '../hooks/useAIUtils';
import {
  ItalianLevel,
  ItalianTestSection,
  AIGeneratedQuestion,
  QuestionGenerationParams
} from '../types/italian-types';

// Properly structured props interface
export interface CitizenshipContentProps {  
  settings: {  
    italianLevel: ItalianLevel;  
    testSection: ItalianTestSection;  
    isCitizenshipFocused: boolean;  
    topics: string[];  
  };  
  onContentGenerated?: (content: AIGeneratedQuestion[]) => void;  
  onError?: (error: string) => void;  
}  

// CRITICAL: Named export function
export function CitizenshipContentProcessor({  
  settings,  
  onContentGenerated,  
  onError  
}: CitizenshipContentProps) {  
  const { generateQuestions, isGenerating } = useAIUtils();  
  const [questions, setQuestions] = useState<AIGeneratedQuestion[]>([]);  
  const [error, setError] = useState<string | null>(null);  

  const handleGenerate = async () => {  
    setError(null);  
    
    // Create properly typed params for Italian citizenship content  
    const params: QuestionGenerationParams = {  
      italianLevel: settings.italianLevel,  
      testSection: settings.testSection,  
      isCitizenshipFocused: settings.isCitizenshipFocused,  
      topics: settings.topics,  
      count: 5 // Default to 5 questions  
    };  
    
    try {
      const result = await generateQuestions(params);  

      if (result.error) {  
        setError(result.error);  
        if (onError) {  
          onError(result.error);  
        }  
      } else {  
        setQuestions(result.questions);  
        if (onContentGenerated) {  
          onContentGenerated(result.questions);  
        }  
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    }  
  };  

  return (  
    <div className="citizenship-content-processor">  
      <h2>Italian Citizenship Test Question Generator</h2>  
      
      <div className="settings-summary">  
        <p>Level: {settings.italianLevel}</p>  
        <p>Section: {settings.testSection}</p>  
        <p>Citizenship Focus: {settings.isCitizenshipFocused ? 'Yes' : 'No'}</p>  
        <p>Topics: {settings.topics.join(', ') || 'All topics'}</p>  
      </div>  
      
      <button   
        onClick={handleGenerate}   
        disabled={isGenerating}  
        className="generate-button"  
      >  
        {isGenerating ? 'Generando...' : 'Genera Domande'}  
      </button>  
      
      {error && (  
        <div className="error-message">  
          Errore: {error}  
        </div>  
      )}  
      
      {questions.length > 0 && (  
        <div className="generated-questions">  
          <h3>Domande Generate</h3>  
          <ul className="question-list">  
            {questions.map(question => (  
              <li key={question.id} className="question-item">  
                <p className="question-text"><strong>{question.text}</strong></p>  
                {question.options && (  
                  <ul className="question-options">  
                    {question.options.map((option, index) => (  
                      <li key={index} className="option-item">  
                        {String.fromCharCode(65 + index)}. {option}  
                      </li>  
                    ))}  
                  </ul>  
                )}  
                <p className="correct-answer">Risposta Corretta: {question.correctAnswer}</p>  
                {question.explanation && (  
                  <p className="explanation">Spiegazione: {question.explanation}</p>  
                )}  
                {question.isCitizenshipRelevant && (  
                  <div className="citizenship-badge">  
                    Pertinente per il test di cittadinanza  
                  </div>  
                )}  
              </li>  
            ))}  
          </ul>  
        </div>  
      )}  
    </div>  
  );  
}  
