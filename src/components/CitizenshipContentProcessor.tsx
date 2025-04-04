import React, { useState } from 'react';
import { useAI } from '@/hooks/useAI';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload, FileText, Check, Info, AlertTriangle } from 'lucide-react';
import ConfidenceIndicator from './ai/ConfidenceIndicator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface CitizenshipContentProcessorProps {
  onContentProcessed?: (result: any) => void;
}

export const CitizenshipContentProcessor: React.FC<CitizenshipContentProcessorProps> = ({ 
  onContentProcessed 
}) => {
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState('input');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processedData, setProcessedData] = useState<any>(null);
  const [includeInTraining, setIncludeInTraining] = useState(true);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const { processDocument, isProcessing } = useAI();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    
    // Simulate upload progress
    setIsUploading(true);
    setUploadProgress(0);
    
    const reader = new FileReader();
    
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      }
    };
    
    reader.onload = () => {
      const content = reader.result as string;
      setContent(content);
      setIsUploading(false);
      setUploadProgress(100);
      
      toast({
        title: "File Uploaded",
        description: "Your file has been uploaded successfully. Ready to process.",
      });
    };
    
    reader.onerror = () => {
      setIsUploading(false);
      toast({
        title: "Upload Failed",
        description: "There was an error reading the file.",
        variant: "destructive"
      });
    };
    
    reader.readAsText(file);
  };

  const handleProcessContent = async () => {
    if (!content.trim()) {
      toast({
        title: "Empty Content",
        description: "Please provide some content to process.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to process content.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Simulate upload steps
      setUploadProgress(0);
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(uploadInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await processDocument(content, includeInTraining);
      
      clearInterval(uploadInterval);
      setUploadProgress(100);
      setProcessedData(result);
      
      // Switch to the results tab
      setActiveTab('results');
      
      if (onContentProcessed) {
        onContentProcessed(result);
      }
      
      toast({
        title: "Content Processed",
        description: `Content analyzed as ${result.contentType} with ${result.analysis.confidence * 100}% confidence.`,
      });
    } catch (error: any) {
      toast({
        title: "Processing Failed",
        description: error.message || "Failed to process content. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderContentTypeDescription = (contentType: string) => {
    const descriptions: Record<string, string> = {
      "flashcards": "Vocabulary terms with definitions suitable for flashcard creation",
      "multiple-choice": "Content suitable for creating quiz questions with multiple options",
      "writing": "Essay or writing prompt for practice",
      "speaking": "Pronunciation or conversation practice material",
      "listening": "Audio transcript or listening exercise",
      "reading": "Reading comprehension passage",
      "grammar": "Grammar rules or exercises",
      "citizenship": "Content related specifically to Italian citizenship exam"
    };
    
    return descriptions[contentType] || "General Italian learning content";
  };

  return (
    <Card>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <CardHeader>
          <CardTitle>Italian Content Processor</CardTitle>
          <CardDescription>
            Upload or paste Italian language content to generate learning materials
          </CardDescription>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="input">Input</TabsTrigger>
            <TabsTrigger value="results" disabled={!processedData}>Results</TabsTrigger>
          </TabsList>
        </CardHeader>
        
        <TabsContent value="input">
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your Italian content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-none"
              disabled={isProcessing || isUploading}
            />
            
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="training-data"
                  checked={includeInTraining}
                  onCheckedChange={setIncludeInTraining}
                />
                <Label htmlFor="training-data">
                  Include this content in AI training data
                </Label>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <Button 
                  variant="outline" 
                  className="relative"
                  disabled={isProcessing || isUploading}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload a File
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".txt,.md,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    disabled={isProcessing || isUploading}
                  />
                </Button>
                
                {uploadedFile && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="mr-1 h-4 w-4" />
                    {uploadedFile.name}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              className="w-full"
              disabled={!content.trim() || isProcessing || isUploading}
              onClick={handleProcessContent}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Process Content'
              )}
            </Button>
          </CardFooter>
        </TabsContent>
        
        <TabsContent value="results">
          <CardContent className="space-y-6">
            {processedData ? (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Content Type</h3>
                    <ConfidenceIndicator value={processedData.analysis.confidence * 100} />
                  </div>
                  
                  <div className="p-4 bg-muted rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="mb-2 capitalize">
                          {processedData.contentType}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {renderContentTypeDescription(processedData.contentType)}
                        </p>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {processedData.analysis.difficultyLevel || "intermediate"}
                      </Badge>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-1">
                      {processedData.analysis.topicsDetected?.map((topic: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Generated Questions</h3>
                  <div className="space-y-3">
                    {processedData.questions?.map((question: any, index: number) => (
                      <div key={index} className="p-4 border rounded-md bg-card">
                        <p className="font-medium mb-2">{question.text}</p>
                        
                        {question.type === 'multiple-choice' && question.options && (
                          <div className="space-y-1 ml-2">
                            {question.options.map((option: string, optIndex: number) => (
                              <div key={optIndex} className="flex items-center">
                                <div className={`h-4 w-4 rounded-full border flex items-center justify-center mr-2 ${
                                  option === question.correctAnswer ? 'bg-primary border-primary' : ''
                                }`}>
                                  {option === question.correctAnswer && (
                                    <Check className="h-3 w-3 text-primary-foreground" />
                                  )}
                                </div>
                                <span className="text-sm">{option}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {question.type !== 'multiple-choice' && (
                          <div className="ml-2 mt-1 text-sm text-muted-foreground">
                            <span className="font-medium">Answer:</span> {question.correctAnswer}
                          </div>
                        )}
                        
                        {question.explanation && (
                          <div className="ml-2 mt-2 text-sm flex items-start">
                            <Info className="h-4 w-4 mr-1 mt-0.5 text-muted-foreground" />
                            <span className="text-muted-foreground">{question.explanation}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {(!processedData.questions || processedData.questions.length === 0) && (
                      <div className="p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900/30 rounded-md text-center">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mx-auto mb-2" />
                        <p className="text-sm">No questions could be generated from this content.</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="py-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                <p className="mt-2">Loading results...</p>
                <Progress value={uploadProgress} className="mt-4 w-full max-w-xs mx-auto" />
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-2">
            <Button 
              variant="outline"
              onClick={() => {
                setActiveTab('input');
                setContent('');
                setProcessedData(null);
                setUploadedFile(null);
              }}
            >
              Process New Content
            </Button>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default CitizenshipContentProcessor;
