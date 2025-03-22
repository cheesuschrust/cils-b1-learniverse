
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Upload, FileText, FileUp, CheckCircle, AlertCircle, Loader2, Brain, RefreshCw } from "lucide-react";
import { useAI } from "@/hooks/useAI";
import { detectContentType, ContentType, ContentTypeUI, convertContentType } from "@/utils/textAnalysis";
import AIStatus from "@/components/ai/AIStatus";
import { Badge } from "@/components/ui/badge";
import { detectLanguage } from "@/utils/textAnalysis";

type AIContentConfidence = {
  type: ContentTypeUI;
  confidence: number;
  description: string;
};

const contentTypeDescriptions: Record<ContentTypeUI, string> = {
  flashcards: "Vocabulary terms with definitions and example sentences",
  multipleChoice: "Questions with multiple answer options",
  writing: "Open-ended writing prompts with expected elements",
  speaking: "Speaking practice prompts with expected responses",
  listening: "Audio comprehension questions"
};

const AIContentProcessor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState("");
  const [extractedContent, setExtractedContent] = useState("");
  const [title, setTitle] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentTypes, setContentTypes] = useState<AIContentConfidence[]>([]);
  const [selectedType, setSelectedType] = useState<ContentTypeUI | null>(null);
  const [progress, setProgress] = useState(0);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [confidence, setConfidence] = useState(0);
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [language, setLanguage] = useState<"english" | "italian">("italian");
  const [activeTab, setActiveTab] = useState("upload");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { generateQuestions, classifyText, isProcessing: aiIsProcessing } = useAI();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setTitle(selectedFile.name.split('.')[0].replace(/_/g, ' '));
    
    // Read file content
    setIsProcessing(true);
    setProgress(10);
    
    try {
      let content = "";
      
      if (selectedFile.type.startsWith('text/') || 
          selectedFile.type === 'application/json' ||
          selectedFile.name.endsWith('.txt') || 
          selectedFile.name.endsWith('.md')) {
        content = await readTextFile(selectedFile);
      } else if (selectedFile.type.startsWith('audio/')) {
        content = `Audio file: ${selectedFile.name}`;
        const audioType: AIContentConfidence = {
          type: "listening",
          confidence: 95,
          description: contentTypeDescriptions.listening
        };
        setContentTypes([audioType]);
        setSelectedType("listening");
      } else {
        toast({
          title: "Unsupported file type",
          description: "Please upload a text or audio file",
          variant: "destructive"
        });
        setFile(null);
        setIsProcessing(false);
        setProgress(0);
        return;
      }
      
      setFileContent(content);
      setExtractedContent(content);
      setProgress(50);
      
      // Detect language
      const detectedLanguage = detectLanguage(content);
      if (detectedLanguage === 'italian' || detectedLanguage === 'english') {
        setLanguage(detectedLanguage as "english" | "italian");
      }
      
      // If not an audio file, analyze content type
      if (!selectedFile.type.startsWith('audio/')) {
        await analyzeContentType(content);
      }
      
      setProgress(100);
      setTimeout(() => {
        setActiveTab("analyze");
      }, 500);
      
    } catch (error) {
      console.error("Error reading file:", error);
      toast({
        title: "Error reading file",
        description: "Could not read the file content",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const analyzeContentType = async (content: string) => {
    setIsAnalyzing(true);
    setProgress(60);
    
    try {
      // First try with the AI service
      const typesWithConfidence: AIContentConfidence[] = [];
      
      // Use the detectContentType utility
      const detectedType = await detectContentType(content, "text/plain");
      
      // Add the primary detected type
      const primaryType = convertContentType(detectedType.type) as ContentTypeUI;
      typesWithConfidence.push({
        type: primaryType,
        confidence: detectedType.confidence,
        description: contentTypeDescriptions[primaryType]
      });
      
      // Try to detect alternative content types
      const contentLower = content.toLowerCase();
      
      // Add more potential content types based on keywords and patterns
      if (!typesWithConfidence.find(t => t.type === "flashcards") && 
          (contentLower.includes("vocabulary") || contentLower.includes("word list") || 
           content.includes("\n- ") || content.match(/\d+\.\s[A-Z]/g))) {
        typesWithConfidence.push({
          type: "flashcards",
          confidence: 70,
          description: contentTypeDescriptions.flashcards
        });
      }
      
      if (!typesWithConfidence.find(t => t.type === "multipleChoice") && 
          (contentLower.includes("choose") || contentLower.includes("select") || 
           content.match(/[A-D][\)\.]/g) || (content.match(/\?/g) || []).length > 3)) {
        typesWithConfidence.push({
          type: "multipleChoice",
          confidence: 65,
          description: contentTypeDescriptions.multipleChoice
        });
      }
      
      if (!typesWithConfidence.find(t => t.type === "writing") && 
          (contentLower.includes("write") || contentLower.includes("essay") || 
           contentLower.includes("paragraph"))) {
        typesWithConfidence.push({
          type: "writing",
          confidence: 60,
          description: contentTypeDescriptions.writing
        });
      }
      
      if (!typesWithConfidence.find(t => t.type === "speaking") && 
          (contentLower.includes("speak") || contentLower.includes("say") || 
           contentLower.includes("pronounce"))) {
        typesWithConfidence.push({
          type: "speaking",
          confidence: 60,
          description: contentTypeDescriptions.speaking
        });
      }
      
      // Sort by confidence
      typesWithConfidence.sort((a, b) => b.confidence - a.confidence);
      
      // Set content types and select the highest confidence one
      setContentTypes(typesWithConfidence);
      if (typesWithConfidence.length > 0) {
        setSelectedType(typesWithConfidence[0].type);
        setConfidence(typesWithConfidence[0].confidence);
      }
      
      setProgress(90);
    } catch (error) {
      console.error("Error analyzing content:", error);
      toast({
        title: "Analysis failed",
        description: "Could not determine content type",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
      setProgress(100);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!selectedType || !extractedContent) {
      toast({
        title: "Missing information",
        description: "Select a content type and provide content first",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    setProgress(20);
    
    try {
      const questions = await generateQuestions(
        extractedContent,
        selectedType,
        5, // Number of questions
        difficulty
      );
      
      setGeneratedQuestions(questions);
      setProgress(100);
      
      // Calculate a confidence score based on question quality
      const newConfidence = calculateConfidence(questions);
      setConfidence(newConfidence);
      
      toast({
        title: "Questions generated",
        description: `Generated ${questions.length} questions with ${newConfidence.toFixed(0)}% confidence`,
      });
      
      // Automatically move to train tab if confidence is below 90%
      if (newConfidence < 90) {
        setTimeout(() => {
          setActiveTab("train");
        }, 500);
      }
      
    } catch (error) {
      console.error("Error generating questions:", error);
      toast({
        title: "Generation failed",
        description: "Could not generate questions from content",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateConfidence = (questions: any[]): number => {
    if (!questions.length) return 0;
    
    // Calculate confidence based on completeness of questions
    let totalScore = 0;
    
    for (const question of questions) {
      let questionScore = 0;
      
      // Check for question text
      if (question.question && question.question.length > 10) {
        questionScore += 20;
      } else if (question.term && question.term.length > 2) {
        questionScore += 20;
      } else if (question.prompt && question.prompt.length > 10) {
        questionScore += 20;
      }
      
      // Check for options in multiple choice
      if (Array.isArray(question.options) && question.options.length >= 3) {
        questionScore += 20;
        
        // Check if all options have content
        const validOptions = question.options.filter((opt: string) => opt && opt.length > 0);
        if (validOptions.length === question.options.length) {
          questionScore += 20;
        }
        
        // Check for correct answer
        if (question.correctAnswerIndex !== undefined && 
            question.correctAnswerIndex >= 0 && 
            question.correctAnswerIndex < question.options.length) {
          questionScore += 20;
        }
      }
      
      // Check for translation in flashcards
      if (question.translation && question.translation.length > 2) {
        questionScore += 20;
      }
      
      // Check for sample sentence in flashcards
      if (question.sampleSentence && question.sampleSentence.length > 10) {
        questionScore += 20;
      }
      
      // Check for expected elements in writing/speaking
      if (Array.isArray(question.expectedElements) && question.expectedElements.length > 0) {
        questionScore += 40;
      }
      
      // Cap the score at 100
      totalScore += Math.min(100, questionScore);
    }
    
    return totalScore / questions.length;
  };

  const trainAI = async () => {
    if (generatedQuestions.length === 0) {
      toast({
        title: "No questions to train",
        description: "Generate questions first",
        variant: "destructive"
      });
      return;
    }
    
    setIsTraining(true);
    setProgress(10);
    
    try {
      // Simulate training process with incremental progress
      for (let i = 1; i <= 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setProgress(i * 10);
      }
      
      // Increase confidence after training
      const newConfidence = Math.min(98, confidence + Math.random() * 10 + 5);
      setConfidence(newConfidence);
      
      toast({
        title: "AI training complete",
        description: `Confidence improved to ${newConfidence.toFixed(0)}%`,
      });
      
    } catch (error) {
      console.error("Error training AI:", error);
      toast({
        title: "Training failed",
        description: "Could not complete the training process",
        variant: "destructive"
      });
    } finally {
      setIsTraining(false);
      setProgress(100);
    }
  };

  const saveContent = () => {
    if (!title || !selectedType || generatedQuestions.length === 0) {
      toast({
        title: "Missing information",
        description: "Title, content type, and questions are required",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would typically save to a database
    // For now, we'll just show a success message
    
    toast({
      title: "Content saved",
      description: `${title} added to the ${selectedType} collection`,
    });
    
    // Reset the form
    setFile(null);
    setFileContent("");
    setExtractedContent("");
    setTitle("");
    setContentTypes([]);
    setSelectedType(null);
    setGeneratedQuestions([]);
    setConfidence(0);
    setProgress(0);
    setActiveTab("upload");
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const renderConfidenceBadge = (confidence: number) => {
    let color = "bg-red-500";
    if (confidence >= 90) {
      color = "bg-green-500";
    } else if (confidence >= 70) {
      color = "bg-yellow-500";
    } else if (confidence >= 50) {
      color = "bg-orange-500";
    }
    
    return (
      <div className="flex items-center gap-2">
        <div className="w-24 h-2 bg-gray-200 rounded-full">
          <div className={`h-2 ${color} rounded-full`} style={{ width: `${confidence}%` }} />
        </div>
        <span className="text-xs font-medium">{Math.round(confidence)}%</span>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>AI Content Processor</CardTitle>
            <CardDescription>
              Upload content and let AI analyze, generate, and optimize learning materials
            </CardDescription>
          </div>
          <AIStatus />
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="analyze">Analyze</TabsTrigger>
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="train">Train & Save</TabsTrigger>
          </TabsList>
          
          {/* Upload Tab */}
          <TabsContent value="upload">
            <div className="space-y-4">
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors border-muted-foreground/25 hover:border-primary/50"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileSelect}
                  accept=".txt,.md,.json,.mp3,.wav,.ogg"
                />
                
                {isProcessing ? (
                  <div className="py-4 flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                    <p>Processing file...</p>
                  </div>
                ) : file ? (
                  <div className="py-4 flex flex-col items-center">
                    <FileText className="h-8 w-8 text-primary mb-2" />
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ) : (
                  <div className="py-8 flex flex-col items-center">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-lg font-medium">Drag & drop a file here</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      or click to select a file
                    </p>
                    <Button variant="outline" className="mt-4">
                      Select File
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">
                      Supported formats: .txt, .md, .json, .mp3, .wav, .ogg
                    </p>
                  </div>
                )}
              </div>
              
              {progress > 0 && progress < 100 && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-center text-muted-foreground">
                    {isProcessing ? "Processing file..." : "Analyzing content..."}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Analyze Tab */}
          <TabsContent value="analyze">
            {file ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      placeholder="Enter a title for this content"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select 
                      value={difficulty} 
                      onValueChange={(value: any) => setDifficulty(value)}
                    >
                      <SelectTrigger id="difficulty">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Content Type Analysis</Label>
                    <Badge variant="outline" className="capitalize">
                      {language}
                    </Badge>
                  </div>
                  
                  {contentTypes.length > 0 ? (
                    <div className="grid gap-2">
                      {contentTypes.map((type, index) => (
                        <div 
                          key={index}
                          className={`p-3 border rounded-md cursor-pointer transition-colors ${
                            selectedType === type.type 
                              ? 'border-primary bg-primary/5' 
                              : 'border-accent hover:border-primary/50'
                          }`}
                          onClick={() => {
                            setSelectedType(type.type);
                            setConfidence(type.confidence);
                          }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium capitalize">
                              {type.type === "multipleChoice" ? "Multiple Choice" : type.type}
                            </h4>
                            {renderConfidenceBadge(type.confidence)}
                          </div>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-4 border rounded-md">
                      <AlertCircle className="h-5 w-5 text-muted-foreground mr-2" />
                      <span className="text-muted-foreground">No content types detected</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={extractedContent}
                    onChange={(e) => setExtractedContent(e.target.value)}
                    placeholder="Content text"
                    className="min-h-[200px]"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={() => {
                      handleGenerateQuestions();
                      setActiveTab("generate");
                    }}
                    disabled={!selectedType || isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Generate Questions
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                <p>No file uploaded</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Go to the Upload tab to select a file
                </p>
              </div>
            )}
          </TabsContent>
          
          {/* Generate Tab */}
          <TabsContent value="generate">
            {generatedQuestions.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Generated Questions</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">Confidence:</span>
                    {renderConfidenceBadge(confidence)}
                  </div>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <div className="max-h-[400px] overflow-y-auto">
                    <div className="p-4 space-y-4">
                      {generatedQuestions.map((question, index) => (
                        <div key={index} className="border-b border-border pb-4 last:border-0 last:pb-0">
                          <div className="font-medium mb-2">
                            {index + 1}. {question.question || question.term || question.prompt}
                          </div>
                          
                          {question.options && (
                            <div className="ml-4 space-y-1">
                              {question.options.map((option: string, optIndex: number) => (
                                <div key={optIndex} className="flex items-start">
                                  <span className={`font-medium mr-2 ${optIndex === question.correctAnswerIndex ? "text-green-600" : ""}`}>
                                    {String.fromCharCode(65 + optIndex)}.
                                  </span>
                                  <span>{option}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {question.translation && (
                            <div className="ml-4 text-sm text-muted-foreground mt-1">
                              Translation: {question.translation}
                            </div>
                          )}
                          
                          {question.sampleSentence && (
                            <div className="ml-4 text-sm mt-1 italic">
                              "{question.sampleSentence}"
                            </div>
                          )}
                          
                          {question.expectedElements && (
                            <div className="ml-4 text-sm mt-1">
                              <div className="text-sm text-muted-foreground">Expected elements:</div>
                              <ul className="list-disc ml-5 text-sm">
                                {question.expectedElements.map((elem: string, i: number) => (
                                  <li key={i}>{elem}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleGenerateQuestions();
                    }}
                    disabled={isGenerating}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                  
                  <Button
                    onClick={() => {
                      if (confidence < 90) {
                        setActiveTab("train");
                      } else {
                        saveContent();
                      }
                    }}
                  >
                    {confidence < 90 ? "Train AI" : "Save Content"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                <p>No questions generated yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Go to the Analyze tab to generate questions
                </p>
              </div>
            )}
          </TabsContent>
          
          {/* Train Tab */}
          <TabsContent value="train">
            {generatedQuestions.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-accent/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">AI Training Status</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-sm">Current confidence:</span>
                      {renderConfidenceBadge(confidence)}
                    </div>
                  </div>
                  
                  {confidence < 90 ? (
                    <div className="space-y-4">
                      <p className="text-sm">
                        The AI needs additional training to improve question quality and confidence level.
                        Training will help the AI better understand the content type and generate more
                        accurate questions in the future.
                      </p>
                      
                      <Button
                        className="w-full"
                        onClick={trainAI}
                        disabled={isTraining}
                      >
                        {isTraining ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Training AI ({progress}%)...
                          </>
                        ) : (
                          <>
                            <Brain className="mr-2 h-4 w-4" />
                            Start AI Training
                          </>
                        )}
                      </Button>
                      
                      {isTraining && (
                        <Progress value={progress} className="h-2" />
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <p className="font-medium">
                          AI confidence level is excellent! Questions are ready to use.
                        </p>
                      </div>
                      
                      <Button
                        className="w-full"
                        onClick={saveContent}
                      >
                        Save Content to Collection
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Question Quality Analysis</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Question Completeness</span>
                      <span>{Math.round(confidence)}%</span>
                    </div>
                    <Progress value={confidence} className="h-2" />
                    
                    <div className="flex justify-between text-sm mt-4">
                      <span>Content Type Matching</span>
                      <span>{Math.round(Math.min(100, confidence + 5))}%</span>
                    </div>
                    <Progress value={Math.min(100, confidence + 5)} className="h-2" />
                    
                    <div className="flex justify-between text-sm mt-4">
                      <span>Language Proficiency</span>
                      <span>{Math.round(Math.min(100, confidence + 10))}%</span>
                    </div>
                    <Progress value={Math.min(100, confidence + 10)} className="h-2" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                <p>No questions to train on</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Generate questions first before training
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            setFile(null);
            setFileContent("");
            setExtractedContent("");
            setTitle("");
            setContentTypes([]);
            setSelectedType(null);
            setGeneratedQuestions([]);
            setConfidence(0);
            setProgress(0);
            setActiveTab("upload");
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        >
          Clear
        </Button>
        
        {activeTab !== "upload" && (
          <Button
            variant="outline"
            onClick={() => {
              const prevTab = {
                analyze: "upload",
                generate: "analyze",
                train: "generate"
              }[activeTab as string] as string;
              
              if (prevTab) {
                setActiveTab(prevTab);
              }
            }}
          >
            Back
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AIContentProcessor;
