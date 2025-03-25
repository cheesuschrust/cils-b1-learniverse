
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  detectContentType, 
  detectLanguage, 
  parseContent, 
  detectFileFormat,
  ContentType 
} from '@/utils/textAnalysis';

export interface ProcessedFile {
  content: string;
  type: ContentType;
  language: 'english' | 'italian' | 'spanish' | 'french' | 'german' | 'unknown';
  filename: string;
  parsedContent?: any;
  fileSize: number;
  lastModified: number;
}

export const useFileProcessor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processedFile, setProcessedFile] = useState<ProcessedFile | null>(null);
  const [content, setContent] = useState<string>('');
  const [contentType, setContentType] = useState<ContentType>('writing');
  const [language, setLanguage] = useState<'english' | 'italian' | 'spanish' | 'french' | 'german' | 'unknown'>('unknown');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  // Reset when file changes
  useEffect(() => {
    if (!file) {
      setErrorMessage(null);
    }
  }, [file]);

  const processFile = useCallback(async (file: File): Promise<ProcessedFile> => {
    setIsProcessing(true);
    setErrorMessage(null);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        try {
          const content = reader.result as string;
          
          // Auto-detect content type and language
          const detectedType = detectContentType(content);
          const detectedLanguage = detectLanguage(content);
          
          // Parse the content based on detected type
          const parsedContent = parseContent(content, detectedType);
          
          const result: ProcessedFile = {
            content,
            type: detectedType,
            language: detectedLanguage,
            filename: file.name,
            parsedContent,
            fileSize: file.size,
            lastModified: file.lastModified
          };
          
          resolve(result);
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
      
      // Expanded support for different file types
      const supportedTextTypes = [
        'text/plain', 'text/csv', 'application/json', 
        'text/tab-separated-values', 'application/csv', 
        'application/x-csv', 'text/comma-separated-values', 
        'text/x-comma-separated-values', 'text/x-csv'
      ];
      
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const supportedExtensions = ['txt', 'csv', 'json', 'tsv'];
      
      if (
        supportedTextTypes.includes(file.type) || 
        (fileExtension && supportedExtensions.includes(fileExtension))
      ) {
        reader.readAsText(file);
      } else {
        setIsProcessing(false);
        reject(new Error('Unsupported file type. Please upload a text, CSV, JSON, or TSV file.'));
      }
    });
  }, []);

  const handleFileUpload = useCallback(async (uploadedFile: File) => {
    setFile(uploadedFile);
    
    try {
      const result = await processFile(uploadedFile);
      setContent(result.content);
      setContentType(result.type);
      setLanguage(result.language);
      setProcessedFile(result);
      
      toast({
        title: 'File Processed',
        description: `File "${uploadedFile.name}" uploaded and processed successfully as ${result.type} content.`,
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

  const clearFile = useCallback(() => {
    setFile(null);
    setContent('');
    setProcessedFile(null);
    setErrorMessage(null);
  }, []);

  return {
    file,
    content,
    contentType,
    language,
    isProcessing,
    errorMessage,
    processedFile,
    processFile,
    handleFileUpload,
    setContentType,
    clearFile
  };
};

export default useFileProcessor;
