
import React, { useState } from 'react';
import { useAIUtils } from '../hooks/useAIUtils';
import {
  ItalianLevel,
  ItalianTestSection,
  AIGeneratedQuestion,
  QuestionGenerationParams
} from '../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

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

// Named export function
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
    <Card className="citizenship-content-processor">  
      <CardHeader>
        <CardTitle>Italian Citizenship Test Question Generator</CardTitle>
        <CardDescription>Generate practice questions for Italian citizenship test preparation</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="settings-summary space-y-2 mb-4">  
          <p><strong>Level:</strong> {settings.italianLevel}</p>  
          <p><strong>Section:</strong> {settings.testSection}</p>  
          <p><strong>Citizenship Focus:</strong> {settings.isCitizenshipFocused ? 'Yes' : 'No'}</p>  
          <p><strong>Topics:</strong> {settings.topics.join(', ') || 'All topics'}</p>  
        </div>  
        
        <Button   
          onClick={handleGenerate}   
          disabled={isGenerating}  
          className="w-full"  
        >  
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generando...
            </>
          ) : 'Genera Domande'}  
        </Button>  
        
        {error && (  
          <div className="error-message mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">  
            Errore: {error}  
          </div>  
        )}  
        
        {questions.length > 0 && (  
          <div className="generated-questions mt-6">  
            <h3 className="text-lg font-medium mb-4">Domande Generate</h3>  
            <ul className="question-list space-y-6">  
              {questions.map(question => (  
                <li key={question.id} className="question-item p-4 border rounded-md">  
                  <p className="question-text font-medium mb-3">{question.text}</p>  
                  {question.options && (  
                    <ul className="question-options space-y-2 mb-4">  
                      {question.options.map((option, index) => (  
                        <li key={index} className="option-item p-2 bg-gray-50 rounded">  
                          {String.fromCharCode(65 + index)}. {option}  
                        </li>  
                      ))}  
                    </ul>  
                  )}  
                  <p className="correct-answer text-green-600 font-medium">Risposta Corretta: {question.correctAnswer}</p>  
                  {question.explanation && (  
                    <p className="explanation mt-2 text-gray-600 text-sm">{question.explanation}</p>  
                  )}  
                  {question.isCitizenshipRelevant && (  
                    <div className="citizenship-badge mt-2 inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">  
                      Pertinente per il test di cittadinanza  
                    </div>  
                  )}  
                </li>  
              ))}  
            </ul>  
          </div>  
        )}  
      </CardContent>
    </Card>
  );  
}  

export default CitizenshipContentProcessor;
