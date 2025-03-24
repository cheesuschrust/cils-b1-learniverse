import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Brain, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAI } from '@/hooks/useAI';
import { ContentType } from '@/utils/textAnalysis';

interface AIContentProcessorProps {
  content: string;
  contentType: ContentType | "multipleChoice";
  onQuestionsGenerated: (questions: any[]) => void;
}

const AIContentProcessor: React.FC<AIContentProcessorProps> = ({ content, contentType, onQuestionsGenerated }) => {
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { generateQuestions } = useAI();

  const handleGenerateQuestions = useCallback(async () => {
    setIsLoading(true);
    try {
      // Convert content type if needed
      const contentTypeForAPI: ContentType = 
        contentType === "multipleChoice" ? "multiple-choice" : 
        contentType as ContentType;

      const generatedQuestions = await generateQuestions(
        content,
        contentTypeForAPI,
        questionCount,
        difficulty
      );

      onQuestionsGenerated(generatedQuestions);
      toast({
        title: "Questions Generated",
        description: `Successfully generated ${questionCount} questions.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate questions.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [content, contentType, questionCount, difficulty, generateQuestions, onQuestionsGenerated, toast]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Content Processor
        </CardTitle>
        <CardDescription>
          Generate questions from the provided content using AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-2">
          <Label htmlFor="questionCount">Number of Questions</Label>
          <Input
            type="number"
            id="questionCount"
            defaultValue={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="col-span-3"
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select onValueChange={(value: any) => setDifficulty(value)}>
            <SelectTrigger id="difficulty">
              <SelectValue placeholder={difficulty} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleGenerateQuestions} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Generate Questions
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIContentProcessor;
