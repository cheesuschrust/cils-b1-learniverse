
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  Upload, AlertCircle, CheckCircle, FileText, FileAudio, FilePdf, 
  BookOpen, List, Brain, PenSquare, Headphones 
} from 'lucide-react';
import { 
  validateFile, 
  processFileForAITraining, 
  extractTrainingExamples, 
  addContentToAITraining 
} from '@/utils/AITrainingUtils';
import { ContentType } from '@/utils/textAnalysis';
import { useSystemLog } from '@/hooks/use-system-log';

const AITrainingManager = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processedContent, setProcessedContent] = useState<any | null>(null);
  const [contentType, setContentType] = useState<ContentType>('multiple-choice');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState<
    'idle' | 'uploading' | 'processing' | 'extracting' | 'training' | 'complete' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [trainingResults, setTrainingResults] = useState<{
    examplesAdded: number;
    totalExamples: number;
    confidence: number;
    processingTime: number;
  } | null>(null);
  
  const { toast } = useToast();
  const { logAIAction } = useSystemLog();
  
  // Configure dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const selectedFile = acceptedFiles[0];
    const validation = validateFile(selectedFile);
    
    if (!validation.valid) {
      toast({
        title: "Invalid file",
        description: validation.message,
        variant: "destructive"
      });
      return;
    }
    
    setFile(selectedFile);
    setErrorMessage(null);
    setProcessingStep('idle');
    setUploadProgress(0);
    setProcessedContent(null);
    setTrainingResults(null);
  }, [toast]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    maxFiles: 1,
    accept: {
      'text/plain': ['.txt'],
      'application/json': ['.json'],
      'text/markdown': ['.md'],
      'application/pdf': ['.pdf'],
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav'],
      'audio/ogg': ['.ogg']
    }
  });
  
  // Process the file for AI training
  const handleProcessFile = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProcessingStep('uploading');
    setErrorMessage(null);
    setUploadProgress(0);
    
    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(uploadInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);
    
    try {
      // Process file
      setProcessingStep('processing');
      const content = await processFileForAITraining(file, contentType);
      setProcessedContent(content);
      
      // Complete upload simulation
      clearInterval(uploadInterval);
      setUploadProgress(100);
      
      // Extract training examples
      setProcessingStep('extracting');
      const examples = extractTrainingExamples(content);
      
      if (examples.length === 0) {
        throw new Error("No valid training examples could be extracted from the file");
      }
      
      // Train AI with extracted examples
      setProcessingStep('training');
      const totalExamples = await addContentToAITraining(content, examples);
      
      // Log successful training
      logAIAction(
        'ai_training_completed',
        `Successfully added ${examples.length} examples for ${contentType} training`
      );
      
      // Show results
      setTrainingResults({
        examplesAdded: examples.length,
        totalExamples,
        confidence: content.metadata.confidence + (examples.length > 5 ? 3 : 1),
        processingTime: content.metadata.processingTime
      });
      
      setProcessingStep('complete');
      
      toast({
        title: "Training Complete",
        description: `Successfully added ${examples.length} training examples`,
      });
      
    } catch (error) {
      clearInterval(uploadInterval);
      setProcessingStep('error');
      setErrorMessage(error.message || "An error occurred during processing");
      
      logAIAction(
        'ai_training_failed',
        `Error processing file ${file.name}: ${error.message}`,
        'error'
      );
      
      toast({
        title: "Processing Error",
        description: error.message || "Failed to process file",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const resetState = () => {
    setFile(null);
    setProcessedContent(null);
    setErrorMessage(null);
    setProcessingStep('idle');
    setUploadProgress(0);
    setTrainingResults(null);
  };
  
  // Get icon for content type
  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'flashcards':
        return <BookOpen className="h-4 w-4" />;
      case 'multiple-choice':
        return <List className="h-4 w-4" />;
      case 'writing':
        return <PenSquare className="h-4 w-4" />;
      case 'speaking':
        return <Headphones className="h-4 w-4" />;
      case 'listening':
        return <Headphones className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };
  
  // Get icon for file type
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('audio/')) {
      return <FileAudio className="h-8 w-8 text-blue-500" />;
    } else if (file.type === 'application/pdf') {
      return <FilePdf className="h-8 w-8 text-red-500" />;
    } else {
      return <FileText className="h-8 w-8 text-green-500" />;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Training Manager
        </CardTitle>
        <CardDescription>
          Upload content to train the AI system and improve confidence scores
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="upload">Upload Content</TabsTrigger>
            <TabsTrigger value="results">Training Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            {/* Content Type Selection */}
            <div className="mb-4">
              <label className="text-sm font-medium mb-1 block">Content Type</label>
              <div className="flex flex-wrap gap-2">
                {['multiple-choice', 'flashcards', 'writing', 'speaking', 'listening'].map((type) => (
                  <Badge 
                    key={type}
                    variant={contentType === type ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setContentType(type as ContentType)}
                  >
                    {getContentTypeIcon(type as ContentType)}
                    <span className="ml-1 capitalize">{type.replace('-', ' ')}</span>
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* File Upload Area */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? "border-primary bg-primary/10" 
                  : "border-border hover:border-primary/50 hover:bg-secondary/50"
              }`}
            >
              <input {...getInputProps()} />
              
              {file ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center">
                    {getFileIcon(file)}
                  </div>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetState();
                    }}
                  >
                    Select Different File
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto" />
                  <div>
                    <p className="font-medium">Drop your file here or click to browse</p>
                    <p className="text-sm text-muted-foreground">
                      Supports .txt, .json, .md, .pdf, .mp3, .wav, and .ogg files
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Processing Status */}
            {processingStep !== 'idle' && (
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-sm">
                  <span>Processing Status</span>
                  <span className="capitalize">{processingStep}</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
                
                {processingStep === 'error' && errorMessage && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}
                
                {processingStep === 'complete' && (
                  <Alert className="mt-2 border-green-500 text-green-500">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Complete</AlertTitle>
                    <AlertDescription>
                      Training completed successfully.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4">
            {trainingResults ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-secondary/30 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold">{trainingResults.examplesAdded}</div>
                    <div className="text-sm text-muted-foreground">Examples Added</div>
                  </div>
                  <div className="bg-secondary/30 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold">{trainingResults.totalExamples}</div>
                    <div className="text-sm text-muted-foreground">Total Examples</div>
                  </div>
                  <div className="bg-secondary/30 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold">{trainingResults.confidence}%</div>
                    <div className="text-sm text-muted-foreground">Confidence</div>
                  </div>
                  <div className="bg-secondary/30 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold">{(trainingResults.processingTime / 1000).toFixed(2)}s</div>
                    <div className="text-sm text-muted-foreground">Processing Time</div>
                  </div>
                </div>
                
                <Alert className="bg-primary/10 border-primary">
                  <Brain className="h-4 w-4 text-primary" />
                  <AlertTitle>AI Training Impact</AlertTitle>
                  <AlertDescription>
                    The AI model has been enhanced with new examples for {contentType} content. 
                    This should improve performance for similar content going forward.
                  </AlertDescription>
                </Alert>
                
                {processedContent && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Processed File Details</h4>
                    <div className="text-sm bg-muted p-3 rounded-md">
                      <div><strong>Filename:</strong> {processedContent.metadata.filename}</div>
                      <div><strong>File Size:</strong> {(processedContent.metadata.filesize / 1024).toFixed(1)} KB</div>
                      <div><strong>Content Type:</strong> <span className="capitalize">{contentType.replace('-', ' ')}</span></div>
                      <div><strong>Language:</strong> <span className="capitalize">{processedContent.metadata.language}</span></div>
                      <div><strong>Processed At:</strong> {processedContent.metadata.uploadedAt.toLocaleString()}</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No training results available yet</p>
                <p className="text-sm">Upload and process a file to see results</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="ghost" onClick={resetState}>Reset</Button>
        <Button 
          onClick={handleProcessFile}
          disabled={!file || isProcessing || processingStep === 'complete'}
        >
          {isProcessing ? (
            <>Processing...</>
          ) : processingStep === 'complete' ? (
            <>Complete</>
          ) : (
            <>Process & Train</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AITrainingManager;
