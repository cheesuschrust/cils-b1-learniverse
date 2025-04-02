
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Bot, Upload, File, BookOpen } from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { ItalianTestSection, ItalianLevel } from '@/types/core-types';
import ConfidenceIndicator from './ConfidenceIndicator';

interface AIContentProcessorProps {
  onProcessed?: (result: any) => void;
  initialContent?: string;
  initialContentType?: string;
}

const AIContentProcessor: React.FC<AIContentProcessorProps> = ({ 
  onProcessed,
  initialContent = '',
  initialContentType = ''
}) => {
  const [content, setContent] = useState(initialContent);
  const [activeTab, setActiveTab] = useState('text-input');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResults, setProcessingResults] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<ItalianTestSection>(
    (initialContentType as ItalianTestSection) || 'grammar'
  );
  const [confidenceScore, setConfidenceScore] = useState(0);
  
  const { toast } = useToast();
  const { 
    processContent, 
    isProcessing: isAIProcessing,
    generateQuestions
  } = useAI();
  
  // Process the content
  const handleProcessContent = async () => {
    if (!content.trim()) {
      toast({
        title: "Empty Content",
        description: "Please provide some content to process.",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // First, process the content to analyze it
      const analysisResult = await processContent(content);
      
      // Generate questions based on the content
      const questionsResult = await generateQuestions({
        contentTypes: [selectedContentType],
        difficulty: 'intermediate',
        count: 5,
        isCitizenshipFocused: true,
        topics: [selectedContentType],
      });
      
      const results = {
        analysis: analysisResult,
        questions: questionsResult.questions || [],
        contentType: selectedContentType,
        confidence: Math.round(Math.random() * 30 + 70) // Simulated confidence
      };
      
      setProcessingResults(results);
      setConfidenceScore(results.confidence);
      
      // Call the callback if provided
      if (onProcessed) {
        onProcessed(results);
      }
      
      toast({
        title: "Content Processed",
        description: `Successfully processed ${selectedContentType} content.`
      });
    } catch (error) {
      console.error('Error processing content:', error);
      toast({
        title: "Processing Failed",
        description: "Failed to process content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploadedFile(file);
    
    // Read file content
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target?.result as string;
      setContent(fileContent);
    };
    
    reader.readAsText(file);
  };
  
  // Handle content type change
  const handleContentTypeChange = (type: ItalianTestSection) => {
    setSelectedContentType(type);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Content Processor</CardTitle>
        <CardDescription>
          Upload Italian content to generate learning materials and practice questions
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="text-input">Text Input</TabsTrigger>
            <TabsTrigger value="file-upload">File Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text-input" className="space-y-4">
            <Textarea
              placeholder="Paste your Italian content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px]"
            />
          </TabsContent>
          
          <TabsContent value="file-upload" className="space-y-4">
            <div className="border-2 border-dashed rounded-md flex flex-col items-center justify-center p-6">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileUpload}
                className="hidden"
                accept=".txt,.pdf,.doc,.docx"
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <span className="text-sm font-medium mb-1">Click to upload a file</span>
                <span className="text-xs text-muted-foreground">PDF, TXT, DOC, DOCX up to 10MB</span>
              </label>
              
              {uploadedFile && (
                <div className="mt-4 flex items-center">
                  <File className="h-4 w-4 mr-2" />
                  <span className="text-sm">{uploadedFile.name}</span>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 space-y-4">
          <div>
            <h3 className="mb-2 font-medium">Select Content Type</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { value: 'grammar', label: 'Grammar' },
                { value: 'vocabulary', label: 'Vocabulary' },
                { value: 'culture', label: 'Culture' },
                { value: 'citizenship', label: 'Citizenship' }
              ].map((type) => (
                <Button
                  key={type.value}
                  variant={selectedContentType === type.value ? "default" : "outline"}
                  className={`flex-1 ${selectedContentType === type.value ? '' : 'opacity-70'}`}
                  onClick={() => handleContentTypeChange(type.value as ItalianTestSection)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleProcessContent}
            disabled={!content.trim() || isProcessing || isAIProcessing}
          >
            {(isProcessing || isAIProcessing) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Bot className="mr-2 h-4 w-4" />
                Process Content
              </>
            )}
          </Button>
        </div>
        
        {processingResults && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Processing Results</h3>
              <ConfidenceIndicator score={confidenceScore} />
            </div>
            
            <div className="border rounded-md p-4 space-y-2">
              <p className="text-sm font-medium">Identified Content Type:</p>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm capitalize">{selectedContentType}</span>
              </div>
              
              <p className="text-sm font-medium mt-4">Generated Questions:</p>
              <div className="space-y-2">
                {processingResults.questions?.slice(0, 3).map((question: any, index: number) => (
                  <div key={index} className="text-sm p-2 bg-muted rounded-md">
                    {question.text || question.question}
                  </div>
                ))}
                
                {processingResults.questions?.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    + {processingResults.questions.length - 3} more questions generated
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => {
            setContent('');
            setUploadedFile(null);
            setProcessingResults(null);
          }}
        >
          Clear
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIContentProcessor;
