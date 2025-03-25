import React, { useState, useCallback } from 'react';
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
import { useToast } from '@/components/ui/use-toast';
import { Upload, AlertCircle, Loader2 } from "lucide-react";
import { useFileProcessor } from '@/hooks/useFileProcessor';

const FileUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileDescription, setFileDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const { toast } = useToast();
  const { file, content, contentType, isProcessing, errorMessage, handleFileUpload } = useFileProcessor();

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
      setFileName(selectedFile.name);
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
        title: "File Uploaded",
        description: `Successfully uploaded ${file.name}`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading the file.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-4">File Uploader</h1>
      <p className="text-muted-foreground mb-8">
        Upload files for content analysis and processing.
      </p>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Upload New File</CardTitle>
          <CardDescription>
            Select a file from your computer to upload and process.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="file">Select File</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              disabled={uploading || isProcessing}
            />
          </div>

          {file && (
            <>
              <div className="space-y-2">
                <Label htmlFor="description">File Description</Label>
                <Textarea
                  id="description"
                  placeholder="Add a description for the file"
                  value={fileDescription}
                  onChange={(e) => setFileDescription(e.target.value)}
                  disabled={uploading || isProcessing}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  id="public"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  disabled={uploading || isProcessing}
                />
                <Label htmlFor="public">Make Public</Label>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={uploading || isProcessing || !file}>
            {uploading || isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {fileUrl && (
        <div className="mt-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Uploaded File Preview</h2>
          <Card>
            <CardHeader>
              <CardTitle>{fileName}</CardTitle>
              <CardDescription>
                Content Type: {contentType}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {contentType.includes('image') ? (
                <img src={fileUrl} alt="Uploaded File" className="max-w-full h-auto" />
              ) : (
                <pre className="whitespace-pre-wrap">{content}</pre>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
