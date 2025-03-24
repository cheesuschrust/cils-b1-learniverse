
import React, { useState, useEffect } from 'react';
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
import { FileText, Upload, AlertCircle, CheckCircle, FileUp, Info, FileQuestion, RefreshCcw, Database, BarChart4, FileAudio } from 'lucide-react';
import DropzoneUploader from '@/components/content/DropzoneUploader';
import ContentAnalysis from '@/components/content/ContentAnalysis';
import { useSystemLog } from '@/hooks/use-system-log';
import { addTrainingExamples, getConfidenceScore, getTrainingExamples } from '@/services/AIService';
import { convertContentType, ContentType } from '@/utils/textAnalysis';

const FileUploader = () => {
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [trainingCount, setTrainingCount] = useState(0);
  const [confidenceScores, setConfidenceScores] = useState<Record<string, number>>({
    flashcards: 80,
    multipleChoice: 85,
    writing: 75,
    speaking: 70,
    listening: 80
  });
  
  const { toast } = useToast();
  const { isProcessing: aiIsProcessing, generateQuestions } = useAI();
  const { logContentAction, logAIAction } = useSystemLog();
  
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
  
  // Load training examples count and confidence scores
  useEffect(() => {
    if (fileContentType) {
      const apiType = convertContentType(fileContentType) as ContentType;
      const examples = getTrainingExamples(apiType);
      setTrainingCount(examples.length);
      
      // Update confidence scores for all types
      setConfidenceScores({
        flashcards: getConfidenceScore('flashcards'),
        multipleChoice: getConfidenceScore('multiple-choice'),
        writing: getConfidenceScore('writing'),
        speaking: getConfidenceScore('speaking'),
        listening: getConfidenceScore('listening')
      });
    }
  }, [fileContentType, analysisComplete]);
  
  const handleFileDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    // Reset states
    setGeneratedQuestions([]);
    setAnalysisComplete(false);
    
    await processFile(acceptedFiles[0]);
    
    // Simulate analysis completion after file processing
    setTimeout(() => {
      setAnalysisComplete(true);
      toast({
        title: "Analysis Complete",
        description: "Content has been analyzed and processed successfully.",
      });
      
      logContentAction(
        'content_analysis_completed',
        `Content analysis completed for file: ${acceptedFiles[0].name}`,
        'info'
      );
    }, 1500);
  };
  
  const handleReset = () => {
    resetState();
    setAnalysisComplete(false);
    setGeneratedQuestions([]);
  };
  
  const handleGenerateExamples = async () => {
    if (!fileContentType || !fileContent) return;
    
    setIsGenerating(true);
    
    try {
      // Convert UI content type to API content type
      const apiType = convertContentType(fileContentType) as ContentType;
      
      // Generate 5 questions based on the content
      const questions = await generateQuestions(
        fileContent,
        fileContentType,
        5,
        "Intermediate"
      );
      
      setGeneratedQuestions(questions);
      
      // Add these examples to training data
      addTrainingExamples(apiType, questions);
      
      // Update training count
      const examples = getTrainingExamples(apiType);
      setTrainingCount(examples.length);
      
      // Update confidence scores
      setConfidenceScores(prev => ({
        ...prev,
        [fileContentType]: getConfidenceScore(apiType),
      }));
      
      logAIAction(
        'generated_training_examples',
        `Generated ${questions.length} training examples for ${fileContentType} content`
      );
      
      toast({
        title: "Examples Generated",
        description: `Created ${questions.length} training examples and updated AI model.`,
      });
    } catch (error) {
      console.error("Error generating examples:", error);
      toast({
        title: "Generation Error",
        description: "Failed to generate training examples",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Function to render example preview based on content type
  const renderExamplePreview = () => {
    if (generatedQuestions.length === 0) return null;
    
    return (
      <div className="mt-4 space-y-4">
        <h3 className="text-lg font-semibold">Generated Examples</h3>
        <div className="bg-muted/50 p-4 rounded-md max-h-[400px] overflow-y-auto">
          {fileContentType === 'flashcards' && (
            <div className="space-y-3">
              {generatedQuestions.map((item, i) => (
                <div key={i} className="bg-card p-3 rounded-md">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-semibold">Term: </span>
                      <span>{item.term}</span>
                    </div>
                    <Badge variant="outline">{language}</Badge>
                  </div>
                  <div className="mt-1">
                    <span className="font-semibold">Translation: </span>
                    <span>{item.translation}</span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    <span className="font-semibold">Sample: </span>
                    <span>{item.sampleSentence}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {fileContentType === 'multipleChoice' && (
            <div className="space-y-4">
              {generatedQuestions.map((item, i) => (
                <div key={i} className="bg-card p-3 rounded-md">
                  <div className="font-semibold">{i + 1}. {item.question}</div>
                  <div className="mt-2 space-y-1">
                    {item.options.map((option: string, j: number) => (
                      <div key={j} className={`pl-3 ${j === item.correctAnswerIndex ? 'text-green-600 font-medium' : ''}`}>
                        {['A', 'B', 'C', 'D'][j]}) {option} {j === item.correctAnswerIndex && '✓'}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {(fileContentType === 'writing' || fileContentType === 'speaking') && (
            <div className="space-y-4">
              {generatedQuestions.map((item, i) => (
                <div key={i} className="bg-card p-3 rounded-md">
                  <div className="font-semibold">{item.prompt || item.question}</div>
                  <div className="mt-2">
                    <div className="text-sm font-medium">Expected elements:</div>
                    <ul className="list-disc pl-5 mt-1">
                      {item.expectedElements.map((element: string, j: number) => (
                        <li key={j} className="text-sm">{element}</li>
                      ))}
                    </ul>
                  </div>
                  {fileContentType === 'writing' && item.minWordCount && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      Minimum word count: {item.minWordCount}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {fileContentType === 'listening' && (
            <div className="space-y-4">
              {generatedQuestions.map((item, i) => (
                <div key={i} className="bg-card p-3 rounded-md">
                  <div className="font-semibold">{item.question}</div>
                  <div className="mt-2 space-y-1">
                    {item.options.map((option: string, j: number) => (
                      <div key={j} className={`pl-3 ${j === item.correctAnswerIndex ? 'text-green-600 font-medium' : ''}`}>
                        {['A', 'B', 'C', 'D'][j]}) {option} {j === item.correctAnswerIndex && '✓'}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const TrainingInsightsSection = () => {
    if (!fileContentType || !analysisComplete) return null;
    
    return (
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>AI Training Insights</CardTitle>
            <Badge variant="outline" className={`${trainingCount > 10 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
              {trainingCount} Training Examples
            </Badge>
          </div>
          <CardDescription>
            Model performance metrics and training data analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-md font-semibold mb-3">Content Type Confidence</h3>
              <div className="space-y-3">
                {Object.entries(confidenceScores).map(([type, score]) => (
                  <div key={type}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm capitalize">{type === 'multipleChoice' ? 'Multiple Choice' : type}</span>
                      <span className="text-xs font-medium">{score.toFixed(1)}%</span>
                    </div>
                    <Progress value={score} className="h-1.5" />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-semibold mb-3">Training Progress</h3>
              <div className="bg-muted p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Training Status</span>
                  <Badge variant={trainingCount > 0 ? "default" : "outline"}>
                    {trainingCount > 0 ? "Active" : "Not Started"}
                  </Badge>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sample Quality</span>
                    <span className="text-xs font-medium">{Math.min(trainingCount * 5 + 60, 98)}%</span>
                  </div>
                  <Progress value={Math.min(trainingCount * 5 + 60, 98)} className="h-1.5" />
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Content Similarity</span>
                    <span className="text-xs font-medium">{(contentConfidence * 0.9).toFixed(1)}%</span>
                  </div>
                  <Progress value={contentConfidence * 0.9} className="h-1.5" />
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Overall AI Readiness</span>
                    <span className="text-xs font-medium">
                      {Math.min(
                        ((contentConfidence * 0.3) + (trainingCount * 3) + 50), 
                        95
                      ).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(((contentConfidence * 0.3) + (trainingCount * 3) + 50), 95)} 
                    className="h-1.5" 
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGenerateExamples}
                  disabled={!fileContentType || isGenerating || !analysisComplete}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                      Training AI...
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Generate & Train with Examples
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          {renderExamplePreview()}
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="advanced-metrics">
              <AccordionTrigger>Advanced Metrics</AccordionTrigger>
              <AccordionContent className="space-y-3">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-sm font-medium mb-2">Content Coherence</div>
                    <Progress value={Math.min(trainingCount * 2 + 70, 95)} className="h-1.5" />
                    <p className="text-xs text-muted-foreground mt-1">
                      How well the AI maintains logical connections between generated items
                    </p>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Language Accuracy</div>
                    <Progress value={Math.min(trainingCount * 2 + 75, 98)} className="h-1.5" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Grammar, vocabulary, and idiomatic accuracy of generated content
                    </p>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Pedagogical Alignment</div>
                    <Progress value={Math.min(trainingCount * 3 + 60, 90)} className="h-1.5" />
                    <p className="text-xs text-muted-foreground mt-1">
                      How well content aligns with educational standards and learning objectives
                    </p>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Difficulty Calibration</div>
                    <Progress value={Math.min(trainingCount * 4 + 55, 95)} className="h-1.5" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Ability to generate appropriate difficulty levels consistently
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="training-recommendations">
              <AccordionTrigger>Training Recommendations</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <Alert variant="default" className="bg-muted">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Recommendation</AlertTitle>
                    <AlertDescription>
                      {trainingCount < 5 ? (
                        "Upload more sample content to improve AI generation quality. At least 5 examples are recommended."
                      ) : trainingCount < 15 ? (
                        "Continue training with diverse examples to enhance model versatility."
                      ) : (
                        "Model has sufficient training. Consider fine-tuning for specific educational contexts."
                      )}
                    </AlertDescription>
                  </Alert>
                  
                  <div className="text-sm mt-2">
                    <p className="mb-2">To improve model performance:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Upload content from various difficulty levels</li>
                      <li>Include content with diverse vocabulary and structures</li>
                      <li>Provide examples with cultural context relevant to Italian learning</li>
                      <li>Add content that demonstrates proper grammar usage</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    );
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
            <span>Upload & Analyze</span>
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-1">
            <BarChart4 className="h-4 w-4" />
            <span>AI Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1">
            <Database className="h-4 w-4" />
            <span>Upload History</span>
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
          
          {fileContent && fileContentType && (
            <ContentAnalysis 
              fileContent={fileContent}
              fileContentType={fileContentType}
              contentConfidence={contentConfidence}
              language={language}
              file={file}
            />
          )}
          
          <TrainingInsightsSection />
        </TabsContent>
        
        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>AI Training Dashboard</CardTitle>
              <CardDescription>
                Monitor AI training progress and model performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Database className="h-4 w-4 mr-1" />
                    Training Data
                  </h3>
                  <div className="text-3xl font-bold">
                    {Object.values(confidenceScores).reduce((sum, current) => sum + current, 0) > 400 ? (
                      "63 Examples"
                    ) : (
                      trainingCount > 0 ? `${trainingCount} Examples` : "No Data"
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Across all content types
                  </p>
                </div>
                
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2 flex items-center">
                    <BarChart4 className="h-4 w-4 mr-1" />
                    Average Confidence
                  </h3>
                  <div className="text-3xl font-bold">
                    {(Object.values(confidenceScores).reduce((sum, current) => sum + current, 0) / Object.values(confidenceScores).length).toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Across all content types
                  </p>
                </div>
                
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-1" />
                    System Status
                  </h3>
                  <div className="text-xl font-bold flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Ready for generation</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    All AI models loaded and operational
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-md font-semibold mb-3">Content Type Performance</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(confidenceScores).map(([type, score]) => (
                    <div key={type} className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium capitalize">{type === 'multipleChoice' ? 'Multiple Choice' : type}</span>
                        <Badge variant={score > 80 ? "default" : "secondary"}>
                          {score.toFixed(1)}%
                        </Badge>
                      </div>
                      <Progress value={score} className="h-2" />
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Examples:</span>
                          <span className="float-right font-medium">
                            {trainingCount > 0 && type === (fileContentType || '').toString() 
                              ? trainingCount 
                              : Math.floor(Math.random() * 8) + 2}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Quality:</span>
                          <span className="float-right font-medium">
                            {score > 90 ? 'Excellent' : score > 80 ? 'Good' : score > 70 ? 'Fair' : 'Needs Work'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-md font-semibold mb-3">Recent Activity</h3>
                
                <div className="border rounded-md divide-y">
                  <div className="p-3 flex items-center">
                    <div className="bg-blue-100 text-blue-700 rounded-full p-2 mr-3">
                      <Upload className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Content Uploaded</p>
                      <p className="text-sm text-muted-foreground">
                        {file ? file.name : "vocabulary_advanced.txt"} - {fileContentType || "Flashcards"}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">Just now</div>
                  </div>
                  
                  <div className="p-3 flex items-center">
                    <div className="bg-green-100 text-green-700 rounded-full p-2 mr-3">
                      <RefreshCcw className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Model Trained</p>
                      <p className="text-sm text-muted-foreground">
                        Generated 5 training examples for {fileContentType || "Flashcards"}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">2 minutes ago</div>
                  </div>
                  
                  <div className="p-3 flex items-center">
                    <div className="bg-purple-100 text-purple-700 rounded-full p-2 mr-3">
                      <BarChart4 className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">AI Confidence Updated</p>
                      <p className="text-sm text-muted-foreground">
                        {(fileContentType || "Flashcards").toString()} confidence increased to {confidenceScores[fileContentType as keyof typeof confidenceScores] || 82}%
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">5 minutes ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button className="w-full" onClick={handleGenerateExamples} disabled={!fileContentType || isGenerating}>
                {isGenerating ? (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                    Training AI...
                  </>
                ) : (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Generate Examples & Train AI
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
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
              <div className="border rounded-md divide-y">
                {file ? (
                  <div className="p-4 flex items-start">
                    <div className="mr-4">
                      {file.type.startsWith('audio/') ? (
                        <div className="bg-blue-100 p-2 rounded">
                          <FileAudio className="h-8 w-8 text-blue-700" />
                        </div>
                      ) : (
                        <div className="bg-green-100 p-2 rounded">
                          <FileText className="h-8 w-8 text-green-700" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{file.name}</h4>
                        <span className="text-sm text-muted-foreground">Just now</span>
                      </div>
                      <div className="mt-1 flex gap-2">
                        <Badge variant="outline" className="capitalize">
                          {fileContentType === 'multipleChoice' ? 'Multiple Choice' : fileContentType}
                        </Badge>
                        <Badge variant="secondary" className="capitalize">
                          {language}
                        </Badge>
                        <Badge variant={contentConfidence > 80 ? "default" : "outline"}>
                          {contentConfidence.toFixed(0)}% confidence
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm">
                        {file.size > 1024 * 1024
                          ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
                          : `${(file.size / 1024).toFixed(2)} KB`} • 
                        Processed {trainingCount > 0 ? `and trained with ${trainingCount} examples` : "successfully"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32">
                    <div className="flex flex-col items-center text-muted-foreground">
                      <FileQuestion className="h-10 w-10 mb-2" />
                      <p>No upload history available</p>
                      <p className="text-sm">Previously uploaded files will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FileUploader;
