
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle2, AlertCircle, FileType2, FileText, FileAudio, FileSpreadsheet } from 'lucide-react';
import { useAIUtils } from '@/contexts/AIUtilsContext';
import { listeningExercises } from '@/data/listeningExercises';

interface FileProcessorProps {
  onProcessComplete?: (result: any) => void;
  acceptedFileTypes?: string;
  maxSize?: number; // in MB
  processingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}

const FileProcessor: React.FC<FileProcessorProps> = ({
  onProcessComplete,
  acceptedFileTypes = '.txt,.pdf,.doc,.docx,.mp3,.wav,.csv,.xlsx',
  maxSize = 10,
  processingMessage = 'Processing your file...',
  successMessage = 'File processed successfully!',
  errorMessage = 'Error processing file. Please try again.',
}) => {
  const { toast } = useToast();
  const { isAIEnabled } = useAIUtils();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Helper to get file type icon
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('audio')) return <FileAudio className="h-5 w-5" />;
    if (fileType.includes('pdf')) return <FileText className="h-5 w-5" />;
    if (fileType.includes('csv') || fileType.includes('excel')) return <FileSpreadsheet className="h-5 w-5" />;
    return <FileType2 className="h-5 w-5" />;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);
    
    if (!selectedFile) {
      return;
    }
    
    // Check file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds the ${maxSize}MB limit`);
      return;
    }
    
    // Check file type
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (fileExtension && !acceptedFileTypes.includes(`.${fileExtension}`)) {
      setError(`Unsupported file type. Accepted types: ${acceptedFileTypes}`);
      return;
    }
    
    setFile(selectedFile);
  };

  const processFile = async () => {
    if (!file) return;
    
    try {
      setIsProcessing(true);
      setProgress(0);
      setError(null);
      
      // Simulate processing with progress
      const totalSteps = 10;
      for (let step = 1; step <= totalSteps; step++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(Math.round((step / totalSteps) * 100));
      }
      
      // Process different file types
      let processedResult;
      
      if (file.type.includes('audio')) {
        processedResult = {
          type: 'audio',
          name: file.name,
          duration: '1:23', // This would come from actual audio analysis
          transcription: isAIEnabled ? "This is a sample transcription of the audio file." : null,
        };
      } else if (file.type.includes('text') || file.name.endsWith('.txt')) {
        const text = await file.text();
        processedResult = {
          type: 'text',
          name: file.name,
          content: text,
          wordCount: text.split(/\s+/).length,
          analysis: isAIEnabled ? {
            readability: 'Intermediate',
            topics: ['Grammar', 'Vocabulary'],
            keywords: ['learn', 'italian', 'language']
          } : null
        };
      } else if (file.type.includes('csv') || file.name.endsWith('.csv')) {
        const text = await file.text();
        const lines = text.split('\n');
        
        processedResult = {
          type: 'csv',
          name: file.name,
          rowCount: lines.length - 1, // Exclude header
          preview: lines.slice(0, 5)
        };
      } else {
        processedResult = {
          type: 'document',
          name: file.name,
          size: (file.size / 1024).toFixed(2) + ' KB'
        };
      }
      
      setResult(processedResult);
      
      if (onProcessComplete) {
        onProcessComplete(processedResult);
      }
      
      toast({
        title: "Success",
        description: successMessage,
      });
    } catch (err) {
      console.error('Error processing file:', err);
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFile(null);
    setResult(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {!file && !result && (
        <div className="grid gap-4">
          <input
            type="file"
            onChange={handleFileChange}
            accept={acceptedFileTypes}
            className="hidden"
            id="file-upload"
            ref={fileInputRef}
          />
          <Button
            variant="outline"
            className="w-full h-24 border-dashed flex flex-col gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileType2 className="h-6 w-6" />
            <span>Click to select a file</span>
            <span className="text-xs text-muted-foreground">
              Supported formats: {acceptedFileTypes}
            </span>
          </Button>
        </div>
      )}
      
      {file && !isProcessing && !result && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 border rounded-md">
            {getFileIcon(file.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={resetFileInput}>
              Change
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={processFile} className="flex-1">
              Process File
            </Button>
            <Button variant="outline" onClick={resetFileInput}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      {isProcessing && (
        <div className="space-y-4 p-4 border rounded-md">
          <p className="text-sm">{processingMessage}</p>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-right text-muted-foreground">{progress}%</p>
        </div>
      )}
      
      {result && (
        <div className="space-y-4">
          <Alert variant="default" className="border-green-500 bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
          
          <div className="p-3 border rounded-md space-y-2">
            <div className="flex items-center gap-2">
              {getFileIcon(file?.type || '')}
              <p className="text-sm font-medium">{result.name}</p>
            </div>
            
            {result.type === 'text' && (
              <div className="space-y-2">
                <p className="text-sm"><span className="font-medium">Word Count:</span> {result.wordCount}</p>
                {result.analysis && (
                  <>
                    <p className="text-sm"><span className="font-medium">Readability:</span> {result.analysis.readability}</p>
                    <p className="text-sm"><span className="font-medium">Topics:</span> {result.analysis.topics.join(', ')}</p>
                  </>
                )}
              </div>
            )}
            
            {result.type === 'audio' && (
              <div className="space-y-2">
                <p className="text-sm"><span className="font-medium">Duration:</span> {result.duration}</p>
                {result.transcription && (
                  <div>
                    <p className="text-sm font-medium">Transcription:</p>
                    <p className="text-sm italic border-l-2 border-primary pl-2 mt-1">{result.transcription}</p>
                  </div>
                )}
              </div>
            )}
            
            {result.type === 'csv' && (
              <div className="space-y-2">
                <p className="text-sm"><span className="font-medium">Rows:</span> {result.rowCount}</p>
                <p className="text-sm font-medium">Preview:</p>
                <div className="text-xs bg-muted p-2 rounded max-h-32 overflow-y-auto">
                  {result.preview.map((line: string, i: number) => (
                    <div key={i} className="whitespace-nowrap font-mono">{line}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetFileInput} className="flex-1">
              Process Another File
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileProcessor;
