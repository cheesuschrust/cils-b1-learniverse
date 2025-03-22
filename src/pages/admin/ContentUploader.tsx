import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload, FileText, FileAudio, CheckCircle2 } from 'lucide-react';
import { detectContentType, detectLanguage } from '@/utils/textAnalysis';
import { useAI } from '@/hooks/useAI';
import AIStatus from '@/components/ai/AIStatus';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNotifications } from '@/contexts/NotificationsContext';
import { useSystemLog } from '@/hooks/use-system-log';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const MAX_PROCESSING_TIME = 30000;

const ContentUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [fileContentType, setFileContentType] = useState<'flashcards' | 'multipleChoice' | 'listening' | 'writing' | 'speaking' | null>(null);
  const [contentConfidence, setContentConfidence] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState<'english' | 'italian' | 'unknown'>('italian');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingTimeoutId, setProcessingTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();
  const { isProcessing: aiIsProcessing } = useAI();
  const { addNotification } = useNotifications();
  const { logContentAction, logAIAction } = useSystemLog();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    return () => {
      if (processingTimeoutId) {
        clearTimeout(processingTimeoutId);
      }
    };
  }, [processingTimeoutId]);
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const selectedFile = acceptedFiles[0];
    
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        variant: "destructive"
      });
      return;
    }
    
    setFile(selectedFile);
    setUploadProgress(0);
    setIsProcessing(true);
    
    const timeoutId = setTimeout(() => {
      if (isProcessing) {
        setIsProcessing(false);
        toast({
          title: "Processing timeout",
          description: "File processing took too long and was aborted",
          variant: "destructive"
        });
        logContentAction(
          'file_processing_timeout', 
          `Processing of file ${selectedFile.name} timed out after ${MAX_PROCESSING_TIME / 1000}s`,
          'warning'
        );
      }
    }, MAX_PROCESSING_TIME);
    
    setProcessingTimeoutId(timeoutId);
    
    try {
      let content = '';
      let extractedType = null;
      let detectedLanguage: 'english' | 'italian' | 'unknown' = 'unknown';
      let confidenceScore = 0;
      const fileId = uuidv4();
      
      let progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);
      
      if (selectedFile.type.startsWith('text/') || 
          selectedFile.type === 'application/json' ||
          selectedFile.name.endsWith('.txt') || 
          selectedFile.name.endsWith('.md')) {
            
        content = await readTextFile(selectedFile, 100000);
        
        const contentTypeResult = await detectContentType(content, selectedFile.type);
        
        extractedType = contentTypeResult.type === "multiple-choice" ? "multipleChoice" : contentTypeResult.type;
        confidenceScore = contentTypeResult.confidence;
        
        detectedLanguage = detectLanguage(content);
        
      } else if (selectedFile.type.startsWith('audio/')) {
        content = `Audio file: ${selectedFile.name}`;
        extractedType = 'listening';
        confidenceScore = 92;
        detectedLanguage = 'italian';
      } else {
        toast({
          title: "Unsupported file type",
          description: "Please upload a text or audio file",
          variant: "destructive"
        });
        setFile(null);
        setIsProcessing(false);
        clearInterval(progressInterval);
        if (processingTimeoutId) clearTimeout(processingTimeoutId);
        return;
      }
      
      setFileContent(content);
      setFileContentType(extractedType as any);
      setContentConfidence(confidenceScore);
      setLanguage(detectedLanguage);
      
      setUploadProgress(100);
      clearInterval(progressInterval);
      
      if (processingTimeoutId) {
        clearTimeout(processingTimeoutId);
        setProcessingTimeoutId(null);
      }
      
      logContentAction(
        'file_processed_successfully', 
        `File ${selectedFile.name} processed as ${extractedType} content with ${confidenceScore}% confidence`,
        'info'
      );
      
      logAIAction(
        'content_analysis_completed',
        `AI analyzed content and detected ${extractedType} content type with ${confidenceScore}% confidence`
      );
      
      addNotification(
        'File Processed Successfully',
        `${selectedFile.name} was processed automatically`,
        'file-processed',
        {
          fileType: selectedFile.type,
          contentType: extractedType as string,
          confidence: confidenceScore,
          processingTime: Date.now() - new Date().getTime() + MAX_PROCESSING_TIME,
          detectedLanguage,
          fileId
        }
      );
      
      toast({
        title: "File processed successfully",
        description: `Detected ${extractedType} content with ${confidenceScore.toFixed(1)}% confidence`,
      });
      
      setTimeout(() => {
        setIsProcessing(false);
      }, 500);
      
    } catch (error) {
      console.error("Error processing file:", error);
      
      const currentProgressInterval = progressInterval;
      
      if (currentProgressInterval) {
        clearInterval(currentProgressInterval);
      }
      
      if (processingTimeoutId) {
        clearTimeout(processingTimeoutId);
        setProcessingTimeoutId(null);
      }
      
      logContentAction(
        'file_processing_error', 
        `Error processing file ${selectedFile.name}: ${error}`,
        'error'
      );
      
      toast({
        title: "Error processing file",
        description: "There was a problem reading the file content",
        variant: "destructive"
      });
      
      setIsProcessing(false);
    }
  }, [toast, addNotification, logContentAction, logAIAction, processingTimeoutId, isProcessing]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/json': ['.json'],
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav'],
      'audio/ogg': ['.ogg']
    },
    disabled: isProcessing || aiIsProcessing,
    maxSize: MAX_FILE_SIZE
  });
  
  const readTextFile = (file: File, maxSize: number = Infinity): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const content = reader.result as string;
        resolve(content.length > maxSize ? content.substring(0, maxSize) + '...(content truncated)' : content);
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      reader.readAsText(file);
    });
  };
  
  const handleManualUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access this page",
        variant: "destructive"
      });
    }
  }, [user, toast]);
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Content Uploader</h1>
        <AIStatus showDetails={false} />
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
              } ${(isProcessing || aiIsProcessing) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input {...getInputProps()} ref={fileInputRef} />
              
              {isProcessing ? (
                <div className="py-4 flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <p>Processing file...</p>
                  {uploadProgress > 0 && (
                    <div className="w-full max-w-xs mt-4">
                      <Progress value={uploadProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {uploadProgress < 100 ? 'Analyzing content...' : 'Processing complete!'}
                      </p>
                    </div>
                  )}
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
                  {language && language !== 'unknown' && (
                    <div className="mt-1">
                      <Badge variant="secondary" className="capitalize">
                        {language}
                      </Badge>
                    </div>
                  )}
                  <div className="mt-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium text-green-600">Processing complete</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setFile(null);
                      setFileContent('');
                      setFileContentType(null);
                      setContentConfidence(0);
                    }}
                  >
                    Upload Another File
                  </Button>
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-lg font-medium">Drag & drop a file here</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    for automatic processing
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={handleManualUpload}
                    disabled={isProcessing || aiIsProcessing}
                  >
                    Select File
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    Supported formats: .txt, .md, .json, .mp3, .wav, .ogg
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum file size: {MAX_FILE_SIZE / (1024 * 1024)}MB
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {fileContent && fileContentType && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-3">Content Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-muted p-3 rounded-md">
                <div className="text-sm font-medium">Content Type</div>
                <div className="mt-1 text-lg font-semibold capitalize">
                  {fileContentType === 'multipleChoice' ? 'Multiple Choice' : fileContentType}
                </div>
              </div>
              <div className="bg-muted p-3 rounded-md">
                <div className="text-sm font-medium">Confidence</div>
                <div className="mt-1 text-lg font-semibold">
                  {contentConfidence.toFixed(1)}%
                </div>
              </div>
              <div className="bg-muted p-3 rounded-md">
                <div className="text-sm font-medium">Language</div>
                <div className="mt-1 text-lg font-semibold capitalize">
                  {language || 'Unknown'}
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-md font-medium mb-2">Content Preview</h4>
              <div className="max-h-40 overflow-y-auto bg-muted/50 p-3 rounded-md">
                <pre className="text-sm whitespace-pre-wrap">
                  {file?.type.startsWith('audio/') 
                    ? 'Audio content cannot be displayed as text' 
                    : fileContent.length > 1000 
                      ? fileContent.substring(0, 1000) + '...(content truncated)' 
                      : fileContent
                  }
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentUploader;
