
import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { detectContentType, ContentType } from '@/utils/textAnalysis';

export const useFileProcessor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string>('');
  const [contentType, setContentType] = useState<ContentType>('writing');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const processFile = useCallback(async (file: File): Promise<{
    content: string;
    type: ContentType;
    filename: string;
  }> => {
    setIsProcessing(true);
    setErrorMessage(null);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        try {
          const content = reader.result as string;
          // Auto-detect content type based on the file content
          const detectedType = detectContentType(content);
          
          resolve({
            content,
            type: detectedType,
            filename: file.name
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to process file';
          reject(new Error(message));
        } finally {
          setIsProcessing(false);
        }
      };
      
      reader.onerror = () => {
        setIsProcessing(false);
        reject(new Error('Failed to read file'));
      };
      
      if (file.type.includes('text') || 
          file.type.includes('csv') || 
          file.type.includes('json') ||
          file.name.endsWith('.txt') || 
          file.name.endsWith('.csv') || 
          file.name.endsWith('.json')) {
        reader.readAsText(file);
      } else {
        setIsProcessing(false);
        reject(new Error('Unsupported file type. Please upload a text, CSV, or JSON file.'));
      }
    });
  }, []);

  const handleFileUpload = useCallback(async (uploadedFile: File) => {
    setFile(uploadedFile);
    
    try {
      const result = await processFile(uploadedFile);
      setContent(result.content);
      setContentType(result.type);
      
      toast({
        title: 'File Processed',
        description: `File "${uploadedFile.name}" uploaded and processed successfully.`,
      });
      
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      setErrorMessage(message);
      
      toast({
        title: 'Error Processing File',
        description: message,
        variant: 'destructive',
      });
      
      return null;
    }
  }, [processFile, toast]);

  return {
    file,
    content,
    contentType,
    isProcessing,
    errorMessage,
    processFile,
    handleFileUpload,
    setContentType
  };
};

export default useFileProcessor;
