import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { detectLanguage, ContentType } from '@/utils/textAnalysis';
import useFileProcessor from '@/hooks/useFileProcessor';

const ContentUploader = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<ContentType>('writing');
  const [language, setLanguage] = useState<'english' | 'italian'>('english');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const { isModelLoaded } = useAI();
  const {
    file,
    handleFileUpload,
    isProcessing: isFileProcessing,
    errorMessage: fileErrorMessage,
  } = useFileProcessor();
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    const detectedLanguage = detectLanguage(e.target.value);
    setLanguage(detectedLanguage === 'italian' ? 'italian' : 'english');
  };
  
  const handleUpload = async () => {
    if (!title || !description || !content) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before uploading.",
        variant: "destructive",
      });
      return;
    }
    
    setUploadStatus('loading');
    setErrorMessage(null);
    
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setUploadStatus('success');
      toast({
        title: "Upload Successful",
        description: "Content uploaded successfully!",
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setContent('');
      setContentType('writing');
      setLanguage('english');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      setUploadStatus('error');
      setErrorMessage(message);
      toast({
        title: "Upload Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setUploadStatus('idle');
    }
  };
  
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      toast({
        title: "No Files Selected",
        description: "Please select at least one file to upload.",
        variant: "destructive",
      });
      return;
    }
    
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      await handleFileUpload(selectedFile);
    }
  }, [handleFileUpload, toast]);
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8 animate-fade-in">
        Content Uploader
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Manual Input */}
        <div className="animate-fade-up">
          <Card>
            <CardHeader>
              <CardTitle>Manual Input</CardTitle>
              <CardDescription>
                Enter content details manually
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Title of the content"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Brief description of the content"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Enter your content here"
                  value={content}
                  onChange={handleContentChange}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contentType">Content Type</Label>
                <Select value={contentType} onValueChange={(value) => setContentType(value as ContentType)}>
                  <SelectTrigger className="w-full">
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={(value) => setLanguage(value as 'english' | 'italian')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="italian">Italian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {uploadStatus === 'error' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              
              <Button onClick={handleUpload} disabled={uploadStatus === 'loading' || !isModelLoaded} className="w-full">
                {uploadStatus === 'loading' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload Content"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - File Upload */}
        <div className="animate-fade-up">
          <Card>
            <CardHeader>
              <CardTitle>File Upload</CardTitle>
              <CardDescription>
                Upload content from a file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">Select File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".txt,.md,.csv,.json"
                  onChange={handleFileSelect}
                  disabled={isFileProcessing}
                />
              </div>
              
              {file && (
                <div className="rounded-md border px-4 py-3 bg-muted">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="text-green-500 h-5 w-5" />
                    <p className="text-sm font-medium">
                      {file.name} - {file.size} bytes
                    </p>
                  </div>
                </div>
              )}
              
              {fileErrorMessage && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{fileErrorMessage}</AlertDescription>
                </Alert>
              )}
              
              {isFileProcessing ? (
                <Button disabled className="w-full">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing File...
                </Button>
              ) : (
                <Button variant="secondary" asChild className="w-full">
                  <label htmlFor="file">
                    <Upload className="mr-2 h-4 w-4" />
                    Choose File
                  </label>
                </Button>
              )}
              
              {content && (
                <div className="space-y-2 mt-4">
                  <Label>Extracted Content</Label>
                  <Textarea
                    value={content}
                    readOnly
                    className="min-h-[100px] text-sm"
                  />
                  <p className="text-sm text-muted-foreground">
                    Content Type: {contentType}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContentUploader;
