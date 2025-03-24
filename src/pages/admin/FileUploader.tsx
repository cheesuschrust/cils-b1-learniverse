import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Upload, Brain, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAI } from '@/hooks/useAI';
import { ContentType } from '@/utils/textAnalysis';

const FileUploader = () => {
  const [extractedContent, setExtractedContent] = useState('');
  const [selectedContentType, setSelectedContentType] = useState<"flashcards" | "multipleChoice" | "writing" | "speaking" | "listening">("multipleChoice");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { generateQuestions, isProcessing } = useAI();

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setExtractedContent(content);
    };
    reader.readAsText(file);
  }, []);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setExtractedContent(event.target.value);
  };

  const handleGenerateQuestions = async () => {
    if (!extractedContent) {
      toast({
        title: "Missing Content",
        description: "Please upload a file or enter text to generate questions.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Convert content type if needed
      const contentTypeForAPI: ContentType = 
        selectedContentType === "multipleChoice" ? "multiple-choice" : 
        selectedContentType as ContentType;

      const questions = await generateQuestions(
        extractedContent,
        contentTypeForAPI,
        5,
        "Intermediate"
      );

      toast({
        title: "Questions Generated",
        description: `Successfully generated questions for ${selectedContentType}.`,
      });
    } catch (error) {
      toast({
        title: "Error Generating Questions",
        description: "Failed to generate questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Helmet>
        <title>AI Question Generator | Admin</title>
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AI Question Generator</h1>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Generate Questions from File
          </CardTitle>
          <CardDescription>
            Upload a text file or enter text to generate questions using AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Enter your content here..."
              value={extractedContent}
              onChange={handleTextChange}
              className="min-h-[100px]"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </div>
            </Label>
            <Input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
            />
            {extractedContent && (
              <FileText className="h-4 w-4 text-green-500" />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content-type">Content Type</Label>
            <Select onValueChange={(value: any) => setSelectedContentType(value)}>
              <SelectTrigger id="content-type">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multipleChoice">Multiple Choice</SelectItem>
                <SelectItem value="flashcards">Flashcards</SelectItem>
                <SelectItem value="writing">Writing</SelectItem>
                <SelectItem value="speaking">Speaking</SelectItem>
                <SelectItem value="listening">Listening</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGenerateQuestions}
            disabled={isGenerating || isProcessing}
          >
            {isGenerating || isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Questions"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUploader;
