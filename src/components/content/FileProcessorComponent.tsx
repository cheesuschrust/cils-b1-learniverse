
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, Upload, Check, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DropzoneUploader from './DropzoneUploader';

interface FileProcessorComponentProps {
  onProcessComplete?: (results: any) => void;
}

const FileProcessorComponent: React.FC<FileProcessorComponentProps> = ({ 
  onProcessComplete 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileContentType, setFileContentType] = useState<'flashcards' | 'multipleChoice' | 'listening' | 'writing' | 'speaking' | null>(null);
  const [contentConfidence, setContentConfidence] = useState(0);
  const [language, setLanguage] = useState<'english' | 'italian' | 'unknown'>('unknown');
  const [aiIsProcessing, setAiIsProcessing] = useState(false);
  const { toast } = useToast();

  // Handle file drop
  const handleFileDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    
    // Begin processing simulation
    setIsProcessing(true);
    
    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    // Simulate file analysis
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setIsProcessing(false);
      
      // Determine content type based on file name/extension for this demo
      const fileName = selectedFile.name.toLowerCase();
      let detectedType: 'flashcards' | 'multipleChoice' | 'listening' | 'writing' | 'speaking' | null = null;
      let confidence = 0;
      let detectedLanguage: 'english' | 'italian' | 'unknown' = 'unknown';
      
      if (fileName.includes('flash') || fileName.includes('card')) {
        detectedType = 'flashcards';
        confidence = 90;
      } else if (fileName.includes('quiz') || fileName.includes('choice') || fileName.includes('test')) {
        detectedType = 'multipleChoice';
        confidence = 85;
      } else if (fileName.includes('audio') || fileName.includes('listen') || fileName.endsWith('.mp3') || fileName.endsWith('.wav')) {
        detectedType = 'listening';
        confidence = 95;
      } else if (fileName.includes('write') || fileName.includes('essay')) {
        detectedType = 'writing';
        confidence = 80;
      } else if (fileName.includes('speak') || fileName.includes('oral')) {
        detectedType = 'speaking';
        confidence = 85;
      } else {
        // Default to flashcards with low confidence
        detectedType = 'flashcards';
        confidence = 60;
      }
      
      // Detect language (simplified demo)
      if (fileName.includes('ita') || fileName.includes('italian')) {
        detectedLanguage = 'italian';
      } else {
        detectedLanguage = 'english';
      }
      
      setFileContentType(detectedType);
      setContentConfidence(confidence);
      setLanguage(detectedLanguage);
      
      toast({
        title: "File Processed Successfully",
        description: `Detected as ${detectedType} content with ${confidence}% confidence`,
      });
      
      // Call the callback with results
      if (onProcessComplete) {
        onProcessComplete({
          file: selectedFile,
          contentType: detectedType,
          confidence,
          language: detectedLanguage
        });
      }
    }, 3000);
  };
  
  const handleReset = () => {
    setFile(null);
    setUploadProgress(0);
    setFileContentType(null);
    setContentConfidence(0);
    setLanguage('unknown');
  };
  
  const processWithAI = () => {
    if (!file) return;
    
    setAiIsProcessing(true);
    toast({
      title: "AI Processing Started",
      description: "The AI is now analyzing your content...",
    });
    
    // Simulate AI processing
    setTimeout(() => {
      setAiIsProcessing(false);
      setContentConfidence(prev => Math.min(prev + 15, 98));
      
      toast({
        title: "AI Analysis Complete",
        description: "Content has been analyzed and classified with higher confidence.",
      });
    }, 4500);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Content File Processor</CardTitle>
        <CardDescription>
          Upload files for automated content processing and classification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <DropzoneUploader
          file={file}
          fileContentType={fileContentType}
          contentConfidence={contentConfidence}
          language={language}
          isProcessing={isProcessing}
          uploadProgress={uploadProgress}
          onDrop={handleFileDrop}
          onReset={handleReset}
          aiIsProcessing={aiIsProcessing}
        />
        
        {file && !isProcessing && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-4">
            <Button 
              onClick={processWithAI} 
              disabled={aiIsProcessing || contentConfidence > 90}
              className="w-full sm:w-auto"
            >
              {aiIsProcessing ? (
                <>Processing with AI...</>
              ) : (
                <>Enhance Classification with AI</>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="w-full sm:w-auto"
            >
              Reset
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileProcessorComponent;
