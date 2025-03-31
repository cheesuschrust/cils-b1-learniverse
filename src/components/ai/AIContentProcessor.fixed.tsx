
import React, { useState } from 'react';  
import { useAIUtils } from '../../hooks/useAIUtils';  
import { 
  AIContentProcessorProps,
  AIContentSettings
} from '../../types/app-types';  
import { 
  AIGeneratedQuestion,
  ItalianTestSection
} from '../../types/italian-types';

export function AIContentProcessor({  
  content = "",
  contentType = "reading",
  settings = {
    language: "italian",
    difficulty: "intermediate",
    contentTypes: ["grammar"],
    focusAreas: []
  },
  onContentGenerated,  
  onError,
  onQuestionsGenerated = () => {}
}: AIContentProcessorProps) {  
  const { generateQuestions, isGenerating } = useAIUtils();  
  const [questions, setQuestions] = useState<AIGeneratedQuestion[]>([]);  
  const [error, setError] = useState<string | null>(null);  

  const handleGenerate = async () => {  
    setError(null);  
    
    // Create properly typed params object by adapting to Italian types  
    const params = {  
      italianLevel: settings.difficulty as any,
      testSection: settings.contentTypes[0] as ItalianTestSection,
      isCitizenshipFocused: false,
      topics: settings.focusAreas,
      count: 5, // Default to 5 questions
      contentTypes: settings.contentTypes as ItalianTestSection[]
    };  
    
    try {
      const result = await generateQuestions(params);  

      if (result.error) {  
        setError(result.error);  
        if (onError) {  
          onError(result.error);  
        }  
      } else {  
        const typedQuestions = result.questions as unknown as AIGeneratedQuestion[];
        setQuestions(typedQuestions);
        if (onContentGenerated) {  
          onContentGenerated(typedQuestions);  
        }
        if (onQuestionsGenerated) {
          onQuestionsGenerated(typedQuestions);
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
