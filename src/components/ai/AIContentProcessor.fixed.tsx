
import React, { useState } from 'react';  
import { useAI } from '@/hooks/useAI';  
import { 
  AIGeneratedQuestion,
  AISettings,
  ItalianTestSection,
  ItalianQuestionGenerationParams
} from '@/types/ai';  

export interface AIContentProcessorProps {  
  content?: string;
  contentType?: string;
  defaultLanguage?: string;
  settings?: AISettings;
  onContentGenerated?: (content: any) => void;  
  onError?: (error: Error) => void;
  onQuestionsGenerated?: (questions: AIGeneratedQuestion[]) => void;
}

export function AIContentProcessor({  
  content = "",
  contentType = "reading",
  settings = {
    model: "gpt-4o",
    temperature: 0.7,
    maxTokens: 1024,
    topP: 0.9,
    frequencyPenalty: 0,
    presencePenalty: 0,
    language: "italian",
    difficulty: "intermediate",
    contentTypes: ["grammar"],
    focusAreas: []
  },
  onContentGenerated,  
  onError,
  onQuestionsGenerated = () => {}
}: AIContentProcessorProps) {  
  const { generateQuestions, isProcessing } = useAI();  
  const [questions, setQuestions] = useState<AIGeneratedQuestion[]>([]);  
  const [error, setError] = useState<string | null>(null);  

  const handleGenerate = async () => {  
    setError(null);  
    
    // Create properly typed params object by adapting to Italian types  
    const params: ItalianQuestionGenerationParams = {  
      difficulty: settings.difficulty as any,
      topics: settings.focusAreas || [],
      count: 5, // Default to 5 questions
      contentTypes: settings.contentTypes as ItalianTestSection[],
      isCitizenshipFocused: false
    };  
    
    try {
      const result = await generateQuestions(params);  

      if (result && result.error) {  
        setError(result.error);  
        if (onError) {  
          onError(new Error(result.error));  
        }  
      } else {  
        setQuestions(result);
        if (onContentGenerated) {  
          onContentGenerated(result);  
        }
        if (onQuestionsGenerated) {
          onQuestionsGenerated(result);
        }
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error';
      setError(errorMessage);
      if (onError) {
        onError(new Error(errorMessage));
      }
    }  
  };  

  return (  
    <div className="ai-content-processor">  
      <h2>Italian Content Generator</h2>  
      
      <div className="settings-summary">  
        <p>Language: {settings.language}</p>  
        <p>Level: {settings.difficulty}</p>  
        <p>Content Types: {settings.contentTypes?.join(', ')}</p>  
        {settings.focusAreas && settings.focusAreas.length > 0 && (  
          <p>Focus Areas: {settings.focusAreas.join(', ')}</p>  
        )}  
      </div>  
      
      <button   
        onClick={handleGenerate}   
        disabled={isProcessing}  
        className="generate-button"  
      >  
        {isProcessing ? 'Generating...' : 'Generate Content'}  
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
