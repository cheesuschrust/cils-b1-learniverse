
import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Upload, AlertCircle, Loader2, FileText, X, Check } from "lucide-react";
import { useFileProcessor } from '@/hooks/useFileProcessor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FileUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileDescription, setFileDescription] = useState('');
  const [fileCategory, setFileCategory] = useState('general');
  const [fileLanguage, setFileLanguage] = useState('italian');
  const [isPublic, setIsPublic] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const { toast } = useToast();
  const { file, content, contentType, isProcessing, errorMessage, handleFileUpload, clearFile } = useFileProcessor();

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select at least one file to upload.",
        variant: "destructive",
      });
      return;
    }

    const selectedFile = files[0];
    const result = await handleFileUpload(selectedFile);

    if (result) {
      setFileUrl(URL.createObjectURL(selectedFile));
    }
  }, [handleFileUpload, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "File Uploaded Successfully",
        description: `${file.name} has been uploaded and will be processed.`,
        variant: "default",
      });
      
      // Reset form
      clearFile();
      setFileDescription('');
      setFileUrl(null);
      setActiveTab('history');
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const cancelUpload = () => {
    clearFile();
    setFileUrl(null);
    setFileDescription('');
  };

  return (
    <div className="container max-w-6xl mx-auto py-6">
      <Helmet>
        <title>File Uploader - Admin</title>
      </Helmet>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">File Uploader</h1>
          <p className="text-muted-foreground mt-1">
            Upload files for content analysis and processing
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="upload">Upload New File</TabsTrigger>
          <TabsTrigger value="history">Upload History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
              <CardDescription>
                Upload a file for content analysis and processing. 
                Supported formats: TXT, PDF, DOCX, CSV, JSON, Images.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="file">Select File</Label>
                {!file ? (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    <label htmlFor="file-upload" className="cursor-pointer w-full flex flex-col items-center">
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="font-medium mb-1">Click to upload or drag and drop</p>
                      <p className="text-sm text-muted-foreground">
                        PDF, TXT, DOCX, CSV, JSON, JPEG, PNG (Max 5MB)
                      </p>
                      <input
                        id="file-upload"
                        type="file"
                        onChange={handleFileChange}
                        disabled={uploading || isProcessing}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {Math.round(file.size / 1024)} KB • {file.type}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={cancelUpload}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {file && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={fileCategory} onValueChange={setFileCategory}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="vocabulary">Vocabulary</SelectItem>
                          <SelectItem value="grammar">Grammar</SelectItem>
                          <SelectItem value="reading">Reading</SelectItem>
                          <SelectItem value="listening">Listening</SelectItem>
                          <SelectItem value="speaking">Speaking</SelectItem>
                          <SelectItem value="writing">Writing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={fileLanguage} onValueChange={setFileLanguage}>
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="italian">Italian</SelectItem>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="both">Bilingual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Add a description for this file"
                      value={fileDescription}
                      onChange={(e) => setFileDescription(e.target.value)}
                      disabled={uploading || isProcessing}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="public"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                      disabled={uploading || isProcessing}
                      className="rounded border-border h-4 w-4"
                    />
                    <Label htmlFor="public">Make content publicly available</Label>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={cancelUpload} disabled={!file || uploading || isProcessing}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={uploading || isProcessing || !file}>
                {uploading || isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload & Process
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {content && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Content Preview</CardTitle>
                <CardDescription>
                  This is a preview of the extracted content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md">
                  {contentType.includes('image') ? (
                    <div className="flex justify-center">
                      {fileUrl && <img src={fileUrl} alt="Uploaded file" className="max-h-80 rounded" />}
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap text-sm">{content}</pre>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Upload History</CardTitle>
              <CardDescription>
                View and manage your previously uploaded files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Empty state */}
                <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium mb-1">No files uploaded yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your uploaded files will appear here
                  </p>
                  <Button variant="outline" onClick={() => setActiveTab('upload')}>
                    Upload your first file
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FileUploader;
