
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useFileProcessor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string>('');
  const [contentType, setContentType] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (selectedFile: File): Promise<boolean> => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Validate file type
      const allowedTypes = [
        'text/plain', 
        'text/csv', 
        'application/pdf',
        'application/json',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'image/jpeg',
        'image/png'
      ];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        setErrorMessage('File type not supported. Please upload a text, PDF, Word, CSV, JSON, or image file.');
        return false;
      }

      // Limit file size to 5MB
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (selectedFile.size > maxSize) {
        setErrorMessage('File is too large. Maximum size is 5MB.');
        return false;
      }

      setFile(selectedFile);
      setContentType(selectedFile.type);

      // Read the file content if it's a text file
      if (selectedFile.type.includes('text') || selectedFile.type.includes('json')) {
        const fileContent = await selectedFile.text();
        setContent(fileContent.slice(0, 2000) + (fileContent.length > 2000 ? '...' : ''));
      } else if (selectedFile.type.includes('pdf') || selectedFile.type.includes('word')) {
        setContent('PDF/Word document preview not available. File will be processed for content extraction.');
      } else if (selectedFile.type.includes('image')) {
        setContent('Image file uploaded. Image analysis will be performed.');
      }

      toast({
        title: "File Accepted",
        description: `Ready to process ${selectedFile.name}`,
      });

      return true;
    } catch (error) {
      console.error('Error processing file:', error);
      setErrorMessage('Error processing file. Please try again.');
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  const clearFile = useCallback(() => {
    setFile(null);
    setContent('');
    setContentType('');
    setErrorMessage(null);
  }, []);

  return {
    file,
    content,
    contentType,
    isProcessing,
    errorMessage,
    handleFileUpload,
    clearFile
  };
};
