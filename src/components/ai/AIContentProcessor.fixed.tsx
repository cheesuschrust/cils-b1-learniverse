
import React, { useState } from 'react';  
import { useAIUtils } from '../../hooks/useAIUtils';  
import {   
  AIContentProcessorProps,  
  AIQuestion,  
  QuestionGenerationParams  
} from '../../types/app-types';  

export function AIContentProcessor({  
  settings,  
  onContentGenerated,  
  onError  
}: AIContentProcessorProps) {  
  const { generateQuestions, isGenerating } = useAIUtils();  
  const [questions, setQuestions] = useState<AIQuestion[]>([]);  
  const [error, setError] = useState<string | null>(null);  

  const handleGenerate = async () => {  
    setError(null);  
    
    // Create properly typed params object  
    const params: QuestionGenerationParams = {  
      language: settings.language,  
      difficulty: settings.difficulty,  
      contentTypes: settings.contentTypes,  
      focusAreas: settings.focusAreas || [],  
      count: 5 // Default to 5 questions  
    };  
    
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
  };  

  return (  
    <div className="ai-content-processor">  
      <h2>Italian Content Generator</h2>  
      
      <div className="settings-summary">  
        <p>Language: {settings.language}</p>  
        <p>Level: {settings.difficulty}</p>  
        <p>Content Types: {settings.contentTypes.join(', ')}</p>  
        {settings.focusAreas && settings.focusAreas.length > 0 && (  
          <p>Focus Areas: {settings.focusAreas.join(', ')}</p>  
        )}  
      </div>  
      
      <button   
        onClick={handleGenerate}   
        disabled={isGenerating}  
        className="generate-button"  
      >  
        {isGenerating ? 'Generating...' : 'Generate Content'}  
      </button>  
      
      {error && (  
        <div className="error-message">  
          Error: {error}  
        </div>  
      )}  
      
      {questions.length > 0 && (  
        <div className="generated-questions">  
          <h3>Generated Questions</h3>  
          <ul>  
            {questions.map(question => (  
              <li key={question.id}>  
                <p><strong>{question.text}</strong></p>  
                {question.options && (  
                  <ul>  
                    {question.options.map((option, index) => (  
                      <li key={index}>{option}</li>  
                    ))}  
                  </ul>  
                )}  
                <p>Correct Answer: {question.correctAnswer}</p>  
                {question.explanation && <p>Explanation: {question.explanation}</p>}  
              </li>  
            ))}  
          </ul>  
        </div>  
      )}  
    </div>  
  );  
}  

export default AIContentProcessor;
