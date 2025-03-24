
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useFileProcessor } from '@/hooks/useFileProcessor';
import { useAI } from '@/hooks/useAI';
import { FileText, Upload, AlertCircle, CheckCircle, FileUp, Info, FileQuestion, RefreshCcw } from 'lucide-react';
import DropzoneUploader from '@/components/content/DropzoneUploader';

// Mock data for content analysis
const ContentAnalysisSection = ({ 
  fileContentType, 
  contentConfidence, 
  language, 
  analysisComplete
}: { 
  fileContentType: string | null; 
  contentConfidence: number;
  language: string;
  analysisComplete: boolean;
}) => {
  if (!fileContentType || !analysisComplete) return null;
  
  const getConfidenceLevel = (score: number) => {
    if (score >= 85) return "Very High";
    if (score >= 70) return "High";
    if (score >= 55) return "Moderate";
    if (score >= 40) return "Low";
    return "Very Low";
  };
  
  const ContentTypeDetails = {
    'flashcards': {
      title: 'Vocabulary Flashcards',
      description: 'This content is ideal for creating vocabulary flashcards with term-definition pairs.',
      estimatedCards: Math.floor(Math.random() * 15) + 5,
      features: ['Italian-English pairs', 'Sample sentences', 'Pronunciation guides']
    },
    'multipleChoice': {
      title: 'Multiple Choice Questions',
      description: 'This content is suitable for creating quiz questions with multiple answer options.',
      estimatedQuestions: Math.floor(Math.random() * 10) + 3,
      features: ['Question stem', '4 answer options', 'Answer explanation']
    },
    'listening': {
      title: 'Listening Comprehension',
      description: 'This audio content can be used for listening comprehension exercises.',
      estimatedLength: Math.floor(Math.random() * 5) + 1,
      features: ['Native speaker audio', 'Comprehension questions', 'Transcripts']
    },
    'writing': {
      title: 'Writing Exercises',
      description: 'This content is appropriate for writing practice and composition.',
      estimatedPrompts: Math.floor(Math.random() * 5) + 2,
      features: ['Writing prompts', 'Sample responses', 'Evaluation criteria']
    },
    'speaking': {
      title: 'Speaking Practice',
      description: 'This content is designed for oral language practice.',
      estimatedDialogues: Math.floor(Math.random() * 5) + 2,
      features: ['Conversation scenarios', 'Pronunciation guidance', 'Speaking prompts']
    }
  };
  
  const typeInfo = ContentTypeDetails[fileContentType as keyof typeof ContentTypeDetails];
  
  return (
    <div className="mt-6 space-y-4">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Content Analysis Complete</AlertTitle>
        <AlertDescription>
          The AI has analyzed your content and determined the best format for learning materials.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Content Insights</CardTitle>
            <Badge variant={contentConfidence > 70 ? "default" : "secondary"}>
              {getConfidenceLevel(contentConfidence)} Confidence
            </Badge>
          </div>
          <CardDescription>
            AI-powered analysis of your uploaded content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div>
                <h3 className="font-medium">Content Type</h3>
                <p className="text-sm">{typeInfo.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{typeInfo.description}</p>
              </div>
              
              <div>
                <h3 className="font-medium">Language</h3>
                <p className="text-sm capitalize">{language}</p>
              </div>
              
              <div>
                <h3 className="font-medium">Confidence Score</h3>
                <div className="flex items-center gap-2">
                  <Progress value={contentConfidence} className="h-2 flex-1" />
                  <span className="text-sm font-medium">{contentConfidence.toFixed(1)}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  How confident the AI is about the content type classification
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="font-medium">Estimated Content Generated</h3>
                {fileContentType === 'flashcards' && (
                  <p className="text-sm">{typeInfo.estimatedCards} vocabulary cards</p>
                )}
                {fileContentType === 'multipleChoice' && (
                  <p className="text-sm">{typeInfo.estimatedQuestions} questions</p>
                )}
                {fileContentType === 'listening' && (
                  <p className="text-sm">{typeInfo.estimatedLength} minute{typeInfo.estimatedLength !== 1 ? 's' : ''} of audio</p>
                )}
                {fileContentType === 'writing' && (
                  <p className="text-sm">{typeInfo.estimatedPrompts} writing prompts</p>
                )}
                {fileContentType === 'speaking' && (
                  <p className="text-sm">{typeInfo.estimatedDialogues} speaking scenarios</p>
                )}
              </div>
              
              <div>
                <h3 className="font-medium">Features</h3>
                <ul className="text-sm mt-1 space-y-1">
                  {typeInfo.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="training-insights">
              <AccordionTrigger>AI Training Insights</AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p className="text-sm">
                  The AI model has analyzed your content and will use it to generate similar materials.
                  Here's how your content will impact the AI's learning:
                </p>
                
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Content Similarity</h4>
                      <span className="text-xs font-medium">{(contentConfidence * 0.9).toFixed(1)}%</span>
                    </div>
                    <Progress value={contentConfidence * 0.9} className="h-1.5" />
                    <p className="text-xs text-muted-foreground mt-1">
                      How similar newly generated content will be to your sample
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Language Style Match</h4>
                      <span className="text-xs font-medium">{(contentConfidence * 0.85).toFixed(1)}%</span>
                    </div>
                    <Progress value={contentConfidence * 0.85} className="h-1.5" />
                    <p className="text-xs text-muted-foreground mt-1">
                      How well the AI will match your content's language style and difficulty
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Content Structure</h4>
                      <span className="text-xs font-medium">{(contentConfidence * 0.95).toFixed(1)}%</span>
                    </div>
                    <Progress value={contentConfidence * 0.95} className="h-1.5" />
                    <p className="text-xs text-muted-foreground mt-1">
                      How accurately the AI will reproduce the structure and format of your content
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Generate More Similar Content
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const FileUploader = () => {
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const { toast } = useToast();
  const { isProcessing: aiIsProcessing } = useAI();
  
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
  
  const handleFileDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    await processFile(acceptedFiles[0]);
    
    // Simulate analysis completion after file processing
    setTimeout(() => {
      setAnalysisComplete(true);
      toast({
        title: "Analysis Complete",
        description: "Content has been analyzed and processed successfully.",
      });
    }, 1500);
  };
  
  const handleReset = () => {
    resetState();
    setAnalysisComplete(false);
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Content Uploader</h1>
          <p className="text-muted-foreground">Upload learning materials and let AI analyze and process them</p>
        </div>
      </div>
      
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="upload" className="flex items-center gap-1">
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Upload History</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-1">
            <Info className="h-4 w-4" />
            <span>AI Insights</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
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
            </CardContent>
          </Card>
          
          <ContentAnalysisSection 
            fileContentType={fileContentType} 
            contentConfidence={contentConfidence}
            language={language}
            analysisComplete={analysisComplete}
          />
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Upload History</CardTitle>
              <CardDescription>
                Recently uploaded content and processing results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="p-4">
                  <div className="flex items-center justify-center h-32">
                    <div className="flex flex-col items-center text-muted-foreground">
                      <FileQuestion className="h-10 w-10 mb-2" />
                      <p>No upload history available</p>
                      <p className="text-sm">Previously uploaded files will appear here</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>AI Insights Dashboard</CardTitle>
              <CardDescription>
                View AI model training progress and content analysis metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="p-4">
                  <div className="flex items-center justify-center h-32">
                    <div className="flex flex-col items-center text-muted-foreground">
                      <Info className="h-10 w-10 mb-2" />
                      <p>No AI insights available yet</p>
                      <p className="text-sm">Upload content to train the AI model</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FileUploader;
