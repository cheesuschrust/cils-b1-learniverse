
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAI } from '@/hooks/useAI';
import { 
  AIGeneratedQuestion, 
  ItalianLevel 
} from '@/types/italian-types';
import { Loader2 } from 'lucide-react';
import ConfidenceIndicator from './ai/ConfidenceIndicator';

interface CitizenshipContentProcessorProps {
  initialContent?: string;
  level?: ItalianLevel;
}

export const CitizenshipContentProcessor: React.FC<CitizenshipContentProcessorProps> = ({ 
  initialContent = '', 
  level = 'intermediate' 
}) => {
  const [content, setContent] = useState<string>(initialContent);
  const [selectedLevel, setSelectedLevel] = useState<ItalianLevel>(level);
  const [questions, setQuestions] = useState<AIGeneratedQuestion[]>([]);
  const { generateQuestions, isGenerating } = useAI();

  const handleGenerateQuestions = async () => {
    if (!content.trim()) return;
    
    try {
      const result = await generateQuestions({
        contentTypes: ['culture'],
        difficulty: selectedLevel,
        count: 5,
        isCitizenshipFocused: true,
        language: 'italian'
      });
      
      if (result && result.questions) {
        setQuestions(result.questions);
      }
    } catch (error) {
      console.error('Error generating citizenship questions:', error);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="italian-content">Paste Italian text related to citizenship</Label>
          <Textarea 
            id="italian-content"
            placeholder="Paste Italian content here to generate practice questions..." 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="resize-none"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Difficulty Level</Label>
          <RadioGroup 
            value={selectedLevel} 
            onValueChange={(value) => setSelectedLevel(value as ItalianLevel)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="beginner" id="level-beginner" />
              <Label htmlFor="level-beginner">Beginner</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="intermediate" id="level-intermediate" />
              <Label htmlFor="level-intermediate">Intermediate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="advanced" id="level-advanced" />
              <Label htmlFor="level-advanced">Advanced</Label>
            </div>
          </RadioGroup>
        </div>
        
        <Button 
          onClick={handleGenerateQuestions}
          disabled={isGenerating || !content.trim()}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Citizenship Questions'
          )}
        </Button>
        
        {questions.length > 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-medium">Generated Questions</h3>
            
            {questions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">Question {index + 1}:</p>
                  <ConfidenceIndicator score={0.75 + (index * 0.05)} />
                </div>
                <p className="mb-4">{question.text}</p>
                
                <div className="space-y-2">
                  {question.options?.map((option, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full border ${option === question.correctAnswer ? 'bg-primary border-primary' : 'border-gray-300'}`} />
                      <span className={option === question.correctAnswer ? 'font-medium' : ''}>{option}</span>
                    </div>
                  ))}
                </div>
                
                {question.explanation && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p className="font-medium">Explanation:</p>
                    <p>{question.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Also export as default
export default CitizenshipContentProcessor;
