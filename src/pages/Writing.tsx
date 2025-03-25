import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet-async';
import ConfidenceIndicator from '@/components/ai/ConfidenceIndicator';
import { Timer, Check, X, Brain, RotateCcw, BookOpen, Save, ArrowUpRight, Languages } from 'lucide-react';
import { useAI } from '@/hooks/useAI';

const Writing = () => {
  const [activeTab, setActiveTab] = useState('editor');
  const [inputText, setInputText] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [processingTime, setProcessingTime] = useState<number>(0);
  const [lastAnalyzedAt, setLastAnalyzedAt] = useState<Date | null>(null);
  
  const { toast } = useToast();
  const { classifyText, isProcessing, generateText } = useAI();
  
  // Analyze the text using AI
  const handleAnalyzeText = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty Text",
        description: "Please provide text to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    const startTime = performance.now();
    
    try {
      const results = await classifyText(inputText);
      setAnalysisResults(results);
      
      const endTime = performance.now();
      setProcessingTime(endTime - startTime);
      setLastAnalyzedAt(new Date());
      
      toast({
        title: "Analysis Complete",
        description: `Text analysis completed in ${processingTime.toFixed(2)}ms.`,
      });
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Generate AI feedback
  const handleGenerateFeedback = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty Text",
        description: "Please provide text to generate feedback.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const prompt = `Provide feedback on the following Italian text: "${inputText}". Focus on grammar, vocabulary, and style.`;
      const feedback = await generateText(prompt);
      setAiFeedback(feedback);
      
      toast({
        title: "Feedback Generated",
        description: "AI-generated feedback has been added.",
      });
    } catch (error: any) {
      toast({
        title: "Feedback Generation Failed",
        description: error.message || "Failed to generate feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Clear the input text and analysis results
  const handleClearText = () => {
    setInputText('');
    setAnalysisResults(null);
    setAiFeedback('');
    setProcessingTime(0);
    setLastAnalyzedAt(null);
  };
  
  return (
    <div className="container mx-auto py-6 px-4">
      <Helmet>
        <title>Writing Practice - Italian Learning</title>
      </Helmet>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Writing Practice</h1>
        <p className="text-muted-foreground mt-1">
          Improve your Italian writing skills with AI-powered analysis and feedback.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="editor" className="flex-1">Editor</TabsTrigger>
          <TabsTrigger value="analysis" className="flex-1">Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Write in Italian</CardTitle>
              <CardDescription>
                Start writing your text below. Use the analysis tab to get feedback.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Start writing your Italian text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={8}
              />
              
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={handleClearText}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear Text
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleGenerateFeedback}
                    disabled={isAnalyzing}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Generate AI Feedback
                  </Button>
                  <Button
                    onClick={handleAnalyzeText}
                    disabled={isAnalyzing}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Analyze Text
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Text Analysis Results</CardTitle>
              <CardDescription>
                Get AI-powered feedback on your writing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysisResults ? (
                <>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Content Type</h3>
                    <ConfidenceIndicator score={analysisResults[0].score} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Detected Content Type:
                      </span>
                      <Badge variant="secondary">
                        {analysisResults[0].label}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Processing Time:
                      </span>
                      <span className="font-medium">
                        {processingTime.toFixed(2)}ms
                      </span>
                    </div>
                    
                    {lastAnalyzedAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Last Analyzed:
                        </span>
                        <span className="font-medium">
                          {lastAnalyzedAt.toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">AI Feedback</h3>
                    {aiFeedback ? (
                      <Textarea
                        value={aiFeedback}
                        readOnly
                        rows={5}
                        className="bg-muted/40"
                      />
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No AI feedback generated yet. Click "Generate AI Feedback" to get suggestions.
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <h3 className="text-lg font-medium mb-2">No analysis performed yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Write some text in the editor tab and click "Analyze Text" to get started.
                  </p>
                  <Languages className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                  <Button onClick={handleAnalyzeText}>
                    <Check className="h-4 w-4 mr-2" />
                    Analyze Text
                  </Button>
                </div>
              )}
            </CardContent>
            
            {analysisResults && (
              <CardFooter>
                <Button variant="secondary" className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Analysis Report
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Writing;
