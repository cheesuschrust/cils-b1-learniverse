
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileProcessor, FileText, Wand2, Library, Settings, Download } from 'lucide-react';
import FileProcessorComponent from '@/components/content/FileProcessorComponent';
import ContentGenerator from '@/components/content/ContentGenerator';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface ProcessedFile {
  file: File;
  contentType: string;
  confidence: number;
  language: string;
}

const ContentManagement: React.FC = () => {
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  
  const handleProcessComplete = (result: ProcessedFile) => {
    setProcessedFiles(prev => [result, ...prev]);
  };
  
  return (
    <ProtectedRoute requireAdmin={true}>
      <Helmet>
        <title>Content Management - Admin</title>
      </Helmet>
      
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
            <p className="text-muted-foreground mt-1">
              Process files and generate learning content
            </p>
          </div>
          
          <Badge variant="outline" className="ml-auto">
            Admin Access
          </Badge>
        </div>
        
        <Tabs defaultValue="processor" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="processor" className="flex items-center">
              <FileProcessor className="mr-2 h-4 w-4" />
              Content Processor
            </TabsTrigger>
            <TabsTrigger value="generator" className="flex items-center">
              <Wand2 className="mr-2 h-4 w-4" />
              Content Generator
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center">
              <Library className="mr-2 h-4 w-4" />
              Content Library
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="processor">
            <FileProcessorComponent onProcessComplete={handleProcessComplete} />
          </TabsContent>
          
          <TabsContent value="generator">
            <ContentGenerator />
          </TabsContent>
          
          <TabsContent value="library">
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Content Library</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Organize
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                  </Button>
                </div>
              </div>
              
              {processedFiles.length > 0 ? (
                <div className="space-y-4">
                  {processedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-primary mr-3" />
                        <div>
                          <p className="font-medium">{file.file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.file.size / 1024).toFixed(1)} KB • Processed {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {file.contentType}
                        </Badge>
                        <Badge variant="secondary" className="capitalize">
                          {file.language}
                        </Badge>
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No content in library</h3>
                  <p className="text-muted-foreground mb-4">
                    Process files using the Content Processor or create new content with the Content Generator.
                  </p>
                  <Button variant="outline">
                    <FileProcessor className="h-4 w-4 mr-2" />
                    Process Files
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default ContentManagement;
