
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { UploadCloud, FileText, Check, AlertCircle } from 'lucide-react';
import { detectContentType, detectFileFormat } from '@/utils/textAnalysis';
import { useToast } from '@/components/ui/use-toast';

interface FileProcessorProps {
  onProcessComplete: (result: any) => void;
  acceptedFileTypes?: string;
  maxSizeMB?: number;
  title?: string;
  description?: string;
}

export const FileProcessor: React.FC<FileProcessorProps> = ({
  onProcessComplete,
  acceptedFileTypes = '.csv, .json, .txt, .pdf, audio/*',
  maxSizeMB = 5,
  title = "Upload File",
  description = "Upload a file to process content"
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [contentPreview, setContentPreview] = useState<string | null>(null);
  const [contentType, setContentType] = useState<string | null>(null);
  const { toast } = useToast();
  
  const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    
    if (acceptedFiles.length === 0) {
      return;
    }
    
    const file = acceptedFiles[0];
    
    if (file.size > maxSize) {
      setError(`File size exceeds the ${maxSizeMB}MB limit`);
      return;
    }
    
    setFile(file);
    
    // Display preview if it's a text file
    if (file.type.includes('text') || file.name.endsWith('.csv') || file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        const preview = content.substring(0, 200) + (content.length > 200 ? '...' : '');
        setContentPreview(preview);
        
        // Try to detect content type
        const detectedType = detectContentType(content);
        setContentType(detectedType);
      };
      reader.readAsText(file);
    } else if (file.type.includes('audio')) {
      setContentType('listening');
      setContentPreview(`Audio file: ${file.name}`);
    } else if (file.name.endsWith('.pdf')) {
      setContentType('reading');
      setContentPreview(`PDF document: ${file.name}`);
    }
  }, [maxSize, maxSizeMB]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes as any,
    maxFiles: 1
  });
  
  const handleProcess = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    
    try {
      // Simulate processing stages
      const totalSteps = 5;
      
      // Step 1: Reading file
      setProgress(20);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 2: Parsing content
      setProgress(40);
      const fileFormat = detectFileFormat(file.name);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 3: Processing content
      setProgress(60);
      const reader = new FileReader();
      
      const content = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read file'));
        
        if (fileFormat === 'audio') {
          reader.readAsArrayBuffer(file);
        } else {
          reader.readAsText(file);
        }
      });
      
      // Step 4: Analyzing content
      setProgress(80);
      let result: any = { content, fileType: fileFormat };
      
      if (fileFormat === 'csv' || fileFormat === 'json' || fileFormat === 'txt') {
        result.contentType = contentType || detectContentType(content);
      } else if (fileFormat === 'audio') {
        result.contentType = 'listening';
      } else if (fileFormat === 'pdf') {
        result.contentType = 'reading';
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 5: Completing
      setProgress(100);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Notify success
      toast({
        title: "Processing Complete",
        description: `File processed as ${result.contentType} content`,
      });
      
      // Trigger callback
      onProcessComplete(result);
      
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to process file');
      
      toast({
        title: "Processing Failed",
        description: err instanceof Error ? err.message : 'Failed to process file',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const resetFile = () => {
    setFile(null);
    setContentPreview(null);
    setContentType(null);
    setError(null);
    setProgress(0);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        {!file ? (
          <div 
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            
            {isDragActive ? (
              <p>Drop the file here...</p>
            ) : (
              <>
                <p className="text-sm font-medium mb-1">Drag and drop a file, or click to select</p>
                <p className="text-xs text-muted-foreground">
                  Supported formats: CSV, JSON, TXT, PDF, audio files (max {maxSizeMB}MB)
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FileText className="h-8 w-8 flex-shrink-0 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB • {contentType || 'Unknown content type'}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={resetFile}>
                Change
              </Button>
            </div>
            
            {contentPreview && (
              <div className="bg-muted p-3 rounded-md">
                <p className="text-xs font-medium mb-1">Content Preview:</p>
                <p className="text-xs break-words">{contentPreview}</p>
              </div>
            )}
            
            {contentType && (
              <Alert variant="outline" className="bg-primary/5">
                <AlertTitle className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Content Type Detected
                </AlertTitle>
                <AlertDescription>
                  This appears to be <span className="font-medium">{contentType}</span> content.
                </AlertDescription>
              </Alert>
            )}
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {isProcessing && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-center text-muted-foreground">
                  Processing... {progress}%
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="ghost" onClick={resetFile} disabled={!file || isProcessing}>
          Cancel
        </Button>
        <Button 
          onClick={handleProcess} 
          disabled={!file || isProcessing}
          className="ml-auto"
        >
          {isProcessing ? 'Processing...' : 'Process File'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileProcessor;
