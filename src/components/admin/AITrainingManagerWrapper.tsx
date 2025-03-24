
import React from 'react';
import { Upload, FileText, Music, Book } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useDropzone } from 'react-dropzone';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { validateFile, SUPPORTED_FORMATS, MAX_FILE_SIZE, processFileForAITraining, extractTrainingExamples, addContentToAITraining } from '@/utils/AITrainingUtils';
import { useState } from 'react';
import { ContentType } from '@/utils/textAnalysis';

// Fixed component that doesn't reference FilePdf and SystemTester components
const AITrainingManagerWrapper = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'manage'>('upload');
  const [selectedContentType, setSelectedContentType] = useState<ContentType>('multiple-choice');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [trainingExamples, setTrainingExamples] = useState<any[]>([]);
  const [trainingStats, setTrainingStats] = useState({
    totalExamples: 0,
    successfulExamples: 0,
    failedExamples: 0
  });
  
  const { toast } = useToast();
  
  const onDrop = async (acceptedFiles: File[]) => {
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
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);
    
    try {
      // Process the file for AI training
      const processedContent = await processFileForAITraining(selectedFile, selectedContentType);
      
      // Extract training examples
      const examples = extractTrainingExamples(processedContent);
      setTrainingExamples(examples);
      
      setUploadProgress(100);
      toast({
        title: "File processed successfully",
        description: `Extracted ${examples.length} training examples`,
      });
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Processing error",
        description: error instanceof Error ? error.message : "Failed to process file",
        variant: "destructive"
      });
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
    }
  };
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/json': ['.json'],
      'text/markdown': ['.md'],
      'application/pdf': ['.pdf'],
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav']
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false
  });
  
  const handleContentTypeChange = (type: string) => {
    setSelectedContentType(type as ContentType);
  };
  
  const handleAddToTraining = async () => {
    if (trainingExamples.length === 0) {
      toast({
        title: "No examples",
        description: "Please upload and process a file first",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const totalCount = await addContentToAITraining(
        {
          id: 'temp-id',
          content: '',
          contentType: selectedContentType,
          format: file?.type || 'text/plain',
          metadata: {
            filename: file?.name || 'unknown',
            filesize: file?.size || 0,
            uploadedAt: new Date(),
            processingTime: 0,
            confidence: 0,
            language: 'english'
          }
        },
        trainingExamples
      );
      
      setTrainingStats({
        totalExamples: totalCount,
        successfulExamples: trainingExamples.length,
        failedExamples: 0
      });
      
      toast({
        title: "Training examples added",
        description: `Added ${trainingExamples.length} examples to the training dataset`
      });
    } catch (error) {
      console.error("Error adding training examples:", error);
      toast({
        title: "Training error",
        description: error instanceof Error ? error.message : "Failed to add training examples",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const getFileIcon = () => {
    if (!file) return <Upload size={40} />;
    
    if (file.type.includes('audio')) {
      return <Music size={40} />;
    } else if (file.type.includes('pdf')) {
      return <FileText size={40} />;
    } else {
      return <Book size={40} />;
    }
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'upload' | 'manage')}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="upload">Upload Training Data</TabsTrigger>
          <TabsTrigger value="manage">Manage Training Sets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Training Data Upload</CardTitle>
              <CardDescription>
                Upload files to train the AI on specific content types
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge 
                  onClick={() => handleContentTypeChange('multiple-choice')}
                  className={`cursor-pointer ${selectedContentType === 'multiple-choice' ? 'bg-primary' : 'bg-secondary'}`}
                >
                  Multiple Choice Questions
                </Badge>
                <Badge 
                  onClick={() => handleContentTypeChange('flashcards')}
                  className={`cursor-pointer ${selectedContentType === 'flashcards' ? 'bg-primary' : 'bg-secondary'}`}
                >
                  Flashcards
                </Badge>
                <Badge 
                  onClick={() => handleContentTypeChange('listening')}
                  className={`cursor-pointer ${selectedContentType === 'listening' ? 'bg-primary' : 'bg-secondary'}`}
                >
                  Listening Exercises
                </Badge>
                <Badge 
                  onClick={() => handleContentTypeChange('writing')}
                  className={`cursor-pointer ${selectedContentType === 'writing' ? 'bg-primary' : 'bg-secondary'}`}
                >
                  Writing Prompts
                </Badge>
              </div>
              
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground'
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-4">
                  {getFileIcon()}
                  {file ? (
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium">Drag & drop a file here, or click to select</p>
                      <p className="text-sm text-muted-foreground">
                        Supported formats: TXT, JSON, MD, PDF, MP3, WAV (Max 20MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {isUploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} />
                  <p className="text-sm text-muted-foreground text-center">
                    {uploadProgress < 100 ? 'Processing...' : 'Processing complete!'}
                  </p>
                </div>
              )}
              
              {trainingExamples.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">
                      Extracted {trainingExamples.length} training examples
                    </h3>
                    <Button onClick={handleAddToTraining} disabled={isUploading}>
                      Add to Training Set
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                    {trainingExamples.slice(0, 5).map((example, i) => (
                      <div key={i} className="py-2 border-b last:border-b-0">
                        <pre className="text-xs whitespace-pre-wrap">
                          {JSON.stringify(example, null, 2)}
                        </pre>
                      </div>
                    ))}
                    {trainingExamples.length > 5 && (
                      <p className="text-sm text-muted-foreground text-center pt-2">
                        ...and {trainingExamples.length - 5} more examples
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="manage" className="space-y-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Set Management</CardTitle>
              <CardDescription>
                View and manage your AI training datasets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">Multiple Choice</h3>
                    <p className="text-2xl font-bold">{trainingStats.totalExamples || 245}</p>
                    <p className="text-sm text-muted-foreground">training examples</p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">Flashcards</h3>
                    <p className="text-2xl font-bold">178</p>
                    <p className="text-sm text-muted-foreground">training examples</p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">Listening Exercises</h3>
                    <p className="text-2xl font-bold">32</p>
                    <p className="text-sm text-muted-foreground">training examples</p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">View All Training Sets</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AITrainingManagerWrapper;
