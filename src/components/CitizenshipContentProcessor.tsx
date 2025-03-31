
import React, { useState } from 'react';
import { useItalianAI } from '../contexts/ItalianAIContext';
import {
  CitizenshipContentProps,
  AIGeneratedQuestion,
  QuestionGenerationParams
} from '../types/type-definitions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

export function CitizenshipContentProcessor({
  settings,
  onContentGenerated,
  onError
}: CitizenshipContentProps) {
  const { generateQuestions, isGenerating } = useItalianAI();
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
    <Card>
      <CardHeader>
        <CardTitle>Italian Citizenship Test Question Generator</CardTitle>
        <CardDescription>Generate practice questions for Italian citizenship exam preparation</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="settings-summary mb-6 p-4 bg-muted rounded-md">
          <p><strong>Level:</strong> {settings.italianLevel}</p>
          <p><strong>Section:</strong> {settings.testSection}</p>
          <p><strong>Citizenship Focus:</strong> {settings.isCitizenshipFocused ? 'Yes' : 'No'}</p>
          <p><strong>Topics:</strong> {settings.topics.length > 0 ? settings.topics.join(', ') : 'All topics'}</p>
        </div>
        
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full mb-4"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generando...
            </>
          ) : 'Genera Domande'}
        </Button>
        
        {error && (
          <div className="error-message p-4 border border-destructive text-destructive bg-destructive/10 rounded-md mb-4">
            Errore: {error}
          </div>
        )}
        
        {questions.length > 0 && (
          <div className="generated-questions">
            <h3 className="text-lg font-medium mb-4">Domande Generate</h3>
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="question-item border rounded-lg p-4 bg-card">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-md">{index + 1}. {question.text}</h4>
                    {question.isCitizenshipRelevant && (
                      <Badge className="ml-2" variant="outline">Citizenship Test</Badge>
                    )}
                  </div>
                  
                  {question.options && (
                    <ul className="space-y-2 my-3">
                      {question.options.map((option, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="inline-block w-6 h-6 rounded-full bg-muted flex items-center justify-center mr-2 text-xs font-medium">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  <Separator className="my-3" />
                  
                  <div>
                    <p className="font-medium">Risposta Corretta: <span className="text-primary">{question.correctAnswer}</span></p>
                    {question.explanation && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        <strong>Spiegazione:</strong> {question.explanation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
