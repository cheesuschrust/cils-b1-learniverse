
import React, { useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAI } from '@/hooks/useAI';
import AIStatus from '@/components/ai/AIStatus';
import { useAuth } from '@/contexts/AuthContext';
import { useFileProcessor } from '@/hooks/useFileProcessor';
import DropzoneUploader from '@/components/content/DropzoneUploader';
import ContentAnalysis from '@/components/content/ContentAnalysis';

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const ContentUploader = () => {
  const { 
    file,
    fileContent,
    fileContentType,
    contentConfidence,
    isProcessing,
    language,
    uploadProgress,
    processFile,
    resetState
  } = useFileProcessor();
  
  const { toast } = useToast();
  const { isProcessing: aiIsProcessing } = useAI();
  const { user } = useAuth();
  
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access this page",
        variant: "destructive"
      });
    }
  }, [user, toast]);
  
  const handleFileDrop = useCallback(async (acceptedFiles: File[]) => {
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
    
    await processFile(selectedFile);
  }, [processFile, toast]);
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Content Uploader</h1>
        <AIStatus showDetails={false} />
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <DropzoneUploader
              file={file}
              fileContentType={fileContentType}
              contentConfidence={contentConfidence}
              language={language}
              isProcessing={isProcessing}
              uploadProgress={uploadProgress}
              onDrop={handleFileDrop}
              onReset={resetState}
              aiIsProcessing={aiIsProcessing}
            />
          </div>
        </CardContent>
      </Card>
      
      <ContentAnalysis
        fileContent={fileContent}
        fileContentType={fileContentType}
        contentConfidence={contentConfidence}
        language={language}
        file={file}
      />
    </div>
  );
};

export default ContentUploader;
