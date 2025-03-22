
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { detectContentType, detectLanguage } from '@/utils/textAnalysis';
import { useSystemLog } from '@/hooks/use-system-log';
import { useNotifications } from '@/contexts/NotificationsContext';
import { v4 as uuidv4 } from 'uuid';

const MAX_PROCESSING_TIME = 30000;

export const useFileProcessor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [fileContentType, setFileContentType] = useState<'flashcards' | 'multipleChoice' | 'listening' | 'writing' | 'speaking' | null>(null);
  const [contentConfidence, setContentConfidence] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState<'english' | 'italian' | 'unknown'>('italian');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingTimeoutId, setProcessingTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [progressInterval, setProgressInterval] = useState<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const { logContentAction, logAIAction } = useSystemLog();
  
  useEffect(() => {
    return () => {
      if (processingTimeoutId) {
        clearTimeout(processingTimeoutId);
      }
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [processingTimeoutId, progressInterval]);
  
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
  
  const resetState = useCallback(() => {
    setFile(null);
    setFileContent('');
    setFileContentType(null);
    setContentConfidence(0);
    setUploadProgress(0);
  }, []);
  
  const processFile = useCallback(async (selectedFile: File) => {
    if (!selectedFile) return;
    
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
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);
      
      setProgressInterval(interval);
      
      let content = '';
      let extractedType = null;
      let detectedLanguage: 'english' | 'italian' | 'unknown' = 'unknown';
      let confidenceScore = 0;
      const fileId = uuidv4();
      
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
        clearInterval(interval);
        if (processingTimeoutId) clearTimeout(processingTimeoutId);
        return;
      }
      
      setFileContent(content);
      setFileContentType(extractedType as any);
      setContentConfidence(confidenceScore);
      setLanguage(detectedLanguage);
      
      setUploadProgress(100);
      clearInterval(interval);
      setProgressInterval(null);
      
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
      
      if (progressInterval) {
        clearInterval(progressInterval);
        setProgressInterval(null);
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
  }, [
    addNotification,
    isProcessing,
    logAIAction,
    logContentAction,
    processingTimeoutId,
    progressInterval,
    toast
  ]);
  
  return {
    file,
    fileContent,
    fileContentType,
    contentConfidence,
    isProcessing,
    language,
    uploadProgress,
    processFile,
    resetState
  };
};
