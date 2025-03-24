
import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Upload, Brain, Loader2, AlertTriangle, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAI } from '@/hooks/useAI';
import { ContentType } from '@/utils/textAnalysis';
import AIStatus from '@/components/ai/AIStatus';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AIContentProcessor from '@/components/ai/AIContentProcessor';

const FileUploader = () => {
  const [extractedContent, setExtractedContent] = useState('');
  const [selectedContentType, setSelectedContentType] = useState<ContentType>('multiple-choice');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();
  const { generateQuestions, isProcessing, isModelLoaded } = useAI();

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setExtractedContent(content);
      setShowResults(false);
    };
    reader.readAsText(file);
    
    toast({
      title: "File loaded",
      description: `Successfully loaded file: ${file.name}`,
    });
  }, [toast]);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setExtractedContent(event.target.value);
    setShowResults(false);
  };

  const handleContentTypeChange = (value: ContentType) => {
    setSelectedContentType(value);
    setShowResults(false);
  };

  const handleQuestionsGenerated = (questions: any[]) => {
    setGeneratedQuestions(questions);
    setShowResults(true);
  };

  const clearAll = () => {
    setExtractedContent('');
    setGeneratedQuestions([]);
    setShowResults(false);
    
    toast({
      title: "Content cleared",
      description: "All content and generated questions have been cleared.",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <Helmet>
        <title>AI Question Generator | Admin</title>
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AI Question Generator</h1>
        <AIStatus showDetails={true} />
      </div>

      {!isModelLoaded && (
        <Alert className="mb-6" variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>AI functionality is disabled</AlertTitle>
          <AlertDescription>
            Enable AI in the settings to use advanced question generation features.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Content Source
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
                placeholder="Enter your content here or upload a file..."
                value={extractedContent}
                onChange={handleTextChange}
                className="min-h-[200px]"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
                <Input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".txt,.md,.rtf"
                  onChange={handleFileChange}
                />
              </div>
              <Button 
                variant="outline" 
                onClick={clearAll}
                className="flex-1"
              >
                Clear All
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content-type">Content Type</Label>
              <Select 
                value={selectedContentType} 
                onValueChange={handleContentTypeChange}
              >
                <SelectTrigger id="content-type">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                  <SelectItem value="flashcards">Flashcards</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                  <SelectItem value="speaking">Speaking</SelectItem>
                  <SelectItem value="listening">Listening</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Select the type of questions you want to generate
              </p>
            </div>
            
            {extractedContent && (
              <Alert variant="success" className="mt-4">
                <Check className="h-4 w-4" />
                <AlertTitle>Content Ready</AlertTitle>
                <AlertDescription>
                  {extractedContent.length} characters loaded. The AI can now generate questions from this content.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {extractedContent && (
          <AIContentProcessor 
            content={extractedContent}
            contentType={selectedContentType}
            onQuestionsGenerated={handleQuestionsGenerated}
          />
        )}
      </div>

      {showResults && generatedQuestions.length > 0 && (
        <Card className="w-full mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Generated Questions
            </CardTitle>
            <CardDescription>
              {generatedQuestions.length} questions generated from your content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {generatedQuestions.map((q, index) => (
                <div key={q.id || index} className="border rounded-md p-4">
                  <div className="font-medium mb-2">Question {index + 1}: {q.question}</div>
                  
                  {q.options && (
                    <div className="pl-4 space-y-1 mb-2">
                      {q.options.map((option: string, optIndex: number) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${optIndex === q.correctAnswerIndex ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-100'}`}>
                            {String.fromCharCode(65 + optIndex)}
                          </div>
                          <div>{option}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {q.explanation && (
                    <div className="text-sm text-muted-foreground mt-2 bg-muted/30 p-2 rounded">
                      <span className="font-medium">Explanation:</span> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUploader;
