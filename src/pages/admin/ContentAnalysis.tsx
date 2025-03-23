
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AIContentProcessor from '@/components/ai/AIContentProcessor';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useFileProcessor } from '@/hooks/useFileProcessor';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, FileText, Upload, CheckCircle } from 'lucide-react';
import { useSystemLog } from '@/hooks/use-system-log';

const ContentAnalysis = () => {
  const { logSystemAction } = useSystemLog();
  const [activeTab, setActiveTab] = useState('upload');
  const [processingStatus, setProcessingStatus] = useState({
    inProgress: false,
    stage: '',
    progress: 0,
    errorMessage: '',
    success: false,
    questionsGenerated: 0
  });
  
  useEffect(() => {
    logSystemAction('Viewed AI Content Analysis page');
  }, [logSystemAction]);
  
  return (
    <div className="container mx-auto py-6 px-4">
      <Helmet>
        <title>AI Content Analysis | Admin</title>
      </Helmet>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">AI Content Analysis</h1>
        <p className="text-muted-foreground mt-2">
          Upload and analyze content to automatically generate learning materials
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Content
          </TabsTrigger>
          <TabsTrigger value="process" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Process Results
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Generated Questions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Content for Analysis</CardTitle>
              <CardDescription>
                Upload text, PDF, or audio files to be analyzed by our AI system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIContentProcessor 
                onProcessingStart={() => {
                  setProcessingStatus({
                    ...processingStatus,
                    inProgress: true,
                    errorMessage: '',
                    success: false
                  });
                }}
                onProcessingComplete={(results) => {
                  setProcessingStatus({
                    inProgress: false,
                    stage: 'Complete',
                    progress: 100,
                    errorMessage: '',
                    success: true,
                    questionsGenerated: results?.questionsGenerated || 0
                  });
                  setActiveTab('process');
                }}
                onProcessingError={(message) => {
                  setProcessingStatus({
                    ...processingStatus,
                    inProgress: false,
                    errorMessage: message,
                    success: false
                  });
                }}
                onProgress={(stage, progress) => {
                  setProcessingStatus({
                    ...processingStatus,
                    stage,
                    progress
                  });
                }}
              />
              
              {processingStatus.inProgress && (
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">{processingStatus.stage || 'Processing'}</p>
                    <span className="text-sm text-muted-foreground">{processingStatus.progress}%</span>
                  </div>
                  <Progress value={processingStatus.progress} className="h-2" />
                </div>
              )}
              
              {processingStatus.errorMessage && (
                <Alert variant="destructive" className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {processingStatus.errorMessage}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="process">
          <Card>
            <CardHeader>
              <CardTitle>Processing Results</CardTitle>
              <CardDescription>
                View the analysis results and categorized content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {processingStatus.success ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <p className="font-medium">Processing complete!</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Content Type</h3>
                      <p>Italian vocabulary and examples</p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Confidence Score</h3>
                      <p>92% confidence</p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Questions Generated</h3>
                      <p>{processingStatus.questionsGenerated} questions</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button 
                      className="text-primary hover:underline flex items-center gap-1"
                      onClick={() => setActiveTab('questions')}
                    >
                      <CheckCircle className="h-4 w-4" />
                      View Generated Questions
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <p>No processing results available yet. Please upload and process content first.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle>Generated Questions</CardTitle>
              <CardDescription>
                Review and edit the automatically generated questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {processingStatus.success ? (
                <div className="space-y-6">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Multiple Choice Questions</h3>
                    <div className="space-y-4">
                      <div className="border p-4 rounded-lg bg-background">
                        <p className="font-medium">Quale è il significato di "la portata"?</p>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                            <p>Range, reach, scope</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border"></div>
                            <p>The door</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border"></div>
                            <p>The importance</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border"></div>
                            <p>The course</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border p-4 rounded-lg bg-background">
                        <p className="font-medium">Cosa significa "diventare"?</p>
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                            <p>To become</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border"></div>
                            <p>To go</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border"></div>
                            <p>To prevent</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border"></div>
                            <p>To have</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Speaking Practice</h3>
                    <div className="space-y-4">
                      <div className="border p-4 rounded-lg bg-background">
                        <p className="font-medium">Come ti presenteresti in italiano ad un nuovo amico?</p>
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">Expected elements in response:</p>
                          <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                            <li>Saluto (Ciao, Buongiorno)</li>
                            <li>Nome e cognome</li>
                            <li>Età o provenienza</li>
                            <li>Hobby o professione</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <p>No questions have been generated yet. Please upload and process content first.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentAnalysis;
