
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAI } from '@/hooks/useAI';
import AIStatus from '@/components/ai/AIStatus';
import { useAuth } from '@/contexts/AuthContext';
import { useFileProcessor } from '@/hooks/useFileProcessor';
import DropzoneUploader from '@/components/content/DropzoneUploader';
import ContentAnalysis from '@/components/content/ContentAnalysis';
import AITrainingManagerWrapper from '@/components/admin/AITrainingManagerWrapper';

const ContentUploader = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'training'>('upload');
  
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
  
  // Modified drop handler for DropzoneUploader
  const handleFileDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      processFile(acceptedFiles[0]);
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <Helmet>
        <title>Content Uploader | Admin</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Content Uploader</h1>
        <AIStatus showDetails={true} />
      </div>
      
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'upload' | 'training')} className="w-full mb-6">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="upload" className="flex-1 sm:flex-none">Content Upload</TabsTrigger>
          <TabsTrigger value="training" className="flex-1 sm:flex-none">AI Training</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {activeTab === 'upload' ? (
        <>
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
        </>
      ) : (
        <AITrainingManagerWrapper />
      )}
    </div>
  );
};

export default ContentUploader;
