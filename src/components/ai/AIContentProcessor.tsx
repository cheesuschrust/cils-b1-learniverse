
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileUp, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIContentProcessorProps {
  onProcessingStart?: () => void;
  onProcessingComplete?: (data: any) => void;
  onProcessingError?: (message: string) => void;
  onProgress?: (stage: string, progress: number) => void;
}

const AIContentProcessor: React.FC<AIContentProcessorProps> = ({
  onProcessingStart,
  onProcessingComplete,
  onProcessingError,
  onProgress
}) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);
  
  const handleProcessFile = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to process",
        variant: "destructive"
      });
      return;
    }
    
    setProcessing(true);
    
    if (onProcessingStart) {
      onProcessingStart();
    }
    
    try {
      // In a real application, we would upload the file to a server
      // and process it there. For now, we'll just simulate processing.
      
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          // Simulate processing delay
          if (onProgress) {
            onProgress('Initializing', 10);
          }
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (onProgress) {
            onProgress('Processing file content', 40);
          }
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (onProgress) {
            onProgress('Analyzing content', 70);
          }
          
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (onProgress) {
            onProgress('Finalizing', 90);
          }
          
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Simulate successful processing
          if (onProcessingComplete) {
            onProcessingComplete({
              success: true,
              content: e.target?.result,
              fileName: file.name
            });
          }
          
          setProcessing(false);
        } catch (error) {
          console.error('Error processing file:', error);
          if (onProcessingError) {
            onProcessingError('Failed to process file content');
          }
          setProcessing(false);
        }
      };
      
      reader.onerror = () => {
        if (onProcessingError) {
          onProcessingError('Failed to read file');
        }
        setProcessing(false);
      };
      
      reader.readAsText(file);
      
    } catch (error) {
      console.error('Error processing file:', error);
      if (onProcessingError) {
        onProcessingError('An unexpected error occurred while processing the file');
      }
      setProcessing(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
        <h3 className="font-medium">Drop file here or click to browse</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Upload PDF, text, or audio files for AI analysis
        </p>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.txt,.doc,.docx,.mp3,.wav"
        />
      </div>
      
      {file && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileUp className="h-5 w-5 mr-2 text-blue-500" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <Button
                onClick={handleProcessFile}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Process File'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIContentProcessor;
