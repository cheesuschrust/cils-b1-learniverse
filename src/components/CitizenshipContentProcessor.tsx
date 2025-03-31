
import React, { useState } from 'react';  
import { useAIUtils } from '../hooks/useAIUtils';  
import {
  CitizenshipContentProps,
  AIGeneratedQuestion,
  QuestionGenerationParams
} from '../types/app-types';  

const CitizenshipContentProcessor: React.FC<CitizenshipContentProps> = ({  
  settings,  
  onContentGenerated,  
  onError  
}) => {  
  const { generateQuestions, isGenerating } = useAIUtils();  
  const [questions, setQuestions] = useState<AIGeneratedQuestion[]>([]);  
  const [error, setError] = useState<string | null>(null);  

  const handleGenerate = async () => {  
    setError(null);  
    
    // Create properly typed params for Italian citizenship content  
    const params: QuestionGenerationParams = {  
      language: 'italian',
      difficulty: settings.italianLevel,  
      contentTypes: [settings.testSection],  
      focusAreas: settings.topics,  
      count: 5 // Default to 5 questions  
    };  
    
    const result = await generateQuestions(params);  

    if (result.error) {  
      setError(result.error);  
      if (onError) {  
        onError(result.error);  
      }  
    } else {  
      setQuestions(result.questions as AIGeneratedQuestion[]);  
      if (onContentGenerated) {  
        onContentGenerated(result.questions as AIGeneratedQuestion[]);  
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
              </li>  
            ))}  
          </ul>  
        </div>  
      )}  
    </div>  
  );  
}  

export default CitizenshipContentProcessor;
