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
  contentType: ContentType;
  onQuestionsGenerated: (questions: any[]) => void;
}

const AIContentProcessor: React.FC<AIContentProcessorProps> = ({ 
  content, 
  contentType, 
  onQuestionsGenerated 
}) => {
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editableContent, setEditableContent] = useState<string>(content);
  
  const { toast } = useToast();
  const { generateQuestions } = useAI();

  // Update editable content when props content changes
  React.useEffect(() => {
    setEditableContent(content);
  }, [content]);

  const handleGenerateQuestions = useCallback(async () => {
    if (!editableContent.trim()) {
      toast({
        title: "Empty Content",
        description: "Please provide some content to generate questions from.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Convert content type if needed
      const contentTypeForAPI: ContentType = contentType;

      // Updated to only use three arguments instead of four
      const generatedQuestions = await generateQuestions(
        editableContent,
        contentTypeForAPI,
        { 
          count: questionCount, 
          difficulty: difficulty 
        }
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
  }, [editableContent, contentType, questionCount, difficulty, generateQuestions, onQuestionsGenerated, toast]);

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
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            placeholder="Enter text to generate questions from..."
            value={editableContent}
            onChange={(e) => setEditableContent(e.target.value)}
            className="min-h-[150px]"
          />
          <p className="text-xs text-muted-foreground">
            Enter the text content you want to analyze and generate questions from.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="questionCount">Number of Questions</Label>
            <Input
              type="number"
              id="questionCount"
              value={questionCount}
              onChange={(e) => setQuestionCount(Math.max(1, Math.min(20, Number(e.target.value))))}
            />
            <p className="text-xs text-muted-foreground">
              Number of questions to generate (1-20)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select 
              value={difficulty} 
              onValueChange={(value: "Beginner" | "Intermediate" | "Advanced") => setDifficulty(value)}
            >
              <SelectTrigger id="difficulty">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select the difficulty level for generated questions
            </p>
          </div>
        </div>

        <div className="pt-4">
          <Button
            onClick={handleGenerateQuestions}
            disabled={isLoading || !editableContent.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Generate Questions
              </>
            )}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground mt-2">
          <p className="flex items-center">
            <FileText className="h-3 w-3 mr-1" />
            Content type: {contentType.replace('-', ' ')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIContentProcessor;
