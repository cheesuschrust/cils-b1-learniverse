
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ContentUploadForm from '@/components/admin/ContentUploadForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

const ContentUploader = () => {
  return (
    <>
      <Helmet>
        <title>Content Uploader - Admin</title>
      </Helmet>
      
      <div className="container max-w-6xl mx-auto py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Content Uploader</h1>
            <p className="text-muted-foreground mt-1">
              Upload and manage content for your learning platform
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/content-analysis">
                View Content Analysis
              </Link>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="upload">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upload">Upload Content</TabsTrigger>
            <TabsTrigger value="help">Help & Guidelines</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <ContentUploadForm />
          </TabsContent>
          
          <TabsContent value="help">
            <Card>
              <CardHeader>
                <CardTitle>Content Upload Guidelines</CardTitle>
                <CardDescription>
                  Learn how to create effective learning content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                    Supported File Formats
                  </h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Text files (.txt) - Plain text content</li>
                    <li>PDF documents (.pdf) - Formatted documents</li>
                    <li>Word documents (.doc, .docx) - Microsoft Word documents</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                    Content Types
                  </h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>
                      <strong>Flashcards</strong> - Vocabulary terms or concepts with definitions
                    </li>
                    <li>
                      <strong>Multiple Choice</strong> - Questions with multiple answer options
                    </li>
                    <li>
                      <strong>Writing</strong> - Writing prompts and exercises
                    </li>
                    <li>
                      <strong>Speaking</strong> - Speaking exercises and pronunciation practice
                    </li>
                    <li>
                      <strong>Listening</strong> - Audio-based comprehension exercises
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                    Content Processing
                  </h3>
                  <p>
                    When you upload content, our system will:
                  </p>
                  <ol className="list-decimal pl-6 space-y-1">
                    <li>Analyze the document content</li>
                    <li>Extract key concepts, terms, and topics</li>
                    <li>Generate appropriate questions based on the content type</li>
                    <li>Create a structured learning resource</li>
                  </ol>
                  <p className="text-sm text-muted-foreground mt-2">
                    Note: Processing time may vary depending on the file size and complexity.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                    Best Practices
                  </h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Use clear, concise language</li>
                    <li>Structure your content with headings and sections</li>
                    <li>For vocabulary lists, use a consistent format (term: definition)</li>
                    <li>Include diverse examples to illustrate concepts</li>
                    <li>Balance difficulty levels for better learning progression</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ContentUploader;
