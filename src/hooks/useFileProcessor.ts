
import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { detectContentType, detectLanguage } from '@/utils/textAnalysis';
import { useSystemLog } from '@/hooks/use-system-log';
import { useNotifications } from '@/contexts/NotificationsContext';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

// Reduced timeout for better UX
const MAX_PROCESSING_TIME = 10000; 

export const useFileProcessor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [fileContentType, setFileContentType] = useState<'flashcards' | 'multipleChoice' | 'listening' | 'writing' | 'speaking' | null>(null);
  const [contentConfidence, setContentConfidence] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState<'english' | 'italian' | 'unknown'>('italian');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Using refs to prevent unnecessary re-renders
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const { logContentAction, logAIAction } = useSystemLog();
  const { user } = useAuth();
  
  // Cleanup function to prevent memory leaks - now as a callback to avoid re-creation
  const cleanupTimers = useCallback(() => {
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
      processingTimeoutRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);
  
  const readTextFile = useCallback((file: File, maxSize: number = 20000): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const content = reader.result as string;
        resolve(content.length > maxSize ? content.substring(0, maxSize) + '...(content truncated)' : content);
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      reader.readAsText(file);
    });
  }, []);
  
  const resetState = useCallback(() => {
    cleanupTimers();
    
    setFile(null);
    setFileContent('');
    setFileContentType(null);
    setContentConfidence(0);
    setUploadProgress(0);
    setIsProcessing(false);
  }, [cleanupTimers]);
  
  const processFile = useCallback(async (selectedFile: File) => {
    if (!selectedFile) return;
    
    // Reset state before processing new file
    resetState();
    
    setFile(selectedFile);
    setUploadProgress(0);
    setIsProcessing(true);
    
    // Use a more efficient animation approach with fewer state updates
    progressIntervalRef.current = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) return 90;
        return prev + 3;
      });
    }, 300);
    
    // Set timeout for processing
    processingTimeoutRef.current = setTimeout(() => {
      if (isProcessing) {
        resetState();
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
    
    try {
      let content = '';
      let extractedType = null;
      let detectedLanguage: 'english' | 'italian' | 'unknown' = 'unknown';
      let confidenceScore = 0;
      const fileId = uuidv4();
      
      if (selectedFile.type.startsWith('text/') || 
          selectedFile.type === 'application/json' ||
          selectedFile.name.endsWith('.txt') || 
          selectedFile.name.endsWith('.md')) {
            
        // Further reduced max size to prevent freezing
        content = await readTextFile(selectedFile, 20000);
        
        // Detect content type
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
        resetState();
        return;
      }
      
      // Update state with file processing results
      setFileContent(content);
      setFileContentType(extractedType as any);
      setContentConfidence(confidenceScore);
      setLanguage(detectedLanguage);
      
      // Complete progress animation
      setUploadProgress(100);
      
      // Clean up timers
      cleanupTimers();
      
      // Log success
      logContentAction(
        'file_processed_successfully', 
        `File ${selectedFile.name} processed as ${extractedType} content with ${confidenceScore}% confidence`,
        'info'
      );
      
      logAIAction(
        'content_analysis_completed',
        `AI analyzed content and detected ${extractedType} content type with ${confidenceScore}% confidence`
      );
      
      // Send notification
      addNotification(
        'File Processed Successfully',
        `${selectedFile.name} was processed automatically`,
        'file-processed',
        {
          fileType: selectedFile.type,
          contentType: extractedType as string,
          confidence: confidenceScore,
          processingTime: Date.now(),
          detectedLanguage,
          fileId
        }
      );
      
      toast({
        title: "File processed successfully",
        description: `Detected ${extractedType} content with ${confidenceScore.toFixed(1)}% confidence`,
      });
      
      // Set processing to false after a short delay to allow animation to complete
      setTimeout(() => {
        setIsProcessing(false);
      }, 300);
      
    } catch (error) {
      console.error("Error processing file:", error);
      
      // Clean up timers
      cleanupTimers();
      
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
    cleanupTimers,
    isProcessing,
    logAIAction,
    logContentAction,
    readTextFile,
    resetState,
    toast
  ]);
  
  // Make sure to clean up on unmount
  React.useEffect(() => {
    return () => {
      cleanupTimers();
    };
  }, [cleanupTimers]);
  
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
