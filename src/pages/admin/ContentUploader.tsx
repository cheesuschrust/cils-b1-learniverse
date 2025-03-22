import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload, FileText, FileAudio, AlertCircle, CheckCircle2 } from 'lucide-react';
import { detectContentType, detectLanguage } from '@/utils/textAnalysis';
import { useAI } from '@/hooks/useAI';
import AIStatus from '@/components/ai/AIStatus';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

const ContentUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [fileContentType, setFileContentType] = useState<'flashcards' | 'multipleChoice' | 'listening' | 'writing' | 'speaking' | null>(null);
  const [contentConfidence, setContentConfidence] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState<'english' | 'italian'>('italian');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [useAIProcessing, setUseAIProcessing] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  
  const { toast } = useToast();
  const { generateQuestions, isProcessing: aiIsProcessing } = useAI();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    
    // Read file content
    setIsProcessing(true);
    try {
      let content = '';
      
      if (selectedFile.type.startsWith('text/') || 
          selectedFile.type === 'application/json' ||
          selectedFile.name.endsWith('.txt') || 
          selectedFile.name.endsWith('.md')) {
        content = await readTextFile(selectedFile);
      } else if (selectedFile.type.startsWith('audio/')) {
        content = `Audio file: ${selectedFile.name}`;
        setFileContentType('listening');
        setContentConfidence(95);
        setIsProcessing(false);
        return;
      } else {
        toast({
          title: "Unsupported file type",
          description: "Please upload a text or audio file",
          variant: "destructive"
        });
        setFile(null);
        setIsProcessing(false);
        return;
      }
      
      setFileContent(content);
      
      // Auto-detect content type
      const contentTypeResult = await detectContentType(content, selectedFile.type);
      
      // Convert 'multiple-choice' to 'multipleChoice' if needed
      let detectedType = contentTypeResult.type;
      if (detectedType === "multiple-choice") {
        detectedType = "multipleChoice" as any;
      }
      
      setFileContentType(detectedType as any);
      setContentConfidence(contentTypeResult.confidence);
      
      // Auto-detect language
      const detectedLanguage = detectLanguage(content);
      if (detectedLanguage === 'italian' || detectedLanguage === 'english') {
        setLanguage(detectedLanguage);
      }
      
      // Auto-generate title if empty
      if (!title && content) {
        const firstLine = content.split('\n')[0].trim();
        if (firstLine.length > 5 && firstLine.length < 100) {
          setTitle(firstLine);
        } else {
          setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
        }
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Error processing file",
        description: "There was a problem reading the file content",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [title, toast]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/json': ['.json'],
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav'],
      'audio/ogg': ['.ogg']
    }
  });
  
  const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };
  
  const handleManualUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleContentTypeChange = (value: string) => {
    // Convert 'multiple-choice' to 'multipleChoice' if needed
    if (value === "multiple-choice") {
      value = "multipleChoice";
    }
    setFileContentType(value as any);
  };
  
  const handleGenerateQuestions = async () => {
    if (!fileContent || !fileContentType) {
      toast({
        title: "Missing content",
        description: "Please upload content before generating questions",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    try {
      // Convert 'multipleChoice' back to 'multiple-choice' if needed for the AI service
      let contentType = fileContentType;
      if (contentType === 'multipleChoice') {
        contentType = 'multiple-choice' as any;
      }
      
      const questions = await generateQuestions(
        fileContent,
        contentType as any,
        5, // Number of questions
        difficulty
      );
      
      setGeneratedQuestions(questions);
      
      toast({
        title: "Questions generated",
        description: `Successfully generated ${questions.length} questions`,
      });
    } catch (error) {
      console.error("Error generating questions:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate questions from the content",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleUpload = async () => {
    if (!file || !fileContentType || !title) {
      toast({
        title: "Missing information",
        description: "Please provide a file, content type, and title",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);
    
    try {
      // In a real app, we would upload the file and metadata to a server here
      // For this demo, we'll just simulate a successful upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadProgress(100);
      
      toast({
        title: "Upload successful",
        description: "Content has been uploaded and is ready for use",
      });
      
      // Reset form after successful upload
      setTimeout(() => {
        setFile(null);
        setFileContent('');
        setFileContentType(null);
        setTitle('');
        setDescription('');
        setTags('');
        setGeneratedQuestions([]);
        setUploadProgress(0);
        setIsUploading(false);
      }, 1000);
      
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your content",
        variant: "destructive"
      });
      setIsUploading(false);
      clearInterval(interval);
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Content Uploader</h1>
        <AIStatus showDetails={false} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Upload Learning Content</CardTitle>
          <CardDescription>
            Upload text or audio files to create learning materials
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="upload">Upload Content</TabsTrigger>
              <TabsTrigger value="preview">Preview & Process</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload">
              <div className="space-y-6">
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
                  }`}
                >
                  <input {...getInputProps()} ref={fileInputRef} />
                  
                  {isProcessing ? (
                    <div className="py-4 flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                      <p>Processing file...</p>
                    </div>
                  ) : file ? (
                    <div className="py-4 flex flex-col items-center">
                      {file.type.startsWith('audio/') ? (
                        <FileAudio className="h-8 w-8 text-primary mb-2" />
                      ) : (
                        <FileText className="h-8 w-8 text-primary mb-2" />
                      )}
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                      {fileContentType && (
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {fileContentType === 'multipleChoice' ? 'multiple choice' : fileContentType}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {contentConfidence}% confidence
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-8 flex flex-col items-center">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-lg font-medium">Drag & drop a file here</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        or click to select a file
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={handleManualUpload}
                      >
                        Select File
                      </Button>
                      <p className="text-xs text-muted-foreground mt-4">
                        Supported formats: .txt, .md, .json, .mp3, .wav, .ogg
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input 
                        id="title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        placeholder="Enter a title for this content"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="content-type">Content Type</Label>
                      <Select 
                        value={fileContentType || ''} 
                        onValueChange={handleContentTypeChange}
                      >
                        <SelectTrigger id="content-type">
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flashcards">Flashcards</SelectItem>
                          <SelectItem value="multipleChoice">Multiple Choice</SelectItem>
                          <SelectItem value="listening">Listening</SelectItem>
                          <SelectItem value="writing">Writing</SelectItem>
                          <SelectItem value="speaking">Speaking</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select 
                        value={language} 
                        onValueChange={(value) => setLanguage(value as 'english' | 'italian')}
                      >
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="italian">Italian</SelectItem>
                          <SelectItem value="english">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="difficulty">Difficulty Level</Label>
                      <Select 
                        value={difficulty} 
                        onValueChange={(value) => setDifficulty(value as 'Beginner' | 'Intermediate' | 'Advanced')}
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
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Enter a description for this content"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input 
                    id="tags" 
                    value={tags} 
                    onChange={(e) => setTags(e.target.value)} 
                    placeholder="Enter comma-separated tags (e.g., grammar, verbs, food)"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preview">
              <div className="space-y-6">
                {file ? (
                  <>
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Content Preview</h3>
                      <div className="max-h-60 overflow-y-auto bg-muted/50 p-3 rounded text-sm font-mono">
                        {file.type.startsWith('audio/') ? (
                          <div className="flex items-center justify-center py-4">
                            <audio controls src={URL.createObjectURL(file)} className="w-full max-w-md">
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        ) : (
                          <pre className="whitespace-pre-wrap">{fileContent}</pre>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="ai-processing"
                        checked={useAIProcessing}
                        onCheckedChange={setUseAIProcessing}
                      />
                      <Label htmlFor="ai-processing">Use AI to process content</Label>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      <Button 
                        onClick={handleGenerateQuestions}
                        disabled={!fileContent || !fileContentType || isProcessing || aiIsProcessing || !useAIProcessing}
                        className="w-full"
                      >
                        {isProcessing || aiIsProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>Generate Questions</>
                        )}
                      </Button>
                      
                      {generatedQuestions.length > 0 && (
                        <div className="border rounded-lg p-4">
                          <h3 className="font-medium mb-2">Generated Questions</h3>
                          <div className="max-h-60 overflow-y-auto">
                            <pre className="whitespace-pre-wrap text-sm p-3 bg-muted/50 rounded">
                              {JSON.stringify(generatedQuestions, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p>No file uploaded yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Go to the Upload tab to select a file
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => {
            setFile(null);
            setFileContent('');
            setFileContentType(null);
            setTitle('');
            setDescription('');
            setTags('');
            setGeneratedQuestions([]);
          }}>
            Clear
          </Button>
          
          <Button 
            onClick={handleUpload} 
            disabled={!file || !fileContentType || !title || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>Upload Content</>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {isUploading && (
        <div className="mt-4">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-sm text-center mt-2">
            {uploadProgress < 100 ? 'Uploading...' : 'Upload complete!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ContentUploader;
