import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ListPlus } from 'lucide-react';
import { useAIUtils } from '@/hooks/useAIUtils';
import { AIGeneratedQuestion } from '@/types/italian-types';
import { mapToItalianTypes } from '@/types/italian-types';

interface CitizenshipContentProcessorProps {
  onQuestionsGenerated?: (questions: AIGeneratedQuestion[]) => void;
  defaultContent?: string;
  settings?: any; // Add settings prop
  onContentGenerated?: (questions: AIGeneratedQuestion[]) => void; // Add alias for onQuestionsGenerated
}

export const CitizenshipContentProcessor: React.FC<CitizenshipContentProcessorProps> = ({ 
  onQuestionsGenerated,
  defaultContent = "",
  settings,
  onContentGenerated
}) => {
  const [content, setContent] = useState(defaultContent);
  const [isProcessing, setIsProcessing] = useState(false);
  const [questions, setQuestions] = useState<AIGeneratedQuestion[]>([]);
  const { toast } = useToast();
  const { generateQuestions } = useAIUtils();
  
  useEffect(() => {
    if (defaultContent) {
      setContent(defaultContent);
    }
  }, [defaultContent]);
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  
  const handleGenerateQuestions = async () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter or paste Italian text to generate questions.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const result = await generateQuestions({
        contentTypes: ['culture', 'vocabulary', 'grammar'],
        difficulty: 'intermediate',
        count: 5,
        isCitizenshipFocused: true,
        language: 'italian',
        ...(settings || {}) // Merge any provided settings
      });
      
      const generatedQuestions = result.questions.map(q => ({
        ...q,
        type: mapToItalianTypes(q.type)
      })) as AIGeneratedQuestion[];
      
      setQuestions(generatedQuestions);
      
      // Handle both callback props for compatibility
      if (onQuestionsGenerated) {
        onQuestionsGenerated(generatedQuestions);
      }
      
      if (onContentGenerated) {
        onContentGenerated(generatedQuestions);
      }
      
      toast({
        title: "Questions Generated",
        description: `Successfully created ${generatedQuestions.length} citizenship practice questions.`,
      });
      
    } catch (error) {
      console.error("Error generating questions:", error);
      toast({
        title: "Generation Error",
        description: "Failed to generate citizenship questions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <ListPlus className="h-5 w-5" />
          Italian Citizenship Question Generator
        </CardTitle>
        <CardDescription>
          Paste Italian text to generate citizenship test practice questions
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Textarea 
          value={content}
          onChange={handleContentChange}
          placeholder="Paste Italian text here (articles about Italian history, culture, or civics work best)..."
          className="min-h-[150px] font-mono text-sm"
          disabled={isProcessing}
        />
        
        {questions.length > 0 && (
          <div className="border rounded-md p-3 bg-muted/30">
            <h3 className="font-medium mb-2">Preview ({questions.length} questions generated)</h3>
            <ul className="space-y-2 list-disc pl-5">
              {questions.slice(0, 3).map((q, index) => (
                <li key={index} className="text-sm">
                  <span className="font-medium">{q.text.substring(0, 60)}...</span>
                </li>
              ))}
              {questions.length > 3 && (
                <li className="text-sm text-muted-foreground">
                  + {questions.length - 3} more questions
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button
          onClick={handleGenerateQuestions}
          disabled={isProcessing || !content.trim()}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Questions...
            </>
          ) : (
            'Generate Citizenship Questions'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CitizenshipContentProcessor;
