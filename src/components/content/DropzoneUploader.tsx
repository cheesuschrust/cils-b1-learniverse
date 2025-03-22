
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, FileAudio, Loader2, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const MAX_FILE_SIZE = 15 * 1024 * 1024; // Reduced to 15MB for better performance

interface DropzoneUploaderProps {
  file: File | null;
  fileContentType: 'flashcards' | 'multipleChoice' | 'listening' | 'writing' | 'speaking' | null;
  contentConfidence: number;
  language: 'english' | 'italian' | 'unknown';
  isProcessing: boolean;
  uploadProgress: number;
  onDrop: (acceptedFiles: File[]) => void;
  onReset: () => void;
  aiIsProcessing: boolean;
}

const DropzoneUploader = ({
  file,
  fileContentType,
  contentConfidence,
  language,
  isProcessing,
  uploadProgress,
  onDrop,
  onReset,
  aiIsProcessing
}: DropzoneUploaderProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      // Accept all common file types
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/json': ['.json'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'audio/mpeg': ['.mp3'],
      'audio/wav': ['.wav'],
      'audio/ogg': ['.ogg'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    disabled: isProcessing || aiIsProcessing,
    maxSize: MAX_FILE_SIZE
  });
  
  const handleManualUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const getConfidenceBadgeVariant = (confidence: number) => {
    if (confidence >= 80) return "default";
    if (confidence >= 60) return "secondary";
    return "destructive";
  };

  const getFileTypeExplanation = (type: string | null) => {
    if (!type) return "";
    
    const explanations: Record<string, string> = {
      'flashcards': 'Vocabulary learning through flashcards',
      'multipleChoice': 'Questions with multiple choice answers',
      'listening': 'Audio-based comprehension exercises',
      'writing': 'Written composition practice',
      'speaking': 'Oral language practice exercises'
    };
    
    return explanations[type] || 'Unrecognized content type';
  };
  
  return (
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
          <p className="font-medium">Processing file...</p>
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
            <div className="mt-3 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {fileContentType === 'multipleChoice' ? 'multiple choice' : fileContentType}
                </Badge>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant={getConfidenceBadgeVariant(contentConfidence)} className="flex items-center gap-1">
                        {contentConfidence.toFixed(0)}% confidence
                        <Info className="h-3 w-3 ml-1" />
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{getFileTypeExplanation(fileContentType)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {language && language !== 'unknown' && (
                <Badge variant="secondary" className="capitalize mt-1">
                  {language}
                </Badge>
              )}
            </div>
          )}
          
          <div className="mt-4 flex items-center gap-2">
            {contentConfidence < 60 ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      <span className="text-sm font-medium text-amber-600">Low confidence detection</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The system is not very confident about the content type. You may need to verify manually.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-green-600">Processing complete</span>
              </>
            )}
          </div>
          
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={(e) => {
              e.stopPropagation();
              onReset();
            }}
          >
            Upload Another File
          </Button>
        </div>
      ) : (
        <div className="py-8 flex flex-col items-center">
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-lg font-medium">Drag & drop any file here</p>
          <p className="text-sm text-muted-foreground mt-1">
            The AI will automatically analyze and categorize it
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={(e) => {
              e.stopPropagation();
              handleManualUpload();
            }}
            disabled={isProcessing || aiIsProcessing}
          >
            Select File
          </Button>
          <div className="text-xs text-muted-foreground mt-4 space-y-1">
            <p>Supported formats: Text files, PDFs, Word documents, Excel, Audio files, Images</p>
            <p>Maximum file size: {MAX_FILE_SIZE / (1024 * 1024)}MB</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropzoneUploader;
